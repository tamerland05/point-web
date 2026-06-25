import type { AxiosResponse } from "axios"

import { queryOptions } from "@tanstack/react-query"

import pointAxiosInstance from "@/api/point"
import { ensureAccessTokenIsAvailable } from "@/utils/ensureAccessTokenIsAvailable"

export interface AccountOrderHistoryItemDTO {
  id: string
  establishmentName: string
  createdAt: string
  status: "paid" | "processing" | "cancelled"
  totalAmount: number
  currency: string
  itemsCount: number
}

export interface AccountOrderHistoryDetailsDTO extends AccountOrderHistoryItemDTO {
  items: {
    id: string
    name: string
    price: number
    quantity: number
  }[]
}

function normalizeSummary(raw: unknown): AccountOrderHistoryItemDTO[] {
  if (!Array.isArray(raw)) {
    return []
  }

  return raw
    .map((row) => {
      if (!row || typeof row !== "object") {
        return null
      }
      const data = row as Record<string, unknown>
      const id = data["id"]
      const name = data["establishmentName"] ?? data["establishment_name"]
      const createdAt = data["createdAt"] ?? data["created_at"]
      const status = data["status"]
      const totalAmount = data["totalAmount"] ?? data["total_amount"]
      if (
        typeof id !== "string" ||
        typeof name !== "string" ||
        typeof createdAt !== "string" ||
        typeof status !== "string" ||
        typeof totalAmount !== "number"
      ) {
        return null
      }
      return {
        createdAt,
        currency: typeof data["currency"] === "string" ? data["currency"] : "RUB",
        establishmentName: name,
        id,
        itemsCount: typeof data["itemsCount"] === "number" ? data["itemsCount"] : 0,
        status: status === "paid" || status === "processing" || status === "cancelled" ? status : "processing",
        totalAmount,
      } satisfies AccountOrderHistoryItemDTO
    })
    .filter((item): item is AccountOrderHistoryItemDTO => item !== null)
}

export const accountOrderHistoryQueryOptions = (search = "") =>
  queryOptions({
    queryFn: async () => {
      await ensureAccessTokenIsAvailable()

      const response = await pointAxiosInstance.get<AccountOrderHistoryItemDTO[]>("/point/account/history", {
        params: search.trim().length > 0 ? { q: search } : undefined,
      })
      return normalizeSummary(response.data)
    },
    queryKey: ["account", "history", search],
    staleTime: 20_000,
  })

export const accountOrderHistoryDetailQueryOptions = (orderId: string) =>
  queryOptions({
    enabled: orderId.trim().length > 0,
    queryFn: async () => {
      await ensureAccessTokenIsAvailable()

      const response = await pointAxiosInstance.get<
        AccountOrderHistoryDetailsDTO,
        AxiosResponse<AccountOrderHistoryDetailsDTO>
      >(`/point/account/history/${orderId}`)
      return response.data
    },
    queryKey: ["account", "history", "detail", orderId],
    staleTime: 20_000,
  })
