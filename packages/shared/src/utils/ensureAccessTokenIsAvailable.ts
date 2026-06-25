import { getDefaultStore } from "jotai"

import { accessTokenAtom } from "../atoms/user"

export const ensureAccessTokenIsAvailable = (): Promise<void> => {
  const store = getDefaultStore()
  const token = store.get(accessTokenAtom)

  if (token) {
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    let unsubscribe = () => {}
    const timeoutId = setTimeout(() => {
      unsubscribe()
      resolve()
    }, 2500)

    unsubscribe = store.sub(accessTokenAtom, () => {
      if (store.get(accessTokenAtom)) {
        clearTimeout(timeoutId)
        unsubscribe()
        resolve()
      }
    })
  })
}
