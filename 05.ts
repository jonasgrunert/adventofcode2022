import Solution from "./solution.ts";

type Port = string[][];

const moveRegex = /move (\d+) from (\d) to (\d)/;

const arrange = (port: Port, move: number[]) => {
  for (let i = 0; i < move[0]; i++) {
    port[move[2] - 1].push(port[move[1] - 1].pop()!);
  }
  return port;
};

const upgrade = (port: Port, move: number[]) => {
  port[move[2] - 1].push(
    ...port[move[1] - 1].splice(port[move[1] - 1].length - move[0], move[0]),
  );
  return port;
};

const predict =
  (func: (port: Port, move: number[]) => string[][]) => (arr: string[][][]) => {
    const port = arr[0]!;
    const instructions = arr[1].map((m) => m.map((n) => Number.parseInt(n)));
    return instructions
      .reduce(func, port)
      .map((n) => n.at(-1))
      .join("");
  };

const task = new Solution(predict(arrange), predict(upgrade), {
  transform: (e, i) => {
    if (i == 0) {
      const floors = e.split("\n").slice(0, -1);
      const stacks: string[][] = [];
      for (let i = 1; i < floors[0].length; i += 4) {
        stacks.push(
          floors
            .map((f) => f.at(i)!)
            .filter((f) => f !== " ")
            .sort(() => -1),
        );
      }
      return stacks;
    }
    return e.split("\n").map((s) => moveRegex.exec(s)!.slice(1));
  },
  sep: "\n\n",
});
task.expect("CMZ", "MCD");

if (import.meta.main) await task.execute();

export default task;
