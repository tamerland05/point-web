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
		</div>
	)
}
