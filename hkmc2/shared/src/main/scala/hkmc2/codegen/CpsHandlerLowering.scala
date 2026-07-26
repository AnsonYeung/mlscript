package hkmc2
package codegen

import scala.annotation.tailrec
import scala.collection.mutable
import scala.util.boundary
import sourcecode.{ Line, FileName, Name }

import hkmc2.utils.*, shorthands.*
import hkmc2.utils.*
import hkmc2.utils.SymbolSubst
import hkmc2.Message.MessageContext

import syntax.{Literal, Tree}
import semantics.*
import semantics.Elaborator.ctx
import semantics.Elaborator.State
import hkmc2.Config.EffectHandlers
import hkmc2.Diagnostic.Source
import hkmc2.codegen.HandlerLowering.EffectfulResult


object CpsHandlerLowering:

  private val pcIdent: Tree.Ident = Tree.Ident("pc")
  private val nextIdent: Tree.Ident = Tree.Ident("next")
  private val lastIdent: Tree.Ident = Tree.Ident("last")
  private val contTraceIdent: Tree.Ident = Tree.Ident("contTrace")
  private def unit = Value.Lit(Tree.UnitLit(true))
  private def intLit(i: BigInt) = Value.Lit(Tree.IntLit(i))

  private def locToStr(loc: Loc) =
    val (line, _, col) = loc.origin.fph.getLineColAt(loc.spanStart)
    Value.Lit(Tree.StrLit(s"${loc.origin.fileName.last}:${line + loc.origin.startLineNum - 1}:$col"))
  
  extension (p: Path)
    def pc = p.selN(pcIdent)
    def value = p.selN(Tree.Ident("value"))
    def next = p.selN(nextIdent)
    def last = p.selN(lastIdent)
    def contTrace = p.selN(contTraceIdent)
  
  // private case class LinkState(res: Local, cls: Path, uid: Path)
  
  type FnOrCls = Either[BlockMemberSymbol, DefinitionSymbol[? <: ClassLikeDef] & InnerSymbol]
  
  type StateId = BigInt

import CpsHandlerLowering.*

class CpsHandlerLowering(paths: HandlerPaths, opt: EffectHandlers)(using TL, Raise, Elaborator.State, Elaborator.Ctx, Config):
  
  var cpsId = 0
  
  val plus = State.builtinOpsMap("+").asSimpleRef
  val checkDepthCpsPath: Path = paths.runtimePath.selN(Tree.Ident("cpsSetCheckDepth"))
  val raiseStackPath: Path = paths.runtimePath.selN(Tree.Ident("cpsRaiseStack"))
  val runStackSafeCpsPath: Path = paths.runtimePath.selN(Tree.Ident("runStackSafeCps"))
  
  extension (builder: Block => Block)
    def stackSafePre(cont: Path, retVal: Path) =
      val tmp = TempSymbol(N)
      builder
        .assignScoped(tmp, Call(checkDepthCpsPath, Nil ne_:: Nil)(CallMetadata.defaultMlsFun))
        .ifthen(tmp.asPath, Case.Lit(Tree.BoolLit(true)), Return(Call(raiseStackPath, (cont.asArg :: retVal.asArg :: Nil) ne_:: Nil)(CallMetadata.defaultMlsFun)))
  
  def mapTail(b: Block)(f: BlockTail => Block): Block = b match
    case b: BlockTail => f(b)
    case Match(scrut, arms, dflt, rest) => Match(scrut, arms, dflt, mapTail(rest)(f))
    case Label(label, loop, body, rest) => Label(label, loop, body, mapTail(rest)(f))
    case Scoped(syms, body) => Scoped(syms, mapTail(body)(f))
    case Begin(sub, rest) => Begin(sub, mapTail(rest)(f))
    case TryBlock(sub, finallyDo, rest) => TryBlock(sub, finallyDo, mapTail(rest)(f))
    case Assign(lhs, rhs, rest) => Assign(lhs, rhs, mapTail(rest)(f))
    case a @ AssignField(lhs, field, res, rest) => AssignField(lhs, field, res, mapTail(rest)(f))(a.symbol)
    case AssignDynField(lhs, fld, arrayIdx, rhs, rest) => AssignDynField(lhs, fld, arrayIdx, rhs, mapTail(rest)(f))
    case Define(defn, rest) => Define(defn, mapTail(rest)(f))
  
  
  def blockNormalizer = new BlockTransformer(SymbolSubst()):
    val thunks: mutable.Map[LabelSymbol, () => FunDefn] = mutable.Map.empty
    
    override def applyBlock(b: Block): Block = b match
      case m @ Match(scrut, arms, dflt, rest) if !rest.isEmpty =>
        var used = false
        val (dfn, blk) = createNestedFn("rest", PlainParamList(Nil), applyBlock(rest), true)
        def mkCall = Return(Call(dfn.asPath, Nil ne_:: Nil)(CallMetadata.mlsFunWithEffect))
        def rewriteTail(arm: Block) = mapTail(arm):
          case End(_) =>
            used = true
            mkCall
          case arm => arm
        val newArms = arms.mapConserve:
          case (c, b_) => (c, applyBlock(rewriteTail(b_)))
        val newDflt = dflt.mapConserve(b_ => applyBlock(rewriteTail(b_)))
        // Match(scrut, arms, dflt, rest)
        val ret = Match(scrut, newArms, newDflt, mkCall)
        if used then
          blk(ret)
        else ret
      
      case b @ Begin(sub, rest) if !rest.isEmpty =>
        if sub.isAbortive || rest.isEmpty then applyBlock(sub)
        var good = false
        val mapped = mapTail(sub):
          case End(_) =>
            good = true
            rest
          case b => b
        
        if good then applyBlock(mapped)
        else
          val (dfn, blk) = createNestedFn("rest", PlainParamList(Nil), applyBlock(rest), true)
          def rewriteTail(arm: Block) = mapTail(arm):
            case End(_) => Return(Call(dfn.asPath, Nil ne_:: Nil)(CallMetadata.mlsFunWithEffect))
            case arm => arm
          Begin(blk(applyBlock(rewriteTail(sub))), End())
      
      case Label(label, loop, body, rest) if !rest.isEmpty =>
        if !loop then
          var used = false
          val (dfn, blk) = createNestedFn("rest", PlainParamList(Nil), applyBlock(rest), true)
          def rewriteTail(arm: Block) = mapTail(arm):
            case End(_) => Return(Call(dfn.asPath, Nil ne_:: Nil)(CallMetadata.mlsFunWithEffect))
            case arm => arm
          thunks.addOne(label, () =>
            used = true
            dfn
          )
          val res = applyBlock(body)
          if used then blk(res) else res
        else
          ???
      case Break(label) =>
        Return(Call(thunks(label)().asPath, Nil ne_:: Nil)(CallMetadata.mlsFunWithEffect))
      case Continue(label) => ???
      
      
      case _ => super.applyBlock(b)
  
  val cpsTransformer = new BlockTransformer(SymbolSubst()):
    
    val idPath = State.runtimeSymbol.asPath.selN(Tree.Ident("cpsId"))
    
    var curContPath: Path = idPath
    var isTopLevel = true
    var inCtor = false
    
    inline def preserve[T](f: => T) =
      val saved = curContPath
      val savedTopLevel = isTopLevel
      val savedInCtor = inCtor
      val ret = f
      curContPath = saved
      isTopLevel = savedTopLevel
      inCtor = savedInCtor
      ret
    
    def applyCpsOnFun(b: Block, contPath: Path): Block = preserve:
      curContPath = contPath
      isTopLevel = false
      inCtor = false
      applyScopedBlock(b)
    
    def applyCpsOnCtor(b: Block): Block = preserve:
      curContPath = idPath
      isTopLevel = false
      inCtor = true
      applyScopedBlock(b)
    
    override def applyObjBody(defn: ClsLikeBody): ClsLikeBody =
      val isym2 = defn.isym.subst
      val methods2 = defn.methods.mapConserve(applyFunDefn)
      val privateFields2 = defn.privateFields.mapConserve(_.subst)
      val publicFields2 = defn.publicFields.mapConserve(applyPublicField)
      val ctor2 = applyCpsOnCtor(defn.ctor)
      if (methods2 is defn.methods) &&
          (privateFields2 is defn.privateFields) &&
          (publicFields2 is defn.publicFields) &&
          (ctor2 is defn.ctor)
        then defn else ClsLikeBody(isym2, methods2, privateFields2, publicFields2, ctor2, defn.annotations)
    
    override def applyClsLikeDefn(defn: ClsLikeDefn)(k: Defn => Block): Block =
      val ClsLikeDefn(own, isym, sym, ctorSym, kind, paramsOpt, auxParams, parentPath, methods,
        privateFields, publicFields, preCtor, ctor, mod, bufferable) = defn
      val own2 = own.mapConserve(_.subst)
      val isym2 = isym.subst
      val sym2 = sym.subst
      val ctorSym2 = ctorSym.mapConserve(_.subst)
      val paramsOpt2 = paramsOpt.mapConserve(applyParamList)
      val auxParams2 = auxParams.mapConserve(applyParamList)
      def helper(parentPath2: Opt[Path]) =
        val methods2 = methods.mapConserve(applyFunDefn)
        val privateFields2 = privateFields.mapConserve(_.subst)
        val publicFields2 = publicFields.mapConserve(applyPublicField)
        val preCtor2 = applyCpsOnCtor(preCtor)
        val ctor2 = applyCpsOnCtor(ctor)
        val mod2 = mod.mapConserve(applyObjBody)
        k:
          if (own2 is own) && (isym2 is isym) && (sym2 is sym) && (ctorSym2 is ctorSym) &&
              (paramsOpt2 is paramsOpt) &&
              (auxParams2 is auxParams) &&
              (parentPath2 is parentPath) &&
              (methods2 is methods) &&
              (privateFields2 is privateFields) &&
              (publicFields2 is publicFields) &&
              (preCtor2 is preCtor) && (ctor2 is ctor) &&
              (mod2 is mod)
            then defn else ClsLikeDefn(own2, isym2, sym2, ctorSym2, kind, paramsOpt2, 
              auxParams2, parentPath2, methods2, privateFields2, publicFields2, preCtor2, ctor2, mod2, bufferable)(defn.configOverride, defn.annotations)
      parentPath match
      case Some(pp) => applyPath(pp): pp2 =>
        helper:
          if pp2 is pp then parentPath else Some(pp2)
      case None => helper(parentPath)
    
    override def applyFunDefn(fun: FunDefn): FunDefn =
      if fun.params.size != 1 then
        raise(WarningReport(
          msg"The function ${fun.dSym.toString} is not CPS-transformed because it has more than one parameter list." -> fun.dSym.toLoc :: Nil,
          source = Source.Compilation))
        super.applyFunDefn(fun)
      else
        val contSym = VarSymbol(Tree.Ident("k"))
        val ogParams = fun.params.head
        val cpsBod = applyCpsOnFun(fun.body, contSym.asPath)
        
        val paramSym = VarSymbol(Tree.Ident("retVal")) // will always receive unit
        val pList = PlainParamList.simple(paramSym :: Nil)
        
        val mainBod = if opt.stackSafety.isEmpty then cpsBod else
          val (cpsCont, rest) = createCpsCont(pList, cpsBod, paramSym)
          cpsId += 1
          val bod = blockBuilder
            .stackSafePre(cpsCont.asPath, Value.Lit(Tree.UnitLit(false)))
            .ret(Call(cpsCont.asPath, (Value.Lit(Tree.UnitLit(false)).asArg :: Nil) ne_:: Nil)(CallMetadata.defaultMlsFun))
          rest(bod)
        
        if fun.dSym.name === "main" then // hack
          // make a non-cps forwarder
          val nestedFun = FunDefn(
            N, BlockMemberSymbol("main_cps", Nil, true),
            TermSymbol(syntax.Fun, N, Tree.Ident("main_cps")),
            PlainParamList(Param.simple(contSym) :: Nil) :: Nil,
            mainBod
          )(N, Nil)
          val newBod = blockBuilder
            .scopedVars(Set(nestedFun.sym))
            .define(nestedFun)
            .ret(Call(nestedFun.asPath, (idPath.asArg :: Nil) ne_:: Nil)(CallMetadata.defaultMlsFun))
          FunDefn(
            fun.owner, fun.sym, fun.dSym, fun.params, newBod
          )(fun.configOverride, fun.annotations)
        else
          fun.copy(
            params = ogParams.copy(params = Param.simple(contSym) :: ogParams.params) :: Nil,
            body = mainBod
          )(fun.configOverride, fun.annotations)
    
    def checkCall(c: Call) =
      if c.argss.size != 1 then
        raise(WarningReport(
          msg"This call is not CPS-transformed because it has more than one argument list." -> c.toLoc :: Nil,
          source = Source.Compilation))
        false
      else
        EffectfulResult.unapply(c)
        
    
    override def applyPath(p: Path)(k: Path => Block): Block = p match
      case Value.RefLike(Elaborator.ctx.builtins.runtime.handle_suspension) =>
        k(State.runtimeSymbol.asPath.selN(Tree.Ident("cpsHandlerImpl")))
      case _ => super.applyPath(p)(k)
    
    def createCpsCont(pList: ParamList, bod: Block, param: VarSymbol) =
      val nme = "cpsCont$" + cpsId
      cpsId += 1
      if opt.stackSafety.isEmpty then 
        val (cpsCont, rest) = createNestedFn(nme, pList, bod)
        cpsId += 1
        (cpsCont, rest)
      else
        val bms = BlockMemberSymbol(nme, Nil, true)
        val tSym = TermSymbol(syntax.Fun, N, Tree.Ident(nme))
        val bodd = blockBuilder
          .stackSafePre(Value.MemberRef(bms, tSym), param.asPath)
          .rest(bod)
        val fnDef = FunDefn(N, bms, tSym, pList :: Nil, bodd)(N, Nil)
        val blk = (rest: Block) => Scoped(Set(bms), Define(fnDef, rest))
        (fnDef, blk)
          
      
    override def applyResult(r: Result)(k: Result => Block): Block =
      
      if inCtor then r match
        case c: Call if c.metadata.mayRaiseEffects && checkCall(c) =>
          k(Call(c.fun, (idPath.asArg :: c.argss.head) ne_:: Nil)(CallMetadata.defaultMlsFun))
        case _ => super.applyResult(r)(k)
      else r match
      case c @ Call(Value.RefLike(Elaborator.ctx.builtins.runtime.suspend), (tag :: handlerFun :: Nil) :: Nil) =>
        val paramSym = VarSymbol(Tree.Ident("retVal"))
        val pList = PlainParamList.simple(paramSym :: Nil)
        val bod = k(paramSym.asPath)
        val (cpsCont, rest) = createCpsCont(pList, bod, paramSym)
        cpsId += 1
        val call = Instantiate(
          true,
          State.runtimeSymbol.asPath.selN(Tree.Ident("Suspend")),
          (cpsCont.asPath.asArg :: tag :: handlerFun :: Nil) ne_:: Nil)(InstantiateMetadata.empty)
        rest(Return(call))
      // case c @ Call(Value.RefLike(Elaborator.ctx.builtins.runtime.handle_suspension), (tag :: bodyFun :: Nil) :: Nil) =>
      case c @ Call(path, args) if c.metadata.mayRaiseEffects =>
        if !checkCall(c) then
          super.applyResult(r)(k)
        else
          val paramSym = VarSymbol(Tree.Ident("retVal"))
          val pList = PlainParamList.simple(paramSym :: Nil)
          val bod = k(paramSym.asPath)
          val (cpsCont, rest) = createCpsCont(pList, bod, paramSym)
          cpsId += 1
          applyPath(path): path =>
            val call = Call(path, (cpsCont.asPath.asArg :: args.head) ne_:: Nil)(CallMetadata.defaultMlsFun)
            rest(Return(call))
      case _ => super.applyResult(r)(k)
    
    def retResult(r: Result) =
      val (pth, rst) = r match
        case p: Path => (p, id)
        case _ =>
          val tmp = TempSymbol(N)
          (tmp.asPath, blockBuilder.assignScoped(tmp, r))
      rst.ret(Call(curContPath, (pth.asArg :: Nil) ne_:: Nil)(CallMetadata.defaultMlsFun))
    
    override def applyBlock(b: Block): Block =
      
      if inCtor then super.applyBlock(b)
      else b match
      case Return(Call(Value.RefLike(Elaborator.ctx.builtins.runtime.suspend), args :: Nil)) =>
        Return(Instantiate(
          true,
          State.runtimeSymbol.asPath.selN(Tree.Ident("Suspend")),
          (curContPath.asArg :: args) ne_:: Nil)(InstantiateMetadata.empty))
      case Return(c: Call) if c.metadata.mayRaiseEffects =>
        if !checkCall(c) then
          retResult(c)
        else
          Return(Call(c.fun, (curContPath.asArg :: c.argss.head) ne_:: Nil)(CallMetadata.defaultMlsFun))
      case Return(r: Result) => retResult(r)
      case _: Label => lastWords("undesugared label")
      case b: Begin =>
        if !b.rest.isEmpty then
          lastWords("non-empty begin rest")
        super.applyBlock(b)
      case t: TryBlock => lastWords("unsupported")
      case m: Match =>
        if !m.rest.isEmpty then
          lastWords("non-empty match rest")
        super.applyBlock(b)
      case _ => super.applyBlock(b)
  
  def createNestedFn(name: String, params: ParamList, body: Block, nameIsMeaningful: Bool = true)(using State) =
    val bms = BlockMemberSymbol(name, Nil, nameIsMeaningful)
    val fnDef = FunDefn.withFreshSymbol(N, bms, params :: Nil, body)(N, Nil)
    val blk = (rest: Block) => Scoped(Set(bms), Define(fnDef, rest))
    (fnDef, blk)
  
  def translateTopLevel(b: Block): Block =
    val ret = cpsTransformer.applyBlock(blockNormalizer.applyBlock(b))
    // blockNormalizer.applyBlock(b)
    opt.stackSafety match
      case Some(ss) =>
        val (fn, rest) = createNestedFn("‹stack safe body›", PlainParamList(List.empty), ret, true)
        rest(Return(Call(
          runStackSafeCpsPath,
          (Value.Lit(Tree.IntLit(ss.stackLimit)).asArg :: fn.asPath.asArg :: Nil) ne_:: Nil
          )(CallMetadata.defaultMlsFun)
        ))
      case None => ret
    
  def translateProgram(prog: Program): Program =
    val transformed = translateTopLevel(prog.main)
    if transformed is prog.main then prog
    else
      Program(
        prog.imports,
        transformed
      )
