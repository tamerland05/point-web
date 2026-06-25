import type { RetrieveLPResultCamelCased } from "@telegram-apps/sdk-react"

import { redirect } from "@tanstack/react-router"
import { getDefaultStore } from "jotai"

import { referrerAtom } from "@point/shared/atoms/user"

import { StartParamsCodes } from "@/constants/launchParamsCodes"

const LINK_UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

// TODO: надо скипать онбординг
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

    throw redirect({ params: { id: placeId, menuItemId }, to: "/menu/$id/$menuItemId" })
  }

  // open POS table session (`link--<linkUuid>`)
  if (startParamsString.startsWith(`${StartParamsCodes.OPEN_LINK}--`)) {
    const split = startParamsString.split("--")
    const linkId = split[1]

    if (!linkId || !LINK_UUID_RE.test(linkId)) {
      return
    }

    throw redirect({ params: { linkId }, replace: true, to: "/table/$linkId" })
  }

  // 3. open establishment
  if (lp.tgWebAppStartParam?.startsWith(StartParamsCodes.OPEN_ESTABLISHMENT)) {
    const split = startParamsString.split("--")
    const placeId = split[1]

    if (!placeId) {
      return
    }

    throw redirect({ search: { expanded: true, selectedPlaceId: placeId }, to: "/map" })
  }

  // 4. open profile
  if (lp.tgWebAppStartParam?.startsWith(StartParamsCodes.OPEN_USER_PROFILE)) {
    const split = startParamsString.split("--")
    const userId = split[1]

    if (!userId) {
      return
    }

    throw redirect({ params: { id: userId }, to: "/profile/$id" })
  }

  // 5. handle referrer id
  if (startParamsString.startsWith(StartParamsCodes.REFERRER_ID)) {
    const alreadyHasReferrer = getDefaultStore().get(referrerAtom)
    if (alreadyHasReferrer) {
      return
    }

    const split = startParamsString.split("=")
    const referrerAddress = split[1]

    if (!referrerAddress) {
      return
    }

    getDefaultStore().set(referrerAtom, referrerAddress)
  }
}
