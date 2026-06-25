import { createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"

import { useTranslation } from "@point/i18n"
import { useFormatter } from "@point/shared/hooks/useFormatter"
import { posOrderCurrencyDisplay } from "@point/shared/utils/posCurrency"
import { cn } from "@point/ui/cn"

import { posOrderStatusLabel } from "@/components/pos-table/posStatusI18n"
import { usePosTableContext } from "@/components/pos-table/posTableContext"

export const Route = createFileRoute("/table/$linkId/history")({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { linkId } = Route.useParams()
  const { formatCurrency } = useFormatter()
  const { t } = useTranslation()
  const { sessionQuery } = usePosTableContext()

  const session = sessionQuery.data?.session
  const orders = sessionQuery.data?.orders ?? []
  const latest = orders[0]
  const headerSubtitle = useMemo(() => {
    if (!latest) {
      return t("POS.HISTORY.NO_ORDERS_SUMMARY")
    }
    const cur = posOrderCurrencyDisplay(latest.currency)
    const n = latest.items.reduce((acc, li) => acc + li.quantity, 0)
    return `${formatCurrency(Number.parseFloat(latest.total_amount))} ${cur} · ${t("POS.HISTORY.ITEMS_COUNT", { count: Math.round(n) })}`
  }, [formatCurrency, latest, t])

  const [tab, setTab] = useState<"order" | "receipt">("order")

  return (
    <div className="px-4 pt-4 pb-6">
      <div className="mb-5 rounded-2xl bg-background-secondary p-4">
        {session?.establishment_name ? (
          <div className="font-semibold text-text text-title-3">{session.establishment_name}</div>
        ) : null}
        <div className={cn("text-caption-1 text-text-secondary", session?.establishment_name && "mt-1")}>
          {headerSubtitle}
        </div>
        <div className="mt-3 flex gap-2">
          <button
            className={cn(
              "rounded-xl bg-background px-3.5 py-2.5 text-caption-1 text-text",
              tab === "order" && "bg-accent/10 text-accent"
            )}
            onClick={() => setTab("order")}
            type="button"
          >
            {t("POS.COMMON.ORDER")}
          </button>
          <button
            className={cn(
              "rounded-xl bg-background px-3.5 py-2.5 text-caption-1 text-text",
              tab === "receipt" && "bg-accent/10 text-accent"
            )}
            onClick={() => setTab("receipt")}
            type="button"
          >
            {t("POS.COMMON.RECEIPT")}
          </button>
        </div>
      </div>

      {tab === "order" ? (
        <div className="flex flex-col gap-2.5">
          {orders.map((o) => (
            <button
              className="rounded-2xl bg-background-secondary p-4 text-left"
              key={o.id}
              onClick={() => {
                void navigate({ params: { linkId, orderId: o.id }, to: "/table/$linkId/order/$orderId" } as never)
              }}
              type="button"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium text-text">{posOrderStatusLabel(t, o.status)}</span>
                <span className="text-caption-1 text-text-secondary">
                  {formatCurrency(Number.parseFloat(o.total_amount))} {posOrderCurrencyDisplay(o.currency)}
                </span>
              </div>
              <div className="text-caption-1 text-text-secondary">
                {t("POS.HISTORY.ORDER_CARD_LINES", { count: o.items.length })}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-background-secondary p-4">
          <div className="mb-2 text-caption-1 text-text-secondary">{t("POS.COMMON.RECEIPT")}</div>
          <div className="space-y-2">
            {orders.map((o) => (
              <div className="flex items-center justify-between" key={o.id}>
                <span className="text-sm text-text-secondary">{o.id.slice(0, 8)}</span>
                <span className="text-sm text-text-secondary">
                  {formatCurrency(Number.parseFloat(o.total_amount))} {posOrderCurrencyDisplay(o.currency)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        className="mt-5 w-full rounded-2xl bg-background-secondary py-3.5 font-medium text-text"
        onClick={() => {
          void navigate({ params: { linkId }, to: "/table/$linkId/" } as never)
        }}
        type="button"
      >
        {t("POS.HISTORY.OK_BUTTON")}
      </button>
    </div>
  )
}
