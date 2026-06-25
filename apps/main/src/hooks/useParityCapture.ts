import { useState } from "react"

declare global {
  interface Window {
    __POINT_PARITY_CAPTURE__?: boolean
    __POINT_PARITY_SCROLL_TARGET__?: string
  }
}

export function useParityCapture() {
  const [parityCapture] = useState(() => {
    if (typeof window === "undefined") {
      return false
    }

    return Boolean(window.__POINT_PARITY_CAPTURE__)
  })

  return parityCapture
}

export function useParityScrollTarget() {
  const [scrollTarget] = useState(() => {
    if (typeof window === "undefined") {
      return null
    }

    return window.__POINT_PARITY_SCROLL_TARGET__ ?? null
  })

  return scrollTarget
}
