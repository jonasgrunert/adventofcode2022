import Solution from "./solution.ts";

const dir = [">", "<", "v", "^"];

function mod(n: number, m: number) {
  const x = n % m;
  return x < 0 ? x + m : x;
}

function render(blizzards: boolean[][][], nP: Set<string>, offset = 0) {
  const maxY = blizzards.length;
  const maxX = blizzards[0][0].length;
  for (let y = 0; y < maxY; y++) {
    const s: Array<number | string> = Array.from({ length: maxX }, () => 0);
    for (let i = 0; i < dir.length; i++) {
      for (let x = 0; x < maxX; x++) {
        let bx = x;
        let by = y;
        switch (i) {
          case 0: {
            bx = mod(x - offset, maxX);
            break;
          }
          case 1: {
            bx = mod(x + offset, maxX);
            break;
          }
          case 2: {
            by = mod(y - offset, maxY);
            break;
          }
          case 3: {
            by = mod(y + offset, maxY);
            break;
          }
        }
        if (nP.has([x, y].join(","))) {
          s[x] = "E";
        } else if (blizzards[by][i][bx]) {
          if (typeof s[x] === "string") {
            s[x] = 2;
          } else if (s[x] === 0) {
            s[x] = dir[i];
          } else {
            (s[x] as number)++;
          }
        }
      }
    }
    console.log(s.map((c) => (c === 0 ? "." : c)).join(""));
  }
}

function findPath(input: string[], amount: number) {
  const blizz = input.slice(1, -1).map((s) => s.slice(1, -1));
  const maxY = blizz.length;
  const maxX = blizz[0].length;
  const start = `0,-1`;
  const end = `${maxX - 1},${maxY}`;
  const blizzards = blizz.map((line) => {
    const b = dir.map(() => [] as boolean[]);
    for (const c of line) {
      const i = dir.indexOf(c);
      for (let j = 0; j < b.length; j++) {
        b[j].push(i === j);
      }
    }
    return b;
  }); // y[direction[x]]
  let visited = new Set([start]);
  let count = 0;
  const targets = Array.from({ length: amount }, (_, i) =>
    i % 2 === 0 ? end : start,
  );
  while (targets.length !== 0) {
    const newPoints = new Set<string>();
    count++;
    for (const point of visited)
      search: {
        const [x, y] = point.split(",").map((n) => Number.parseInt(n));
        for (const [dx, dy] of [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0],
          [0, 0],
        ]) {
          const p = [x + dx, y + dy];
          const ps = p.join(",");
          if (newPoints.has(ps)) {
            continue;
          }
          if (p[0] < 0 || p[1] < 0 || p[0] >= maxX || p[1] >= maxY) {
            if (ps === start || ps === end) {
              newPoints.add(ps);
            }
            if (ps === targets[0]) {
              targets.shift();
              newPoints.clear();
              newPoints.add(ps);
              break search;
            }
            continue;
          }
          if (
            blizzards[p[1]][0][mod(p[0] - count, maxX)] || // check for < bliizards
            blizzards[p[1]][1][mod(p[0] + count, maxX)] || // check for < bliizards
            blizzards[mod(p[1] - count, maxY)][2][p[0]] || // check for ^ bliizards
            blizzards[mod(p[1] + count, maxY)][3][p[0]] // check for v bliizards
          ) {
            continue;
          }
          newPoints.add(ps);
        }
      }
    visited = newPoints;
  }
  return count;
}

const task = new Solution(
  (arr: string[]) => {
    return findPath(arr, 1);
  },
  (arr: string[]) => {
    return findPath(arr, 3);
  },
  {
    sep: "\n",
  },
);
task.expect(18, 54);

if (import.meta.main) await task.execute();

export default task;
