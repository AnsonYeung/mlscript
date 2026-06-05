const definitionMetadata = globalThis.Symbol.for("mlscript.definitionMetadata");
const prettyPrint = globalThis.Symbol.for("mlscript.prettyPrint");
import runtime from "./Runtime.mjs";
let NoFreeze1;
(class NoFreeze {
  static {
    NoFreeze1 = this
  }
  static {
    NoFreeze.Foo = function Foo(x) {
      return (new Foo.class(x));
    };
    (class Foo {
      static {
        NoFreeze.Foo.class = this
      }
      constructor(x) {
        this.x = x;
      }
      toString() { return runtime.render(this); }
      static [definitionMetadata] = ["class", "Foo", ["x"]];
    });
  }
  static foo() {
    return (new NoFreeze.Foo.class(0))
  }
  static bar() {
    let curDepth;
    runtime.checkDepth();
    if (runtime.curEffect === null) {
      curDepth = runtime.stackDepth + 1;
      runtime.stackDepth = curDepth;
      return runtime.safeCall(NoFreeze["foo"]())
    }
    return runtime.unwind(NoFreeze.bar, -1, "NoFreeze.mls:7:3", null, NoFreeze, 1, 0, 0);
  }
  toString() { return runtime.render(this); }
  static [definitionMetadata] = ["class", "NoFreeze"];
});
export { NoFreeze1 as _$_modulePrivate_$_NoFreeze };
let NoFreeze = NoFreeze1; export default NoFreeze;
