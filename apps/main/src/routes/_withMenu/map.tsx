import { langitudeAtom, latitudeAtom, zoomAtom } from "@/atoms/map"
import { showMenuAtom } from "@/atoms/ui"
import { MapboxMap } from "@/components/mapbox"
import { Drawer } from "@point/ui/drawer"
import { createFileRoute, useNavigate } from "@tanstack/react-router"

import { zodValidator } from "@tanstack/zod-adapter"
import { requestLocation } from "@telegram-apps/sdk-react"
import { useAtom, useSetAtom } from "jotai"
import { useEffect, useState } from "react"
import type { ViewState } from "react-map-gl/mapbox"
import { z } from "zod"

const defaultLongitude = 30.314997
const defaultLatitude = 59.938784

const productSearchSchema = z.object({
	longitude: z.number().default(defaultLongitude),
	latitude: z.number().default(defaultLatitude),
	zoom: z.number().default(14),
	selectedPlaceId: z.string().default(""),
	sort: z.enum(["newest", "oldest", "price"]).default("newest"),
})

export const Route = createFileRoute("/_withMenu/map")({
	component: RouteComponent,
	validateSearch: zodValidator(productSearchSchema),
	loader: async () => {
		try {
			const location = await requestLocation()
			return {
				userLocation: {
					longitude: location.longitude,
					latitude: location.latitude,
					isDefault: false,
				},
			}
		} catch (error) {
			console.warn("Could not get location:", error)
			return {
				userLocation: {
					longitude: defaultLongitude,
					latitude: defaultLatitude,
					isDefault: true,
				},
			}
		}
	},
	search: {
		middlewares: [
			({ search, next }) => {
				return next(search)
			},
		],
	},
})

// view transition forward to /places/id
// drawer disable fukn overlay

function RouteComponent() {
	const setMenuVisible = useSetAtom(showMenuAtom)
	const { selectedPlaceId, sort } = Route.useSearch()
	const { userLocation } = Route.useLoaderData()
	const navigate = useNavigate({ from: Route.fullPath })

	// biome-ignore lint/correctness/useExhaustiveDependencies: its ok
	useEffect(() => {
		setLongitude(userLocation.longitude)
		setLatitude(userLocation.latitude)
	}, [])

	const [longitude, setLongitude] = useAtom(langitudeAtom)
	const [latitude, setLatitude] = useAtom(latitudeAtom)
	const [zoom, setZoom] = useAtom(zoomAtom)

	const handleMoveMap = (viewState: ViewState) => {
		setLongitude(viewState.longitude)
		setLatitude(viewState.latitude)
		setZoom(viewState.zoom)
	}

	const handleSelectPlace = (placeId: string) => {
		setMenuVisible(false)
		navigate({
			search: (prev) => ({ ...prev, selectedPlaceId: placeId }),
		})
	}

	const handleCloseDrawer = () => {
		navigate({
			search: (prev) => ({ ...prev, selectedPlaceId: "" }),
		})
	}

	const [drawerExpanded, setDrawerExpanded] = useState(false)
	const handleExpandDrawer = () => {
		setDrawerExpanded(true)
		// mb just navigate with view transition
	}
	useEffect(() => {
		if (!selectedPlaceId) {
			setDrawerExpanded(false)
			setMenuVisible(true)
		}
	}, [selectedPlaceId, setMenuVisible])

	return (
		<div>
			<MapboxMap
				userLongitude={userLocation.longitude}
				userLatitude={userLocation.latitude}
				userIsDefault={userLocation.isDefault}
				longitude={longitude}
				latitude={latitude}
				zoom={zoom}
				onSelectPlace={handleSelectPlace}
				onMove={handleMoveMap}
			/>
			<Drawer
				isOpen={!!selectedPlaceId}
				height={drawerExpanded ? "full" : "lg"}
				onClose={handleCloseDrawer}
				onExpand={handleExpandDrawer}
			>
				<div>Hello</div>
			</Drawer>
		</div>
	)
}
