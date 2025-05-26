import { useEffect } from "react"

import { useMatches } from "@tanstack/react-router"
import { hideBackButton, showBackButton } from "@telegram-apps/sdk-react"

const routesWithoutBB = ["/summary"]

export const BackButtonTMA = () => {
	const matches = useMatches()
	const backButtonExclude = matches.some((match) => routesWithoutBB.includes(match.pathname))

	useEffect(() => {
		hideBackButton()
	}, [])

	useEffect(() => {
		if (!backButtonExclude) {
			showBackButton()
		} else {
			hideBackButton()
		}

		return () => {
			hideBackButton()
		}
	}, [backButtonExclude])

	return null
}
