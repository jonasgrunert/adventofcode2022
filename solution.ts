declare global {
  // deno-lint-ignore no-var
  var isTest: true | undefined;
  // deno-lint-ignore no-var
  var document: {
    getElementById(elementId: string): null | {
      value: string;
    };
  };
}

type Reporter<O> = (name: string, result: O, expected?: O) => void;
type TaskFunction<T, O> = (data: T[]) => O;
type ReadOpts<T> = {
  transform?: (value: string, index: number, array: string[]) => T;
  sep?: string | RegExp;
};

function getInput(n: string, second = false) {
  if (globalThis.isTest) {
    if (second) {
      try {
        return Deno.readTextFileSync(`data/${n}_test2.txt`);
        // deno-lint-ignore no-empty
      } catch {}
    }
    return Deno.readTextFileSync(`data/${n}_test.txt`);
  } else {
    if (globalThis.Deno === undefined) {
      return document.getElementById("input")!.value;
    }
    return Deno.readTextFileSync(`data/${n}.txt`);
  }
}

const DefaultImplementation = () => {
  throw new Error("Not implemented");
};

class Solution<T, O1, O2 = O1> {
  #t1: TaskFunction<T, O1>;
  #t2: TaskFunction<T, O2>;
  #opts: Required<ReadOpts<T>>;
  #filename = "Unkown";
  #reporter: Reporter<O1 | O2> = DefaultImplementation;
  #r1?: O1;
  #r2?: O2;

  constructor(
    task1: TaskFunction<T, O1>,
    task2: TaskFunction<T, O2> | ReadOpts<T> = {
      transform: (data) => <T>(<unknown>data),
      sep: "\n",
    },
    opts: ReadOpts<T> = {
      transform: (data) => <T>(<unknown>data),
      sep: "\n",
    },
  ) {
    this.#t1 = task1;
    if (typeof task2 === "function") {
      this.#t2 = task2;
    } else {
      this.#t2 = DefaultImplementation;
    }
    this.#opts = Object.assign(
      {
        transform: (data: string) => <T>data,
        sep: "\n",
      },
      typeof task2 === "function" ? opts : task2,
    ) as Required<ReadOpts<T>>;
  }

  result1(input: T[]): O1 {
    return this.#t1(input);
  }

  result2(input: T[]): O2 {
    return this.#t2(input);
  }

  prepare(input: string): T[] {
    return input.split(this.#opts.sep).map(this.#opts.transform);
  }

  expect(r1?: O1, r2?: O2) {
    this.#r1 = r1;
    this.#r2 = r2;
  }

  execute() {
    if (this.#r1 !== undefined) {
      this.#reporter(
        `Day ${this.#filename} - Task 1`,
        this.result1(this.prepare(getInput(this.#filename))),
        this.#r1,
      );
    }
    if (this.#r2 !== undefined) {
      this.#reporter(
        `Day ${this.#filename} - Task 2`,
        this.result2(this.prepare(getInput(this.#filename, true))),
        this.#r2,
      );
    }
  }

  set filename(name: string) {
    this.#filename = name.match(/(?<num>\d{2}).ts/)?.groups?.num ?? "Unknown";
  }

  set reporter(report: Reporter<O1 | O2>) {
    this.#reporter = report;
  }
}

export default Solution;
