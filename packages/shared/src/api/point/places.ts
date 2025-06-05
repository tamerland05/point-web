import { queryOptions } from "@tanstack/react-query"

import pointAxiosInstance from "@/api/point"

export interface PlacesReq {
	upper: {
		latitude: number
		longitude: number
		address: string
	}
	lower: {
		latitude: number
		longitude: number
		address: string
	}
}

export interface Place {
	id: string
	name: string
	photo: string
	establishmentId: string
	position: {
		latitude: number
		longitude: number
		address: string
	}
	rating: number
}

export type PlacesDTO = Place[]

interface Coordinates {
	longitude: number
	latitude: number
}

export const placesQueryOptions = (upperCoordinates: Coordinates, lowerCoordinates: Coordinates) =>
	queryOptions({
		queryKey: ["places", upperCoordinates, lowerCoordinates],
		queryFn: async () => {
			const response = await pointAxiosInstance.post<PlacesDTO>("/point/map/places", {
				upper: {
					longitude: upperCoordinates.longitude,
					latitude: upperCoordinates.latitude,
					address: "",
				},
				lower: {
					longitude: lowerCoordinates.longitude,
					latitude: lowerCoordinates.latitude,
					address: "",
				},
			})

			return response.data
		},
	})

export interface PlaceDTO {
	id: string
	name: string
	photo: string
	establishmentId: string
	position: {
		latitude: number
		longitude: number
		address: string
	}
	rating: number
	description: string
	icon: string
	gallery: string[]
	menu: Array<{
		title: string
		description: string
		photo: string
		cost: {
			value: number
			currency: string
		}
	}>
}

export const placeQueryOptions = (placeId: string) =>
	queryOptions({
		queryKey: ["place", placeId],
		queryFn: async () => {
			const response = await pointAxiosInstance.post<PlaceDTO>(`/point/map/place/${placeId}`)

			return response.data
		},
	})
