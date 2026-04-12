package hkmc2
package codegen

import scala.collection.mutable.{Map => MutMap, Set => MutSet, Buffer}
import scala.annotation.tailrec
import sourcecode.Line

import mlscript.utils.*, shorthands.*
import hkmc2.utils.*

import semantics.*
import semantics.Elaborator.State
import mlscript.utils.algorithms.SccsInfo

/**
  * Stack-Safe Static Recursion
  * 
  * Instrument any statically known (mutually) recursive calls so that they will yield an effect,
  * which unwinds the stack to avoid stack overflow. The analysis is similar to tail recursive
  * optimization, except here we don't care whether the call is tail or not. For calls inside
  * lambdas, we'll assume those to be called within the function and not delayed. In the IR, the
  * lambda correspond to a naked ref of TermSymbol. We treat such ref as a recursive call. This
  * is valid since all usage to the naked reference will be indirect, to which we don't offer
  * guarantee if it's used in a recursive manner.
  * 
  * We already require lifting to be enabled for effect handlers, so we assume it here as well.
  */
class StaticRecursiveCallInstrumenter(using State):
  
  class AnalysisResult(
    val loopBreakers: Set[TermSymbol],
    val sccMap: Map[TermSymbol, Int],
    val trivialSccs: Set[TermSymbol],
  ):
    def needWrapper(ts: TermSymbol) = !trivialSccs.contains(ts)
    def isCallRecursive(caller: TermSymbol, callee: TermSymbol) =
      sccMap.get(caller) == sccMap.get(callee)
    def needRaiseEffect(ts: TermSymbol) = loopBreakers.contains(ts)
  
  object Analyzer extends CallGraphBuilder:

    // Treat naked ref as a call, as explained in the class comment.
    override def applyNakedRefTsym(ts: TermSymbol): Unit = addTSymToGraph(ts)

    def computeLoopBreakers(graph: SccsInfo[TermSymbol]): Iterable[TermSymbol] =
      // For each strongly connected component, we pick one function as the loop breaker, which will be
      // transformed. We need to do this recursively until there is no cycle in the call graph.
      graph.sccs.flatMap: (sccId, tsyms) =>
        if graph.sccInnerEdges(sccId).nonEmpty then
          val loopBreaker = tsyms.head
          val newSubGraph = graph.sccInnerEdges(sccId).filter:
            case (_, b) => b =/= loopBreaker
          computeLoopBreakers(algorithms.sccsWithInfo(newSubGraph, tsyms)) ++ collection.View.Single(loopBreaker)
        else collection.View.empty
    
    def analyze(prog: Program) =
      val graph = buildSccGraph(prog)
      val loopBreakers = computeLoopBreakers(graph).toSet
      AnalysisResult(
        loopBreakers,
        graph.sccs.flatMap((sccId, tsyms) => tsyms.map((_, sccId))).toMap,
        graph.sccs.flatMap((sccId, tsyms) => if graph.sccInnerEdges(sccId).isEmpty then tsyms else Nil).toSet,
      )

  def rewrite(prog: Program): Program =
    val analysisResult = Analyzer.analyze(prog)

    object Rewriter extends BlockTransformer(SymbolSubst.Id)
    
    Rewriter.applyProgram(prog)
