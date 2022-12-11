import Solution from "./solution.ts";

const task = new Solution(
  (arr: Array<string | number>[]) => {
    let state = 1;
    let score = 0;
    let cycle = 0;
    for (const cmd of arr) {
      if (cmd[0] === "noop") {
        cycle++;
        if ((cycle - 20) % 40 === 0) {
          score += state * cycle;
        }
      } else {
        cycle++;
        if ((cycle - 20) % 40 === 0) {
          score += state * cycle;
        }
        cycle++;
        if ((cycle - 20) % 40 === 0) {
          score += state * cycle;
        }
        state += cmd[1] as number;
      }
    }
    return score;
  },
  (arr) => {
    const pixels: string[] = [];
    let state = 1;
    let cycle = 0;
    for (const cmd of arr) {
      if (cmd[0] === "noop") {
        pixels.push(
          cycle % 40 >= state - 1 && cycle % 40 <= state + 1 ? "#" : ".",
        );
        cycle++;
        if (cycle === 8) console.log();
      } else {
        pixels.push(
          cycle % 40 >= state - 1 && cycle % 40 <= state + 1 ? "#" : ".",
        );
        cycle++;
        pixels.push(
          cycle % 40 >= state - 1 && cycle % 40 <= state + 1 ? "#" : ".",
        );
        cycle++;
        state += cmd[1] as number;
      }
    }
    const display: string[][] = [];
    for (let i = 0; i < pixels.length; i += 40) {
      display.push(pixels.slice(i, i + 40));
    }
    return "\n" + display.map((n) => n.join("")).join("\n");
  },
  {
    transform: (a) =>
      a.split(" ").map((n, i) => (i === 1 ? Number.parseInt(n) : n)),
    sep: "\n",
  },
);
task.expect(
  13140,
  `
##..##..##..##..##..##..##..##..##..##..
###...###...###...###...###...###...###.
####....####....####....####....####....
#####.....#####.....#####.....#####.....
######......######......######......####
#######.......#######.......#######.....`,
);

if (import.meta.main) await task.execute();

export default task;
