import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query"

import pointAxiosInstance from "@/api/point"
import { ensureAccessTokenIsAvailable } from "@/utils/ensureAccessTokenIsAvailable"

export interface PaymentMethodDTO {
  id: string
  brand: string
  maskedPan: string
  isPrimary: boolean
}

export const paymentMethodsQueryOptions = queryOptions({
  queryFn: async () => {
    await ensureAccessTokenIsAvailable()

    const response = await pointAxiosInstance.get<PaymentMethodDTO[]>("/point/account/payment-methods", {
      timeout: 5000,
    })
    return Array.isArray(response.data) ? response.data : []
  },
  queryKey: ["account", "payment-methods"],
  staleTime: 30_000,
})

export const useAddPaymentMethodMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { cardNumber: string; holderName: string }) => {
      await ensureAccessTokenIsAvailable()
      const normalized = payload.cardNumber.replace(/\s+/g, "")

      const response = await pointAxiosInstance.post<PaymentMethodDTO>(
        "/point/account/payment-methods",
        {
          cardNumber: normalized,
          holderName: payload.holderName.trim(),
        },
        {
          timeout: 5000,
        }
      )
      return response.data
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "payment-methods"] })
    },
  })
}
