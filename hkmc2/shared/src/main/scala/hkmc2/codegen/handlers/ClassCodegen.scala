package hkmc2.codegen.handlers

import scala.collection.mutable

import hkmc2.*
import hkmc2.utils.*, shorthands.*
import hkmc2.semantics.*
import hkmc2.codegen.*
import hkmc2.syntax
import hkmc2.syntax.Tree

import hkmc2.codegen.HandlerLowering.*
import hkmc2.codegen.HandlerPaths
import hkmc2.Config.EffectHandlers

class ClassCodegen(hctx: SharedState, paths: HandlerPaths, flattenCtx: FlattenCtx):
  import hctx.*
  given Elaborator.State = estate
  given Config = cfg
  
  def generate(b: Block, parts: PartitionedBlock, ctx: FunctionCtx): Block =
    val needsStackSafety = parts.needsStackSafety && hctx.opt.stackSafety.isDefined
    val curDepth = VarSymbol(Tree.Ident("curDepth"))
    val callTmpVar = VarSymbol(Tree.Ident("callTmp"))
    val baseName = ctx.debugInfo.debugNme
    val clsSym = new BlockMemberSymbol(s"$baseName$$Cont", Nil, true)
    val clsDSym = new ClassSymbol(Tree.DummyTypeDef(syntax.Cls), Tree.Ident(s"$baseName$$Cont"))
    val transformedBody =
      new BlockTransformerShallow(SymbolSubst.Id):
        private def transformEffectful(lhs: LocalVarSymbol, r: Result, sid: StateId, rst: Block): Block =
          blockBuilder
            .staticif(needsStackSafety, _.assignFieldN(paths.runtimePath, paths.stackDepthIdent, curDepth.asSimpleRef))
            .assign(lhs, r)
            .ifthen(
              paths.curEffect,
              Case.Lit(Tree.UnitLit(true)),
              End(),
              S(
                Assign(callTmpVar, Instantiate(true, clsSym.asMemberRef(clsDSym), (intLit(sid).asArg :: flattenCtx.vars.map(_.asSimpleRef.asArg)) :: Nil)(InstantiateMetadata.empty),
                Return(Call(paths.unwindFramedPath, (callTmpVar.asSimpleRef.asArg :: Nil) ne_:: Nil)(CallMetadata.defaultMlsFun))
              )))
            .rest(rst)
        override def applyResult(r: Result)(k: Result => Block): Block =
          parts.resultMap.get(Identity(r)) match
          case N => super.applyResult(r)(k)
          case S(sid) =>
            super.applyResult(r): r2 =>
              transformEffectful(callTmpVar, r2, sid, k(callTmpVar.asSimpleRef))
        override def applyBlock(b: Block): Block = b match
          case Assign(lhs: LocalVarSymbol, rhs, rest) =>
            parts.resultMap.get(Identity(rhs)) match
            case N => super.applyBlock(b)
            case S(sid) => transformEffectful(lhs, rhs, sid, applyBlock(rest))
          case _ => super.applyBlock(b)
      .applyBlock(b)
    val blockedFieldNames = Set.single("next")
    val allocatedFields = mutable.HashMap.empty[Str, (BlockMemberSymbol, TermSymbol)]
    val allocatedVars = mutable.HashMap.empty[LocalVarSymbol, Str]
    def genFTS(name: Str): TermSymbol =
      TermSymbol(syntax.MutVal, S(clsDSym), Tree.Ident(name))
    def genBMS(name: Str): BlockMemberSymbol =
      BlockMemberSymbol(name, Nil, true)
    def allocFieldWithName(v: LocalVarSymbol, nme: Str): (BlockMemberSymbol, TermSymbol) =
      val ts = genFTS(nme)
      val bms = genBMS(nme)
      allocatedFields(nme) = (bms, ts)
      allocatedVars(v) = nme
      (bms, ts)
    def allocField(v: LocalVarSymbol): (BlockMemberSymbol, TermSymbol) =
      val prefix = v.nme
      if !allocatedFields.contains(prefix) then
        allocFieldWithName(v, prefix)
      else
        val nme = (1 to Int.MaxValue).iterator
          .map(i => s"$prefix$i")
          .filterNot(nme => allocatedFields.contains(nme) || blockedFieldNames.contains(nme))
          .next()
        allocFieldWithName(v, nme)
    def getOrAllocTS(v: LocalVarSymbol): (BlockMemberSymbol, TermSymbol) =
      allocatedVars.get(v) match
      case N => allocField(v)
      case S(s) => allocatedFields(s)
    def fieldFromTS(ts: TermSymbol): Select =
      Select(Value.This(clsDSym), ts.id)(S(ts))(false)
    // Allocate before actual variables to reserve the name
    val pc = allocFieldWithName(VarSymbol(Tree.Ident("pc")), "pc")
    val savedVars = flattenCtx.vars ++ ctx.resumeInfo.allArgs
    val savedVarsFields = savedVars.map(allocField)
    val params = VarSymbol(Tree.Ident("pc")) :: savedVars.map(vs => VarSymbol(Tree.Ident(vs.nme)))
    val initFields = (params zip (pc :: savedVarsFields)).foldRight[Block](End()): (p, rst) =>
        Define(ValDefn(p._2._2, p._2._1, p._1.asSimpleRef)(N, Nil), rst)
    val resumeBody = genResumeBody(parts, ctx, allocatedVars, allocatedFields, fieldFromTS)
    val resumeDSym = genFTS("resume")
    val resumeSym = genBMS("resume")
    val resumeMtd = FunDefn(S(clsDSym), resumeSym, resumeDSym, PlainParamList(Param.simple(ctx.rVar) :: Nil) :: Nil, resumeBody)(N, Nil)
    ctx.companionClass = S(ClsLikeDefn(
      N,
      clsDSym,
      clsSym,
      N,
      syntax.Cls,
      S(PlainParamList(params.map(Param.simple(_)))),
      Nil,
      S(paths.contClsPath),
      resumeMtd :: Nil,
      Nil,
      allocatedFields.values.toList,
      Assign.discard(Call(estate.superSymbol.asSimpleRef, (unit.asArg :: Nil) ne_:: Nil)(CallMetadata.defaultMlsFun), End()),
      initFields,
      N,
      N,
    )(N, Nil))
    Scoped(Set.single(callTmpVar), transformedBody)
  
  def genResumeBody(
    parts: PartitionedBlock,
    ctx: FunctionCtx,
    allocatedVars: collection.Map[LocalVarSymbol, Str],
    allocatedFields: collection.Map[Str, (BlockMemberSymbol, TermSymbol)],
    fieldFromTS: TermSymbol => Select
  ): Block =
    val loopLbl = LabelSymbol(N, "handlerLoop")
    val pcField = fieldFromTS(allocatedFields("pc")._2)
    val postTransform = new BlockTransformerShallow(SymbolSubst.Id):
      override def applyBlock(b: Block): Block = b match
        case StateTransition(S(res), uid) =>
          blockBuilder
            .assign(ctx.rVar, res)
            .assignFieldS(pcField, intLit(uid))
            .continue(loopLbl)
        case StateTransition(N, uid) =>
          blockBuilder
            .assignFieldS(pcField, intLit(uid))
            .continue(loopLbl)
        case Assign(sym: LocalVarSymbol, rhs, rst) if allocatedVars.contains(sym) =>
          val fieldNme = allocatedVars(sym)
          val field = fieldFromTS(allocatedFields(fieldNme)._2)
          applyResult(rhs): rhs2 =>
            blockBuilder
              .assignFieldS(field, rhs2)
              .rest(applyBlock(rst))
        case Return(EffectfulResult()) =>
          // stack safety modify
          super.applyBlock(b)
        case _ => super.applyBlock(b)
      override def applyPath(p: Path)(k: Path => Block): Block = p match
        case Value.SimpleRef(sym: LocalVarSymbol) if allocatedVars.contains(sym) =>
          k(fieldFromTS(allocatedFields(allocatedVars(sym))._2))
        case _ => super.applyPath(p)(k)
    val refresher = new SymbolRefresher(Map.empty)
    val arms = parts.states.iterator
      .map: (sid, part) =>
        Case.Lit(Tree.IntLit(sid)) -> postTransform.applyBlock(part.blk)
      .toList
    refresher(Scoped(flattenCtx.scopedVars ++ ctx.resumeInfo.allArgs, Label(loopLbl, true, Match(pcField, arms, N, End()), End())))
