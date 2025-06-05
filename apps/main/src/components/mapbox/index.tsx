import { memo } from "react"
import MapComp, { Marker, type ViewState } from "react-map-gl/mapbox"

import "mapbox-gl/dist/mapbox-gl.css"

interface MapboxMapProps {
	userLongitude: number
	userLatitude: number
	userIsDefault: boolean

	longitude: number
	latitude: number
	zoom: number

	selectedPlaceId?: string

	onSelectPlace: (placeId: string) => void
	onMove: (viewState: ViewState) => void

	children: React.ReactNode
}

export const MapboxMap = memo(
	({
		userLongitude,
		userLatitude,
		userIsDefault,

		longitude,
		latitude,
		zoom,

		onMove,

		children,
	}: MapboxMapProps) => {
		return (
			<MapComp
				longitude={longitude}
				latitude={latitude}
				zoom={zoom}
				onMove={(evt) => onMove(evt.viewState)}
				mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
				mapStyle="mapbox://styles/mapbox/streets-v9"
				style={{ width: "100%", height: "100vh" }}
			>
				{!userIsDefault && (
					<Marker longitude={userLongitude} latitude={userLatitude} anchor="bottom">
						<img src="/Pin.svg" alt="Pin" />
					</Marker>
				)}

				{children}
			</MapComp>
		)
	},
	() => false
)

MapboxMap.displayName = "MapboxMap"
