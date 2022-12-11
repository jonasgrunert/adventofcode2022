import Solution from "./solution.ts";

for await (const file of Deno.readDir(".")) {
  if (file.isFile && file.name.match(/\d{2}\.ts/)) {
    const { default: sol }: { default: Solution<unknown, unknown> } =
      await import(`./${file.name}`);
    sol.filename = file.name;
    sol.reporter = (name, result) =>
      console.log(
        `${name}: ${
          typeof result === "string" ? result : Deno.inspect(result)
        }`,
      );
    sol.execute();
  }
}
