import type { Config } from "tailwindcss"

const config: Pick<Config, "content" | "presets"> = {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "../../packages/ui/dist/**/*.js"],
}

export default config
