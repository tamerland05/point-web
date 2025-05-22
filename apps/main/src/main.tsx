import { StrictMode } from "react"
import ReactDOM from "react-dom/client"

import { App } from "@/components/App"
import { EnvUnsupported } from "@/components/EnvUnsupported"

// Uncomment this import in case, you would like to develop the application even outside
// the Telegram application, just in your browser.
import "@/utils/mockEnv"

import "@point/i18n"

import "./index.css"

import { retrieveLaunchParams } from "@telegram-apps/sdk-react"
import { init } from "./init"

const rootElement = document.getElementById("root")

if (!rootElement) {
	throw new Error("Root element not found")
}

const root = ReactDOM.createRoot(rootElement)

try {
	const launchParams = retrieveLaunchParams()
	const { tgWebAppPlatform: platform } = launchParams
	const debug = (launchParams.tgWebAppStartParam || "").includes("debug") || import.meta.env.DEV

	// Configure all application dependencies.
	await init({
		debug,
		eruda: debug && ["ios", "android"].includes(platform),
		mockForMacOS: platform === "macos",
	}).then(() => {
		root.render(
			<StrictMode>
				<App />
			</StrictMode>
		)
	})
} catch (_e) {
	root.render(<EnvUnsupported />)
}
