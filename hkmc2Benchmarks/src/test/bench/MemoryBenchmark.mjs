import { fork } from 'node:child_process';
import fs from 'node:fs';

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
  console.log(`Benchmarking: ${suiteName}`);

  await new Promise((resolve) => {
    const worker = fork("./hkmc2Benchmarks/src/test/bench/MemoryWorker.mjs", [suiteName], {
      execArgv: ["--predictable", "--expose-gc"]
    });
    let ok = false;

    worker.on('message', (stats) => {
      console.log(`Results:`, stats);
      results.push([suiteName, stats]);
      ok = true;
    });

    worker.on('exit', () => {
      if (!ok) {
        results.push([suiteName, {}]);
      }
      resolve();
    });
  });
}

const csvRows = results.map(r => {
  let stats = r[1];
  return `${r[0]},${stats.gcCount},${stats.gcDurationMs},${stats.rssMB}`;
}).join("\n");

fs.writeFileSync("hkmc2Benchmarks/src/test/logs/memory.csv", csvRows, "utf-8");
