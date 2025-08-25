import { memo, useCallback } from "react"
import MapComp, { Marker, type ViewStateChangeEvent } from "react-map-gl/mapbox"

import "mapbox-gl/dist/mapbox-gl.css"

import { useSuspenseQuery } from "@tanstack/react-query"
import { useAtom } from "jotai"
import Img from "react-cool-img"

import { langitudeAtom, latitudeAtom, zoomAtom } from "@/atoms/map"
import { MAP_ID } from "@/constants/map"
import { userLocationQueryOptions } from "@/utils/get-user-location-query"

interface MapboxMapProps {
  children: React.ReactNode
}

const mapStyle = {
  height: "100vh",
  width: "100%",
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
        latitude={latitude}
        longitude={longitude}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/egor-sidorov/cmb829fkw00qn01scgh2hdknh"
        onMove={handleMoveMap}
        reuseMaps
        style={mapStyle}
        zoom={zoom}
      >
        {!!userLocation && (
          <Marker anchor="center" latitude={userLocation.latitude} longitude={userLocation.longitude}>
            <Img alt="Pin" src="/Pin.svg" />
          </Marker>
        )}

        {children}
      </MapComp>
    )
  },
  () => false
)

MapboxMap.displayName = "MapboxMap"
