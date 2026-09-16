function* resumeWithHandleBlock(tag, gen, val) {
  while (true) {
    let tmp = gen.next(val);
    if (tmp.done) {
      return tmp.value;
    }
    if (tmp.value[0] === tag) {
      return yield* tmp.value[1](function* (r) {
        return yield* resumeWithHandleBlock(tag, gen, r);
      });
    }
    val = yield tmp.value;
  }
}

function* enterHandleBlockGenerator(tag, bod) {
  return yield* resumeWithHandleBlock(tag, bod(), undefined);
}

async function* resumeWithHandleBlockAsyncGenerator(tag, gen, val) {
  while (true) {
    let tmp = await gen.next(val);
    if (tmp.done) {
      return tmp.value;
    }
    if (tmp.value[0] === tag) {
      return yield* tmp.value[1](async function* (r) {
        return yield* resumeWithHandleBlockAsyncGenerator(tag, gen, r);
      });
    }
    val = yield tmp.value;
  }
}

async function* enterHandleBlockAsyncGenerator(tag, bod) {
  return yield* resumeWithHandleBlockAsyncGenerator(tag, bod(), undefined);
}


const AsyncGeneratorStackSafety = {
  stackDepth: 0,
  stackLimit: 0,
  async *checkDepth() {
    if (AsyncGeneratorStackSafety.stackDepth >= AsyncGeneratorStackSafety.stackLimit) {
      await 0;
      AsyncGeneratorStackSafety.stackDepth = 0;
    }
  },
  async runStackSafe(limit, f) {
    AsyncGeneratorStackSafety.stackDepth = 1;
    AsyncGeneratorStackSafety.stackLimit = limit;
    try {
      let result = await f().next();
      if (result.done) {
        return result.value;
      }
      throw Error("Effect crossed through stack safe boundary");
    } finally {
      AsyncGeneratorStackSafety.stackLimit = 0;
      AsyncGeneratorStackSafety.stackDepth = 0;
    }
  },
}


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
  enterHandleBlockGenerator,
  topLevelCallGenerator(r) {
    let result = r.next();
    if (result.done) {
      return result.value;
    }
    throw "Top level effect unhandled";
  },
  enterHandleBlockAsyncGenerator,
  checkDepthAsyncGenerator: AsyncGeneratorStackSafety.checkDepth,
  runStackSafeAsyncGenerator: AsyncGeneratorStackSafety.runStackSafe,
  AsyncGeneratorStackSafety,
  async topLevelCallAsyncGenerator(r) {
    let result = await r.next();
    if (result.done) {
      return result.value;
    }
    throw "Top level effect unhandled";
  },
}

export default RuntimeJS;

