import Solution from "./solution.ts";

const regEx = /Valve (\w{2}).*rate=(-?\d+);.*valves? (.*)/;

function findShortestPaths(
  valves: Map<string, Valve>
): [Valve, Map<string, Valve>] {
  const nodes = new Set([...valves.values()]);
  for (const k of nodes) {
    for (const i of nodes) {
      for (const j of nodes) {
        const dist =
          valves.get(i.name)!.pathTo(k.name) +
          valves.get(k.name)!.pathTo(j.name);
        if (dist < valves.get(i.name)!.pathTo(j.name)) {
          valves.get(i.name)!.setPath(j.name, dist);
          valves.get(j.name)!.setPath(i.name, dist);
        }
      }
    }
  }
  const start = valves.get("AA")!;
  for (const key of valves.keys()) {
    if (valves.get(key)!.value === 0) {
      valves.delete(key);
    }
  }
  return [start, valves];
}

class Cache {
  #map = new Map<string, number>();

  #key(time: number, visited: Set<string>) {
    return [time, ...visited].join(",");
  }

  set(time: number, visited: Set<string>, value: number) {
    const key = this.#key(time, visited);
    this.#map.set(key, Math.max(value, this.get(time, visited)));
    return this;
  }

  get(time: number, visited: Set<string>) {
    const key = this.#key(time, visited);
    return this.#map.get(key) ?? 0;
  }

  team() {
    const arr = [...this.#map].sort(([, v1], [, v2]) => v2 - v1);
    let best = 0;
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (!doSetIntersect(arr[i][0], arr[j][0])) {
          best = Math.max(best, arr[i][1] + arr[j][1]);
          break;
        }
      }
      if (arr[i][1] < best / 2) {
        break;
      }
    }
    return best;
  }
}

function dfs2(start: Valve, time: number, matrix: Map<string, Valve>): number {
  const cache = new Cache();
  function calc(from: Valve, minutes: number, visited: Set<string>): void {
    for (const [name, valve] of matrix) {
      if (!visited.has(name)) {
        const future = from.pathTo(name) + minutes + 1;
        if (future >= time) {
          cache.set(time - 1, visited, cache.get(minutes, visited));
        } else {
          const newVisited = new Set(visited).add(name);
          const newValue = valve.value * (time - future);
          cache.set(future, newVisited, newValue + cache.get(minutes, visited));
          if (visited.size === matrix.size) {
            cache.set(time - 1, visited, cache.get(future, newVisited));
          } else {
            calc(valve, future, newVisited);
          }
        }
      }
    }
  }
  calc(start, 0, new Set());
  return cache.team();
}

function takeOne(matrix: Map<string, Valve>): [Valve, Map<string, Valve>][] {
  return [...matrix].map(([_, start], i, all) => [
    start,
    new Map([...all].filter((_, x) => i !== x)),
  ]);
}

function dfs1(start: Valve, time: number, matrix: Map<string, Valve>): number {
  const cache = new Map<string, number>();
  function calc(
    start: Valve,
    minutes: number,
    matrix: Map<string, Valve>
  ): number {
    const key = [start.name, minutes, [...matrix.keys()].join("_")].join(",");
    if (cache.has(key)) return cache.get(key)!;
    if (minutes === 0) {
      return 0;
    }
    const val = start.value * (minutes - 1);
    const newValue = Math.max(
      val,
      ...takeOne(matrix)
        .filter(([v]) => start.pathTo(v.name) < minutes)
        .map(([v, m]) => val + calc(v, minutes - start.pathTo(v.name) - 1, m))
    );
    cache.set(key, newValue);
    return newValue;
  }
  return calc(start, time + 1, matrix);
}

function doSetIntersect(a: string, b: string) {
  const s = a.split(",").slice(1);
  for (const v of s) {
    if (b.includes(v)) return true;
  }
  return false;
}

class Valve {
  #name: string;
  #value: number;
  #leadsTo: Map<string, number>;

  constructor(line: string) {
    const [_, name, value, valves] = regEx.exec(line)!;
    this.#name = name;
    this.#value = Number.parseInt(value);
    this.#leadsTo = new Map(valves.split(", ").map((d) => [d, 1]));
    this.#leadsTo.set(name, 0);
  }

  pathTo(ident: string): number {
    return this.#leadsTo.get(ident) ?? Number.MAX_SAFE_INTEGER;
  }

  setPath(ident: string, length: number) {
    return this.#leadsTo.set(ident, length);
  }

  get name() {
    return this.#name;
  }

  get value() {
    return this.#value;
  }

  [Symbol.for("Deno.customInspect")]() {
    return Deno.inspect(this.#leadsTo);
  }
}

const task = new Solution(
  (entries: Valve[]) => {
    const [start, valves] = findShortestPaths(
      new Map(entries.map((v) => [v.name, v]))
    );
    return dfs1(start, 30, valves);
  },
  (entries: Valve[]) => {
    const [start, valves] = findShortestPaths(
      new Map(entries.map((v) => [v.name, v]))
    );
    return dfs2(start, 26, valves);
  },
  {
    transform: (a) => new Valve(a),
    sep: "\n",
  }
);
task.expect(1651, 1707);

export default task;
