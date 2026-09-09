const definitionMetadata = globalThis.Symbol.for("mlscript.definitionMetadata");
const prettyPrint = globalThis.Symbol.for("mlscript.prettyPrint");
import runtime from "./Runtime.mjs";
import RuntimeJS from "./RuntimeJS.mjs";
import Rendering from "./Rendering.mjs";
import LazyArray from "./LazyArray.mjs";
import Iter from "./Iter.mjs";
let continuation, Runtime1, lambda, lambda1, lambda2, lambda3, lambda4, lambda5, lambda6, lambda7, lambda8, lambda9, lambda10, lambda11, lambda12, lambda13, lambda14, lambda15, lambda16, lambda17, lambda18, lambda$, lambda$1, lambda$2, lambda$3, lambda$4, Capture$handleEffect2, lambda$5, lambda$6, Capture$resumeContTrace1, lambda$7, lambda$8, lambda$9, Capture$scope391, Capture$scope461, lambda$10, Capture$scope481, lambda$11, Capture$handleEffect3, Capture$scope601, lambda$12, continuation$;
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
lambda$12 = (undefined, function (Runtime2, promise) {
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
(class Capture$scope60 {
  static {
    Capture$scope601 = this
  }
  constructor(prevHandlerFrame$0) {
    this.prevHandlerFrame$0 = prevHandlerFrame$0;
  }
  toString() { return runtime.render(this); }
  static [definitionMetadata] = ["class", "Capture$scope60"];
});
lambda4 = (undefined, function (handleEffect$cap, Runtime2) {
  let tmp;
  tmp = Runtime2.resume(handleEffect$cap.cur$0.contTrace);
  return runtime.safeCall(handleEffect$cap.cur$0.handlerFun(tmp))
});
(class Capture$handleEffect {
  static {
    Capture$handleEffect3 = this
  }
  constructor(cur$0) {
    this.cur$0 = cur$0;
  }
  toString() { return runtime.render(this); }
  static [definitionMetadata] = ["class", "Capture$handleEffect"];
});
(class Capture$scope48 {
  static {
    Capture$scope481 = this
  }
  constructor(result$0) {
    this.result$0 = result$0;
  }
  toString() { return runtime.render(this); }
  static [definitionMetadata] = ["class", "Capture$scope48"];
});
lambda$11 = (undefined, function (scope48$cap, cont) {
  return (m, marker) => {
    return lambda3(scope48$cap, cont, m, marker)
  }
});
lambda3 = (undefined, function (scope48$cap, cont, m, marker) {
  let scrut, tmp, tmp1;
  scrut = runtime.safeCall(m.has(cont));
  if (scrut === true) {
    tmp = ", " + marker;
    tmp1 = scope48$cap.result$0 + tmp;
    scope48$cap.result$0 = tmp1;
    return runtime.Unit
  }
  return runtime.Unit;
});
(class Capture$scope46 {
  static {
    Capture$scope461 = this
  }
  constructor(result$0) {
    this.result$0 = result$0;
  }
  toString() { return runtime.render(this); }
  static [definitionMetadata] = ["class", "Capture$scope46"];
});
lambda$10 = (undefined, function (scope46$cap, cont) {
  return (m, marker) => {
    return lambda2(scope46$cap, cont, m, marker)
  }
});
lambda2 = (undefined, function (scope46$cap, cont, m, marker) {
  let scrut, tmp, tmp1;
  scrut = runtime.safeCall(m.has(cont));
  if (scrut === true) {
    tmp = ", " + marker;
    tmp1 = scope46$cap.result$0 + tmp;
    scope46$cap.result$0 = tmp1;
    return runtime.Unit
  }
  return runtime.Unit;
});
lambda1 = (undefined, function (l) {
  let tmp, tmp1;
  tmp = l.localName + "=";
  tmp1 = runtime.safeCall(Rendering.render(l.value));
  return tmp + tmp1
});
lambda = (undefined, function (scope39$cap, Runtime2) {
  return Runtime2.resume(scope39$cap.tr$0.contTrace)(runtime.Unit)
});
(class Capture$scope39 {
  static {
    Capture$scope391 = this
  }
  constructor(tr$0) {
    this.tr$0 = tr$0;
  }
  toString() { return runtime.render(this); }
  static [definitionMetadata] = ["class", "Capture$scope39"];
});
lambda$9 = (undefined, function (Runtime2) {
  return (k) => {
    Runtime2.stackResume = k;
    return runtime.Unit
  }
});
lambda18 = (undefined, function (Runtime2, k) {
  Runtime2.stackResume = k;
  return runtime.Unit
});
lambda$8 = (undefined, function (resumeContTrace$cap, curFrame) {
  return () => {
    return runtime.safeCall(curFrame.resume(resumeContTrace$cap.value$0))
  }
});
lambda$7 = (undefined, function (ShadowStackImpl1) {
  return (err) => {
    return ShadowStackImpl1.checkUnhandledErr
  }
});
lambda15 = (undefined, function (resumeContTrace$cap, curFrame) {
  return runtime.safeCall(curFrame.resume(resumeContTrace$cap.value$0))
});
lambda16 = (undefined, function (ShadowStackImpl1, err) {
  return ShadowStackImpl1.checkUnhandledErr
});
(class Capture$resumeContTrace {
  static {
    Capture$resumeContTrace1 = this
  }
  constructor(value$0) {
    this.value$0 = value$0;
  }
  toString() { return runtime.render(this); }
  static [definitionMetadata] = ["class", "Capture$resumeContTrace"];
});
lambda$6 = (undefined, function (handleEffect$cap, ShadowStackImpl1) {
  return () => {
    let tmp;
    tmp = ShadowStackImpl1.resume(handleEffect$cap.cur$0.contTrace);
    return runtime.safeCall(handleEffect$cap.cur$0.handlerFun(tmp))
  }
});
lambda$5 = (undefined, function (ShadowStackImpl1, saved, tmp) {
  return () => {
    return ShadowStackImpl1.resumeContTrace(saved, tmp)
  }
});
lambda13 = (undefined, function (handleEffect$cap, ShadowStackImpl1) {
  let tmp;
  tmp = ShadowStackImpl1.resume(handleEffect$cap.cur$0.contTrace);
  return runtime.safeCall(handleEffect$cap.cur$0.handlerFun(tmp))
});
lambda14 = (undefined, function (ShadowStackImpl1, saved, tmp) {
  return ShadowStackImpl1.resumeContTrace(saved, tmp)
});
(class Capture$handleEffect1 {
  static {
    Capture$handleEffect2 = this
  }
  constructor(cur$0) {
    this.cur$0 = cur$0;
  }
  toString() { return runtime.render(this); }
  static [definitionMetadata] = ["class", "Capture$handleEffect"];
});
lambda$4 = (undefined, function (ShadowStackImpl1, body) {
  return () => {
    return ShadowStackImpl1.enterHandleBlock(ShadowStackImpl1.StackDelayHandler, body)
  }
});
lambda$3 = (undefined, function (Runtime2, ShadowStackImpl1) {
  return (err) => {
    return lambda11(Runtime2, ShadowStackImpl1, err)
  }
});
lambda$2 = (undefined, function (Runtime2, ShadowStackImpl1) {
  return (err) => {
    return lambda12(Runtime2, ShadowStackImpl1, err)
  }
});
lambda10 = (undefined, function (ShadowStackImpl1, body) {
  return ShadowStackImpl1.enterHandleBlock(ShadowStackImpl1.StackDelayHandler, body)
});
lambda11 = (undefined, function (Runtime2, ShadowStackImpl1, err) {
  let scrut;
  scrut = Runtime.curEffect === null;
  if (scrut === true) {
    throw err
  }
  return ShadowStackImpl1.handleEffects(Runtime2.curEffect);
});
lambda12 = (undefined, function (Runtime2, ShadowStackImpl1, err) {
  let scrut;
  scrut = Runtime.curEffect === null;
  if (scrut === true) {
    throw err
  }
  return ShadowStackImpl1.handleEffects(Runtime2.curEffect);
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
    Runtime.FunctionContFrameImpl = function FunctionContFrameImpl(next, saved) {
      return globalThis.Object.freeze(new FunctionContFrameImpl.class(next, saved));
    };
    (class FunctionContFrameImpl extends Runtime.FunctionContFrame.class {
      static {
        Runtime.FunctionContFrameImpl.class = this
      }
      constructor(next, saved) {
        super(next);
        this.next = next;
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
      static [definitionMetadata] = ["class", "FunctionContFrameImpl", ["next", "saved"]];
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
    Runtime.enterHandleBlockGenerator = RuntimeJS.enterHandleBlockGenerator;
    Runtime.handlerTopLevelCall = RuntimeJS.handlerTopLevelCall;
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
        return runtime.Unit;
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
        lbl: while (true) {
          let nxt, scrut;
          if (cur instanceof Runtime.EffectSig.class) {
            nxt = ShadowStackImpl.handleEffect(cur);
            scrut = cur === nxt;
            if (scrut === true) {
              Runtime.curEffect = cur;
              throw Runtime.ShadowStackMarker("handleEffects")
            }
            cur = nxt;
            continue lbl;
          }
          return cur;
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
        let prevHandlerFrame, scrut, handlerFrame, saved, scrut1, scrut2, old, scrut3, retVal, scrut4, tmp1, tmp2, tmp3, handleEffect$cap, lambda$here, lambda$here1;
        handleEffect$cap = new Capture$handleEffect2(cur);
        prevHandlerFrame = handleEffect$cap.cur$0.contTrace;
        lbl: while (true) {
          let scrut5, scrut6;
          scrut5 = prevHandlerFrame.nextHandler !== null;
          if (scrut5 === true) {
            scrut6 = prevHandlerFrame.nextHandler.handler !== handleEffect$cap.cur$0.handler;
            if (scrut6 === true) {
              prevHandlerFrame = prevHandlerFrame.nextHandler;
              continue lbl
            }
          }
          break;
        }
        scrut = prevHandlerFrame.nextHandler === null;
        if (scrut === true) {
          return handleEffect$cap.cur$0
        }
        handlerFrame = prevHandlerFrame.nextHandler;
        saved = new Runtime.ContTrace.class(handlerFrame.next, handleEffect$cap.cur$0.contTrace.last, handlerFrame.nextHandler, handleEffect$cap.cur$0.contTrace.lastHandler, false);
        scrut1 = handleEffect$cap.cur$0.contTrace.last === handlerFrame;
        if (scrut1 === true) {
          saved.last = saved;
        }
        scrut2 = handleEffect$cap.cur$0.contTrace.lastHandler === handlerFrame;
        if (scrut2 === true) {
          saved.lastHandler = saved;
        }
        handleEffect$cap.cur$0.contTrace.last = handlerFrame;
        handleEffect$cap.cur$0.contTrace.lastHandler = handlerFrame;
        handlerFrame.next = null;
        handlerFrame.nextHandler = null;
        Runtime.curEffect = null;
        old = Runtime.stackDepth;
        try {
          tmp2 = Runtime.stackDepth + 2;
          Runtime.stackDepth = tmp2;
          lambda$here = lambda$6(handleEffect$cap, ShadowStackImpl);
          tmp3 = runtime.safeCall(RuntimeJS.try_catch(lambda$here, ShadowStackImpl.checkUnhandledErr));
          tmp1 = tmp3;
        } finally {
          Runtime.stackDepth = old;
        }
        scrut3 = Runtime.curEffect !== null;
        if (scrut3 === true) {
          handleEffect$cap.cur$0 = Runtime.curEffect;
          ShadowStackImpl.concatTraces(saved, handleEffect$cap.cur$0.contTrace);
          return handleEffect$cap.cur$0
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
        let savedResumeFrames, resumeContTrace$cap;
        resumeContTrace$cap = new Capture$resumeContTrace1(value);
        savedResumeFrames = Runtime.curContTrace;
        Runtime.curContTrace = contTrace;
        lbl: while (true) {
          let scrut, curFrame, old, scrut1, scrut2, tmp1, tmp2, tmp3, lambda$here, lambda$here1;
          scrut = contTrace.next;
          if (scrut instanceof Runtime.FunctionContFrame.class) {
            curFrame = contTrace.next;
            Runtime.curEffect = null;
            old = Runtime.stackDepth;
            try {
              tmp2 = Runtime.stackDepth + 3;
              Runtime.stackDepth = tmp2;
              lambda$here = lambda$8(resumeContTrace$cap, curFrame);
              lambda$here1 = lambda$7(ShadowStackImpl);
              tmp3 = runtime.safeCall(RuntimeJS.try_catch(lambda$here, lambda$here1));
              tmp1 = tmp3;
            } finally {
              Runtime.stackDepth = old;
            }
            resumeContTrace$cap.value$0 = tmp1;
            scrut1 = Runtime.curEffect !== null;
            if (scrut1 === true) {
              resumeContTrace$cap.value$0 = Runtime.curEffect;
            }
            if (resumeContTrace$cap.value$0 instanceof Runtime.EffectSig.class) {
              contTrace = Runtime.curEffect.contTrace;
              contTrace.resumed = false;
              contTrace.last.next = savedResumeFrames.next;
              contTrace.lastHandler.nextHandler = savedResumeFrames.nextHandler;
              ShadowStackImpl.concatTraces(savedResumeFrames, contTrace);
              throw Runtime.ShadowStackMarker("resume")
            }
            continue lbl;
          }
          scrut2 = contTrace.nextHandler;
          if (scrut2 instanceof Runtime.HandlerContFrame.class) {
            ShadowStackImpl.popHandler(contTrace);
            continue lbl
          }
          Runtime.curContTrace = savedResumeFrames;
          return resumeContTrace$cap.value$0;
        }
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["class", "ShadowStackImpl"];
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
        lambda$here = lambda$9(Runtime);
        return Runtime.mkEffect(this, lambda$here)
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["object", "StackDelayHandler"];
    });
    Runtime.runStackSafeGenerator = RuntimeJS.runStackSafeGenerator;
    Runtime.checkDepthGenerator = RuntimeJS.checkDepthGenerator;
    Runtime.GeneratorStackSafety = RuntimeJS.GeneratorStackSafety;
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
    return runtime.Unit
  }
  static raisePrintStackEffect(showLocals) {
    return Runtime.mkEffect(Runtime.PrintStackEffect, showLocals)
  }
  static topLevelEffect(debug) {
    let v, tmp, tmp1, scope39$cap;
    scope39$cap = new Capture$scope391(undefined);
    scope39$cap.tr$0 = Runtime.curEffect;
    v = null;
    lbl: while (true) {
      let scrut, tmp2;
      if (scope39$cap.tr$0 instanceof Runtime.EffectSig.class) {
        scrut = scope39$cap.tr$0.handler === Runtime.PrintStackEffect;
        if (scrut === true) {
          let inlinedVal;
          tmp2 = Runtime.showStackTrace("Stack Trace:", scope39$cap.tr$0, debug, scope39$cap.tr$0.handlerFun);
          runtime.safeCall(globalThis.console.log(tmp2));
          Runtime.curEffect = null;
          inlinedVal = Runtime.resume(scope39$cap.tr$0.contTrace)(runtime.Unit);
          v = inlinedVal;
          scope39$cap.tr$0 = Runtime.curEffect;
          continue lbl
        }
      }
      break;
    }
    if (scope39$cap.tr$0 instanceof Runtime.EffectSig.class) {
      Runtime.curEffect = null;
      tmp = "Error: Unhandled effect " + scope39$cap.tr$0.handler.constructor.name;
      tmp1 = Runtime.showStackTrace(tmp, scope39$cap.tr$0, debug, false);
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
  static showFunctionContChain(cont, hl, vis, reps) {
    let scrut, scrut1, scrut2, tmp, tmp1, tmp2, tmp3, tmp4, scope46$cap, lambda$here;
    scope46$cap = new Capture$scope461(undefined);
    if (cont instanceof Runtime.FunctionContFrame.class) {
      tmp = cont.constructor.name + "(pc=";
      scope46$cap.result$0 = tmp + cont.saved.at(1);
      lambda$here = lambda$10(scope46$cap, cont);
      runtime.safeCall(hl.forEach(lambda$here));
      scrut = runtime.safeCall(vis.has(cont));
      if (scrut === true) {
        tmp1 = reps + 1;
        reps = tmp1;
        scrut1 = tmp1 > 10;
        if (scrut1 === true) {
          throw runtime.safeCall(globalThis.Error("10 repeated continuation frame (loop?)"))
        }
        tmp2 = scope46$cap.result$0 + ", REPEAT";
        scope46$cap.result$0 = tmp2;
      } else {
        runtime.safeCall(vis.add(cont));
      }
      tmp3 = scope46$cap.result$0 + ") -> ";
      tmp4 = Runtime.showFunctionContChain(cont.next, hl, vis, reps);
      return tmp3 + tmp4
    }
    scrut2 = cont === null;
    if (scrut2 === true) {
      return "(null)"
    }
    return "(NOT CONT)";
  }
  static showHandlerContChain(cont, hl, vis, reps) {
    let scrut, scrut1, scrut2, tmp, tmp1, tmp2, tmp3, scope48$cap, lambda$here;
    scope48$cap = new Capture$scope481(undefined);
    if (cont instanceof Runtime.HandlerContFrame.class) {
      scope48$cap.result$0 = cont.handler.constructor.name;
      lambda$here = lambda$11(scope48$cap, cont);
      runtime.safeCall(hl.forEach(lambda$here));
      scrut = runtime.safeCall(vis.has(cont));
      if (scrut === true) {
        tmp = reps + 1;
        reps = tmp;
        scrut1 = tmp > 10;
        if (scrut1 === true) {
          throw runtime.safeCall(globalThis.Error("10 repeated continuation frame (loop?)"))
        }
        tmp1 = scope48$cap.result$0 + ", REPEAT";
        scope48$cap.result$0 = tmp1;
      } else {
        runtime.safeCall(vis.add(cont));
      }
      tmp2 = scope48$cap.result$0 + " -> ";
      tmp3 = Runtime.showFunctionContChain(cont.next, hl, vis, reps);
      return tmp2 + tmp3
    }
    scrut2 = cont === null;
    if (scrut2 === true) {
      return "(null)"
    }
    return "(NOT HANDLER CONT)";
  }
  static debugCont(cont) {
    let tmp, tmp1, tmp2;
    tmp = globalThis.Object.freeze(new globalThis.Map());
    tmp1 = globalThis.Object.freeze(new globalThis.Set());
    tmp2 = Runtime.showFunctionContChain(cont, tmp, tmp1, 0);
    return runtime.safeCall(globalThis.console.log(tmp2))
  }
  static debugHandler(cont) {
    let tmp, tmp1, tmp2;
    tmp = globalThis.Object.freeze(new globalThis.Map());
    tmp1 = globalThis.Object.freeze(new globalThis.Set());
    tmp2 = Runtime.showHandlerContChain(cont, tmp, tmp1, 0);
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
    let scrut, handlerFrame, saved, scrut1, scrut2, old, scrut3, scrut4, scrut5, scrut6, tmp, tmp1, handleEffect$cap, scope60$cap;
    handleEffect$cap = new Capture$handleEffect3(cur);
    scope60$cap = new Capture$scope601(undefined);
    scope60$cap.prevHandlerFrame$0 = handleEffect$cap.cur$0.contTrace;
    lbl: while (true) {
      let scrut7, scrut8;
      scrut7 = scope60$cap.prevHandlerFrame$0.nextHandler !== null;
      if (scrut7 === true) {
        scrut8 = scope60$cap.prevHandlerFrame$0.nextHandler.handler !== handleEffect$cap.cur$0.handler;
        if (scrut8 === true) {
          scope60$cap.prevHandlerFrame$0 = scope60$cap.prevHandlerFrame$0.nextHandler;
          continue lbl
        }
      }
      break;
    }
    scrut = scope60$cap.prevHandlerFrame$0.nextHandler === null;
    if (scrut === true) {
      return handleEffect$cap.cur$0
    }
    handlerFrame = scope60$cap.prevHandlerFrame$0.nextHandler;
    saved = new Runtime.ContTrace.class(handlerFrame.next, handleEffect$cap.cur$0.contTrace.last, handlerFrame.nextHandler, handleEffect$cap.cur$0.contTrace.lastHandler, false);
    scrut1 = handleEffect$cap.cur$0.contTrace.last === handlerFrame;
    if (scrut1 === true) {
      saved.last = saved;
    }
    scrut2 = handleEffect$cap.cur$0.contTrace.lastHandler === handlerFrame;
    if (scrut2 === true) {
      saved.lastHandler = saved;
    }
    handleEffect$cap.cur$0.contTrace.last = handlerFrame;
    handleEffect$cap.cur$0.contTrace.lastHandler = handlerFrame;
    handlerFrame.next = null;
    handlerFrame.nextHandler = null;
    Runtime.curEffect = null;
    old = Runtime.stackDepth;
    try {
      {
        let inlinedVal, tmp2;
        tmp1 = Runtime.stackDepth + 2;
        Runtime.stackDepth = tmp1;
        tmp2 = Runtime.resume(handleEffect$cap.cur$0.contTrace);
        inlinedVal = runtime.safeCall(handleEffect$cap.cur$0.handlerFun(tmp2));
        tmp = inlinedVal;
      }
    } finally {
      Runtime.stackDepth = old;
    }
    scrut3 = Runtime.curEffect !== null;
    if (scrut3 === true) {
      handleEffect$cap.cur$0 = Runtime.curEffect;
      scrut4 = saved.next !== null;
      if (scrut4 === true) {
        handleEffect$cap.cur$0.contTrace.last.next = saved.next;
      }
      scrut5 = saved.last !== saved;
      if (scrut5 === true) {
        handleEffect$cap.cur$0.contTrace.last = saved.last;
      }
      scrut6 = saved.nextHandler !== null;
      if (scrut6 === true) {
        handleEffect$cap.cur$0.contTrace.lastHandler.nextHandler = saved.nextHandler;
        handleEffect$cap.cur$0.contTrace.lastHandler = saved.lastHandler;
        return handleEffect$cap.cur$0
      }
      return handleEffect$cap.cur$0;
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
    let cont, handlerCont;
    cont = contTrace.next;
    handlerCont = contTrace.nextHandler;
    lbl: while (true) {
      let old, scrut, scrut1, scrut2, tmp, tmp1, tmp2, tmp3, tmp4;
      tmp = cont !== null;
      if (tmp === true) {
        tmp1 = cont.isContCls;
        if (tmp1 === true) {
          Runtime.curEffect = null;
          old = Runtime.stackDepth;
          try {
            tmp3 = Runtime.stackDepth + 3;
            Runtime.stackDepth = tmp3;
            tmp4 = runtime.safeCall(cont.resume(value));
            tmp2 = tmp4;
          } finally {
            Runtime.stackDepth = old;
          }
          value = tmp2;
          scrut = Runtime.curEffect !== null;
          if (scrut === true) {
            value = Runtime.curEffect;
          }
          if (value instanceof Runtime.EffectSig.class) {
            value.contTrace.last.next = cont.next;
            value.contTrace.lastHandler.nextHandler = handlerCont;
            scrut1 = contTrace.last !== cont;
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
          cont = cont.next;
          continue lbl;
        }
        if (handlerCont instanceof Runtime.HandlerContFrame.class) {
          cont = handlerCont.next;
          handlerCont = handlerCont.nextHandler;
          continue lbl
        }
        return value;
      }
      if (handlerCont instanceof Runtime.HandlerContFrame.class) {
        cont = handlerCont.next;
        handlerCont = handlerCont.nextHandler;
        continue lbl
      }
      return value;
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
  static await(promise) {
    let lambda$here;
    lambda$here = lambda$12(Runtime, promise);
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
            throw globalThis.Object.freeze(new globalThis.Error("Effect crossed through stack safe boundary"))
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
export { lambda$ as _$_modulePrivate_$_lambda$ };
export { lambda$1 as _$_modulePrivate_$_lambda$1 };
export { lambda$2 as _$_modulePrivate_$_lambda$2 };
export { lambda$3 as _$_modulePrivate_$_lambda$3 };
export { lambda$4 as _$_modulePrivate_$_lambda$4 };
export { Capture$handleEffect2 as _$_modulePrivate_$_Capture$handleEffect };
export { lambda$5 as _$_modulePrivate_$_lambda$5 };
export { lambda$6 as _$_modulePrivate_$_lambda$6 };
export { Capture$resumeContTrace1 as _$_modulePrivate_$_Capture$resumeContTrace };
export { lambda$7 as _$_modulePrivate_$_lambda$7 };
export { lambda$8 as _$_modulePrivate_$_lambda$8 };
export { lambda$9 as _$_modulePrivate_$_lambda$9 };
export { Capture$scope391 as _$_modulePrivate_$_Capture$scope39 };
export { Capture$scope461 as _$_modulePrivate_$_Capture$scope46 };
export { lambda$10 as _$_modulePrivate_$_lambda$10 };
export { Capture$scope481 as _$_modulePrivate_$_Capture$scope48 };
export { lambda$11 as _$_modulePrivate_$_lambda$11 };
export { Capture$handleEffect3 as _$_modulePrivate_$_Capture$handleEffect1 };
export { Capture$scope601 as _$_modulePrivate_$_Capture$scope60 };
export { lambda$12 as _$_modulePrivate_$_lambda$12 };
export { continuation$ as _$_modulePrivate_$_continuation$ };
let Runtime = Runtime1; export default Runtime;
