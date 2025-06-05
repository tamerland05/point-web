import { useQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { requestLocation } from "@telegram-apps/sdk-react"
import { getDefaultStore, useAtom, useSetAtom } from "jotai"
import { useEffect, useState } from "react"
import { Marker, type ViewState } from "react-map-gl/mapbox"
import { z } from "zod"

import { langitudeAtom, latitudeAtom, zoomAtom } from "@/atoms/map"
import { showMenuAtom } from "@/atoms/ui"
import { MapboxMap } from "@/components/mapbox"
import { placesQueryOptions } from "@point/shared/api/point/places"
import { useDebounce } from "@point/shared/hooks/useDebounce"
import { Drawer } from "@point/ui/drawer"

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
	loader: async ({ context }) => {
		const { queryClient } = context
		const store = getDefaultStore()
		const upperCoordinates = {
			longitude: store.get(langitudeAtom) + 0.001,
			latitude: store.get(latitudeAtom) + 0.001,
		}
		const lowerCoordinates = {
			longitude: store.get(langitudeAtom) - 0.001,
			latitude: store.get(latitudeAtom) - 0.001,
		}

		try {
			const location = await requestLocation()

			queryClient.ensureQueryData(placesQueryOptions(upperCoordinates, lowerCoordinates))

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

	const [longitude, setLongitude] = useAtom(langitudeAtom)
	const [latitude, setLatitude] = useAtom(latitudeAtom)
	const [zoom, setZoom] = useAtom(zoomAtom)

	const upperCoordinates = {
		longitude: longitude + 0.001,
		latitude: latitude + 0.001,
	}

	const lowerCoordinates = {
		longitude: longitude - 0.001,
		latitude: latitude - 0.001,
	}

	const debouncedUpperCoordinates = useDebounce(upperCoordinates, 222)
	const debouncedLowerCoordinates = useDebounce(lowerCoordinates, 222)

	const placesQuery = useQuery(placesQueryOptions(debouncedUpperCoordinates, debouncedLowerCoordinates))
	const places = placesQuery.data

	console.log(places)

	// biome-ignore lint/correctness/useExhaustiveDependencies: its ok
	useEffect(() => {
		setLongitude(userLocation.longitude)
		setLatitude(userLocation.latitude)
	}, [])

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
			>
				{places?.map((place) => (
					<Marker
						key={place.id}
						longitude={place.position.longitude}
						latitude={place.position.latitude}
						anchor="bottom"
					>
						<img src="/Noodle.svg" alt={place.name} />
					</Marker>
				))}
			</MapboxMap>
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
