import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts";
import { getNumber } from "./_util.ts";

for await (const file of Deno.readDir(".")) {
  if (file.isFile && file.name.match(/\d{2}\.ts/)) {
    const { default: sol } = await import(`./${file.name}`);
    sol.test = file.name.replace(/(\d{2}).ts/, (_, g) => `${g}_test`);
    if (sol.r1 !== undefined) {
      Deno.test(`${getNumber(file.name)} - Task 1`, async () => {
        assertEquals(await sol.result1, sol.r1);
      });
    }
    if (sol.r2 !== undefined) {
      Deno.test(`${getNumber(file.name)} - Task 2`, async () => {
        assertEquals(await sol.result2, sol.r2);
      });
    }
  }
}
