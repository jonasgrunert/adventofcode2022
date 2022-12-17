import Solution from "./solution.ts";

class Cave {
  #filled: Record<number, Set<number>> = {};
  #lowest = 0;

  constructor(rocks: [number, number][][]) {
    for (const r of rocks) this.addRocks(r);
    this.#lowest = Math.max(
      ...Object.values(this.#filled).flatMap((s) => [...s]),
    );
  }

  addRocks(rocks: [number, number][]) {
    for (let i = 0; i < rocks.length - 1; i++) {
      const ydis = rocks[i][0] - rocks[i + 1][0];
      for (let d = 0; d <= Math.abs(ydis); d++) {
        this.#fill(rocks[i][1], rocks[i][0] - Math.sign(ydis) * d);
      }
      const xdis = rocks[i][1] - rocks[i + 1][1];
      for (let d = 0; d <= Math.abs(xdis); d++) {
        this.#fill(rocks[i][1] - Math.sign(xdis) * d, rocks[i][0]);
      }
    }
  }

  #fill(x: number, y: number) {
    if (this.#filled[y]) {
      this.#filled[y].add(x);
    } else {
      this.#filled[y] = new Set([x]);
    }
  }

  sand(second = false): boolean {
    let y = 500;
    let top = 1;
    while (top < this.#lowest + 2) {
      if (this.#filled[y] === undefined) {
        if (second) {
          top++;
          continue;
        }
        return false;
      }
      if (!this.#filled[y].has(top)) {
        top++;
        continue;
      }
      if (this.#filled[y - 1] === undefined) {
        if (second) {
          top++;
          y--;
          continue;
        }
        return false;
      }
      if (!this.#filled[y - 1].has(top)) {
        top++;
        y--;
        continue;
      }
      if (this.#filled[y + 1] === undefined) {
        if (second) {
          top++;
          y++;
          continue;
        }
        return false;
      }
      if (!this.#filled[y + 1].has(top)) {
        top++;
        y++;
        continue;
      }
      if (top === 1 && y === 500) {
        return false;
      }
      this.#fill(top - 1, y);
      return true;
    }
    if (second) {
      this.#fill(top - 1, y);
      return true;
    }
    return false;
  }

  display() {
    for (let i = 0; i < 11; i++) {
      console.log(
        Object.entries(this.#filled)
          .map(([n, s]) => (s.has(i) ? "x" : "."))
          .join(""),
      );
    }
  }
}

const task = new Solution(
  (rocks: [number, number][][]) => {
    const cave = new Cave(rocks);
    let i = 0;
    while (cave.sand()) {
      i++;
    }
    return i;
  },
  (rocks: [number, number][][]) => {
    const cave = new Cave(rocks);
    let i = 0;
    while (cave.sand(true)) {
      i++;
    }
    return i + 1;
  },
  {
    transform: (a) =>
      a
        .split(" -> ")
        .map(
          (s) =>
            s.split(",").map((n) => Number.parseInt(n)) as [number, number],
        ),
    sep: "\n",
  },
);
task.expect(24, 93);

if (import.meta.main) await task.execute();

export default task;
