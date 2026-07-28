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
  return yield* RuntimeJS.resumeWithHandleBlock(tag, bod(), undefined);
}



const GeneratorStackSafety = {
  stackLimit: 0,
  stackDepth: 0,
  stackHandler: null,
  stackResume: null,
  StackDelayHandlerGenerator: {
    *delay() {
      return yield [this, function *(k) {
        GeneratorStackSafety.stackResume = k;
        return null;
      }];
    }
  },
  *checkDepth() {
    if (GeneratorStackSafety.stackDepth >= GeneratorStackSafety.stackLimit && GeneratorStackSafety.stackHandler !== null) {
      return yield* GeneratorStackSafety.stackHandler.delay();
    } else {
      return null;
    }
  },
  runStackSafe(limit, f) {
    GeneratorStackSafety.stackDepth = 1;
    GeneratorStackSafety.stackLimit = limit;
    GeneratorStackSafety.stackHandler = GeneratorStackSafety.StackDelayHandlerGenerator;
    try {
      let gen = enterHandleBlockGenerator(GeneratorStackSafety.stackHandler, f)
      let r = gen.next();
      if (!r.done) {
        throw new Error("Effect crossed through stack safe boundary")
      }
      while (GeneratorStackSafety.stackResume !== null) {
        let saved = GeneratorStackSafety.stackResume;
        GeneratorStackSafety.stackResume = null;
        GeneratorStackSafety.stackDepth = 1;
        r = saved().next();
        if (!r.done) {
          throw new Error("Effect crossed through stack safe boundary")
        }
      }
      return r.value;
    } finally {
      GeneratorStackSafety.stackHandler = null;
      GeneratorStackSafety.stackLimit = 0;
      GeneratorStackSafety.stackDepth = 0;
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
  resumeWithHandleBlock,
  enterHandleBlockGenerator,
  checkDepthGenerator: GeneratorStackSafety.checkDepth,
  runStackSafeGenerator: GeneratorStackSafety.runStackSafe,
  GeneratorStackSafety,
  handlerTopLevelCall(r) {
    let result = r.next();
    if (result.done) {
      return result.value;
    }
    throw "Top level effect unhandled";
  },
}

export default RuntimeJS;

