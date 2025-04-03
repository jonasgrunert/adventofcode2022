import Solution from "./solution.ts";

const checkVisible =
  (trees: number[][]) =>
  (x: number, y: number): number => {
    const height = trees[y][x];
    const west = Math.max(...trees[y].slice(0, x));
    if (west < height) return 1;
    const east = Math.max(...trees[y].slice(x + 1));
    if (east < height) return 1;
    const north = Math.max(...trees.slice(0, y).map((line) => line[x]));
    if (north < height) return 1;
    const south = Math.max(...trees.slice(y + 1).map((line) => line[x]));
    if (south < height) return 1;
    return 0;
  };

const dist = (line: number[], height: number) => {
  const idx = line.findIndex((h) => h >= height);
  if (idx === -1) return line.length;
  return idx + 1;
};

const scenicScore =
  (trees: number[][]) =>
  (x: number, y: number): number => {
    const height = trees[y][x];
    const west = dist(trees[y].slice(0, x).reverse(), height);
    const east = dist(trees[y].slice(x + 1), height);
    const north = dist(
      trees
        .slice(0, y)
        .map((line) => line[x])
        .reverse(),
      height
    );
    const south = dist(
      trees.slice(y + 1).map((line) => line[x]),
      height
    );
    return [north, west, east, south].reduce((p, c) => p * c);
  };

const task = new Solution(
  (trees: number[][]) => {
    let visible = 0;
    const check = checkVisible(trees);
    for (let y = 1; y < trees.length - 1; y++) {
      for (let x = 1; x < trees[y].length - 1; x++) {
        visible += check(x, y);
      }
    }
    return visible + (trees.length - 1) * 4;
  },
  (trees: number[][]) => {
    let score = 0;
    const check = scenicScore(trees);
    for (let y = 0; y < trees.length; y++) {
      for (let x = 0; x < trees[y].length; x++) {
        score = Math.max(score, check(x, y));
      }
    }
    return score;
  },
  {
    sep: "\n",
    transform: (a) => a.split("").map((n) => Number.parseInt(n)),
  }
);
task.expect(21, 8);

export default task;
