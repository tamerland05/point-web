import * as child from "node:child_process"
import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"

import tailwindcss from "@tailwindcss/vite"
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"
import basicSsl from "@vitejs/plugin-basic-ssl"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

import packageConfig from "./package.json"

let commitHash = "unknown"
try {
  commitHash = child.execSync("git rev-parse --short HEAD").toString()
} catch (_err) {
  // biome-ignore lint/suspicious/noConsole: its ok to use console.error here
  console.error("Failed to get commit hash. Running in this mode will not be supported.")
}

export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    basicSsl({
      name: "test",
      domains: ["*.local"],
      certDir: "./cert",
    }),

    tsconfigPaths(),
  ],

  server: {
    host: "point.local",
    port: 1111,
    proxy: {
      "/point-api": {
        target: "https://point-dev-back.meyson.tech/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/point-api/, ""),
      },
    },
  },

  define: {
    __APP_VERSION__: JSON.stringify(packageConfig.version),
    __COMMIT_HASH__: JSON.stringify(commitHash),
  },

  envDir: "../../",
})

console.log("process.env", process.env)

const rootEnvPath = resolve(__dirname, "../../.env")
const localEnvPath = resolve(__dirname, "./.env")

if (existsSync(rootEnvPath)) {
  console.log("Root .env contents:", readFileSync(rootEnvPath, "utf-8"))
}

if (existsSync(localEnvPath)) {
  console.log("Local .env contents:", readFileSync(localEnvPath, "utf-8"))
}
