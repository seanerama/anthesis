import { defineConfig } from "vite";
export default defineConfig({
  envPrefix: "ANTHESIS_",
  build: { outDir: "../dist-viewer", emptyOutDir: true }
});
