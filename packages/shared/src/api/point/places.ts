import { queryOptions } from "@tanstack/react-query"

import pointAxiosInstance from "@/api/point"
import type { Coordinates } from "@/types"
import type { AxiosResponse } from "axios"

interface PlacesReq {
  diagonal: {
    upper: Coordinates
    lower: Coordinates
  }
  location: Coordinates
}

interface PlaceDTO {
  id: string
  name: string
  photo: string
  establishmentId: string
  position: Coordinates
  rating: number
}

export const placesQueryOptions = (upper: Coordinates, lower: Coordinates, location: Coordinates) =>
  queryOptions({
    queryKey: ["places", upper, lower, location],
    queryFn: async () => {
      const response = await pointAxiosInstance.post<PlaceDTO[], AxiosResponse<PlaceDTO[]>, PlacesReq>(
        "/point/map/places",
        { diagonal: { upper, lower }, location }
      )

      return response.data
    },
  })

export interface DetailedPlaceDTO {
  id: string
  name: string
  photo: string
  establishmentId: string
  position: Coordinates
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

export const placeQueryOptions = (placeId?: string) =>
  queryOptions({
    queryKey: ["place", placeId],
    enabled: !!placeId,
    queryFn: async () => {
      if (!placeId) {
        return null
      }

      const response = await pointAxiosInstance.post<DetailedPlaceDTO>(`/point/map/place/${placeId}`)

      return response.data
    },
  })
