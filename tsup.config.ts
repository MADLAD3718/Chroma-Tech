import { defineConfig } from 'tsup';

export default defineConfig({
    format: ["esm"],
    entry: ["./scripts/main.ts"],
    skipNodeModulesBundle: true,
    clean: true,
    outDir: "./behaviours/scripts",
    noExternal: ["@madlad3718/mcveclib"],
    sourcemap: true,
    minify: false
});
