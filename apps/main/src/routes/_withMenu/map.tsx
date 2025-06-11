import { NearbyModalStates, movedToUserLocationAtom, nearbyModalStateAtom } from "@/atoms/map"
import { showMenuAtom } from "@/atoms/ui"
import { MapboxMap } from "@/components/mapbox"
import { useMapData } from "@/components/mapbox/useMapbox"
import { NearbyModal } from "@/components/nearby-modal"
import { PlaceModal } from "@/components/place-modal"
import { userLocationQueryOptions } from "@/utils/get-user-location-query"
import { establishmentsQueryOptions } from "@point/shared/api/point/establishments"
import { placesQueryOptions } from "@point/shared/api/point/places"
import { useDebounce } from "@point/shared/hooks/useDebounce"
import { sleep } from "@point/shared/utils/sleep"
import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { useAtom, useSetAtom } from "jotai"
import { useCallback, useEffect, useMemo } from "react"
import { Marker } from "react-map-gl/mapbox"
import { z } from "zod"

const mapSchema = z.object({
  expanded: z.boolean().default(false),
  selectedPlaceId: z.string().default(""),
  sort: z.enum(["newest", "oldest", "price"]).default("newest"),
})

export const Route = createFileRoute("/_withMenu/map")({
  component: RouteComponent,
  validateSearch: zodValidator(mapSchema),

  loader: async ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(establishmentsQueryOptions)
  },
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { selectedPlaceId, expanded: drawerExpanded } = Route.useSearch()

  const setMenuVisible = useSetAtom(showMenuAtom)
  const setNearbyModalState = useSetAtom(nearbyModalStateAtom)

  const userLocationQuery = useSuspenseQuery(userLocationQueryOptions)
  const userLocation = userLocationQuery.data

  const { longitude, latitude, mapRef } = useMapData()

  // biome-ignore lint/correctness/useExhaustiveDependencies: we can check only lng and lat
  const diagonalCoordinates = useMemo(() => {
    const maxBounds = mapRef?.getBounds()

    if (!maxBounds) {
      return {
        upper: {
          longitude: longitude,
          latitude: latitude,
        },
        lower: {
          longitude: longitude,
          latitude: latitude,
        },
      }
    }

    const upper = {
      longitude: maxBounds.getNorthEast().lng,
      latitude: maxBounds.getNorthEast().lat,
    }

    const lower = {
      longitude: maxBounds.getSouthWest().lng,
      latitude: maxBounds.getSouthWest().lat,
    }

    return {
      upper,
      lower,
    }
  }, [longitude, latitude])

  const location = useMemo(
    () => ({
      longitude: longitude,
      latitude: latitude,
      address: "",
    }),
    [longitude, latitude]
  )

  const debouncedDiagonalCoordinates = useDebounce(diagonalCoordinates, 128)
  const debouncedLocation = useDebounce(location, 128)

  const placesQuery = useQuery(
    placesQueryOptions(debouncedDiagonalCoordinates.upper, debouncedDiagonalCoordinates.lower, debouncedLocation)
  )
  const places = placesQuery.data

  const [movedToUserLocation, setMovedToUserLocation] = useAtom(movedToUserLocationAtom)
  useEffect(() => {
    if (movedToUserLocation) return
    if (!mapRef) return
    if (!userLocation.longitude || !userLocation.latitude) return

    mapRef.flyTo({
      center: [userLocation.longitude, userLocation.latitude],
      zoom: 15,
      duration: 2000,
    })

    setMovedToUserLocation(true)
  }, [mapRef, userLocation.latitude, userLocation.longitude, movedToUserLocation, setMovedToUserLocation])

  const handleSelectPlace = useCallback(
    (placeId: string) => {
      setMenuVisible(false)
      navigate({
        search: (prev) => ({ ...prev, selectedPlaceId: placeId }),
      })
    },
    [navigate, setMenuVisible]
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
    async (placeId: string, longitude: number, latitude: number) => {
      handleHideNearbyModal()
      mapRef?.flyTo({
        center: [longitude, latitude],
        zoom: 15,
        duration: 1000,
      })
      await sleep(1000)
      handleSelectPlace(placeId)
    },
    [handleSelectPlace, handleHideNearbyModal, mapRef]
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: only on init component for detecting correct menu state
  useEffect(() => {
    if (selectedPlaceId) {
      setMenuVisible(false)
    }
  }, [])

  return (
    <>
      <MapboxMap>
        {places?.map((place) => (
          <Marker
            key={place.id}
            longitude={place.position.longitude}
            latitude={place.position.latitude}
            anchor="bottom"
            onClick={() => handleSelectPlace(place.id)}
          >
            <img src="/Noodle.svg" alt={place.name} />
          </Marker>
        ))}
      </MapboxMap>

      <PlaceModal
        id={selectedPlaceId}
        photo={places?.find((place) => place.id === selectedPlaceId)?.photo}
        name={places?.find((place) => place.id === selectedPlaceId)?.name}
        address={places?.find((place) => place.id === selectedPlaceId)?.position.address}
        rating={places?.find((place) => place.id === selectedPlaceId)?.rating}
        drawerExpanded={!!drawerExpanded}
        handleCloseDrawer={handleCloseDrawer}
        handleExpandDrawer={handleExpandDrawer}
      />

      {!selectedPlaceId && (
        <NearbyModal
          onExpand={handleExpandNearbyModal}
          onShow={handleShowNearbyModal}
          onHide={handleHideNearbyModal}
          onSelectPlace={handleSelectNearbyPlace}
        />
      )}
    </>
  )
}
