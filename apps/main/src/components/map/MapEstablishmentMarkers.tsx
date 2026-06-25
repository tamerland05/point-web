import type { EstablishmentDTO } from "@point/shared/api/point/establishments"

import { memo, type ReactNode, useMemo } from "react"
import { Marker } from "react-map-gl/mapbox"

interface MapEstablishmentMarkersProps {
  dimmedMarkerIds: ReadonlySet<string>
  establishments: EstablishmentDTO[]
  getMarkerByEstablishmentType: (establishmentTypeId: string, name?: string, dimmed?: boolean) => ReactNode
  markerScale: number
  onSelectPlace: (place: EstablishmentDTO) => void
  visibleMarkerIds: ReadonlySet<string>
}

function areMarkerSetsEqual(left: ReadonlySet<string>, right: ReadonlySet<string>): boolean {
  if (left.size !== right.size) {
    return false
  }

  for (const id of left) {
    if (!right.has(id)) {
      return false
    }
  }

  return true
}

const MapEstablishmentMarker = memo(
  ({
    establishment,
    isVisible,
    markerScale,
    onSelectPlace,
    renderMarker,
  }: {
    establishment: EstablishmentDTO
    isVisible: boolean
    markerScale: number
    onSelectPlace: (place: EstablishmentDTO) => void
    renderMarker: ReactNode
  }) => (
    <Marker
      anchor="center"
      latitude={establishment.position.latitude}
      longitude={establishment.position.longitude}
      onClick={() => onSelectPlace(establishment)}
    >
      <div
        className="marker-container"
        data-marker-id={establishment.id}
        style={{
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? "auto" : "none",
          transform: `scale(${markerScale})`,
        }}
      >
        {renderMarker}
      </div>
    </Marker>
  ),
  (previous, next) =>
    previous.establishment.id === next.establishment.id &&
    previous.isVisible === next.isVisible &&
    previous.markerScale === next.markerScale &&
    previous.renderMarker === next.renderMarker
)

MapEstablishmentMarker.displayName = "MapEstablishmentMarker"

export const MapEstablishmentMarkers = memo(
  ({
    dimmedMarkerIds,
    establishments,
    getMarkerByEstablishmentType,
    markerScale,
    onSelectPlace,
    visibleMarkerIds,
  }: MapEstablishmentMarkersProps) => {
    const markers = useMemo(
      () =>
        establishments.map((establishment) => ({
          establishment,
          isDimmed: dimmedMarkerIds.has(establishment.id),
          node: getMarkerByEstablishmentType(
            establishment.establishmentTypeId,
            establishment.name,
            dimmedMarkerIds.has(establishment.id)
          ),
        })),
      [dimmedMarkerIds, establishments, getMarkerByEstablishmentType]
    )

    return (
      <>
        {markers.map(({ establishment, node }) => (
          <MapEstablishmentMarker
            establishment={establishment}
            isVisible={visibleMarkerIds.has(establishment.id)}
            key={establishment.id}
            markerScale={markerScale}
            onSelectPlace={onSelectPlace}
            renderMarker={node}
          />
        ))}
      </>
    )
  },
  (previous, next) =>
    previous.markerScale === next.markerScale &&
    previous.onSelectPlace === next.onSelectPlace &&
    previous.getMarkerByEstablishmentType === next.getMarkerByEstablishmentType &&
    previous.establishments === next.establishments &&
    areMarkerSetsEqual(previous.visibleMarkerIds, next.visibleMarkerIds) &&
    areMarkerSetsEqual(previous.dimmedMarkerIds, next.dimmedMarkerIds)
)

MapEstablishmentMarkers.displayName = "MapEstablishmentMarkers"
