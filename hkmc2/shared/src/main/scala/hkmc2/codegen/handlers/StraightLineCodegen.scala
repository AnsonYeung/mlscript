package hkmc2.codegen.handlers

import scala.collection.mutable

import hkmc2.utils.*, shorthands.*
import hkmc2.semantics.*
import hkmc2.codegen.*
import hkmc2.syntax.Tree

import hkmc2.codegen.HandlerLowering.StateId
import hkmc2.codegen.HandlerLowering.PartitionedBlock
import hkmc2.codegen.HandlerLowering.SharedState
import hkmc2.codegen.HandlerLowering.FlattenCtx

class StraightLineCodegen(hctx: SharedState, paths: HandlerPaths, flattenCtx: FlattenCtx):
  import hctx.*
  given Elaborator.State = estate
  import HandlerLowering.*
  
  def computeEdges(parts: PartitionedBlock): Map[StateId, List[StateId]] =
    val edges = mutable.ListBuffer.empty[(StateId, StateId)]
    def findEdges(uid: StateId, b: Block) =
      new BlockTraverser:
        override def applyBlock(b: Block): Unit = b match
          case StateTransition(_, uid2) => edges.addOne((uid, uid2))
          case _ => super.applyBlock(b)
        applyBlock(b)
    for (uid, blk) <- parts.states do
      findEdges(uid, blk.blk)
    edges.groupBy(_._1).map:
      case uid -> ids => uid -> ids.map:
          case (a, b) => b
        .toList
        .distinct
        
  // Given a directed graph, computes the "straight line" segments of the graph, i.e. partitions it
  // into segments such that the out-degree of all elements in each segment is 1, except
  // for the last element. Note that the partitioning is not necessarily unique and this does
  // not necessarily produce a "maximal" partitioning. (I actually suspect that producing a
  // maximal partitioning is NP-hard...)
  //
  // I do have some ideas to improve this though, but those can be done later.
  def computeStraightLines(entry: StateId, edges: Map[StateId, List[StateId]]): List[List[StateId]] =
    val visited = mutable.HashSet.empty[StateId]
    val ret = mutable.ListBuffer.empty[List[StateId]]
    // Algorithm: Perform a DFS and accumulate the current straight-line segment as we visit nodes.
    // Once we reach a node that has an out degree of != 1, we end the current straight line segment.
    def dfs(state: StateId, acc: List[StateId]): Unit =
      var curAcc = acc
      def concludeSegment =
        ret.addOne(curAcc)
        curAcc = List.empty
      if !visited.contains(state) then
        // Not yet visited: Add this node to the current segment.
        curAcc = state :: curAcc
        visited.add(state)
        edges.get(state) match
        case Some(nexts) =>
          // If this state has an out degree of != 1, then end the current segment.
          if nexts.size != 1 then
            concludeSegment
          for n <- nexts do dfs(n, curAcc)
        case None => concludeSegment
      // If this state was visited from a node u with an out-degree of 1, but this state
      // has already been previously visited, then we must conclude the current segment,
      // ending at the node u.
      else if !curAcc.isEmpty then
        concludeSegment
    dfs(entry, List.empty)
    ret.sortBy(x => x.headOption.getOrElse(BigInt(-1))).toList
  
  // Note: `line` has the last state as the head, and the first state at the end
  def generate(parts: PartitionedBlock, ctx: FunctionCtx): Block =
    val edges = computeEdges(parts)
    val lines = computeStraightLines(parts.entry, edges)
    def transformState(state: StateId) =
      val blk = parts.states(state)
      val lblSym = LabelSymbol(N, "brk" + state.toString())
      val nextState = edges(state).head
      val transform = flattenCtx.postTransform:
        case (N, uid) =>
          assert(uid === nextState)
          Break(lblSym)
        case (S(res), uid) =>
          assert(uid === nextState)
          blockBuilder
            .staticif(ExceptionToggle, _.assign(flattenCtx.pcVar, intLit(uid)))
            .assignFieldN(paths.runtimePath, paths.resumeValueIdent, res)
            .staticif(!ExceptionToggle, _
              .ifthen(
                paths.curEffect,
                Case.Lit(Tree.UnitLit(true)),
                End(),
                S(ctx.doUnwind(res.toLoc.fold(unit)(locToStr(_)), intLit(uid), flattenCtx.vars)(using paths))
              ))
            .break(lblSym)
      val transformed = transform.applyBlock(blk.blk)
      Label(
        lblSym, false, transformed,
        Assign(flattenCtx.pcVar, intLit(nextState), End())
        // End()
      )
    def straightLineToArms(blk: Block, line: List[StateId]) = line match
      case head :: next =>
        val headTransformed = flattenCtx.fallbackPostTransform.applyBlock(parts.states(head).blk)
        val initial: Block =
          Match(
            flattenCtx.pcVar.asSimpleRef,
            Case.Lit(Tree.IntLit(head)) -> headTransformed :: Nil,
            N,
            blk
          )
        next.foldLeft(initial):
          // Applying this function to a block b will result in b appearing in the tail
          // of the sequence of match blocks
          case (acc, uid) =>
            val transformed = transformState(uid)
            Match(
              flattenCtx.pcVar.asSimpleRef,
              Case.Lit(Tree.IntLit(uid)) -> transformed :: Nil,
              N,
              acc
            )
      case Nil => blk
    lines.foldLeft(End())(straightLineToArms)
