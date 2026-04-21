package hkmc2
package codegen

import scala.collection.mutable.{Map => MutMap, Set => MutSet, Buffer}
import scala.annotation.tailrec
import sourcecode.Line

import mlscript.utils.*, shorthands.*
import hkmc2.utils.*

import syntax.Tree
import semantics.*
import semantics.Elaborator.State
import mlscript.utils.algorithms.SccsInfo
import hkmc2.syntax.SpreadKind

/**
  * Stack-Safe Static Recursion
  * 
  * Instrument any statically known (mutually) recursive calls so that they will yield an effect,
  * which unwinds the stack to avoid stack overflow. The analysis is similar to tail recursive
  * optimization, except here we don't care whether the call is tail or not.
  */
class StaticRecursiveCallInstrumenter(using State, Elaborator.Ctx, TL):
  
  class AnalysisResult(
    val loopBreakers: Set[TermSymbol],
    val sccMap: Map[TermSymbol, Int],
    val trivialSccs: Set[TermSymbol],
  ):
    // Whether the function needs to have a inner function for recursive calls.
    def needInner(ts: TermSymbol) = !trivialSccs.contains(ts)
    // Whether the call from caller to callee is a recursive call that needs to pass the extra handler and call the inner function.
    // Other calls do not need to be changed at all.
    def isCallRecursive(caller: TermSymbol, callee: TermSymbol) =
      sccMap.get(caller) == sccMap.get(callee) && sccMap.get(caller).isDefined
    // Whether the function needs to yield at its start.
    def needRaiseEffect(ts: TermSymbol) = loopBreakers.contains(ts)
  
  object Analyzer extends CallGraphBuilder:

    // Ignore all methods
    override def addToGraph(caller: TermSymbol, callee: TermSymbol) =
      if !caller.owner.isDefined && !callee.owner.isDefined then
        tl.log(s"Adding edge from ${caller} to ${callee}")
        super.addToGraph(caller, callee)
    
    // Treat naked ref as a call
    override def applyNakedRefTsym(ts: TermSymbol): Unit =
      tl.log(s"Adding edge from ${currentSymbol} to ${ts} for naked ref")
      addTSymToGraph(ts)

    // No multi-parameter list
    override def wrapFunction(fun: FunDefn, ignore: Boolean): Unit =
      if fun.params.sizeIs <= 1 then
        super.wrapFunction(fun, ignore)
      else
        super.wrapFunction(fun, true)

    def computeLoopBreakers(graph: SccsInfo[TermSymbol]): Iterable[TermSymbol] =
      // For each strongly connected component, we pick one function as the loop breaker, which will be
      // transformed. We need to do this recursively until there is no cycle in the call graph.
      graph.sccs.flatMap: (sccId, tsyms) =>
        if graph.sccInnerEdges.getOrElse(sccId, Nil).nonEmpty then
          val loopBreaker = tsyms.head
          val newSubGraph = graph.sccInnerEdges.getOrElse(sccId, Nil).filter:
            case (_, b) => b =/= loopBreaker
          computeLoopBreakers(algorithms.sccsWithInfo(newSubGraph, tsyms)) ++ collection.View.Single(loopBreaker)
        else collection.View.empty
    
    def analyze(prog: Program) =
      val graph = buildSccGraph(prog)
      tl.log(graph)
      val loopBreakers = computeLoopBreakers(graph).toSet
      tl.log(loopBreakers)
      AnalysisResult(
        loopBreakers,
        graph.sccs.flatMap((sccId, tsyms) => tsyms.map((_, sccId))).toMap,
        graph.sccs.flatMap((sccId, tsyms) => if graph.sccInnerEdges.getOrElse(sccId, Nil).isEmpty then tsyms else Nil).toSet,
      )
  
  def copyVarSymbol(s: VarSymbol): VarSymbol =
    VarSymbol(s.id)
  
  def replaceParamSym(p: Param, s: VarSymbol): Param =
    Param(p.flags, s, N, modulefulness = p.modulefulness)

  def rewrite(main: Block): Block =
    val analysisResult = Analyzer.analyze(Program(Nil, main))

    object Rewriter extends BlockTransformer(SymbolSubst.Id):
      val wrapperToInner = MutMap.empty[(BlockMemberSymbol, TermSymbol), (BlockMemberSymbol, TermSymbol)]
      var currentSymbol: Opt[(TermSymbol, VarSymbol)] = N

      def getOrCreateWrapperSymbols(bSym: BlockMemberSymbol, dSym: TermSymbol): (BlockMemberSymbol, TermSymbol) =
        wrapperToInner.getOrElseUpdate((bSym, dSym),
        locally:
          val innerBSym = BlockMemberSymbol(bSym.nme, Nil, bSym.nameIsMeaningful)
          val innerSym = TermSymbol(dSym.k, dSym.owner, dSym.id)
          (innerBSym, innerSym)
        )
      
      inline def enterSymbol[T](sym: Opt[(TermSymbol, VarSymbol)])(inline thunk: => T): T =
        val prevSymbol = currentSymbol
        currentSymbol = sym
        val result = thunk
        currentSymbol = prevSymbol
        result

      override def applyBlock(b: Block) = b match
        case Define(f: FunDefn, rst) if analysisResult.needInner(f.dSym) =>
          val (innerBSym, innerSym) = getOrCreateWrapperSymbols(f.sym, f.dSym)
          val handlerVar = VarSymbol(Tree.Ident("handler"))
          val nf = enterSymbol(S((f.dSym, handlerVar)))(applyFunDefn(f))
          val phead = nf.params.head
          val inner = nf.copy(dSym = innerSym, sym = innerBSym,
            params = ParamList(phead.flags, Param.simple(handlerVar) :: phead.params, phead.restParam) :: Nil,
            body = Assign(State.noSymbol, Call(handlerVar.asPath.selSN("raise"), Nil)(true, true, false), nf.body)
          )(nf.forceTailRec, nf.configOverride, Visibility.Private)
          val handlerInstanceVar = copyVarSymbol(handlerVar)
          val newVars = phead.params.map(p => copyVarSymbol(p.sym))
          val newRstParams = phead.restParam.map(rp => copyVarSymbol(rp.sym))
          val wrapper = FunDefn(N, f.sym, f.dSym,
            ParamList(
              phead.flags,
              phead.params.zip(newVars).map((p, v) => replaceParamSym(p, v)),
              phead.restParam.zip(newRstParams).map((rp, v) => replaceParamSym(rp, v))) :: Nil,
            Return(Call(State.runtimeSymbol.asPath.selSN("runStaticStackSafe"),
              Value.Ref(innerBSym, S(innerSym)).asArg :: newVars.map(_.asPath.asArg) ++ newRstParams.map(r => Arg(S(SpreadKind.Eager), r.asPath))
            )(true, true, false), false)
            )(false, f.configOverride, f.visibility)
          Scoped(Set.single(innerBSym), Define(inner, Define(wrapper, applyBlock(rst))))
        case _ => super.applyBlock(b)

      override def applyResult(r: Result)(k: Result => Block): Block =
        (r, currentSymbol) match
        case (Call(Value.Ref(bms: BlockMemberSymbol, S(ts: TermSymbol)), args), S((currentFun, handlerVar)))
            if analysisResult.isCallRecursive(currentFun, ts)
        =>
          // This is a recursive call that needs to be transformed.
          val (innerBSym, innerSym) = getOrCreateWrapperSymbols(bms, ts)
          k(Call(
            Value.Ref(innerBSym, S(innerSym)),
            Value.Ref(handlerVar, N).asArg :: args
          )(true, true, false))
        case _ => super.applyResult(r)(k)
      
      override def applyDefn(defn: Defn)(k: Defn => Block): Block =
        defn match
        case defn @ ClsLikeDefn(own, isym, sym, ctorSym, kind, paramsOpt, auxParams, parentPath, methods,
            privateFields, publicFields, preCtor, ctor, mod, bufferable)
        =>
          val erasedCtor = defn.copy(preCtor = End(), ctor = End())(defn.configOverride)
          super.applyDefn(erasedCtor): newDefn =>
            val newClsDefn = newDefn.asInstanceOf[ClsLikeDefn]
            val newPreCtor = enterSymbol(N)(applyBlock(preCtor))
            val newCtor = enterSymbol(N)(applyBlock(ctor))
            k(newClsDefn.asInstanceOf[ClsLikeDefn].copy(preCtor = newPreCtor, ctor = newCtor)(newClsDefn.configOverride))
        case _ => super.applyDefn(defn)(k)
      
    
    Rewriter.applyProgram(Program(Nil, main)).main
