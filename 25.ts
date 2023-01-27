import Solution from "./solution.ts";

const mul = ["=", "-", "0", "1", "2"];

function parseNumber(num: string) {
  return num.split("").reduce((p, c, i) => {
    return (
      p + Math.pow(5, num.length - 1 - i) * (mul.findIndex((m) => m === c) - 2)
    );
  }, 0);
}

function toSNAFU(num: number): string {
  if (num === 0) return "";
  const div = Math.floor((num + 2) / 5);
  const rem = (num + 2) % 5;
  return toSNAFU(div) + mul[rem];
}

const task = new Solution(
  (arr: string[]) => {
    const sum = arr.reduce((p, a) => p + parseNumber(a), 0);
    return toSNAFU(sum);
  },
  {
    sep: "\n",
  },
);
task.expect("2=-1=0");

if (import.meta.main) await task.execute();

export default task;
