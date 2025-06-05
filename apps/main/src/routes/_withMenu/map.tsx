import { useQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { requestLocation } from "@telegram-apps/sdk-react"
import { getDefaultStore, useAtom, useSetAtom } from "jotai"
import { useCallback, useEffect, useMemo } from "react"
import { Marker, type ViewState } from "react-map-gl/mapbox"
import { z } from "zod"

import { langitudeAtom, latitudeAtom, zoomAtom } from "@/atoms/map"
import { showMenuAtom } from "@/atoms/ui"
import { MapboxMap } from "@/components/mapbox"
import { PlaceModal } from "@/components/place-modal"
import { placesQueryOptions } from "@point/shared/api/point/places"
import { useDebounce } from "@point/shared/hooks/useDebounce"

const defaultLongitude = 30.314997
const defaultLatitude = 59.938784

const mapSchema = z.object({
	expanded: z.boolean().default(false),
	selectedPlaceId: z.string().default(""),
	sort: z.enum(["newest", "oldest", "price"]).default("newest"),
})

export const Route = createFileRoute("/_withMenu/map")({
	component: RouteComponent,
	validateSearch: zodValidator(mapSchema),
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
	const { selectedPlaceId, expanded: drawerExpanded } = Route.useSearch()
	const { userLocation } = Route.useLoaderData()
	const navigate = useNavigate({ from: Route.fullPath })

	const [longitude, setLongitude] = useAtom(langitudeAtom)
	const [latitude, setLatitude] = useAtom(latitudeAtom)
	const [zoom, setZoom] = useAtom(zoomAtom)

	const upperCoordinates = useMemo(
		() => ({
			longitude: longitude + 0.001,
			latitude: latitude + 0.001,
		}),
		[longitude, latitude]
	)

	const lowerCoordinates = useMemo(
		() => ({
			longitude: longitude - 0.001,
			latitude: latitude - 0.001,
		}),
		[longitude, latitude]
	)

	const debouncedUpperCoordinates = useDebounce(upperCoordinates, 222)
	const debouncedLowerCoordinates = useDebounce(lowerCoordinates, 222)

	const placesQuery = useQuery(placesQueryOptions(debouncedUpperCoordinates, debouncedLowerCoordinates))
	const places = placesQuery.data

	// biome-ignore lint/correctness/useExhaustiveDependencies: its ok
	useEffect(() => {
		setLongitude(userLocation.longitude)
		setLatitude(userLocation.latitude)
	}, [])

	const handleMoveMap = useCallback(
		(viewState: ViewState) => {
			setLongitude(viewState.longitude)
			setLatitude(viewState.latitude)
			setZoom(viewState.zoom)
		},
		[setLongitude, setLatitude, setZoom]
	)

	const handleSelectPlace = useCallback(
		(placeId: string) => {
			setMenuVisible(false)
			navigate({
				search: (prev) => ({ ...prev, selectedPlaceId: placeId }),
			})
		},
		[navigate, setMenuVisible]
	)

	const handleCloseDrawer = useCallback(() => {
		navigate({
			search: (prev) => ({ ...prev, selectedPlaceId: "" }),
		})
	}, [navigate])

	const handleExpandDrawer = useCallback(() => {
		navigate({
			search: (prev) => ({ ...prev, expanded: true }),
		})
		// mb just navigate with view transition
	}, [navigate])

	const handleCollapseDrawer = useCallback(() => {
		navigate({
			search: (prev) => ({ ...prev, expanded: false }),
		})
		// mb just navigate with view transition
	}, [navigate])

	useEffect(() => {}, [])

	useEffect(() => {
		const placeObject = places?.find((place) => place.id === selectedPlaceId)
		if (!selectedPlaceId || !placeObject) {
			handleCollapseDrawer()
			setMenuVisible(true)
		}
	}, [selectedPlaceId, setMenuVisible, handleCollapseDrawer])

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
						onClick={() => handleSelectPlace(place.id)}
					>
						<img src="/Noodle.svg" alt={place.name} />
					</Marker>
				))}
			</MapboxMap>

			<PlaceModal
				id={selectedPlaceId}
				photo={places?.find((place) => place.id === selectedPlaceId)?.photo}
				name={places?.find((place) => place.id === selectedPlaceId)?.name}
				address={places?.find((place) => place.id === selectedPlaceId)?.position.address}
				rating={places?.find((place) => place.id === selectedPlaceId)?.rating}
				drawerExpanded={drawerExpanded}
				handleCloseDrawer={handleCloseDrawer}
				handleExpandDrawer={handleExpandDrawer}
			/>
		</div>
	)
}
