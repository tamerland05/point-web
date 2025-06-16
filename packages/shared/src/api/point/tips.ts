import { queryOptions } from "@tanstack/react-query"
import type { AxiosResponse } from "axios"

import pointAxiosInstance from "@/api/point"
import { ensureAccessTokenIsAvailable } from "@/utils/ensureAccessTokenIsAvailable"

interface AssetDTO {
  id: string
  name: string
  ticker: string
  price: string
  address: string
  icon: string
}

export const tipAssetsQueryOptions = queryOptions({
  queryKey: ["tip-assets"],
  queryFn: async () => {
    await ensureAccessTokenIsAvailable()

    const response = await pointAxiosInstance.get<AssetDTO[], AxiosResponse<AssetDTO[]>>("/point/tip/assets")

    return response.data
  },
  staleTime: Number.POSITIVE_INFINITY,
  gcTime: Number.POSITIVE_INFINITY,
})

export interface ReceiversDTO {
  placeWallet: string
  employees: {
    id: string
    name: string
    profession: string
    icon: string
  }[]
}

export const tipReceiversQueryOptions = (placeId: string) =>
  queryOptions({
    queryKey: ["tip-receivers", placeId],
    queryFn: async () => {
      await ensureAccessTokenIsAvailable()

      const response = await pointAxiosInstance.get<ReceiversDTO, AxiosResponse<ReceiversDTO>>(
        `/point/tip/receivers/${placeId}`
      )

      return response.data
    },
  })

export interface CheckoutReq {
  recipientId: string
  assetId: string
  amount: number
}

export interface CheckoutDTO {
  to: string
  value: number
  body: string
}

export const tipCheckoutQueryOptions = (req: CheckoutReq) =>
  queryOptions({
    queryKey: ["tip-checkout", req],
    queryFn: async () => {
      await ensureAccessTokenIsAvailable()

      const response = await pointAxiosInstance.post<CheckoutDTO, AxiosResponse<CheckoutDTO>, CheckoutReq>(
        "/point/tip/send/checkout",
        req
      )

      return response.data
    },
  })
