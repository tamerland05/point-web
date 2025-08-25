import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { useAtom, useSetAtom } from "jotai"
import { type RefObject, useCallback, useEffect, useRef, useState } from "react"
import Img from "react-cool-img"
import toast from "react-hot-toast"
import { Marker } from "react-map-gl/mapbox"
import { z } from "zod"

import {
  type EstablishmentDTO,
  establishmentsQueryOptions,
  placesNearQueryOptions,
} from "@point/shared/api/point/establishments"
import { establishmentTypesQueryOptions } from "@point/shared/api/point/establishmentTypes"
import { useDebounce } from "@point/shared/hooks/useDebounce"

import { movedToUserLocationAtom, NearbyModalStates, nearbyModalStateAtom } from "@/atoms/map"
import { showMenuAtom } from "@/atoms/ui"
import { MapboxMap } from "@/components/mapbox"
import { useMapData } from "@/components/mapbox/useMapbox"
import { NearbyModal } from "@/components/nearby-modal"
import { PlaceModal } from "@/components/place-modal"
import { userLocationQueryOptions } from "@/utils/get-user-location-query"

const mapSchema = z.object({
  expanded: z.boolean().default(false),
  selectedPlaceId: z.string().default(""),
})

export const Route = createFileRoute("/_withMenu/map")({
  component: RouteComponent,

  loader: async ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(establishmentTypesQueryOptions)
  },
  validateSearch: zodValidator(mapSchema),
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { selectedPlaceId, expanded: drawerExpanded } = Route.useSearch()

  const setMenuVisible = useSetAtom(showMenuAtom)
  const setNearbyModalState = useSetAtom(nearbyModalStateAtom)

  const userLocationQuery = useSuspenseQuery(userLocationQueryOptions)
  const userLocation = userLocationQuery.data

  const { longitude, latitude, zoom, mapRef } = useMapData()

  const debouncedLatitude = useDebounce(latitude, 333)
  const debouncedLongitude = useDebounce(longitude, 333)
  const debouncedZoom = useDebounce(zoom, 333)

  const establishmentsQuery = useQuery(establishmentsQueryOptions(debouncedLatitude, debouncedLongitude, debouncedZoom))
  const establishments = establishmentsQuery.data || []

  const establishmentTypesQuery = useQuery(establishmentTypesQueryOptions)
  const establishmentTypes = establishmentTypesQuery.data

  const nearbyPlacesQuery = useQuery(placesNearQueryOptions("", userLocation))
  const nearbyPlaces = nearbyPlacesQuery.data

  const [movedToUserLocation, setMovedToUserLocation] = useAtom(movedToUserLocationAtom)
  useEffect(() => {
    if (movedToUserLocation) return
    if (!mapRef) return
    if (!userLocation.longitude || !userLocation.latitude) return

    mapRef.flyTo({
      center: [userLocation.longitude, userLocation.latitude],
      duration: 2000,
      zoom: 15,
    })

    setMovedToUserLocation(true)
  }, [mapRef, userLocation.latitude, userLocation.longitude, movedToUserLocation, setMovedToUserLocation])

  const handleSelectPlace = useCallback(
    async (placeId: string) => {
      setMenuVisible(false)
      const place =
        establishments?.find((establishment) => establishment.id === placeId) ||
        nearbyPlaces?.find((place) => place.id === placeId)

      if (!place) {
        toast.error("Place not found")
        return
      }

      mapRef?.flyTo({
        center: [Number(place.position.longitude), Number(place.position.latitude) - 0.0001],
        duration: 1000,
        zoom: 17,
      })

      navigate({
        search: (prev) => ({ ...prev, selectedPlaceId: placeId }),
      })
    },
    [navigate, setMenuVisible, establishments, nearbyPlaces, mapRef]
  )

  const handleExpandDrawer = useCallback(() => {
    navigate({
      search: (prev) => ({ ...prev, expanded: true }),
    })
    setMenuVisible(false)
    setNearbyModalState(NearbyModalStates.PIMP_ONLY)
  }, [navigate, setMenuVisible, setNearbyModalState])

  const handleCloseDrawer = useCallback(() => {
    navigate({
      search: (prev) => ({ ...prev, expanded: false, selectedPlaceId: "" }),
    })
    setMenuVisible(true)
    setNearbyModalState(NearbyModalStates.PIMP_ONLY)
  }, [navigate, setMenuVisible, setNearbyModalState])

  const handleExpandNearbyModal = useCallback(() => {
    setNearbyModalState(NearbyModalStates.EXPANDED)
    setMenuVisible(false)
  }, [setMenuVisible, setNearbyModalState])

  const handleShowNearbyModal = useCallback(() => {
    setNearbyModalState(NearbyModalStates.DEFAULT)
    setMenuVisible(true)
  }, [setMenuVisible, setNearbyModalState])

  const handleHideNearbyModal = useCallback(() => {
    setNearbyModalState(NearbyModalStates.PIMP_ONLY)
    setMenuVisible(true)
  }, [setMenuVisible, setNearbyModalState])

  const handleSelectNearbyPlace = useCallback(
    async (placeId: string) => {
      handleHideNearbyModal()
      void handleSelectPlace(placeId)
    },
    [handleSelectPlace, handleHideNearbyModal]
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: only on init component for detecting correct menu state
  useEffect(() => {
    if (selectedPlaceId) {
      setMenuVisible(false)
    }
  }, [])

  const getMarkerByEstablishmentType = useCallback(
    (establishmentTypeId: string, name?: string) => {
      const establishmentType = establishmentTypes?.[establishmentTypeId]
      if (!establishmentType) {
        return null
      }

      return (
        <div className="relative flex flex-col items-center gap-0.5">
          <Img alt={establishmentType.name} src={establishmentType.icon} />
          <div className="font-medium font-sf-pro-text text-caption-3">{name || establishmentType.name}</div>
        </div>
      )
    },
    [establishmentTypes]
  )

  // TODO: refactor, prettyfy ------------------------------------------------------------
  const mapContainerRef = useRef<HTMLDivElement>(null)

  const visibleMarkerIds = useMarkerCollisionDetection(establishments, zoom, mapContainerRef)

  const getMarkerScale = useCallback(() => {
    if (zoom >= 13) return 0.8
    if (zoom >= 10) return 0.8
    return 0.7
  }, [zoom])
  // ------------------------------------------------------------

  return (
    <>
      <div ref={mapContainerRef}>
        <MapboxMap>
          {establishments.map((establishment) => {
            const isVisible = visibleMarkerIds.has(establishment.id)

            return (
              <Marker
                anchor="center"
                key={establishment.id}
                latitude={establishment.position.latitude}
                longitude={establishment.position.longitude}
                onClick={() => handleSelectPlace(establishment.id)}
              >
                <div
                  className="marker-container"
                  data-marker-id={establishment.id}
                  // TODO: refactor, prettyfy
                  style={{
                    opacity: isVisible ? 1 : 0,
                    pointerEvents: isVisible ? "auto" : "none",
                    transform: `scale(${getMarkerScale()})`,
                    transition: "opacity 0.2s ease, scale 0.2s ease",
                  }}
                >
                  {getMarkerByEstablishmentType(establishment.establishmentTypeId, establishment.name)}
                </div>
              </Marker>
            )
          })}
        </MapboxMap>
      </div>

      <PlaceModal
        address={establishments?.find((establishment) => establishment.id === selectedPlaceId)?.position.address}
        drawerExpanded={!!drawerExpanded}
        handleCloseDrawer={handleCloseDrawer}
        handleExpandDrawer={handleExpandDrawer}
        id={selectedPlaceId}
        name={establishments?.find((establishment) => establishment.id === selectedPlaceId)?.name}
        photo={establishments?.find((establishment) => establishment.id === selectedPlaceId)?.photo}
        rating={establishments?.find((establishment) => establishment.id === selectedPlaceId)?.rating}
      />

      {!selectedPlaceId && (
        <NearbyModal
          onExpand={handleExpandNearbyModal}
          onHide={handleHideNearbyModal}
          onSelectPlace={handleSelectNearbyPlace}
          onShow={handleShowNearbyModal}
        />
      )}
    </>
  )
}

// TODO: refactor, prettyfy
const useMarkerCollisionDetection = (
  establishments: EstablishmentDTO[],
  zoom: number,
  containerRef: RefObject<HTMLDivElement | null>
) => {
  const [visibleMarkers, setVisibleMarkers] = useState<Set<string>>(new Set())

  const checkCollisions = useCallback(() => {
    if (!containerRef.current || zoom >= ALL_MARKERS_ZOOM_LEVEL) {
      setVisibleMarkers(new Set(establishments.map((e) => e.id)))
      return
    }

    const markerElements = containerRef.current.querySelectorAll("[data-marker-id]")
    const rects = new Map<string, DOMRect>()
    const visible = new Set<string>()

    markerElements.forEach((element) => {
      const markerId = element.getAttribute("data-marker-id")
      if (markerId) {
        rects.set(markerId, element.getBoundingClientRect())
      }
    })

    const sortedEstablishments = [...establishments].sort((a, b) => (+b.rating || 0) - (+a.rating || 0))

    sortedEstablishments.forEach((establishment) => {
      const currentRect = rects.get(establishment.id)
      if (!currentRect) return

      let hasCollision = false

      for (const visibleId of visible) {
        const visibleRect = rects.get(visibleId)
        if (visibleRect && rectsOverlap(currentRect, visibleRect)) {
          hasCollision = true
          break
        }
      }

      if (!hasCollision) {
        visible.add(establishment.id)
      }
    })

    setVisibleMarkers(visible)
  }, [establishments, zoom, containerRef])

  useEffect(() => {
    const timeoutId = setTimeout(checkCollisions, 100)
    return () => clearTimeout(timeoutId)
  }, [checkCollisions])

  return visibleMarkers
}

const rectsOverlap = (rect1: DOMRect, rect2: DOMRect): boolean => {
  return !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom)
}

const ALL_MARKERS_ZOOM_LEVEL = 12
