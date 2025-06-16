import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { useAtom, useSetAtom } from "jotai"
import { useCallback, useEffect } from "react"
import { Marker } from "react-map-gl/mapbox"
import { z } from "zod"

import { NearbyModalStates, movedToUserLocationAtom, nearbyModalStateAtom } from "@/atoms/map"
import { showMenuAtom } from "@/atoms/ui"
import { MapboxMap } from "@/components/mapbox"
import { useMapData } from "@/components/mapbox/useMapbox"
import { NearbyModal } from "@/components/nearby-modal"
import { PlaceModal } from "@/components/place-modal"
import { userLocationQueryOptions } from "@/utils/get-user-location-query"
import { establishmentTypesQueryOptions } from "@point/shared/api/point/establishmentTypes"
import { establishmentsQueryOptions } from "@point/shared/api/point/establishments"
import { useDebounce } from "@point/shared/hooks/useDebounce"
import { sleep } from "@point/shared/utils/sleep"

const mapSchema = z.object({
  expanded: z.boolean().default(false),
  selectedPlaceId: z.string().default(""),
  sort: z.enum(["newest", "oldest", "price"]).default("newest"),
})

export const Route = createFileRoute("/_withMenu/map")({
  component: RouteComponent,
  validateSearch: zodValidator(mapSchema),

  loader: async ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(establishmentTypesQueryOptions)
  },
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
  const establishments = establishmentsQuery.data

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
        {establishments?.map((establishment) => (
          <Marker
            key={establishment.id}
            longitude={establishment.position.longitude}
            latitude={establishment.position.latitude}
            anchor="bottom"
            onClick={() => handleSelectPlace(establishment.id)}
          >
            <img src="/Noodle.svg" alt={establishment.name} />
          </Marker>
        ))}
      </MapboxMap>

      <PlaceModal
        id={selectedPlaceId}
        photo={establishments?.find((establishment) => establishment.id === selectedPlaceId)?.photo}
        name={establishments?.find((establishment) => establishment.id === selectedPlaceId)?.name}
        address={establishments?.find((establishment) => establishment.id === selectedPlaceId)?.position.address}
        rating={establishments?.find((establishment) => establishment.id === selectedPlaceId)?.rating}
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
