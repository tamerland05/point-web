import type { Config } from "tailwindcss"

const config: Pick<Config, "content" | "presets"> = {
	content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
}

export default config
