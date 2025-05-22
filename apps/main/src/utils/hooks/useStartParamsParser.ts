import { useEffect } from "react"

import type { LaunchParams } from "@telegram-apps/sdk-react"
import { useAtom } from "jotai"

import { referrerAtom } from "@/atoms/user"
import { StartParamsCodes } from "@/constants/launchParamsCodes"
import { isValidAddress } from "@point/shared/utils/isValidAddress"
import { useNavigate } from "@tanstack/react-router"

export const useStartParamsParser = (lp: LaunchParams) => {
	const navigate = useNavigate()

	const [referrer, setReferrer] = useAtom(referrerAtom)

	// NOTE: Enable debug mode to see all the methods sent and events received.
	useEffect(() => {
		if (!lp.tgWebAppStartParam) {
			return
		}

		let startParamsString = lp.tgWebAppStartParam

		if (startParamsString.startsWith(StartParamsCodes.DEBUG)) {
			import("eruda").then((lib) => lib.default.init())
			startParamsString = startParamsString.slice(StartParamsCodes.DEBUG.length)
		}

		if (lp.tgWebAppStartParam?.startsWith(StartParamsCodes.OPEN_TOP)) {
			// TODO: Implement open top
			return
		}

		if (lp.tgWebAppStartParam?.startsWith(StartParamsCodes.OPEN_FAVS)) {
			navigate({ to: "/selections/$id", params: { id: "blabla" } })
			return
		}

		if (isValidAddress(startParamsString)) {
			if (referrer) {
				return
			}

			setReferrer(startParamsString)
			return
		}

		if (startParamsString.startsWith(StartParamsCodes.REFERRER_ADDRESS)) {
			if (referrer) {
				return
			}

			const referrerAddress = startParamsString.slice(StartParamsCodes.REFERRER_ADDRESS.length + 1) // ref=

			if (!isValidAddress(referrerAddress)) {
				return
			}

			setReferrer(referrerAddress)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
}
