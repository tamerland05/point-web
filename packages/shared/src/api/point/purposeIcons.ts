import { queryOptions } from "@tanstack/react-query"
import type { AxiosResponse } from "axios"

import pointAxiosInstance from "@/api/point"
import { ensureAccessTokenIsAvailable } from "@/utils/ensureAccessTokenIsAvailable"

interface PurposeIcon {
  id: string
  preview: string
}

export type PurposeIconsDTO = PurposeIcon[]

export const purposeIconsQueryOptions = queryOptions({
  queryKey: ["purpose-icons"],
  queryFn: async () => {
    await ensureAccessTokenIsAvailable()

    const response = await pointAxiosInstance.get<PurposeIconsDTO, AxiosResponse<PurposeIconsDTO>>(
      "/point/account/purpose-icons"
    )

    return response.data
  },
  staleTime: Number.POSITIVE_INFINITY,
  gcTime: Number.POSITIVE_INFINITY,
})
