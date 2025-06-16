import { queryOptions } from "@tanstack/react-query"
import type { AxiosResponse } from "axios"

import pointAxiosInstance from "@/api/point"
import { ensureAccessTokenIsAvailable } from "@/utils/ensureAccessTokenIsAvailable"

interface EstablishmentTypeDTO {
  id: string
  name: string
  icon: string
}

export const establishmentTypesQueryOptions = queryOptions({
  queryKey: ["establishment-types"],
  queryFn: async () => {
    await ensureAccessTokenIsAvailable()

    const response = await pointAxiosInstance.get<EstablishmentTypeDTO[], AxiosResponse<EstablishmentTypeDTO[]>>(
      "/point/map/establishment-types"
    )

    return response.data
  },
  staleTime: Number.POSITIVE_INFINITY,
  gcTime: Number.POSITIVE_INFINITY,
})
