import Solution from "./_util.ts";

const task = new Solution(
  (arr: { direction: string; length: number }[]) => {
    const positions = new Set<string>(["0,0"]);
    const tail = [0, 0];
    const head = [0, 0];
    for (const { direction, length } of arr) {
      for (let i = 0; i < length; i++) {
        switch (direction) {
          case "R": {
            head[0] += 1;
            break;
          }
          case "L": {
            head[0] -= 1;
            break;
          }
          case "U": {
            head[1] += 1;
            break;
          }
          case "D": {
            head[1] -= 1;
            break;
          }
        }
        const vert = head[0] - tail[0];
        const horz = head[1] - tail[1];
        if (Math.abs(vert) > 1 || Math.abs(horz) > 1) {
          tail[0] += Math.sign(vert);
          tail[1] += Math.sign(horz);
        }
        positions.add(tail.join(","));
      }
    }
    return positions.size;
  },
  (arr: { direction: string; length: number }[]) => {
    const positions = new Set<string>(["0,0"]);
    const rope: [number, number][] = Array.from({ length: 10 }, () => [0, 0]);
    for (const { direction, length } of arr) {
      for (let i = 0; i < length; i++) {
        switch (direction) {
          case "R": {
            rope[0][0] += 1;
            break;
          }
          case "L": {
            rope[0][0] -= 1;
            break;
          }
          case "U": {
            rope[0][1] += 1;
            break;
          }
          case "D": {
            rope[0][1] -= 1;
            break;
          }
        }
        for (let p = 1; p < rope.length; p++) {
          const vert = rope[p - 1][0] - rope[p][0];
          const horz = rope[p - 1][1] - rope[p][1];
          if (Math.abs(vert) > 1 || Math.abs(horz) > 1) {
            rope[p][0] += Math.sign(vert);
            rope[p][1] += Math.sign(horz);
          }
        }
        positions.add(rope.at(-1)!.join(","));
      }
    }
    return positions.size;
  },
  {
    transform: (a) => {
      const [direction, L] = a.split(" ");
      return { direction, length: Number.parseInt(L) };
    },
    sep: "\n",
  },
);
task.expect(13, 36);

if (import.meta.main) await task.execute();

export default task;
