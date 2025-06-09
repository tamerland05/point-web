import { DEFAULT_LATITUDE, DEFAULT_LONGITUDE } from "@/constants/map"
import { atom } from "jotai"

export const langitudeAtom = atom<number>(DEFAULT_LONGITUDE)
export const latitudeAtom = atom<number>(DEFAULT_LATITUDE)
export const zoomAtom = atom<number>(14)

export const movedToUserLocationAtom = atom<boolean>(false)
