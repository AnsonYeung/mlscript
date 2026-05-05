const definitionMetadata = globalThis.Symbol.for("mlscript.definitionMetadata");
const prettyPrint = globalThis.Symbol.for("mlscript.prettyPrint");
import runtime from "./Runtime.mjs";
import RuntimeJS from "./RuntimeJS.mjs";
import Rendering from "./Rendering.mjs";
import LazyArray from "./LazyArray.mjs";
import Iter from "./Iter.mjs";
let Runtime1;
let staticInitAwaiter;
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
    staticInitAwaiter = (async () => {
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
        async toString() {
          return "()"
        }
        [prettyPrint]() { return this.toString(); }
        static [definitionMetadata] = ["object", "Unit"]; 
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
      this.short_and = RuntimeJS.short_and;
      this.short_or = RuntimeJS.short_or;
      this.bitand = RuntimeJS.bitand;
      this.bitnot = RuntimeJS.bitnot;
      this.bitor = RuntimeJS.bitor;
      this.shl = RuntimeJS.shl;
      this.try_catch = RuntimeJS.try_catch;
      this.EffectHandle = function EffectHandle(_reified) {
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
        async resumeWith(value) {
          let lambda;
          const this$EffectHandle = this;
          lambda = (undefined, async function () {
            let tmp1;
            tmp1 = await Runtime.resume(this$EffectHandle.reified.contTrace);
            return await runtime.safeCall(await tmp1(value))
          });
          return await Runtime1.try(lambda)
        } 
        async raise() {
          Runtime.curEffect = this.reified;
          return runtime.Unit
        }
        toString() { return runtime.render(this); }
        static [definitionMetadata] = ["class", "EffectHandle", [null]]; 
      });
      this.MatchSuccess = function MatchSuccess(output, bindings) {
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
      this.MatchFailure = function MatchFailure(errors) {
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
      let staticInitAwaiter1;
      (class Tuple {
        static {
          Runtime.Tuple = this
        }
        static {
          staticInitAwaiter1 = (async () => {
            this.split = LazyArray.__split;
          })();
        }
        static async slice(xs, i, j) {
          let tmp1;
          tmp1 = xs.length - j;
          return await runtime.safeCall(await xs.slice(i, tmp1))
        } 
        static async lazySlice(xs, i, j) {
          let tmp1;
          tmp1 = await runtime.safeCall(await LazyArray.dropLeftRight(i, j));
          return await runtime.safeCall(await tmp1(xs))
        } 
        static async lazyConcat(...args) {
          return await runtime.safeCall(await LazyArray.__concat(...args))
        } 
        static async get(xs, i) {
          let scrut, scrut1, tmp1;
          scrut = i >= xs.length;
          if (scrut === true) {
            throw await runtime.safeCall(await globalThis.RangeError("Tuple.get: index out of bounds"))
          }
          tmp1 = - xs.length;
          scrut1 = i < tmp1;
          if (scrut1 === true) {
            throw await runtime.safeCall(await globalThis.RangeError("Tuple.get: negative index out of bounds"))
          }
          return xs.at(i);
        } 
        static async isArrayLike(xs) {
          return await runtime.safeCall(await Iter.isArrayLike(xs))
        }
        toString() { return runtime.render(this); }
        static [definitionMetadata] = ["class", "Tuple"]; 
      });
      (class Str {
        static {
          Runtime.Str = this
        }
        static async startsWith(string, prefix) {
          return await runtime.safeCall(await string.startsWith(prefix))
        } 
        static async get(string, i) {
          let scrut;
          scrut = i >= string.length;
          if (scrut === true) {
            throw await runtime.safeCall(await globalThis.RangeError("Str.get: index out of bounds"))
          }
          return await runtime.safeCall(await string.at(i));
        } 
        static async take(string, n) {
          return await runtime.safeCall(await string.slice(0, n))
        } 
        static async leave(string, n) {
          return await runtime.safeCall(await string.slice(n))
        }
        toString() { return runtime.render(this); }
        static [definitionMetadata] = ["class", "Str"]; 
      });
      this.render = Rendering.render;
      let staticInitAwaiter2;
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
          staticInitAwaiter2 = (async () => {
            this.enabled = false;
            this.indentLvl = 0;
          })();
        }
        static async indent() {
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
        static async resetIndent(n) {
          let scrut;
          scrut = TraceLogger.enabled;
          if (scrut === true) {
            TraceLogger.indentLvl = n;
            return runtime.Unit
          }
          return runtime.Unit;
        } 
        static async log(msg) {
          let scrut, tmp1, tmp2, tmp3, tmp4, tmp5;
          scrut = TraceLogger.enabled;
          if (scrut === true) {
            tmp1 = await runtime.safeCall(await "| ".repeat(TraceLogger.indentLvl));
            tmp2 = await runtime.safeCall(await "  ".repeat(TraceLogger.indentLvl));
            tmp3 = "\n" + tmp2;
            tmp4 = await runtime.safeCall(await msg.replaceAll("\n", tmp3));
            tmp5 = tmp1 + tmp4;
            return await runtime.safeCall(await globalThis.console.log(tmp5))
          }
          return runtime.Unit;
        }
        toString() { return runtime.render(this); }
        static [definitionMetadata] = ["class", "TraceLogger"]; 
      });
      this.curEffect = null;
      this.resumeValue = null;
      this.resumeArr = null;
      this.resumeIdx = null;
      tmp = - 1;
      this.resumePc = tmp;
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
      this.FunctionContFrame = function FunctionContFrame(next, saved) {
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
        async resume(value) {
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
            await runtime.safeCall(await globalThis.console.log("cannot resume getters"));
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
              tmp11 = await runtime.safeCall(await this.saved.slice(tmp8, tmp10));
              tmp12 = await runtime.safeCall(await f.apply(this.saved.at(4), tmp11));
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
          tmp6 = await runtime.safeCall(await this.saved.slice(tmp3, tmp5));
          return await runtime.safeCall(await f.apply(this.saved.at(4), tmp6))
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
        static [definitionMetadata] = ["class", "FunctionContFrame", ["next", "saved"]]; 
      });
      this.HandlerContFrame = function HandlerContFrame(next, nextHandler, handler) {
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
      this.ContTrace = function ContTrace(next, last, nextHandler, lastHandler, resumed) {
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
      this.EffectSig = function EffectSig(contTrace, handler, handlerFun) {
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
      this.FnLocalsInfo = function FnLocalsInfo(fnName, locals) {
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
      this.LocalVarInfo = function LocalVarInfo(localName, value) {
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
      this.CustomStackError = function CustomStackError(stack) {
        return globalThis.Object.freeze(new CustomStackError.class(stack));
      };
      (class CustomStackError {
        static {
          Runtime.CustomStackError.class = this
        }
        constructor(stack) {
          this.stack = stack;
        }
        async toString() {
          return this.stack
        }
        [prettyPrint]() { return this.toString(); }
        static [definitionMetadata] = ["class", "CustomStackError", ["stack"]]; 
      });
      this.stackLimit = 0;
      this.stackDepth = 0;
      this.stackHandler = null;
      this.stackResume = null;
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
        async delay() {
          let lambda;
          lambda = (undefined, async function (k) {
            Runtime.stackResume = k;
            return runtime.Unit
          });
          return await Runtime.mkEffect(this, lambda)
        }
        toString() { return runtime.render(this); }
        static [definitionMetadata] = ["object", "StackDelayHandler"]; 
      });
      this.Int31 = function Int31(v) {
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
        async zext() {
          let tmp1, tmp2;
          tmp1 = await runtime.safeCall(await Runtime.shl(1, 31));
          tmp2 = await runtime.safeCall(await Runtime.bitnot(tmp1));
          return await runtime.safeCall(await Runtime.bitand(this.#v, tmp2))
        } 
        async sext() {
          let tmp1;
          tmp1 = await runtime.safeCall(await Runtime.shl(1, 31));
          return await runtime.safeCall(await Runtime.bitor(this.#v, tmp1))
        }
        toString() { return runtime.render(this); }
        static [definitionMetadata] = ["class", "Int31", [null]]; 
      });
      await staticInitAwaiter2;
      await staticInitAwaiter1;
    })();
  }
  static get unreachable() {
    throw runtime.safeCall(globalThis.Error("unreachable"));
  } 
  static async assertFail(file, line) {
    let tmp, tmp1, tmp2, tmp3;
    tmp = "Assertion failed (" + file;
    tmp1 = tmp + ":";
    tmp2 = tmp1 + line;
    tmp3 = tmp2 + ")";
    throw await runtime.safeCall(await globalThis.Error(tmp3))
  } 
  static async checkArgs(functionName, expected, isUB, got) {
    let scrut, name, scrut1, scrut2, tmp, tmp1, tmp2, tmp3, tmp4, tmp5, tmp6, tmp7, tmp8, tmp9, tmp10, tmp11, tmp12, tmp13, tmp14;
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
    scrut = tmp1;
    if (scrut === true) {
      scrut1 = functionName.length > 0;
      if (scrut1 === true) {
        tmp3 = " '" + functionName;
        tmp4 = tmp3 + "'";
      } else {
        tmp4 = "";
      }
      name = tmp4;
      tmp5 = "Function" + name;
      tmp6 = tmp5 + " expected ";
      if (isUB === true) {
        tmp7 = "";
      } else {
        tmp7 = "at least ";
      }
      tmp8 = tmp6 + tmp7;
      tmp9 = tmp8 + expected;
      tmp10 = tmp9 + " argument";
      scrut2 = expected === 1;
      if (scrut2 === true) {
        tmp11 = "";
      } else {
        tmp11 = "s";
      }
      tmp12 = tmp10 + tmp11;
      tmp13 = tmp12 + " but got ";
      tmp14 = tmp13 + got;
      throw await runtime.safeCall(await globalThis.Error(tmp14))
    }
    return runtime.Unit;
  } 
  static async safeCall(x) {
    if (x === undefined) {
      return runtime.Unit
    }
    return x;
  } 
  static async checkCall(x) {
    if (x === undefined) {
      throw await runtime.safeCall(await globalThis.Error("MLscript call unexpectedly returned `undefined`, the forbidden value."))
    }
    return x;
  } 
  static async deboundMethod(mtdName, clsName) {
    let tmp, tmp1, tmp2, tmp3;
    tmp = "[debinding error] Method '" + mtdName;
    tmp1 = tmp + "' of class '";
    tmp2 = tmp1 + clsName;
    tmp3 = tmp2 + "' was accessed without being called.";
    throw await runtime.safeCall(await globalThis.Error(tmp3))
  } 
  static async try(f) {
    let res, scrut, tmp;
    res = await runtime.safeCall(await f());
    scrut = Runtime.curEffect !== null;
    if (scrut === true) {
      tmp = Runtime.curEffect;
      Runtime.curEffect = null;
      return await Runtime.EffectHandle(tmp)
    }
    return res;
  } 
  static async printRaw(x) {
    let rcd, tmp;
    rcd = globalThis.Object.freeze({
      indent: 2,
      breakLength: 76
    });
    tmp = await runtime.safeCall(await Runtime.render(x, rcd));
    return await runtime.safeCall(await globalThis.console.log(tmp))
  } 
  static async resetEffects() {
    let tmp;
    Runtime.curEffect = null;
    tmp = - 1;
    Runtime.resumePc = tmp;
    return runtime.Unit
  } 
  static async raisePrintStackEffect(showLocals) {
    return await Runtime.mkEffect(Runtime.PrintStackEffect, showLocals)
  } 
  static async topLevelEffect(debug) {
    let tr, v, tmp, tmp1;
    tr = Runtime.curEffect;
    v = null;
    lbl: while (true) {
      let scrut, tmp2, tmp3, tmp4;
      if (tr instanceof Runtime.EffectSig.class) {
        scrut = tr.handler === Runtime.PrintStackEffect;
        if (scrut === true) {
          tmp2 = await Runtime.showStackTrace("Stack Trace:", tr, debug, tr.handlerFun);
          await runtime.safeCall(await globalThis.console.log(tmp2));
          Runtime.curEffect = null;
          tmp3 = await Runtime.resume(tr.contTrace);
          tmp4 = await runtime.safeCall(await tmp3(runtime.Unit));
          v = tmp4;
          tr = Runtime.curEffect;
          continue lbl
        }
      }
      break;
    }
    if (tr instanceof Runtime.EffectSig.class) {
      Runtime.curEffect = null;
      tmp = "Error: Unhandled effect " + tr.handler.constructor.name;
      tmp1 = await Runtime.showStackTrace(tmp, tr, debug, false);
      throw await Runtime.CustomStackError(tmp1)
    }
    return v;
  } 
  static async illegalEffect(position) {
    let tmp, tmp1, tmp2, tmp3, tmp4;
    tmp = Runtime.curEffect;
    Runtime.curEffect = null;
    tmp1 = "Error: Effect " + tmp.handler.constructor.name;
    tmp2 = tmp1 + " is raised ";
    tmp3 = tmp2 + position;
    tmp4 = await Runtime.showStackTrace(tmp3, tmp, false, false);
    throw await Runtime.CustomStackError(tmp4)
  } 
  static async showStackTrace(header, tr, debug, showLocals) {
    let msg, curHandler, atTail, tmp;
    msg = header;
    curHandler = tr.contTrace;
    atTail = true;
    if (debug === true) {
      lbl: while (true) {
        let scrut, cur, scrut1, tmp1, tmp2;
        scrut = curHandler !== null;
        if (scrut === true) {
          cur = curHandler.next;
          lbl1: while (true) {
            let scrut2, curLocals, loc, localsMsg, scrut3, lambda, tmp3, tmp4, tmp5, tmp6, tmp7, tmp8, tmp9, tmp10, tmp11;
            scrut2 = cur !== null;
            if (scrut2 === true) {
              curLocals = cur.getLocals;
              loc = cur.getLoc;
              if (showLocals === true) {
                scrut3 = curLocals.length > 0;
                if (scrut3 === true) {
                  lambda = (undefined, async function (l) {
                    let tmp12, tmp13;
                    tmp12 = l.localName + "=";
                    tmp13 = await Rendering.render(l.value);
                    return tmp12 + tmp13
                  });
                  tmp3 = await runtime.safeCall(await curLocals.map(lambda));
                  tmp4 = await runtime.safeCall(await tmp3.join(", "));
                  tmp5 = " with locals: " + tmp4;
                } else {
                  tmp5 = "";
                }
              } else {
                tmp5 = "";
              }
              localsMsg = tmp5;
              tmp6 = "\n\tat " + cur.getNme;
              tmp7 = tmp6 + " (";
              tmp8 = tmp7 + loc;
              tmp9 = tmp8 + ")";
              tmp10 = msg + tmp9;
              msg = tmp10;
              tmp11 = msg + localsMsg;
              msg = tmp11;
              cur = cur.next;
              atTail = false;
              continue lbl1
            }
            break;
          }
          curHandler = curHandler.nextHandler;
          scrut1 = curHandler !== null;
          if (scrut1 === true) {
            tmp1 = "\n\twith handler " + curHandler.handler.constructor.name;
            tmp2 = msg + tmp1;
            msg = tmp2;
            atTail = false;
            continue lbl
          }
          continue lbl;
        }
        break;
      }
      if (atTail === true) {
        tmp = msg + "\n\tat tail position";
        msg = tmp;
        return msg
      }
      return msg;
    }
    return msg;
  } 
  static async showFunctionContChain(cont, hl, vis, reps) {
    let result, scrut, scrut1, scrut2, tmp, lambda, tmp1, tmp2, tmp3, tmp4;
    if (cont instanceof Runtime.FunctionContFrame.class) {
      tmp = cont.constructor.name + "(pc=";
      result = tmp + cont.saved.at(1);
      lambda = (undefined, async function (m, marker) {
        let scrut3, tmp5, tmp6;
        scrut3 = await runtime.safeCall(await m.has(cont));
        if (scrut3 === true) {
          tmp5 = ", " + marker;
          tmp6 = result + tmp5;
          result = tmp6;
          return runtime.Unit
        }
        return runtime.Unit;
      });
      await runtime.safeCall(await hl.forEach(lambda));
      scrut = await runtime.safeCall(await vis.has(cont));
      if (scrut === true) {
        tmp1 = reps + 1;
        reps = tmp1;
        scrut1 = reps > 10;
        if (scrut1 === true) {
          throw await runtime.safeCall(await globalThis.Error("10 repeated continuation frame (loop?)"))
        }
        tmp2 = result + ", REPEAT";
        result = tmp2;
      } else {
        await runtime.safeCall(await vis.add(cont));
      }
      tmp3 = result + ") -> ";
      tmp4 = await Runtime.showFunctionContChain(cont.next, hl, vis, reps);
      return tmp3 + tmp4
    }
    scrut2 = cont === null;
    if (scrut2 === true) {
      return "(null)"
    }
    return "(NOT CONT)";
  } 
  static async showHandlerContChain(cont, hl, vis, reps) {
    let result, scrut, scrut1, scrut2, lambda, tmp, tmp1, tmp2, tmp3;
    if (cont instanceof Runtime.HandlerContFrame.class) {
      result = cont.handler.constructor.name;
      lambda = (undefined, async function (m, marker) {
        let scrut3, tmp4, tmp5;
        scrut3 = await runtime.safeCall(await m.has(cont));
        if (scrut3 === true) {
          tmp4 = ", " + marker;
          tmp5 = result + tmp4;
          result = tmp5;
          return runtime.Unit
        }
        return runtime.Unit;
      });
      await runtime.safeCall(await hl.forEach(lambda));
      scrut = await runtime.safeCall(await vis.has(cont));
      if (scrut === true) {
        tmp = reps + 1;
        reps = tmp;
        scrut1 = reps > 10;
        if (scrut1 === true) {
          throw await runtime.safeCall(await globalThis.Error("10 repeated continuation frame (loop?)"))
        }
        tmp1 = result + ", REPEAT";
        result = tmp1;
      } else {
        await runtime.safeCall(await vis.add(cont));
      }
      tmp2 = result + " -> ";
      tmp3 = await Runtime.showFunctionContChain(cont.next, hl, vis, reps);
      return tmp2 + tmp3
    }
    scrut2 = cont === null;
    if (scrut2 === true) {
      return "(null)"
    }
    return "(NOT HANDLER CONT)";
  } 
  static async debugCont(cont) {
    let tmp, tmp1, tmp2;
    tmp = globalThis.Object.freeze(new globalThis.Map());
    tmp1 = globalThis.Object.freeze(new globalThis.Set());
    tmp2 = await Runtime.showFunctionContChain(cont, tmp, tmp1, 0);
    return await runtime.safeCall(await globalThis.console.log(tmp2))
  } 
  static async debugHandler(cont) {
    let tmp, tmp1, tmp2;
    tmp = globalThis.Object.freeze(new globalThis.Map());
    tmp1 = globalThis.Object.freeze(new globalThis.Set());
    tmp2 = await Runtime.showHandlerContChain(cont, tmp, tmp1, 0);
    return await runtime.safeCall(await globalThis.console.log(tmp2))
  } 
  static async debugContTrace(contTrace) {
    let scrut, scrut1, vis, hl, cur, tmp, tmp1, tmp2, tmp3, tmp4;
    if (contTrace instanceof Runtime.ContTrace.class) {
      await runtime.safeCall(await globalThis.console.log("resumed: ", contTrace.resumed));
      scrut = contTrace.last === contTrace;
      if (scrut === true) {
        await runtime.safeCall(await globalThis.console.log("<last is self>"));
      }
      scrut1 = contTrace.lastHandler === contTrace;
      if (scrut1 === true) {
        await runtime.safeCall(await globalThis.console.log("<lastHandler is self>"));
      }
      vis = globalThis.Object.freeze(new globalThis.Set());
      hl = globalThis.Object.freeze(new globalThis.Map());
      tmp = globalThis.Object.freeze([
        contTrace.last
      ]);
      tmp1 = globalThis.Object.freeze(new globalThis.Set(tmp));
      await runtime.safeCall(await hl.set("last", tmp1));
      tmp2 = globalThis.Object.freeze([
        contTrace.lastHandler
      ]);
      tmp3 = globalThis.Object.freeze(new globalThis.Set(tmp2));
      await runtime.safeCall(await hl.set("last-handler", tmp3));
      tmp4 = await Runtime.showFunctionContChain(contTrace.next, hl, vis, 0);
      await runtime.safeCall(await globalThis.console.log(tmp4));
      cur = contTrace.nextHandler;
      lbl: while (true) {
        let scrut2, tmp5;
        scrut2 = cur !== null;
        if (scrut2 === true) {
          tmp5 = await Runtime.showHandlerContChain(cur, hl, vis, 0);
          await runtime.safeCall(await globalThis.console.log(tmp5));
          cur = cur.nextHandler;
          continue lbl
        }
        break;
      }
      return await runtime.safeCall(await globalThis.console.log())
    }
    await runtime.safeCall(await globalThis.console.log("Not a cont trace:"));
    return await runtime.safeCall(await globalThis.console.log(contTrace));
  } 
  static async debugEff(eff) {
    if (eff instanceof Runtime.EffectSig.class) {
      await runtime.safeCall(await globalThis.console.log("Debug EffectSig:"));
      await runtime.safeCall(await globalThis.console.log("handler: ", eff.handler.constructor.name));
      await runtime.safeCall(await globalThis.console.log("handlerFun: ", eff.handlerFun));
      return await Runtime.debugContTrace(eff.contTrace)
    }
    await runtime.safeCall(await globalThis.console.log("Not an effect:"));
    return await runtime.safeCall(await globalThis.console.log(eff));
  } 
  static async unwind(...saved) {
    let tmp;
    tmp = new Runtime.FunctionContFrame.class(null, saved);
    Runtime.curEffect.contTrace.last.next = tmp;
    Runtime.curEffect.contTrace.last = Runtime.curEffect.contTrace.last.next;
    return runtime.Unit
  } 
  static async mkEffect(handler, handlerFun) {
    let res, tmp;
    tmp = new Runtime.ContTrace.class(null, null, null, null, false);
    res = new Runtime.EffectSig.class(tmp, handler, handlerFun);
    res.contTrace.last = res.contTrace;
    res.contTrace.lastHandler = res.contTrace;
    Runtime.curEffect = res;
    return runtime.Unit
  } 
  static async handleBlockImpl(cur, handler) {
    let handlerFrame;
    handlerFrame = new Runtime.HandlerContFrame.class(null, null, handler);
    cur.contTrace.lastHandler.nextHandler = handlerFrame;
    cur.contTrace.lastHandler = handlerFrame;
    cur.contTrace.last = handlerFrame;
    return await Runtime.handleEffects(cur)
  } 
  static async enterHandleBlock(handler, body) {
    let tmp, scrut;
    tmp = await runtime.safeCall(await body());
    scrut = Runtime.curEffect === null;
    if (scrut === true) {
      return tmp
    }
    return await Runtime.handleBlockImpl(Runtime.curEffect, handler);
  } 
  static async handleEffects(cur) {
    lbl: while (true) {
      let nxt, scrut;
      if (cur instanceof Runtime.EffectSig.class) {
        nxt = await Runtime.handleEffect(cur);
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
  static async handleEffect(cur) {
    let prevHandlerFrame, scrut, handlerFrame, saved, tmp, old, scrut1, scrut2, scrut3, tmp1, tmp2, tmp3, tmp4;
    prevHandlerFrame = cur.contTrace;
    lbl: while (true) {
      let scrut4, scrut5;
      scrut4 = prevHandlerFrame.nextHandler !== null;
      if (scrut4 === true) {
        scrut5 = prevHandlerFrame.nextHandler.handler !== cur.handler;
        if (scrut5 === true) {
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
    cur.contTrace.last = handlerFrame;
    cur.contTrace.lastHandler = handlerFrame;
    handlerFrame.next = null;
    handlerFrame.nextHandler = null;
    Runtime.curEffect = null;
    old = Runtime.stackDepth;
    try {
      tmp2 = Runtime.stackDepth + 2;
      Runtime.stackDepth = tmp2;
      tmp3 = await Runtime.resume(cur.contTrace);
      tmp4 = await runtime.safeCall(await cur.handlerFun(tmp3));
      tmp1 = tmp4;
    } finally {
      Runtime.stackDepth = old;
    }
    tmp = tmp1;
    scrut1 = Runtime.curEffect !== null;
    if (scrut1 === true) {
      cur = Runtime.curEffect;
      scrut2 = saved.next !== null;
      if (scrut2 === true) {
        cur.contTrace.last.next = saved.next;
        cur.contTrace.last = saved.last;
      }
      scrut3 = saved.nextHandler !== null;
      if (scrut3 === true) {
        cur.contTrace.lastHandler.nextHandler = saved.nextHandler;
        cur.contTrace.lastHandler = saved.lastHandler;
        return cur
      }
      return cur;
    }
    return await Runtime.resumeContTrace(saved, tmp);
  } 
  static async resume(contTrace) {
    return async (value) => {
      let scrut, tmp;
      scrut = contTrace.resumed;
      if (scrut === true) {
        throw await runtime.safeCall(await globalThis.Error("Multiple resumption"))
      }
      contTrace.resumed = true;
      tmp = await Runtime.resumeContTrace(contTrace, value);
      return await Runtime.handleEffects(tmp);
    }
  } 
  static async resumeContTrace(contTrace, value) {
    let cont, handlerCont;
    cont = contTrace.next;
    handlerCont = contTrace.nextHandler;
    lbl: while (true) {
      let old, scrut, scrut1, scrut2, tmp, tmp1, tmp2;
      if (cont instanceof Runtime.FunctionContFrame.class) {
        Runtime.curEffect = null;
        old = Runtime.stackDepth;
        try {
          tmp1 = Runtime.stackDepth + 3;
          Runtime.stackDepth = tmp1;
          tmp2 = await runtime.safeCall(await cont.resume(value));
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
  } 
  static async checkDepth() {
    let scrut, tmp, tmp1;
    tmp = Runtime.stackDepth >= Runtime.stackLimit;
    if (tmp === true) {
      tmp1 = Runtime.stackHandler !== null;
    } else {
      tmp1 = false;
    }
    scrut = tmp1;
    if (scrut === true) {
      return await runtime.safeCall(await Runtime.stackHandler.delay())
    }
    return runtime.Unit;
  } 
  static async runStackSafe(limit, f) {
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
          result = await Runtime.enterHandleBlock(Runtime.StackDelayHandler, f);
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
              tmp3 = await runtime.safeCall(await saved(runtime.Unit));
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
  static async plus_impl(lhs, rhs) {
    if (lhs instanceof Runtime.Int31.class) {
      if (rhs instanceof Runtime.Int31.class) {
        return lhs + rhs
      }
      return await Runtime.unreachable();
    }
    return await Runtime.unreachable();
  }
  toString() { return runtime.render(this); }
  static [definitionMetadata] = ["class", "Runtime"]; 
});
await staticInitAwaiter;
let Runtime = Runtime1; export default Runtime;
