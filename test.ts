import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts";
import Solution from "./solution.ts";

Object.defineProperty(globalThis, "isTest", {
  value: true,
  writable: false,
  configurable: false,
  enumerable: false,
});

for await (const file of Deno.readDir(".")) {
  if (file.isFile && file.name.match(/\d{2}\.ts/)) {
    const { default: sol }: { default: Solution<unknown, unknown> } =
      await import(`./${file.name}`);
    sol.filename = file.name;
    sol.reporter = (name, result, expect) =>
      Deno.test(name, () => {
        assertEquals(result, expect);
      });
    sol.execute();
  }
}
