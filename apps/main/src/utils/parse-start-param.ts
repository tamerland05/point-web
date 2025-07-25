import type { RetrieveLPResultCamelCased } from "@telegram-apps/sdk-react"
import { getDefaultStore } from "jotai"

import { referrerAtom } from "@/atoms/user"
import { StartParamsCodes } from "@/constants/launchParamsCodes"
import { isValidAddress } from "@point/shared/utils/isValidAddress"
import { redirect } from "@tanstack/react-router"

// TODO: надо скипать онбординга
export const parseStartParam = (lp: RetrieveLPResultCamelCased | null) => {
  if (!lp?.tgWebAppStartParam) {
    return
  }

  let startParamsString = lp.tgWebAppStartParam

  // 1. debug slice
  if (startParamsString.startsWith(StartParamsCodes.DEBUG)) {
    startParamsString = startParamsString.slice(StartParamsCodes.DEBUG.length)
  }

  // 2. open menu item
  if (lp.tgWebAppStartParam?.startsWith(StartParamsCodes.OPEN_MENU_ITEM)) {
    const split = startParamsString.split("--")
    const placeId = split[1]
    const menuItemId = split[2]

    if (!placeId || !menuItemId) {
      return
    }

    throw redirect({ to: "/menu/$id/$menuItemId", params: { id: placeId, menuItemId } })
  }

  // 3. open profile
  if (lp.tgWebAppStartParam?.startsWith(StartParamsCodes.OPEN_USER_PROFILE)) {
    const split = startParamsString.split("--")
    const userId = split[1]

    if (!userId) {
      return
    }

    throw redirect({ to: "/profile/$id", params: { id: userId } })
  }

  // 4. handle referrer id
  if (startParamsString.startsWith(StartParamsCodes.REFERRER_ID)) {
    const split = startParamsString.split("=")
    const referrerAddress = split[1]

    if (!referrerAddress) {
      return
    }

    if (!isValidAddress(referrerAddress)) {
      return
    }

    getDefaultStore().set(referrerAtom, referrerAddress)
  }
}
