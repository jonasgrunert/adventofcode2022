import Solution from "./solution.ts";

const BlueprintRegEx =
  /(\d+):.*(\d+) ore.*(\d+) ore.*(\d+) ore and (\d+) clay.*(\d+) ore and (\d+) obsidian/;

type Tuple = [number, number, number, number];
type Blueprint = [Tuple, Tuple, Tuple, Tuple];

type State = {
  time: number;
  robots: Tuple;
  materials: Tuple;
};

function assemble(blueprint: Blueprint, time: number) {
  function maxProd(state: State) {
    let { materials, robots } = state;
    for (let i = state.time; i < time; i++) {
      const newMaterials = materials.map((v, i) => v + robots[i]) as Tuple;
      robots = robots.map((r, i) => {
        const constructable = blueprint[i].every((v, j) => v <= materials[j]);
        if (constructable) {
          for (let m = 1; m < blueprint[i].length; m++) {
            newMaterials[m] -= blueprint[i][m];
          }
        }
        return r + (constructable ? 1 : 0);
      }) as Tuple;
      materials = newMaterials;
    }
    return materials[3];
  }
  const maxNeeded = Array.from({ length: 4 }, (_, i) =>
    Math.max(...blueprint.map((a) => a[i]))
  );
  maxNeeded[3] = Number.MAX_SAFE_INTEGER;
  const init: State = {
    time: 0,
    robots: [1, 0, 0, 0],
    materials: [0, 0, 0, 0],
  };
  let best = 0;
  const stack = [init];
  const cache = new Set<string>();
  while (stack.length > 0) {
    const state = stack.pop()!;
    const key = [state.time, ...state.robots, ...state.materials].join(",");
    if (cache.has(key)) continue;
    if (state.time >= time) {
      best = Math.max(best, state.materials[3]);
      continue;
    }
    if (maxProd(state) <= best) continue;
    for (let i = 0; i < 5; i++) {
      if (
        blueprint[i]?.every((v, j) => v <= state.materials[j]) &&
        state.robots[i] < maxNeeded[i]
      ) {
        const nextState = {
          time: state.time + 1,
          robots: state.robots.map((r, j) => (j === i ? r + 1 : r)) as Tuple,
          materials: state.materials.map(
            (v, j) => v + state.robots[j] - blueprint[i][j]
          ) as Tuple,
        };
        stack.push(nextState);
      } else {
        const nextState = {
          time: state.time + 1,
          robots: [...state.robots] as Tuple,
          materials: state.materials.map(
            (v, j) => v + state.robots[j]
          ) as Tuple,
        };
        stack.push(nextState);
      }
      cache.add(key);
    }
    stack.sort((s1, s2) => {
      const freq = s1.materials[3] / s1.time - s2.materials[3] / s2.time;
      if (freq !== 0) return freq;
      const time = s1.time - s2.time;
      if (time !== 0) return time;
      return maxProd(s1) - maxProd(s2);
    });
  }
  return best;
}

const task = new Solution(
  (blueprints: Blueprint[]) => {
    return blueprints.reduce((p, c, i) => (i + 1) * assemble(c, 24) + p, 0);
  },
  (blueprints: Blueprint[]) => {
    return blueprints.slice(0, 3).reduce((p, c) => assemble(c, 32) * p, 1);
  },
  {
    transform: (b) => {
      const [_, ore, clay, obs1, obs2, geo1, geo2] = BlueprintRegEx.exec(b)!
        .slice(1)
        .map((n) => Number.parseInt(n));
      return [
        [ore, 0, 0, 0],
        [clay, 0, 0, 0],
        [obs1, obs2, 0, 0],
        [geo1, 0, geo2, 0],
      ] as Blueprint;
    },
    sep: "\n",
  }
);
task.expect(33 /*,56 * 62*/);

export default task;
