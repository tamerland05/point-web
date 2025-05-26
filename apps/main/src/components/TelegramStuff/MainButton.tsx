import { memo, useEffect } from "react"

import { mainButton } from "@telegram-apps/sdk-react"
import type { ButtonProps } from "./types"

export const MainButtonTMA = memo(({ title, onClick, loading, disabled, hidden }: ButtonProps) => {
	// NOTE: if you see bug you can try add 'hidden' to deps
	useEffect(() => {
		if (onClick !== undefined) {
			mainButton.onClick(onClick)
			return () => mainButton.offClick(onClick)
		}

		mainButton.setParams({ isVisible: false })
		return undefined
	}, [onClick])

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
