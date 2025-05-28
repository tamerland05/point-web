import type { QueryClient } from "@tanstack/react-query"
import { createRootRouteWithContext, useMatches } from "@tanstack/react-router"
import { Link, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { TonConnectUIProvider } from "@tonconnect/ui-react"

import { ErrorBoundary, ErrorBoundaryError } from "@/components/app-internals/ErrorBoundary"
import { GetLanguageData } from "@/components/app-internals/GetLanguageData"
import { StyledToaster } from "@/components/app-internals/Toaster"
import { ButtonsController } from "@/components/tg-internals"
import { useSignal } from "@telegram-apps/sdk-react"
import { viewport } from "@telegram-apps/sdk-react"
import { useMemo } from "react"

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
	const inset = useSignal(viewport.safeAreaInsets)
	const contentInset = useSignal(viewport.contentSafeAreaInsets)

	const tgSpacesStyle = useMemo(
		() => ({
			paddingTop: inset.top + contentInset.top,
			paddingLeft: inset.left,
			paddingRight: inset.right,
		}),
		[inset, contentInset]
	)

	const matches = useMatches({ select: (matches) => matches.map((match) => match.fullPath) })
	const disableTgSpaces = matches.includes("/map") || matches.includes("/earn") || matches.includes("/selections")

	return (
		<ErrorBoundary fallback={ErrorBoundaryError}>
			<TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">
				<div
					className="flex h-screen flex-col overflow-hidden bg-background"
					style={disableTgSpaces ? {} : tgSpacesStyle}
				>
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
