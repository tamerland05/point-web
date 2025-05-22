import type { HTMLAttributes, ReactNode } from "react"

import { forwardRef } from "react"

import { cn } from "@/utils/cn"

interface ListProps {
	children: ReactNode
	withGap?: boolean
	onExpand?: () => void
	expandText?: string
	className?: string
	isExpandDisabled?: boolean
}

type Ref = HTMLDivElement

export const List = forwardRef<Ref, ListProps & HTMLAttributes<HTMLDivElement>>(
	(
		{ children, withGap = false, onExpand, expandText = "See All", className, isExpandDisabled, ...otherProps },
		ref
	) => (
		<div
			ref={ref}
			className={cn("flex flex-col", withGap ? "gap-3" : "rounded-2xl bg-background-secondary", className)}
			{...otherProps}
		>
			{children}
			{!!onExpand && (
				<button
					className="w-full self-center p-3 text-accent focus:text-accent-2"
					disabled={isExpandDisabled}
					type="button"
					onClick={onExpand}
				>
					{expandText}
				</button>
			)}
		</div>
	)
)

List.displayName = "List"
