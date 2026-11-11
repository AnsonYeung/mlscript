const definitionMetadata = globalThis.Symbol.for("mlscript.definitionMetadata");
const prettyPrint = globalThis.Symbol.for("mlscript.prettyPrint");
import runtime from "./Runtime.mjs";
import RuntimeJS from "./RuntimeJS.mjs";
import Rendering from "./Rendering.mjs";
import LazyArray from "./LazyArray.mjs";
import Iter from "./Iter.mjs";
let propagateSuspend, resumeCont1Reinstall, resumeCont1, suspendCont1, resumeCont, handlerFunCont, cont, propagateSuspend1, cont1, continuation, Runtime1, lambda, lambda1, lambda2, lambda3, lambda4, lambda5, lambda6, lambda7, lambda8, lambda9, lambda10, lambda11, lambda12, lambda13, lambda14, lambda15, lambda16, lambda17, lambda18, lambda19, lambda20, handlerFunCont1, lambda$, lambda$1, lambda$2, lambda$3, lambda$4, Capture$scope431, lambda$5, lambda$6, Capture$scope471, lambda$7, lambda$8, Capture$scope31, handlerFunCont$, Capture$scope61, lambda$9, lambda$10, cont$, handlerFunCont$1, propagateSuspend$, resumeCont$, suspendCont1$, resumeCont1$, resumeCont1Reinstall$, cont$1, lambda$11, Capture$scope641, Capture$scope711, lambda$12, Capture$scope731, lambda$13, Capture$scope871, lambda$14, continuation$;
lambda7 = (undefined, function (saved) {
  return runtime.safeCall(saved(runtime.Unit))
});
lambda6 = (undefined, function (Runtime2, f) {
  let handler, tmp, scrut;
  handler = Runtime2.StackDelayHandler;
  tmp = f();
  scrut = Runtime2.curEffect === null;
  if (scrut === true) {
    return tmp
  }
  {
    let cur, handlerFrame;
    cur = Runtime2.curEffect;
    handlerFrame = new Runtime2.HandlerContFrame.class(null, null, handler);
    cur.contTrace.lastHandler.nextHandler = handlerFrame;
    cur.contTrace.lastHandler = handlerFrame;
    cur.contTrace.last = handlerFrame;
    return Runtime2.handleEffects(cur);
  }
});
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
lambda$14 = (undefined, function (Runtime2, promise) {
  return (resume) => {
    let continuation$here;
    continuation$here = continuation$(Runtime2, resume);
    return runtime.safeCall(promise.then(continuation$here))
  }
});
lambda5 = (undefined, function (Runtime2, promise, resume) {
  let continuation$here;
  continuation$here = continuation$(Runtime2, resume);
  return runtime.safeCall(promise.then(continuation$here))
});
(class Capture$scope87 {
  static {
    Capture$scope871 = this
  }
  constructor(cur$0, prevHandlerFrame$1) {
    this.prevHandlerFrame$1 = prevHandlerFrame$1;
    this.cur$0 = cur$0;
  }
  toString() { return runtime.render(this); }
  static [definitionMetadata] = ["class", "Capture$scope87"];
});
lambda4 = (undefined, function (scope87$cap, Runtime2) {
  let tmp;
  tmp = Runtime2.resume(scope87$cap.cur$0.contTrace);
  return runtime.safeCall(scope87$cap.cur$0.handlerFun(tmp))
});
(class Capture$scope73 {
  static {
    Capture$scope731 = this
  }
  constructor(result$0) {
    this.result$0 = result$0;
  }
  toString() { return runtime.render(this); }
  static [definitionMetadata] = ["class", "Capture$scope73"];
});
lambda$13 = (undefined, function (scope73$cap, cont2) {
  return (m, marker, ..._) => {
    return lambda3(scope73$cap, cont2, m, marker, ..._)
  }
});
lambda3 = (undefined, function (scope73$cap, cont2, m, marker, ..._) {
  let scrut, tmp, tmp1;
  scrut = runtime.safeCall(m.has(cont2));
  if (scrut === true) {
    tmp = ", " + marker;
    tmp1 = scope73$cap.result$0 + tmp;
    scope73$cap.result$0 = tmp1;
    return runtime.Unit
  }
  return runtime.Unit;
});
(class Capture$scope71 {
  static {
    Capture$scope711 = this
  }
  constructor(result$0) {
    this.result$0 = result$0;
  }
  toString() { return runtime.render(this); }
  static [definitionMetadata] = ["class", "Capture$scope71"];
});
lambda$12 = (undefined, function (scope71$cap, cont2) {
  return (m, marker, ..._) => {
    return lambda2(scope71$cap, cont2, m, marker, ..._)
  }
});
lambda2 = (undefined, function (scope71$cap, cont2, m, marker, ..._) {
  let scrut, tmp, tmp1;
  scrut = runtime.safeCall(m.has(cont2));
  if (scrut === true) {
    tmp = ", " + marker;
    tmp1 = scope71$cap.result$0 + tmp;
    scope71$cap.result$0 = tmp1;
    return runtime.Unit
  }
  return runtime.Unit;
});
lambda1 = (undefined, function (l, ..._) {
  let tmp, tmp1;
  tmp = l.localName + "=";
  tmp1 = runtime.safeCall(Rendering.render(l.value));
  return tmp + tmp1
});
lambda = (undefined, function (scope64$cap, Runtime2) {
  return Runtime2.resume(scope64$cap.tr$0.contTrace)(runtime.Unit)
});
(class Capture$scope64 {
  static {
    Capture$scope641 = this
  }
  constructor(tr$0) {
    this.tr$0 = tr$0;
  }
  toString() { return runtime.render(this); }
  static [definitionMetadata] = ["class", "Capture$scope64"];
});
lambda$11 = (undefined, function (Runtime2) {
  return (k) => {
    Runtime2.stackResume = k;
    return runtime.Unit
  }
});
lambda18 = (undefined, function (Runtime2, k) {
  Runtime2.stackResume = k;
  return runtime.Unit
});
cont$1 = function cont$(Runtime2, CpsImpl1, ss_k, k, tag) {
  return (res) => {
    return cont1(Runtime2, CpsImpl1, ss_k, k, tag, res)
  }
};
cont1 = function cont(Runtime2, CpsImpl1, ss_k, k, tag, res) {
  let scrut, tmp, cont$here;
  scrut = CpsImpl1.cpsSetCheckDepth;
  if (scrut === true) {
    tmp = globalThis.Object.freeze([
      res
    ]);
    cont$here = cont$1(Runtime2, CpsImpl1, ss_k, k, tag);
    return CpsImpl1.cpsRaiseStack(cont$here, null, tmp)
  }
  return CpsImpl1.ss_handlerTrampoline(ss_k, k, tag, res);
};
resumeCont1Reinstall$ = function resumeCont1Reinstall$(Runtime2, CpsImpl1, k, tag, resume_k) {
  return (resume_r) => {
    return resumeCont1Reinstall(Runtime2, CpsImpl1, k, tag, resume_k, resume_r)
  }
};
resumeCont1$ = function resumeCont1$(Runtime2, CpsImpl1, k, tag, resume_k) {
  return (resume_r) => {
    return resumeCont1(Runtime2, CpsImpl1, k, tag, resume_k, resume_r)
  }
};
resumeCont1Reinstall = function resumeCont1Reinstall(Runtime2, CpsImpl1, k, tag, resume_k, resume_r) {
  let scrut, tmp, resumeCont1Reinstall$here;
  scrut = CpsImpl1.cpsSetCheckDepth();
  if (scrut === true) {
    tmp = globalThis.Object.freeze([
      resume_r
    ]);
    resumeCont1Reinstall$here = resumeCont1Reinstall$(Runtime2, CpsImpl1, k, tag, resume_k);
    return CpsImpl1.cpsRaiseStack(resumeCont1Reinstall$here, null, tmp)
  }
  return CpsImpl1.ss_handlerTrampoline(resume_k, k, tag, resume_r);
};
resumeCont1 = function resumeCont1(Runtime2, CpsImpl1, k, tag, resume_k, resume_r) {
  let scrut, tmp, resumeCont1$here;
  scrut = CpsImpl1.cpsSetCheckDepth();
  if (scrut === true) {
    tmp = globalThis.Object.freeze([
      resume_r
    ]);
    resumeCont1$here = resumeCont1$(Runtime2, CpsImpl1, k, tag, resume_k);
    return CpsImpl1.cpsRaiseStack(resumeCont1$here, null, tmp)
  }
  return propagateSuspend1(Runtime2, CpsImpl1, k, tag, resume_k, resume_r, false);
};
suspendCont1$ = function suspendCont1$(Runtime2, CpsImpl1, k, tag, reinstall, resume) {
  return (resume_k, r) => {
    return suspendCont1(Runtime2, CpsImpl1, k, tag, reinstall, resume, resume_k, r)
  }
};
suspendCont1 = function suspendCont1(Runtime2, CpsImpl1, k, tag, reinstall, resume, resume_k, r) {
  let scrut, tmp, tmp1, suspendCont1$here;
  scrut = CpsImpl1.cpsSetCheckDepth();
  if (scrut === true) {
    tmp = globalThis.Object.freeze([
      resume_k,
      r
    ]);
    suspendCont1$here = suspendCont1$(Runtime2, CpsImpl1, k, tag, reinstall, resume);
    return CpsImpl1.cpsRaiseStack(suspendCont1$here, null, tmp)
  }
  if (reinstall === true) {
    tmp1 = resumeCont1Reinstall$(Runtime2, CpsImpl1, k, tag, resume_k);
    return runtime.safeCall(resume(tmp1, r))
  }
  tmp1 = resumeCont1$(Runtime2, CpsImpl1, k, tag, resume_k);
  return runtime.safeCall(resume(tmp1, r));
};
propagateSuspend$ = function propagateSuspend$(Runtime2, CpsImpl1, k, tag) {
  return (ps_k, res, reinstall) => {
    return propagateSuspend1(Runtime2, CpsImpl1, k, tag, ps_k, res, reinstall)
  }
};
resumeCont$ = function resumeCont$(Runtime2, CpsImpl1, tag, hfc_k, k1) {
  return (resume_r) => {
    return resumeCont(Runtime2, CpsImpl1, tag, hfc_k, k1, resume_r)
  }
};
resumeCont = function resumeCont(Runtime2, CpsImpl1, tag, hfc_k, k1, resume_r) {
  let scrut, tmp, resumeCont$here;
  scrut = CpsImpl1.cpsSetCheckDepth();
  if (scrut === true) {
    tmp = globalThis.Object.freeze([
      resume_r
    ]);
    resumeCont$here = resumeCont$(Runtime2, CpsImpl1, tag, hfc_k, k1);
    return CpsImpl1.cpsRaiseStack(resumeCont$here, null, tmp)
  }
  return CpsImpl1.ss_handlerTrampoline(hfc_k, k1, tag, resume_r);
};
handlerFunCont$1 = function handlerFunCont$(Runtime2, CpsImpl1, tag, resume) {
  return (hfc_k, k1, v) => {
    return handlerFunCont(Runtime2, CpsImpl1, tag, resume, hfc_k, k1, v)
  }
};
cont$ = function cont$(Runtime2, CpsImpl1, ss_k, k, tag) {
  return (r) => {
    return cont(Runtime2, CpsImpl1, ss_k, k, tag, r)
  }
};
propagateSuspend1 = function propagateSuspend(Runtime2, CpsImpl1, k, tag, ps_k, res, reinstall) {
  let scrut, tmp, arg$CpsSuspend$0$, arg$CpsSuspend$1$, arg$CpsSuspend$2$, tmp1, propagateSuspend$here, suspendCont1$here;
  scrut = CpsImpl1.cpsSetCheckDepth();
  if (scrut === true) {
    tmp = globalThis.Object.freeze([
      ps_k,
      res,
      reinstall
    ]);
    propagateSuspend$here = propagateSuspend$(Runtime2, CpsImpl1, k, tag);
    return CpsImpl1.cpsRaiseStack(propagateSuspend$here, null, tmp)
  }
  if (res instanceof Runtime2.CpsSuspend.class) {
    arg$CpsSuspend$0$ = res.k;
    arg$CpsSuspend$1$ = res.tag;
    arg$CpsSuspend$2$ = res.handlerFun;
    suspendCont1$here = suspendCont1$(Runtime2, CpsImpl1, k, tag, reinstall, arg$CpsSuspend$0$);
    tmp1 = Runtime2.CpsSuspend(suspendCont1$here, arg$CpsSuspend$1$, arg$CpsSuspend$2$);
    return runtime.safeCall(ps_k(tmp1))
  }
  return runtime.safeCall(k(ps_k, res));
};
handlerFunCont = function handlerFunCont(Runtime2, CpsImpl1, tag, resume, hfc_k, k1, v) {
  let scrut, tmp, handlerFunCont$here, resumeCont$here;
  scrut = CpsImpl1.cpsSetCheckDepth();
  if (scrut === true) {
    tmp = globalThis.Object.freeze([
      hfc_k,
      k1,
      v
    ]);
    handlerFunCont$here = handlerFunCont$1(Runtime2, CpsImpl1, tag, resume);
    return CpsImpl1.cpsRaiseStack(handlerFunCont$here, null, tmp)
  }
  resumeCont$here = resumeCont$(Runtime2, CpsImpl1, tag, hfc_k, k1);
  return runtime.safeCall(resume(resumeCont$here, v));
};
cont = function cont(Runtime2, CpsImpl1, ss_k, k, tag, r) {
  let scrut, tmp, cont$here;
  scrut = CpsImpl1.cpsSetCheckDepth();
  if (scrut === true) {
    tmp = globalThis.Object.freeze([
      r
    ]);
    cont$here = cont$(Runtime2, CpsImpl1, ss_k, k, tag);
    return CpsImpl1.cpsRaiseStack(cont$here, null, tmp)
  }
  return propagateSuspend1(Runtime2, CpsImpl1, k, tag, ss_k, r, false);
};
handlerFunCont$ = function handlerFunCont$(CpsImpl1, tag, resume) {
  return (k1, v) => {
    let tmp;
    tmp = runtime.safeCall(resume(v));
    return CpsImpl1.handlerTrampoline(k1, tag, tmp)
  }
};
handlerFunCont1 = function handlerFunCont(CpsImpl1, tag, resume, k1, v) {
  let tmp;
  tmp = runtime.safeCall(resume(v));
  return CpsImpl1.handlerTrampoline(k1, tag, tmp)
};
(class Capture$scope3 {
  static {
    Capture$scope31 = this
  }
  constructor(handlerFunCont$0, res$1) {
    this.res$1 = res$1;
    this.handlerFunCont$0 = handlerFunCont$0;
  }
  toString() { return runtime.render(this); }
  static [definitionMetadata] = ["class", "Capture$scope3"];
});
lambda$10 = (undefined, function (Runtime2, CpsImpl1, k, tag, resume) {
  return (r) => {
    let tmp;
    tmp = runtime.safeCall(resume(r));
    return propagateSuspend(Runtime2, CpsImpl1, k, tag, tmp, false)
  }
});
lambda20 = (undefined, function (Runtime2, CpsImpl1, k, tag, resume, r) {
  let tmp;
  tmp = runtime.safeCall(resume(r));
  return propagateSuspend(Runtime2, CpsImpl1, k, tag, tmp, false)
});
lambda$9 = (undefined, function (CpsImpl1, k, tag, resume) {
  return (r) => {
    let tmp;
    tmp = runtime.safeCall(resume(r));
    return CpsImpl1.handlerTrampoline(k, tag, tmp)
  }
});
lambda19 = (undefined, function (CpsImpl1, k, tag, resume, r) {
  let tmp;
  tmp = runtime.safeCall(resume(r));
  return CpsImpl1.handlerTrampoline(k, tag, tmp)
});
(class Capture$scope6 {
  static {
    Capture$scope61 = this
  }
  constructor(tmp$0) {
    this.tmp$0 = tmp$0;
  }
  toString() { return runtime.render(this); }
  static [definitionMetadata] = ["class", "Capture$scope6"];
});
propagateSuspend = function propagateSuspend(Runtime2, CpsImpl1, k, tag, res, reinstall) {
  let cont2, arg$CpsSuspend$0$, arg$CpsSuspend$1$, arg$CpsSuspend$2$, scope6$cap;
  scope6$cap = new Capture$scope61(undefined);
  if (res instanceof Runtime2.CpsSuspend.class) {
    arg$CpsSuspend$0$ = res.k;
    arg$CpsSuspend$1$ = res.tag;
    arg$CpsSuspend$2$ = res.handlerFun;
    if (reinstall === true) {
      scope6$cap.tmp$0 = lambda$9(CpsImpl1, k, tag, arg$CpsSuspend$0$);
    } else {
      scope6$cap.tmp$0 = lambda$10(Runtime2, CpsImpl1, k, tag, arg$CpsSuspend$0$);
    }
    cont2 = scope6$cap.tmp$0;
    return Runtime2.CpsSuspend(cont2, arg$CpsSuspend$1$, arg$CpsSuspend$2$)
  }
  return runtime.safeCall(k(res));
};
lambda$8 = (undefined, function (scope47$cap, curFrame) {
  return () => {
    return runtime.safeCall(curFrame.resume(scope47$cap.value$0))
  }
});
lambda$7 = (undefined, function (ShadowStackImpl1) {
  return (err) => {
    return ShadowStackImpl1.checkUnhandledErr
  }
});
lambda15 = (undefined, function (scope47$cap, curFrame) {
  return runtime.safeCall(curFrame.resume(scope47$cap.value$0))
});
lambda16 = (undefined, function (ShadowStackImpl1, err) {
  return ShadowStackImpl1.checkUnhandledErr
});
(class Capture$scope47 {
  static {
    Capture$scope471 = this
  }
  constructor(value$0) {
    this.value$0 = value$0;
  }
  toString() { return runtime.render(this); }
  static [definitionMetadata] = ["class", "Capture$scope47"];
});
(class Capture$scope43 {
  static {
    Capture$scope431 = this
  }
  constructor(cur$0) {
    this.cur$0 = cur$0;
  }
  toString() { return runtime.render(this); }
  static [definitionMetadata] = ["class", "Capture$scope43"];
});
lambda$6 = (undefined, function (scope43$cap, ShadowStackImpl1) {
  return () => {
    let tmp;
    tmp = ShadowStackImpl1.resume(scope43$cap.cur$0.contTrace);
    return runtime.safeCall(scope43$cap.cur$0.handlerFun(tmp))
  }
});
lambda$5 = (undefined, function (ShadowStackImpl1, saved, tmp) {
  return () => {
    return ShadowStackImpl1.resumeContTrace(saved, tmp)
  }
});
lambda13 = (undefined, function (scope43$cap, ShadowStackImpl1) {
  let tmp;
  tmp = ShadowStackImpl1.resume(scope43$cap.cur$0.contTrace);
  return runtime.safeCall(scope43$cap.cur$0.handlerFun(tmp))
});
lambda14 = (undefined, function (ShadowStackImpl1, saved, tmp) {
  return ShadowStackImpl1.resumeContTrace(saved, tmp)
});
lambda$4 = (undefined, function (ShadowStackImpl1, body) {
  return () => {
    return ShadowStackImpl1.enterHandleBlock(ShadowStackImpl1.StackDelayHandler, body)
  }
});
lambda$3 = (undefined, function (Runtime2, ShadowStackImpl1) {
  return (err) => {
    ShadowStackImpl1.checkUnhandledErr(err);
    return ShadowStackImpl1.handleEffects(Runtime2.curEffect)
  }
});
lambda$2 = (undefined, function (Runtime2, ShadowStackImpl1) {
  return (err) => {
    ShadowStackImpl1.checkUnhandledErr(err);
    return ShadowStackImpl1.handleEffects(Runtime2.curEffect)
  }
});
lambda10 = (undefined, function (ShadowStackImpl1, body) {
  return ShadowStackImpl1.enterHandleBlock(ShadowStackImpl1.StackDelayHandler, body)
});
lambda11 = (undefined, function (Runtime2, ShadowStackImpl1, err) {
  ShadowStackImpl1.checkUnhandledErr(err);
  return ShadowStackImpl1.handleEffects(Runtime2.curEffect)
});
lambda12 = (undefined, function (Runtime2, ShadowStackImpl1, err) {
  ShadowStackImpl1.checkUnhandledErr(err);
  return ShadowStackImpl1.handleEffects(Runtime2.curEffect)
});
lambda$1 = (undefined, function (Runtime2) {
  return (k) => {
    Runtime2.stackResume = k;
    return runtime.Unit
  }
});
lambda17 = (undefined, function (Runtime2, k) {
  Runtime2.stackResume = k;
  return runtime.Unit
});
lambda9 = (undefined, function (FunctionContFrameImpl1, f, currentArgList, argListLength) {
  let tmp, tmp1, tmp2, tmp3;
  tmp = currentArgList + 1;
  tmp1 = currentArgList + 1;
  tmp2 = tmp1 + argListLength;
  tmp3 = runtime.safeCall(FunctionContFrameImpl1.saved.slice(tmp, tmp2));
  return runtime.safeCall(f.apply(FunctionContFrameImpl1.saved.at(4), tmp3))
});
lambda$ = (undefined, function (Runtime2, EffectHandle1, value) {
  return () => {
    return Runtime2.resume(EffectHandle1.reified.contTrace)(value)
  }
});
lambda8 = (undefined, function (Runtime2, EffectHandle1, value) {
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
  static #curContTrace;
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
  static get curContTrace() { return Runtime.#curContTrace; }
  static set curContTrace(value) { Runtime.#curContTrace = value; }
  static get stackLimit() { return Runtime.#stackLimit; }
  static set stackLimit(value) { Runtime.#stackLimit = value; }
  static get stackDepth() { return Runtime.#stackDepth; }
  static set stackDepth(value) { Runtime.#stackDepth = value; }
  static get stackHandler() { return Runtime.#stackHandler; }
  static set stackHandler(value) { Runtime.#stackHandler = value; }
  static get stackResume() { return Runtime.#stackResume; }
  static set stackResume(value) { Runtime.#stackResume = value; }
  static {
    let tmp;
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
        let tmp1;
        tmp1 = xs.length - j;
        return runtime.safeCall(xs.slice(i, tmp1))
      }
      static sliceArray(xs, i, j) {
        let tmp1;
        tmp1 = xs.length - j;
        return runtime.safeCall(xs.slice(i, tmp1))
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
        let scrut, scrut1, tmp1;
        scrut = i >= xs.length;
        if (scrut === true) {
          throw runtime.safeCall(globalThis.RangeError("Tuple.get: index out of bounds"))
        }
        tmp1 = - xs.length;
        scrut1 = i < tmp1;
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
    (class StrOps {
      static {
        Runtime.StrOps = this
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
      static leaveOut(string, n) {
        return runtime.safeCall(string.slice(n))
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["class", "StrOps"];
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
        let scrut, prev, tmp1;
        scrut = TraceLogger.enabled;
        if (scrut === true) {
          prev = TraceLogger.indentLvl;
          tmp1 = prev + 1;
          TraceLogger.indentLvl = tmp1;
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
        let scrut, tmp1, tmp2, tmp3, tmp4, tmp5;
        scrut = TraceLogger.enabled;
        if (scrut === true) {
          tmp1 = runtime.safeCall(("| ").repeat(TraceLogger.indentLvl));
          tmp2 = runtime.safeCall(("  ").repeat(TraceLogger.indentLvl));
          tmp3 = "\n" + tmp2;
          tmp4 = runtime.safeCall(msg.replaceAll("\n", tmp3));
          tmp5 = tmp1 + tmp4;
          return runtime.safeCall(globalThis.console.log(tmp5))
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
    (class EffectException {
      static {
        new this
      }
      constructor() {
        Runtime.EffectException = this;
        Object.defineProperty(this, "class", {
          value: EffectException
        });
        globalThis.Object.freeze(this);
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["object", "EffectException"];
    });
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
    Runtime.FunctionContFrame = function FunctionContFrame(next) {
      return globalThis.Object.freeze(new FunctionContFrame.class(next));
    };
    (class FunctionContFrame {
      static {
        Runtime.FunctionContFrame.class = this
      }
      constructor(next) {
        this.next = next;
        this.isContCls = true;
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["class", "FunctionContFrame", ["next"]];
    });
    Runtime.FunctionContFrameImpl = function FunctionContFrameImpl(_next, saved) {
      return globalThis.Object.freeze(new FunctionContFrameImpl.class(_next, saved));
    };
    (class FunctionContFrameImpl extends Runtime.FunctionContFrame.class {
      static {
        Runtime.FunctionContFrameImpl.class = this
      }
      constructor(_next, saved) {
        super(_next);
        this._next = _next;
        this.saved = saved;
      }
      resume(value) {
        let i, f, argListsLength, currentArgList, scrut, argListLength, tmp1, tmp2, tmp3, tmp4, tmp5, tmp6;
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
          let scrut1, argListLength1, tmp7, tmp8, tmp9, tmp10, tmp11, tmp12, tmp13, tmp14, tmp15;
          tmp7 = argListsLength - 1;
          scrut1 = i < tmp7;
          if (scrut1 === true) {
            argListLength1 = this.saved.at(currentArgList);
            tmp8 = currentArgList + 1;
            tmp9 = currentArgList + 1;
            tmp10 = tmp9 + argListLength1;
            tmp11 = runtime.safeCall(this.saved.slice(tmp8, tmp10));
            tmp12 = runtime.safeCall(f.apply(this.saved.at(4), tmp11));
            f = tmp12;
            tmp13 = argListLength1 + 1;
            tmp14 = currentArgList + tmp13;
            currentArgList = tmp14;
            tmp15 = i + 1;
            i = tmp15;
            continue lbl
          }
          break;
        }
        argListLength = this.saved.at(currentArgList);
        tmp1 = currentArgList + argListLength;
        tmp2 = tmp1 + 2;
        Runtime.resumeIdx = tmp2;
        tmp3 = currentArgList + 1;
        tmp4 = currentArgList + 1;
        tmp5 = tmp4 + argListLength;
        tmp6 = runtime.safeCall(this.saved.slice(tmp3, tmp5));
        return runtime.safeCall(f.apply(this.saved.at(4), tmp6))
      }
      get getLocals() {
        let debugInfo, i, cur, res, i1;
        debugInfo = this.saved.at(3);
        i = 0;
        cur = 6;
        lbl: while (true) {
          let scrut, tmp1, tmp2, tmp3;
          scrut = i < this.saved.at(5);
          if (scrut === true) {
            tmp1 = this.saved.at(cur) + 1;
            tmp2 = cur + tmp1;
            cur = tmp2;
            tmp3 = i + 1;
            i = tmp3;
            continue lbl
          }
          break;
        }
        res = [];
        i1 = 1;
        lbl1: while (true) {
          let scrut, tmp1, tmp2, tmp3, tmp4, tmp5;
          scrut = i1 < debugInfo.length;
          if (scrut === true) {
            tmp1 = i1 + 1;
            tmp2 = cur + 1;
            tmp3 = tmp2 + debugInfo.at(i1);
            tmp4 = globalThis.Object.freeze(new Runtime.LocalVarInfo.class(debugInfo.at(tmp1), this.saved.at(tmp3)));
            runtime.safeCall(res.push(tmp4));
            tmp5 = i1 + 2;
            i1 = tmp5;
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
      static [definitionMetadata] = ["class", "FunctionContFrameImpl", ["_next", "saved"]];
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
    Runtime.JSRT = RuntimeJS;
    Runtime.ShadowStackMarker = function ShadowStackMarker(reason) {
      return globalThis.Object.freeze(new ShadowStackMarker.class(reason));
    };
    (class ShadowStackMarker {
      static {
        Runtime.ShadowStackMarker.class = this
      }
      constructor(reason) {
        this.reason = reason;
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["class", "ShadowStackMarker", ["reason"]];
    });
    Runtime.ShadowFunctionContFrame = function ShadowFunctionContFrame(next, fn, varsClass) {
      return globalThis.Object.freeze(new ShadowFunctionContFrame.class(next, fn, varsClass));
    };
    (class ShadowFunctionContFrame {
      static {
        Runtime.ShadowFunctionContFrame.class = this
      }
      constructor(next, fn, varsClass) {
        this.next = next;
        this.fn = fn;
        this.varsClass = varsClass;
      }
      resume(value) {
        Runtime.resumeValue = value;
        return runtime.safeCall(this.fn(this.varsClass))
      }
      get getLocals() {
        return globalThis.Object.freeze([]);
      }
      get getNme() {
        return "";
      }
      get getLoc() {
        return "";
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["class", "ShadowFunctionContFrame", ["next", "fn", "varsClass"]];
    });
    Runtime.curContTrace = null;
    tmp = new Runtime.ContTrace.class(null, null, null, null, false);
    Runtime.curContTrace = tmp;
    Runtime.curContTrace.last = Runtime.curContTrace;
    Runtime.curContTrace.lastHandler = Runtime.curContTrace;
    (class ShadowStackImpl {
      static {
        Runtime.ShadowStackImpl = this
      }
      static {
        (class StackDelayHandler {
          static {
            new this
          }
          constructor() {
            ShadowStackImpl.StackDelayHandler = this;
            Object.defineProperty(this, "class", {
              value: StackDelayHandler
            });
            globalThis.Object.freeze(this);
          }
          delay() {
            let lambda$here;
            lambda$here = lambda$1(Runtime);
            return Runtime.shadowMkEffect(this, lambda$here)
          }
          toString() { return runtime.render(this); }
          static [definitionMetadata] = ["object", "StackDelayHandler"];
        });
      }
      static enterHandleBlock(handler, body) {
        let handlerFrame, scrut, scrut1, ret;
        handlerFrame = new Runtime.HandlerContFrame.class(Runtime.curContTrace.next, Runtime.curContTrace.nextHandler, handler);
        Runtime.curContTrace.nextHandler = handlerFrame;
        Runtime.curContTrace.next = null;
        scrut = Runtime.curContTrace.lastHandler === Runtime.curContTrace;
        if (scrut === true) {
          Runtime.curContTrace.lastHandler = handlerFrame;
        }
        scrut1 = Runtime.curContTrace.last === Runtime.curContTrace;
        if (scrut1 === true) {
          Runtime.curContTrace.last = handlerFrame;
        }
        ret = runtime.safeCall(body());
        ShadowStackImpl.popHandler(Runtime.curContTrace);
        return ret
      }
      static topLevelTrampoline(limit, body) {
        let scrut, old, old1, old2, result, tmp1, tmp2, tmp3, lambda$here, lambda$here1, lambda$here2;
        Runtime.makeNewContTrace();
        scrut = limit !== null;
        if (scrut === true) {
          Runtime.curEffect = null;
          old = Runtime.stackLimit;
          try {
            Runtime.stackLimit = limit;
            old1 = Runtime.stackDepth;
            try {
              Runtime.stackDepth = 1;
              old2 = Runtime.stackHandler;
              try {
                Runtime.stackHandler = ShadowStackImpl.StackDelayHandler;
                lambda$here = lambda$4(ShadowStackImpl, body);
                lambda$here1 = lambda$3(Runtime, ShadowStackImpl);
                result = runtime.safeCall(RuntimeJS.try_catch(lambda$here, lambda$here1));
                lbl: while (true) {
                  let scrut1, saved, scrut2, tmp4, tmp5;
                  scrut1 = Runtime.stackResume !== null;
                  if (scrut1 === true) {
                    saved = Runtime.stackResume;
                    Runtime.stackResume = null;
                    Runtime.stackDepth = 1;
                    tmp4 = runtime.safeCall(RuntimeJS.try_catch(saved, ShadowStackImpl.checkUnhandledErr));
                    result = tmp4;
                    scrut2 = Runtime.curEffect !== null;
                    if (scrut2 === true) {
                      tmp5 = ShadowStackImpl.handleEffects(Runtime.curEffect);
                      result = tmp5;
                      continue lbl
                    }
                    continue lbl;
                  }
                  break;
                }
                tmp3 = result;
              } finally {
                Runtime.stackHandler = old2;
              }
              tmp2 = tmp3;
            } finally {
              Runtime.stackDepth = old1;
            }
            tmp1 = tmp2;
          } finally {
            Runtime.stackLimit = old;
          }
          return tmp1
        }
        lambda$here2 = lambda$2(Runtime, ShadowStackImpl);
        return runtime.safeCall(RuntimeJS.try_catch(body, lambda$here2));
      }
      static popHandler(tr) {
        let scrut, scrut1;
        scrut = tr.lastHandler === tr.nextHandler;
        if (scrut === true) {
          tr.lastHandler = tr;
          scrut1 = tr.last === tr.nextHandler;
          if (scrut1 === true) {
            tr.last = tr;
          }
        }
        tr.next = tr.nextHandler.next;
        tr.nextHandler = tr.nextHandler.nextHandler;
        return runtime.Unit
      }
      static handleEffects(cur) {
        let cur1;
        cur1 = cur;
        lbl: while (true) {
          let nxt, scrut;
          if (cur1 instanceof Runtime.EffectSig.class) {
            nxt = ShadowStackImpl.handleEffect(cur1);
            scrut = cur1 === nxt;
            if (scrut === true) {
              Runtime.curEffect = cur1;
              throw Runtime.ShadowStackMarker("handleEffects")
            }
            cur1 = nxt;
            continue lbl;
          }
          return cur1;
        }
      }
      static checkUnhandledErr(err) {
        let scrut;
        scrut = Runtime.curEffect === null;
        if (scrut === true) {
          throw err
        }
        return runtime.Unit;
      }
      static concatTraces(bottom, top) {
        let scrut, scrut1, scrut2, scrut3;
        scrut = bottom.next !== null;
        if (scrut === true) {
          top.last.next = bottom.next;
        }
        scrut1 = bottom.last !== bottom;
        if (scrut1 === true) {
          top.last = bottom.last;
        }
        scrut2 = bottom.nextHandler !== null;
        if (scrut2 === true) {
          top.lastHandler.nextHandler = bottom.nextHandler;
        }
        scrut3 = bottom.lastHandler !== bottom;
        if (scrut3 === true) {
          top.lastHandler = bottom.lastHandler;
          return runtime.Unit
        }
        return runtime.Unit;
      }
      static handleEffect(cur) {
        let prevHandlerFrame, scrut, handlerFrame, saved, scrut1, scrut2, old, scrut3, retVal, scrut4, tmp1, tmp2, tmp3, scope43$cap, lambda$here, lambda$here1;
        scope43$cap = new Capture$scope431(undefined);
        scope43$cap.cur$0 = cur;
        prevHandlerFrame = scope43$cap.cur$0.contTrace;
        lbl: while (true) {
          let scrut5, scrut6;
          scrut5 = prevHandlerFrame.nextHandler !== null;
          if (scrut5 === true) {
            scrut6 = prevHandlerFrame.nextHandler.handler !== scope43$cap.cur$0.handler;
            if (scrut6 === true) {
              prevHandlerFrame = prevHandlerFrame.nextHandler;
              continue lbl
            }
          }
          break;
        }
        scrut = prevHandlerFrame.nextHandler === null;
        if (scrut === true) {
          return scope43$cap.cur$0
        }
        handlerFrame = prevHandlerFrame.nextHandler;
        saved = new Runtime.ContTrace.class(handlerFrame.next, scope43$cap.cur$0.contTrace.last, handlerFrame.nextHandler, scope43$cap.cur$0.contTrace.lastHandler, false);
        scrut1 = scope43$cap.cur$0.contTrace.last === handlerFrame;
        if (scrut1 === true) {
          saved.last = saved;
        }
        scrut2 = scope43$cap.cur$0.contTrace.lastHandler === handlerFrame;
        if (scrut2 === true) {
          saved.lastHandler = saved;
        }
        scope43$cap.cur$0.contTrace.last = handlerFrame;
        scope43$cap.cur$0.contTrace.lastHandler = handlerFrame;
        handlerFrame.next = null;
        handlerFrame.nextHandler = null;
        Runtime.curEffect = null;
        old = Runtime.stackDepth;
        try {
          tmp2 = Runtime.stackDepth + 2;
          Runtime.stackDepth = tmp2;
          lambda$here = lambda$6(scope43$cap, ShadowStackImpl);
          tmp3 = runtime.safeCall(RuntimeJS.try_catch(lambda$here, ShadowStackImpl.checkUnhandledErr));
          tmp1 = tmp3;
        } finally {
          Runtime.stackDepth = old;
        }
        scrut3 = Runtime.curEffect !== null;
        if (scrut3 === true) {
          scope43$cap.cur$0 = Runtime.curEffect;
          ShadowStackImpl.concatTraces(saved, scope43$cap.cur$0.contTrace);
          return scope43$cap.cur$0
        }
        lambda$here1 = lambda$5(ShadowStackImpl, saved, tmp1);
        retVal = runtime.safeCall(RuntimeJS.try_catch(lambda$here1, ShadowStackImpl.checkUnhandledErr));
        scrut4 = Runtime.curEffect !== null;
        if (scrut4 === true) {
          return Runtime.curEffect
        }
        return retVal;
      }
      static resume(contTrace) {
        return (value) => {
          let scrut;
          scrut = contTrace.resumed;
          if (scrut === true) {
            throw runtime.safeCall(globalThis.Error("Multiple resumption"))
          }
          contTrace.resumed = true;
          return ShadowStackImpl.resumeContTrace(contTrace, value);
        }
      }
      static resumeContTrace(contTrace, value) {
        let contTrace1, savedResumeFrames, scope47$cap;
        scope47$cap = new Capture$scope471(undefined);
        contTrace1 = contTrace;
        scope47$cap.value$0 = value;
        savedResumeFrames = Runtime.curContTrace;
        Runtime.curContTrace = contTrace;
        lbl: while (true) {
          let scrut, curFrame, old, scrut1, scrut2, tmp1, tmp2, tmp3, lambda$here, lambda$here1;
          scrut = contTrace1.next;
          if (scrut instanceof Runtime.ShadowFunctionContFrame.class) {
            curFrame = contTrace1.next;
            Runtime.curEffect = null;
            old = Runtime.stackDepth;
            try {
              tmp2 = Runtime.stackDepth + 3;
              Runtime.stackDepth = tmp2;
              lambda$here = lambda$8(scope47$cap, curFrame);
              lambda$here1 = lambda$7(ShadowStackImpl);
              tmp3 = runtime.safeCall(RuntimeJS.try_catch(lambda$here, lambda$here1));
              tmp1 = tmp3;
            } finally {
              Runtime.stackDepth = old;
            }
            scope47$cap.value$0 = tmp1;
            scrut1 = Runtime.curEffect !== null;
            if (scrut1 === true) {
              scope47$cap.value$0 = Runtime.curEffect;
            }
            if (scope47$cap.value$0 instanceof Runtime.EffectSig.class) {
              contTrace1 = Runtime.curEffect.contTrace;
              contTrace1.resumed = false;
              contTrace1.last.next = savedResumeFrames.next;
              contTrace1.lastHandler.nextHandler = savedResumeFrames.nextHandler;
              ShadowStackImpl.concatTraces(savedResumeFrames, contTrace1);
              throw Runtime.ShadowStackMarker("resume")
            }
            continue lbl;
          }
          scrut2 = contTrace1.nextHandler;
          if (scrut2 instanceof Runtime.HandlerContFrame.class) {
            ShadowStackImpl.popHandler(contTrace1);
            continue lbl
          }
          Runtime.curContTrace = savedResumeFrames;
          return scope47$cap.value$0;
        }
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["class", "ShadowStackImpl"];
    });
    Runtime.CpsSuspend = function CpsSuspend(k, tag, handlerFun) {
      return globalThis.Object.freeze(new CpsSuspend.class(k, tag, handlerFun));
    };
    (class CpsSuspend {
      static {
        Runtime.CpsSuspend.class = this
      }
      constructor(k, tag, handlerFun) {
        this.k = k;
        this.tag = tag;
        this.handlerFun = handlerFun;
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["class", "CpsSuspend", ["k", "tag", "handlerFun"]];
    });
    Runtime.CpsStackSafetyEffect = function CpsStackSafetyEffect(k, tag, owner, args) {
      return globalThis.Object.freeze(new CpsStackSafetyEffect.class(k, tag, owner, args));
    };
    (class CpsStackSafetyEffect {
      static {
        Runtime.CpsStackSafetyEffect.class = this
      }
      constructor(k, tag, owner, args) {
        this.k = k;
        this.tag = tag;
        this.owner = owner;
        this.args = args;
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["class", "CpsStackSafetyEffect", ["k", "tag", "owner", "args"]];
    });
    (class CpsImpl {
      static {
        Runtime.CpsImpl = this
      }
      static {
        (class StackDelayCpsHandler {
          static {
            new this
          }
          constructor() {
            CpsImpl.StackDelayCpsHandler = this;
            Object.defineProperty(this, "class", {
              value: StackDelayCpsHandler
            });
            globalThis.Object.freeze(this);
          }
          delay(k, owner, args) {
            return globalThis.Object.freeze(new Runtime.CpsStackSafetyEffect.class(k, Runtime.stackHandler, owner, args))
          }
          toString() { return runtime.render(this); }
          static [definitionMetadata] = ["object", "StackDelayCpsHandler"];
        });
      }
      static handlerTrampoline(k, tag, cur) {
        let scrut, arg$CpsSuspend$0$, arg$CpsSuspend$1$, arg$CpsSuspend$2$, scope3$cap;
        scope3$cap = new Capture$scope31(undefined, undefined);
        if (cur instanceof Runtime.CpsSuspend.class) {
          arg$CpsSuspend$0$ = cur.k;
          arg$CpsSuspend$1$ = cur.tag;
          arg$CpsSuspend$2$ = cur.handlerFun;
          scrut = arg$CpsSuspend$1$ === tag;
          if (scrut === true) {
            scope3$cap.handlerFunCont$0 = handlerFunCont$(CpsImpl, tag, arg$CpsSuspend$0$);
            scope3$cap.res$1 = runtime.safeCall(arg$CpsSuspend$2$(Runtime.cpsId, scope3$cap.handlerFunCont$0));
            return propagateSuspend(Runtime, CpsImpl, k, tag, scope3$cap.res$1, false)
          }
          return propagateSuspend(Runtime, CpsImpl, k, tag, cur, true);
        }
        return propagateSuspend(Runtime, CpsImpl, k, tag, cur, true);
      }
      static cpsHandlerImpl(k, tag, f) {
        let tmp1;
        tmp1 = runtime.safeCall(f(Runtime.cpsId));
        return CpsImpl.handlerTrampoline(k, tag, tmp1)
      }
      static ss_handlerTrampoline(ss_k, k, tag, cur) {
        let scrut, scrut1, tmp1, arg$CpsSuspend$0$, arg$CpsSuspend$1$, arg$CpsSuspend$2$, cont$here, handlerFunCont$here;
        scrut = CpsImpl.cpsSetCheckDepth();
        if (scrut === true) {
          tmp1 = globalThis.Object.freeze([
            ss_k,
            k,
            tag,
            cur
          ]);
          return CpsImpl.cpsRaiseStack(CpsImpl.ss_handlerTrampoline, null, tmp1)
        }
        if (cur instanceof Runtime.CpsSuspend.class) {
          arg$CpsSuspend$0$ = cur.k;
          arg$CpsSuspend$1$ = cur.tag;
          arg$CpsSuspend$2$ = cur.handlerFun;
          scrut1 = arg$CpsSuspend$1$ === tag;
          if (scrut1 === true) {
            cont$here = cont$(Runtime, CpsImpl, ss_k, k, tag);
            handlerFunCont$here = handlerFunCont$1(Runtime, CpsImpl, tag, arg$CpsSuspend$0$);
            return runtime.safeCall(arg$CpsSuspend$2$(cont$here, Runtime.cpsId2, handlerFunCont$here))
          }
          return propagateSuspend1(Runtime, CpsImpl, k, tag, ss_k, cur, true);
        }
        return propagateSuspend1(Runtime, CpsImpl, k, tag, ss_k, cur, true);
      }
      static ss_cpsHandlerImpl(ss_k, k, tag, f) {
        let cont$here;
        cont$here = cont$1(Runtime, CpsImpl, ss_k, k, tag);
        return runtime.safeCall(f(cont$here, Runtime.cpsId2))
      }
      static cpsSetCheckDepth() {
        let tmp1, tmp2;
        tmp1 = Runtime.stackDepth + 1;
        Runtime.stackDepth = tmp1;
        tmp2 = Runtime.stackDepth >= Runtime.stackLimit;
        if (tmp2 === true) {
          return Runtime.stackHandler !== null
        }
        return false;
      }
      static cpsRaiseStack(k, owner, args) {
        return Runtime.stackHandler.delay(k, owner, args)
      }
      static runStackSafeCps(limit, f) {
        let old, old1, old2, result, tmp1, tmp2, tmp3;
        old = Runtime.stackLimit;
        try {
          Runtime.stackLimit = limit;
          old1 = Runtime.stackDepth;
          try {
            Runtime.stackDepth = 1;
            old2 = Runtime.stackHandler;
            try {
              Runtime.stackHandler = CpsImpl.StackDelayCpsHandler;
              result = runtime.safeCall(f());
              lbl: while (true) {
                let old3, arg$CpsStackSafetyEffect$0$, arg$CpsStackSafetyEffect$2$, arg$CpsStackSafetyEffect$3$;
                if (result instanceof Runtime.CpsStackSafetyEffect.class) {
                  arg$CpsStackSafetyEffect$0$ = result.k;
                  arg$CpsStackSafetyEffect$2$ = result.owner;
                  arg$CpsStackSafetyEffect$3$ = result.args;
                  old3 = Runtime.stackDepth;
                  try {
                    Runtime.stackDepth = 1;
                    result = runtime.safeCall(arg$CpsStackSafetyEffect$0$.apply(arg$CpsStackSafetyEffect$2$, arg$CpsStackSafetyEffect$3$));
                  } finally {
                    Runtime.stackDepth = old3;
                  }
                  continue lbl
                }
                break;
              }
              tmp3 = result;
            } finally {
              Runtime.stackHandler = old2;
            }
            tmp2 = tmp3;
          } finally {
            Runtime.stackDepth = old1;
          }
          tmp1 = tmp2;
        } finally {
          Runtime.stackLimit = old;
        }
        return tmp1
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["class", "CpsImpl"];
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
    (class StackDelayHandler1 {
      static {
        new this
      }
      constructor() {
        Runtime.StackDelayHandler = this;
        Object.defineProperty(this, "class", {
          value: StackDelayHandler1
        });
        globalThis.Object.freeze(this);
      }
      delay() {
        let lambda$here;
        lambda$here = lambda$11(Runtime);
        return Runtime.mkEffect(this, lambda$here)
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["object", "StackDelayHandler"];
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
        let tmp1, tmp2;
        tmp1 = runtime.safeCall(Runtime.shl(1, 31));
        tmp2 = runtime.safeCall(Runtime.bitnot(tmp1));
        return runtime.safeCall(Runtime.bitand(this.#v, tmp2))
      }
      sext() {
        let tmp1;
        tmp1 = runtime.safeCall(Runtime.shl(1, 31));
        return runtime.safeCall(Runtime.bitor(this.#v, tmp1))
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["class", "Int31", [null]];
    });
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
  static checkArgs(functionName, expected, got) {
    let scrut, scrut1, scrut2, tmp, tmp1, tmp2, tmp3, tmp4, tmp5, tmp6, tmp7, tmp8, tmp9;
    scrut = got < expected;
    if (scrut === true) {
      scrut1 = functionName.length > 0;
      if (scrut1 === true) {
        tmp = " '" + functionName;
        tmp1 = tmp + "'";
      } else {
        tmp1 = "";
      }
      tmp2 = "Function" + tmp1;
      tmp3 = tmp2 + " expected at least ";
      tmp4 = tmp3 + expected;
      tmp5 = tmp4 + " argument";
      scrut2 = expected === 1;
      if (scrut2 === true) {
        tmp6 = "";
      } else {
        tmp6 = "s";
      }
      tmp7 = tmp5 + tmp6;
      tmp8 = tmp7 + " but got ";
      tmp9 = tmp8 + got;
      throw runtime.safeCall(globalThis.Error(tmp9))
    }
    return runtime.Unit;
  }
  static checkVariadicArgs(functionName, expected, leading, args) {
    let tmp;
    tmp = leading + args.length;
    return Runtime.checkArgs(functionName, expected, tmp)
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
    res = f();
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
  static resetEffects() {
    Runtime.curEffect = null;
    Runtime.resumePc = -1;
    return Runtime.makeNewContTrace()
  }
  static raisePrintStackEffect(showLocals) {
    return Runtime.mkEffect(Runtime.PrintStackEffect, showLocals)
  }
  static topLevelEffect(debug) {
    let v, tmp, tmp1, scope64$cap;
    scope64$cap = new Capture$scope641(undefined);
    scope64$cap.tr$0 = Runtime.curEffect;
    v = null;
    lbl: while (true) {
      let scrut, tmp2;
      if (scope64$cap.tr$0 instanceof Runtime.EffectSig.class) {
        scrut = scope64$cap.tr$0.handler === Runtime.PrintStackEffect;
        if (scrut === true) {
          let inlinedVal;
          tmp2 = Runtime.showStackTrace("Stack Trace:", scope64$cap.tr$0, debug, scope64$cap.tr$0.handlerFun);
          runtime.safeCall(globalThis.console.log(tmp2));
          Runtime.curEffect = null;
          inlinedVal = Runtime.resume(scope64$cap.tr$0.contTrace)(runtime.Unit);
          v = inlinedVal;
          scope64$cap.tr$0 = Runtime.curEffect;
          continue lbl
        }
      }
      break;
    }
    if (scope64$cap.tr$0 instanceof Runtime.EffectSig.class) {
      Runtime.curEffect = null;
      tmp = "Error: Unhandled effect " + scope64$cap.tr$0.handler["constructor"]["name"];
      tmp1 = Runtime.showStackTrace(tmp, scope64$cap.tr$0, debug, false);
      throw Runtime.CustomStackError(tmp1)
    }
    return v;
  }
  static illegalEffect(position) {
    let tmp, tmp1, tmp2, tmp3, tmp4;
    tmp = Runtime.curEffect;
    Runtime.curEffect = null;
    tmp1 = "Error: Effect " + tmp.handler["constructor"]["name"];
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
                  tmp2 = runtime.safeCall(curLocals.map(lambda1));
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
            tmp = "\n\twith handler " + curHandler.handler["constructor"]["name"];
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
  static showFunctionContChain(cont2, hl, vis, reps) {
    let reps1, scrut, scrut1, scrut2, tmp, tmp1, tmp2, tmp3, tmp4, scope71$cap, lambda$here;
    scope71$cap = new Capture$scope711(undefined);
    reps1 = reps;
    if (cont2 instanceof Runtime.FunctionContFrameImpl.class) {
      tmp = cont2["constructor"]["name"] + "(pc=";
      scope71$cap.result$0 = tmp + cont2.saved.at(1);
      lambda$here = lambda$12(scope71$cap, cont2);
      runtime.safeCall(hl.forEach(lambda$here));
      scrut = runtime.safeCall(vis.has(cont2));
      if (scrut === true) {
        tmp1 = reps + 1;
        reps1 = tmp1;
        scrut1 = tmp1 > 10;
        if (scrut1 === true) {
          throw runtime.safeCall(globalThis.Error("10 repeated continuation frame (loop?)"))
        }
        tmp2 = scope71$cap.result$0 + ", REPEAT";
        scope71$cap.result$0 = tmp2;
      } else {
        runtime.safeCall(vis.add(cont2));
      }
      tmp3 = scope71$cap.result$0 + ") -> ";
      tmp4 = Runtime.showFunctionContChain(cont2.next, hl, vis, reps1);
      return tmp3 + tmp4
    }
    scrut2 = cont2 === null;
    if (scrut2 === true) {
      return "(null)"
    }
    return "(NOT CONT)";
  }
  static showHandlerContChain(cont2, hl, vis, reps) {
    let reps1, scrut, scrut1, scrut2, tmp, tmp1, tmp2, tmp3, scope73$cap, lambda$here;
    scope73$cap = new Capture$scope731(undefined);
    reps1 = reps;
    if (cont2 instanceof Runtime.HandlerContFrame.class) {
      scope73$cap.result$0 = cont2.handler["constructor"]["name"];
      lambda$here = lambda$13(scope73$cap, cont2);
      runtime.safeCall(hl.forEach(lambda$here));
      scrut = runtime.safeCall(vis.has(cont2));
      if (scrut === true) {
        tmp = reps + 1;
        reps1 = tmp;
        scrut1 = tmp > 10;
        if (scrut1 === true) {
          throw runtime.safeCall(globalThis.Error("10 repeated continuation frame (loop?)"))
        }
        tmp1 = scope73$cap.result$0 + ", REPEAT";
        scope73$cap.result$0 = tmp1;
      } else {
        runtime.safeCall(vis.add(cont2));
      }
      tmp2 = scope73$cap.result$0 + " -> ";
      tmp3 = Runtime.showFunctionContChain(cont2.next, hl, vis, reps1);
      return tmp2 + tmp3
    }
    scrut2 = cont2 === null;
    if (scrut2 === true) {
      return "(null)"
    }
    return "(NOT HANDLER CONT)";
  }
  static debugCont(cont2) {
    let tmp, tmp1, tmp2;
    tmp = globalThis.Object.freeze(new globalThis.Map(undefined));
    tmp1 = globalThis.Object.freeze(new globalThis.Set(undefined));
    tmp2 = Runtime.showFunctionContChain(cont2, tmp, tmp1, 0);
    return runtime.safeCall(globalThis.console.log(tmp2))
  }
  static debugHandler(cont2) {
    let tmp, tmp1, tmp2;
    tmp = globalThis.Object.freeze(new globalThis.Map(undefined));
    tmp1 = globalThis.Object.freeze(new globalThis.Set(undefined));
    tmp2 = Runtime.showHandlerContChain(cont2, tmp, tmp1, 0);
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
      vis = globalThis.Object.freeze(new globalThis.Set(undefined));
      hl = globalThis.Object.freeze(new globalThis.Map(undefined));
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
      runtime.safeCall(globalThis.console.log("handler: ", eff.handler["constructor"]["name"]));
      runtime.safeCall(globalThis.console.log("handlerFun: ", eff.handlerFun));
      return Runtime.debugContTrace(eff.contTrace)
    }
    runtime.safeCall(globalThis.console.log("Not an effect:"));
    return runtime.safeCall(globalThis.console.log(eff));
  }
  static unwind(...saved) {
    let scrut, tmp;
    scrut = saved.at(1) === -2;
    if (scrut === true) {
      return null
    }
    tmp = new Runtime.FunctionContFrameImpl.class(null, saved);
    Runtime.curEffect.contTrace.last.next = tmp;
    Runtime.curEffect.contTrace.last = Runtime.curEffect.contTrace.last.next;
    return null;
  }
  static unwindFramed(frame) {
    Runtime.curEffect.contTrace.last.next = frame;
    Runtime.curEffect.contTrace.last = frame;
    return runtime.Unit
  }
  static mkEffect(handler, handlerFun) {
    let res, tmp;
    tmp = new Runtime.ContTrace.class(null, null, null, null, false);
    res = new Runtime.EffectSig.class(tmp, handler, handlerFun);
    res.contTrace.last = res.contTrace;
    res.contTrace.lastHandler = res.contTrace;
    Runtime.curEffect = res;
    return null
  }
  static handleBlockImpl(cur, handler) {
    let handlerFrame;
    handlerFrame = new Runtime.HandlerContFrame.class(null, null, handler);
    cur.contTrace.lastHandler.nextHandler = handlerFrame;
    cur.contTrace.lastHandler = handlerFrame;
    cur.contTrace.last = handlerFrame;
    return Runtime.handleEffects(cur)
  }
  static effectRethrow(e) {
    let scrut;
    scrut = e !== Runtime.EffectException;
    if (scrut === true) {
      throw e
    }
    return runtime.Unit;
  }
  static enterHandleBlock(handler, body) {
    let tmp, scrut;
    tmp = body();
    scrut = Runtime.curEffect === null;
    if (scrut === true) {
      return tmp
    }
    return Runtime.handleBlockImpl(Runtime.curEffect, handler);
  }
  static handleEffects(cur) {
    let cur1;
    cur1 = cur;
    lbl: while (true) {
      let nxt, scrut;
      if (cur1 instanceof Runtime.EffectSig.class) {
        nxt = Runtime.handleEffect(cur1);
        scrut = cur1 === nxt;
        if (scrut === true) {
          Runtime.curEffect = cur1;
          return null
        }
        cur1 = nxt;
        continue lbl;
      }
      return cur1;
    }
  }
  static handleEffect(cur) {
    let scrut, handlerFrame, saved, scrut1, scrut2, old, scrut3, scrut4, scrut5, scrut6, tmp, tmp1, scope87$cap;
    scope87$cap = new Capture$scope871(undefined, undefined);
    scope87$cap.cur$0 = cur;
    scope87$cap.prevHandlerFrame$1 = scope87$cap.cur$0.contTrace;
    lbl: while (true) {
      let scrut7, scrut8;
      scrut7 = scope87$cap.prevHandlerFrame$1.nextHandler !== null;
      if (scrut7 === true) {
        scrut8 = scope87$cap.prevHandlerFrame$1.nextHandler.handler !== scope87$cap.cur$0.handler;
        if (scrut8 === true) {
          scope87$cap.prevHandlerFrame$1 = scope87$cap.prevHandlerFrame$1.nextHandler;
          continue lbl
        }
      }
      break;
    }
    scrut = scope87$cap.prevHandlerFrame$1.nextHandler === null;
    if (scrut === true) {
      return scope87$cap.cur$0
    }
    handlerFrame = scope87$cap.prevHandlerFrame$1.nextHandler;
    saved = new Runtime.ContTrace.class(handlerFrame.next, scope87$cap.cur$0.contTrace.last, handlerFrame.nextHandler, scope87$cap.cur$0.contTrace.lastHandler, false);
    scrut1 = scope87$cap.cur$0.contTrace.last === handlerFrame;
    if (scrut1 === true) {
      saved.last = saved;
    }
    scrut2 = scope87$cap.cur$0.contTrace.lastHandler === handlerFrame;
    if (scrut2 === true) {
      saved.lastHandler = saved;
    }
    scope87$cap.cur$0.contTrace.last = handlerFrame;
    scope87$cap.cur$0.contTrace.lastHandler = handlerFrame;
    handlerFrame.next = null;
    handlerFrame.nextHandler = null;
    Runtime.curEffect = null;
    old = Runtime.stackDepth;
    try {
      {
        let inlinedVal, tmp2;
        tmp1 = Runtime.stackDepth + 2;
        Runtime.stackDepth = tmp1;
        tmp2 = Runtime.resume(scope87$cap.cur$0.contTrace);
        inlinedVal = runtime.safeCall(scope87$cap.cur$0.handlerFun(tmp2));
        tmp = inlinedVal;
      }
    } finally {
      Runtime.stackDepth = old;
    }
    scrut3 = Runtime.curEffect !== null;
    if (scrut3 === true) {
      scope87$cap.cur$0 = Runtime.curEffect;
      scrut4 = saved.next !== null;
      if (scrut4 === true) {
        scope87$cap.cur$0.contTrace.last.next = saved.next;
      }
      scrut5 = saved.last !== saved;
      if (scrut5 === true) {
        scope87$cap.cur$0.contTrace.last = saved.last;
      }
      scrut6 = saved.nextHandler !== null;
      if (scrut6 === true) {
        scope87$cap.cur$0.contTrace.lastHandler.nextHandler = saved.nextHandler;
        scope87$cap.cur$0.contTrace.lastHandler = saved.lastHandler;
        return scope87$cap.cur$0
      }
      return scope87$cap.cur$0;
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
    let value1, cont2, handlerCont;
    value1 = value;
    cont2 = contTrace.next;
    handlerCont = contTrace.nextHandler;
    lbl: while (true) {
      let old, scrut, scrut1, scrut2, tmp, tmp1, tmp2, tmp3, tmp4;
      tmp = cont2 !== null;
      if (tmp === true) {
        tmp1 = cont2.isContCls;
        if (tmp1 === true) {
          Runtime.curEffect = null;
          old = Runtime.stackDepth;
          try {
            tmp3 = Runtime.stackDepth + 3;
            Runtime.stackDepth = tmp3;
            tmp4 = runtime.safeCall(cont2.resume(value1));
            tmp2 = tmp4;
          } finally {
            Runtime.stackDepth = old;
          }
          value1 = tmp2;
          scrut = Runtime.curEffect !== null;
          if (scrut === true) {
            value1 = Runtime.curEffect;
          }
          if (value1 instanceof Runtime.EffectSig.class) {
            value1.contTrace.last.next = cont2.next;
            value1.contTrace.lastHandler.nextHandler = handlerCont;
            scrut1 = contTrace.last !== cont2;
            if (scrut1 === true) {
              value1.contTrace.last = contTrace.last;
            }
            scrut2 = handlerCont !== null;
            if (scrut2 === true) {
              value1.contTrace.lastHandler = contTrace.lastHandler;
              return value1
            }
            return value1;
          }
          cont2 = cont2.next;
          continue lbl;
        }
        if (handlerCont instanceof Runtime.HandlerContFrame.class) {
          cont2 = handlerCont.next;
          handlerCont = handlerCont.nextHandler;
          continue lbl
        }
        return value1;
      }
      if (handlerCont instanceof Runtime.HandlerContFrame.class) {
        cont2 = handlerCont.next;
        handlerCont = handlerCont.nextHandler;
        continue lbl
      }
      return value1;
    }
  }
  static makeNewContTrace() {
    let tmp;
    tmp = new Runtime.ContTrace.class(null, null, null, null, false);
    Runtime.curContTrace = tmp;
    Runtime.curContTrace.last = Runtime.curContTrace;
    Runtime.curContTrace.lastHandler = Runtime.curContTrace;
    return runtime.Unit
  }
  static shadowTopLevelTrampoline(limit, body) {
    return Runtime.ShadowStackImpl.topLevelTrampoline(limit, body)
  }
  static shadowPushFrame(fn, vars) {
    let newFrame, scrut;
    newFrame = new Runtime.ShadowFunctionContFrame.class(Runtime.curContTrace.next, fn, vars);
    scrut = Runtime.curContTrace.last === Runtime.curContTrace;
    if (scrut === true) {
      Runtime.curContTrace.last = newFrame;
    }
    Runtime.curContTrace.next = newFrame;
    return runtime.Unit
  }
  static shadowPopFrame() {
    let scrut;
    scrut = Runtime.curContTrace.next === Runtime.curContTrace.last;
    if (scrut === true) {
      Runtime.curContTrace.last = Runtime.curContTrace;
    }
    Runtime.curContTrace.next = Runtime.curContTrace.next.next;
    return runtime.Unit
  }
  static shadowMkEffect(handler, handlerFun) {
    let res;
    res = new Runtime.EffectSig.class(Runtime.curContTrace, handler, handlerFun);
    Runtime.curEffect = res;
    Runtime.makeNewContTrace();
    throw Runtime.ShadowStackMarker("mkEffect")
  }
  static shadowEnterHandleBlock(handler, body) {
    return Runtime.ShadowStackImpl.enterHandleBlock(handler, body)
  }
  static shadowRethrow(err) {
    let scrut;
    scrut = Runtime.curEffect === null;
    if (scrut === true) {
      throw err
    }
    return runtime.Unit;
  }
  static cpsId(x) {
    return x
  }
  static cpsId2(k, x) {
    return runtime.safeCall(k(x))
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
  static cpsRaiseStack(k, owner, args) {
    return Runtime.stackHandler.delay(k, owner, args)
  }
  static runStackSafeCps(limit, f) {
    return Runtime.CpsImpl.runStackSafeCps(limit, f)
  }
  static ss_cpsHandlerImpl(ss_k, k, tag, f) {
    let cont$here;
    cont$here = cont$1(Runtime, Runtime.CpsImpl, ss_k, k, tag);
    return runtime.safeCall(f(cont$here, Runtime.cpsId2))
  }
  static cpsHandlerImpl(k, tag, f) {
    let tmp;
    tmp = runtime.safeCall(f(Runtime.cpsId));
    return Runtime.CpsImpl.handlerTrampoline(k, tag, tmp)
  }
  static await(promise) {
    let lambda$here;
    lambda$here = lambda$14(Runtime, promise);
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
        return Runtime.stackHandler.delay()
      }
      return runtime.Unit;
    }
    return runtime.Unit;
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
          result = lambda6(Runtime, f);
          scrut = Runtime.curEffect !== null;
          if (scrut === true) {
            throw globalThis.Object.freeze(new globalThis.Error("Effect crossed through stack safe boundary", undefined))
          }
          lbl: while (true) {
            let scrut1, saved, scrut2;
            scrut1 = Runtime.stackResume !== null;
            if (scrut1 === true) {
              let inlinedVal;
              saved = Runtime.stackResume;
              Runtime.stackResume = null;
              Runtime.stackDepth = 1;
              inlinedVal = runtime.safeCall(saved(runtime.Unit));
              result = inlinedVal;
              scrut2 = Runtime.curEffect !== null;
              if (scrut2 === true) {
                throw globalThis.Object.freeze(new globalThis.Error("Effect crossed through stack safe boundary", undefined))
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
  toString() { return runtime.render(this); }
  static [definitionMetadata] = ["class", "Runtime"];
});
export { propagateSuspend as _$_modulePrivate_$_propagateSuspend };
export { resumeCont1Reinstall as _$_modulePrivate_$_resumeCont1Reinstall };
export { resumeCont1 as _$_modulePrivate_$_resumeCont1 };
export { suspendCont1 as _$_modulePrivate_$_suspendCont1 };
export { resumeCont as _$_modulePrivate_$_resumeCont };
export { handlerFunCont as _$_modulePrivate_$_handlerFunCont };
export { cont as _$_modulePrivate_$_cont };
export { propagateSuspend1 as _$_modulePrivate_$_propagateSuspend1 };
export { cont1 as _$_modulePrivate_$_cont1 };
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
export { lambda12 as _$_modulePrivate_$_lambda12 };
export { lambda13 as _$_modulePrivate_$_lambda13 };
export { lambda14 as _$_modulePrivate_$_lambda14 };
export { lambda15 as _$_modulePrivate_$_lambda15 };
export { lambda16 as _$_modulePrivate_$_lambda16 };
export { lambda17 as _$_modulePrivate_$_lambda17 };
export { lambda18 as _$_modulePrivate_$_lambda18 };
export { lambda19 as _$_modulePrivate_$_lambda19 };
export { lambda20 as _$_modulePrivate_$_lambda20 };
export { handlerFunCont1 as _$_modulePrivate_$_handlerFunCont1 };
export { lambda$ as _$_modulePrivate_$_lambda$ };
export { lambda$1 as _$_modulePrivate_$_lambda$1 };
export { lambda$2 as _$_modulePrivate_$_lambda$2 };
export { lambda$3 as _$_modulePrivate_$_lambda$3 };
export { lambda$4 as _$_modulePrivate_$_lambda$4 };
export { Capture$scope431 as _$_modulePrivate_$_Capture$scope43 };
export { lambda$5 as _$_modulePrivate_$_lambda$5 };
export { lambda$6 as _$_modulePrivate_$_lambda$6 };
export { Capture$scope471 as _$_modulePrivate_$_Capture$scope47 };
export { lambda$7 as _$_modulePrivate_$_lambda$7 };
export { lambda$8 as _$_modulePrivate_$_lambda$8 };
export { Capture$scope31 as _$_modulePrivate_$_Capture$scope3 };
export { handlerFunCont$ as _$_modulePrivate_$_handlerFunCont$ };
export { Capture$scope61 as _$_modulePrivate_$_Capture$scope6 };
export { lambda$9 as _$_modulePrivate_$_lambda$9 };
export { lambda$10 as _$_modulePrivate_$_lambda$10 };
export { cont$ as _$_modulePrivate_$_cont$ };
export { handlerFunCont$1 as _$_modulePrivate_$_handlerFunCont$1 };
export { propagateSuspend$ as _$_modulePrivate_$_propagateSuspend$ };
export { resumeCont$ as _$_modulePrivate_$_resumeCont$ };
export { suspendCont1$ as _$_modulePrivate_$_suspendCont1$ };
export { resumeCont1$ as _$_modulePrivate_$_resumeCont1$ };
export { resumeCont1Reinstall$ as _$_modulePrivate_$_resumeCont1Reinstall$ };
export { cont$1 as _$_modulePrivate_$_cont$1 };
export { lambda$11 as _$_modulePrivate_$_lambda$11 };
export { Capture$scope641 as _$_modulePrivate_$_Capture$scope64 };
export { Capture$scope711 as _$_modulePrivate_$_Capture$scope71 };
export { lambda$12 as _$_modulePrivate_$_lambda$12 };
export { Capture$scope731 as _$_modulePrivate_$_Capture$scope73 };
export { lambda$13 as _$_modulePrivate_$_lambda$13 };
export { Capture$scope871 as _$_modulePrivate_$_Capture$scope87 };
export { lambda$14 as _$_modulePrivate_$_lambda$14 };
export { continuation$ as _$_modulePrivate_$_continuation$ };
export default Runtime1;
