import { keepPreviousData, queryOptions, useMutation } from "@tanstack/react-query"

import pointAxiosInstance from "@/api/point"
import type { Coordinates, MenuItem } from "@/types"
import { ensureAccessTokenIsAvailable } from "@/utils/ensureAccessTokenIsAvailable"
import type { AxiosResponse } from "axios"

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
    queryKey: ["establishments", latitude, longitude, scale],
    queryFn: async () => {
      await ensureAccessTokenIsAvailable()

      const viewPortSize = {
        width: window.innerWidth,
        height: window.innerHeight,
      }

      const response = await pointAxiosInstance.post<
        EstablishmentDTO[],
        AxiosResponse<EstablishmentDTO[]>,
        EstablishmentsReq
      >("/point/map/establishments", { latitude, longitude, scale, viewPortSize })

      return response.data
    },
    gcTime: Number.POSITIVE_INFINITY,
    staleTime: Number.POSITIVE_INFINITY,
    placeholderData: keepPreviousData,
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
    queryKey: ["establishment", establishmentId],
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
    staleTime: 5,
  })

interface EstablishmentsNearReq {
  name: string
  location: Coordinates
}

export const placesNearQueryOptions = (name: string, location: Coordinates) =>
  queryOptions({
    queryKey: ["places", name, location],
    queryFn: async () => {
      await ensureAccessTokenIsAvailable()

      const response = await pointAxiosInstance.post<
        EstablishmentDTO[],
        AxiosResponse<EstablishmentDTO[]>,
        EstablishmentsNearReq
      >("/point/map/establishments/near", { name, location })

      return response.data
    },
    gcTime: Number.POSITIVE_INFINITY,
    staleTime: Number.POSITIVE_INFINITY,
  })

export const menuItemQueryOptions = (menuItemId: string) =>
  queryOptions({
    queryKey: ["menuItem", menuItemId],
    queryFn: async () => {
      await ensureAccessTokenIsAvailable()

      const response = await pointAxiosInstance.get<MenuItem, AxiosResponse<MenuItem>, EstablishmentsNearReq>(
        `/point/map/menu-item/${menuItemId}`
      )

      return response.data
    },
    gcTime: Number.POSITIVE_INFINITY,
    staleTime: Number.POSITIVE_INFINITY,
  })

interface EstablishmentRatingInvoiceReq {
  establishmentId: string
  mark: number
}

export const useEstablishmentRatingMutation = (establishmentId: string) => {
  return useMutation({
    mutationKey: ["establishmentRating", establishmentId],
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
  })
}
