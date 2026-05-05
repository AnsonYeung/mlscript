const definitionMetadata = globalThis.Symbol.for("mlscript.definitionMetadata");
const prettyPrint = globalThis.Symbol.for("mlscript.prettyPrint");
import runtime from "./Runtime.mjs";
import RuntimeJS from "./RuntimeJS.mjs";
import Runtime from "./Runtime.mjs";
import Rendering from "./Rendering.mjs";
import Term from "./Term.mjs";
let Predef1;
let staticInitAwaiter;
(class Predef {
  static {
    Predef1 = this
  }
  static {
    staticInitAwaiter = (async () => {
      (class Symbols {
        static {
          new this
        }
        constructor() {
          Predef.Symbols = this;
          this.prettyPrint = RuntimeJS.symbols.prettyPrint;
          this.definitionMetadata = RuntimeJS.symbols.definitionMetadata;
          Object.defineProperty(this, "class", {
            value: Symbols
          });
          globalThis.Object.freeze(this);
        }
        toString() { return runtime.render(this); }
        static [definitionMetadata] = ["object", "Symbols"]; 
      });
      (class Sub {
        static {
          Predef.Sub = this
        }
        toString() { return runtime.render(this); }
        static [definitionMetadata] = ["class", "Sub"]; 
      });
      (class Eq extends Predef.Sub {
        static {
          Predef.Eq = this
        }
        constructor() {
          super();
        }
        toString() { return runtime.render(this); }
        static [definitionMetadata] = ["class", "Eq"]; 
      });
      (class Refl extends Predef.Eq {
        static {
          new this
        }
        constructor() {
          super();
          Predef.Refl = this;
          Object.defineProperty(this, "class", {
            value: Refl
          });
          globalThis.Object.freeze(this);
        }
        async apply(x) {
          return x
        }
        toString() { return runtime.render(this); }
        static [definitionMetadata] = ["object", "Refl"]; 
      });
      this.pass1 = Rendering.pass1;
      this.pass2 = Rendering.pass2;
      this.pass3 = Rendering.pass3;
      this.passing = Rendering.passing;
      this.map = Rendering.map;
      this.fold = Rendering.fold;
      this.interleave = Rendering.interleave;
      this.render = Rendering.render;
      this.js_assert = globalThis.console["assert"];
      this.foldl = Predef.fold;
      (class meta {
        static {
          Predef.meta = this
        }
        static async codegen(t, file) {
          return await runtime.safeCall(await Term.codegen(t, file))
        } 
        static async print(t) {
          return await runtime.safeCall(await Term.print(t))
        }
        toString() { return runtime.render(this); }
        static [definitionMetadata] = ["class", "meta"]; 
      });
    })();
  }
  static async id(x) {
    return x
  } 
  static async apply(f, ...args) {
    return await runtime.safeCall(await f(...args))
  } 
  static async pipeInto(x, f) {
    return await runtime.safeCall(await f(x))
  } 
  static async pipeFrom(f, x) {
    return await runtime.safeCall(await f(x))
  } 
  static async pipeIntoHi(x, f) {
    return await runtime.safeCall(await f(x))
  } 
  static async pipeFromHi(f, x) {
    return await runtime.safeCall(await f(x))
  } 
  static async tap(x, f) {
    let tmp;
    tmp = await runtime.safeCall(await f(x));
    return (tmp , x)
  } 
  static async pat(f, x) {
    let tmp;
    tmp = await runtime.safeCall(await f(x));
    return (tmp , x)
  } 
  static async alsoDo(x, eff) {
    return x
  } 
  static async andThen(f, g) {
    return async (x) => {
      let tmp;
      tmp = await runtime.safeCall(await f(x));
      return await runtime.safeCall(await g(tmp))
    }
  } 
  static async compose(f, g) {
    return async (x) => {
      let tmp;
      tmp = await runtime.safeCall(await g(x));
      return await runtime.safeCall(await f(tmp))
    }
  } 
  static async passTo(receiver, f) {
    return async (...args) => {
      return await runtime.safeCall(await f(receiver, ...args))
    }
  } 
  static async passToLo(receiver, f) {
    return async (...args) => {
      return await runtime.safeCall(await f(receiver, ...args))
    }
  } 
  static async call(receiver, f) {
    return async (...args) => {
      return await runtime.safeCall(await f.call(receiver, ...args))
    }
  } 
  static async equals(a, b) {
    let scrut, scrut1, scrut2, ac, scrut3, md, scrut4, scrut5, scrut6, scrut7, scrut8, scrut9, scrut10, scrut11, lambda, lambda1, tmp, tmp1, tmp2;
    scrut = a === b;
    if (scrut === true) {
      return true
    }
    if (a instanceof globalThis.Array) {
      if (b instanceof globalThis.Array) {
        scrut1 = a.length === b.length;
        if (scrut1 === true) {
          lambda = (undefined, async function (a1, i) {
            let tmp3;
            tmp3 = await runtime.safeCall(await b.at(i));
            return await Predef.equals(a1, tmp3)
          });
          return await runtime.safeCall(await a.every(lambda))
        }
      }
    }
    scrut2 = a !== undefined;
    if (scrut2 === true) {
      scrut11 = a !== null;
      if (scrut11 === true) {
        scrut10 = b !== undefined;
        if (scrut10 === true) {
          scrut9 = b !== null;
          if (scrut9 === true) {
            ac = a.constructor;
            scrut3 = ac !== undefined;
            if (scrut3 === true) {
              scrut7 = ac === b.constructor;
              if (scrut7 === true) {
                md = ac[Predef.Symbols.definitionMetadata];
                scrut4 = md !== undefined;
                if (scrut4 === true) {
                  lambda1 = (undefined, async function (field) {
                    let scrut12, scrut13;
                    scrut12 = field !== null;
                    if (scrut12 === true) {
                      scrut13 = await Predef.equals(a[field], b[field]);
                      if (scrut13 === true) {
                        return true
                      }
                      return false;
                    }
                    return false;
                  });
                  scrut5 = await runtime.safeCall(await md[2].every(lambda1));
                  if (scrut5 === true) {
                    tmp = true;
                  } else {
                    tmp = false;
                  }
                } else {
                  tmp = false;
                }
                scrut6 = tmp;
                if (scrut6 === true) {
                  tmp1 = true;
                } else {
                  tmp1 = false;
                }
              } else {
                tmp1 = false;
              }
            } else {
              tmp1 = false;
            }
            scrut8 = tmp1;
            if (scrut8 === true) {
              tmp2 = true;
            } else {
              tmp2 = false;
            }
            return tmp2
          }
          tmp2 = false;
          return tmp2;
        }
        tmp2 = false;
        return tmp2;
      }
      tmp2 = false;
      return tmp2;
    }
    tmp2 = false;
    return tmp2;
  } 
  static async nequals(a, b) {
    let tmp;
    tmp = await Predef.equals(a, b);
    return ! tmp
  } 
  static async print(...xs) {
    let tmp, tmp1;
    tmp = await runtime.safeCall(await Predef.map(Predef.renderAsStr));
    tmp1 = await runtime.safeCall(await tmp(...xs));
    return await runtime.safeCall(await globalThis.console.log(...tmp1))
  } 
  static async renderAsStr(arg) {
    if (typeof arg === 'string') {
      return arg
    }
    return await runtime.safeCall(await Predef.render(arg));
  } 
  static async check(...args) {
    return await runtime.safeCall(await Predef.js_assert(...args))
  } 
  static async notImplemented(msg) {
    let tmp;
    tmp = "Not implemented: " + msg;
    throw await runtime.safeCall(await globalThis.Error(tmp))
  } 
  static get notImplementedError() {
    throw runtime.safeCall(globalThis.Error("Not implemented"));
  } 
  static async tuple(...xs) {
    return xs
  } 
  static async mkSet(...xs) {
    return globalThis.Object.freeze(new globalThis.Set(xs))
  } 
  static async foldr(f) {
    return async (first, ...rest) => {
      let len, scrut, i, init;
      len = rest.length;
      scrut = len === 0;
      if (scrut === true) {
        return first
      }
      i = len - 1;
      init = await runtime.safeCall(await rest.at(i));
      lbl: while (true) {
        let scrut1, tmp, tmp1, tmp2;
        scrut1 = i > 0;
        if (scrut1 === true) {
          tmp = i - 1;
          i = tmp;
          tmp1 = await runtime.safeCall(await rest.at(i));
          tmp2 = await runtime.safeCall(await f(tmp1, init));
          init = tmp2;
          continue lbl
        }
        break;
      }
      return await runtime.safeCall(await f(first, init));
    }
  } 
  static async mkStr(...xs) {
    let lambda, tmp;
    lambda = (undefined, async function (acc, x) {
      let tmp1, tmp2, tmp3;
      if (typeof x === 'string') {
        tmp1 = true;
      } else {
        tmp1 = false;
      }
      tmp2 = await Predef.check(tmp1);
      tmp3 = acc + x;
      return (tmp2 , tmp3)
    });
    tmp = await runtime.safeCall(await Predef.fold(lambda));
    return await runtime.safeCall(await tmp(...xs))
  } 
  static async use(instance) {
    return instance
  } 
  static async enterHandleBlock(handler, body) {
    return await runtime.safeCall(await Runtime.enterHandleBlock(handler, body))
  } 
  static async raiseUnhandledEffect() {
    return await runtime.safeCall(await Runtime.mkEffect(Runtime.FatalEffect, null))
  }
  toString() { return runtime.render(this); }
  static [definitionMetadata] = ["class", "Predef"]; 
});
await staticInitAwaiter;
let Predef = Predef1; export default Predef;
