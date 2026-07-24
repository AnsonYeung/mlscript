package hkmc2.codegen.handlers

import hkmc2.*
import hkmc2.semantics.*
import hkmc2.codegen.*, hkmc2.utils.*, shorthands.*

import hkmc2.codegen.HandlerLowering.EffectfulResult

class GeneratorHandlerLowering(using Config, Elaborator.State, Elaborator.Ctx) extends BlockTransformer(SymbolSubst.Id):

  val yieldStar = Elaborator.State.builtinOpsMap("yield *")
  val yieldOp = Elaborator.State.builtinOpsMap("yield")

  var scopedTmp: List[LocalVarSymbol] = Nil

  private def freshTmp(nme: Str = "tmp") = TempSymbol(N, nme)
  private def getCurScopedTmp = scopedTmp.head

  private inline def nestScope[T](inline thunk: LocalVarSymbol => T): T =
    val t = freshTmp()
    scopedTmp = t :: scopedTmp
    val r = thunk(t)
    scopedTmp = scopedTmp.tail
    r

  override def applyFunDefn(fun: FunDefn): FunDefn =
    FunDefn(
      fun.owner,
      fun.sym,
      fun.dSym,
      fun.params,
      nestScope: t =>
        Scoped(Set.single(t), applyScopedBlock(fun.body))
    )(fun.configOverride, Annot.Generator :: fun.annotations)
  
  override def applyResult(r: Result)(k: Result => Block): Block = r match
    case Call(Value.MemberRef(Elaborator.ctx.builtins.runtime.suspend, _), (Arg(N, tag) :: Arg(N, bodRef) :: Nil) :: Nil) =>
      val tmp = getCurScopedTmp
      Assign(
        tmp,
        Call(
          yieldOp.asSimpleRef,
          (tag.asArg :: Nil) ne_:: Nil
        )(CallMetadata.defaultFun),
        k(Call(bodRef, (tmp.asSimpleRef.asArg :: Nil) ne_:: Nil)(CallMetadata.mlsFunWithEffect))
      )
    case c @ Call(Value.MemberRef(Elaborator.ctx.builtins.runtime.handle_suspension, _), argss) =>
      val funcName = if scopedTmp.isEmpty then "enterHandleBlockGeneratorTopLevel" else "enterHandleBlockGenerator"
      k(Call(Elaborator.State.runtimeSymbol.asSimpleRef.selSN(funcName), argss)(CallMetadata.mlsFunWithEffect))
    case EffectfulResult() => r match
      case c: Call if !c.metadata.isNative =>
        val tmp = getCurScopedTmp
        Assign(
          tmp,
          c,
          k(Call(yieldStar.asSimpleRef, (tmp.asSimpleRef.asArg :: Nil) ne_:: Nil)(CallMetadata.defaultFun))
        )
      case _ => super.applyResult(r)(k)
    case _ => super.applyResult(r)(k)
    
