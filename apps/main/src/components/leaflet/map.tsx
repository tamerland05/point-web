import type { LatLngExpression } from "leaflet"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"

import "leaflet/dist/leaflet.css"

export const LeafletMap = () => {
	const position = [59.938784, 30.314997] as LatLngExpression

	return (
		<MapContainer center={position} zoom={14} style={{ height: "calc(100vh - 93px)" }}>
			<TileLayer url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png" />

			<Marker position={position}>
				<Popup>Пример всплывающего окна</Popup>
			</Marker>
		</MapContainer>
	)
}
