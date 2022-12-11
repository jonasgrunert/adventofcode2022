import Solution from "./_util.ts";

type Op = ["+" | "*", number | "old"];
type Test = [number, number, number];

class Monkey {
  #items: number[] = [];
  #op: Op;
  #test: Test;
  #inspections = 0;

  constructor(items: number[], op: Op, test: Test) {
    this.#items.push(...items);
    this.#op = op;
    this.#test = test;
  }

  throw(divider?: number) {
    const result: [number, number][] = [];
    while (this.#items.length > 0) {
      let item = this.#items.shift()!;
      const variable = this.#op[1] === "old" ? item : this.#op[1];
      if (this.#op[0] === "+") {
        item += variable;
      } else {
        item *= variable;
      }
      if (divider) {
        item = item % divider;
      } else {
        item = Math.floor(item / 3);
      }
      if (item % this.#test[0] === 0) {
        result.push([this.#test[1], item]);
      } else {
        result.push([this.#test[2], item]);
      }
      this.#inspections++;
    }
    return result;
  }

  catch(item: number) {
    this.#items.push(item);
  }

  toJSON() {
    return {
      items: this.#items,
      inspections: this.#inspections,
    };
  }

  get score() {
    return this.#inspections;
  }

  get divisibleBy() {
    return this.#test[0];
  }
}

const itemRegex = /Starting items: (.*)/;
const opRegex = /Operation: new = old ([\+\*]) (\d+|old)/;
const testRegex = /Test: divisible by (\d+)/;
const trueRegex = /If true: throw to monkey (\d)/;
const falseRegex = /If false: throw to monkey (\d)/;

const task = new Solution(
  (arr: Monkey[]) => {
    const monkeys = [...arr];
    for (let i = 0; i < 20; i++) {
      for (const monkey of monkeys) {
        const results = monkey.throw();
        for (const [id, item] of results) {
          monkeys[id].catch(item);
        }
      }
    }
    return monkeys
      .map((m) => m.score)
      .sort((a, b) => b - a)
      .slice(0, 2)
      .reduce((p, c) => p * c);
  },
  (arr: Monkey[]) => {
    const monkeys = [...arr];
    const divisibleBy = monkeys
      .map((m) => m.divisibleBy)
      .reduce((p, c) => p * c, 1);
    for (let i = 0; i < 10000; i++) {
      for (const monkey of monkeys) {
        const results = monkey.throw(divisibleBy);
        for (const [id, item] of results) {
          monkeys[id].catch(item);
        }
      }
    }
    return monkeys
      .map((m) => m.score)
      .sort((a, b) => b - a)
      .slice(0, 2)
      .reduce((p, c) => p * c);
  },
  {
    transform: (a) => {
      const items: number[] = [];
      const op: Op = ["*", 0];
      const test: Test = [0, 0, 0];
      const arr = a.split("\n");
      for (let i = 1; i < arr.length; i++) {
        switch (i) {
          case 1: {
            items.push(
              ...itemRegex
                .exec(arr[i])![1]
                .split(", ")
                .map((n) => Number.parseInt(n)),
            );
            break;
          }
          case 2: {
            const res = opRegex.exec(arr[i])!.slice(1);
            op[0] = res[0] as "+" | "*";
            op[1] = res[1] === "old" ? "old" : Number.parseInt(res[1]);
            break;
          }
          case 3: {
            test[0] = Number.parseInt(testRegex.exec(arr[i])![1]);
            break;
          }
          case 4: {
            test[1] = Number.parseInt(trueRegex.exec(arr[i])![1]);
            break;
          }
          case 5: {
            test[2] = Number.parseInt(falseRegex.exec(arr[i])![1]);
            break;
          }
        }
      }
      return new Monkey(items, op, test);
    },
    sep: "\n\n",
  },
);
task.expect(10605, 2713310158);

if (import.meta.main) await task.execute();

export default task;
