package hkmc2.codegen.handlers

import hkmc2.*
import hkmc2.semantics.*
import hkmc2.codegen.*, hkmc2.utils.*, shorthands.*

import hkmc2.codegen.HandlerLowering.EffectfulResult
import hkmc2.syntax.Tree
import hkmc2.codegen.HandlerLowering.GeneratorBase
import hkmc2.codegen.HandlerLowering.intLit

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

// A hack that make static initialization be able to await for its field initialization
class AsyncTopLevelAwait(using Elaborator.State) extends BlockTransformer(SymbolSubst.Id):
  
  override def applyBlock(b: Block): Block = b match
    case Define(c @ ClsLikeDefn(companion = S(mod)), rst) =>
      applyDefn(c): defn2 =>
        val r = mod.publicFields.foldRight(applyBlock(rst)): (fld, acc) =>
          val field = Select(Value.MemberRef(c.sym, mod.isym)(N), Tree.Ident(fld._1.nme))(S(fld._2), N)(false)
          AssignField(field, Call(Elaborator.State.builtinOpsMap("await").asSimpleRef, (field.asArg :: Nil) ne_:: Nil)(CallMetadata.defaultFun, N), acc)
        Define(defn2, r)
    case _ => super.applyBlock(b)

class GeneratorHandlerLowering(strategy: GeneratorBase)(using Config, Elaborator.State, Elaborator.Ctx, TL) extends BlockTransformer(SymbolSubst.Id):
  
  val yieldStar = Elaborator.State.builtinOpsMap("yield*")
  val yieldOp = Elaborator.State.builtinOpsMap("yield")
  val unit = Value.Lit(Tree.UnitLit(true))
  val async = strategy.isAsync
  val stackSafetyConfig = summon[Config].stackSafety.filter(_ => async)
  val rt = Elaborator.State.runtimeSymbol.asSimpleRef
  val generatorPaths = if async then GeneratorPaths.asyncGenerator else GeneratorPaths.generator
  
  case class ScopeState(
    tmp: LocalVarSymbol,
    inNativeCtx: Bool,
  )

  var scopeStates: List[ScopeState] = Nil

  private def freshTmp(erasedType: Opt[ErasedType], nme: Str = "tmp") = TempSymbol(N, erasedType, nme)
  private def getCurScopedTmp = scopeStates.head.tmp
  private def unwrapGenerators = scopeStates.head.inNativeCtx

  private inline def nestScope[T](nativeCtx: Bool)(inline thunk: LocalVarSymbol => T): T =
    val t = freshTmp(N)
    scopeStates = ScopeState(
      t,
      nativeCtx,
    ) :: scopeStates
    val r = thunk(t)
    scopeStates = scopeStates.tail
    r
  
  private def runtimeYield(p: Path): Result =
    Call(
      yieldOp.asSimpleRef,
      (p.asArg :: Nil) ne_:: Nil
    )(CallMetadata.defaultFun, N)
    
  private def callRuntimeMethod(p: Path, argss: List[Arg]) =
    Call(p, argss ne_:: Nil)(CallMetadata.defaultMlsFun, N)
  
  private def runtimeYieldStar(p: Path): Result =
    Call(
      yieldStar.asSimpleRef,
      (p.asArg :: Nil) ne_:: Nil
    )(CallMetadata.defaultFun, N)
  
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
      val baseAnnots = Annot.HandlerInstrumented()(N) :: Annot.Generator()(N) :: fun.annotations
      FunDefn(
        fun.owner,
        fun.sym,
        fun.dSym,
        fun.params,
        applyFunBodyLikeBlock(fun.body)
      )(fun.configOverride, if async then Annot.NativeAsync()(N) :: baseAnnots else baseAnnots)
  
  // JavaScript constructors cannot yield or await, unlike instrumented function bodies.
  override def applyCtorBlock(b: Block, isModCtor: Bool): Block = applyScopedBlock(b)
  
  override def applyFunBodyLikeBlock(b: Block): Block =
    nestScope(false): t =>
      val rest = super.applyFunBodyLikeBlock(b)
      blockBuilder
        .scopedVars(Set.single(t))
        .staticif(stackSafetyConfig.isDefined, _
          .assign(NoSymbol, Call(Elaborator.State.builtinOpsMap("await").asSimpleRef, (intLit(0).asArg :: Nil) ne_:: Nil)(CallMetadata.defaultFun, N)))
        .rest(rest)
  
  override def applyResult(r: Result)(k: Result => Block): Block =
    val tmp = getCurScopedTmp
    r match
    case Call(Value.MemberRef(Elaborator.ctx.builtins.runtime.suspend, _), args :: Nil) =>
      Assign(
        tmp,
        Tuple(false, args)(N),
        k(runtimeYield(tmp.asSimpleRef))
      )
    case c @ Call(Value.MemberRef(Elaborator.ctx.builtins.runtime.handle_suspension, _), argss) =>
      applyResult(Call(generatorPaths.enterHandleBlock, argss)(CallMetadata.mlsFunWithEffect, N))(k)
    case r @ EffectfulResult() =>
      if unwrapGenerators then
        val withStackSafety = stackSafetyConfig match
          case S(ss) =>
            val bodSym = BlockMemberSymbol("‹stack safe body›", Nil, false)
            val bodFun = FunDefn.withFreshSymbol(N, bodSym, LoweredParamList(ParamListFlags.empty, Nil, N)(N) :: Nil, Ret(r))(configOverride = N, annotations = Nil)
            blockBuilder
              .scopedVars(Set.single(bodSym))
              .define(bodFun)
              .assign(tmp, callRuntimeMethod(generatorPaths.runStackSafe, Value.Lit(Tree.IntLit(ss.stackLimit))(N).asArg :: Value.MemberRef(bodSym, bodFun.dSym)(N).asArg :: Nil))
          case N =>
            blockBuilder
              .assign(tmp, r)
              .assign(tmp, callRuntimeMethod(generatorPaths.topLevelCall, tmp.asSimpleRef.asArg :: Nil))
        withStackSafety
          .rest(k(tmp.asSimpleRef))
      else
        blockBuilder
          .assign(tmp, r)
          .rest(k(runtimeYieldStar(tmp.asSimpleRef)))
    case _ => super.applyResult(r)(k)
  
  override def applyProgram(prog: Program): Program =
    val prog2 = super.applyProgram(prog)
    if async then
      AsyncTopLevelAwait().applyProgram(prog2)
    else
      prog2
