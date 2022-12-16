import Solution from "./solution.ts";

class Point {
  #value: string;
  previous?: Point;
  distance = Number.MAX_SAFE_INTEGER;
  #x: number;
  #y: number;

  constructor(value: string, x: number, y: number) {
    this.#value = value;
    if (value === "S") {
      this.distance = 0;
    }
    this.#x = x;
    this.#y = y;
  }

  compare(p: Point) {
    return this.value.charCodeAt(0) - p.value.charCodeAt(0);
  }

  newPath(p: Point) {
    if (this.distance > p.distance + 1) {
      this.distance = p.distance + 1;
      this.previous = p;
    }
  }

  get value() {
    if (this.#value === "S") return "a";
    if (this.#value === "E") return "z";
    return this.#value;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  get isEnd() {
    return this.#value === "E";
  }

  get isStart() {
    return this.#value === "a";
  }
}

const task = new Solution(
  (map: Point[][]) => {
    const distance = map.flat(2).sort((a, b) => b.distance - a.distance);
    while (distance.length > 0) {
      const point = distance.pop()!;
      for (const p of [
        map[point.y - 1]?.[point.x],
        map[point.y + 1]?.[point.x],
        map[point.y]?.[point.x - 1],
        map[point.y]?.[point.x + 1],
      ]) {
        if (p && distance.includes(p) && point.compare(p) > -2) {
          p.newPath(point);
        }
      }
      if (point.isEnd) {
        return point.distance;
      }
      distance.sort((a, b) => b.distance - a.distance);
    }
    return 0;
  },
  (map: Point[][]) => {
    const distance = map
      .flat(2)
      .map((p) => {
        if (p.distance === 0) p.distance = Number.MAX_SAFE_INTEGER;
        if (p.isEnd) p.distance = 0;
        return p;
      })
      .sort((a, b) => b.distance - a.distance);
    while (distance.length > 0) {
      const point = distance.pop()!;
      for (const p of [
        map[point.y - 1]?.[point.x],
        map[point.y + 1]?.[point.x],
        map[point.y]?.[point.x - 1],
        map[point.y]?.[point.x + 1],
      ]) {
        if (p && distance.includes(p) && point.compare(p) < 2) {
          p.newPath(point);
        }
      }
      if (point.isStart) {
        return point.distance;
      }
      distance.sort((a, b) => b.distance - a.distance);
    }
    return 0;
  },
  {
    transform: (a, y) => a.split("").map((s, x) => new Point(s, x, y)),
    sep: "\n",
  },
);
task.expect(31, 29);

if (import.meta.main) await task.execute();

export default task;
