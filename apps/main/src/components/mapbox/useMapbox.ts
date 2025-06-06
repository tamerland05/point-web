import { langitudeAtom, latitudeAtom, zoomAtom } from "@/atoms/map"
import { MAP_ID } from "@/constants/map"
import { useAtomValue } from "jotai"
import { type MapRef, useMap } from "react-map-gl/mapbox"

interface MapData {
  mapRef: MapRef | undefined
  longitude: number
  latitude: number
  zoom: number
}

export const useMapData = (): MapData => {
  const { [MAP_ID]: mapRef } = useMap()

  const longitude = useAtomValue(langitudeAtom)
  const latitude = useAtomValue(latitudeAtom)
  const zoom = useAtomValue(zoomAtom)

  return {
    mapRef,
    longitude,
    latitude,
    zoom,
  }
}
