import { readFile, readdir } from "node:fs/promises";
import esbuild from "esbuild";

const files = await readdir(import.meta.dirname);
const entries = files
  .filter((f) => /\d{2}.ts/.test(f))
  .map((f) => [import.meta.dirname, f].join("/"));
await esbuild.build({
  entryPoints: entries,
  bundle: true,
  splitting: true,
  outdir: import.meta.dirname + "/dist",
  format: "esm",
  target: "es2024",
});

export default function (eleventyConfig) {
  files
    .filter((f) => !/\d{2}.ts/.test(f))
    .forEach((s) => eleventyConfig.ignores.add("aoc2022" + "/" + s));
  eleventyConfig.addPassthroughCopy({ "dist/*.js": "aoc/2022" });
  eleventyConfig.addTemplateFormats("ts");
  eleventyConfig.addExtension("ts", {
    compile: (inputContent, inputPath) => {
      if (!/\d{2}.ts/.test(inputPath)) {
        return;
      }
      return () => inputContent;
    },
    getData: async (inputPath) => {
      if (!/\d{2}.ts/.test(inputPath)) {
        return { eleventyExcludeFromCollections: true };
      }
      const day = /(\d{2}).ts/.exec(inputPath)[1];
      const input = await readFile(
        inputPath.replace(/(\d{2}).ts/, (_, g) => `data/${g}_test.txt`)
      );
      return { input, day, layout: "aoc.njk" };
    },
    compileOptions: {
      permalink: (content, inputPath) => {
        if (!/\d{2}.ts/.test(inputPath)) {
          return false;
        }
        return (data) => `/aoc/${data.year}/${data.page.fileSlug}.html`;
      },
    },
  });
}
