import Solution from "./solution.ts";

function* sides(coords: number[]) {
  for (let i = 0; i < coords.length; i++) {
    for (const sign of [-1, 1]) {
      yield coords.map((v, x) => (i === x ? v + sign : v)).join(",");
    }
  }
}

function flood(bounds: number[], cubes: string[]) {
  const toCheck = [[bounds[0], bounds[2], bounds[4]].join(",")];
  const flood = new Set<string>();
  while (toCheck.length > 0) {
    const field = toCheck.pop()!;
    const c = field.split(",").map((n) => Number.parseInt(n));
    flood.add(field);
    for (const side of sides(c)) {
      const c = side.split(",").map((n) => Number.parseInt(n));
      if (
        !cubes.includes(side) &&
        !flood.has(side) &&
        c.every((a, i) => bounds[i * 2] <= a && a <= bounds[i * 2 + 1])
      ) {
        toCheck.push(side);
      }
    }
  }
  return flood;
}

const task = new Solution(
  (strings: string[]) => {
    let count = 0;
    for (const cube of strings) {
      const coords = cube.split(",").map((n) => Number.parseInt(n));
      for (const n of sides(coords)) {
        if (!strings.includes(n)) count++;
      }
    }
    return count;
  },
  (strings: string[]) => {
    const bounds = [
      Number.MAX_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
    ];
    for (const cube of strings) {
      const coords = cube.split(",").map((n) => Number.parseInt(n));
      coords.forEach((c, i) => {
        bounds[i * 2] = Math.min(c - 1, bounds[i * 2]);
        bounds[i * 2 + 1] = Math.max(c + 1, bounds[i * 2 + 1]);
      });
    }
    const outward = flood(bounds, strings);
    let count = 0;
    for (const cube of strings) {
      for (const side of sides(
        cube.split(",").map((n) => Number.parseInt(n))
      )) {
        if (outward.has(side)) {
          count++;
        }
      }
    }
    return count;
  },
  {
    sep: "\n",
  }
);
task.expect(64, 58);

export default task;
