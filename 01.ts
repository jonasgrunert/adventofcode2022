import Solution from "./_util.ts";

const sort = (arr: number[][]) =>
  arr.map((v) => v.reduce((p, c) => p + c, 0)).sort((a, b) => b - a);

const task = new Solution(
  (arr: number[][]) => sort(arr)[0],
  (arr) =>
    sort(arr)
      .slice(0, 3)
      .reduce((p, c) => p + c, 0),
  {
    transform: (a) => a.split("\n").map((n) => Number.parseInt(n)),
    sep: "\n\n",
  },
);
task.expect(24000, 45000);

if (import.meta.main) await task.execute();

export default task;
