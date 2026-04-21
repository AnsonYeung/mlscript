package hkmc2
package codegen

import scala.collection.mutable.{Map => MutMap, Set => MutSet, Buffer}
import scala.annotation.tailrec
import sourcecode.Line

import mlscript.utils.*, shorthands.*
import hkmc2.utils.*

import semantics.*

// Reference to a function body can occur as a.f or f, this handles both cases.
private object TermSymbolPath:
  def unapply(p: Path) = p match
    case Value.Ref(l, S(ts: TermSymbol)) => S(ts)
    case s: Select => s.symbol match
      case S(ts: TermSymbol) => S(ts)
      case _ => N
    case _ => N

object CallToTermSymbol:
  def unapply(r: Result) = r match
    case c @ Call(fun = TermSymbolPath(ts)) => S((c, ts))
    case _ => N

// The call graph ignores `Instantiate` / constructor.
class CallGraphBuilder extends BlockTraverser:
  val graph = MutMap.empty[TermSymbol, Buffer[TermSymbol]]
  var currentSymbol: Opt[TermSymbol] = N

  def buildSccGraph(prog: Program) =
    graph.foreach: (tsym, buf) =>
      buf.clear()
    currentSymbol = N
    applyProgram(prog)
    val interestingTsyms = graph.keySet
    val edges = graph.toSeq.flatMap: (caller, callees) =>
      callees.filter(interestingTsyms.contains).map: callee =>
        (caller, callee)
    algorithms.sccsWithInfo(edges, interestingTsyms)

  def addToGraph(caller: TermSymbol, callee: TermSymbol): Unit =
    graph.getOrElseUpdate(caller, Buffer.empty) += callee

  def addTSymToGraph(ts: TermSymbol) = currentSymbol.map: caller =>
    addToGraph(caller, ts)

  def applyCallTsym(c: Call, ts: TermSymbol) =
    addTSymToGraph(ts)
  
  def applyNakedRefTsym(ts: TermSymbol) = ()

  def wrapSymbol(ts: Opt[TermSymbol])(f: => Unit) =
    val oldSymbol = currentSymbol
    currentSymbol = ts
    f
    currentSymbol = oldSymbol
  
  def wrapFunction(fun: FunDefn, ignore: Boolean) =
    graph.getOrElseUpdate(fun.dSym, Buffer.empty)
    wrapSymbol(if ignore then N else S(fun.dSym))(applyBlock(fun.body))

  override def applyFunDefn(fun: FunDefn): Unit =
    wrapFunction(fun, false)
  
  override def applyDefn(defn: Defn): Unit =
    defn match
    case ClsLikeDefn(own, isym, sym, ctorSym, k, paramsOpt, auxParams, parentPath, methods,
        privateFields, publicFields, preCtor, ctor, mod, bufferable) =>
      own.foreach(_.traverse)
      isym.traverse
      sym.traverse
      ctorSym.foreach(_.traverse)
      paramsOpt.foreach(applyParamList)
      auxParams.foreach(applyParamList)
      parentPath.foreach(applyPath)
      methods.foreach(applyFunDefn)
      privateFields.foreach(_.traverse)
      publicFields.foreach: f =>
        f._1.traverse; f._2.traverse
      wrapSymbol(N):
        applySubBlock(preCtor)
        applySubBlock(ctor)
      mod.foreach(applyCompanionModule)
    case _ => super.applyDefn(defn)
  
  override def applyResult(r: Result): Unit =
    r match
    case CallToTermSymbol(c, ts) =>
      applyCallTsym(c, ts)
    case _ => ()
    super.applyResult(r)

  override def applySymbol(s: Symbol): Unit =
    s match
    case ts: TermSymbol => applyNakedRefTsym(ts)
    case _ => super.applySymbol(s)
