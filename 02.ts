import Solution from "./solution.ts";

const op1 = ["A", "B", "C"] as const;
const op2 = ["X", "Y", "Z"] as const;

type Tuple = [typeof op1[number], typeof op2[number]];

const score = ([a, b]: Tuple) => {
  const i = op1.indexOf(a);
  const j = op2.indexOf(b);
  // draw
  if (i === j) return 3 + j + 1;
  // win
  if (j == i + 1 || (j == 0 && i == 2)) return 6 + j + 1;
  // loose
  return j + 1;
};

const predict = ([a, b]: Tuple) => {
  const i = op1.indexOf(a);
  if (b === "X") return i == 0 ? 3 : i;
  if (b === "Y") return i + 1 + 3;
  return 6 + (i == 2 ? 1 : i + 2);
};

const task = new Solution(
  (arr: Tuple[]) => arr.map(score).reduce((p, c) => p + c, 0),
  (arr) => arr.map(predict).reduce((p, c) => p + c, 0),
  {
    transform: (a) => a.split(" ") as Tuple,
    sep: "\n",
  },
);
task.expect(15, 12);

if (import.meta.main) await task.execute();

export default task;
