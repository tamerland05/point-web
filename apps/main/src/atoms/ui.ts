import { retrieveLaunchParams } from "@telegram-apps/sdk-react"
import { atom } from "jotai"

export const showMenuAtom = atom(true)

export const isTmaEnvironmentAtom = atom(() => {
  try {
    retrieveLaunchParams()
    return true
  } catch {
    return false
  }
})

export const mainButtonAtom = atom<{
  title?: string
  onClick?: () => void
  loading?: boolean
  disabled?: boolean
  hidden?: boolean
}>({})

export const secondaryButtonAtom = atom<{
  title?: string
  onClick?: () => void
  loading?: boolean
  disabled?: boolean
  hidden?: boolean
  position?: "left" | "right" | "top" | "bottom"
}>({})
