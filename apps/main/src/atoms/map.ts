import { DEFAULT_LATITUDE, DEFAULT_LONGITUDE } from "@/constants/map"
import { atom } from "jotai"

export const langitudeAtom = atom<number>(DEFAULT_LONGITUDE)
export const latitudeAtom = atom<number>(DEFAULT_LATITUDE)
export const zoomAtom = atom<number>(14)

export const movedToUserLocationAtom = atom<boolean>(false)

// ---------------------------------------------------------------------------------------------------------------------

export const NearbyModalStates = {
  EXPANDED: "expanded",
  DEFAULT: "default",
  PIMP_ONLY: "pimp-only",
  HIDDEN: "hidden",
} as const

export type NearbyModalState = (typeof NearbyModalStates)[keyof typeof NearbyModalStates]

export const nearbyModalStateAtom = atom<NearbyModalState>(NearbyModalStates.DEFAULT)
