import { toFileUrl } from "https://deno.land/std@0.116.0/path/mod.ts";

function readFileToArray<O>(
  transform: (value: string, index: number, array: string[]) => O = (data) =>
    <O>(<unknown>data),
  sep: string | RegExp = "\n",
  filename: string | false = false
): Promise<O[]> {
  const url = filename
    ? toFileUrl(`${Deno.cwd()}/data/${filename}.txt`)
    : new URL(Deno.mainModule.replace(/(\d{2}).ts/, (_, d) => `data/${d}.txt`));
  return Deno.readTextFile(url).then((s) => s.split(sep).map(transform));
}

let i = 1;

function solution(sol: unknown) {
  console.log(
    `${getNumber()} - Task ${i}: ${
      typeof sol === "string" ? sol : Deno.inspect(sol)
    }`
  );
  i++;
}

if (import.meta.main) {
  for await (const dir of Deno.readDir(".")) {
    if (dir.isFile && dir.name.match(/\d{2}\.ts/)) {
      const proc = Deno.run({
        cmd: ["deno", "run", "--allow-read", `./${dir.name}`],
      });
      await proc.status();
    }
  }
}

const DefaultImplementation = () => {
  throw new Error("Not implemented");
};

type TaskFunction<T, O> = (data: T[]) => O;
type ReadOpts<T> = {
  transform?: (value: string, index: number, array: string[]) => T;
  sep?: string | RegExp;
};

class Solution<T, O1, O2 = O1> {
  readonly #t1: TaskFunction<T, O1>;
  readonly #t2: TaskFunction<T, O2>;
  readonly #opts: ReadOpts<T>;
  #test: string | false = false;
  r1?: O1;
  r2?: O2;

  constructor(
    task1: TaskFunction<T, O1>,
    task2: TaskFunction<T, O2> | ReadOpts<T> = {
      transform: (data) => <T>(<unknown>data),
      sep: "\n",
    },
    opts: ReadOpts<T> = {
      transform: (data) => <T>(<unknown>data),
      sep: "\n",
    }
  ) {
    this.#t1 = task1;
    if (typeof task2 === "function") {
      this.#t2 = task2;
      this.#opts = opts;
    } else {
      this.#t2 = DefaultImplementation;
      this.#opts = task2;
    }
  }

  get result1() {
    return readFileToArray(
      this.#opts.transform,
      this.#opts.sep,
      this.#test
    ).then((d) => this.#t1(d));
  }

  get result2() {
    return readFileToArray(
      this.#opts.transform,
      this.#opts.sep,
      this.#test
    ).then((d) => this.#t2(d));
  }

  async execute() {
    solution(await this.result1);
    solution(await this.result2);
  }

  expect(r1?: O1, r2?: O2) {
    this.r1 = r1;
    this.r2 = r2;
  }

  set test(val: string) {
    this.#test = val;
  }
}

export default Solution;

export function getNumber(name?: string): string {
  const n = name ?? Deno.mainModule;
  return n.match(/(?<num>\d{2}).ts/)?.groups?.num ?? "Unknown";
}
