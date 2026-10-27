package hkmc2
package codegen
package handlers

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
import hkmc2.syntax.SpreadKind
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

class CpsHandlerLowering(paths: HandlerPaths, opt: Opt[EffectHandlers])(using TL, Raise, Elaborator.State, Elaborator.Ctx, Config):
  
  case class CpsCtx(defnsMap: Map[TermSymbol, FunDefn])

  val stackSafety = opt.exists(_.stackSafety.isDefined)
  
  var cpsId = 0
  
  val plus = State.builtinOpsMap("+").asSimpleRef
  val checkDepthCpsPath: Path = paths.runtimePath.selN(Tree.Ident("cpsSetCheckDepth"))
  val raiseStackPath: Path = paths.runtimePath.selN(Tree.Ident("cpsRaiseStack"))
  val runStackSafeCpsPath: Path = paths.runtimePath.selN(Tree.Ident("runStackSafeCps"))
  val cpsHandlerImplPath: Path = 
    if stackSafety then
      paths.runtimePath.selN(Tree.Ident("ss_cpsHandlerImpl"))
    else
      paths.runtimePath.selN(Tree.Ident("cpsHandlerImpl"))
  
  extension (builder: Block => Block)
    def stackSafePre(cont: Path, retVal: Path) =
      val tmp = TempSymbol(N, N)
      builder
        .assignScoped(tmp, Call(checkDepthCpsPath, Nil ne_:: Nil)(CallMetadata.defaultMlsFun, N))
        .ifthen(tmp.asPath, Case.Lit(Tree.BoolLit(true)), Return(Call(raiseStackPath, (cont.asArg :: retVal.asArg :: Nil) ne_:: Nil)(CallMetadata.defaultMlsFun, N)))
  
  def mapTail(b: Block)(f: BlockTail => Block): Block = b match
    case b: BlockTail => f(b)
    case Match(scrut, arms, dflt, rest) => Match(scrut, arms, dflt, mapTail(rest)(f))
    case Label(label, loop, body, rest) => Label(label, loop, body, mapTail(rest)(f))
    case Scoped(syms, body) => Scoped(syms, mapTail(body)(f))
    case Begin(sub, rest) => Begin(sub, mapTail(rest)(f))
    case TryCatch(sub, catchVar, catchBody, rst) => TryCatch(sub, catchVar, catchBody, mapTail(rst)(f))
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
        val (dfn, blk) = createNestedFn("rest", LoweredParamList.plain(Nil)(N), applyBlock(rest), true)
        def mkCall = Return(Call(dfn.asPath, Nil ne_:: Nil)(CallMetadata.mlsFunWithEffect, N))
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
          val (dfn, blk) = createNestedFn("rest", LoweredParamList.plain(Nil)(N), applyBlock(rest), true)
          def rewriteTail(arm: Block) = mapTail(arm):
            case End(_) => Return(Call(dfn.asPath, Nil ne_:: Nil)(CallMetadata.mlsFunWithEffect, N))
            case arm => arm
          Begin(blk(applyBlock(rewriteTail(sub))), End())
      
      case Label(label, loop, body, rest) if !rest.isEmpty =>
        if !loop then
          var used = false
          val (dfn, blk) = createNestedFn("rest", LoweredParamList.plain(Nil)(N), applyBlock(rest), true)
          def rewriteTail(arm: Block) = mapTail(arm):
            case End(_) =>
              used = true
              Return(Call(dfn.asPath, Nil ne_:: Nil)(CallMetadata.mlsFunWithEffect, N))
            case arm => arm
          thunks.addOne(label, () =>
            used = true
            dfn
          )
          // Both explicit breaks and normal fallthrough must invoke the label's continuation.
          val res = applyBlock(rewriteTail(body))
          if used then blk(res) else res
        else
          ???
      case Break(label) =>
        Return(Call(thunks(label)().asPath, Nil ne_:: Nil)(CallMetadata.mlsFunWithEffect, N))
      case Continue(label) => ???
      
      
      case _ => super.applyBlock(b)
  
  class CpsTransformer(isStackSafetyPass: Bool)(using ctx: CpsCtx) extends BlockTransformer(SymbolSubst()):
    
    val idPath = if stackSafety && !isStackSafetyPass then paths.runtimePath.selN(Tree.Ident("cpsId2")) else paths.runtimePath.selN(Tree.Ident("cpsId"))
    val resMetadata = if stackSafety && !isStackSafetyPass then CallMetadata.mlsFunWithEffect else CallMetadata.defaultMlsFun
    
    var curContPath: Path = idPath
    var inNativeCtx = true
    
    var substMap = Map[LocalVarSymbol, VarSymbol]()
    var thisFunSyms = Set[LocalVarSymbol]()
    
    inline def preserve[T](f: => T) =
      val saved = curContPath
      val savedInNativeCtx = inNativeCtx
      val savedSubstMap = substMap
      val savedFunSyms = thisFunSyms
      
      val ret = f
      
      curContPath = saved
      inNativeCtx = savedInNativeCtx
      substMap = savedSubstMap
      thisFunSyms = savedFunSyms
      ret
    
    def applyCpsOnFun(b: Block, contPath: Path, blockInNativeCtx: Bool): Block = preserve:
      curContPath = contPath
      inNativeCtx = blockInNativeCtx
      thisFunSyms = Set()
      applyScopedBlock(b)
    
    def applyCpsOnCtor(b: Block, isMod: Bool): Block = preserve:
      curContPath = idPath
      inNativeCtx = true
      thisFunSyms = Set()
      applyScopedBlock(b)
    
    override def applyScopedBlock(b: Block): Block =
      b match
        case Scoped(syms, _) => thisFunSyms = thisFunSyms.union(syms.collect { case s: LocalVarSymbol => s })
        case _ => ()
      super.applyScopedBlock(b)
    
    override def applyCtorBlock(b: Block, isModCtor: Bool): Block =
      applyCpsOnCtor(b, isModCtor)
    
    override def applyFunDefn(fun: FunDefn): FunDefn =
      
      val contSym = VarSymbol(Tree.Ident("k"), N)
      val (ogParams, remainingParams) = fun.params match
        case head :: next => (head, next)
        case Nil => (LoweredParamList.plain(Nil)(N), Nil)
      val native = fun.annotations.contains(Annot.Native)
      val cpsBod = applyCpsOnFun(fun.body, contSym.asPath, native)
      
      val mainBod = if !isStackSafetyPass then cpsBod else
        val paramSym = VarSymbol(Tree.Ident("retVal"), N) // will always receive unit
        val pList = LoweredParamList.plain(Param.simple(paramSym) :: Nil)(N)
        val (cpsCont, rest) = createCpsCont(pList, cpsBod, paramSym)
        cpsId += 1
        val bod = blockBuilder
          .stackSafePre(cpsCont.asPath, Value.Lit(Tree.UnitLit(false))(N))
          .ret(Call(cpsCont.asPath, (Value.Lit(Tree.UnitLit(false))(N).asArg :: Nil) ne_:: Nil)(resMetadata, N))
        rest(bod)
      
      if native then
        // make a non-cps forwarder
        val nestedFun = FunDefn(
          N, BlockMemberSymbol("main_cps", Nil, true),
          TermSymbol(syntax.Fun, N, Tree.Ident("main_cps"), N),
          LoweredParamList.plain(Param.simple(contSym) :: Nil)(N) :: Nil,
          mainBod
        )(N, Nil)
        val newBod = blockBuilder
          .scopedVars(Set(nestedFun.sym))
          .define(nestedFun)
          .ret(Call(nestedFun.asPath, (idPath.asArg :: Nil) ne_:: Nil)(resMetadata, N))
        FunDefn(
          fun.owner, fun.sym, fun.dSym, fun.params, newBod
        )(fun.configOverride, fun.annotations)
      else
        fun.copy(
          params = ogParams.copy(params = Param.simple(contSym) :: ogParams.params)(ogParams.toLoc) :: remainingParams,
          body = mainBod
        )(fun.configOverride, fun.annotations)
    
    def checkCall(c: Call) =
      if c.argss.length =/= 1 then c match
        case CallOrRefToFun(sym, args) =>
          if ctx.defnsMap.contains(sym) then ()
          else raise(WarningReport(
            msg"The function ${sym.toString} is not CPS-transformed because it has more than one parameter list and is not in the same compilation unit." -> sym.toLoc :: Nil,
            source = Source.Compilation))
        case _ => ()
      EffectfulResult.unapply(c)
        
    
    override def applyPath(p: Path)(k: Path => Block): Block = p match
      case Value.RefLike(Elaborator.ctx.builtins.runtime.handle_suspension) =>
        k(cpsHandlerImplPath)
      case Value.SimpleRef(l: LocalVarSymbol) => substMap.get(l) match
        case Some(value) => k(value.asSimpleRef)
        case None => super.applyPath(p)(k)
      case _ => super.applyPath(p)(k)
    
    override def applyAssignLhs(sym: Assignable): Assignable = sym match
      case sym: LocalVarSymbol => substMap.get(sym) match
        case S(value) => value
        case N => super.applyAssignLhs(sym)
      case NoSymbol => super.applyAssignLhs(sym)
    
    def createCpsCont(pList: LoweredParamList, bod: Block, param: VarSymbol) =
      val nme = "cpsCont$" + cpsId
      cpsId += 1
      if !isStackSafetyPass then 
        val (cpsCont, rest) = createNestedFn(nme, pList, bod)
        cpsId += 1
        (cpsCont, rest)
      else
        val bms = BlockMemberSymbol(nme, Nil, true)
        val tSym = TermSymbol(syntax.Fun, N, Tree.Ident(nme), N)
        val bodd = blockBuilder
          .stackSafePre(Value.MemberRef(bms, tSym)(N), param.asPath)
          .rest(bod)
        val fnDef = FunDefn(N, bms, tSym, pList :: Nil, bodd)(N, Nil)
        val blk = (rest: Block) => Scoped(Set(bms), Define(fnDef, rest))
        (fnDef, blk)
    
    override def applyResult(r: Result)(k: Result => Block): Block = r match
      case l @ Lambda(params, body) =>
        val contSym = VarSymbol(Tree.Ident("k"), N)
        
        val cpsBod = applyCpsOnFun(body, contSym.asPath, false)
        
        val mainBod = if !isStackSafetyPass then cpsBod else
          val paramSym = VarSymbol(Tree.Ident("retVal"), N) // will always receive unit
          val pList = LoweredParamList.plain(Param.simple(paramSym) :: Nil)(N)
          val (cpsCont, rest) = createCpsCont(pList, cpsBod, paramSym)
          cpsId += 1
          val bod = blockBuilder
            .stackSafePre(cpsCont.asPath, Value.Lit(Tree.UnitLit(false))(N))
            .ret(Call(cpsCont.asPath, (Value.Lit(Tree.UnitLit(false))(N).asArg :: Nil) ne_:: Nil)(resMetadata, N))
          rest(bod)
        
        val lam = Lambda(params.copy(params = Param.simple(contSym) :: params.params)(params.toLoc), mainBod)(l.annot, N)
        k(lam)
      case _ =>
        if inNativeCtx then r match
          case c: Call if c.metadata.mayRaiseEffects && checkCall(c) => applyPath(c.fun): newFun =>
            applyArgss(c.argss): newArgss =>
              val newCall = Call(newFun, (idPath.asArg :: newArgss.head) ne_:: newArgss.tail)(resMetadata, N)
              opt.flatMap(_.stackSafety) match
                case S(ss) if inNativeCtx && isStackSafetyPass =>
                  val (fn, rest) = createNestedFn("‹stack safe body›", LoweredParamList.plain(List.empty)(N), Return(newCall), true)
                  rest(k(Call(
                    runStackSafeCpsPath,
                    (Value.Lit(Tree.IntLit(ss.stackLimit))(N).asArg :: fn.asPath.asArg :: Nil) ne_:: Nil
                    )(CallMetadata.defaultMlsFun, N)
                  ))
                case _ => k(newCall)
          case _ => super.applyResult(r)(k)
        else r match
        case c @ Call(Value.RefLike(Elaborator.ctx.builtins.runtime.suspend), (tag :: handlerFun :: Nil) :: Nil) =>
          val paramSym = VarSymbol(Tree.Ident("retVal"), N)
          val pList = LoweredParamList.plain(Param.simple(paramSym) :: Nil)(N)
          val bod = k(paramSym.asPath)
          val (cpsCont, rest) = createCpsCont(pList, bod, paramSym)
          cpsId += 1
          val call = Instantiate(
            true,
            State.runtimeSymbol.asPath.selN(Tree.Ident("CpsSuspend")),
            (cpsCont.asPath.asArg :: tag :: handlerFun :: Nil) ne_:: Nil)(InstantiateMetadata.empty, N)
          rest(Return(call))
        // case c @ Call(Value.RefLike(Elaborator.ctx.builtins.runtime.handle_suspension), (tag :: bodyFun :: Nil) :: Nil) =>
        case c @ Call(path, args) if c.metadata.mayRaiseEffects =>
          if !checkCall(c) then
            super.applyResult(r)(k)
          else
            val paramSym = VarSymbol(Tree.Ident("retVal"), N)
            val pList = LoweredParamList.plain(Param.simple(paramSym) :: Nil)(N)
            val bod = k(paramSym.asPath)
            val (cpsCont, rest) = createCpsCont(pList, bod, paramSym)
            cpsId += 1
            applyPath(path): path =>
              applyArgss(args): newArgss =>
                val call = Call(path, (cpsCont.asPath.asArg :: newArgss.head) ne_:: newArgss.tail)(resMetadata, N)
                rest(Return(call))
        case _ => super.applyResult(r)(k)
    
    def retResult(r: Result) =
      applyResult(r): newR =>
        val (pth, rst) = newR match
          case p: Path => (p, id)
          case _ =>
            val tmp = TempSymbol(N, N)
            (tmp.asPath, blockBuilder.assignScoped(tmp, newR))
        rst.ret(Call(curContPath, (pth.asArg :: Nil) ne_:: Nil)(resMetadata, N))
    
    override def applyBlock(b: Block): Block =
      if inNativeCtx then super.applyBlock(b)
      else b match
      case Assign(lhs, c @ Call(path, args), rest_) if
          c.metadata.mayRaiseEffects
          && !inNativeCtx =>
        def rewriteAssign: Block =
          if !checkCall(c) then
            super.applyBlock(b)
          else
            lazy val paramSym = VarSymbol(Tree.Ident(lhs.nme), N)
            lhs match
              case lhs: LocalVarSymbol =>
                if thisFunSyms.contains(lhs) then substMap = substMap + (lhs -> paramSym)
                else return super.applyBlock(b)
              case NoSymbol => ()
            val pList = LoweredParamList.plain(Param.simple(paramSym) :: Nil)(N)
            val bod = applyBlock(rest_)
            val (cpsCont, rest) = createCpsCont(pList, bod, paramSym)
            cpsId += 1
            applyPath(path): path =>
              applyArgss(args): newArgss =>
                val call = Call(path, (cpsCont.asPath.asArg :: newArgss.head) ne_:: newArgss.tail)(resMetadata, N)
                rest(Return(call))
        preserve(rewriteAssign)
      case Return(Call(Value.RefLike(Elaborator.ctx.builtins.runtime.suspend), args :: Nil)) =>
        applyArgs(args): newArgs =>
          Return(Instantiate(
            true,
            State.runtimeSymbol.asPath.selN(Tree.Ident("CpsSuspend")),
            (curContPath.asArg :: newArgs) ne_:: Nil)(InstantiateMetadata.empty, N))
      case Return(c: Call) if c.metadata.mayRaiseEffects =>
        if !checkCall(c) then
          retResult(c)
        else
          applyPath(c.fun): newPath =>
            applyArgss(c.argss): newArgss =>
              Return(Call(newPath, (curContPath.asArg :: newArgss.head) ne_:: newArgss.tail)(resMetadata, N))
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
  
  def createNestedFn(name: String, params: LoweredParamList, body: Block, nameIsMeaningful: Bool = true)(using State) =
    val bms = BlockMemberSymbol(name, Nil, nameIsMeaningful)
    val fnDef = FunDefn.withFreshSymbol(N, bms, params :: Nil, body)(N, Nil)
    val blk = (rest: Block) => Scoped(Set(bms), Define(fnDef, rest))
    (fnDef, blk)
  
  def translateTopLevel(b: Block): Block =
    val expander = new SimpleEtaExpander
    val normalized = blockNormalizer.applyBlock(b)
    val lifted = Lifter(normalized).transform
    val defnsMap = expander.gatherDefns(lifted)
    val expanded = expander.rewrite(lifted, defnsMap)
    given CpsCtx = CpsCtx(defnsMap)
    val cpsTransformer = new CpsTransformer(false)
    val ret = cpsTransformer.applyBlock(expanded)
    // blockNormalizer.applyBlock(b)
    opt.flatMap(_.stackSafety) match
      case Some(ss) =>
        val ssCpsTransformer = new CpsTransformer(true)
        ssCpsTransformer.applyBlock(ret)
      case None => ret
    
  def translateProgram(prog: Program): Program =
    if opt.isEmpty then prog else
      val transformed = translateTopLevel(prog.main)
      if transformed is prog.main then prog
      else
        Program(
          prog.imports,
          transformed
        )

object CallOrRefToFun:
  def unapply(r: Result): Opt[(TermSymbol, Ls[Ls[Arg]])] = r match
    case c @ Call(fun = Value.MemberRef(_, r: TermSymbol)) => S(r, c.argss)
    case c @ Call(fun = s: Select) => s.symbol match
      case Some(r: TermSymbol) => S(r, c.argss)
      case _ => N
    case Value.MemberRef(_, t: TermSymbol) => S(t, Nil)
    case _ => N

// Note: The CPS transformation requires that all calls to functions with multiple parameter lists happen within the compilation unit.
class SimpleEtaExpander(using TL, Raise, Elaborator.State, Elaborator.Ctx, Config):
  
  private def dupParam(p: Param): Param = p.copy(sym = VarSymbol(Tree.Ident(p.sym.nme), N))(p.toLoc)
  private def dupParams(plist: List[Param]): List[Param] = plist.map(dupParam)
  private def dupParamList(plist: LoweredParamList): LoweredParamList =
    plist.copy(params = dupParams(plist.params), restParam = plist.restParam.map(dupParam))(plist.toLoc)
  
  def gatherDefns(b: Block) =
    val defns = mutable.Map[TermSymbol, FunDefn]()
    val traverser = new BlockTraverser:
      override def applyFunDefn(fun: FunDefn): Unit =
        defns.addOne(fun.dSym, fun)
      applyBlock(b)
    defns.toMap
  def rewrite(b: Block, fnMap: Map[TermSymbol, FunDefn]): Block =
    val rewriter = new BlockTransformer(SymbolSubst.Id):
      def applyCallOrRef(fn: FunDefn, args: Ls[Ls[Arg]], default: => Block)(k: Result => Block): Block =
        val fnParamNum = fn.params.size
        val callParamNum = args.size
        if fnParamNum === 0 then default
        else if fnParamNum === 1 && callParamNum === 0 then default
        else if fnParamNum < callParamNum then die
        else if fnParamNum === callParamNum then default
        else
          val remainingParams = fn.params.drop(callParamNum)
          
          val duped = remainingParams.map(dupParamList)
          
          val remainingArgs = (duped zip remainingParams).map: (pA, pB) =>
            (pA.restParam, pB.restParam) match
              case (S(rA), S(rB)) =>
                val lastArg = Arg(S(SpreadKind.Eager), rA.sym.asPath)
                pA.params.foldRight(lastArg :: Nil)(_.sym.asPath.asArg :: _)
              case (N, N) => pA.params.map(_.sym.asPath.asArg)
              case _ => die
          val finalCall = Call(fn.asPath, (args ::: remainingArgs).ne_!)(CallMetadata.mlsFunWithEffect, N)
          k(duped.foldRight(finalCall)((paramList, acc) => Lambda(paramList, Return(acc))(Nil, N)))
          
      override def applyResult(r: Result)(k: Result => Block): Block = r match
        case CallOrRefToFun(fnSym, args) if fnMap.contains(fnSym) =>
          r match
            case c: Call if c.metadata.mayRaiseEffects =>
              val fn = fnMap(fnSym)
              applyCallOrRef(fn, args, super.applyResult(r)(k))(k)
            case _ => super.applyResult(r)(k) // this shouldn't happen
        case _ => super.applyResult(r)(k)
      override def applyPath(p: Path)(k: Path => Block): Block = p match
        case CallOrRefToFun(fnSym, args) if fnMap.contains(fnSym) =>
          val fn = fnMap(fnSym)
          applyCallOrRef(fn, args, super.applyPath(p)(k)): r =>
            val sym = TempSymbol(N, N)
            blockBuilder.assignScoped(sym, r).rest(k(sym.asPath))
        case _ => super.applyPath(p)(k)
    val res = rewriter.applyBlock(b)
    if res === b then b else res
