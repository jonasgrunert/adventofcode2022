import Solution from "./solution.ts";

const marker = (n: number) => (arr: string[]) => {
  let s: string[] = [];
  for (let i = 0; i < arr[0].length; i++) {
    const idx = s.findIndex((c) => c == arr[0][i]);
    if (idx !== undefined) s = s.slice(idx + 1);
    s.push(arr[0][i]);
    if (s.length === n) return i + 1;
  }
};

const task = new Solution(marker(4), marker(14));
task.expect(7, 19);

if (import.meta.main) await task.execute();

export default task;
