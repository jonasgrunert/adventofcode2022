import Solution from "./solution.ts";

class Directory {
  #parent: Directory | null = null;
  #files = new Map<string, number>();
  #dirs = new Map<string, Directory>();
  #size?: number;

  static get root() {
    return new Directory();
  }

  get dirs(): Directory[] {
    return [...this.#dirs.values()].flatMap((dir) => dir.dirs).concat([this]);
  }

  get up() {
    return this.#parent!;
  }

  child(name: string) {
    return this.#dirs.get(name)!;
  }

  pushFile(name: string, size: number) {
    this.#files.set(name, size);
  }

  pushDirectory(name: string) {
    const dir = new Directory();
    dir.#parent = this;
    this.#dirs.set(name, dir);
  }

  get size() {
    if (this.#size !== undefined) return this.#size;
    let size = 0;
    for (const [_, fileSize] of this.#files) size += fileSize;
    for (const [_, dir] of this.#dirs) size += dir.size;
    this.#size = size;
    return size;
  }

  toJSON() {
    return {
      files: Object.fromEntries(this.#files.entries()),
      dirs: Object.fromEntries(this.#dirs.entries()),
    };
  }
}

const resultRegEx = /(dir|\d+) (.+)/;

const buildTree = (arr: string[]): Directory => {
  const root = Directory.root;
  let curr = root;
  for (const cmd of arr) {
    const [exec, ...result] = cmd.split("\n");
    if (exec.startsWith("cd")) {
      const [_, loc] = exec.split(" ");
      if (loc === "/") {
        curr = root;
      } else if (loc === "..") {
        curr = curr.up;
      } else {
        curr = curr.child(loc);
      }
    } else {
      for (const res of result) {
        const [_, size, name] = resultRegEx.exec(res)!;
        if (size === "dir") {
          curr.pushDirectory(name);
        } else {
          curr.pushFile(name, Number.parseInt(size));
        }
      }
    }
  }
  return root;
};

const task = new Solution(
  (arr: string[]) => {
    const tree = buildTree(arr);
    const small = tree.dirs.filter((d) => d.size < 100000);
    return small.reduce((p, c) => p + c.size, 0);
  },
  (arr: string[]) => {
    const tree = buildTree(arr);
    const small = tree.dirs
      .map((d) => d.size)
      .filter((d) => 70000000 - tree.size + d > 30000000)
      .sort((a, b) => a - b);
    return small[0];
  },
  {
    transform: (cmd) => cmd.replace("$ ", ""),
    sep: /[\n^]\$ /,
  }
);
task.expect(95437, 24933642);

export default task;
