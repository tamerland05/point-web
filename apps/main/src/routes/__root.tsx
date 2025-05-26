import type { QueryClient } from "@tanstack/react-query"
import { createRootRouteWithContext } from "@tanstack/react-router"
import { Link, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { TonConnectUIProvider } from "@tonconnect/ui-react"

import { GetLanguageData } from "@/components/App/GetLanguageData"
import { ErrorBoundary, ErrorBoundaryError } from "@/components/ErrorBoundary"
import { ButtonsController } from "@/components/TelegramStuff"
import { StyledToaster } from "@/components/Toaster"

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient
}>()({
	component: RootComponent,
	notFoundComponent: () => {
		return (
			<div>
				<p>This is the notFoundComponent configured on root route</p>
				<Link to="/">Start Over</Link>
			</div>
		)
	},
})

function RootComponent() {
	return (
		<ErrorBoundary fallback={ErrorBoundaryError}>
			<TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">
				<div className="flex h-screen flex-col overflow-hidden bg-background">
					<Outlet />

					<ButtonsController />
				</div>

				<GetLanguageData />
				<StyledToaster />
				<TanStackRouterDevtools />
			</TonConnectUIProvider>
		</ErrorBoundary>
	)
}
