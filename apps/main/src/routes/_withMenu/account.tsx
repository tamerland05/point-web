import { Link, createFileRoute } from "@tanstack/react-router"
import { expandViewport, requestFullscreen, requestLocation } from "@telegram-apps/sdk-react"
import { TonConnectButton } from "@tonconnect/ui-react"
import toast from "react-hot-toast"

export const Route = createFileRoute("/_withMenu/account")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div>
			Hello "/account"!
			<TonConnectButton />
			<div className="my-4 flex flex-col gap-2">
				<button
					className="rounded-md bg-accent px-4 py-2 text-white"
					type="button"
					onClick={async () => {
						try {
							const location = await requestLocation()
							toast(location)
						} catch (error) {
							toast.error(error instanceof Error ? error.message : "Unknown error")
						}
					}}
				>
					Request Location
				</button>

				<button
					className="rounded-md bg-accent px-4 py-2 text-white"
					type="button"
					onClick={() => {
						expandViewport()
					}}
				>
					Expand Viewport
				</button>

				<button
					className="rounded-md bg-accent px-4 py-2 text-white"
					type="button"
					onClick={() => {
						requestFullscreen()
					}}
				>
					Request Fullscreen
				</button>

				<Link className="mt-6 rounded-md bg-accent px-4 py-2 text-center text-white" to="/onboarding">
					Go to Onboarding
				</Link>
			</div>
			<code className="mt-auto flex flex-col items-center justify-center text-caption-1 text-text-secondary">
				<div>Point </div>
				<div>
					v{__APP_VERSION__} at {__COMMIT_HASH__}
				</div>
			</code>
		</div>
	)
}
