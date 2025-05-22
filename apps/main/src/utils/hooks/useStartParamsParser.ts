import { useEffect } from "react"

import type { LaunchParams } from "@telegram-apps/sdk-react"
import { useAtom, useSetAtom } from "jotai"

import { tonConnectParamsAtom } from "@/atoms/tonConnect"
import { referrerAtom } from "@/atoms/user"
import { StartParamsCodes } from "@/constants/launchParamsCodes"
import { AppRoute } from "@/constants/routes"

export const useStartParamsParser = (lp: LaunchParams) => {
	const navigate = useNavigate()

	const [referrer, setReferrer] = useAtom(referrerAtom)
	const setTonConnectParams = useSetAtom(tonConnectParamsAtom)

	// NOTE: Enable debug mode to see all the methods sent and events received.
	useEffect(() => {
		if (!lp.initData?.startParam) {
			return
		}

		let startParamsString = lp.initData.startParam

		if (startParamsString.startsWith(StartParamsCodes.TON_CONNECT)) {
			// NOTE: handle sign/send tx
			if (startParamsString === "tonconnect-ret__back") {
				return
			}

			// NOTE: handle connect wallet
			const decoded = decodeTonConnectStartAppParams(startParamsString)
			const params = parseTonConnectUrl("?" + decoded.slice(StartParamsCodes.TON_CONNECT.length + 1))
			setTonConnectParams(params)

			return
		}

		if (startParamsString.startsWith(StartParamsCodes.DEBUG)) {
			import("eruda").then((lib) => lib.default.init())
			startParamsString = startParamsString.slice(StartParamsCodes.DEBUG.length)
		}

		if (startParamsString === StartParamsCodes.BUY_STARS_SUCCESS) {
			navigate(AppRoute.congratulations)
			return
		}

		if (startParamsString === StartParamsCodes.OPEN_DONATION) {
			navigate(AppRoute.buyStars)
			return
		}

		if (startParamsString.startsWith(StartParamsCodes.OPEN_APP)) {
			const appId = startParamsString.slice(StartParamsCodes.OPEN_APP.length + 1) // app=
			navigate(`${AppRoute.catalog}/${appId}`)
			return
		}

		if (startParamsString.startsWith(StartParamsCodes.OPEN_CATEGORY)) {
			const categoryId = startParamsString.slice(StartParamsCodes.OPEN_CATEGORY.length + 1) // cat=
			navigate(`${AppRoute.catalog}/category/${categoryId}`)
			return
		}

		if (startParamsString.startsWith(StartParamsCodes.OPEN_CATEGORY_WITH_SORT)) {
			// TODO: Implement open category with sort
			return
		}

		if (lp.initData?.startParam?.startsWith(StartParamsCodes.OPEN_TOP)) {
			// TODO: Implement open top
			return
		}

		if (lp.initData?.startParam?.startsWith(StartParamsCodes.OPEN_TOP_WITH_SORT)) {
			// TODO: Implement open top with sort
			return
		}

		if (lp.initData?.startParam?.startsWith(StartParamsCodes.OPEN_FAVS)) {
			// TODO: Implement open favs
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
