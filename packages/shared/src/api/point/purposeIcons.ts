import type { AxiosResponse } from "axios"

import { queryOptions } from "@tanstack/react-query"

import pointAxiosInstance from "@/api/point"
import { ensureAccessTokenIsAvailable } from "@/utils/ensureAccessTokenIsAvailable"

interface PurposeIcon {
  id: string
  preview: string
}

export type PurposeIconsDTO = PurposeIcon[]

export const purposeIconsQueryOptions = queryOptions({
  gcTime: Number.POSITIVE_INFINITY,
  queryFn: async () => {
    await ensureAccessTokenIsAvailable()

    const response = await pointAxiosInstance.get<PurposeIconsDTO, AxiosResponse<PurposeIconsDTO>>(
      "/point/account/purpose-icons"
    )

    return response.data
  },
  queryKey: ["purpose-icons"],
  staleTime: Number.POSITIVE_INFINITY,
})
