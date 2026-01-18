import type { AxiosResponse } from "axios"

import { queryOptions } from "@tanstack/react-query"

import pointAxiosInstance from "@/api/point"
import { ensureAccessTokenIsAvailable } from "@/utils/ensureAccessTokenIsAvailable"

interface EstablishmentType {
  id: string
  name: string
  icon: string
}

type EstablishmentTypesDTO = Record<string, EstablishmentType>

export const establishmentTypesQueryOptions = queryOptions({
  gcTime: Number.POSITIVE_INFINITY,
  queryFn: async () => {
    await ensureAccessTokenIsAvailable()

    const response = await pointAxiosInstance.get<EstablishmentTypesDTO, AxiosResponse<EstablishmentTypesDTO>>(
      "/point/map/establishment-types"
    )

    return response.data
  },
  queryKey: ["establishment-types"],
  staleTime: Number.POSITIVE_INFINITY,
})
