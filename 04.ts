import Solution from "./solution.ts";

const task = new Solution(
  (arr: number[][]) =>
    arr.filter(([f, s, t, l]) => (f <= t && s >= l) || (t <= f && l >= s))
      .length,
  (arr: number[][]) =>
    arr.filter(([f, s, t, l]) => (f <= t && s >= t) || (t <= f && l >= f))
      .length,
  {
    transform: (e) =>
      e
        .split(",")
        .flatMap((s) => s.split("-"))
        .map((n) => Number.parseInt(n)),
    sep: "\n",
  },
);
task.expect(2, 4);

if (import.meta.main) await task.execute();

export default task;
