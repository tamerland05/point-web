import * as Sentry from "@sentry/browser"
import { QueryClient, QueryClientProvider, keepPreviousData } from "@tanstack/react-query"

import { ErrorBoundary, ErrorBoundaryError } from "@/components/ErrorBoundary"
import { GetLanguageData } from "./GetLanguageData"

import { Layout } from "../Layout"
import { TMALayer } from "./TMALayer"

if (!import.meta.env.DEV && import.meta.env.VITE_GLITCHTIP_DSN) {
	Sentry.init({
		dsn: import.meta.env.VITE_GLITCHTIP_DSN,
		environment: "production",
	})
}

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 30000, // 30 sec
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			placeholderData: keepPreviousData,
		},
	},
})

export const App = () => (
	<ErrorBoundary fallback={ErrorBoundaryError}>
		<QueryClientProvider client={queryClient}>
			<TMALayer>
				<Layout platform={"ios"}>
					<div className="text-caption-1 text-minty-500">test</div>
				</Layout>
				<GetLanguageData />
			</TMALayer>
		</QueryClientProvider>
	</ErrorBoundary>
)
