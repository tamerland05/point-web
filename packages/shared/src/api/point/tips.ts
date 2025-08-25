import type { AxiosResponse } from "axios"

import { queryOptions } from "@tanstack/react-query"

import pointAxiosInstance from "@/api/point"
import { ensureAccessTokenIsAvailable } from "@/utils/ensureAccessTokenIsAvailable"

export interface AssetDTO {
  address: string
  id: string
  imageUrl: string
  name: string
  symbol: string
  tonPrice: string
}

export const tipAssetsQueryOptions = queryOptions({
  gcTime: Number.POSITIVE_INFINITY,
  queryFn: async () => {
    await ensureAccessTokenIsAvailable()

    const response = await pointAxiosInstance.get<AssetDTO[], AxiosResponse<AssetDTO[]>>("/point/tip/assets")

    return response.data
  },
  queryKey: ["tip-assets"],
  staleTime: Number.POSITIVE_INFINITY,
})

export interface ReceiversDTO {
  placeWallet: string
  employees: {
    id: string
    name: string
    profession: string
    photo: string
  }[]
}

export const tipReceiversQueryOptions = (placeId: string) =>
  queryOptions({
    queryFn: async () => {
      await ensureAccessTokenIsAvailable()

      const response = await pointAxiosInstance.get<ReceiversDTO, AxiosResponse<ReceiversDTO>>(
        `/point/tip/receivers/${placeId}`
      )

      return response.data
    },
    queryKey: ["tip-receivers", placeId],
  })

export interface CheckoutReq {
  recipientId: string
  recipientType: "employee" | "establishment"
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
    queryFn: async () => {
      await ensureAccessTokenIsAvailable()

      const response = await pointAxiosInstance.post<CheckoutDTO[], AxiosResponse<CheckoutDTO[]>, CheckoutReq>(
        "/point/tip/send/checkout",
        req
      )

      return response.data
    },
    queryKey: ["tip-checkout", req],
  })
