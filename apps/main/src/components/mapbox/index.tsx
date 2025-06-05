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

export const MapboxMap = ({
	userLongitude,
	userLatitude,
	userIsDefault,

	longitude,
	latitude,
	zoom,

	selectedPlaceId,
	onSelectPlace,
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
			<Marker longitude={30.332997} latitude={59.928984} anchor="bottom" onClick={() => onSelectPlace("1")}>
				<img src="/Noodle.svg" alt="Noodle1" />
			</Marker>
			<Marker longitude={30.342997} latitude={59.928784} anchor="bottom" onClick={() => onSelectPlace("2")}>
				<img src="/Noodle.svg" alt="Noodle2" />
			</Marker>
			<Marker longitude={30.302997} latitude={59.928584} anchor="bottom" onClick={() => onSelectPlace("3")}>
				<img src="/Noodle.svg" alt="Noodle3" />
			</Marker>
			{children}
		</MapComp>
	)
}
