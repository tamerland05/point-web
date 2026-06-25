import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { useMemo } from "react"

import { type AuthReq, authQueryOptions } from "@point/shared/api/point/auth"
import { establishmentQueryOptions } from "@point/shared/api/point/establishments"

import { useParityCapture } from "@/hooks/useParityCapture"

interface BookingScreenDataContext {
  initDataRaw?: string | null
  tgWebAppData: AuthReq
}

export function useBookingScreenData(establishmentId: string | undefined, context: BookingScreenDataContext) {
  const parityCapture = useParityCapture()

  const authQuery = useSuspenseQuery(authQueryOptions(context.tgWebAppData, context.initDataRaw ?? undefined))
  const establishmentQuery = useQuery(establishmentQueryOptions(establishmentId))

  const user = authQuery.data.user
  const establishment = establishmentQuery.data

  const accountName = useMemo(() => user.employee?.name || user.name || "", [user.employee?.name, user.name])

  return {
    accountName,
    establishmentAddress: establishment?.position?.address,
    establishmentName: establishment?.name,
    establishmentPhoto: establishment?.photo,
    parityCapture,
  }
}
