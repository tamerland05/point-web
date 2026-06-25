import { atom } from "jotai"

import { DEFAULT_LATITUDE, DEFAULT_LONGITUDE } from "@/constants/map"

export const langitudeAtom = atom<number>(DEFAULT_LONGITUDE)
export const latitudeAtom = atom<number>(DEFAULT_LATITUDE)
export const zoomAtom = atom<number>(14)

export const movedToUserLocationAtom = atom<boolean>(false)

// ---------------------------------------------------------------------------------------------------------------------

export const NearbyModalStates = {
  DEFAULT: "default",
  EXPANDED: "expanded",
  HIDDEN: "hidden",
  PIMP_ONLY: "pimp-only",
} as const

type NearbyModalState = (typeof NearbyModalStates)[keyof typeof NearbyModalStates]

export const nearbyModalStateAtom = atom<NearbyModalState>(NearbyModalStates.DEFAULT)

/** Multi-select establishment type filter for map chips + nearby list. */
export const selectedMapCategoryIdsAtom = atom<string[]>([])
