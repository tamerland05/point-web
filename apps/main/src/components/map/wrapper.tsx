import { MAP_CONTAINER_ID } from "@/constants/map"
import { memo } from "react"

export const MapWrapper = memo(
	() => {
		return <div id={MAP_CONTAINER_ID} style={{ width: "100%", height: "100%" }} />
	},
	() => true
)
