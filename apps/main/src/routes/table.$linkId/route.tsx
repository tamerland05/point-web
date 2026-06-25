import { createFileRoute, Outlet } from "@tanstack/react-router"
import { getDefaultStore } from "jotai"
import { useEffect } from "react"

import { i18n, useTranslation } from "@point/i18n"
import { ensurePosSession } from "@point/shared/api/point/ensurePosSession"
import {
  findAwaitingPaymentOrder,
  posMenuQueryOptions,
  posSessionCurrentQueryOptions,
} from "@point/shared/api/point/posTable"
import { posSessionIdAtom } from "@point/shared/atoms/posTable"

import { PosCartFAB } from "@/components/pos-table/PosCartFAB"
import { PosSessionClosed } from "@/components/pos-table/PosSessionClosed"
import { PosTableSessionProvider, usePosTableContext } from "@/components/pos-table/posTableContext"

export const Route = createFileRoute("/table/$linkId")({
  component: TableLinkLayout,
  loader: async ({ context, params }) => {
    const initDataRaw = context.initDataRaw
    if (!initDataRaw) {
      throw new Error("Missing Telegram initDataRaw")
    }
    await ensurePosSession(params.linkId, initDataRaw)
    const sessionId = getDefaultStore().get(posSessionIdAtom)
    await context.queryClient.prefetchQuery(posSessionCurrentQueryOptions({ enabled: true }))
    await context.queryClient.prefetchQuery(posMenuQueryOptions(sessionId, { enabled: !!sessionId }))
  },
})

function TableLinkLayout() {
  return (
    <PosTableSessionProvider>
      <TableShell />
    </PosTableSessionProvider>
  )
}

function TableShell() {
  const { linkId } = Route.useParams()
  const navigate = Route.useNavigate()
  const { sessionQuery } = usePosTableContext()
  const { t } = useTranslation()
  /** POS-стол для гостей — единый русский интерфейс независимо от языка Telegram/браузера. */
  useEffect(() => {
    const previous = i18n.resolvedLanguage ?? i18n.language
    void i18n.changeLanguage("ru")
    return () => {
      void i18n.changeLanguage(previous)
    }
  }, [])

  const awaitingPayment = findAwaitingPaymentOrder(sessionQuery.data?.orders ?? [])

  if (sessionQuery.data?.session.status === "closed") {
    return <PosSessionClosed />
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#efeff4] [view-transition-name:main-content]">
      {awaitingPayment && (
        <button
          className="mx-4 mb-2 rounded-2xl bg-accent px-4 py-3 text-left text-white"
          onClick={() => {
            void navigate({ params: { linkId }, to: "/table/$linkId/payment" } as never)
          }}
          type="button"
        >
          <div className="font-medium text-base">{t("POS.TABLE_ROUTE.PAYMENT_REQUIRED_TITLE")}</div>
          <div className="mt-1 text-caption-1 opacity-90">{t("POS.TABLE_ROUTE.PAYMENT_REQUIRED_DESC")}</div>
        </button>
      )}

      <div className="flex-1 overflow-y-auto pb-32">
        <Outlet />
      </div>

      <PosCartFAB />
    </div>
  )
}
