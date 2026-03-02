import { getDefaultStore } from "jotai"

import { accessTokenAtom } from "../atoms/user"

export const ensureAccessTokenIsAvailable = (): Promise<void> => {
  const store = getDefaultStore()
  const token = store.get(accessTokenAtom)

  if (token) {
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    const unsubscribe = store.sub(accessTokenAtom, () => {
      if (store.get(accessTokenAtom)) {
        unsubscribe()
        resolve()
      }
    })
  })
}
