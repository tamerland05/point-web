import { MAP_API_KEY, MAP_CONTAINER_ID } from "@/constants/map"
import { load } from "@2gis/mapgl"
import type { Map as MapType } from "@2gis/mapgl/types"
import { useTranslation } from "@point/i18n"
import { useEffect, useRef } from "react"
import { MapWrapper } from "./wrapper"

export const MapController = () => {
	const { i18n } = useTranslation()

	const map = useRef<MapType | null>(null)

	useEffect(() => {
		load().then((mapglAPI) => {
			map.current = new mapglAPI.Map(MAP_CONTAINER_ID, {
				center: [30.314997, 59.938784],
				zoom: 14,
				key: MAP_API_KEY,
				graphicsPreset: "light",
				lang: i18n.language,
				styleState: { globeEnabled: true, terrainEnabled: false },
			})
		})

		return () => {
			map.current?.destroy()
		}
	}, [])

	// const MapWrapper = memo(
	// 	() => {
	// 		return <div id={MAP_CONTAINER_ID} style={{ width: "100%", height: "100%" }} />
	// 	},
	// 	() => true
	// )

	return (
		<div style={{ width: "100vm", height: "100vh" }}>
			<MapWrapper />
		</div>
	)
}
