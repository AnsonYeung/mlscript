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
import hkmc2.codegen.handlers.StraightLineCodegen
import hkmc2.codegen.handlers.ClassCodegen

object HandlerLowering:

  abstract class Strategy:
    def beginUnwind(using State): Block
    def effectfulCallToInternal(loweringCtx: LoweringCtx, p: Path, k: Result => Block)(using State): Block

  abstract class ExoticStrategy extends Strategy:
    override def beginUnwind(using State): Block =
      Return(unit)
    override def effectfulCallToInternal(loweringCtx: LoweringCtx, p: Path, k: Result => Block)(using State): Block =
      k(p)

  case class IfCheck() extends Strategy:
    override def beginUnwind(using State): Block =
      Return(unit)
    override def effectfulCallToInternal(loweringCtx: LoweringCtx, p: Path, k: Result => Block)(using State): Block =
      k(Call(p, Nil ne_:: Nil)(CallMetadata.mlsFunWithEffect))

  case class ExceptionRethrow() extends Strategy:
    override def beginUnwind(using State): Block =
      Throw(State.runtimeSymbol.asSimpleRef.selSN("EffectException"))
    override def effectfulCallToInternal(loweringCtx: LoweringCtx, p: Path, k: Result => Block)(using State): Block = 

      val tmp = loweringCtx.registerTempSymbol(N)
      val err = new TempSymbol(N, "e")
      TryCatch(
        Assign(tmp, Call(p, Nil ne_:: Nil)(CallMetadata.mlsFunWithEffect), End()),
        err,
        Assign(tmp, Call(State.runtimeSymbol.asSimpleRef.selSN("effectRethrow"), (Arg(N, err.asSimpleRef) :: Nil) ne_:: Nil)(CallMetadata.mlsFunWithEffect), End()),
        k(tmp.asSimpleRef)
      )
  
  case class DoubleCompilation() extends Strategy:
    override def beginUnwind(using State): Block =
      Return(unit)
    override def effectfulCallToInternal(loweringCtx: LoweringCtx, p: Path, k: Result => Block)(using State): Block =
      k(Call(p, Nil ne_:: Nil)(CallMetadata.mlsFunWithEffect))
  
  case class Generator() extends ExoticStrategy
  
  def currentStrategy(using Config): Strategy =
    config.effectHandlers.fold(noneStrategy)(_.strategy)
  
  val defaultStrategy = IfCheck()
  val nofibEffectHandlers: Opt[EffectHandlers] = S(EffectHandlers(
    strategy = defaultStrategy,
    debug = false,
    stackSafety = S(Config.StackSafety(100)),
    false,
    false,
    false,
  ))

  // This will be used when compiling Runtime.mls
  // Used for resolving internals.* stubs
  val runtimeStrategy = defaultStrategy
  val noneStrategy = runtimeStrategy

  private val pcIdent: Tree.Ident = Tree.Ident("pc")
  private val nextIdent: Tree.Ident = Tree.Ident("next")
  private val lastIdent: Tree.Ident = Tree.Ident("last")
  private val contTraceIdent: Tree.Ident = Tree.Ident("contTrace")
  def unit = Value.Lit(Tree.UnitLit(true))
  def intLit(i: BigInt) = Value.Lit(Tree.IntLit(i))

  def locToStr(loc: Loc) =
    val (line, _, col) = loc.origin.fph.getLineColAt(loc.spanStart)
    Value.Lit(Tree.StrLit(s"${loc.origin.fileName.last}:${line + loc.origin.startLineNum - 1}:$col"))
  
  extension (p: Path)
    def pc = p.selN(pcIdent)
    def value = p.selN(Tree.Ident("value"))
    def next = p.selN(nextIdent)
    def last = p.selN(lastIdent)
    def contTrace = p.selN(contTraceIdent)
  
  type FnOrCls = Either[BlockMemberSymbol, DefinitionSymbol[? <: ClassLikeDef] & InnerSymbol]

  enum HandlerCtx:
    case FunctionLike(ctx: FunctionCtx)
    case Ctor
    case ModCtor(trulyNested: Bool)
    case TopLevel

    // Since constructors are not named, they cannot be resumed
    def inCtor = this === Ctor || this.isInstanceOf[ModCtor]
    def currentBlockIsTrulyNested = this match
      case FunctionLike(_) => true
      case Ctor => true
      case ModCtor(trulyNested) => trulyNested
      case TopLevel => false
    def inAsync = this match
      case FunctionLike(ctx) => ctx.inAsync
      case _ => false
    
  
  // currentFun: path to the current function for resumption
  // thisPath: path to `this` binding if the function is a method, `this` will be rebinded on resumption
  case class FunctionCtx(currentFun: Path, thisPath: Option[Value.This], resumeInfo: ResumeInfo, debugInfo: DebugInfo, inGetter: Bool, inAsync: Bool)(using State):
    val rVar = VarSymbol(Tree.Ident("resumeVar"))
    var contClass: Opt[ClsLikeDefn] = N
    def unwindCall(loc: Value, state: Path, restoreList: List[LocalVarSymbol])(using paths: HandlerPaths) =
      Call(paths.unwindPath, (
        currentFun ::
        state ::
        loc ::
        debugInfo.debugInfoPath ::
        thisPath.getOrElse(unit) ::
        resumeInfo.argLists ++:
        (intLit(restoreList.length) ::
        restoreList.map(_.asPath))
      ).map(_.asArg) ne_:: Nil)(CallMetadata.mlsFunWithEffect)
    def doUnwind(loc: Value, state: Path, restoreList: List[LocalVarSymbol])(using paths: HandlerPaths) =
      Return(unwindCall(loc, state, restoreList)(using paths))
    def addContCompanion(b: Block): Block =
      contClass match
      case N => b
      case S(cd: ClsLikeDefn) => Scoped(Set.single(cd.sym), Define(cd, b))
  
  // argLists: length-encoded argument list used for resumption.
  // currentLocals: All locals to be saved and reloaded, this cannot include any variables in outer scopes
  // allArgs: All arguments, as an alternative to argLists. Used only in double compilation
  // currentStackSafetySym: The symbol to be used for stack safety
  case class ResumeInfo(
    argLists: List[Path],
    currentLocals: List[LocalVarSymbol],
    allArgs: List[LocalVarSymbol],
    currentStackSafetySym: FnOrCls,
  )
  
  case class DebugInfo(
    debugNme: Str,
    debugInfoPath: Path,
  )

  object EffectfulResult:
    def unapply(r: Result)(using Config, State): Bool = r match
      case c: Call if c.metadata.mayRaiseEffects =>
        if c.metadata.isNative then return false
        if c.metadata.annotations.contains(Annot.RaiseEffects) then return true
        c.fun match
          case Value.MemberRef(_, c: ClassCtorSymbol) => false
          case s: Select if s.symbol.map(x => x.isInstanceOf[ClassCtorSymbol]).getOrElse(false) => config.checkInstantiateEffect
          case s: Select if s.name.name === "toString" => false
          case s: Select if s.symbol.isEmpty =>
            true
          case s @ Select(Value.MemberRef(bms, disamb), _) if bms.nme === "Predef" =>
            s.symbol.exists(_.irDefn.exists(_.annotations.contains(Annot.RaiseEffects)))
          case Value.RefLike(State.superSymbol) => config.checkInstantiateEffect
          case _ => true
      case _: Instantiate if config.checkInstantiateEffect => true
      case _ => false
  
  type StateId = BigInt
  
  class IdAllocator:
    var id: Int = 0
    def apply() =
      val tmp = id
      id += 1
      tmp
  
  // blk: the block of code within this state
  case class BlockPartition(blk: Block, resumable: Bool)
  case class PartitionedBlock(
    entry: StateId,
    states: Map[StateId, BlockPartition],
    resultMap: ResultMap,
    allocId: IdAllocator,
    needsStackSafety: Bool,
    containsError: Bool
  )
  
  type ResultMap = collection.Map[Identity[Result], StateId]
  
  class SharedState(val opt: Opt[EffectHandlers])(using Elaborator.State, Config):
    val useExceptions = opt.exists(_.strategy.isInstanceOf[ExceptionRethrow])
    val estate = summon[Elaborator.State]
    val cfg = summon[Config]
    def freshTmp(dbgNme: Str = "tmp") = new TempSymbol(N, dbgNme)
    def freshLabel(nme: Str) = new LabelSymbol(N, nme)
    // First assign res to resumeValue, then jump to pc, possibly unwinding.
    object StateTransition:
      private val transitionSymbol = freshTmp("transition")
      private val resultSymbol = freshTmp("result")
      def apply(res: Opt[Result], uid: StateId) =
        val pre = res match
          case N => blockBuilder.assign(transitionSymbol, unit)
          case S(r) => blockBuilder.assign(resultSymbol, r)
        pre.ret(Value.Lit(Tree.IntLit(uid)))
      def unapply(blk: Block) = blk match
        case Assign(`transitionSymbol`, _, Return(Value.Lit(Tree.IntLit(uid)))) =>
          S((N, uid))
        case Assign(`resultSymbol`, res, Return(Value.Lit(Tree.IntLit(uid)))) =>
          S((S(res), uid))
        case _ => N
  
  case class FlattenCtx(
    parts: PartitionedBlock,
    ctx: FunctionCtx,
    pcVar: LocalVarSymbol,
    vars: List[LocalVarSymbol], // Saved
    scopedVars: collection.Set[ScopedSymbol], // All
    postTransform: ((Opt[Result], StateId) => Block) => BlockTransformer,
    fallbackPostTransform: BlockTransformer,
    needsStackSafety: Bool,
  )

import HandlerLowering.*

class HandlerPaths(using Elaborator.State):
  val plus = State.builtinOpsMap("+").asSimpleRef
  val runtimePath: Path = State.runtimeSymbol.asSimpleRef
  val contClsPath: Path = runtimePath.selSN("FunctionContFrame").selSN("class")
  val mkEffectPath: Path = runtimePath.selSN("mkEffect")
  val handleBlockImplPath: Path = runtimePath.selSN("handleBlockImpl")
  val stackDelayClsPath: Path = runtimePath.selSN("StackDelay")
  val topLevelEffectPath: Path = runtimePath.selSN("topLevelEffect")
  val illegalEffectPath: Path = runtimePath.selSN("illegalEffect")
  val enterHandleBlockPath: Path = runtimePath.selSN("enterHandleBlock")
  val stackDepthIdent = new Tree.Ident("stackDepth")
  val stackDepthPath: Select = runtimePath.selN(stackDepthIdent)
  val checkDepthPath: Path = runtimePath.selN(Tree.Ident("checkDepth"))
  val runStackSafePath: Path = runtimePath.selN(Tree.Ident("runStackSafe"))
  val fnLocalsPath: Path = runtimePath.selSN("FnLocalsInfo").selSN("class")
  val localVarInfoPath: Path = runtimePath.selSN("LocalVarInfo").selSN("class")
  val curEffect: Path = runtimePath.selSN("curEffect")
  val unwindPath: Path = runtimePath.selSN("unwind")
  val unwindFramedPath: Path = runtimePath.selSN("unwindFramed")
  val resetEffects: Path = runtimePath.selSN("resetEffects")
  val resumePc: Path = runtimePath.selSN("resumePc")
  val resumeIdx: Path = runtimePath.selSN("resumeIdx")
  val resumeValueIdent = new Tree.Ident("resumeValue")
  val resumeValue: Path = runtimePath.selN(resumeValueIdent)

class HandlerLowering(paths: HandlerPaths, opt: Opt[EffectHandlers])(using TL, Raise, Elaborator.State, Elaborator.Ctx, Config):

  val ExceptionToggle = opt.exists(_.strategy.isInstanceOf[ExceptionRethrow])
  val DoubleCompilation = opt.exists(_.strategy.isInstanceOf[DoubleCompilation])
  
  val debugEnabled = opt.exists(_.debug)
  val stackSafety = opt.flatMap(_.stackSafety)
  
  val hctx = SharedState(opt)
  import hctx._
  
  private def rtThrowMsg(msg: Str) = Throw(
    Instantiate(mut = false, State.globalThisSymbol.asThis.selN(Tree.Ident("Error")),
    (Value.Lit(Tree.StrLit(msg)).asArg :: Nil) :: Nil)(InstantiateMetadata.empty)
  )
  
  object PureCall:
    def apply(fun: Path, args: List[Path]) = Call(fun, args.map(Arg(N, _)) ne_:: Nil)(CallMetadata.defaultMlsFun)
    def unapply(res: Result) = res match
      case Call(fun, args :: Nil) => args.foldRight[Opt[List[Path]]](S(Nil)): (arg, acc) =>
          acc.flatMap: acc =>
            arg match
              case Arg(N, p) => S(p :: acc)
              case _ => N
        .map((fun, _))
      case _ => N

  abstract class LazyId extends Lazy[StateId]:
    def isUsed: Bool = !isEmpty
    def transitionOrBlk(blk: => Block) =
      if isEmpty then blk else StateTransition(N, force_!)
  
  private def partitionBlock(blk: Block)(using ctx: FunctionCtx): PartitionedBlock =
    val result = mutable.HashMap.empty[StateId, BlockPartition]
    val labelIds = mutable.HashMap.empty[LabelSymbol, (LazyId, LazyId)]
    val resultMap = mutable.HashMap.empty[Identity[Result], StateId]
    val allocId = new IdAllocator()
    var needsStackSafety = false
    var containsError = false

    // * blk: The block to transform
    // * partitioned: whether we are already in a partitioned state
    // *              if we are not partitioned, we do not need to jump to afterEnd,
    // *              this is because we are still in the original block, which shares
    // *              the same code path.
    // * labelIds: maps label IDs to the state at the start of the label and the state after the label
    // * afterEnd: The block that follows End, None if the function ends.
    def go(blk: Block)(using afterEnd: Option[LazyId], partitioned: Bool): Block = boundary:
      // First check if the current block contain any non trivial call, if so we need a partition

      def forceId(blk: Block, resumable: Bool): StateId = blk match
        case StateTransition(N, uid) if result.contains(uid) =>
          if !result(uid).resumable && resumable then
            result(uid) = BlockPartition(result(uid).blk, true)
          uid
        case _ =>
          val id = allocId()
          result(id) = BlockPartition(blk, resumable)
          id

      def doNewEffectPartition(res: Result, rst: Block) =
        val stateId = forceId(go(rst)(using partitioned = true), true)
        resultMap(Identity(res)) = stateId
        boundary.break(StateTransition(S(res), stateId))
      class RestLazyId(rst: Block) extends LazyId:
        def compute: StateId = forceId(go(rst)(using partitioned = true), false)
        def transitionSoft: Block = transitionOrBlk(go(rst))

      val nonTrivialBlockChecker = new BlockDataTransformer(SymbolSubst.Id):
        override def applyBlock(b: Block) = b match
          // Special handling for tail calls
          case Return(EffectfulResult()) =>
            needsStackSafety = true
            b // Prevents the recursion into applyResult
          case _ => super.applyBlock(b)
        override def applyResult(r: Result)(k: Result => Block) = r match
          case r @ EffectfulResult() =>
            needsStackSafety = true
            doNewEffectPartition(r, k(if DoubleCompilation then ctx.rVar.asSimpleRef else paths.resumeValue))
          case _ => super.applyResult(r)(k)
      
      // If current block contains direct effectful result the following call will early exit.
      nonTrivialBlockChecker.applyBlock(blk)

      blk match

      case Match(scrut, arms, dflt, rest) =>
        val restId = RestLazyId(rest)
        val newArms = arms.map((cse, blkk) => (cse, go(blkk)(using afterEnd = S(restId))))
        val newDflt = dflt.map(blkk => go(blkk)(using afterEnd = S(restId)))
        Match(scrut, newArms, newDflt, restId.transitionSoft)

      case Label(label, loop, body, rest) =>
        val restId = RestLazyId(rest)
        val startId = new LazyId:
          def compute = allocId()
        labelIds(label) = (startId, restId)
        val newBody = go(body)(using S(restId))
        if startId.isUsed then
          // We break down the label, and force the usage of rest so that all Break will be rewritten later
          result(startId.force_!) = BlockPartition(Begin(newBody, StateTransition(N, restId.force_!)), false)
          StateTransition(N, startId.force_!)
        else
          Label(label, loop, newBody, restId.transitionSoft)

      case Break(label) =>
        val (start, end) = labelIds.get(label) match
          case N => raise(InternalError(
            msg"Could not find label '${label.nme}'" ->
            label.toLoc :: Nil,
            source = Diagnostic.Source.Compilation))
            return blk
          case S(value) => value
        if partitioned then
          StateTransition(N, end.force_!)
        else
          // We might still need to do a StateTransition if the label is broken down.
          // This is done afterwards in a replacement pass.
          Break(label)

      case Continue(label) =>
        val (start, end) = labelIds.get(label) match
          case N => raise(InternalError(
            msg"Could not find label '${label.nme}'" ->
            label.toLoc :: Nil,
            source = Diagnostic.Source.Compilation))
            return blk
          case S(value) => value
        if partitioned then
          StateTransition(N, start.force_!)
        else
          // Same as above.
          Continue(label)

      case Begin(sub, rest) =>
        val restId = RestLazyId(rest)
        val newSub = go(sub)(using afterEnd = S(restId))
        Begin(newSub, restId.transitionSoft)

      case u: Unreachable => u
      
      case End(_) =>
        if partitioned then
          afterEnd.fold(blk)(id => StateTransition(N, id.force_!))
        else
          blk

      // identity cases

      case Define(defn, rest) => Define(defn, go(rest))
      case Assign(lhs, rhs, rest) => Assign(lhs, rhs, go(rest))
      case blk @ AssignField(lhs, nme, rhs, rest) => AssignField(lhs, nme, rhs, go(rest))(blk.symbol)
      case AssignDynField(lhs, fld, arrayIdx, rhs, rest) => AssignDynField(lhs, fld, arrayIdx, rhs, go(rest))
      case _: Return => blk

      // ignored cases
      case TryBlock(sub, finallyDo, rest) =>
        containsError = true
        Lowering.fail(ErrorReport(
          msg"`try`-`finally` blocks are not currently supported with effect handlers enabled." ->
          N :: Nil,
          source = Diagnostic.Source.Compilation))
      case TryCatch(sub, catchVar, catchBody, rest) =>
        containsError = true
        Lowering.fail(ErrorReport(
          msg"`try`-`catch` blocks are not currently supported with effect handlers enabled." ->
          N :: Nil,
          source = Diagnostic.Source.Compilation))
      case Throw(_) => blk
      case Scoped(_, body) => go(body) // PreHandlerLowering

    val initId = allocId()
    // Note: initial part will only be resumed if stack safety is on.
    val initPart = BlockPartition(go(blk)(using N, false), stackSafety.isDefined)
    result(initId) = initPart

    val replaceStaleLabels = new BlockTransformerShallow(SymbolSubst.Id):
      override def applyBlock(b: Block): Block = b match
        case Break(label) if labelIds(label)._2.isUsed => StateTransition(N, labelIds(label)._2.force_!)
        case Continue(label) if labelIds(label)._1.isUsed => StateTransition(N, labelIds(label)._1.force_!)
        case _ => super.applyBlock(b)
    val newMap = Map.from(result.map: (id, part) =>
      id -> BlockPartition(replaceStaleLabels.applyBlock(part.blk), part.resumable))
    PartitionedBlock(initId, newMap, resultMap, allocId, needsStackSafety, containsError)

  private def computeRestoreList(parts: PartitionedBlock)(using ctx: FunctionCtx): List[LocalVarSymbol] =
    // We compute the restore list by taking the union of live variables at each resumption point
    // The live variable analysis uses a classic work list approach
    val locals = ctx.resumeInfo.currentLocals

    val localSetMap = locals.zipWithIndex.toMap
    val allocId = parts.allocId

    type PartitionVarInfo = (used: mutable.BitSet, assigned: mutable.BitSet, outgoing: List[StateId])
    val states = mutable.HashMap.from(parts.states)
    val labelMap = mutable.HashMap.empty[LabelSymbol, (StateId, StateId)]

    def createState(blk: Block): StateId =
      val newId = allocId()
      states(newId) = BlockPartition(blk, false)
      newId

    def computeVarInfo(blk: Block): PartitionVarInfo =
      // Variables that are assigned in the block
      val assigned = mutable.BitSet.empty
      // Variables that are used before any assignment in the block, which means they must be live
      val used = mutable.BitSet.empty
      val outgoing = mutable.HashSet.empty[StateId]

      def assignToSym(l: LocalVarSymbol) =
        localSetMap.get(l).foreach: idx =>
          assigned += idx

      new BlockTraverserShallow():
        applyBlock(blk)
        override def applyBlock(b: Block): Unit = b match
          case StateTransition(r, uid) =>
            r.foreach(applyResult)
            outgoing += uid
          case Match(scrut, arms, dflt, rest) =>
            applyPath(scrut)
            val restId = createState(rest)
            arms.foreach: arm =>
              val newId = createState(Begin(arm._2, StateTransition(N, restId)))
              outgoing += newId
            dflt match
              case N => outgoing += restId
              case S(blk) =>
                outgoing += createState(Begin(blk, StateTransition(N, restId)))
          case Label(label, loop, body, rest) =>
            val restId = createState(rest)
            val bodyId = createState(Begin(body, StateTransition(N, restId)))
            labelMap(label) = (bodyId, restId)
            outgoing += bodyId
          case Break(label) =>
            outgoing += labelMap(label)._2
          case Continue(label) =>
            outgoing += labelMap(label)._1
          case Assign(lhs, rhs, rest) =>
            applyResult(rhs)
            lhs match
            case lhs: LocalVarSymbol => assignToSym(lhs)
            case NoSymbol =>
            applyBlock(rest)
          case Define(defn: ValDefn, rest) =>
            applyPath(defn.rhs)
            applyBlock(rest)
          case Define(defn, rest) =>
            applyBlock(rest)
          case _ => super.applyBlock(b)
        override def applySymbol(sym: Symbol): Unit =
          sym match
          case sym: LocalVarSymbol =>
            localSetMap.get(sym).foreach: idx =>
              if !assigned.contains(idx) then
                used += idx
          case _ =>

      (used, assigned, outgoing.toList)

    val worklist = mutable.Queue.empty[StateId]
    val worklistSet = mutable.Set.empty[StateId]
    val stateInfo = mutable.HashMap.empty[StateId, (live: mutable.BitSet, varInfo: PartitionVarInfo, incoming: mutable.ArrayBuffer[StateId])]

    def traverse(id: StateId): Unit =
      if stateInfo.contains(id) then return ()
      val info = computeVarInfo(states(id).blk)
      stateInfo(id) = (mutable.BitSet.empty, info, mutable.ArrayBuffer.empty)
      info.outgoing.foreach: entry =>
        traverse(entry)
        stateInfo(entry).incoming += id
      worklist.enqueue(id)
      worklistSet += id

    traverse(parts.entry)

    while worklist.nonEmpty do
      val cur = worklist.dequeue()
      worklistSet -= cur
      val info = stateInfo(cur)
      val newLive = info.varInfo.outgoing
        .map: entry =>
          stateInfo(entry).live
        .fold(mutable.BitSet.empty)(_ | _).diff(info.varInfo.assigned) | info.varInfo.used
      if newLive != info.live then
        stateInfo(cur).live |= newLive
        stateInfo(cur).incoming.foreach: id =>
          if !worklistSet.contains(id) then
            worklist.enqueue(id)
            worklistSet += id

    parts.states
      .flatMap: (id, part) =>
        if !part.resumable then N
        else
          S(stateInfo.get(id).fold(mutable.BitSet.empty)(_.live))
      .fold(mutable.BitSet.empty)(_ | _)
      .toList
      .map(locals(_))

  private def lifterReport(using Line, FileName)(msgs: Ls[Message -> Opt[Loc]])(using Name) =
    if opt.fold(false)(_.softLifterError) then
      WarningReport(msgs, source = Diagnostic.Source.Compilation)
    else
      InternalError(msgs, source = Diagnostic.Source.Compilation)

  /**
   * The actual translation:
   * 1. rewrite handler blocks in terms of classes and functions (directly during Lowering)
   * 2. class lifter
   * 3. state machine transformation of all functions (HandlerLowering, this class)
   *    a) translate nested definition (pre translate)
   *    b) partitioning
   *    c) translate code in current block (post translate)
   */

  private def translateBlock(blk: Block, h: HandlerCtx, scopedVars: collection.Set[ScopedSymbol]): Block =
    given HandlerCtx = h

    def translateFunLike(fun: FunDefn, funcPath: Path, thisPath: Option[Value.This], debugNme: Str) =
      val scopedVars = fun.body.scopedVars
      val varList = scopedVars.collect:
        case sym: LocalVarSymbol => sym
      val sortedVars = varList.toList.sortBy(_.uid)
      val debugInfo = Value.Lit(Tree.StrLit(debugNme)).asArg :: sortedVars.zipWithIndex.filter(_._1.isInstanceOf[VarSymbol])
        .flatMap: (sym, idx) =>
          List(intLit(idx), Value.Lit(Tree.StrLit(sym.nme)))
        .map(_.asArg)
      val debugInfoSym = freshTmp(s"$debugNme$$debugInfo")
      // TODO: properly support spread argument by calculating the correct length.
      val rtArgLists = intLit(fun.params.length) :: fun.params.flatMap: pl =>
        intLit(pl.params.length) :: pl.params.map(p => p.sym.asSimpleRef)
      val allArgs = fun.params.flatMap(pl => pl.paramSyms)
      val newCtx: HandlerCtx.FunctionLike = HandlerCtx.FunctionLike(FunctionCtx(funcPath, thisPath, ResumeInfo(rtArgLists, sortedVars, allArgs, L(fun.sym)),
        DebugInfo(debugNme, if debugEnabled then debugInfoSym.asSimpleRef else unit), thisPath.isDefined && fun.params.isEmpty, fun.async))
      val bod2 = translateBlock(fun.body, newCtx, scopedVars)
      val fun2 = if fun.body is bod2 then fun else
        FunDefn(fun.owner, fun.sym, fun.dSym, fun.params, bod2)(fun.configOverride, fun.annotations)
      (debugInfoSym, debugInfo, fun2, newCtx)

    // transform inner function/class and effect handler intrinsics to the runtime functions.
    val preTransform = new BlockTransformer(SymbolSubst.Id):
      override def applyResult(r: Result)(k: Result => Block): Block = r match
        case Call(Value.MemberRef(sym, _), args) if sym is Elaborator.ctx.builtins.runtime.suspend =>
          k(Call(paths.mkEffectPath, args)(CallMetadata.mlsFunWithEffect))
        case Call(Value.MemberRef(sym, _), args) if sym is Elaborator.ctx.builtins.runtime.handle_suspension =>
          k(Call(paths.enterHandleBlockPath, args)(CallMetadata.mlsFunWithEffect))
        case _ => super.applyResult(r)(k)
      override def applyDefn(defn: Defn)(k: Defn => Block): Block = defn match
        case fun: FunDefn =>
          if h.currentBlockIsTrulyNested && opt.isDefined then
            raise(lifterReport(msg"Unexpected nested function: lambdas may not function correctly." -> fun.sym.toLoc :: Nil))
          val (debugInfoSym, debugInfo, fun2, ctx) = translateFunLike(fun, fun.sym.asMemberRef(fun.dSym), N, fun.sym.nme)
          ctx.ctx.addContCompanion(if debugEnabled then Scoped(Set.single(debugInfoSym), Assign(debugInfoSym, Tuple(false, debugInfo), k(fun2))) else k(fun2))
        case defn @ ClsLikeDefn(owner, isym, sym, ctorSym, kind, paramsOpt, auxParams, parentPath, methods, privateFields, publicFields, preCtor, ctor, companion, bufferable) =>
          if h.currentBlockIsTrulyNested && opt.isDefined then
            raise(lifterReport(msg"Unexpected nested class: lambdas may not function correctly." -> isym.toLoc :: Nil))
          val debugInfos = mutable.ArrayBuffer.empty[(TempSymbol, List[Arg])]
          val newContCompanions = mutable.ArrayBuffer.empty[ClsLikeDefn]
          val newMtds = methods.mapConserve: f =>
            val (debugInfoSym, debugInfo, fun2, ctx) = translateFunLike(f, isym.asThis.sel(new Tree.Ident(f.sym.nme), f.dSym),
              S(isym.asThis), s"${sym.nme}#${f.sym.nme}")
            debugInfos += debugInfoSym -> debugInfo
            newContCompanions ++= ctx.ctx.contClass
            fun2
          val companion2 = companion.mapConserve: bod =>
            val newMtds = bod.methods.mapConserve: f =>
              val (debugInfoSym, debugInfo, fun2, ctx) = translateFunLike(f, bod.isym.asThis.sel(new Tree.Ident(f.sym.nme), f.dSym),
                S(bod.isym.asThis), s"${sym.nme}.${f.sym.nme}")
              debugInfos += debugInfoSym -> debugInfo
              newContCompanions ++= ctx.ctx.contClass
              fun2
            // We cannot use this bc there is no subblock transform...
            // val newCtor = translateTrivialOrTopLevel(bod.ctor)
            // TODO: Companion's ctor is more well behaved so it is possible to handle it
            // However, JSBuilder inserts extra statements between preCtor and ctor and it's not possible to replicate the exact behavior
            // without many special handling.
            val newCtor = if opt.fold(true)(_.doNotInstrumentTopLevelModCtor) && !h.currentBlockIsTrulyNested then bod.ctor else
              translateCtorLike(bod.ctor, bod.isym.asThis, true)
            tl.log(s"companion name: ${bod.isym.nme}")
            if (bod.methods is newMtds) && (bod.ctor is newCtor) then
              bod
            else
              ClsLikeBody(bod.isym, newMtds, bod.privateFields, bod.publicFields, newCtor, bod.annotations)
          val newPreCtor = translateCtorLike(preCtor, isym.asThis, false)
          val newCtor = translateCtorLike(ctor, isym.asThis, false)
          val c2 =
            if (methods is newMtds) && (preCtor is newPreCtor) && (ctor is newCtor) && (companion is companion2) then
              defn
            else
              defn.copy(methods = newMtds, preCtor = newPreCtor, ctor = newCtor, companion = companion2)(defn.configOverride, defn.annotations)
          var r = k(c2)
          if debugEnabled then
            r = Scoped(debugInfos.iterator.map(_._1).toSet, debugInfos.foldRight(r): (elem, blk) =>
              Assign(elem._1, Tuple(false, elem._2), blk))
          r = Scoped(newContCompanions.iterator.map(_.sym).toSet, newContCompanions.foldRight(r)(Define(_, _)))
          r
        case _ => super.applyDefn(defn)(k)
    val b = preTransform.applyBlock(blk)
    if !opt.isDefined && !h.inAsync then
      return b
    if !h.currentBlockIsTrulyNested then
      return postTranslateTopLevelCtx(b)
    if h.inCtor then
      return postTranslateIllegalEffectCtx(b, "in a constructor")
    val ctx = h.asInstanceOf[HandlerCtx.FunctionLike].ctx
    if ctx.inGetter then
      return postTranslateIllegalEffectCtx(b, "in a getter")
    given FunctionCtx = ctx
    val parts = partitionBlock(b)
    val needsStackSafety = parts.needsStackSafety && stackSafety.isDefined
    val oneState = parts.states.size <= 1
    if oneState && !parts.containsError && !needsStackSafety then
      return b
    val vars = if debugEnabled then ctx.resumeInfo.currentLocals else computeRestoreList(parts)

    val pcVar = freshTmp("pc")
    val curDepth = freshTmp("curDepth")
    val mainLoopLbl = freshLabel("main")

    def postTransform(transition: (Opt[Result], BigInt) => Block) = new BlockTransformerShallow(SymbolSubst.Id):
      override def applyBlock(b: Block) = b match
        case StateTransition(S(res), uid) if needsStackSafety =>
          AssignField(paths.runtimePath, paths.stackDepthIdent, curDepth.asSimpleRef, transition(S(res), uid))(N)
        case StateTransition(res, uid) => transition(res, uid)
        case Return(EffectfulResult()) =>
          blockBuilder
            .staticif(ExceptionToggle, _.assign(pcVar, Value.Lit(Tree.IntLit(-2))))
            .staticif(needsStackSafety, _.assignFieldN(paths.runtimePath, paths.stackDepthIdent, curDepth.asSimpleRef))
            .rest(b)
        case _ => super.applyBlock(b)
      override def applyResult(r: Result)(k: Result => Block): Block = r match
        case EffectfulResult() if needsStackSafety =>
          AssignField(paths.runtimePath, paths.stackDepthIdent, curDepth.asSimpleRef, super.applyResult(r)(k))(N)
        case _ => super.applyResult(r)(k)
    // The fallback form which always works
    val fallbackPostTransform = postTransform:
      case (N, id) => Assign(pcVar, intLit(id), Continue(mainLoopLbl))
      case (S(res), id) => blockBuilder
        .staticif(ExceptionToggle, _.assign(pcVar, intLit(id)))
        .assignFieldN(paths.runtimePath, paths.resumeValueIdent, res)
        .staticif(!ExceptionToggle, _
          .ifthen(
            paths.curEffect,
            Case.Lit(Tree.UnitLit(true)),
            End(),
            S(ctx.doUnwind(res.toLoc.fold(unit)(locToStr(_)), intLit(id), vars)(using paths)))
          .assign(pcVar, intLit(id)))
        .continue(mainLoopLbl)
    
    val flattenCtx = FlattenCtx(
      parts,
      ctx,
      pcVar,
      vars,
      scopedVars,
      postTransform,
      fallbackPostTransform,
      needsStackSafety,
    )
    
    if DoubleCompilation then
      return ClassCodegen(hctx, paths, flattenCtx).generate(b, parts, ctx)
    
    var mainBody =
      if oneState then
        fallbackPostTransform.applyBlock(parts.states.head._2.blk)
      else
        val straightLineCg = StraightLineCodegen(hctx, paths, flattenCtx)
        Label(mainLoopLbl, true, straightLineCg.generate(parts, ctx), End())
        
    val getSavedTmp = freshTmp("saveOffset")
    def getSaved(off: BigInt): (Block => Block, Path) =
      if off == 0 then
        return (id, DynSelect(paths.runtimePath.selSN("resumeArr"), paths.runtimePath.selSN("resumeIdx"), true))
      val addOne = Assign(getSavedTmp, Call(State.builtinOpsMap("+").asSimpleRef, (paths.runtimePath.selSN("resumeIdx").asArg :: intLit(off).asArg :: Nil) ne_:: Nil)(CallMetadata.defaultFun), _)
      (addOne, DynSelect(paths.runtimePath.selSN("resumeArr"), getSavedTmp.asSimpleRef, true))

    val resumeArrIndexed = DynSelect(paths.runtimePath.selSN("resumeArr"), getSavedTmp.asSimpleRef, true)
    val preRestore = blockBuilder
        .assign(pcVar, paths.resumePc)
        .scopedVars(Set(getSavedTmp))
    val restoreVars = vars.zipWithIndex.foldLeft(preRestore):
      case (builder, (local, idx)) => builder
        .assign(getSavedTmp, if idx == 0 then paths.resumeIdx else Call(paths.plus, (getSavedTmp.asSimpleRef.asArg :: intLit(1).asArg :: Nil) ne_:: Nil)(CallMetadata.defaultFun))
        .assign(local, resumeArrIndexed)
    
    if needsStackSafety then
      mainBody = blockBuilder
        .assign(NoSymbol, PureCall(paths.checkDepthPath, Nil))
        .staticif(!ExceptionToggle, _
          .ifthen(paths.curEffect, Case.Lit(Tree.UnitLit(true)), End(), S(
            ctx.doUnwind(ctx.resumeInfo.currentStackSafetySym.fold(_.toLoc, _.toLoc).fold(unit)(locToStr(_)),
            if oneState then intLit(-1) else pcVar.asSimpleRef, vars)(using paths))))
        .assign(curDepth, Call(paths.plus, (paths.stackDepthPath.asArg :: intLit(1).asArg :: Nil) ne_:: Nil)(CallMetadata.defaultFun))
        .rest(mainBody)
    
    if ExceptionToggle then
      val err = freshTmp("err")
      mainBody = TryCatch(mainBody, err,
        Assign.discard(Call(paths.runtimePath.selSN("effectRethrow"), (err.asPath.asArg :: Nil) ne_:: Nil)(CallMetadata.mlsFunWithEffect), Throw(ctx.unwindCall(unit, pcVar.asPath, vars)(using paths))), End())
    
    if !oneState then
      mainBody = Match(
        paths.resumePc,
        Case.Lit(Tree.IntLit(-1)) ->
          Assign(pcVar, intLit(parts.entry), End()) :: Nil,
        S(restoreVars.assignFieldN(paths.runtimePath, new Tree.Ident("resumePc"), intLit(-1)).end),
        mainBody
      )
    else if ExceptionToggle then
      mainBody = Assign(pcVar, intLit(parts.entry), mainBody)
    
    val extraVars = if needsStackSafety then Set(pcVar, curDepth) else Set.single(pcVar)
    Scoped(
      scopedVars ++ extraVars,
      mainBody)
  
  private def translateCtorLike(b: Block, thisPath: Path, isModCtor: Bool)(using h: HandlerCtx): Block =
    translateBlock(b, if isModCtor then HandlerCtx.ModCtor(h.currentBlockIsTrulyNested) else HandlerCtx.Ctor, Set.empty)
    
  /**
   * These functions does not recurse into nested definitions
   */

  private def postTranslateTopLevelCtx(b: Block)(using HandlerCtx): Block =
    postTranslateIllegalEffectCtx(b, Call.raw(paths.topLevelEffectPath, (Value.Lit(Tree.BoolLit(debugEnabled)).asArg :: Nil) ne_:: Nil)(CallMetadata.defaultMlsFun), stackSafety.map(_.stackLimit))

  private def postTranslateIllegalEffectCtx(b: Block, reason: Str)(using HandlerCtx): Block =
    postTranslateIllegalEffectCtx(b, Call.raw(paths.illegalEffectPath, (Value.Lit(Tree.StrLit(reason)).asArg :: Nil) ne_:: Nil)(CallMetadata.defaultMlsFun), N)

  /**
    * Translate the block and apply stack safety wrapper if needed. If needsStackSafety is true,
    * it is assumed that the current block is at top level and lambda definition will be created for each call
    */
  private def postTranslateIllegalEffectCtx(b: Block, onEffect: Call, needsStackSafety: Opt[Int])(using HandlerCtx): Block =
    def effectCheck(l: Assignable, r: Result, rst: Block): Block =
      val withStackSafe = needsStackSafety match
        case S(stackLimit) =>
          val bodSym = BlockMemberSymbol("‹stack safe body›", Nil, false)
          val bodFun = FunDefn.withFreshSymbol(N, bodSym, ParamList(ParamListFlags.empty, Nil, N) :: Nil, Ret(r))(configOverride = N, annotations = Nil)
          blockBuilder
            .scopedVars(Set.single(bodSym))
            .define(bodFun)
            .assign(l, Call(paths.runStackSafePath, (intLit(stackLimit).asArg :: Value.MemberRef(bodSym, bodFun.dSym).asArg :: Nil) ne_:: Nil)(CallMetadata.defaultMlsFun))
        case N =>
          blockBuilder.assign(l, r)
      withStackSafe
        .ifthen(
          paths.curEffect,
          Case.Lit(Tree.UnitLit(true)),
          End(),
          S(Assign(l, onEffect, End())))
        .rest(rst)
    val topLevelPostTransform = new BlockTransformerShallow(SymbolSubst.Id):
      override def applyBlock(b: Block) = b match
        case Assign(lhs, r @ EffectfulResult(), rest) =>
          // Optimization to reuse lhs instead of fresh local
          effectCheck(lhs, r, applyBlock(rest))
        case _ => super.applyBlock(b)
      override def applyResult(r: Result)(k: Result => Block) = r match
        case r @ EffectfulResult() =>
          // Fallback case, this may lead to unnecessary assignments if it is assign-like
          val l = freshTmp()
          Scoped(Set(l), effectCheck(l, r, k(l.asSimpleRef)))
        case _ => super.applyResult(r)(k)
    topLevelPostTransform.applyBlock(b)


  def translateProgram(prog: Program): Program =
    val ctx = HandlerCtx.TopLevel
    val transformed = blockBuilder
        .staticif(
          opt.fold(false)(!_.doNotInstrumentTopLevelModCtor),
          _.assign(NoSymbol, Call(paths.resetEffects, Nil ne_:: Nil)(CallMetadata.defaultMlsFun))
        )
        .rest(translateBlock(prog.main, ctx, Set.empty))
    if transformed is prog.main then prog
    else
      Program(
        prog.imports,
        transformed
      )
