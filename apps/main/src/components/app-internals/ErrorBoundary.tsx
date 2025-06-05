import type { ComponentType, FC, GetDerivedStateFromError, PropsWithChildren, ReactNode } from "react"

import { Component } from "react"

export interface ErrorBoundaryProps extends PropsWithChildren {
	fallback?: ReactNode | ComponentType<{ error: unknown }>
}

interface ErrorBoundaryState {
	error?: unknown
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props)
		this.state = {}
	}

	// eslint-disable-next-line max-len
	static getDerivedStateFromError: GetDerivedStateFromError<ErrorBoundaryProps, ErrorBoundaryState> = (error) => ({
		error,
	})

	override componentDidCatch(error: Error) {
		this.setState({ error })
	}

	override render() {
		const {
			state: { error },
			props: { fallback: Fallback, children },
		} = this

		// eslint-disable-next-line no-nested-ternary
		return "error" in this.state ? typeof Fallback === "function" ? <Fallback error={error} /> : Fallback : children
	}
}

export const ErrorBoundaryError: FC<{ error: unknown }> = ({ error }) => (
	<div className="flex h-full w-full items-center justify-center">
		<p>An unhandled error occurred:</p>
		<blockquote>
			<code>
				{(() => {
					if (error instanceof Error) {
						return error.message
					}
					if (typeof error === "string") {
						return error
					}
					return JSON.stringify(error)
				})()}
			</code>
		</blockquote>
	</div>
)

/// Tanstack ?
// export const ErrorBoundaryTS = () => {
// 	const error = useRouteError()
// 	const { t } = useTranslation()
// 	// Constrain the generic type so we don't provide a non-existent key
// 	const statusCode = () => {
// 		if (!isRouteErrorResponse(error)) {
// 			return "500"
// 		}
// 		// Supported error code messages
// 		switch (error.status) {
// 			case 200:
// 				return "200"
// 			case 403:
// 				return "403"
// 			case 404:
// 				return "404"
// 			default:
// 				return "500"
// 		}
// 	}
// 	const errorStatusCode = statusCode()

// 	return (
// 		<div className="relative flex h-full min-h-screen w-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 placeholder-index sm:pt-8 sm:pb-16 dark:bg-white dark:from-blue-950 dark:to-blue-900">
// 			<div className="relative mx-auto max-w-[90rem] sm:px-6 lg:px-8">
// 				<div className="relative flex min-h-72 flex-col justify-center p-1 sm:overflow-hidden sm:rounded-2xl md:p-4 lg:p-6">
// 					<h1 className="w-full pb-2 text-center text-2xl text-red-600">{t(`error.${errorStatusCode}.title`)}</h1>
// 					<p className="w-full text-center text-lg dark:text-white">{t(`error.${errorStatusCode}.description`)}</p>
// 				</div>
// 			</div>
// 		</div>
// 	)
// }
