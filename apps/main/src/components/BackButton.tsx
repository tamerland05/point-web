import { useEffect } from "react"

import { hideBackButton, showBackButton } from "@telegram-apps/sdk-react"
import { useAtomValue } from "jotai"

import { isTmaEnvironmentAtom } from "@/atoms/ui"

const backButtonExclude: string[] = ["/sumary"]

const BackButtonTMA = () => {
	useEffect(() => {
		hideBackButton()
	}, [])

	useEffect(() => {
		if (!backButtonExclude.includes(location.pathname)) {
			showBackButton()
		} else {
			hideBackButton()
		}

		return () => {
			hideBackButton()
		}
	}, [])

	return null
}

const BackButton = () => {
	const isTma = useAtomValue(isTmaEnvironmentAtom)

	if (isTma) return <BackButtonTMA />

	return null
}

export default BackButton
