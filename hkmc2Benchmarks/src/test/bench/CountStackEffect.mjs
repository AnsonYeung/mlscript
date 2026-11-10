import Benchmark from "../../../../hkmc2/shared/src/test/mlscript-compile/Benchmark.mjs";
import fse from "fs/promises";
import fs from "fs";
import Rendering from "../../../../hkmc2/shared/src/test/mlscript-compile/Rendering.mjs";
import Runtime from "../../../../hkmc2/shared/src/test/mlscript-compile/Runtime.mjs";

globalThis.fs = fs;

let count = 0;
Runtime.checkDepth = function () {
  if (Runtime.stackDepth >= Runtime.stackLimit && Runtime.stackHandler !== null) {
    count += 1;
    return Runtime.stackHandler.delay();
  }
}

let nofibList = [
  "ansi",
  "atom",
  "awards",
  "banner",
  "lcss",
  "boyer",
  "boyer2",
  "calendar",
  "cichelli",
  "circsim",
  "clausify",
  "constraints",
  "cryptarithm1",
  "cryptarithm2",
  "cse",
  "eliza",
  "gcd",
  "integer",
  "knights",
  "lambda",
  "lastpiece",
  "life",
  "mandel",
  "mandel2",
  "mate",
  "minimax",
  "para",
  "power",
  "pretty",
  "primetest",
  "puzzle",
  "rsa",
  "scc",
  "secretary",
  "sorting",
  "sphere",
  "treejoin",
];

let results = [];

for (const suiteName of nofibList) {
  console.log(suiteName);
  const mod = (await import(`../../../../hkmc2/shared/src/test/mlscript-compile/nofib/${suiteName}.mjs`)).default;
  count = 0;
  const result = await Benchmark.runStackSafe(mod.main);
  const file = await fse.open(`./hkmc2Benchmarks/src/test/bench/out/${suiteName}.txt`, "w");
  if (typeof result === "string") {
    await file.write(result);
  } else {
    await file.write(Rendering.render(result));
  }
  await file.close();
  results.push([suiteName, count]);
}

const csvRows = results.map(r => {
  return `${r[0]},${r[1]}`;
}).join("\n");

fs.writeFileSync("hkmc2Benchmarks/src/test/logs/stackEffectCount.csv", csvRows, "utf-8");
