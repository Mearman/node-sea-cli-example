import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: "cjs",
  platform: "node",
  target: "node26",
  outDir: "dist",
  clean: true,
  exe: {
    outDir: "dist",
    fileName: "node-sea-cli-example",
  },
});
