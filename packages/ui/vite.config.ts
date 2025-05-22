import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { globbySync } from "globby"
import preserveDirectives from "rollup-plugin-preserve-directives"
import { type PluginOption, defineConfig } from "vite"
import dtsPlugin from "vite-plugin-dts"
import createExternal from "vite-plugin-external"
import { iconsSpritesheet } from "vite-plugin-icons-spritesheet"
import tsconfigPaths from "vite-tsconfig-paths"
import pkg from "./package.json"

export default defineConfig({
	plugins: [
		react(),
		tsconfigPaths(),
		tailwindcss(),

		// Check README.md for more info
		iconsSpritesheet([
			{
				inputDir: "./resources/icons",
				outputDir: "./src/primitives/icon/icons",
				fileName: "icon.svg",
				withTypes: true,
				formatter: "biome",
			},
			{
				inputDir: "./resources/icons",
				outputDir: "../../apps/main/public",
				fileName: "icon.svg",
				withTypes: false,
				formatter: "biome",
			},
		]),

		createExternal({
			nodeBuiltins: true,
			externalizeDeps: Object.keys(pkg.dependencies),
		}) as PluginOption,
		dtsPlugin({
			compilerOptions: {
				tsBuildInfoFile: "tsconfig.build.tsbuildinfo",
				outDir: "dist",
				rootDir: "src",
				noEmit: false,
			},
			include: ["src/**/*.ts", "src/**/*.tsx"],
			exclude: ["src/storybook-utils", "**/*.stories.tsx"],
		}),
	],
	build: {
		sourcemap: true,
		rollupOptions: {
			plugins: [
				preserveDirectives({
					suppressPreserveModulesWarning: true,
				}),
			],
			output: {
				preserveModules: true,
				preserveModulesRoot: "src",
				dir: "dist",
			},
			treeshake: true,
			onwarn(warning, defaultHandler) {
				if (warning.code === "SOURCEMAP_ERROR") return
				defaultHandler(warning)
			},
		},
		lib: {
			formats: ["es", "cjs"],
			entry: globbySync(["./src/primitives/*/index.tsx", "./src/utils/cn.ts"]),
		},
	},
})
