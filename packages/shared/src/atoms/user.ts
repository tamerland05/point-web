import { getDefaultStore } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { atom } from "jotai/vanilla"

export const accessTokenAtom = atom<string | null>(null)

// @ts-expect-error TS6133: unused, may be used in future
const _getAccessToken = () => {
  const store = getDefaultStore()
  return store.get(accessTokenAtom)
}

export const referrerAtom = atomWithStorage<string | null>("@point/shared/referrer", null, undefined, {
  getOnInit: true,
})
