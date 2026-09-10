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

class ShadowStackCodegen(hctx: SharedState, paths: HandlerPaths, flattenCtx: FlattenCtx)(using TL):
  import hctx.*
  given Elaborator.State = estate
  given Config = cfg
  
  def generate(b: Block, parts: PartitionedBlock, ctx: FunctionCtx): Block =
    val baseName = ctx.debugInfo.debugNme
    val workerSym = new BlockMemberSymbol(s"$baseName$$worker", Nil, true)
    val workerDSym = new TermSymbol(syntax.Fun, N, Tree.Ident(s"$baseName$$worker"))
    val workerVarsParam = new VarSymbol(Tree.Ident(s"$baseName$$vars"))
    val dummyThisVar = ctx.thisPath.map(_ => VarSymbol(Tree.Ident("this")))
    val savedVars = Iterator.single(flattenCtx.pcVar) ++ dummyThisVar.iterator ++ ctx.resumeInfo.allArgs.iterator ++ flattenCtx.vars.iterator
    val varIndexes = savedVars.zipWithIndex.toMap
    def readFromIndex(idx: Int): Path =
      DynSelect(workerVarsParam.asSimpleRef, intLit(idx), true)
    def writeToIndex(idx: Int, res: Result)(rst: Block): Block =
      AssignDynField(workerVarsParam.asSimpleRef, intLit(idx), true, res, rst)
    def getVar(sym: LocalVarSymbol): Path =
      if sym is flattenCtx.pcVar then return sym.asSimpleRef
      varIndexes.get(sym).fold(Value.SimpleRef(sym))(readFromIndex)
    def setVar(sym: LocalVarSymbol, res: Result)(rst: Block): Block =
      if sym is flattenCtx.pcVar then
        return res match
          // pc write back pattern
          case Tuple(false, Arg(N, p) :: Nil) => writeToIndex(varIndexes.get(sym).get, p)(rst)
          case _ => Assign(sym, res, rst)
      varIndexes.get(sym).fold(Assign(sym, res, rst))(idx => writeToIndex(idx, res)(rst))
    ctx.newDefns ::= FunDefn(
      N,
      workerSym,
      workerDSym,
      PlainParamList(Param.simple(workerVarsParam) :: Nil) :: Nil,
      genWorkerBody()
    )(N, Annot.Private :: Annot.HandlerInstrumented :: ctx.orig.annotations)
    ctx.replaceAnnotWithInline = true

    def genWorkerBody(): Block =
      val mainBody =
        Assign(flattenCtx.pcVar, readFromIndex(varIndexes.get(flattenCtx.pcVar).get), 
          if parts.states.size <= 1 then
            flattenCtx.fallbackPostTransform.applyBlock(parts.states.head._2.blk)
          else
            val straightLineCg = StraightLineCodegen(hctx, paths, flattenCtx)
            Label(flattenCtx.mainLoopLbl, true, straightLineCg.generate(parts, ctx), End())
        )
      val transformer = new SymbolRefresher(Map.empty):
        override def applyBlock(b: Block): Block =
          b match
          case Assign(lhs: LocalVarSymbol, rhs, rest) =>
            applyResult(rhs): rhs2 =>
              setVar(lhs, rhs2)(applyBlock(rest))
          case Return(res) =>
            Assign.discard(Call(paths.popFramePath, Nil ne_:: Nil)(CallMetadata.defaultMlsFun), super.applyBlock(b))
          case _ => super.applyBlock(b)
        override def applyPath(p: Path)(k: Path => Block): Block =
          p match
          case Value.SimpleRef(s: LocalVarSymbol) => super.applyPath(getVar(s))(k)
          case p if ctx.thisPath.contains(p) => super.applyPath(getVar(dummyThisVar.get))(k)
          case _ => super.applyPath(p)(k)
        override def applyArg(arg: Arg)(k: Arg => Block): Block =
          super.applyArg(arg)(k)
      val extraVars = if flattenCtx.needsStackSafety then Set(flattenCtx.pcVar, flattenCtx.curDepth) else Set.single(flattenCtx.pcVar)
      val withStackSafe = if !flattenCtx.needsStackSafety then mainBody else
        blockBuilder
          .assign(NoSymbol, Call(paths.checkDepthPath, Nil ne_:: Nil)(CallMetadata.mlsFunWithEffect))
          .assign(flattenCtx.curDepth, Call(estate.builtinOpsMap("+").asSimpleRef, (paths.stackDepthPath.asArg :: intLit(1).asArg :: Nil) ne_:: Nil)(CallMetadata.defaultFun))
          .rest(mainBody)
      transformer.applyMainBlock(Scoped(flattenCtx.scopedVars ++ extraVars, withStackSafe))

    val tmp = freshTmp("vars")
    val initialVars = (Iterator.single(intLit(parts.entry)) ++ ctx.thisPath.iterator ++ ctx.resumeInfo.allArgs.iterator.map[Path](_.asSimpleRef) ++ flattenCtx.vars.iterator.map[Path](_ => unit)).map(Arg(N, _)).toList
    blockBuilder
      .assignScoped(tmp, Tuple(true, initialVars))
      .assign(NoSymbol, Call(paths.pushFramePath, (Value.MemberRef(workerSym, workerDSym).asArg :: Value.SimpleRef(tmp).asArg :: Nil) ne_:: Nil)(CallMetadata.defaultMlsFun))
      .ret(Call(Value.MemberRef(workerSym, workerDSym), (tmp.asSimpleRef.asArg :: Nil) ne_:: Nil)(CallMetadata.mlsFunWithEffect))
  