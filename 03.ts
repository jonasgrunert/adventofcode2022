import Solution from "./_util.ts";

const task = new Solution(
  (arr: string[][]) =>
    arr
      .map((e) => {
        const [left, right] = [
          e.slice(0, e.length / 2),
          e.slice(e.length / 2),
        ].map((m) => new Set(m));
        const intersection = new Set<string>();
        for (const char of left) {
          if (right.has(char)) intersection.add(char);
        }
        let prio = 0;
        for (const char of intersection) {
          const code = char.charCodeAt(0);
          if (code < 96) {
            prio += code - 64 + 26;
          } else {
            prio += code - 96;
          }
        }
        return prio;
      })
      .reduce((p, c) => p + c, 0),
  (arr: string[][]) => {
    let prio = 0;
    while (arr.length > 0) {
      const [f, s, t] = arr.slice(0, 3).map((m) => new Set(m));
      const intersection = new Set<string>();
      for (const char of f) {
        if (s.has(char) && t.has(char)) intersection.add(char);
      }
      for (const char of intersection) {
        const code = char.charCodeAt(0);
        if (code < 96) {
          prio += code - 64 + 26;
        } else {
          prio += code - 96;
        }
      }
      arr = arr.slice(3);
    }
    return prio;
  },
  {
    transform: (e) => e.split(""),
    sep: "\n",
  },
);
task.expect(157, 70);

if (import.meta.main) await task.execute();

export default task;
