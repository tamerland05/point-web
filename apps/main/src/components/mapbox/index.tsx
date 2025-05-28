import { useState } from "react"
import MapComp, { Marker } from "react-map-gl/mapbox"

import "mapbox-gl/dist/mapbox-gl.css"

export const MapboxMap = () => {
	const [viewState, setViewState] = useState({
		longitude: 30.314997,
		latitude: 59.938784,
		zoom: 14,
	})

	return (
		<MapComp
			{...viewState}
			onMove={(evt) => setViewState(evt.viewState)}
			mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
			mapStyle="mapbox://styles/mapbox/streets-v9"
			style={{ width: "100%", height: "100vh" }}
		>
			<Marker longitude={30.332997} latitude={59.928984} anchor="bottom">
				<img src="/Noodle.svg" alt="Noodle" />
			</Marker>
			<Marker longitude={30.342997} latitude={59.928784} anchor="bottom">
				<img src="/Noodle.svg" alt="Noodle" />
			</Marker>
			<Marker longitude={30.302997} latitude={59.928584} anchor="bottom">
				<img src="/Noodle.svg" alt="Noodle" />
			</Marker>
		</MapComp>
	)
}
