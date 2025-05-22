import type React from "react"
import { useEffect } from "react"

import { viewport } from "@telegram-apps/sdk-react"

import { PageLoader } from "@point/ui/loader"

export const TMALayer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	useEffect(() => {
		if (!viewport) return

		viewport.expand()
	}, [viewport])

	if (!viewport) return <PageLoader />

	return children
}
