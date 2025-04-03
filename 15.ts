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
  for (const { sx, sy, by, dist } of entries) {
    if (sy === y) points.add(sy);
    if (by === y) points.add(by);
    const d = distance([sx, sy], [sx, y]);
    for (let x = sx - (dist - d); x <= sx + (dist - d); x++) {
      if (!points.has(x)) {
        count++;
        points.add(x);
      }
    }
  }
  return count;
}

const task = new Solution(
  (entries: Entry[]) => {
    return inY(globalThis.isTest ? 10 : 2000000, entries);
  },
  (entries: Entry[]) => {
    const acoeffs = new Set<number>();
    const bcoeffs = new Set<number>();
    for (const { sx, sy, dist } of entries) {
      acoeffs.add(sy - sx + dist + 1);
      acoeffs.add(sy - sx - dist - 1);
      bcoeffs.add(sx + sy + dist + 1);
      bcoeffs.add(sx + sy - dist - +1);
    }
    for (const a of acoeffs) {
      for (const b of bcoeffs) {
        const p = [Math.floor((b - a) / 2), Math.floor((a + b) / 2)] as [
          number,
          number
        ];
        if (
          p.every((c) => 0 < c && c < (globalThis.isTest ? 20 : 4000000)) &&
          entries.every(({ dist, sx, sy }) => distance([sx, sy], p) > dist)
        ) {
          return 4000000 * p[0] + p[1];
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
  }
);
task.expect(26, 56000011);

export default task;
