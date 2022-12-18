import Solution from "./solution.ts";

type Entry = {
  sx: number;
  sy: number;
  bx: number;
  by: number;
  dist: number;
};

const regEx = /x=(-?\d+), y=(-?\d+).*x=(-?\d+), y=(-?\d+)/;

function distance([x1, y1]: [number, number], [x2, y2]: [number, number]) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function inY(y: number, entries: Entry[]) {
  const points = new Set<number>();
  let count = 0;
  for (const { sx, sy, bx, by, dist } of entries) {
    if (sy === y) points.add(sx);
    if (by === y) points.add(bx);
    for (let d = sx - dist; d <= sx + dist; d++) {
      if (!points.has(d) && distance([sx, sy], [d, y]) <= dist) {
        count++;
        points.add(d);
      }
    }
  }
  return count;
}

function hasSensorInDistance(entries: Entry[]) {
  return (x: number, y: number) => {
    for (const { sx, sy, dist } of entries) {
      if (distance([sx, sy], [x, y]) <= dist) return false;
    }
    return true;
  };
}

const task = new Solution(
  (entries: Entry[]) => {
    return inY(globalThis.isTest ? 10 : 2000000, entries);
  },
  (entries: Entry[]) => {
    const check = hasSensorInDistance(entries);
    for (const { sx, sy, dist } of entries) {
      for (let d = 0; d <= dist + 1; d++) {
        for (const xsign of [-1, 1]) {
          for (const ysign of [-1, 1]) {
            const x = sx + d * xsign;
            const y = sy + (dist + 1 - d) * ysign;
            if (
              x >= 0 &&
              y >= 0 &&
              x <= (globalThis.isTest ? 20 : 4000000) &&
              y <= (globalThis.isTest ? 20 : 4000000) &&
              check(x, y)
            ) {
              return 4000000 * x + y;
            }
          }
        }
      }
    }
  },
  {
    transform: (a) => {
      const [sx, sy, bx, by] = regEx
        .exec(a)!
        .slice(1)
        .map((n) => Number.parseInt(n));
      return { sx, sy, bx, by, dist: distance([sx, sy], [bx, by]) };
    },
    sep: "\n",
  },
);
task.expect(26, 56000011);

if (import.meta.main) await task.execute();

export default task;
