import { memo, useEffect } from "react"

import { useAtomValue } from "jotai"

import { cn } from "@point/ui/cn"
import { Loader } from "@point/ui/loader"

import { isTmaEnvironmentAtom, mainButtonAtom, secondaryButtonAtom } from "@/atoms/ui"
import { mainButton, secondaryButton } from "@telegram-apps/sdk-react"

interface ButtonProps {
	title?: string
	onClick?: () => void
	loading?: boolean
	disabled?: boolean
	hidden?: boolean
}

const MainButtonTMA = memo(({ title, onClick, loading, disabled, hidden }: ButtonProps) => {
	useEffect(() => {
		if (onClick !== undefined) {
			mainButton.onClick(onClick)
			return () => mainButton.offClick(onClick)
		}

		mainButton.setParams({ isVisible: false })
		return undefined
	}, [onClick, hidden])

	useEffect(() => {
		if (loading) {
			mainButton.setParams({ isLoaderVisible: true })
		} else {
			mainButton.setParams({ isLoaderVisible: false })
		}
	}, [loading])

	useEffect(() => {
		if (disabled) {
			mainButton.setParams({ isEnabled: false })
		} else {
			mainButton.setParams({ isEnabled: true })
		}
	}, [disabled])

	useEffect(() => {
		if (title) {
			mainButton.setParams({ text: title })
		} else {
			mainButton.setParams({ text: "" })
		}
	}, [title])

	useEffect(() => {
		if (hidden) {
			mainButton.setParams({ isVisible: false })
		} else {
			mainButton.setParams({ isVisible: true })
		}
	}, [hidden])

	useEffect(() => {
		mainButton.setParams({
			isLoaderVisible: !!loading,
			isEnabled: !disabled,
			isVisible: !hidden,
			text: title || "",
		})
	}, [loading, disabled, hidden, title])

	return null
})

MainButtonTMA.displayName = "MainButtonTMA"

const SecondaryButtonTMA = memo(({ title, onClick, loading, disabled, hidden }: ButtonProps) => {
	useEffect(() => {
		if (onClick !== undefined) {
			secondaryButton.onClick(onClick)
			return () => secondaryButton.offClick(onClick)
		}
		return undefined
	}, [onClick])

	useEffect(() => {
		secondaryButton.setParams({
			isLoaderVisible: !!loading,
			isEnabled: !disabled,
			isVisible: !hidden,
			text: title || "",
		})
	}, [loading, disabled, hidden, title])

	return null
})
SecondaryButtonTMA.displayName = "SecondaryButtonTMA"

const WebButton = memo(
	({ title, onClick, loading, disabled, hidden, isSecondary }: ButtonProps & { isSecondary?: boolean }) => {
		const showButton = !!onClick && !!title && !hidden

		return (
			showButton && (
				<>
					<div className="h-20" />
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

export const MainButton = memo(() => {
	const isTma = useAtomValue(isTmaEnvironmentAtom)
	const mainProps = useAtomValue(mainButtonAtom)
	const secondaryProps = useAtomValue(secondaryButtonAtom)

	if (isTma && window.location.hostname !== "localhost") {
		return (
			<>
				<MainButtonTMA
					disabled={mainProps.disabled}
					hidden={mainProps.hidden}
					loading={mainProps.loading}
					title={mainProps.title}
					onClick={mainProps.onClick}
				/>
				{(secondaryProps.title || secondaryProps.onClick) && (
					<SecondaryButtonTMA
						disabled={secondaryProps.disabled}
						hidden={secondaryProps.hidden}
						loading={secondaryProps.loading}
						title={secondaryProps.title}
						onClick={secondaryProps.onClick}
					/>
				)}
			</>
		)
	}

	return (
		<>
			<WebButton
				disabled={mainProps.disabled}
				hidden={mainProps.hidden}
				loading={mainProps.loading}
				title={mainProps.title}
				onClick={mainProps.onClick}
			/>
			{(secondaryProps.title || secondaryProps.onClick) && (
				<WebButton
					disabled={secondaryProps.disabled}
					hidden={secondaryProps.hidden}
					isSecondary
					loading={secondaryProps.loading}
					title={secondaryProps.title}
					onClick={secondaryProps.onClick}
				/>
			)}
		</>
	)
})
MainButton.displayName = "MainButton"
