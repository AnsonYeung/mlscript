const definitionMetadata = globalThis.Symbol.for("mlscript.definitionMetadata");
const prettyPrint = globalThis.Symbol.for("mlscript.prettyPrint");
import runtime from "./Runtime.mjs";
import RuntimeJS from "./RuntimeJS.mjs";
import Rendering from "./Rendering.mjs";
import Term from "./Term.mjs";
let Predef1, lambda, lambda1, lambda2, lambda$, lambda$1, lambda$2;
lambda$2 = (undefined, function (Predef2) {
  return (acc, x) => {
    let curDepth;
    runtime.checkDepth();
    if (runtime.curEffect === null) {
      curDepth = runtime.stackDepth + 1;
      runtime.stackDepth = curDepth;
      return lambda2(Predef2, acc, x)
    }
    return runtime.unwind(lambda$2, -1, null, null, null, 2, 1, Predef2, 2, acc, x, 0);
  }
});
lambda2 = (undefined, function (Predef2, acc, x) {
  let tmp, args, pc, curDepth;
  if (runtime.resumePc === -1) {
    pc = 0;
  } else {
    pc = runtime.resumePc;
    runtime.resumePc = -1;
  }
  runtime.checkDepth();
  if (runtime.curEffect === null) {
    curDepth = runtime.stackDepth + 1;
    switch (pc) {
      case 0:
        if (typeof x === 'string') {
          tmp = true;
        } else {
          tmp = false;
        }
        args = [
          tmp
        ];
        runtime.stackDepth = curDepth;
        runtime.resumeValue = runtime.safeCall(Predef2.js_assert(...args));
        if (runtime.curEffect === null) {
          pc = 1;
        } else {
          return runtime.unwind(lambda2, 1, "Predef.mls:102:22", null, null, 1, 3, Predef2, acc, x, 0)
        }
      case 1:
        runtime.resumeValue;
        return acc + x;
    }
  } else {
    return runtime.unwind(lambda2, pc, null, null, null, 1, 3, Predef2, acc, x, 0)
  }
});
lambda$1 = (undefined, function (Predef2, b) {
  return (a, i) => {
    let tmp, pc, curDepth;
    if (runtime.resumePc === -1) {
      pc = 0;
    } else {
      pc = runtime.resumePc;
      runtime.resumePc = -1;
    }
    runtime.checkDepth();
    if (runtime.curEffect === null) {
      curDepth = runtime.stackDepth + 1;
      switch (pc) {
        case 0:
          runtime.stackDepth = curDepth;
          runtime.resumeValue = runtime.safeCall(b.at(i));
          if (runtime.curEffect === null) {
            pc = 1;
          } else {
            return runtime.unwind(lambda$1, 1, "Predef.mls:74:83", null, null, 2, 2, Predef2, b, 2, a, i, 0)
          }
        case 1:
          tmp = runtime.resumeValue;
          runtime.stackDepth = curDepth;
          return Predef2.equals(a, tmp);
      }
    } else {
      return runtime.unwind(lambda$1, pc, null, null, null, 2, 2, Predef2, b, 2, a, i, 0)
    }
  }
});
lambda$ = (undefined, function (Predef2, a, b) {
  return (field) => {
    let curDepth;
    runtime.checkDepth();
    if (runtime.curEffect === null) {
      curDepth = runtime.stackDepth + 1;
      runtime.stackDepth = curDepth;
      return lambda(Predef2, a, b, field)
    }
    return runtime.unwind(lambda$, -1, null, null, null, 2, 3, Predef2, a, b, 1, field, 0);
  }
});
lambda1 = (undefined, function (Predef2, b, a, i) {
  let tmp, pc, curDepth;
  if (runtime.resumePc === -1) {
    pc = 0;
  } else {
    pc = runtime.resumePc;
    runtime.resumePc = -1;
  }
  runtime.checkDepth();
  if (runtime.curEffect === null) {
    curDepth = runtime.stackDepth + 1;
    switch (pc) {
      case 0:
        runtime.stackDepth = curDepth;
        runtime.resumeValue = runtime.safeCall(b.at(i));
        if (runtime.curEffect === null) {
          pc = 1;
        } else {
          return runtime.unwind(lambda1, 1, "Predef.mls:74:83", null, null, 1, 4, Predef2, b, a, i, 0)
        }
      case 1:
        tmp = runtime.resumeValue;
        runtime.stackDepth = curDepth;
        return Predef2.equals(a, tmp);
    }
  } else {
    return runtime.unwind(lambda1, pc, null, null, null, 1, 4, Predef2, b, a, i, 0)
  }
});
lambda = (undefined, function (Predef2, a, b, field) {
  let scrut, scrut1, pc, curDepth;
  if (runtime.resumePc === -1) {
    pc = 0;
  } else {
    pc = runtime.resumePc;
    runtime.resumePc = -1;
  }
  runtime.checkDepth();
  if (runtime.curEffect === null) {
    curDepth = runtime.stackDepth + 1;
    switch (pc) {
      case 0:
        scrut = field !== null;
        if (scrut === true) {
          runtime.stackDepth = curDepth;
          runtime.resumeValue = Predef2.equals(a[field], b[field]);
          if (runtime.curEffect === null) {
            pc = 2;
          } else {
            return runtime.unwind(lambda, 2, "Predef.mls:80:48", null, null, 1, 4, Predef2, a, b, field, 0)
          }
        } else {
          return false
        }
      case 2:
        scrut1 = runtime.resumeValue;
        if (scrut1 === true) {
          return true
        }
        return false;
    }
  } else {
    return runtime.unwind(lambda, pc, null, null, null, 1, 4, Predef2, a, b, field, 0)
  }
});
(class Predef {
  static {
    Predef1 = this
  }
  static {
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
        if (runtime.curEffect !== null) {
          runtime.illegalEffect("in a constructor");
        }
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
        if (runtime.curEffect !== null) {
          runtime.illegalEffect("in a constructor");
        }
        Predef.Refl = this;
        Object.defineProperty(this, "class", {
          value: Refl
        });
        globalThis.Object.freeze(this);
      }
      apply(x) {
        return x
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["object", "Refl"];
    });
    Predef.js_assert = globalThis.console["assert"];
    Predef.foldl = Predef.fold;
    (class meta {
      static {
        Predef.meta = this
      }
      static codegen(t, file) {
        let curDepth;
        runtime.checkDepth();
        if (runtime.curEffect === null) {
          curDepth = runtime.stackDepth + 1;
          runtime.stackDepth = curDepth;
          return runtime.safeCall(Term.codegen(t, file))
        }
        return runtime.unwind(meta.codegen, -1, "Predef.mls:146:3", null, meta, 1, 2, t, file, 0);
      }
      static print(t) {
        let curDepth;
        runtime.checkDepth();
        if (runtime.curEffect === null) {
          curDepth = runtime.stackDepth + 1;
          runtime.stackDepth = curDepth;
          return runtime.safeCall(Term.print(t))
        }
        return runtime.unwind(meta.print, -1, "Predef.mls:147:3", null, meta, 1, 1, t, 0);
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["class", "meta"];
    });
  }
  static id(x) {
    return x
  }
  static hide(x) {
    return x
  }
  static get maybe() {
    let tmp;
    tmp = Predef.hide(true);
    if (runtime.curEffect === null) {
      return tmp
    }
    return runtime.illegalEffect("in a getter");
  }
  static apply(f, ...args) {
    let curDepth;
    runtime.checkDepth();
    if (runtime.curEffect === null) {
      curDepth = runtime.stackDepth + 1;
      runtime.stackDepth = curDepth;
      return runtime.safeCall(f(...args))
    }
    return runtime.unwind(Predef.apply, -1, "Predef.mls:25:1", null, Predef, 1, 1, f, 0);
  }
  static pipeInto(x, f) {
    let curDepth;
    runtime.checkDepth();
    if (runtime.curEffect === null) {
      curDepth = runtime.stackDepth + 1;
      runtime.stackDepth = curDepth;
      return runtime.safeCall(f(x))
    }
    return runtime.unwind(Predef.pipeInto, -1, "Predef.mls:27:1", null, Predef, 1, 2, x, f, 0);
  }
  static pipeFrom(f, x) {
    let curDepth;
    runtime.checkDepth();
    if (runtime.curEffect === null) {
      curDepth = runtime.stackDepth + 1;
      runtime.stackDepth = curDepth;
      return runtime.safeCall(f(x))
    }
    return runtime.unwind(Predef.pipeFrom, -1, "Predef.mls:28:1", null, Predef, 1, 2, f, x, 0);
  }
  static pipeIntoHi(x, f) {
    let curDepth;
    runtime.checkDepth();
    if (runtime.curEffect === null) {
      curDepth = runtime.stackDepth + 1;
      runtime.stackDepth = curDepth;
      return runtime.safeCall(f(x))
    }
    return runtime.unwind(Predef.pipeIntoHi, -1, "Predef.mls:31:1", null, Predef, 1, 2, x, f, 0);
  }
  static pipeFromHi(f, x) {
    let curDepth;
    runtime.checkDepth();
    if (runtime.curEffect === null) {
      curDepth = runtime.stackDepth + 1;
      runtime.stackDepth = curDepth;
      return runtime.safeCall(f(x))
    }
    return runtime.unwind(Predef.pipeFromHi, -1, "Predef.mls:32:1", null, Predef, 1, 2, f, x, 0);
  }
  static tap(x, f) {
    let pc, curDepth;
    if (runtime.resumePc === -1) {
      pc = 0;
    } else {
      pc = runtime.resumePc;
      runtime.resumePc = -1;
    }
    runtime.checkDepth();
    if (runtime.curEffect === null) {
      curDepth = runtime.stackDepth + 1;
      switch (pc) {
        case 0:
          runtime.stackDepth = curDepth;
          runtime.resumeValue = runtime.safeCall(f(x));
          if (runtime.curEffect === null) {
            pc = 1;
          } else {
            return runtime.unwind(Predef.tap, 1, "Predef.mls:34:22", null, Predef, 1, 2, x, f, 0)
          }
        case 1:
          runtime.resumeValue;
          return x;
      }
    } else {
      return runtime.unwind(Predef.tap, pc, "Predef.mls:34:1", null, Predef, 1, 2, x, f, 0)
    }
  }
  static pat(f, x) {
    let pc, curDepth;
    if (runtime.resumePc === -1) {
      pc = 0;
    } else {
      pc = runtime.resumePc;
      runtime.resumePc = -1;
    }
    runtime.checkDepth();
    if (runtime.curEffect === null) {
      curDepth = runtime.stackDepth + 1;
      switch (pc) {
        case 0:
          runtime.stackDepth = curDepth;
          runtime.resumeValue = runtime.safeCall(f(x));
          if (runtime.curEffect === null) {
            pc = 1;
          } else {
            return runtime.unwind(Predef.pat, 1, "Predef.mls:35:22", null, Predef, 1, 2, f, x, 0)
          }
        case 1:
          runtime.resumeValue;
          return x;
      }
    } else {
      return runtime.unwind(Predef.pat, pc, "Predef.mls:35:1", null, Predef, 1, 2, f, x, 0)
    }
  }
  static alsoDo(x, eff) {
    return x
  }
  static andThen(f, g) {
    return (x) => {
      let tmp, pc, curDepth;
      if (runtime.resumePc === -1) {
        pc = 0;
      } else {
        pc = runtime.resumePc;
        runtime.resumePc = -1;
      }
      runtime.checkDepth();
      if (runtime.curEffect === null) {
        curDepth = runtime.stackDepth + 1;
        switch (pc) {
          case 0:
            runtime.stackDepth = curDepth;
            runtime.resumeValue = runtime.safeCall(f(x));
            if (runtime.curEffect === null) {
              pc = 1;
            } else {
              return runtime.unwind(Predef.andThen, 1, "Predef.mls:39:31", null, Predef, 2, 2, f, g, 1, x, 0)
            }
          case 1:
            tmp = runtime.resumeValue;
            runtime.stackDepth = curDepth;
            return runtime.safeCall(g(tmp));
        }
      } else {
        return runtime.unwind(Predef.andThen, pc, "Predef.mls:39:1", null, Predef, 2, 2, f, g, 1, x, 0)
      }
    }
  }
  static compose(f, g) {
    return (x) => {
      let tmp, pc, curDepth;
      if (runtime.resumePc === -1) {
        pc = 0;
      } else {
        pc = runtime.resumePc;
        runtime.resumePc = -1;
      }
      runtime.checkDepth();
      if (runtime.curEffect === null) {
        curDepth = runtime.stackDepth + 1;
        switch (pc) {
          case 0:
            runtime.stackDepth = curDepth;
            runtime.resumeValue = runtime.safeCall(g(x));
            if (runtime.curEffect === null) {
              pc = 1;
            } else {
              return runtime.unwind(Predef.compose, 1, "Predef.mls:40:31", null, Predef, 2, 2, f, g, 1, x, 0)
            }
          case 1:
            tmp = runtime.resumeValue;
            runtime.stackDepth = curDepth;
            return runtime.safeCall(f(tmp));
        }
      } else {
        return runtime.unwind(Predef.compose, pc, "Predef.mls:40:1", null, Predef, 2, 2, f, g, 1, x, 0)
      }
    }
  }
  static passTo(receiver, f) {
    return (...args) => {
      let curDepth;
      runtime.checkDepth();
      if (runtime.curEffect === null) {
        curDepth = runtime.stackDepth + 1;
        runtime.stackDepth = curDepth;
        return runtime.safeCall(f(receiver, ...args))
      }
      return runtime.unwind(Predef.passTo, -1, "Predef.mls:43:1", null, Predef, 2, 2, receiver, f, 0, 0);
    }
  }
  static passToLo(receiver, f) {
    return (...args) => {
      let curDepth;
      runtime.checkDepth();
      if (runtime.curEffect === null) {
        curDepth = runtime.stackDepth + 1;
        runtime.stackDepth = curDepth;
        return runtime.safeCall(f(receiver, ...args))
      }
      return runtime.unwind(Predef.passToLo, -1, "Predef.mls:46:1", null, Predef, 2, 2, receiver, f, 0, 0);
    }
  }
  static call(receiver, f) {
    return (...args) => {
      let curDepth;
      runtime.checkDepth();
      if (runtime.curEffect === null) {
        curDepth = runtime.stackDepth + 1;
        runtime.stackDepth = curDepth;
        return runtime.safeCall(f.call(receiver, ...args))
      }
      return runtime.unwind(Predef.call, -1, "Predef.mls:49:1", null, Predef, 2, 2, receiver, f, 0, 0);
    }
  }
  static equals(a, b) {
    let scrut, scrut1, scrut2, ac, scrut3, md, scrut4, scrut5, scrut6, scrut7, scrut8, scrut9, lambda$here, lambda$here1, pc, curDepth;
    if (runtime.resumePc === -1) {
      pc = 0;
    } else {
      pc = runtime.resumePc;
      runtime.resumePc = -1;
    }
    runtime.checkDepth();
    if (runtime.curEffect === null) {
      curDepth = runtime.stackDepth + 1;
      switch (pc) {
        case 0:
          scrut = a === b;
          if (scrut === true) {
            return true
          }
          if (a instanceof globalThis.Array) {
            if (b instanceof globalThis.Array) {
              scrut1 = a.length === b.length;
              if (scrut1 === true) {
                lambda$here = lambda$1(Predef, b);
                runtime.stackDepth = curDepth;
                return runtime.safeCall(a.every(lambda$here))
              }
            }
          }
          scrut2 = a !== undefined;
          if (scrut2 === true) {
            scrut9 = a !== null;
            if (scrut9 === true) {
              scrut8 = b !== undefined;
              if (scrut8 === true) {
                scrut7 = b !== null;
                if (scrut7 === true) {
                  ac = a.constructor;
                  scrut3 = ac !== undefined;
                  if (scrut3 === true) {
                    scrut6 = ac === b.constructor;
                    if (scrut6 === true) {
                      md = ac[Predef.Symbols.definitionMetadata];
                      scrut4 = md !== undefined;
                      if (scrut4 === true) {
                        lambda$here1 = lambda$(Predef, a, b);
                        runtime.stackDepth = curDepth;
                        runtime.resumeValue = runtime.safeCall(md[2].every(lambda$here1));
                        if (runtime.curEffect === null) {
                          pc = 2;
                        } else {
                          return runtime.unwind(Predef.equals, 2, "Predef.mls:80:9", null, Predef, 1, 2, a, b, 0)
                        }
                      } else {
                        return false
                      }
                    } else {
                      return false
                    }
                  } else {
                    return false
                  }
                } else {
                  return false
                }
              } else {
                return false
              }
            } else {
              return false
            }
          } else {
            return false
          }
        case 2:
          scrut5 = runtime.resumeValue;
          if (scrut5 === true) {
            return true
          }
          return false;
      }
    } else {
      return runtime.unwind(Predef.equals, pc, "Predef.mls:72:1", null, Predef, 1, 2, a, b, 0)
    }
  }
  static nequals(a, b) {
    let tmp, pc, curDepth;
    if (runtime.resumePc === -1) {
      pc = 0;
    } else {
      pc = runtime.resumePc;
      runtime.resumePc = -1;
    }
    runtime.checkDepth();
    if (runtime.curEffect === null) {
      curDepth = runtime.stackDepth + 1;
      switch (pc) {
        case 0:
          runtime.stackDepth = curDepth;
          runtime.resumeValue = Predef.equals(a, b);
          if (runtime.curEffect === null) {
            pc = 1;
          } else {
            return runtime.unwind(Predef.nequals, 1, "Predef.mls:82:30", null, Predef, 1, 2, a, b, 0)
          }
        case 1:
          tmp = runtime.resumeValue;
          return ! tmp;
      }
    } else {
      return runtime.unwind(Predef.nequals, pc, "Predef.mls:82:1", null, Predef, 1, 2, a, b, 0)
    }
  }
  static get pass1() {
    return Rendering.pass1;
  }
  static get pass2() {
    return Rendering.pass2;
  }
  static get pass3() {
    return Rendering.pass3;
  }
  static get passing() {
    return Rendering.passing;
  }
  static get map() {
    return Rendering.map;
  }
  static get fold() {
    return Rendering.fold;
  }
  static get interleave() {
    return Rendering.interleave;
  }
  static get render() {
    return Rendering.render;
  }
  static print(...xs) {
    let callPrefix, tmp, pc, curDepth;
    if (runtime.resumePc === -1) {
      pc = 0;
    } else {
      pc = runtime.resumePc;
      runtime.resumePc = -1;
    }
    runtime.checkDepth();
    if (runtime.curEffect === null) {
      curDepth = runtime.stackDepth + 1;
      switch (pc) {
        case 0:
          runtime.stackDepth = curDepth;
          runtime.resumeValue = runtime.safeCall(Predef.map(Predef.renderAsStr));
          if (runtime.curEffect === null) {
            pc = 2;
          } else {
            return runtime.unwind(Predef.print, 2, "Predef.mls:96:18", null, Predef, 1, 0, 0)
          }
        case 2:
          callPrefix = runtime.resumeValue;
          runtime.stackDepth = curDepth;
          runtime.resumeValue = runtime.safeCall(callPrefix(...xs));
          if (runtime.curEffect === null) {
            pc = 1;
          } else {
            return runtime.unwind(Predef.print, 1, "Predef.mls:96:18", null, Predef, 1, 0, 0)
          }
        case 1:
          tmp = runtime.resumeValue;
          runtime.stackDepth = curDepth;
          return runtime.safeCall(globalThis.console.log(...tmp));
      }
    } else {
      return runtime.unwind(Predef.print, pc, "Predef.mls:95:1", null, Predef, 1, 0, 0)
    }
  }
  static renderAsStr(arg) {
    let curDepth;
    runtime.checkDepth();
    if (runtime.curEffect === null) {
      curDepth = runtime.stackDepth + 1;
      if (typeof arg === 'string') {
        return arg
      }
      runtime.stackDepth = curDepth;
      return runtime.safeCall(Predef.render(arg));
    }
    return runtime.unwind(Predef.renderAsStr, -1, "Predef.mls:98:1", null, Predef, 1, 1, arg, 0);
  }
  static check(...args) {
    let curDepth;
    runtime.checkDepth();
    if (runtime.curEffect === null) {
      curDepth = runtime.stackDepth + 1;
      runtime.stackDepth = curDepth;
      return runtime.safeCall(Predef.js_assert(...args))
    }
    return runtime.unwind(Predef.check, -1, "Predef.mls:102:1", null, Predef, 1, 0, 0);
  }
  static notImplemented(msg) {
    let tmp, pc, curDepth;
    if (runtime.resumePc === -1) {
      pc = 0;
    } else {
      pc = runtime.resumePc;
      runtime.resumePc = -1;
    }
    runtime.checkDepth();
    if (runtime.curEffect === null) {
      curDepth = runtime.stackDepth + 1;
      switch (pc) {
        case 0:
          tmp = "Not implemented: " + msg;
          runtime.stackDepth = curDepth;
          runtime.resumeValue = runtime.safeCall(globalThis.Error(tmp));
          if (runtime.curEffect === null) {
            pc = 1;
          } else {
            return runtime.unwind(Predef.notImplemented, 1, "Predef.mls:104:38", null, Predef, 1, 1, msg, 0)
          }
        case 1:
          throw runtime.resumeValue;
      }
    } else {
      return runtime.unwind(Predef.notImplemented, pc, "Predef.mls:104:1", null, Predef, 1, 1, msg, 0)
    }
  }
  static get notImplementedError() {
    let tmp;
    tmp = runtime.safeCall(globalThis.Error("Not implemented"));
    if (runtime.curEffect === null) {
      throw tmp
    }
    tmp = runtime.illegalEffect("in a getter");
    throw tmp;
  }
  static tuple(...xs) {
    return xs
  }
  static mkSet(...xs) {
    return globalThis.Object.freeze(new globalThis.Set(xs))
  }
  static foldr(f) {
    return (first, ...rest) => {
      let len, scrut, i, init, scrut1, tmp, tmp1, tmp2, pc, curDepth;
      if (runtime.resumePc === -1) {
        pc = 0;
      } else {
        let saveOffset;
        pc = runtime.resumePc;
        saveOffset = runtime.resumeIdx;
        i = runtime.resumeArr.at(saveOffset);
        saveOffset = saveOffset + 1;
        init = runtime.resumeArr.at(saveOffset);
        runtime.resumePc = -1;
      }
      runtime.checkDepth();
      if (runtime.curEffect === null) {
        curDepth = runtime.stackDepth + 1;
        main: while (true) {
          switch (pc) {
            case 4:
              runtime.stackDepth = curDepth;
              return runtime.safeCall(f(first, init));
            case 3:
              tmp1 = runtime.resumeValue;
              runtime.stackDepth = curDepth;
              runtime.resumeValue = runtime.safeCall(f(tmp1, init));
              if (runtime.curEffect === null) {
                pc = 2;
              } else {
                return runtime.unwind(Predef.foldr, 2, "Predef.mls:124:14", null, Predef, 2, 1, f, 1, first, 2, i, init)
              }
            case 2:
              tmp2 = runtime.resumeValue;
              init = tmp2;
              pc = 1;
              continue main;
            case 0:
              len = rest.length;
              scrut = len === 0;
              if (scrut === true) {
                return first
              }
              i = len - 1;
              runtime.stackDepth = curDepth;
              runtime.resumeValue = runtime.safeCall(rest.at(i));
              if (runtime.curEffect === null) {
                pc = 5;
              } else {
                return runtime.unwind(Predef.foldr, 5, "Predef.mls:120:12", null, Predef, 2, 1, f, 1, first, 2, i, init)
              }
            case 5:
              init = runtime.resumeValue;
              pc = 1;
            case 1:
              scrut1 = i > 0;
              if (scrut1 === true) {
                tmp = i - 1;
                i = tmp;
                runtime.stackDepth = curDepth;
                runtime.resumeValue = runtime.safeCall(rest.at(tmp));
                if (runtime.curEffect === null) {
                  pc = 3;
                  continue main
                }
                return runtime.unwind(Predef.foldr, 3, "Predef.mls:124:16", null, Predef, 2, 1, f, 1, first, 2, tmp, init);
              }
              pc = 4;
              continue main;
          }
          break;
        }
      } else {
        return runtime.unwind(Predef.foldr, pc, "Predef.mls:115:1", null, Predef, 2, 1, f, 1, first, 2, i, init)
      }
    }
  }
  static mkStr(...xs) {
    let callPrefix, lambda$here, pc, curDepth;
    if (runtime.resumePc === -1) {
      pc = 0;
    } else {
      pc = runtime.resumePc;
      runtime.resumePc = -1;
    }
    runtime.checkDepth();
    if (runtime.curEffect === null) {
      curDepth = runtime.stackDepth + 1;
      switch (pc) {
        case 0:
          lambda$here = lambda$2(Predef);
          runtime.stackDepth = curDepth;
          runtime.resumeValue = runtime.safeCall(Predef.fold(lambda$here));
          if (runtime.curEffect === null) {
            pc = 1;
          } else {
            return runtime.unwind(Predef.mkStr, 1, "Predef.mls:128:3", null, Predef, 1, 0, 0)
          }
        case 1:
          callPrefix = runtime.resumeValue;
          runtime.stackDepth = curDepth;
          return runtime.safeCall(callPrefix(...xs));
      }
    } else {
      return runtime.unwind(Predef.mkStr, pc, "Predef.mls:127:1", null, Predef, 1, 0, 0)
    }
  }
  static use(instance) {
    return instance
  }
  static enterHandleBlock(handler, body) {
    let curDepth;
    runtime.checkDepth();
    if (runtime.curEffect === null) {
      curDepth = runtime.stackDepth + 1;
      runtime.stackDepth = curDepth;
      return runtime.safeCall(runtime.enterHandleBlock(handler, body))
    }
    return runtime.unwind(Predef.enterHandleBlock, -1, "Predef.mls:137:1", null, Predef, 1, 2, handler, body, 0);
  }
  static raiseUnhandledEffect() {
    let curDepth;
    runtime.checkDepth();
    if (runtime.curEffect === null) {
      curDepth = runtime.stackDepth + 1;
      runtime.stackDepth = curDepth;
      return runtime.safeCall(runtime.mkEffect(runtime.FatalEffect, null))
    }
    return runtime.unwind(Predef.raiseUnhandledEffect, -1, "Predef.mls:142:1", null, Predef, 1, 0, 0);
  }
  toString() { return runtime.render(this); }
  static [definitionMetadata] = ["class", "Predef"];
});
export { Predef1 as _$_modulePrivate_$_Predef };
export { lambda as _$_modulePrivate_$_lambda };
export { lambda1 as _$_modulePrivate_$_lambda1 };
export { lambda2 as _$_modulePrivate_$_lambda2 };
export { lambda$ as _$_modulePrivate_$_lambda$ };
export { lambda$1 as _$_modulePrivate_$_lambda$1 };
export { lambda$2 as _$_modulePrivate_$_lambda$2 };
let Predef = Predef1; export default Predef;
