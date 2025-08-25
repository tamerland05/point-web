import type { AxiosResponse } from "axios"
import type { Coordinates, MenuItem } from "@/types"

import { keepPreviousData, queryOptions, useMutation } from "@tanstack/react-query"

import pointAxiosInstance from "@/api/point"
import { ensureAccessTokenIsAvailable } from "@/utils/ensureAccessTokenIsAvailable"

interface EstablishmentsReq {
  latitude: number
  longitude: number
  scale: number
  viewPortSize: {
    width: number
    height: number
  }
}

export interface EstablishmentDTO {
  id: string
  name: string
  photo: string
  establishmentTypeId: string
  position: Coordinates
  rating: number
}

export const establishmentsQueryOptions = (latitude: number, longitude: number, scale: number) =>
  queryOptions({
    gcTime: Number.POSITIVE_INFINITY,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      await ensureAccessTokenIsAvailable()

      const viewPortSize = {
        height: window.innerHeight,
        width: window.innerWidth,
      }

      const response = await pointAxiosInstance.post<
        EstablishmentDTO[],
        AxiosResponse<EstablishmentDTO[]>,
        EstablishmentsReq
      >("/point/map/establishments", { latitude, longitude, scale, viewPortSize })

      return response.data
    },
    queryKey: ["establishments", latitude, longitude, scale],
    staleTime: Number.POSITIVE_INFINITY,
  })

interface DetailedEstablishmentDTO {
  id: string
  name: string
  photo: string
  establishmentTypeId: string
  position: Coordinates
  rating: number
  description: string
  icon: string
  gallery: string[]
  menu: MenuItem[]
  channelLink: string | null
  userRating: number | null
}

export const establishmentQueryOptions = (establishmentId?: string) =>
  queryOptions({
    enabled: !!establishmentId,
    queryFn: async () => {
      await ensureAccessTokenIsAvailable()

      if (!establishmentId) {
        return null
      }

      const response = await pointAxiosInstance.get<DetailedEstablishmentDTO>(
        `/point/map/establishment/${establishmentId}`
      )

      return response.data
    },
    queryKey: ["establishment", establishmentId],
    staleTime: 5,
  })

interface EstablishmentsNearReq {
  name: string
  location: Coordinates
}

export const placesNearQueryOptions = (name: string, location: Coordinates) =>
  queryOptions({
    gcTime: Number.POSITIVE_INFINITY,
    queryFn: async () => {
      await ensureAccessTokenIsAvailable()

      const response = await pointAxiosInstance.post<
        EstablishmentDTO[],
        AxiosResponse<EstablishmentDTO[]>,
        EstablishmentsNearReq
      >("/point/map/establishments/near", { location, name })

      return response.data
    },
    queryKey: ["places", name, location],
    staleTime: Number.POSITIVE_INFINITY,
  })

export const menuItemQueryOptions = (menuItemId: string) =>
  queryOptions({
    gcTime: Number.POSITIVE_INFINITY,
    queryFn: async () => {
      await ensureAccessTokenIsAvailable()

      const response = await pointAxiosInstance.get<MenuItem, AxiosResponse<MenuItem>, EstablishmentsNearReq>(
        `/point/map/menu-item/${menuItemId}`
      )

      return response.data
    },
    queryKey: ["menuItem", menuItemId],
    staleTime: Number.POSITIVE_INFINITY,
  })

interface EstablishmentRatingInvoiceReq {
  establishmentId: string
  mark: number
}

export const useEstablishmentRatingMutation = (establishmentId: string) => {
  return useMutation({
    mutationFn: async (mark: number) => {
      await ensureAccessTokenIsAvailable()

      const response = await pointAxiosInstance.post<string, AxiosResponse<string>, EstablishmentRatingInvoiceReq>(
        "/point/map/establishment-rating/create-invoice",
        {
          establishmentId,
          mark,
        }
      )

      return response.data
    },
    mutationKey: ["establishmentRating", establishmentId],
  })
}
