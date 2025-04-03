import Solution, {
  InputMissingError,
  NotImplementedError,
} from "./solution.ts";

Object.defineProperty(globalThis, "isTest", {
  value: false,
  writable: false,
  configurable: false,
  enumerable: false,
});

for (
  const file of [...Deno.readDirSync(".")].sort((a, b) =>
    a.name.localeCompare(b.name)
  )
) {
  if (file.isFile && file.name.match(/\d{2}\.ts/)) {
    const { default: sol }: { default: Solution<unknown, unknown> } =
      await import(`./${file.name}`);
    sol.filename = file.name;
    sol.reader = (n) => {
      try {
        return Deno.readTextFileSync(`data/${n}.txt`);
      } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
          throw new InputMissingError("File not found", { cause: err });
        }
        throw err;
      }
    };
    sol.reporter = (name, result, _, time) => {
      if (
        result instanceof InputMissingError ||
        result instanceof NotImplementedError
      ) {
        console.log(`${name}: SKIPPED (${time ?? "-"} ms)`);
      } else {
        console.log(
          `${name}: ${
            typeof result === "string" ? result : Deno.inspect(result)
          } (${time ?? "-"} ms)`,
        );
      }
    };
    sol.execute();
  }
}
