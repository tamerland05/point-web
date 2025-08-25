import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { globbySync } from "globby"
import preserveDirectives from "rollup-plugin-preserve-directives"
import { defineConfig, type PluginOption } from "vite"
import dtsPlugin from "vite-plugin-dts"
import createExternal from "vite-plugin-external"
import { iconsSpritesheet } from "vite-plugin-icons-spritesheet"
import tsconfigPaths from "vite-tsconfig-paths"

import pkg from "./package.json"

export default defineConfig({
  build: {
    lib: {
      entry: globbySync(["./src/primitives/*/index.tsx", "./src/utils/cn.ts"]),
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      onwarn(warning, defaultHandler) {
        if (warning.code === "SOURCEMAP_ERROR") return
        defaultHandler(warning)
      },
      output: {
        dir: "dist",
        preserveModules: true,
        preserveModulesRoot: "src",
      },
      plugins: [
        preserveDirectives({
          suppressPreserveModulesWarning: true,
        }),
      ],
      treeshake: true,
    },
    sourcemap: true,
  },
  plugins: [
    react(),
    tsconfigPaths(),
    tailwindcss(),

    // Check README.md for more info
    iconsSpritesheet([
      {
        fileName: "icon.svg",
        formatter: "biome",
        inputDir: "./resources/icons",
        outputDir: "./src/primitives/icon/icons",
        withTypes: true,
      },
      {
        fileName: "icon.svg",
        formatter: "biome",
        inputDir: "./resources/icons",
        outputDir: "../../apps/main/public",
        withTypes: false,
      },
    ]),

    createExternal({
      externalizeDeps: Object.keys(pkg.dependencies),
      nodeBuiltins: true,
    }) as PluginOption,
    dtsPlugin({
      compilerOptions: {
        noEmit: false,
        outDir: "dist",
        rootDir: "src",
        tsBuildInfoFile: "tsconfig.build.tsbuildinfo",
      },
      exclude: ["src/storybook-utils", "**/*.stories.tsx"],
      include: ["src/**/*.ts", "src/**/*.tsx"],
    }),
  ],
})
