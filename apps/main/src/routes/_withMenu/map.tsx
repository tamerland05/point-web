import { showMenuAtom } from "@/atoms/ui"
import { MapboxMap } from "@/components/mapbox"
import { useMapData } from "@/components/mapbox/useMapbox"
import { PlaceModal } from "@/components/place-modal"
import { userLocationQueryOptions } from "@/utils/get-user-location-query"
import { placesQueryOptions } from "@point/shared/api/point/places"
import { useDebounce } from "@point/shared/hooks/useDebounce"
import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { useSetAtom } from "jotai"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Marker } from "react-map-gl/mapbox"
import { z } from "zod"

// mapbox as jotai state
// optimize markers -- maybe use geojson?

const mapSchema = z.object({
  expanded: z.boolean().default(false),
  selectedPlaceId: z.string().default(""),
  sort: z.enum(["newest", "oldest", "price"]).default("newest"),
})

export const Route = createFileRoute("/_withMenu/map")({
  component: RouteComponent,
  validateSearch: zodValidator(mapSchema),
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { selectedPlaceId, expanded: drawerExpanded } = Route.useSearch()

  const setMenuVisible = useSetAtom(showMenuAtom)

  const userLocationQuery = useSuspenseQuery(userLocationQueryOptions)
  const userLocation = userLocationQuery.data

  const { longitude, latitude, mapRef } = useMapData()

  // biome-ignore lint/correctness/useExhaustiveDependencies: we can check only lng and lat
  const diagonalCoordinates = useMemo(() => {
    const maxBounds = mapRef?.getBounds()

    console.log(maxBounds)

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

  const [movedToUserLocation, setMovedToUserLocation] = useState(false)
  // biome-ignore lint/correctness/useExhaustiveDependencies: its ok
  useEffect(() => {
    if (mapRef && userLocation && !movedToUserLocation) {
      mapRef.flyTo({
        center: [userLocation.longitude, userLocation.latitude],
        zoom: 15,
        duration: 2000,
      })
      setMovedToUserLocation(true)
    }
  }, [userLocation, movedToUserLocation])

  const handleSelectPlace = useCallback(
    (placeId: string) => {
      setMenuVisible(false)
      navigate({
        search: (prev) => ({ ...prev, selectedPlaceId: placeId }),
      })
    },
    [navigate, setMenuVisible]
  )

  const handleCloseDrawer = useCallback(() => {
    navigate({
      search: (prev) => ({ ...prev, selectedPlaceId: "" }),
    })
  }, [navigate])

  const handleExpandDrawer = useCallback(() => {
    navigate({
      search: (prev) => ({ ...prev, expanded: true }),
    })
    // mb just navigate with view transition
  }, [navigate])

  const handleCollapseDrawer = useCallback(() => {
    navigate({
      search: (prev) => ({ ...prev, expanded: false }),
    })
    // mb just navigate with view transition
  }, [navigate])

  useEffect(() => {}, [])

  useEffect(() => {
    const placeObject = places?.find((place) => place.id === selectedPlaceId)
    if (!selectedPlaceId || !placeObject) {
      handleCollapseDrawer()
      setMenuVisible(true)
    }
  }, [selectedPlaceId, setMenuVisible, handleCollapseDrawer])

  return (
    <div>
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
        drawerExpanded={drawerExpanded}
        handleCloseDrawer={handleCloseDrawer}
        handleExpandDrawer={handleExpandDrawer}
      />
    </div>
  )
}
