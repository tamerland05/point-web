import { memo, useCallback } from "react"
import MapComp, { Marker, type ViewStateChangeEvent } from "react-map-gl/mapbox"

import "mapbox-gl/dist/mapbox-gl.css"
import { langitudeAtom, latitudeAtom, zoomAtom } from "@/atoms/map"
import { MAP_ID } from "@/constants/map"
import { userLocationQueryOptions } from "@/utils/get-user-location-query"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useAtom } from "jotai"
import Img from "react-cool-img"

interface MapboxMapProps {
  children: React.ReactNode
}

const mapStyle = {
  width: "100%",
  height: "100vh",
}

export const MapboxMap = memo(
  ({ children }: MapboxMapProps) => {
    const [longitude, setLongitude] = useAtom(langitudeAtom)
    const [latitude, setLatitude] = useAtom(latitudeAtom)
    const [zoom, setZoom] = useAtom(zoomAtom)

    const handleMoveMap = useCallback(
      (evt: ViewStateChangeEvent) => {
        setLongitude(evt.viewState.longitude)
        setLatitude(evt.viewState.latitude)
        setZoom(evt.viewState.zoom)
      },
      [setLongitude, setLatitude, setZoom]
    )

    const userLocationQuery = useSuspenseQuery(userLocationQueryOptions)
    const userLocation = userLocationQuery.data

    return (
      <MapComp
        id={MAP_ID}
        reuseMaps
        onMove={handleMoveMap}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/egor-sidorov/cmb829fkw00qn01scgh2hdknh"
        style={mapStyle}
        longitude={longitude}
        latitude={latitude}
        zoom={zoom}
      >
        {!!userLocation && (
          <Marker longitude={userLocation.longitude} latitude={userLocation.latitude} anchor="center">
            <Img src="/Pin.svg" alt="Pin" />
          </Marker>
        )}

        {children}
      </MapComp>
    )
  },
  () => false
)

MapboxMap.displayName = "MapboxMap"
