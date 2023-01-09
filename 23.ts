import Solution from "./solution.ts";

const line = (x: number, y: number, dir: "x" | "y"): [number, number][] =>
  Array.from({ length: 3 }, (_, d) => (dir === "x" ? [x, y + d] : [x + d, y]));

const adj = [
  line(-1, -1, "y"),
  line(-1, 1, "y"),
  line(-1, -1, "x"),
  line(1, -1, "x"),
];

function predict(
  pos: string,
  positions: Set<string>,
  round = 0,
): null | string {
  const [x, y] = pos.split(",").map((n) => Number.parseInt(n));
  let shouldMove = false;
  let suggestion: string | null = null;
  for (let i = 0; i < adj.length; i++) {
    if (
      adj[(i + round) % adj.length].some(([dx, dy]) =>
        positions.has([dx + x, dy + y].join(",")),
      )
    ) {
      if (suggestion !== null) return suggestion;
      shouldMove = true;
    } else {
      const [dx, dy] = adj[(i + round) % adj.length][1];
      const sugg = [x + dx, y + dy].join(",");
      if (shouldMove) return sugg;
      if (suggestion === null) suggestion = sugg;
    }
  }
  return shouldMove ? suggestion : null;
}

const task = new Solution(
  (arr: string[][]) => {
    const elves = new Set(
      arr.flatMap((a, y) =>
        a
          .map((c, x) => (c === "#" ? [x, y].join(",") : null))
          .filter((c) => c !== null),
      ) as string[],
    );
    for (let i = 0; i < 10; i++) {
      const predictions = {} as Record<string, string[]>;
      for (const elf of elves) {
        const p = predict(elf, elves, i);
        if (p) {
          if (predictions[p] === undefined) {
            predictions[p] = [elf];
          } else {
            predictions[p].push(elf);
          }
        }
      }
      for (const pos in predictions) {
        const pre = predictions[pos];
        if (pre.length === 1) {
          elves.delete(pre[0]);
          elves.add(pos);
        }
      }
    }
    const { x1, x2, y1, y2 } = [...elves].reduce(
      ({ x1, x2, y1, y2 }, c) => {
        const [x, y] = c.split(",").map((n) => Number.parseInt(n));
        return {
          x1: Math.min(x1, x),
          x2: Math.max(x2, x),
          y1: Math.min(y1, y),
          y2: Math.max(y2, y),
        };
      },
      {
        x1: Number.MAX_SAFE_INTEGER,
        x2: Number.MIN_SAFE_INTEGER,
        y1: Number.MAX_SAFE_INTEGER,
        y2: Number.MIN_SAFE_INTEGER,
      },
    );
    const [dx, dy] = [x2 - x1 + 1, y2 - y1 + 1];
    return dx * dy - elves.size;
  },
  (arr: string[][]) => {
    const elves = new Set(
      arr.flatMap((a, y) =>
        a
          .map((c, x) => (c === "#" ? [x, y].join(",") : null))
          .filter((c) => c !== null),
      ) as string[],
    );
    let i = 0;
    let moved = true;
    while (moved) {
      const predictions = {} as Record<string, string[]>;
      for (const elf of elves) {
        const p = predict(elf, elves, i);
        if (p) {
          if (predictions[p] === undefined) {
            predictions[p] = [elf];
          } else {
            predictions[p].push(elf);
          }
        }
      }
      for (const pos in predictions) {
        const pre = predictions[pos];
        if (pre.length === 1) {
          elves.delete(pre[0]);
          elves.add(pos);
        }
      }
      moved = Object.values(predictions).some((e) => e.length === 1);
      i++;
    }
    return i;
  },
  {
    transform: (e) => e.split(""),
    sep: "\n",
  },
);
task.expect(110, 20);

if (import.meta.main) await task.execute();

export default task;
