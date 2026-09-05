package hkmc2.codegen.handlers

import hkmc2.*
import hkmc2.semantics.*
import hkmc2.codegen.*, hkmc2.utils.*, shorthands.*

import hkmc2.codegen.HandlerLowering.EffectfulResult
import hkmc2.syntax.Tree

class GeneratorHandlerLowering(using Config, Elaborator.State, Elaborator.Ctx, TL) extends BlockTransformer(SymbolSubst.Id):

  val yieldStar = Elaborator.State.builtinOpsMap("yield*")
  val yieldOp = Elaborator.State.builtinOpsMap("yield")
  val unit = Value.Lit(Tree.UnitLit(true))
  val stackSafetyConfig = summon[Config].stackSafety
  val rt = Elaborator.State.runtimeSymbol.asSimpleRef

  var scopedTmp: List[LocalVarSymbol] = Nil
  var stackDepthSyms: List[LocalVarSymbol] = Nil

  private def freshTmp(nme: Str = "tmp") = TempSymbol(N, nme)
  private def getCurScopedTmp = scopedTmp.head
  private def getCurDepthSym = stackDepthSyms.head
  private def isMainBlock = scopedTmp.sizeIs == 1

  private inline def nestScope[T](inline thunk: LocalVarSymbol => T): T =
    val t = freshTmp()
    val curDepth = freshTmp("curDepth")
    scopedTmp = t :: scopedTmp
    stackDepthSyms = curDepth :: stackDepthSyms
    val r = thunk(t)
    stackDepthSyms = stackDepthSyms.tail
    scopedTmp = scopedTmp.tail
    r
  
  private def runtimeYield(p: Path): Result =
    Call(
      yieldOp.asSimpleRef,
      (p.asArg :: Nil) ne_:: Nil
    )(CallMetadata.defaultFun)
    
  private def callRuntimeMethod(mtd: Str, argss: List[Arg]) =
    Call(
      Elaborator.State.runtimeSymbol.asSimpleRef.selSN(mtd), argss ne_:: Nil
    )(CallMetadata.defaultMlsFun)
  
  private def runtimeYieldStar(p: Path): Result =
    Call(
      yieldStar.asSimpleRef,
      (p.asArg :: Nil) ne_:: Nil
    )(CallMetadata.defaultFun)
  
  override def applyMainBlock(main: Block): Block =
    nestScope: t =>
      Scoped(Set.single(t), super.applyMainBlock(main))
  
  override def applyFunDefn(fun: FunDefn): FunDefn =
    FunDefn(
      fun.owner,
      fun.sym,
      fun.dSym,
      fun.params,
      applyFunBodyLikeBlock(fun.body)
    )(fun.configOverride, Annot.Generator :: fun.annotations)
  
  override def applyFunBodyLikeBlock(b: Block): Block =
    nestScope: t =>
      blockBuilder
        .scopedVars(Set.single(t))
        .staticif(stackSafetyConfig.isDefined, _
          .scopedVars(Set.single(getCurDepthSym))
          .assign(t, callRuntimeMethod("checkDepthGenerator", Nil))
          .assign(getCurDepthSym, Call(Value.SimpleRef(Elaborator.State.builtinOpsMap("+")),
            (rt.selSN("GeneratorStackSafety").selSN("stackDepth").asArg :: Value.Lit(Tree.IntLit(1)).asArg :: Nil) ne_:: Nil)(CallMetadata.defaultFun))
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
      applyResult(Call(Elaborator.State.runtimeSymbol.asSimpleRef.selSN("enterHandleBlockGenerator"), argss)(CallMetadata.mlsFunWithEffect))(k)
    case EffectfulResult() => r match
      case c: Call if !c.metadata.isNative =>
        if isMainBlock then
          val withStackSafety = stackSafetyConfig match
            case S(ss) =>
              val bodSym = BlockMemberSymbol("‹stack safe body›", Nil, false)
              val bodFun = FunDefn.withFreshSymbol(N, bodSym, ParamList(ParamListFlags.empty, Nil, N) :: Nil, Ret(r))(configOverride = N, annotations = Nil)
              blockBuilder
                .scopedVars(Set.single(bodSym))
                .define(bodFun)
                .assign(tmp, callRuntimeMethod("runStackSafeGenerator", Value.Lit(Tree.IntLit(ss.stackLimit)).asArg :: Value.MemberRef(bodSym, bodFun.dSym).asArg :: Nil))
            case N =>
              blockBuilder
                .assign(tmp, r)
                .assign(tmp, callRuntimeMethod("handlerTopLevelCall", tmp.asSimpleRef.asArg :: Nil))
          withStackSafety
            .rest(k(tmp.asSimpleRef))
        else
          blockBuilder
            .staticif(stackSafetyConfig.isDefined, _.assignFieldN(rt.selSN("GeneratorStackSafety"), new Tree.Ident("stackDepth"), getCurDepthSym.asSimpleRef))
            .assign(tmp, c)
            .rest(k(runtimeYieldStar(tmp.asSimpleRef)))
      case _ => super.applyResult(r)(k)
    case _ => super.applyResult(r)(k)
    
