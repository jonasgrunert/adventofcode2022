import * as esbuild from "https://deno.land/x/esbuild@v0.17.5/mod.js";

await esbuild.build({
  entryPoints: [...Deno.readDirSync(".")]
    .map((f) => f.name)
    .filter((f) => /\d{2}\.ts/.test(f)),
  inject: ["./polyfill.js"],
  bundle: true,
  splitting: true,
  minify: true,
  outdir: "dist",
  format: "esm",
});

const html = await Deno.readTextFile("./index.template");
const files: string[] = [];
for await (const f of Deno.readDir("./")) {
  if (f.isFile) {
    const res = /(\d{2})\.ts/.exec(f.name);
    if (res !== null) files.push(res[1]);
  }
}
await Deno.writeTextFile(
  "./index.html",
  html
    .replace(
      "{{#options}}",
      files.map((t) => `<option>${t}</option>`).join("\n"),
    )
    .replace("{{#UMAMI_KEY}}", Deno.env.get("UMAMI_KEY")!)
    .replace("{{#UMAMI_URL}}", Deno.env.get("UMAMI_URL")!),
);

esbuild.stop();
Deno.exit(0);
