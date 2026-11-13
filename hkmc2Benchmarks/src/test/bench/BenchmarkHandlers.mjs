import Benchmark from "../../../../hkmc2/shared/src/test/mlscript-compile/Benchmark.mjs";
import fse from "fs/promises";
import fs from "fs";
import Rendering from "../../../../hkmc2/shared/src/test/mlscript-compile/Rendering.mjs";
import Runtime from "../../../../hkmc2/shared/src/test/mlscript-compile/Runtime.mjs";
import { Bench } from "tinybench";

globalThis.fs = fs;

const bench = new Bench({ time: 1000 });

let benchList = [
  "countdown",
  "fibonacci_recursive",
  "generator",
  "handler_sieve",
  "iterator",
  "parsing_dollars",
  "product_early",
  "resume_nontail",
];

for (const suiteName of benchList) {
  console.log(suiteName);
  const mod = (await import(`../../../../hkmc2/shared/src/test/mlscript-compile/handlers-bench/${suiteName}.mjs`)).default;
  const result = await Benchmark.runStackSafe(mod.main);
  const file = await fse.open(`./hkmc2Benchmarks/src/test/bench/out-handlers/${suiteName}.txt`, "w");
  if (typeof result === "string") {
    await file.write(result);
  } else {
    await file.write(Rendering.render(result));
  }
  await file.close();
  bench.add(suiteName, () => Benchmark.runStackSafe(mod.main));
}
console.log("Running benchmarks...");

await bench.run();

console.table(bench.table());

const csvRows = bench.tasks.map(task => {
  const name = task.name;
  const result = task.result;
  if (result.state === "completed") {
    const time = result.period;
    const moe = result.latency.moe;
    return `${name},${time / 1000},${moe / 1000}`;
  }
  return `${name},-1,-1`;
}).join("\n");

fs.writeFileSync("hkmc2Benchmarks/src/test/logs/nofibs.csv", csvRows, "utf-8");
