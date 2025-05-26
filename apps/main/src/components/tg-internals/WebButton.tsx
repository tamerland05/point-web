import { cn } from "@point/ui/cn"
import { Loader } from "@point/ui/loader"
import { memo } from "react"
import type { ButtonProps } from "./types"

/*
 * For dev purposes: testing and debugging in browser
 */
export const WebButton = memo(
	({ title, onClick, loading, disabled, hidden, isSecondary }: ButtonProps & { isSecondary?: boolean }) => {
		const showButton = !!onClick && !!title && !hidden

		return (
			showButton && (
				<>
					<div className="h-34" />
					<div
						className={cn(
							"fixed right-0 left-0 z-50 bg-background",
							isSecondary
								? "bottom-16 mb-1 border-separator border-t-2 p-4"
								: "bottom-0 border-separator border-t-2 p-4"
						)}
					>
						<button
							className={cn(
								"w-full rounded-2xl p-3 font-medium disabled:opacity-50",
								isSecondary ? "bg-background-secondary text-accent" : "bg-accent text-white"
							)}
							disabled={loading || disabled}
							type="button"
							onClick={onClick}
						>
							{loading ? <Loader /> : title}
						</button>
					</div>
				</>
			)
		)
	}
)
WebButton.displayName = "WebButton"
