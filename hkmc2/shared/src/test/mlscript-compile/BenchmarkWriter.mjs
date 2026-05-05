import { writeFile } from "node:fs/promises";


const BenchmarkWriter = {
  async write(suite, path) {
    // console.log("entry to write");
    let prefixPath = "hkmc2Benchmarks/src/test/logs/";
    let jsonStr = JSON.stringify(suite.map((res, i, j) => res), null, 2);
    // console.log(jsonStr);
    writeFile(prefixPath + path, jsonStr);
  }
}

export default BenchmarkWriter;

