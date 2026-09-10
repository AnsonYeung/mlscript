const definitionMetadata = globalThis.Symbol.for("mlscript.definitionMetadata");
const prettyPrint = globalThis.Symbol.for("mlscript.prettyPrint");
import runtime from "./Runtime.mjs";
import RuntimeJS from "./RuntimeJS.mjs";
import Rendering from "./Rendering.mjs";
import LazyArray from "./LazyArray.mjs";
import Iter from "./Iter.mjs";
let resumeCont, handlerFunCont, cont, resumeCont1, suspendCont1, loop, continuation, Runtime1, lambda, lambda1, lambda2, lambda3, lambda4, lambda5, lambda6, lambda7, lambda8, lambda9, lambda10, lambda11, handlerFunCont1, lambda$, lambda$1, Capture$handlerTrampoline1, Capture$scope231, lambda$2, handlerFunCont$, lambda$3, suspendCont1$, cont$, handlerFunCont$1, lambda$4, lambda$5, resumeCont1$, lambda$6, resumeCont$, lambda$7, Capture$scope471, lambda$8, Capture$scope491, lambda$9, lambda$10, continuation$;
continuation$ = function continuation$(Runtime2, resume) {
  return (value) => {
    return continuation(Runtime2, resume, value)
  }
};
continuation = function continuation(Runtime2, resume, value) {
  let r, scrut;
  r = runtime.safeCall(resume(value));
  scrut = Runtime2.curEffect !== null;
  if (scrut === true) {
    Runtime2.illegalEffect("in exported async function");
    return r
  }
  return r;
};
lambda$10 = (undefined, function (Runtime2, promise) {
  return (resume) => {
    let continuation$here;
    continuation$here = continuation$(Runtime2, resume);
    return runtime.safeCall(promise.then(continuation$here))
  }
});
lambda9 = (undefined, function (Runtime2, promise, resume) {
  let continuation$here;
  continuation$here = continuation$(Runtime2, resume);
  return runtime.safeCall(promise.then(continuation$here))
});
(class Capture$scope49 {
  static {
    Capture$scope491 = this
  }
  constructor(result$0) {
    this.result$0 = result$0;
  }
  toString() { return runtime.render(this); }
  static [definitionMetadata] = ["class", "Capture$scope49"];
});
lambda$9 = (undefined, function (scope49$cap, cont1) {
  return (m, marker) => {
    return lambda8(scope49$cap, cont1, m, marker)
  }
});
lambda8 = (undefined, function (scope49$cap, cont1, m, marker) {
  let scrut, tmp, tmp1;
  scrut = runtime.safeCall(m.has(cont1));
  if (scrut === true) {
    tmp = ", " + marker;
    tmp1 = scope49$cap.result$0 + tmp;
    scope49$cap.result$0 = tmp1;
    return runtime.Unit
  }
  return runtime.Unit;
});
(class Capture$scope47 {
  static {
    Capture$scope471 = this
  }
  constructor(result$0) {
    this.result$0 = result$0;
  }
  toString() { return runtime.render(this); }
  static [definitionMetadata] = ["class", "Capture$scope47"];
});
lambda$8 = (undefined, function (scope47$cap, cont1) {
  return (m, marker) => {
    return lambda7(scope47$cap, cont1, m, marker)
  }
});
lambda7 = (undefined, function (scope47$cap, cont1, m, marker) {
  let scrut, tmp, tmp1;
  scrut = runtime.safeCall(m.has(cont1));
  if (scrut === true) {
    tmp = ", " + marker;
    tmp1 = scope47$cap.result$0 + tmp;
    scope47$cap.result$0 = tmp1;
    return runtime.Unit
  }
  return runtime.Unit;
});
lambda6 = (undefined, function (l) {
  let tmp, tmp1;
  tmp = l.localName + "=";
  tmp1 = runtime.safeCall(Rendering.render(l.value));
  return tmp + tmp1
});
lambda$7 = (undefined, function (Runtime2, ss_k, k, tag) {
  return (res) => {
    return Runtime2.ss_handlerTrampoline(ss_k, k, tag, res)
  }
});
lambda5 = (undefined, function (Runtime2, ss_k, k, tag, res) {
  return Runtime2.ss_handlerTrampoline(ss_k, k, tag, res)
});
lambda$4 = (undefined, function (Runtime2, k, tag, ss_k1, cur, resume) {
  return (_) => {
    return lambda1(Runtime2, k, tag, ss_k1, cur, resume, _)
  }
});
resumeCont$ = function resumeCont$(Runtime2, tag, hfc_k, k1) {
  return (resume_r) => {
    return resumeCont(Runtime2, tag, hfc_k, k1, resume_r)
  }
};
lambda$6 = (undefined, function (Runtime2, tag, resume, hfc_k, k1, v) {
  return (_) => {
    return lambda2(Runtime2, tag, resume, hfc_k, k1, v, _)
  }
});
resumeCont = function resumeCont(Runtime2, tag, hfc_k, k1, resume_r) {
  let inlinedVal, tmp, tmp1;
  tmp = Runtime2.stackDepth + 1;
  Runtime2.stackDepth = tmp;
  tmp1 = Runtime2.stackDepth >= Runtime2.stackLimit;
  if (tmp1 === true) {
    inlinedVal = Runtime2.stackHandler !== null;
    if (inlinedVal === true) {
      let k;
      k = resumeCont$(Runtime2, tag, hfc_k, k1);
      return runtime.safeCall(Runtime2.stackHandler.delay(k, resume_r))
    }
    return Runtime2.ss_handlerTrampoline(hfc_k, k1, tag, resume_r);
  }
  return Runtime2.ss_handlerTrampoline(hfc_k, k1, tag, resume_r);
};
lambda2 = (undefined, function (Runtime2, tag, resume, hfc_k, k1, v, _) {
  let tmp;
  tmp = Runtime2.stackDepth + 1;
  Runtime2.stackDepth = tmp;
  return handlerFunCont(Runtime2, tag, resume, hfc_k, k1, v)
});
handlerFunCont$1 = function handlerFunCont$(Runtime2, tag, resume) {
  return (hfc_k, k1, v) => {
    return handlerFunCont(Runtime2, tag, resume, hfc_k, k1, v)
  }
};
cont$ = function cont$(Runtime2, k, tag, ss_k1, cur, resume) {
  return (r) => {
    return cont(Runtime2, k, tag, ss_k1, cur, resume, r)
  }
};
resumeCont1$ = function resumeCont1$(Runtime2, k, tag, resume_k) {
  return (resume_r) => {
    return resumeCont1(Runtime2, k, tag, resume_k, resume_r)
  }
};
lambda$5 = (undefined, function (Runtime2, k, tag, resume, resume_k, r) {
  return (_) => {
    return lambda3(Runtime2, k, tag, resume, resume_k, r, _)
  }
});
resumeCont1 = function resumeCont1(Runtime2, k, tag, resume_k, resume_r) {
  let inlinedVal, tmp, tmp1;
  tmp = Runtime2.stackDepth + 1;
  Runtime2.stackDepth = tmp;
  tmp1 = Runtime2.stackDepth >= Runtime2.stackLimit;
  if (tmp1 === true) {
    inlinedVal = Runtime2.stackHandler !== null;
    if (inlinedVal === true) {
      let k1;
      k1 = resumeCont1$(Runtime2, k, tag, resume_k);
      return runtime.safeCall(Runtime2.stackHandler.delay(k1, resume_r))
    }
    return Runtime2.ss_handlerTrampoline(resume_k, k, tag, resume_r);
  }
  return Runtime2.ss_handlerTrampoline(resume_k, k, tag, resume_r);
};
lambda3 = (undefined, function (Runtime2, k, tag, resume, resume_k, r, _) {
  let tmp;
  tmp = Runtime2.stackDepth + 1;
  Runtime2.stackDepth = tmp;
  return suspendCont1(Runtime2, k, tag, resume, resume_k, r)
});
suspendCont1$ = function suspendCont1$(Runtime2, k, tag, resume) {
  return (resume_k, r) => {
    return suspendCont1(Runtime2, k, tag, resume, resume_k, r)
  }
};
lambda1 = (undefined, function (Runtime2, k, tag, ss_k1, cur, resume, _) {
  let tmp;
  tmp = Runtime2.stackDepth + 1;
  Runtime2.stackDepth = tmp;
  return loop(Runtime2, k, tag, ss_k1, cur)
});
handlerFunCont = function handlerFunCont(Runtime2, tag, resume, hfc_k, k1, v) {
  let resumeCont$here, inlinedVal, tmp, tmp1;
  tmp = Runtime2.stackDepth + 1;
  Runtime2.stackDepth = tmp;
  tmp1 = Runtime2.stackDepth >= Runtime2.stackLimit;
  if (tmp1 === true) {
    inlinedVal = Runtime2.stackHandler !== null;
    if (inlinedVal === true) {
      let k, retVal;
      k = lambda$6(Runtime2, tag, resume, hfc_k, k1, v);
      retVal = runtime.Unit;
      return runtime.safeCall(Runtime2.stackHandler.delay(k, retVal))
    }
    resumeCont$here = resumeCont$(Runtime2, tag, hfc_k, k1);
    return runtime.safeCall(resume(resumeCont$here, v));
  }
  resumeCont$here = resumeCont$(Runtime2, tag, hfc_k, k1);
  return runtime.safeCall(resume(resumeCont$here, v));
};
cont = function cont(Runtime2, k, tag, ss_k1, cur, resume, r) {
  let inlinedVal, tmp, tmp1;
  tmp = Runtime2.stackDepth + 1;
  Runtime2.stackDepth = tmp;
  tmp1 = Runtime2.stackDepth >= Runtime2.stackLimit;
  if (tmp1 === true) {
    inlinedVal = Runtime2.stackHandler !== null;
    if (inlinedVal === true) {
      let k1;
      k1 = cont$(Runtime2, k, tag, ss_k1, cur, resume);
      return runtime.safeCall(Runtime2.stackHandler.delay(k1, r))
    }
    return loop(Runtime2, k, tag, ss_k1, r);
  }
  return loop(Runtime2, k, tag, ss_k1, r);
};
suspendCont1 = function suspendCont1(Runtime2, k, tag, resume, resume_k, r) {
  let resumeCont1$here, inlinedVal, tmp, tmp1;
  tmp = Runtime2.stackDepth + 1;
  Runtime2.stackDepth = tmp;
  tmp1 = Runtime2.stackDepth >= Runtime2.stackLimit;
  if (tmp1 === true) {
    inlinedVal = Runtime2.stackHandler !== null;
    if (inlinedVal === true) {
      let k1, retVal;
      k1 = lambda$5(Runtime2, k, tag, resume, resume_k, r);
      retVal = runtime.Unit;
      return runtime.safeCall(Runtime2.stackHandler.delay(k1, retVal))
    }
    resumeCont1$here = resumeCont1$(Runtime2, k, tag, resume_k);
    return runtime.safeCall(resume(resumeCont1$here, r));
  }
  resumeCont1$here = resumeCont1$(Runtime2, k, tag, resume_k);
  return runtime.safeCall(resume(resumeCont1$here, r));
};
lambda$3 = (undefined, function (Runtime2, ss_k, k, tag, cur) {
  return (_) => {
    return lambda4(Runtime2, ss_k, k, tag, cur, _)
  }
});
loop = function loop(Runtime2, k, tag, ss_k1, cur) {
  let scrut, arg$Suspend$0$, arg$Suspend$1$, arg$Suspend$2$, tmp, cont$here, handlerFunCont$here, suspendCont1$here, inlinedVal, tmp1, tmp2;
  tmp1 = Runtime2.stackDepth + 1;
  Runtime2.stackDepth = tmp1;
  tmp2 = Runtime2.stackDepth >= Runtime2.stackLimit;
  if (tmp2 === true) {
    inlinedVal = Runtime2.stackHandler !== null;
  } else {
    inlinedVal = false;
  }
  if (inlinedVal === true) {
    let k1, retVal;
    k1 = lambda$4(Runtime2, k, tag, ss_k1, cur, undefined);
    retVal = runtime.Unit;
    return runtime.safeCall(Runtime2.stackHandler.delay(k1, retVal))
  }
  if (cur instanceof Runtime2.Suspend.class) {
    arg$Suspend$0$ = cur.k;
    arg$Suspend$1$ = cur.tag;
    arg$Suspend$2$ = cur.handlerFun;
    scrut = arg$Suspend$1$ === tag;
    if (scrut === true) {
      cont$here = cont$(Runtime2, k, tag, ss_k1, cur, arg$Suspend$0$);
      handlerFunCont$here = handlerFunCont$1(Runtime2, tag, arg$Suspend$0$);
      return runtime.safeCall(arg$Suspend$2$(cont$here, Runtime2.cpsId2, handlerFunCont$here))
    }
    suspendCont1$here = suspendCont1$(Runtime2, k, tag, arg$Suspend$0$);
    tmp = Runtime2.Suspend(suspendCont1$here, arg$Suspend$1$, arg$Suspend$2$);
    return runtime.safeCall(ss_k1(tmp));
  }
  return runtime.safeCall(k(ss_k1, cur));
};
lambda4 = (undefined, function (Runtime2, ss_k, k, tag, cur, _) {
  let tmp;
  tmp = Runtime2.stackDepth + 1;
  Runtime2.stackDepth = tmp;
  return Runtime2.ss_handlerTrampoline(ss_k, k, tag, cur)
});
handlerFunCont$ = function handlerFunCont$(Runtime2, tag, resume) {
  return (k1, v) => {
    let tmp;
    tmp = runtime.safeCall(resume(v));
    return Runtime2.handlerTrampoline(k1, tag, tmp)
  }
};
handlerFunCont1 = function handlerFunCont(Runtime2, tag, resume, k1, v) {
  let tmp;
  tmp = runtime.safeCall(resume(v));
  return Runtime2.handlerTrampoline(k1, tag, tmp)
};
(class Capture$scope23 {
  static {
    Capture$scope231 = this
  }
  constructor(handlerFunCont$0, tmp$1, tmp$2) {
    this.tmp$2 = tmp$2;
    this.tmp$1 = tmp$1;
    this.handlerFunCont$0 = handlerFunCont$0;
  }
  toString() { return runtime.render(this); }
  static [definitionMetadata] = ["class", "Capture$scope23"];
});
lambda$2 = (undefined, function (Runtime2, k, tag, resume) {
  return (r) => {
    let tmp;
    tmp = runtime.safeCall(resume(r));
    return Runtime2.handlerTrampoline(k, tag, tmp)
  }
});
lambda = (undefined, function (Runtime2, k, tag, resume, r) {
  let tmp;
  tmp = runtime.safeCall(resume(r));
  return Runtime2.handlerTrampoline(k, tag, tmp)
});
(class Capture$handlerTrampoline {
  static {
    Capture$handlerTrampoline1 = this
  }
  constructor(cur$0) {
    this.cur$0 = cur$0;
  }
  toString() { return runtime.render(this); }
  static [definitionMetadata] = ["class", "Capture$handlerTrampoline"];
});
lambda$1 = (undefined, function (Runtime2) {
  return (k) => {
    Runtime2.stackResume = k;
    return runtime.Unit
  }
});
lambda11 = (undefined, function (Runtime2, k) {
  Runtime2.stackResume = k;
  return runtime.Unit
});
lambda$ = (undefined, function (Runtime2, EffectHandle1, value) {
  return () => {
    return Runtime2.resume(EffectHandle1.reified.contTrace)(value)
  }
});
lambda10 = (undefined, function (Runtime2, EffectHandle1, value) {
  return Runtime2.resume(EffectHandle1.reified.contTrace)(value)
});
(class Runtime {
  static {
    Runtime1 = this
  }
  static #curEffect;
  static #resumeValue;
  static #resumeArr;
  static #resumeIdx;
  static #resumePc;
  static #stackLimit;
  static #stackDepth;
  static #stackHandler;
  static #stackResume;
  static get curEffect() { return Runtime.#curEffect; }
  static set curEffect(value) { Runtime.#curEffect = value; }
  static get resumeValue() { return Runtime.#resumeValue; }
  static set resumeValue(value) { Runtime.#resumeValue = value; }
  static get resumeArr() { return Runtime.#resumeArr; }
  static set resumeArr(value) { Runtime.#resumeArr = value; }
  static get resumeIdx() { return Runtime.#resumeIdx; }
  static set resumeIdx(value) { Runtime.#resumeIdx = value; }
  static get resumePc() { return Runtime.#resumePc; }
  static set resumePc(value) { Runtime.#resumePc = value; }
  static get stackLimit() { return Runtime.#stackLimit; }
  static set stackLimit(value) { Runtime.#stackLimit = value; }
  static get stackDepth() { return Runtime.#stackDepth; }
  static set stackDepth(value) { Runtime.#stackDepth = value; }
  static get stackHandler() { return Runtime.#stackHandler; }
  static set stackHandler(value) { Runtime.#stackHandler = value; }
  static get stackResume() { return Runtime.#stackResume; }
  static set stackResume(value) { Runtime.#stackResume = value; }
  static {
    (class Unit {
      static {
        new this
      }
      constructor() {
        Runtime.Unit = this;
        Object.defineProperty(this, "class", {
          value: Unit
        });
        globalThis.Object.freeze(this);
      }
      toString() {
        return "()"
      }
      [prettyPrint]() { return this.toString(); }
      static [definitionMetadata] = ["object", "Unit"];
    });
    (class Continue {
      static {
        new this
      }
      constructor() {
        Runtime.Continue = this;
        Object.defineProperty(this, "class", {
          value: Continue
        });
        globalThis.Object.freeze(this);
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["object", "Continue"];
    });
    (class LoopEnd {
      static {
        new this
      }
      constructor() {
        Runtime.LoopEnd = this;
        Object.defineProperty(this, "class", {
          value: LoopEnd
        });
        globalThis.Object.freeze(this);
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["object", "LoopEnd"];
    });
    Runtime.short_and = RuntimeJS.short_and;
    Runtime.short_or = RuntimeJS.short_or;
    Runtime.bitand = RuntimeJS.bitand;
    Runtime.bitnot = RuntimeJS.bitnot;
    Runtime.bitor = RuntimeJS.bitor;
    Runtime.shl = RuntimeJS.shl;
    Runtime.try_catch = RuntimeJS.try_catch;
    Runtime.EffectHandle = function EffectHandle(_reified) {
      return globalThis.Object.freeze(new EffectHandle.class(_reified));
    };
    (class EffectHandle {
      static {
        Runtime.EffectHandle.class = this
      }
      constructor(_reified) {
        this.#_reified = _reified;
        this.reified = this.#_reified;
      }
      #_reified;
      resumeWith(value) {
        let lambda$here;
        lambda$here = lambda$(Runtime, this, value);
        return Runtime._try(lambda$here)
      }
      raise() {
        Runtime.curEffect = this.reified;
        return runtime.Unit
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["class", "EffectHandle", [null]];
    });
    Runtime.MatchSuccess = function MatchSuccess(output, bindings) {
      return globalThis.Object.freeze(new MatchSuccess.class(output, bindings));
    };
    (class MatchSuccess {
      static {
        Runtime.MatchSuccess.class = this
      }
      constructor(output, bindings) {
        this.output = output;
        this.bindings = bindings;
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["class", "MatchSuccess", ["output", "bindings"]];
    });
    Runtime.MatchFailure = function MatchFailure(errors) {
      return globalThis.Object.freeze(new MatchFailure.class(errors));
    };
    (class MatchFailure {
      static {
        Runtime.MatchFailure.class = this
      }
      constructor(errors) {
        this.errors = errors;
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["class", "MatchFailure", ["errors"]];
    });
    (class Tuple {
      static {
        Runtime.Tuple = this
      }
      static {
        Tuple.split = LazyArray.__split;
      }
      static slice(xs, i, j) {
        let tmp;
        tmp = xs.length - j;
        return runtime.safeCall(xs.slice(i, tmp))
      }
      static lazySlice(xs, i, j) {
        let callPrefix;
        callPrefix = runtime.safeCall(LazyArray.dropLeftRight(i, j));
        return runtime.safeCall(callPrefix(xs))
      }
      static lazyConcat(...args) {
        return runtime.safeCall(LazyArray.__concat(...args))
      }
      static get(xs, i) {
        let scrut, scrut1, tmp;
        scrut = i >= xs.length;
        if (scrut === true) {
          throw runtime.safeCall(globalThis.RangeError("Tuple.get: index out of bounds"))
        }
        tmp = - xs.length;
        scrut1 = i < tmp;
        if (scrut1 === true) {
          throw runtime.safeCall(globalThis.RangeError("Tuple.get: negative index out of bounds"))
        }
        return xs.at(i);
      }
      static isArrayLike(xs) {
        return runtime.safeCall(Iter.isArrayLike(xs))
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["class", "Tuple"];
    });
    (class Str {
      static {
        Runtime.Str = this
      }
      static startsWith(string, prefix) {
        return runtime.safeCall(string.startsWith(prefix))
      }
      static get(string, i) {
        let scrut;
        scrut = i >= string.length;
        if (scrut === true) {
          throw runtime.safeCall(globalThis.RangeError("Str.get: index out of bounds"))
        }
        return runtime.safeCall(string.at(i));
      }
      static take(string, n) {
        return runtime.safeCall(string.slice(0, n))
      }
      static leave(string, n) {
        return runtime.safeCall(string.slice(n))
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["class", "Str"];
    });
    Runtime.render = Rendering.render;
    (class TraceLogger {
      static {
        Runtime.TraceLogger = this
      }
      static #enabled;
      static #indentLvl;
      static get enabled() { return TraceLogger.#enabled; }
      static set enabled(value) { TraceLogger.#enabled = value; }
      static get indentLvl() { return TraceLogger.#indentLvl; }
      static set indentLvl(value) { TraceLogger.#indentLvl = value; }
      static {
        TraceLogger.enabled = false;
        TraceLogger.indentLvl = 0;
      }
      static indent() {
        let scrut, prev, tmp;
        scrut = TraceLogger.enabled;
        if (scrut === true) {
          prev = TraceLogger.indentLvl;
          tmp = prev + 1;
          TraceLogger.indentLvl = tmp;
          return prev
        }
        return runtime.Unit;
      }
      static resetIndent(n) {
        let scrut;
        scrut = TraceLogger.enabled;
        if (scrut === true) {
          TraceLogger.indentLvl = n;
          return runtime.Unit
        }
        return runtime.Unit;
      }
      static log(msg) {
        let scrut, tmp, tmp1, tmp2, tmp3, tmp4;
        scrut = TraceLogger.enabled;
        if (scrut === true) {
          tmp = runtime.safeCall(("| ").repeat(TraceLogger.indentLvl));
          tmp1 = runtime.safeCall(("  ").repeat(TraceLogger.indentLvl));
          tmp2 = "\n" + tmp1;
          tmp3 = runtime.safeCall(msg.replaceAll("\n", tmp2));
          tmp4 = tmp + tmp3;
          return runtime.safeCall(globalThis.console.log(tmp4))
        }
        return runtime.Unit;
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["class", "TraceLogger"];
    });
    Runtime.curEffect = null;
    Runtime.resumeValue = null;
    Runtime.resumeArr = null;
    Runtime.resumeIdx = null;
    Runtime.resumePc = -1;
    (class FatalEffect {
      static {
        new this
      }
      constructor() {
        Runtime.FatalEffect = this;
        Object.defineProperty(this, "class", {
          value: FatalEffect
        });
        globalThis.Object.freeze(this);
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["object", "FatalEffect"];
    });
    (class PrintStackEffect {
      static {
        new this
      }
      constructor() {
        Runtime.PrintStackEffect = this;
        Object.defineProperty(this, "class", {
          value: PrintStackEffect
        });
        globalThis.Object.freeze(this);
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["object", "PrintStackEffect"];
    });
    Runtime.Suspend = function Suspend(k, tag, handlerFun) {
      return globalThis.Object.freeze(new Suspend.class(k, tag, handlerFun));
    };
    (class Suspend {
      static {
        Runtime.Suspend.class = this
      }
      constructor(k, tag, handlerFun) {
        this.k = k;
        this.tag = tag;
        this.handlerFun = handlerFun;
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["class", "Suspend", ["k", "tag", "handlerFun"]];
    });
    Runtime.StackSuspend = function StackSuspend(k, tag, retVal) {
      return globalThis.Object.freeze(new StackSuspend.class(k, tag, retVal));
    };
    (class StackSuspend {
      static {
        Runtime.StackSuspend.class = this
      }
      constructor(k, tag, retVal) {
        this.k = k;
        this.tag = tag;
        this.retVal = retVal;
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["class", "StackSuspend", ["k", "tag", "retVal"]];
    });
    Runtime.FunctionContFrame = function FunctionContFrame(next, saved) {
      return globalThis.Object.freeze(new FunctionContFrame.class(next, saved));
    };
    (class FunctionContFrame {
      static {
        Runtime.FunctionContFrame.class = this
      }
      constructor(next, saved) {
        this.next = next;
        this.saved = saved;
      }
      resume(value) {
        let i, f, argListsLength, currentArgList, scrut, argListLength, tmp, tmp1, tmp2, tmp3, tmp4, tmp5;
        i = 0;
        f = this.saved.at(0);
        argListsLength = this.saved.at(5);
        currentArgList = 6;
        Runtime.resumeValue = value;
        Runtime.resumeArr = this.saved;
        Runtime.resumePc = this.saved.at(1);
        scrut = argListsLength === 0;
        if (scrut === true) {
          runtime.safeCall(globalThis.console.log("cannot resume getters"));
        }
        lbl: while (true) {
          let scrut1, argListLength1, tmp6, tmp7, tmp8, tmp9, tmp10, tmp11, tmp12, tmp13, tmp14;
          tmp6 = argListsLength - 1;
          scrut1 = i < tmp6;
          if (scrut1 === true) {
            argListLength1 = this.saved.at(currentArgList);
            tmp7 = currentArgList + 1;
            tmp8 = currentArgList + 1;
            tmp9 = tmp8 + argListLength1;
            tmp10 = runtime.safeCall(this.saved.slice(tmp7, tmp9));
            tmp11 = runtime.safeCall(f.apply(this.saved.at(4), tmp10));
            f = tmp11;
            tmp12 = argListLength1 + 1;
            tmp13 = currentArgList + tmp12;
            currentArgList = tmp13;
            tmp14 = i + 1;
            i = tmp14;
            continue lbl
          }
          break;
        }
        argListLength = this.saved.at(currentArgList);
        tmp = currentArgList + argListLength;
        tmp1 = tmp + 2;
        Runtime.resumeIdx = tmp1;
        tmp2 = currentArgList + 1;
        tmp3 = currentArgList + 1;
        tmp4 = tmp3 + argListLength;
        tmp5 = runtime.safeCall(this.saved.slice(tmp2, tmp4));
        return runtime.safeCall(f.apply(this.saved.at(4), tmp5))
      }
      get getLocals() {
        let debugInfo, i, cur, res, i1;
        debugInfo = this.saved.at(3);
        i = 0;
        cur = 6;
        lbl: while (true) {
          let scrut, tmp, tmp1, tmp2;
          scrut = i < this.saved.at(5);
          if (scrut === true) {
            tmp = this.saved.at(cur) + 1;
            tmp1 = cur + tmp;
            cur = tmp1;
            tmp2 = i + 1;
            i = tmp2;
            continue lbl
          }
          break;
        }
        res = [];
        i1 = 1;
        lbl1: while (true) {
          let scrut, tmp, tmp1, tmp2, tmp3, tmp4;
          scrut = i1 < debugInfo.length;
          if (scrut === true) {
            tmp = i1 + 1;
            tmp1 = cur + 1;
            tmp2 = tmp1 + debugInfo.at(i1);
            tmp3 = globalThis.Object.freeze(new Runtime.LocalVarInfo.class(debugInfo.at(tmp), this.saved.at(tmp2)));
            runtime.safeCall(res.push(tmp3));
            tmp4 = i1 + 2;
            i1 = tmp4;
            continue lbl1
          }
          break;
        }
        return res;
      }
      get getNme() {
        return this.saved.at(3).at(0);
      }
      get getLoc() {
        let loc;
        loc = this.saved.at(2);
        if (loc === null) {
          return "pc=" + this.saved.at(1)
        }
        return loc;
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["class", "FunctionContFrame", ["next", "saved"]];
    });
    Runtime.HandlerContFrame = function HandlerContFrame(next, nextHandler, handler) {
      return globalThis.Object.freeze(new HandlerContFrame.class(next, nextHandler, handler));
    };
    (class HandlerContFrame {
      static {
        Runtime.HandlerContFrame.class = this
      }
      constructor(next, nextHandler, handler) {
        this.next = next;
        this.nextHandler = nextHandler;
        this.handler = handler;
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["class", "HandlerContFrame", ["next", "nextHandler", "handler"]];
    });
    Runtime.ContTrace = function ContTrace(next, last, nextHandler, lastHandler, resumed) {
      return globalThis.Object.freeze(new ContTrace.class(next, last, nextHandler, lastHandler, resumed));
    };
    (class ContTrace {
      static {
        Runtime.ContTrace.class = this
      }
      constructor(next, last, nextHandler, lastHandler, resumed) {
        this.next = next;
        this.last = last;
        this.nextHandler = nextHandler;
        this.lastHandler = lastHandler;
        this.resumed = resumed;
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["class", "ContTrace", ["next", "last", "nextHandler", "lastHandler", "resumed"]];
    });
    Runtime.EffectSig = function EffectSig(contTrace, handler, handlerFun) {
      return globalThis.Object.freeze(new EffectSig.class(contTrace, handler, handlerFun));
    };
    (class EffectSig {
      static {
        Runtime.EffectSig.class = this
      }
      constructor(contTrace, handler, handlerFun) {
        this.contTrace = contTrace;
        this.handler = handler;
        this.handlerFun = handlerFun;
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["class", "EffectSig", ["contTrace", "handler", "handlerFun"]];
    });
    (class NonLocalReturn {
      static {
        Runtime.NonLocalReturn = this
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["class", "NonLocalReturn"];
    });
    Runtime.FnLocalsInfo = function FnLocalsInfo(fnName, locals) {
      return globalThis.Object.freeze(new FnLocalsInfo.class(fnName, locals));
    };
    (class FnLocalsInfo {
      static {
        Runtime.FnLocalsInfo.class = this
      }
      constructor(fnName, locals) {
        this.fnName = fnName;
        this.locals = locals;
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["class", "FnLocalsInfo", ["fnName", "locals"]];
    });
    Runtime.LocalVarInfo = function LocalVarInfo(localName, value) {
      return globalThis.Object.freeze(new LocalVarInfo.class(localName, value));
    };
    (class LocalVarInfo {
      static {
        Runtime.LocalVarInfo.class = this
      }
      constructor(localName, value) {
        this.localName = localName;
        this.value = value;
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["class", "LocalVarInfo", ["localName", "value"]];
    });
    Runtime.CustomStackError = function CustomStackError(stack) {
      return globalThis.Object.freeze(new CustomStackError.class(stack));
    };
    (class CustomStackError {
      static {
        Runtime.CustomStackError.class = this
      }
      constructor(stack) {
        this.stack = stack;
      }
      toString() {
        return this.stack
      }
      [prettyPrint]() { return this.toString(); }
      static [definitionMetadata] = ["class", "CustomStackError", ["stack"]];
    });
    (class AsyncEffectMarker {
      static {
        new this
      }
      constructor() {
        Runtime.AsyncEffectMarker = this;
        Object.defineProperty(this, "class", {
          value: AsyncEffectMarker
        });
        globalThis.Object.freeze(this);
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["object", "AsyncEffectMarker"];
    });
    Runtime.stackLimit = 0;
    Runtime.stackDepth = 0;
    Runtime.stackHandler = null;
    Runtime.stackResume = null;
    (class StackDelayHandler {
      static {
        new this
      }
      constructor() {
        Runtime.StackDelayHandler = this;
        Object.defineProperty(this, "class", {
          value: StackDelayHandler
        });
        globalThis.Object.freeze(this);
      }
      delay() {
        let lambda$here;
        lambda$here = lambda$1(Runtime);
        return Runtime.mkEffect(this, lambda$here)
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["object", "StackDelayHandler"];
    });
    (class StackDelayCpsHandler {
      static {
        new this
      }
      constructor() {
        Runtime.StackDelayCpsHandler = this;
        Object.defineProperty(this, "class", {
          value: StackDelayCpsHandler
        });
        globalThis.Object.freeze(this);
      }
      delay(k, retVal) {
        return globalThis.Object.freeze(new Runtime.StackSuspend.class(k, Runtime.stackHandler, retVal))
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["object", "StackDelayCpsHandler"];
    });
    Runtime.Int31 = function Int31(v) {
      return globalThis.Object.freeze(new Int31.class(v));
    };
    (class Int31 {
      static {
        Runtime.Int31.class = this
      }
      constructor(v) {
        this.#v = v;
      }
      #v;
      zext() {
        let tmp, tmp1;
        tmp = runtime.safeCall(Runtime.shl(1, 31));
        tmp1 = runtime.safeCall(Runtime.bitnot(tmp));
        return runtime.safeCall(Runtime.bitand(this.#v, tmp1))
      }
      sext() {
        let tmp;
        tmp = runtime.safeCall(Runtime.shl(1, 31));
        return runtime.safeCall(Runtime.bitor(this.#v, tmp))
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["class", "Int31", [null]];
    });
  }
  static cpsId(x) {
    return x
  }
  static cpsId2(k, x) {
    return runtime.safeCall(k(x))
  }
  static get unreachable() {
    throw runtime.safeCall(globalThis.Error("unreachable"));
  }
  static assertFail(file, line) {
    let tmp, tmp1, tmp2, tmp3;
    tmp = "Assertion failed (" + file;
    tmp1 = tmp + ":";
    tmp2 = tmp1 + line;
    tmp3 = tmp2 + ")";
    throw runtime.safeCall(globalThis.Error(tmp3))
  }
  static checkArgs(functionName, expected, isUB, got) {
    let scrut, scrut1, tmp, tmp1, tmp2, tmp3, tmp4, tmp5, tmp6, tmp7, tmp8, tmp9, tmp10, tmp11, tmp12, tmp13, tmp14;
    tmp = got < expected;
    if (tmp === false) {
      if (isUB === true) {
        tmp2 = got > expected;
      } else {
        tmp2 = false;
      }
      tmp1 = tmp2;
    } else {
      tmp1 = true;
    }
    if (tmp1 === true) {
      scrut = functionName.length > 0;
      if (scrut === true) {
        tmp3 = " '" + functionName;
        tmp4 = tmp3 + "'";
      } else {
        tmp4 = "";
      }
      tmp5 = "Function" + tmp4;
      tmp6 = tmp5 + " expected ";
      if (isUB === true) {
        tmp7 = "";
      } else {
        tmp7 = "at least ";
      }
      tmp8 = tmp6 + tmp7;
      tmp9 = tmp8 + expected;
      tmp10 = tmp9 + " argument";
      scrut1 = expected === 1;
      if (scrut1 === true) {
        tmp11 = "";
      } else {
        tmp11 = "s";
      }
      tmp12 = tmp10 + tmp11;
      tmp13 = tmp12 + " but got ";
      tmp14 = tmp13 + got;
      throw runtime.safeCall(globalThis.Error(tmp14))
    }
    return runtime.Unit;
  }
  static checkSelect(sel, nme, qual) {
    let scrut, tmp, tmp1, tmp2;
    scrut = sel === undefined;
    if (scrut === true) {
      tmp = "Access to required field '" + nme;
      tmp1 = tmp + "' yielded 'undefined'";
      throw runtime.safeCall(globalThis.Error(tmp1))
    }
    tmp2 = nme + "$__checkNotMethod";
    qual[tmp2];
    return sel;
  }
  static safeCall(x) {
    if (x === undefined) {
      return runtime.Unit
    }
    return x;
  }
  static checkCall(x) {
    if (x === undefined) {
      throw runtime.safeCall(globalThis.Error("MLscript call unexpectedly returned `undefined`, the forbidden value."))
    }
    return x;
  }
  static deboundMethod(mtdName, clsName) {
    let tmp, tmp1, tmp2, tmp3;
    tmp = "[debinding error] Method '" + mtdName;
    tmp1 = tmp + "' of class '";
    tmp2 = tmp1 + clsName;
    tmp3 = tmp2 + "' was accessed without being called.";
    throw runtime.safeCall(globalThis.Error(tmp3))
  }
  static _try(f) {
    let res, scrut, tmp;
    res = runtime.safeCall(f());
    scrut = Runtime.curEffect !== null;
    if (scrut === true) {
      tmp = Runtime.curEffect;
      Runtime.curEffect = null;
      return Runtime.EffectHandle(tmp)
    }
    return res;
  }
  static printRaw(x) {
    let rcd, tmp;
    rcd = globalThis.Object.freeze({
      indent: 2,
      breakLength: 76
    });
    tmp = runtime.safeCall(Runtime.render(x, rcd));
    return runtime.safeCall(globalThis.console.log(tmp))
  }
  static handlerTrampoline(k, tag, cur) {
    let handlerTrampoline$cap;
    handlerTrampoline$cap = new Capture$handlerTrampoline1(cur);
    lbl: while (true) {
      let scrut, arg$Suspend$0$, arg$Suspend$1$, arg$Suspend$2$, scope23$cap, lambda$here;
      scope23$cap = new Capture$scope231(undefined, undefined, undefined);
      if (handlerTrampoline$cap.cur$0 instanceof Runtime.Suspend.class) {
        arg$Suspend$0$ = handlerTrampoline$cap.cur$0.k;
        arg$Suspend$1$ = handlerTrampoline$cap.cur$0.tag;
        arg$Suspend$2$ = handlerTrampoline$cap.cur$0.handlerFun;
        scrut = arg$Suspend$1$ === tag;
        if (scrut === true) {
          scope23$cap.handlerFunCont$0 = handlerFunCont$(Runtime, tag, arg$Suspend$0$);
          scope23$cap.tmp$1 = runtime.safeCall(arg$Suspend$2$(Runtime.cpsId, scope23$cap.handlerFunCont$0));
          handlerTrampoline$cap.cur$0 = scope23$cap.tmp$1;
          scope23$cap.tmp$2 = runtime.Unit;
          continue lbl
        }
        lambda$here = lambda$2(Runtime, k, tag, arg$Suspend$0$);
        return Runtime.Suspend(lambda$here, arg$Suspend$1$, arg$Suspend$2$);
      }
      break;
    }
    return runtime.safeCall(k(handlerTrampoline$cap.cur$0))
  }
  static cpsHandlerImpl(k, tag, f) {
    let tmp;
    tmp = runtime.safeCall(f(Runtime.cpsId));
    return Runtime.handlerTrampoline(k, tag, tmp)
  }
  static ss_handlerTrampoline(ss_k, k, tag, cur) {
    let scrut, lambda$here;
    scrut = Runtime.cpsSetCheckDepth();
    if (scrut === true) {
      lambda$here = lambda$3(Runtime, ss_k, k, tag, cur);
      return Runtime.cpsRaiseStack(lambda$here, runtime.Unit)
    }
    return loop(Runtime, k, tag, ss_k, cur);
  }
  static ss_cpsHandlerImpl(ss_k, k, tag, f) {
    let lambda$here;
    lambda$here = lambda$7(Runtime, ss_k, k, tag);
    return runtime.safeCall(f(lambda$here, Runtime.cpsId2))
  }
  static resetEffects() {
    Runtime.curEffect = null;
    Runtime.resumePc = -1;
    return runtime.Unit
  }
  static raisePrintStackEffect(showLocals) {
    return Runtime.mkEffect(Runtime.PrintStackEffect, showLocals)
  }
  static topLevelEffect(debug) {
    let tr, v, tmp, tmp1;
    tr = Runtime.curEffect;
    v = null;
    lbl: while (true) {
      let scrut, tmp2, tmp3;
      if (tr instanceof Runtime.EffectSig.class) {
        scrut = tr.handler === Runtime.PrintStackEffect;
        if (scrut === true) {
          tmp2 = Runtime.showStackTrace("Stack Trace:", tr, debug, tr.handlerFun);
          runtime.safeCall(globalThis.console.log(tmp2));
          Runtime.curEffect = null;
          tmp3 = Runtime.resume(tr.contTrace)(runtime.Unit);
          v = tmp3;
          tr = Runtime.curEffect;
          continue lbl
        }
      }
      break;
    }
    if (tr instanceof Runtime.EffectSig.class) {
      Runtime.curEffect = null;
      tmp = "Error: Unhandled effect " + tr.handler.constructor.name;
      tmp1 = Runtime.showStackTrace(tmp, tr, debug, false);
      throw Runtime.CustomStackError(tmp1)
    }
    return v;
  }
  static illegalEffect(position) {
    let tmp, tmp1, tmp2, tmp3, tmp4;
    tmp = Runtime.curEffect;
    Runtime.curEffect = null;
    tmp1 = "Error: Effect " + tmp.handler.constructor.name;
    tmp2 = tmp1 + " is raised ";
    tmp3 = tmp2 + position;
    tmp4 = Runtime.showStackTrace(tmp3, tmp, false, false);
    throw Runtime.CustomStackError(tmp4)
  }
  static showStackTrace(header, tr, debug, showLocals) {
    let msg, curHandler, atTail;
    msg = header;
    curHandler = tr.contTrace;
    atTail = true;
    if (debug === true) {
      lbl: while (true) {
        let scrut, cur, scrut1, tmp, tmp1;
        scrut = curHandler !== null;
        if (scrut === true) {
          cur = curHandler.next;
          lbl1: while (true) {
            let scrut2, curLocals, loc, scrut3, tmp2, tmp3, tmp4, tmp5, tmp6, tmp7, tmp8, tmp9, tmp10;
            scrut2 = cur !== null;
            if (scrut2 === true) {
              curLocals = cur.getLocals;
              loc = cur.getLoc;
              if (showLocals === true) {
                scrut3 = curLocals.length > 0;
                if (scrut3 === true) {
                  tmp2 = runtime.safeCall(curLocals.map(lambda6));
                  tmp3 = runtime.safeCall(tmp2.join(", "));
                  tmp4 = " with locals: " + tmp3;
                } else {
                  tmp4 = "";
                }
              } else {
                tmp4 = "";
              }
              tmp5 = "\n\tat " + cur.getNme;
              tmp6 = tmp5 + " (";
              tmp7 = tmp6 + loc;
              tmp8 = tmp7 + ")";
              tmp9 = msg + tmp8;
              tmp10 = tmp9 + tmp4;
              msg = tmp10;
              cur = cur.next;
              atTail = false;
              continue lbl1
            }
            break;
          }
          curHandler = curHandler.nextHandler;
          scrut1 = curHandler !== null;
          if (scrut1 === true) {
            tmp = "\n\twith handler " + curHandler.handler.constructor.name;
            tmp1 = msg + tmp;
            msg = tmp1;
            atTail = false;
            continue lbl
          }
          continue lbl;
        }
        break;
      }
      if (atTail === true) {
        return msg + "\n\tat tail position"
      }
      return msg;
    }
    return header;
  }
  static showFunctionContChain(cont1, hl, vis, reps) {
    let scrut, scrut1, scrut2, tmp, tmp1, tmp2, tmp3, tmp4, scope47$cap, lambda$here;
    scope47$cap = new Capture$scope471(undefined);
    if (cont1 instanceof Runtime.FunctionContFrame.class) {
      tmp = cont1.constructor.name + "(pc=";
      scope47$cap.result$0 = tmp + cont1.saved.at(1);
      lambda$here = lambda$8(scope47$cap, cont1);
      runtime.safeCall(hl.forEach(lambda$here));
      scrut = runtime.safeCall(vis.has(cont1));
      if (scrut === true) {
        tmp1 = reps + 1;
        reps = tmp1;
        scrut1 = tmp1 > 10;
        if (scrut1 === true) {
          throw runtime.safeCall(globalThis.Error("10 repeated continuation frame (loop?)"))
        }
        tmp2 = scope47$cap.result$0 + ", REPEAT";
        scope47$cap.result$0 = tmp2;
      } else {
        runtime.safeCall(vis.add(cont1));
      }
      tmp3 = scope47$cap.result$0 + ") -> ";
      tmp4 = Runtime.showFunctionContChain(cont1.next, hl, vis, reps);
      return tmp3 + tmp4
    }
    scrut2 = cont1 === null;
    if (scrut2 === true) {
      return "(null)"
    }
    return "(NOT CONT)";
  }
  static showHandlerContChain(cont1, hl, vis, reps) {
    let scrut, scrut1, scrut2, tmp, tmp1, tmp2, tmp3, scope49$cap, lambda$here;
    scope49$cap = new Capture$scope491(undefined);
    if (cont1 instanceof Runtime.HandlerContFrame.class) {
      scope49$cap.result$0 = cont1.handler.constructor.name;
      lambda$here = lambda$9(scope49$cap, cont1);
      runtime.safeCall(hl.forEach(lambda$here));
      scrut = runtime.safeCall(vis.has(cont1));
      if (scrut === true) {
        tmp = reps + 1;
        reps = tmp;
        scrut1 = tmp > 10;
        if (scrut1 === true) {
          throw runtime.safeCall(globalThis.Error("10 repeated continuation frame (loop?)"))
        }
        tmp1 = scope49$cap.result$0 + ", REPEAT";
        scope49$cap.result$0 = tmp1;
      } else {
        runtime.safeCall(vis.add(cont1));
      }
      tmp2 = scope49$cap.result$0 + " -> ";
      tmp3 = Runtime.showFunctionContChain(cont1.next, hl, vis, reps);
      return tmp2 + tmp3
    }
    scrut2 = cont1 === null;
    if (scrut2 === true) {
      return "(null)"
    }
    return "(NOT HANDLER CONT)";
  }
  static debugCont(cont1) {
    let tmp, tmp1, tmp2;
    tmp = globalThis.Object.freeze(new globalThis.Map());
    tmp1 = globalThis.Object.freeze(new globalThis.Set());
    tmp2 = Runtime.showFunctionContChain(cont1, tmp, tmp1, 0);
    return runtime.safeCall(globalThis.console.log(tmp2))
  }
  static debugHandler(cont1) {
    let tmp, tmp1, tmp2;
    tmp = globalThis.Object.freeze(new globalThis.Map());
    tmp1 = globalThis.Object.freeze(new globalThis.Set());
    tmp2 = Runtime.showHandlerContChain(cont1, tmp, tmp1, 0);
    return runtime.safeCall(globalThis.console.log(tmp2))
  }
  static debugContTrace(contTrace) {
    let scrut, scrut1, vis, hl, cur, tmp, tmp1, tmp2, tmp3, tmp4;
    if (contTrace instanceof Runtime.ContTrace.class) {
      runtime.safeCall(globalThis.console.log("resumed: ", contTrace.resumed));
      scrut = contTrace.last === contTrace;
      if (scrut === true) {
        runtime.safeCall(globalThis.console.log("<last is self>"));
      }
      scrut1 = contTrace.lastHandler === contTrace;
      if (scrut1 === true) {
        runtime.safeCall(globalThis.console.log("<lastHandler is self>"));
      }
      vis = globalThis.Object.freeze(new globalThis.Set());
      hl = globalThis.Object.freeze(new globalThis.Map());
      tmp = globalThis.Object.freeze([
        contTrace.last
      ]);
      tmp1 = globalThis.Object.freeze(new globalThis.Set(tmp));
      runtime.safeCall(hl.set("last", tmp1));
      tmp2 = globalThis.Object.freeze([
        contTrace.lastHandler
      ]);
      tmp3 = globalThis.Object.freeze(new globalThis.Set(tmp2));
      runtime.safeCall(hl.set("last-handler", tmp3));
      tmp4 = Runtime.showFunctionContChain(contTrace.next, hl, vis, 0);
      runtime.safeCall(globalThis.console.log(tmp4));
      cur = contTrace.nextHandler;
      lbl: while (true) {
        let scrut2, tmp5;
        scrut2 = cur !== null;
        if (scrut2 === true) {
          tmp5 = Runtime.showHandlerContChain(cur, hl, vis, 0);
          runtime.safeCall(globalThis.console.log(tmp5));
          cur = cur.nextHandler;
          continue lbl
        }
        break;
      }
      return runtime.safeCall(globalThis.console.log())
    }
    runtime.safeCall(globalThis.console.log("Not a cont trace:"));
    return runtime.safeCall(globalThis.console.log(contTrace));
  }
  static debugEff(eff) {
    if (eff instanceof Runtime.EffectSig.class) {
      runtime.safeCall(globalThis.console.log("Debug EffectSig:"));
      runtime.safeCall(globalThis.console.log("handler: ", eff.handler.constructor.name));
      runtime.safeCall(globalThis.console.log("handlerFun: ", eff.handlerFun));
      return Runtime.debugContTrace(eff.contTrace)
    }
    runtime.safeCall(globalThis.console.log("Not an effect:"));
    return runtime.safeCall(globalThis.console.log(eff));
  }
  static unwind(...saved) {
    let tmp;
    tmp = new Runtime.FunctionContFrame.class(null, saved);
    Runtime.curEffect.contTrace.last.next = tmp;
    Runtime.curEffect.contTrace.last = Runtime.curEffect.contTrace.last.next;
    return runtime.Unit
  }
  static mkEffect(handler, handlerFun) {
    let res, tmp;
    tmp = new Runtime.ContTrace.class(null, null, null, null, false);
    res = new Runtime.EffectSig.class(tmp, handler, handlerFun);
    res.contTrace.last = res.contTrace;
    res.contTrace.lastHandler = res.contTrace;
    Runtime.curEffect = res;
    return runtime.Unit
  }
  static handleBlockImpl(cur, handler) {
    let handlerFrame;
    handlerFrame = new Runtime.HandlerContFrame.class(null, null, handler);
    cur.contTrace.lastHandler.nextHandler = handlerFrame;
    cur.contTrace.lastHandler = handlerFrame;
    cur.contTrace.last = handlerFrame;
    return Runtime.handleEffects(cur)
  }
  static enterHandleBlock(handler, body) {
    let tmp, scrut;
    tmp = runtime.safeCall(body());
    scrut = Runtime.curEffect === null;
    if (scrut === true) {
      return tmp
    }
    return Runtime.handleBlockImpl(Runtime.curEffect, handler);
  }
  static handleEffects(cur) {
    lbl: while (true) {
      let nxt, scrut;
      if (cur instanceof Runtime.EffectSig.class) {
        nxt = Runtime.handleEffect(cur);
        scrut = cur === nxt;
        if (scrut === true) {
          Runtime.curEffect = cur;
          return null
        }
        cur = nxt;
        continue lbl;
      }
      return cur;
    }
  }
  static handleEffect(cur) {
    let prevHandlerFrame, scrut, handlerFrame, saved, scrut1, scrut2, old, scrut3, scrut4, scrut5, scrut6, tmp, tmp1, tmp2, tmp3;
    prevHandlerFrame = cur.contTrace;
    lbl: while (true) {
      let scrut7, scrut8;
      scrut7 = prevHandlerFrame.nextHandler !== null;
      if (scrut7 === true) {
        scrut8 = prevHandlerFrame.nextHandler.handler !== cur.handler;
        if (scrut8 === true) {
          prevHandlerFrame = prevHandlerFrame.nextHandler;
          continue lbl
        }
      }
      break;
    }
    scrut = prevHandlerFrame.nextHandler === null;
    if (scrut === true) {
      return cur
    }
    handlerFrame = prevHandlerFrame.nextHandler;
    saved = new Runtime.ContTrace.class(handlerFrame.next, cur.contTrace.last, handlerFrame.nextHandler, cur.contTrace.lastHandler, false);
    scrut1 = cur.contTrace.last === handlerFrame;
    if (scrut1 === true) {
      saved.last = saved;
    }
    scrut2 = cur.contTrace.lastHandler === handlerFrame;
    if (scrut2 === true) {
      saved.lastHandler = saved;
    }
    cur.contTrace.last = handlerFrame;
    cur.contTrace.lastHandler = handlerFrame;
    handlerFrame.next = null;
    handlerFrame.nextHandler = null;
    Runtime.curEffect = null;
    old = Runtime.stackDepth;
    try {
      tmp1 = Runtime.stackDepth + 2;
      Runtime.stackDepth = tmp1;
      tmp2 = Runtime.resume(cur.contTrace);
      tmp3 = runtime.safeCall(cur.handlerFun(tmp2));
      tmp = tmp3;
    } finally {
      Runtime.stackDepth = old;
    }
    scrut3 = Runtime.curEffect !== null;
    if (scrut3 === true) {
      cur = Runtime.curEffect;
      scrut4 = saved.next !== null;
      if (scrut4 === true) {
        cur.contTrace.last.next = saved.next;
      }
      scrut5 = saved.last !== saved;
      if (scrut5 === true) {
        cur.contTrace.last = saved.last;
      }
      scrut6 = saved.nextHandler !== null;
      if (scrut6 === true) {
        cur.contTrace.lastHandler.nextHandler = saved.nextHandler;
        cur.contTrace.lastHandler = saved.lastHandler;
        return cur
      }
      return cur;
    }
    return Runtime.resumeContTrace(saved, tmp);
  }
  static resume(contTrace) {
    return (value) => {
      let scrut, tmp;
      scrut = contTrace.resumed;
      if (scrut === true) {
        throw runtime.safeCall(globalThis.Error("Multiple resumption"))
      }
      contTrace.resumed = true;
      tmp = Runtime.resumeContTrace(contTrace, value);
      return Runtime.handleEffects(tmp);
    }
  }
  static resumeContTrace(contTrace, value) {
    let cont1, handlerCont;
    cont1 = contTrace.next;
    handlerCont = contTrace.nextHandler;
    lbl: while (true) {
      let old, scrut, scrut1, scrut2, tmp, tmp1, tmp2;
      if (cont1 instanceof Runtime.FunctionContFrame.class) {
        Runtime.curEffect = null;
        old = Runtime.stackDepth;
        try {
          tmp1 = Runtime.stackDepth + 3;
          Runtime.stackDepth = tmp1;
          tmp2 = runtime.safeCall(cont1.resume(value));
          tmp = tmp2;
        } finally {
          Runtime.stackDepth = old;
        }
        value = tmp;
        scrut = Runtime.curEffect !== null;
        if (scrut === true) {
          value = Runtime.curEffect;
        }
        if (value instanceof Runtime.EffectSig.class) {
          value.contTrace.last.next = cont1.next;
          value.contTrace.lastHandler.nextHandler = handlerCont;
          scrut1 = contTrace.last !== cont1;
          if (scrut1 === true) {
            value.contTrace.last = contTrace.last;
          }
          scrut2 = handlerCont !== null;
          if (scrut2 === true) {
            value.contTrace.lastHandler = contTrace.lastHandler;
            return value
          }
          return value;
        }
        cont1 = cont1.next;
        continue lbl;
      }
      if (handlerCont instanceof Runtime.HandlerContFrame.class) {
        cont1 = handlerCont.next;
        handlerCont = handlerCont.nextHandler;
        continue lbl
      }
      return value;
    }
  }
  static await(promise) {
    let lambda$here;
    lambda$here = lambda$10(Runtime, promise);
    return Runtime.mkEffect(Runtime.AsyncEffectMarker, lambda$here)
  }
  static toJsAsync(thunk) {
    let r, scrut;
    r = Runtime.enterHandleBlock(Runtime.AsyncEffectMarker, thunk);
    scrut = Runtime.curEffect !== null;
    if (scrut === true) {
      Runtime.illegalEffect("in exported async function");
      return runtime.safeCall(globalThis.Promise.resolve(r))
    }
    return runtime.safeCall(globalThis.Promise.resolve(r));
  }
  static checkDepth() {
    let tmp, tmp1;
    tmp = Runtime.stackDepth >= Runtime.stackLimit;
    if (tmp === true) {
      tmp1 = Runtime.stackHandler !== null;
      if (tmp1 === true) {
        return runtime.safeCall(Runtime.stackHandler.delay())
      }
      return runtime.Unit;
    }
    return runtime.Unit;
  }
  static cpsSetCheckDepth() {
    let tmp, tmp1;
    tmp = Runtime.stackDepth + 1;
    Runtime.stackDepth = tmp;
    tmp1 = Runtime.stackDepth >= Runtime.stackLimit;
    if (tmp1 === true) {
      return Runtime.stackHandler !== null
    }
    return false;
  }
  static cpsRaiseStack(k, retVal) {
    return runtime.safeCall(Runtime.stackHandler.delay(k, retVal))
  }
  static runStackSafe(limit, f) {
    let old, old1, old2, result, scrut, tmp, tmp1, tmp2;
    old = Runtime.stackLimit;
    try {
      Runtime.stackLimit = limit;
      old1 = Runtime.stackDepth;
      try {
        Runtime.stackDepth = 1;
        old2 = Runtime.stackHandler;
        try {
          Runtime.stackHandler = Runtime.StackDelayHandler;
          result = Runtime.enterHandleBlock(Runtime.StackDelayHandler, f);
          scrut = Runtime.curEffect !== null;
          if (scrut === true) {
            throw globalThis.Object.freeze(new globalThis.Error("Effect crossed through stack safe boundary"))
          }
          lbl: while (true) {
            let scrut1, saved, scrut2, tmp3;
            scrut1 = Runtime.stackResume !== null;
            if (scrut1 === true) {
              saved = Runtime.stackResume;
              Runtime.stackResume = null;
              Runtime.stackDepth = 1;
              tmp3 = runtime.safeCall(saved(runtime.Unit));
              result = tmp3;
              scrut2 = Runtime.curEffect !== null;
              if (scrut2 === true) {
                throw globalThis.Object.freeze(new globalThis.Error("Effect crossed through stack safe boundary"))
              }
              continue lbl;
            }
            break;
          }
          tmp2 = result;
        } finally {
          Runtime.stackHandler = old2;
        }
        tmp1 = tmp2;
      } finally {
        Runtime.stackDepth = old1;
      }
      tmp = tmp1;
    } finally {
      Runtime.stackLimit = old;
    }
    return tmp
  }
  static runStackSafeCps(limit, f) {
    let old, old1, old2, result, tmp, tmp1, tmp2;
    old = Runtime.stackLimit;
    try {
      Runtime.stackLimit = limit;
      old1 = Runtime.stackDepth;
      try {
        Runtime.stackDepth = 1;
        old2 = Runtime.stackHandler;
        try {
          Runtime.stackHandler = Runtime.StackDelayCpsHandler;
          result = runtime.safeCall(f());
          lbl: while (true) {
            let old3, arg$StackSuspend$0$, arg$StackSuspend$2$;
            if (result instanceof Runtime.StackSuspend.class) {
              arg$StackSuspend$0$ = result.k;
              arg$StackSuspend$2$ = result.retVal;
              old3 = Runtime.stackDepth;
              try {
                Runtime.stackDepth = 1;
                result = runtime.safeCall(arg$StackSuspend$0$(arg$StackSuspend$2$));
              } finally {
                Runtime.stackDepth = old3;
              }
              continue lbl
            }
            break;
          }
          tmp2 = result;
        } finally {
          Runtime.stackHandler = old2;
        }
        tmp1 = tmp2;
      } finally {
        Runtime.stackDepth = old1;
      }
      tmp = tmp1;
    } finally {
      Runtime.stackLimit = old;
    }
    return tmp
  }
  static plus_impl(lhs, rhs) {
    if (lhs instanceof Runtime.Int31.class) {
      if (rhs instanceof Runtime.Int31.class) {
        return lhs + rhs
      }
      return Runtime.unreachable;
    }
    return Runtime.unreachable;
  }
  toString() { return runtime.render(this); }
  static [definitionMetadata] = ["class", "Runtime"];
});
export { resumeCont as _$_modulePrivate_$_resumeCont };
export { handlerFunCont as _$_modulePrivate_$_handlerFunCont };
export { cont as _$_modulePrivate_$_cont };
export { resumeCont1 as _$_modulePrivate_$_resumeCont1 };
export { suspendCont1 as _$_modulePrivate_$_suspendCont1 };
export { loop as _$_modulePrivate_$_loop };
export { continuation as _$_modulePrivate_$_continuation };
export { Runtime1 as _$_modulePrivate_$_Runtime };
export { lambda as _$_modulePrivate_$_lambda };
export { lambda1 as _$_modulePrivate_$_lambda1 };
export { lambda2 as _$_modulePrivate_$_lambda2 };
export { lambda3 as _$_modulePrivate_$_lambda3 };
export { lambda4 as _$_modulePrivate_$_lambda4 };
export { lambda5 as _$_modulePrivate_$_lambda5 };
export { lambda6 as _$_modulePrivate_$_lambda6 };
export { lambda7 as _$_modulePrivate_$_lambda7 };
export { lambda8 as _$_modulePrivate_$_lambda8 };
export { lambda9 as _$_modulePrivate_$_lambda9 };
export { lambda10 as _$_modulePrivate_$_lambda10 };
export { lambda11 as _$_modulePrivate_$_lambda11 };
export { handlerFunCont1 as _$_modulePrivate_$_handlerFunCont1 };
export { lambda$ as _$_modulePrivate_$_lambda$ };
export { lambda$1 as _$_modulePrivate_$_lambda$1 };
export { Capture$handlerTrampoline1 as _$_modulePrivate_$_Capture$handlerTrampoline };
export { Capture$scope231 as _$_modulePrivate_$_Capture$scope23 };
export { lambda$2 as _$_modulePrivate_$_lambda$2 };
export { handlerFunCont$ as _$_modulePrivate_$_handlerFunCont$ };
export { lambda$3 as _$_modulePrivate_$_lambda$3 };
export { suspendCont1$ as _$_modulePrivate_$_suspendCont1$ };
export { cont$ as _$_modulePrivate_$_cont$ };
export { handlerFunCont$1 as _$_modulePrivate_$_handlerFunCont$1 };
export { lambda$4 as _$_modulePrivate_$_lambda$4 };
export { lambda$5 as _$_modulePrivate_$_lambda$5 };
export { resumeCont1$ as _$_modulePrivate_$_resumeCont1$ };
export { lambda$6 as _$_modulePrivate_$_lambda$6 };
export { resumeCont$ as _$_modulePrivate_$_resumeCont$ };
export { lambda$7 as _$_modulePrivate_$_lambda$7 };
export { Capture$scope471 as _$_modulePrivate_$_Capture$scope47 };
export { lambda$8 as _$_modulePrivate_$_lambda$8 };
export { Capture$scope491 as _$_modulePrivate_$_Capture$scope49 };
export { lambda$9 as _$_modulePrivate_$_lambda$9 };
export { lambda$10 as _$_modulePrivate_$_lambda$10 };
export { continuation$ as _$_modulePrivate_$_continuation$ };
let Runtime = Runtime1; export default Runtime;
