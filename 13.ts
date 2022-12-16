import Solution from "./solution.ts";

type List = Array<number | List>;
const parseEx = /\d+|\]|\[/g;

function parse(s: string) {
  const items: List = [];
  let result: null | RegExpExecArray;
  while ((result = parseEx.exec(s)) !== null) {
    switch (result[0]) {
      case "[": {
        items.push(parse(s));
        break;
      }
      case "]": {
        return items;
      }
      default: {
        items.push(Number.parseInt(result[0]));
      }
    }
  }
  return items;
}

function compare(left: number | List, right: number | List): number {
  if (left === undefined) return -1;
  if (right === undefined) return 1;
  if (typeof left === "number" && typeof right === "number") {
    return Math.sign(left - right);
  }
  if (typeof left === "object" && typeof right === "object") {
    for (let i = 0; i < Math.max(left.length, right.length); i++) {
      const result = compare(left[i], right[i]);
      if (result !== 0) return result;
    }
    return 0;
  }
  return compare(
    typeof left === "number" ? [left] : left,
    typeof right === "number" ? [right] : right,
  );
}

const task = new Solution(
  (packgs: [List, List][]) => {
    const res = packgs.map((p, i) => (compare(...p) === -1 ? i + 1 : 0));
    return res.reduce((p, c) => p + c);
  },
  (packgs: [List, List][]) => {
    const a = [[2]];
    const b = [[6]];
    packgs.push([a, b]);
    const res = packgs.flat().sort((a, b) => compare(a, b));
    return (res.indexOf(a) + 1) * (res.indexOf(b) + 1);
  },
  {
    transform: (a) => parse(a) as [List, List],
    sep: "\n\n",
  },
);
task.expect(13, 140);

if (import.meta.main) await task.execute();

export default task;
