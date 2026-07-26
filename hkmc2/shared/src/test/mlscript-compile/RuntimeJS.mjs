const RuntimeJS = {
  bitand(lhs, rhs) {
    return lhs & rhs;
  },
  bitnot(v) {
    return ~v;
  },
  bitor(lhs, rhs) {
    return lhs | rhs;
  },
  shl(v, sh) {
    return v << sh;
  },
  try_catch(computation, onError) {
    try { return computation() }
    catch (error) { return onError(error) }
  },
  symbols: {
    definitionMetadata: Symbol.for("mlscript.definitionMetadata"),
    prettyPrint: Symbol.for("mlscript.prettyPrint")
  },
  short_and(lhs, rhs) {
    return lhs && rhs();
  },
  short_or(lhs, rhs) {
    return lhs || rhs();
  },
  *resumeWithHandleBlock(tag, gen, val) {
    while (true) {
      let tmp = gen.next(val);
      if (tmp.done) {
        return tmp.value;
      }
      if (tmp.value[0] === tag) {
        return yield* tmp.value[1](function* (r) {
          return yield* RuntimeJS.resumeWithHandleBlock(tag, gen, r);
        });
      }
      val = yield tmp.value;
    }
  },
  *enterHandleBlockGenerator(tag, bod) {
    return yield* RuntimeJS.resumeWithHandleBlock(tag, bod(), undefined);
  },
  handlerTopLevelCall(r) {
    let result = r.next();
    if (result.done) {
      return result.value;
    }
    throw "Top level effect unhandled";
  }
}

export default RuntimeJS;

