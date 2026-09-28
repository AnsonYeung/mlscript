import Benchmark from "../../../../hkmc2/shared/src/test/mlscript-compile/Benchmark.mjs";
import fse from "fs/promises";
import fs from "fs";
import Rendering from "../../../../hkmc2/shared/src/test/mlscript-compile/Rendering.mjs";
import Runtime from "../../../../hkmc2/shared/src/test/mlscript-compile/Runtime.mjs";
import { Bench } from 'tinybench';

globalThis.fs = fs;

const bench = new Bench({ time: 1000 });

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

for (const suiteName of nofibList) {
  const mod = (await import(`../../../../hkmc2/shared/src/test/mlscript-compile/nofib/${suiteName}.mjs`)).default;
  const result = await Benchmark.runStackSafe(mod.main);
  const file = await fse.open(`./hkmc2Benchmarks/src/test/bench/out/${suiteName}.txt`, "w");
  if (typeof result === "string") {
    await file.write(result);
  } else {
    await file.write(Rendering.render(result));
  }
  await file.close();
  bench.add(suiteName, () => Benchmark.runStackSafe(mod.main));
}

await bench.run();

console.table(bench.table());

const csvRows = bench.tasks.map(task => {
  const name = task.name;
  const time = task.result?.period || 0; 
  return `${name},${time / 1000}`;
}).join('\n');

fs.writeFileSync('hkmc2Benchmarks/src/test/logs/nofibs.csv', csvRows, 'utf-8');
