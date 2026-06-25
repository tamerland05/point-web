import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { useLaunchParams, useSignal, viewport } from "@telegram-apps/sdk-react"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { type RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react"
import toast from "react-hot-toast"
import { z } from "zod"

import { authQueryOptions } from "@point/shared/api/point/auth"
import { type EstablishmentDTO, establishmentsQueryOptions } from "@point/shared/api/point/establishments"
import { establishmentTypesQueryOptions } from "@point/shared/api/point/establishmentTypes"
import { useDebounce } from "@point/shared/hooks/useDebounce"
import { calculateMapDistanceMeters, formatMapDistanceLabel } from "@point/shared/utils/format"

import {
  movedToUserLocationAtom,
  NearbyModalStates,
  nearbyModalStateAtom,
  selectedMapCategoryIdsAtom,
} from "@/atoms/map"
import { showMenuAtom } from "@/atoms/ui"
import { MapControls } from "@/components/map/MapControls"
import { MapEstablishmentMarkers } from "@/components/map/MapEstablishmentMarkers"
import { MapMarkerBadge } from "@/components/map/MapMarkerBadge"
import { MapParityBackdrop } from "@/components/map/MapParityBackdrop"
import { MapProfileHeader } from "@/components/map/MapProfileHeader"
import { MapboxMap } from "@/components/mapbox"
import { useMapData } from "@/components/mapbox/useMapbox"
import { NearbyModal } from "@/components/nearby-modal"
import { PlaceModal } from "@/components/place-modal"
import { MAP_CONTROLS_BOTTOM_OFFSET } from "@/constants/mapLayout"
import { useParityCapture } from "@/hooks/useParityCapture"
import { userLocationQueryOptions } from "@/utils/get-user-location-query"

const mapSchema = z.object({
  expanded: z.boolean().default(false),
  selectedPlaceId: z.string().default(""),
})

export const Route = createFileRoute("/_withMenu/map")({
  component: RouteComponent,

  loader: async ({ context: { queryClient, initDataRaw, launchParams } }) => {
    queryClient.ensureQueryData(establishmentTypesQueryOptions)

    if (launchParams?.tgWebAppData && initDataRaw) {
      queryClient.ensureQueryData(authQueryOptions(launchParams.tgWebAppData, initDataRaw))
    }
  },
  validateSearch: zodValidator(mapSchema),
})

function RouteComponent() {
  const ctx = Route.useRouteContext()
  const navigate = Route.useNavigate()
  const { selectedPlaceId, expanded: drawerExpanded } = Route.useSearch()
  const parityCapture = useParityCapture()
  const lp = useLaunchParams()

  const authQuery = useSuspenseQuery(authQueryOptions(ctx.launchParams!.tgWebAppData!, ctx.initDataRaw!))
  const user = authQuery.data?.user

  const inset = useSignal(viewport.safeAreaInsets)
  const contentInset = useSignal(viewport.contentSafeAreaInsets)
  const profileHeaderTop = useMemo(() => inset.top + contentInset.top + 16, [contentInset.top, inset.top])

  const setMenuVisible = useSetAtom(showMenuAtom)
  const setNearbyModalState = useSetAtom(nearbyModalStateAtom)
  const nearbyModalState = useAtomValue(nearbyModalStateAtom)
  const selectedCategoryIds = useAtomValue(selectedMapCategoryIdsAtom)
  const [isSearchInputActive, setIsSearchInputActive] = useState(false)
  const [isSearchResultsView, setIsSearchResultsView] = useState(false)
  const [selectedPlaceDistanceLabel, setSelectedPlaceDistanceLabel] = useState<string | null>(null)

  const userLocationQuery = useSuspenseQuery(userLocationQueryOptions)
  const userLocation = userLocationQuery.data

  const { longitude, latitude, zoom, mapRef } = useMapData()

  const debouncedLatitude = useDebounce(latitude, 333)
  const debouncedLongitude = useDebounce(longitude, 333)
  const debouncedZoom = useDebounce(zoom, 333)

  const establishmentsQuery = useQuery({
    ...establishmentsQueryOptions(debouncedLatitude, debouncedLongitude, debouncedZoom),
    select: (data) => data,
  })
  const establishments = establishmentsQuery.data ?? EMPTY_ESTABLISHMENTS

  const establishmentTypesQuery = useQuery(establishmentTypesQueryOptions)
  const establishmentTypes = establishmentTypesQuery.data

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
    async (place: EstablishmentDTO, distanceLabel?: string | null) => {
      setMenuVisible(false)
      setSelectedPlaceDistanceLabel(distanceLabel ?? null)

      if (!place) {
        toast.error("Заведение не найдено")
        return
      }

      mapRef?.flyTo({
        center: [Number(place.position.longitude), Number(place.position.latitude) - 0.0001],
        duration: 1000,
        zoom: 17,
      })

      navigate({
        search: (prev) => ({ ...prev, selectedPlaceId: place.id }),
      })
    },
    [navigate, setMenuVisible, mapRef]
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
    setSelectedPlaceDistanceLabel(null)
    setNearbyModalState(NearbyModalStates.PIMP_ONLY)
  }, [navigate, setNearbyModalState])

  useEffect(() => {
    if (selectedPlaceId) return

    setNearbyModalState(NearbyModalStates.DEFAULT)
    setIsSearchInputActive(false)
  }, [selectedPlaceId, setNearbyModalState])

  const syncMenuVisibility = useCallback(
    ({
      nextNearbyModalState,
      isSearchActive,
    }: {
      nextNearbyModalState?: (typeof NearbyModalStates)[keyof typeof NearbyModalStates]
      isSearchActive?: boolean
    } = {}) => {
      const effectiveHasSelectedPlace = Boolean(selectedPlaceId)
      const effectiveIsSearchActive = (isSearchActive ?? isSearchInputActive) || isSearchResultsView
      const effectiveNearbyModalState = nextNearbyModalState ?? nearbyModalState

      if (
        effectiveHasSelectedPlace ||
        effectiveIsSearchActive ||
        effectiveNearbyModalState === NearbyModalStates.EXPANDED
      ) {
        setMenuVisible(false)
        return
      }

      setMenuVisible(
        effectiveNearbyModalState === NearbyModalStates.DEFAULT ||
          effectiveNearbyModalState === NearbyModalStates.PIMP_ONLY
      )
    },
    [isSearchInputActive, isSearchResultsView, nearbyModalState, selectedPlaceId, setMenuVisible]
  )

  const handleSearchResultsViewChange = useCallback((active: boolean) => {
    setIsSearchResultsView(active)
  }, [])

  const handleExpandNearbyModal = useCallback(() => {
    setIsSearchInputActive(false)
    setNearbyModalState(NearbyModalStates.EXPANDED)
    syncMenuVisibility({ isSearchActive: false, nextNearbyModalState: NearbyModalStates.EXPANDED })
  }, [setNearbyModalState, syncMenuVisibility])

  const handleShowNearbyModal = useCallback(() => {
    setNearbyModalState(NearbyModalStates.DEFAULT)
    syncMenuVisibility({ nextNearbyModalState: NearbyModalStates.DEFAULT })
  }, [setNearbyModalState, syncMenuVisibility])

  const handleHideNearbyModal = useCallback(() => {
    setNearbyModalState(NearbyModalStates.PIMP_ONLY)
    syncMenuVisibility({ nextNearbyModalState: NearbyModalStates.PIMP_ONLY })
  }, [setNearbyModalState, syncMenuVisibility])

  const handleSelectNearbyPlace = useCallback(
    async (place: EstablishmentDTO) => {
      handleHideNearbyModal()
      void handleSelectPlace(place, formatMapDistanceLabel(calculateMapDistanceMeters(userLocation, place.position)))
    },
    [handleHideNearbyModal, handleSelectPlace, userLocation]
  )

  const handleSearchFocus = useCallback(() => {
    setIsSearchInputActive(true)
    setNearbyModalState(NearbyModalStates.EXPANDED)
    syncMenuVisibility({ isSearchActive: true, nextNearbyModalState: NearbyModalStates.EXPANDED })
  }, [setNearbyModalState, syncMenuVisibility])

  const handleSearchBlur = useCallback(() => {
    setIsSearchInputActive(false)
    syncMenuVisibility()
  }, [syncMenuVisibility])

  const handleExitSearchMode = useCallback(() => {
    setIsSearchResultsView(false)
    setNearbyModalState(NearbyModalStates.DEFAULT)
    syncMenuVisibility({ nextNearbyModalState: NearbyModalStates.DEFAULT })
  }, [setNearbyModalState, syncMenuVisibility])

  const handleZoomIn = useCallback(() => {
    mapRef?.zoomIn({ duration: 300 })
  }, [mapRef])

  const handleZoomOut = useCallback(() => {
    mapRef?.zoomOut({ duration: 300 })
  }, [mapRef])

  const handleLocate = useCallback(() => {
    if (!mapRef || !userLocation.longitude || !userLocation.latitude) {
      return
    }

    mapRef.flyTo({
      center: [userLocation.longitude, userLocation.latitude],
      duration: 1000,
      zoom: 15,
    })
  }, [mapRef, userLocation.latitude, userLocation.longitude])

  useEffect(() => {
    syncMenuVisibility()
  }, [syncMenuVisibility])

  const getMarkerByEstablishmentType = useCallback(
    (establishmentTypeId: string, name?: string, dimmed = false) => {
      const establishmentType = establishmentTypes?.[establishmentTypeId]
      if (!establishmentType) {
        return null
      }

      return (
        <MapMarkerBadge
          colorCode={establishmentType.colorCode}
          dimmed={dimmed}
          icon={establishmentType.icon}
          label={name || establishmentType.name}
        />
      )
    },
    [establishmentTypes]
  )

  const dimmedMarkerIds = useMemo(() => {
    if (selectedCategoryIds.length === 0) {
      return EMPTY_MARKER_ID_SET
    }

    const selectedTypes = new Set(selectedCategoryIds)

    return new Set(
      establishments
        .filter((establishment) => !selectedTypes.has(establishment.establishmentTypeId))
        .map((establishment) => establishment.id)
    )
  }, [establishments, selectedCategoryIds])

  // TODO: refactor, prettyfy ------------------------------------------------------------
  const mapContainerRef = useRef<HTMLDivElement>(null)

  const markerScale = 1

  const visibleMarkerIds = useMarkerCollisionDetection(establishments, zoom, mapContainerRef)

  const showMapFloatingControls =
    !selectedPlaceId &&
    !isSearchInputActive &&
    !isSearchResultsView &&
    (nearbyModalState === NearbyModalStates.DEFAULT || nearbyModalState === NearbyModalStates.PIMP_ONLY)
  const showMapProfileHeader = showMapFloatingControls

  // ------------------------------------------------------------

  return (
    <>
      <MapParityBackdrop enabled={parityCapture} />
      {parityCapture ? null : (
        <>
          {showMapProfileHeader && user ? (
            <div className="pointer-events-none fixed inset-x-4 z-[25]" style={{ top: profileHeaderTop }}>
              <MapProfileHeader
                onNotificationsClick={() => navigate({ to: "/account/notifications" })}
                onScannerClick={() => navigate({ to: "/qr/scan" })}
                userName={user.employee?.name ?? user.name ?? ""}
                userPhoto={user.employee?.photo || user.photoUrl}
              />
            </div>
          ) : null}
          {showMapFloatingControls ? (
            <MapControls
              bottomOffset={MAP_CONTROLS_BOTTOM_OFFSET}
              onLocate={handleLocate}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
            />
          ) : null}
          <div ref={mapContainerRef}>
            <MapboxMap hideUserMarker={false}>
              <MapEstablishmentMarkers
                dimmedMarkerIds={dimmedMarkerIds}
                establishments={establishments}
                getMarkerByEstablishmentType={getMarkerByEstablishmentType}
                markerScale={markerScale}
                onSelectPlace={handleSelectPlace}
                visibleMarkerIds={visibleMarkerIds}
              />
            </MapboxMap>
          </div>

          <PlaceModal
            address={
              establishments?.find((establishment: EstablishmentDTO) => establishment.id === selectedPlaceId)?.position
                .address
            }
            distanceLabel={selectedPlaceDistanceLabel}
            drawerExpanded={!!drawerExpanded}
            handleCloseDrawer={handleCloseDrawer}
            handleExpandDrawer={handleExpandDrawer}
            id={selectedPlaceId}
            name={establishments?.find((establishment: EstablishmentDTO) => establishment.id === selectedPlaceId)?.name}
            photo={
              establishments?.find((establishment: EstablishmentDTO) => establishment.id === selectedPlaceId)?.photo
            }
            rating={
              establishments?.find((establishment: EstablishmentDTO) => establishment.id === selectedPlaceId)?.rating
            }
          />

          {!selectedPlaceId && (
            <NearbyModal
              isSearchInputActive={isSearchInputActive}
              onExpand={handleExpandNearbyModal}
              onHide={handleHideNearbyModal}
              onSearchBlur={handleSearchBlur}
              onSearchFocus={handleSearchFocus}
              onSearchModeExit={handleExitSearchMode}
              onSearchResultsViewChange={handleSearchResultsViewChange}
              onSelectPlace={handleSelectNearbyPlace}
              onShow={handleShowNearbyModal}
            />
          )}
        </>
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
  const [visibleMarkers, setVisibleMarkers] = useState<ReadonlySet<string>>(() => new Set())

  const checkCollisions = useCallback(() => {
    const commitVisibleMarkers = (next: Set<string>) => {
      setVisibleMarkers((current) => {
        if (current.size === next.size) {
          let isEqual = true

          for (const id of next) {
            if (!current.has(id)) {
              isEqual = false
              break
            }
          }

          if (isEqual) {
            return current
          }
        }

        return next
      })
    }

    if (!containerRef.current || zoom >= ALL_MARKERS_ZOOM_LEVEL) {
      commitVisibleMarkers(new Set(establishments.map((establishment) => establishment.id)))
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

    const sortedEstablishments = [...establishments].sort((left, right) => (+right.rating || 0) - (+left.rating || 0))

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

    commitVisibleMarkers(visible)
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

const EMPTY_ESTABLISHMENTS: EstablishmentDTO[] = []
const EMPTY_MARKER_ID_SET: ReadonlySet<string> = new Set()
