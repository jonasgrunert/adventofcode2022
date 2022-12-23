import Solution from "./solution.ts";

const stones = ["-", "+", "⅃", "|", "■"] as const;

class Rock {
  #formation: number[][];
  #type: typeof stones[number];
  static #i = 0;

  constructor(shape: typeof stones[number], y = Number.MAX_SAFE_INTEGER) {
    this.#type = shape;
    switch (shape) {
      case "-": {
        this.#formation = Array.from({ length: 7 }, (_, i) =>
          i > 1 && i < 6 ? [y] : [],
        );
        break;
      }
      case "+": {
        this.#formation = Array.from({ length: 7 }, (_, i) => {
          if (i < 2 || i > 4) return [];
          if (i === 3) return [y, y + 1, y + 2];
          return [y + 1];
        });
        break;
      }
      case "⅃": {
        this.#formation = Array.from({ length: 7 }, (_, i) => {
          if (i < 2 || i > 4) return [];
          if (i === 4) return [y, y + 1, y + 2];
          return [y];
        });
        break;
      }
      case "|": {
        this.#formation = Array.from({ length: 7 }, (_, i) =>
          i === 2 ? [y, y + 1, y + 2, y + 3] : [],
        );
        break;
      }
      case "■": {
        this.#formation = Array.from({ length: 7 }, (_, i) =>
          i > 1 && i < 4 ? [y, y + 1] : [],
        );
        break;
      }
    }
  }

  get type() {
    return this.#type;
  }

  get bot() {
    return this.#formation
      .map((y, x) => ({ x, y: y[0] ?? -1 }))
      .filter(({ y }) => y !== -1);
  }

  get left() {
    return this.#formation
      .map((ys, x) => ys.map((y) => ({ x, y })))
      .filter((x) => x.length !== 0)
      .reduce(
        (prev, curr) =>
          prev.concat(
            curr.filter(({ y }) => !prev.some(({ y: py }) => py === y)),
          ),
        [],
      );
  }

  get right() {
    return this.#formation
      .map((ys, x) => ys.map((y) => ({ x, y })))
      .filter((x) => x.length !== 0)
      .reduceRight(
        (prev, curr) =>
          prev.concat(
            curr.filter(({ y }) => !prev.some(({ y: py }) => py === y)),
          ),
        [],
      );
  }

  get points() {
    return this.#formation.flatMap((ys, x) => ys.map((y) => ({ x, y })));
  }

  move(dir: ">" | "<" | "v"): void {
    switch (dir) {
      case ">": {
        const right = this.#formation.pop()!;
        if (right.length === 0) {
          this.#formation.unshift(right);
        } else {
          this.#formation.push(right);
        }
        break;
      }
      case "<": {
        const right = this.#formation.shift()!;
        if (right.length === 0) {
          this.#formation.push(right);
        } else {
          this.#formation.unshift(right);
        }
        break;
      }
      case "v": {
        for (let x = 0; x < this.#formation.length; x++) {
          for (let y = 0; y < this.#formation[x].length; y++) {
            this.#formation[x][y] -= 1;
          }
        }
        break;
      }
    }
  }

  static get i() {
    return this.#i;
  }

  static *rocks(max: number, offset = 5) {
    let y = 0 + offset;
    for (this.#i = 0; this.#i < max; this.#i++) {
      const shape = stones[this.#i % stones.length];
      y = yield new Rock(shape, y);
      y += offset;
    }
  }

  [Symbol.for("Deno.customInspect")]() {
    return Deno.inspect(this.#formation);
  }
}

class Wind {
  static #i = 0;

  static *gust(gusts: string[]) {
    for (this.#i = 0; this.#i < gusts.length; this.#i++) {
      yield gusts[this.#i] as ">" | "<";
      if (this.#i === gusts.length - 1) {
        this.#i = -1;
      }
    }
  }

  static get i() {
    return this.#i;
  }
}

function simulate(steps: number) {
  return (gusts: string[]) => {
    const cache = new Map<string, [number, number]>();
    const wind = Wind.gust(gusts);
    const cave = Array.from({ length: 7 }, () => [0]);
    const spawn = Rock.rocks(steps);
    let height = 0;
    let rock: IteratorResult<Rock, void>;
    while (!(rock = spawn.next(height)).done) {
      let settled = false;
      const key = [rock.value.type, Wind.i].join(",");
      if (cache.has(key)) {
        const [step, top] = cache.get(key)!;
        if ((steps - Rock.i) % (Rock.i - step) === 0) {
          return (
            height +
            (height - top) * Math.floor((steps - Rock.i) / (Rock.i - step))
          );
        }
      }
      while (!settled) {
        rock.value.move("v");
        const dir = wind.next().value!;
        if (
          !rock.value[dir === ">" ? "right" : "left"].some(({ x, y }) => {
            if (x === (dir === ">" ? cave.length - 1 : 0)) return true;
            return cave[x + (dir === ">" ? 1 : -1)].includes(y);
          })
        ) {
          rock.value.move(dir);
        }
        settled = rock.value.bot.some(({ x, y }) => {
          return cave[x].includes(y - 1);
        });
      }
      cache.set(key, [Rock.i, height]);
      rock.value.points.forEach(({ x, y }) => cave[x].push(y));
      height = Math.max(...cave.flat());
    }
    return height;
  };
}

const task = new Solution(simulate(2022), simulate(1000000000000), {
  sep: "",
});
task.expect(3068, 1514285714288);

if (import.meta.main) await task.execute();

export default task;
