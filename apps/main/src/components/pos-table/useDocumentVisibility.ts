import { useEffect, useState } from "react"

/** Pauses POS polling while the mini-app tab is hidden. */
export function useDocumentVisibility(): boolean {
  const [visible, setVisible] = useState(
    () => typeof document !== "undefined" && document.visibilityState === "visible"
  )

  useEffect(() => {
    const onChange = () => setVisible(document.visibilityState === "visible")
    document.addEventListener("visibilitychange", onChange)
    return () => document.removeEventListener("visibilitychange", onChange)
  }, [])

  return visible
}
