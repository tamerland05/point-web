import { queryOptions } from "@tanstack/react-query"
import type { AxiosResponse } from "axios"

import pointAxiosInstance from "@/api/point"
import { ensureAccessTokenIsAvailable } from "@/utils/ensureAccessTokenIsAvailable"

interface EstablishmentType {
  id: string
  name: string
  icon: string
}

export type EstablishmentTypesDTO = Record<string, EstablishmentType>

export const establishmentTypesQueryOptions = queryOptions({
  queryKey: ["establishment-types"],
  queryFn: async () => {
    await ensureAccessTokenIsAvailable()

    const response = await pointAxiosInstance.get<EstablishmentTypesDTO, AxiosResponse<EstablishmentTypesDTO>>(
      "/point/map/establishment-types"
    )

    return response.data
  },
  staleTime: Number.POSITIVE_INFINITY,
  gcTime: Number.POSITIVE_INFINITY,
})
