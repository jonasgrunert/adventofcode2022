import Solution from "./solution.ts";

type Op = [string, number | string[]];

const calcEx = /(\w+): ((\d+)|(\w+) ([+\-\*\/]) (\w+))/;

function solve1(map: Map<string, number | string[]>, name: string): number {
  const n = map.get(name)!;
  if (typeof n === "number") return n;
  const [a, b] = [solve1(map, n[0]), solve1(map, n[2])];
  switch (n[1]) {
    case "+":
      return a + b;
    case "*":
      return a * b;
    case "-":
      return a - b;
    case "/":
      return a / b;
  }
  return -0;
}

function solve2(
  map: Map<string, number | string[] | [number, number]>,
  name: string
): [number, number] | number {
  const n = map.get(name)!;
  if (typeof n === "number") return n;
  if (n.length === 2) return n as [number, number];
  const [a, b] = [solve2(map, n[0] as string), solve2(map, n[2] as string)];
  if (typeof a !== "number" && typeof b === "number") {
    switch (n[1]) {
      case "+":
        return [a[0] + b, a[1]];
      case "*":
        return [a[0] * b, a[1] * b];
      case "-":
        return [a[0] - b, a[1]];
      case "/":
        return [a[0] / b, a[1] / b];
    }
  } else if (typeof a === "number" && typeof b !== "number") {
    switch (n[1]) {
      case "+":
        return [a + b[0], b[1]];
      case "*":
        return [a * b[0], a * b[1]];
      case "-":
        return [a - b[0], b[1]];
      case "/":
        return [a / b[0], a / b[1]];
    }
  } else if (typeof a === "number" && typeof b === "number") {
    switch (n[1]) {
      case "+":
        return a + b;
      case "*":
        return a * b;
      case "-":
        return a - b;
      case "/":
        return a / b;
    }
  }
  return -0;
}

const task = new Solution(
  (arr: Op[]) => {
    const map = new Map(arr);
    return solve1(map, "root");
  },
  (arr: Op[]) => {
    const map = new Map<string, number | string[] | [number, number]>(arr);
    map.set("humn", [0, 1]);
    const [left, _, right] = map.get("root") as string[];
    const l = solve2(map, left);
    const r = solve2(map, right);
    if (typeof l === "number" && typeof r !== "number") {
      return Math.floor(Math.abs((l - r[0]) / r[1]));
    } else if (typeof l !== "number" && typeof r === "number") {
      return Math.floor(Math.abs((r - l[0]) / l[1]));
    }
    return -0;
  },
  {
    transform: (e) => {
      const c = calcEx.exec(e)!;
      const value = c[4] === undefined ? Number.parseInt(c[2]) : c.slice(4);
      return [c[1], value] as Op;
    },
    sep: "\n",
  }
);
task.expect(152, 301);

export default task;
