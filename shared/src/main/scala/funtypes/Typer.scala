package funtypes

import scala.collection.mutable
import scala.collection.mutable.{Map => MutMap, Set => MutSet}
import scala.collection.immutable.{SortedSet, SortedMap}
import scala.util.chaining._
import scala.annotation.tailrec
import funtypes.utils._, shorthands._

final case class Loc(spanStart: Int, spanEnd: Int)
final case class TypeError(msg: String, loco: Opt[Loc]) extends Exception(msg)

/** A class encapsulating type inference state.
 *  It uses its own internal representation of types and type variables, using mutable data structures.
 *  Inferred SimpleType values are then turned into CompactType values for simplification.
 *  In order to turn the resulting CompactType into a funtypes.Type, we use `expandCompactType`.
 */
class Typer(var dbg: Boolean) extends TyperDebugging {
  
  type Ctx = Map[String, TypeScheme]
  type Raise = TypeError => Unit
  
  val UnitType: PrimType = PrimType("unit")
  val BoolType: PrimType = PrimType("bool")
  val IntType: PrimType = PrimType("int")
  val DecType: PrimType = PrimType("number")
  val StrType: PrimType = PrimType("string")
  
  val builtins: Ctx = Map(
    "true" -> BoolType,
    "false" -> BoolType,
    "not" -> FunctionType(BoolType, BoolType),
    "succ" -> FunctionType(IntType, IntType),
    "println" -> PolymorphicType(0, FunctionType(freshVar(1), UnitType)), // Q: level?
    "discard" -> PolymorphicType(0, FunctionType(freshVar(1), UnitType)), // Q: level?
    "add" -> FunctionType(IntType, FunctionType(IntType, IntType)),
    "+" -> FunctionType(IntType, FunctionType(IntType, IntType)),
    "id" -> {
      val v = freshVar(1)
      PolymorphicType(0, FunctionType(v, v))
    },
    "if" -> {
      val v = freshVar(1)
      PolymorphicType(0, FunctionType(BoolType, FunctionType(v, FunctionType(v, v))))
    },
  )
  
  /** The main type inference function */
  def inferTypes(pgrm: Pgrm, ctx: Ctx = builtins): List[Either[TypeError, PolymorphicType]] =
    pgrm.defs match {
      case (isrec, nme, rhs) :: defs =>
        val ty_sch = try Right(typeLetRhs(isrec, nme, rhs)(ctx, 0, throw _)) catch {
          case err: TypeError => Left(err) }
        ty_sch :: inferTypes(Pgrm(defs), ctx + (nme -> ty_sch.getOrElse(freshVar(0))))
      case Nil => Nil
    }
  
  // Saldy, the version above does not work in JavaScript as it raises a
  //    "RangeError: Maximum call stack size exceeded"
  // So we have to go with this uglier one:
  def inferTypesJS(
    pgrm: Pgrm,
    ctx: Ctx = builtins,
    stopAtFirstError: Boolean = true,
  ): List[Either[TypeError, PolymorphicType]] = {
    var defs = pgrm.defs
    var curCtx = ctx
    var res = collection.mutable.ListBuffer.empty[Either[TypeError, PolymorphicType]]
    while (defs.nonEmpty) {
      val (isrec, nme, rhs) = defs.head
      defs = defs.tail
      val ty_sch = try Right(typeLetRhs(isrec, nme, rhs)(curCtx, 0, throw _)) catch {
        case err: TypeError =>
          if (stopAtFirstError) defs = Nil
          Left(err)
      }
      res += ty_sch
      curCtx += (nme -> ty_sch.getOrElse(freshVar(0)))
    }
    res.toList
  }
  
  def typeBlk(blk: Blk, ctx: Ctx = builtins, allowPure: Bool = false)
        : List[List[TypeError] -> PolymorphicType]
        = blk.stmts match {
    case s :: stmts =>
      val errs = mutable.ListBuffer.empty[TypeError]
      val (newCtx, ty) = typeStatement(s, allowPure)(ctx, 0, errs += _)
      errs.toList -> ty :: typeBlk(Blk(stmts), newCtx, allowPure)
    case Nil => Nil
  }
  def typeStatement(s: Statement, allowPure: Bool = false)
        (implicit ctx: Ctx, lvl: Int, raise: Raise): Ctx -> PolymorphicType = s match {
    case LetS(isrec, Var(nme), rhs) =>
      val ty_sch = typeLetRhs(isrec, nme, rhs)
      (ctx + (nme -> ty_sch)) -> ty_sch
    case LetS(isrec, pat, rhs) => lastWords("Not yet supported: pattern " + pat)
    case t @ Tup(fs) if !allowPure => // Note: not sure this is still used!
      val thing = fs match {
        case (S(_), _) :: Nil => "field"
        case Nil => "empty tuple"
        case _ => "tuple"
      }
      err(s"Useless $thing in statement position.", t.toLoc)
      ctx -> PolymorphicType(0, typeTerm(t))
    case t: Term =>
      val ty = typeTerm(t)
      if (!allowPure) {
        if (t.isInstanceOf[Var] || t.isInstanceOf[Lit])
          err("Pure expression does nothing in statement position.", t.toLoc)
        else constrain(ty, UnitType)(raise = raise, loco = t.toLoc)
      }
      ctx -> PolymorphicType(0, ty)
  }
  
  def inferType(term: Term, ctx: Ctx = builtins, lvl: Int = 0): SimpleType = typeTerm(term)(ctx, lvl, throw _)
  
  /** Infer the type of a let binding right-hand side. */
  def typeLetRhs(isrec: Boolean, nme: String, rhs: Term)(implicit ctx: Ctx, lvl: Int, raise: Raise): PolymorphicType = {
    val res = if (isrec) {
      val e_ty = freshVar(lvl + 1)
      val ty = typeTerm(rhs)(ctx + (nme -> e_ty), lvl + 1, raise)
      implicit val l: Opt[Loc] = rhs.toLoc
      constrain(ty, e_ty)
      e_ty
    } else typeTerm(rhs)(ctx, lvl + 1, raise)
    PolymorphicType(lvl, res)
  }
  
  /** Infer the type of a term. */
  def typeTerm(term: Term)(implicit ctx: Ctx, lvl: Int, raise: Raise): SimpleType = trace(s"$lvl. Typing $term") {
    lazy val res = freshVar
    term match {
      case Var(name) =>
        ctx.getOrElse(name, { err("identifier not found: " + name, term.toLoc); res}).instantiate
      case Lam(Var(name), body) =>
        val param = freshVar
        val body_ty = typeTerm(body)(ctx + (name -> param), lvl, raise)
        FunctionType(param, body_ty)
      case Lam(lhs, rhs) => ???
      case App(f, a) =>
        val f_ty = typeTerm(f)
        val a_ty = typeTerm(a)
        implicit val l: Opt[Loc] = term.toLoc
        constrain(f_ty, FunctionType(a_ty, res))
        res
      case IntLit(n) => IntType
      case DecLit(n) => DecType
      case StrLit(n) => StrType
      case Sel(obj, name) =>
        val obj_ty = typeTerm(obj)
        implicit val l: Opt[Loc] = term.toLoc
        constrain(obj_ty, RecordType((name, res) :: Nil))
        res
      case Rcd(fs) =>
        RecordType(fs.map { case (n, t) => (n, typeTerm(t)) })
      case Let(isrec, nme, rhs, bod) =>
        val n_ty = typeLetRhs(isrec, nme, rhs)
        typeTerm(bod)(ctx + (nme -> n_ty), lvl, raise)
      case tup: Tup =>
        typeTerms(tup :: Nil, false, Nil)
      case Bra(false, trm: Blk) => typeTerm(trm)
      case Bra(rcd, trm @ (_: Tup | _: Blk)) => typeTerms(trm :: Nil, rcd, Nil)
      case Bra(_, trm) => typeTerm(trm)
      case Blk((s: Term) :: Nil) => typeTerm(s)
      case Blk(Nil) => UnitType
      // case Blk(s :: stmts) =>
      //   val (newCtx, ty) = typeStatement(s)
      //   typeTerm(Blk(stmts))(newCtx, lvl, raise)
      case Blk(stmts) => typeTerms(stmts, false, Nil)
    }
  }(r => s"$lvl. : ${r}")
  
  def typeTerms(term: Ls[Statement], rcd: Bool, fields: List[Opt[Str] -> SimpleType])
        (implicit ctx: Ctx, lvl: Int, raise: Raise): SimpleType = term match {
    case (trm @ Var(nme)) :: sts if rcd => // field punning
      typeTerms(Tup(S(nme) -> trm :: Nil) :: sts, rcd, fields)
    case Blk(sts0) :: sts1 => typeTerms(sts0 ::: sts1, rcd, fields)
    case Tup(Nil) :: sts => typeTerms(sts, rcd, fields)
    case Tup((no, trm) :: ofs) :: sts =>
      val ty = if (ofs.isEmpty) typeTerm(Bra(rcd, trm)) else typeTerm(trm)
      val newCtx = no.fold(ctx)(n => ctx + (n -> ty))
      typeTerms(Tup(ofs) :: sts, rcd, (no, ty) :: fields)(newCtx, lvl, raise)
    case (trm: Term) :: Nil =>
      if (fields.nonEmpty)
        err("Previous field definitions are discarded by this returned expression.", trm.toLoc)
      typeTerm(trm)
    // case (trm: Term) :: Nil =>
    //   assert(!rcd)
    //   val ty = typeTerm(trm)
    //   typeBra(Nil, rcd, (N, ty) :: fields)
    case s :: sts =>
      val (newCtx, ty) = typeStatement(s)
      typeTerms(sts, rcd, fields)(newCtx, lvl, raise)
    case Nil =>
      // TODO actually use a tuple type if !rcd
      val fs = fields.reverseIterator.zipWithIndex.map {
        case ((N, t), i) => ("_" + (i + 1), t); case ((S(n), t), _) => (n, t)
      }.toList
      RecordType(fs)
  }
  
  /** Constrains the types to enforce a subtyping relationship `lhs` <: `rhs`. */
  def constrain(lhs: SimpleType, rhs: SimpleType)
      // we need a cache to remember the subtyping tests in process; we also make the cache remember
      // past subtyping tests for performance reasons (it reduces the complexity of the algoritghm)
      (implicit cache: MutSet[(SimpleType, SimpleType)] = MutSet.empty, raise: Raise, loco: Opt[Loc])
  : Unit = {
    if (lhs is rhs) return
    val lhs_rhs = lhs -> rhs
    lhs_rhs match {
      // There is no need to remember the subtyping tests performed that did not involve
      // type variables, as type variables will necessary be part of any possible cycles.
      // Since these types form regular trees, there will necessarily be a point where a
      // variable part of a cycle will be matched against the same type periodically.
      case (_: TypeVariable, _) | (_, _: TypeVariable) =>
        if (cache(lhs_rhs)) return
        cache += lhs_rhs
      case _ => ()
    }
    lhs_rhs match {
      case (FunctionType(l0, r0), FunctionType(l1, r1)) =>
        constrain(l1, l0)
        constrain(r0, r1)
      case (RecordType(fs0), RecordType(fs1)) =>
        fs1.foreach { case (n1, t1) =>
          fs0.find(_._1 === n1).fold(
            err(s"missing field: $n1 in ${lhs.show}", loco)
          ) { case (n0, t0) => constrain(t0, t1) }
        }
      case (lhs: TypeVariable, rhs) if rhs.level <= lhs.level =>
        lhs.upperBounds ::= rhs
        lhs.lowerBounds.foreach(constrain(_, rhs))
      case (lhs, rhs: TypeVariable) if lhs.level <= rhs.level =>
        rhs.lowerBounds ::= lhs
        rhs.upperBounds.foreach(constrain(lhs, _))
      case (_: TypeVariable, rhs0) =>
        val rhs = extrude(rhs0, lhs.level, false)
        constrain(lhs, rhs)
      case (lhs0, _: TypeVariable) =>
        val lhs = extrude(lhs0, rhs.level, true)
        constrain(lhs, rhs)
      case _ => err(s"cannot constrain ${lhs.show} <: ${rhs.show}", loco)
    }
  }
  
  /** Copies a type up to its type variables of wrong level (and their extruded bounds). */
  def extrude(ty: SimpleType, lvl: Int, pol: Boolean)
      (implicit cache: MutMap[TypeVariable, TypeVariable] = MutMap.empty): SimpleType =
    if (ty.level <= lvl) ty else ty match {
      case FunctionType(l, r) => FunctionType(extrude(l, lvl, !pol), extrude(r, lvl, pol))
      case RecordType(fs) => RecordType(fs.map(nt => nt._1 -> extrude(nt._2, lvl, pol)))
      case tv: TypeVariable => cache.getOrElse(tv, {
        val nv = freshVar(lvl)
        cache += (tv -> nv)
        if (pol) { tv.upperBounds ::= nv
          nv.lowerBounds = tv.lowerBounds.map(extrude(_, lvl, pol)) }
        else { tv.lowerBounds ::= nv
          nv.upperBounds = tv.upperBounds.map(extrude(_, lvl, pol)) }
        nv
      })
      case PrimType(_) => ty
    }
  
  def err(msg: String, loco: Opt[Loc])(implicit raise: Raise): Unit =
    raise(TypeError(msg, loco))
  
  private var freshCount = 0
  def freshVar(implicit lvl: Int): TypeVariable = new TypeVariable(lvl, Nil, Nil)
  def resetState(): Unit = {
    freshCount = 0
  }
  
  def freshenAbove(lim: Int, ty: SimpleType)(implicit lvl: Int): SimpleType = {
    val freshened = MutMap.empty[TypeVariable, TypeVariable]
    def freshen(ty: SimpleType): SimpleType = ty match {
      case tv: TypeVariable =>
        if (tv.level > lim) freshened.get(tv) match {
          case Some(tv) => tv
          case None =>
            val v = freshVar
            freshened += tv -> v
            // v.lowerBounds = tv.lowerBounds.mapConserve(freshen)
            // v.upperBounds = tv.upperBounds.mapConserve(freshen)
            //  ^ the above are more efficient, but they lead to a different order
            //    of fresh variable creations, which leads to some types not being
            //    simplified the same when put into the RHS of a let binding...
            v.lowerBounds = tv.lowerBounds.reverse.map(freshen).reverse
            v.upperBounds = tv.upperBounds.reverse.map(freshen).reverse
            v
        } else tv
      case FunctionType(l, r) => FunctionType(freshen(l), freshen(r))
      case RecordType(fs) => RecordType(fs.map(ft => ft._1 -> freshen(ft._2)))
      case PrimType(_) => ty
    }
    freshen(ty)
  }
  
  
  // The data types used for type inference:
  
  /** A type that potentially contains universally quantified type variables,
   *  and which can be isntantiated to a given level. */
  sealed abstract class TypeScheme {
    def instantiate(implicit lvl: Int): SimpleType
  }
  /** A type with universally quantified type variables
   *  (by convention, those variables of level greater than `level` are considered quantified). */
  case class PolymorphicType(level: Int, body: SimpleType) extends TypeScheme {
    def instantiate(implicit lvl: Int) = freshenAbove(level, body)
  }
  /** A type without universally quantified type variables. */
  sealed abstract class SimpleType extends TypeScheme with SimpleTypeImpl {
    def level: Int
    def instantiate(implicit lvl: Int) = this
  }
  case class FunctionType(lhs: SimpleType, rhs: SimpleType) extends SimpleType {
    lazy val level: Int = lhs.level max rhs.level
    override def toString = s"($lhs -> $rhs)"
  }
  case class RecordType(fields: List[(String, SimpleType)]) extends SimpleType {
    lazy val level: Int = fields.iterator.map(_._2.level).maxOption.getOrElse(0)
    override def toString = s"{${fields.map(f => s"${f._1}: ${f._2}").mkString(", ")}}"
  }
  case class PrimType(name: String) extends SimpleType {
    def level: Int = 0
    override def toString = name
  }
  /** A type variable living at a certain polymorphism level `level`, with mutable bounds.
   *  Invariant: Types appearing in the bounds never have a level higher than this variable's `level`. */
  final class TypeVariable(
      val level: Int,
      var lowerBounds: List[SimpleType],
      var upperBounds: List[SimpleType],
  ) extends SimpleType with CompactTypeOrVariable {
    private[funtypes] val uid: Int = { freshCount += 1; freshCount - 1 }
    private[funtypes] var recursiveFlag = false // used temporarily by `compactType`
    lazy val asTypeVar = new TypeVar("α", uid)
    override def toString: String = "α" + uid + "'" * level
    override def hashCode: Int = uid
  }
  
  trait CompactTypeOrVariable
  
  
  type PolarVariable = (TypeVariable, Boolean)
  
  /** Convert an inferred SimpleType into the immutable Type representation. */
  def expandType(st: SimpleType): Type = {
    val recursive = mutable.Map.empty[PolarVariable, TypeVar]
    def go(st: SimpleType, polarity: Boolean)(inProcess: Set[PolarVariable]): Type = st match {
      case tv: TypeVariable =>
        val tv_pol = tv -> polarity
        if (inProcess.contains(tv_pol))
          recursive.getOrElseUpdate(tv_pol, freshVar(0).asTypeVar)
        else {
          val bounds = if (polarity) tv.lowerBounds else tv.upperBounds
          val boundTypes = bounds.map(go(_, polarity)(inProcess + tv_pol))
          val mrg = if (polarity) Union else Inter
          val res = boundTypes.foldLeft[Type](tv.asTypeVar)(mrg)
          recursive.get(tv_pol).fold(res)(Recursive(_, res))
        }
      case FunctionType(l, r) => Function(go(l, !polarity)(inProcess), go(r, polarity)(inProcess))
      case RecordType(fs) => Record(fs.map(nt => nt._1 -> go(nt._2, polarity)(inProcess)))
      case PrimType(n) => Primitive(n)
    }
    go(st, true)(Set.empty)
  }
  
  
}