import { PerformanceObserver } from 'node:perf_hooks';
import v8 from 'node:v8';
import Benchmark from "../../../../hkmc2/shared/src/test/mlscript-compile/Benchmark.mjs";
import Rendering from "../../../../hkmc2/shared/src/test/mlscript-compile/Rendering.mjs";
import fs from "fs";
import fse from "fs/promises";
import { setTimeout } from "node:timers/promises";

globalThis.fs = fs;

const suiteName = process.argv[2];
let gcCount = 0;
let gcDurationMs = 0;

const obs = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    gcCount++;
    gcDurationMs += entry.duration;
  }
});

// console.log("start");

const mod = (await import(`../../../../hkmc2/shared/src/test/mlscript-compile/nofib/${suiteName}.mjs`)).default;

let profiler = v8.startHeapProfile();
obs.observe({ entryTypes: ['gc'] });

let result = await Benchmark.runStackSafe(mod.main);
await setTimeout(10);

obs.disconnect();
const profile = profiler.stop();

console.log(profile);

const file = await fse.open(`./hkmc2Benchmarks/src/test/bench/out/${suiteName}.txt`, "w");
if (typeof result === "string") {
  await file.write(result);
} else {
  await file.write(Rendering.render(result));
}

const report = {
  suiteName: suiteName,
  rssMB: process.memoryUsage().rss / 1024 / 1024,
  gcCount,
  gcDurationMs: gcDurationMs,
};

if (process.send) {
  process.send(report);
} else {
  console.log(report);
}
