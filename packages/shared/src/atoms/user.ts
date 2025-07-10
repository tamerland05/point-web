import { getDefaultStore } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { atom } from "jotai/vanilla"

export const accessTokenAtom = atom<string | null>(null)

export const getAccessToken = () => {
  const store = getDefaultStore()
  return store.get(accessTokenAtom)
}

export const referrerAtom = atomWithStorage<string | null>("@point/shared/referrer", null, undefined, {
  getOnInit: true,
})
