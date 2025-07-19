import { queryOptions, useMutation } from "@tanstack/react-query"

import pointAxiosInstance from "@/api/point"
import type { Coordinates, MenuItem } from "@/types"
import { ensureAccessTokenIsAvailable } from "@/utils/ensureAccessTokenIsAvailable"
import type { AxiosResponse } from "axios"

interface EstbalishmentsReq {
  latitude: number
  longitude: number
  scale: number
}

interface EstbalishmentDTO {
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

      const response = await pointAxiosInstance.post<
        EstbalishmentDTO[],
        AxiosResponse<EstbalishmentDTO[]>,
        EstbalishmentsReq
      >("/point/map/establishments", { latitude, longitude, scale })

      return response.data
    },
    gcTime: Number.POSITIVE_INFINITY,
    staleTime: Number.POSITIVE_INFINITY,
  })

export interface DetailedEstbalishmentDTO {
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

      const response = await pointAxiosInstance.get<DetailedEstbalishmentDTO>(
        `/point/map/establishment/${establishmentId}`
      )

      return response.data
    },
  })

interface EstbalishmentsNearReq {
  name: string
  location: Coordinates
}

export const placesNearQueryOptions = (name: string, location: Coordinates) =>
  queryOptions({
    queryKey: ["places", name, location],
    queryFn: async () => {
      await ensureAccessTokenIsAvailable()

      const response = await pointAxiosInstance.post<
        EstbalishmentDTO[],
        AxiosResponse<EstbalishmentDTO[]>,
        EstbalishmentsNearReq
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

      const response = await pointAxiosInstance.get<MenuItem, AxiosResponse<MenuItem>, EstbalishmentsNearReq>(
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
