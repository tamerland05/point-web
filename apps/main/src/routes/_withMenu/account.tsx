import { Link, createFileRoute } from "@tanstack/react-router"
import { TonConnectButton } from "@tonconnect/ui-react"

export const Route = createFileRoute("/_withMenu/account")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div>
			Hello "/account"!
			<Link to="/onboarding">Onboarding</Link>
			<TonConnectButton />
			<code className="mt-auto flex flex-col items-center justify-center text-caption-1 text-text-secondary">
				<div>Point </div>
				<div>
					v{__APP_VERSION__} at {__COMMIT_HASH__}
				</div>
			</code>
		</div>
	)
}
