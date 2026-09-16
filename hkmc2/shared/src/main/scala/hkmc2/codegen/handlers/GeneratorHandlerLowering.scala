package hkmc2.codegen.handlers

import hkmc2.*
import hkmc2.semantics.*
import hkmc2.codegen.*, hkmc2.utils.*, shorthands.*

import hkmc2.codegen.HandlerLowering.EffectfulResult
import hkmc2.syntax.Tree
import hkmc2.codegen.HandlerLowering.GeneratorBase

case class GeneratorPaths(
  checkDepth: Path,
  stackDepth: Select,
  enterHandleBlock: Path,
  runStackSafe: Path,
  topLevelCall: Path,
)

object GeneratorPaths:
  private def rt(using Elaborator.State) = Elaborator.State.runtimeSymbol.asSimpleRef.selSN("JSRT")
  def generator(using Elaborator.State) = GeneratorPaths(
    rt.selSN("DNE").selSN("DNE"),
    rt.selSN("DNE").selSN("DNE"),
    rt.selSN("enterHandleBlockGenerator"),
    rt.selSN("DNE").selSN("DNE"),
    rt.selSN("topLevelCallGenerator"),
  )
  def asyncGenerator(using Elaborator.State) = GeneratorPaths(
    rt.selSN("checkDepthAsyncGenerator"),
    rt.selSN("AsyncGeneratorStackSafety").selSN("stackDepth"),
    rt.selSN("enterHandleBlockAsyncGenerator"),
    rt.selSN("runStackSafeAsyncGenerator"),
    rt.selSN("topLevelCallAsyncGenerator"),
  )

class GeneratorHandlerLowering(strategy: GeneratorBase)(using Config, Elaborator.State, Elaborator.Ctx, TL) extends BlockTransformer(SymbolSubst.Id):

  val yieldStar = Elaborator.State.builtinOpsMap("yield*")
  val yieldOp = Elaborator.State.builtinOpsMap("yield")
  val unit = Value.Lit(Tree.UnitLit(true))
  val async = strategy.isAsync
  val stackSafetyConfig = summon[Config].stackSafety.filter(_ => async)
  val rt = Elaborator.State.runtimeSymbol.asSimpleRef
  val generatorPaths = if async then GeneratorPaths.asyncGenerator else GeneratorPaths.generator

  var scopedTmp: List[LocalVarSymbol] = Nil
  var stackDepthSyms: List[LocalVarSymbol] = Nil
  var inNativeCtx: List[Bool] = Nil

  private def freshTmp(nme: Str = "tmp") = TempSymbol(N, nme)
  private def getCurScopedTmp = scopedTmp.head
  private def getCurDepthSym = stackDepthSyms.head
  private def unwrapGenerators = inNativeCtx.head

  private inline def nestScope[T](nativeCtx: Bool)(inline thunk: LocalVarSymbol => T): T =
    val t = freshTmp()
    val curDepth = freshTmp("curDepth")
    scopedTmp = t :: scopedTmp
    stackDepthSyms = curDepth :: stackDepthSyms
    inNativeCtx = nativeCtx :: inNativeCtx
    val r = thunk(t)
    inNativeCtx = inNativeCtx.tail
    stackDepthSyms = stackDepthSyms.tail
    scopedTmp = scopedTmp.tail
    r
  
  private def runtimeYield(p: Path): Result =
    Call(
      yieldOp.asSimpleRef,
      (p.asArg :: Nil) ne_:: Nil
    )(CallMetadata.defaultFun)
    
  private def callRuntimeMethod(p: Path, argss: List[Arg]) =
    Call(p, argss ne_:: Nil)(CallMetadata.defaultMlsFun)
  
  private def runtimeYieldStar(p: Path): Result =
    Call(
      yieldStar.asSimpleRef,
      (p.asArg :: Nil) ne_:: Nil
    )(CallMetadata.defaultFun)
  
  override def applyMainBlock(main: Block): Block =
    nestScope(true): t =>
      Scoped(Set.single(t), super.applyMainBlock(main))
  
  override def applyFunDefn(fun: FunDefn): FunDefn =
    if fun.annotations.contains(Annot.Native) then
      FunDefn(
        fun.owner,
        fun.sym,
        fun.dSym,
        fun.params,
        applyMainBlock(fun.body)
      )(fun.configOverride, fun.annotations)
    else
      val baseAnnots = Annot.HandlerInstrumented :: Annot.Generator :: fun.annotations
      FunDefn(
        fun.owner,
        fun.sym,
        fun.dSym,
        fun.params,
        applyFunBodyLikeBlock(fun.body)
      )(fun.configOverride, if async then Annot.NativeAsync :: baseAnnots else baseAnnots)
  
  override def applyFunBodyLikeBlock(b: Block): Block =
    nestScope(false): t =>
      blockBuilder
        .scopedVars(Set.single(t))
        .staticif(stackSafetyConfig.isDefined, _
          .scopedVars(Set.single(getCurDepthSym))
          .assign(t, callRuntimeMethod(generatorPaths.checkDepth, Nil))
          .assign(getCurDepthSym, Call(Value.SimpleRef(Elaborator.State.builtinOpsMap("+")),
            (generatorPaths.stackDepth.asArg :: Value.Lit(Tree.IntLit(1)).asArg :: Nil) ne_:: Nil)(CallMetadata.defaultFun))
          .assign(NoSymbol, runtimeYieldStar(t.asSimpleRef)))
        .rest(super.applyFunBodyLikeBlock(b))
  
  override def applyResult(r: Result)(k: Result => Block): Block =
    val tmp = getCurScopedTmp
    r match
    case Call(Value.MemberRef(Elaborator.ctx.builtins.runtime.suspend, _), args :: Nil) =>
      Assign(
        tmp,
        Tuple(false, args),
        k(runtimeYield(tmp.asSimpleRef))
      )
    case c @ Call(Value.MemberRef(Elaborator.ctx.builtins.runtime.handle_suspension, _), argss) =>
      applyResult(Call(generatorPaths.enterHandleBlock, argss)(CallMetadata.mlsFunWithEffect))(k)
    case r @ EffectfulResult() =>
      if unwrapGenerators then
        val withStackSafety = stackSafetyConfig match
          case S(ss) =>
            val bodSym = BlockMemberSymbol("‹stack safe body›", Nil, false)
            val bodFun = FunDefn.withFreshSymbol(N, bodSym, ParamList(ParamListFlags.empty, Nil, N) :: Nil, Ret(r))(configOverride = N, annotations = Nil)
            blockBuilder
              .scopedVars(Set.single(bodSym))
              .define(bodFun)
              .assign(tmp, callRuntimeMethod(generatorPaths.runStackSafe, Value.Lit(Tree.IntLit(ss.stackLimit)).asArg :: Value.MemberRef(bodSym, bodFun.dSym).asArg :: Nil))
          case N =>
            blockBuilder
              .assign(tmp, r)
              .assign(tmp, callRuntimeMethod(generatorPaths.topLevelCall, tmp.asSimpleRef.asArg :: Nil))
        withStackSafety
          .rest(k(tmp.asSimpleRef))
      else
        blockBuilder
          .staticif(stackSafetyConfig.isDefined, _.assignFieldS(generatorPaths.stackDepth, getCurDepthSym.asSimpleRef))
          .assign(tmp, r)
          .rest(k(runtimeYieldStar(tmp.asSimpleRef)))
    case _ => super.applyResult(r)(k)
    
