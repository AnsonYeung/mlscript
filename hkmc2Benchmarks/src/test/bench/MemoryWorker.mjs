import v8 from 'node:v8';
import Benchmark from "../../../../hkmc2/shared/src/test/mlscript-compile/Benchmark.mjs";
import Rendering from "../../../../hkmc2/shared/src/test/mlscript-compile/Rendering.mjs";
import fs from "fs";
import fse from "fs/promises";

globalThis.fs = fs;

const suiteName = process.argv[2];

const mod = (await import(`../../../../hkmc2/shared/src/test/mlscript-compile/nofib/${suiteName}.mjs`)).default;

// Warm-up pass
let warmup = Benchmark.runStackSafe(mod.main);
if (warmup instanceof Promise) warmup = await warmup;
globalThis.gc();

const gcProfiler = new v8.GCProfiler();
gcProfiler.start();
globalThis.gc();

let result = Benchmark.runStackSafe(mod.main);
if (result instanceof Promise) result = await result;

globalThis.gc();
const gcReport = gcProfiler.stop();

const stats = gcReport.statistics;
let allocatedBytes = 0;
let reclaimedBytes = 0;
let gcCount = 0;
let gcDurationMs = 0;

for (let i = 1; i < stats.length; i++) {
  allocatedBytes += stats[i].beforeGC.heapStatistics.usedHeapSize - stats[i - 1].afterGC.heapStatistics.usedHeapSize;
  if (i < stats.length - 1) {
    gcCount++;
    gcDurationMs += stats[i].cost / 1000;
    reclaimedBytes += stats[i].beforeGC.heapStatistics.usedHeapSize - stats[i].afterGC.heapStatistics.usedHeapSize;
  }
}

const file = await fse.open(`./hkmc2Benchmarks/src/test/bench/out/${suiteName}.txt`, "w");
if (typeof result === "string") {
  await file.write(result);
} else {
  await file.write(Rendering.render(result));
}
await file.close();

const report = {
  suiteName: suiteName,
  rssMB: process.memoryUsage.rss() / 1024 / 1024,
  allocatedBytes,
  reclaimedBytes,
  gcCount,
  gcDurationMs,
};

if (process.send) {
  process.send(report);
} else {
  console.log(report);
}
