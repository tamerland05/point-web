import { atomWithStorage, createJSONStorage } from "jotai/utils"

const storage = createJSONStorage<number>(() => sessionStorage)

const defaultLongitude = 30.314997
const defaultLatitude = 59.938784

export const langitudeAtom = atomWithStorage<number>("@point/map/longitude", defaultLongitude, storage)
export const latitudeAtom = atomWithStorage<number>("@point/map/latitude", defaultLatitude, storage)
export const zoomAtom = atomWithStorage<number>("@point/map/zoom", 14, storage)
