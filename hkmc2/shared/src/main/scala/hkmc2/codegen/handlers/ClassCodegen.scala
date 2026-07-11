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

class ClassCodegen(hctx: SharedState, paths: HandlerPaths, flattenCtx: FlattenCtx)(using TL):
  import hctx.*
  given Elaborator.State = estate
  given Config = cfg
  
  def generate(b: Block, parts: PartitionedBlock, ctx: FunctionCtx): Block =
    val curDepth = VarSymbol(Tree.Ident("curDepth"))
    val callTmpVar = VarSymbol(Tree.Ident("callTmp"))
    val baseName = ctx.debugInfo.debugNme
    val clsSym = new BlockMemberSymbol(s"$baseName$$Cont", Nil, true)
    val clsDSym = new ClassSymbol(Tree.DummyTypeDef(syntax.Cls), Tree.Ident(s"$baseName$$Cont"))
    val savedVars = flattenCtx.vars ++ ctx.resumeInfo.allArgs
    def instCont(uid: Path) =
      Instantiate(true, clsSym.asMemberRef(clsDSym), (ctx.thisPath.map(_.asArg) ++: (uid.asArg :: savedVars.map(_.asSimpleRef.asArg))) :: Nil)(InstantiateMetadata.empty)
    val transformedBody =
      new BlockTransformerShallow(SymbolSubst.Id):
        private def transformEffectful(lhs: LocalVarSymbol, r: Result, sid: StateId, rst: Block): Block =
          blockBuilder
            .staticif(flattenCtx.needsStackSafety, _.assignFieldN(paths.runtimePath, paths.stackDepthIdent, curDepth.asSimpleRef))
            .assign(lhs, r)
            .ifthen(
              paths.curEffect,
              Case.Lit(Tree.UnitLit(true)),
              End(),
              S(
                Assign(callTmpVar, instCont(intLit(sid)),
                Return(Call(paths.unwindFramedPath, (callTmpVar.asSimpleRef.asArg :: Nil) ne_:: Nil)(CallMetadata.defaultMlsFun))
              )))
            .rest(rst)
        override def applyResult(r: Result)(k: Result => Block): Block =
          parts.resultMap.get(Identity(r)) match
          case N => r match
            case EffectfulResult() =>
              blockBuilder
                .staticif(flattenCtx.needsStackSafety, _.assignFieldN(paths.runtimePath, paths.stackDepthIdent, curDepth.asSimpleRef))
                .rest(super.applyResult(r)(k))
            case _ => super.applyResult(r)(k)
          case S(sid) =>
            super.applyResult(r): r2 =>
              transformEffectful(callTmpVar, r2, sid, k(callTmpVar.asSimpleRef))
        override def applyBlock(b: Block): Block = b match
          case Assign(lhs: LocalVarSymbol, rhs, rest) =>
            parts.resultMap.get(Identity(rhs)) match
            case N => super.applyBlock(b)
            case S(sid) => transformEffectful(lhs, rhs, sid, applyBlock(rest))
          case Scoped(_, bod) => applyBlock(bod)
          case _ => super.applyBlock(b)
        override def applyScopedBlock(b: Block): Block = b match
          case Scoped(_, bod) => applyBlock(bod)
          case _ => super.applyScopedBlock(b)
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
    val selfField = ctx.thisPath.map(_ => allocFieldWithName(VarSymbol(Tree.Ident("this")), "this"))
    val selfParam = ctx.thisPath.map(_ => VarSymbol(Tree.Ident("this")))
    val allFields = selfField ++: (pc :: savedVars.map(allocField))
    val params = selfParam ++: (VarSymbol(Tree.Ident("pc")) :: savedVars.map(vs => VarSymbol(Tree.Ident(vs.nme))))
    val initFields = (params zip allFields).foldRight[Block](End()): (p, rst) =>
        Define(ValDefn(p._2._2, p._2._1, p._1.asSimpleRef)(N, Nil), rst)
    val resumeBody = genResumeBody(parts, ctx, selfField.map(f => fieldFromTS(f._2)), allocatedVars, allocatedFields, fieldFromTS, clsDSym)
    val resumeDSym = genFTS("resume")
    val resumeSym = genBMS("resume")
    val resumeMtd = FunDefn(S(clsDSym), resumeSym, resumeDSym, PlainParamList(Param.simple(ctx.rVar) :: Nil) :: Nil, resumeBody)(N, Nil)
    ctx.contClass = S(ClsLikeDefn(
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
    var scoped: Iterator[ScopedSymbol] = flattenCtx.scopedVars.iterator ++ Iterator.single(callTmpVar)
    var mainBody = transformedBody
    if flattenCtx.needsStackSafety then
      scoped = scoped ++ Iterator.single(curDepth)
      mainBody = blockBuilder
        .assign(NoSymbol, Call(paths.checkDepthPath, Nil ne_:: Nil)(CallMetadata.mlsFunWithEffect))
        .ifthen(paths.curEffect, Case.Lit(Tree.UnitLit(true)), End(), S(
          Assign(callTmpVar, instCont(intLit(parts.entry)),
            Return(Call(paths.unwindFramedPath, (callTmpVar.asSimpleRef.asArg :: Nil) ne_:: Nil)(CallMetadata.defaultMlsFun)))))
        .assign(curDepth, Call(paths.plus, (paths.stackDepthPath.asArg :: intLit(1).asArg :: Nil) ne_:: Nil)(CallMetadata.defaultFun))
        .rest(mainBody)
    Scoped(scoped.toSet, mainBody)
  
  def genResumeBody(
    parts: PartitionedBlock,
    ctx: FunctionCtx,
    selfField: Option[Path],
    allocatedVars: collection.Map[LocalVarSymbol, Str],
    allocatedFields: collection.Map[Str, (BlockMemberSymbol, TermSymbol)],
    fieldFromTS: TermSymbol => Select,
    clsDSym: ClassSymbol,
  ): Block =
    val loopLbl = LabelSymbol(N, "handlerLoop")
    val pcField = fieldFromTS(allocatedFields("pc")._2)
    val postTransform = new BlockTransformerShallow(SymbolSubst.Id):
      override def applyBlock(b: Block): Block = b match
        case StateTransition(S(res), uid) =>
          applyResult(res): r2 =>
            blockBuilder
              .assign(ctx.rVar, r2)
              .assignFieldS(pcField, intLit(uid))
              .ifthen(paths.curEffect, Case.Lit(Tree.UnitLit(true)), End(), S(
                Return(Call(paths.unwindFramedPath, (Value.This(clsDSym).asArg :: Nil) ne_:: Nil)(CallMetadata.defaultMlsFun))
              ))
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
        case Value.This(s) if ctx.thisPath.contains(p) =>
          k(selfField.get)
        case _ => super.applyPath(p)(k)
      override def applySimpleSymbol(sym: SimpleSymbol): SimpleSymbol =
        sym match
        case s: LocalVarSymbol if allocatedVars.contains(s) =>
          lastWords("VarSymbol occurs in unexpected places and is not replaced")
        case _ => sym
    val refresher = new SymbolRefresher(Map.empty)
    val arms = parts.states.iterator
      .map: (sid, part) =>
        Case.Lit(Tree.IntLit(sid)) -> postTransform.applyBlock(part.blk)
      .toList
    refresher(Scoped(flattenCtx.scopedVars, Label(loopLbl, true, Match(pcField, arms, N, End()), End())))
