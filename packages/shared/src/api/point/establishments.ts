import { queryOptions } from "@tanstack/react-query"

import pointAxiosInstance from "@/api/point"
import type { Coordinates } from "@/types"
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
  menu: Array<{
    title: string
    description: string
    photo: string
    cost: {
      value: number
      currency: string
    }
  }>
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

      const response = await pointAxiosInstance.post<DetailedEstbalishmentDTO>(
        `/point/map/establishmen/${establishmentId}`
      )

      return response.data
    },
    staleTime: 10 * 1000,
    gcTime: 10 * 1000,
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
