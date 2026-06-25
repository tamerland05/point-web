import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useMemo, useRef, useState } from "react"

import { useTranslation } from "@point/i18n"
import { posOrderHasStatus } from "@point/shared/api/point/posTable"
import { useFormatter } from "@point/shared/hooks/useFormatter"
import { posOrderCurrencyDisplay } from "@point/shared/utils/posCurrency"
import { cn } from "@point/ui/cn"

import { posPaymentStatusLabel } from "@/components/pos-table/posStatusI18n"
import { usePosTableContext } from "@/components/pos-table/posTableContext"

export const Route = createFileRoute("/table/$linkId/order/$orderId")({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { linkId, orderId } = Route.useParams()
  const { sessionQuery } = usePosTableContext()
  const { formatCurrency } = useFormatter()
  const { t } = useTranslation()

  const session = sessionQuery.data?.session

  const order = useMemo(() => {
    return (sessionQuery.data?.orders ?? []).find((o) => o.id === orderId)
  }, [orderId, sessionQuery.data?.orders])

  const loggedPosErrorKeyRef = useRef<string | null>(null)
  useEffect(() => {
    const o = (sessionQuery.data?.orders ?? []).find((x) => x.id === orderId)
    const err = o?.last_error?.trim()
    if (!err) {
      return
    }
    const dedupe = `${orderId}\0${err}`
    if (loggedPosErrorKeyRef.current === dedupe) {
      return
    }
    loggedPosErrorKeyRef.current = dedupe
    console.warn("[POS] order last_error", { last_error: err, orderId })
  }, [orderId, sessionQuery.data])

  if (!order) {
    return <div className="p-6 text-caption-1 text-text-secondary">{t("POS.COMMON.ORDER_NOT_FOUND")}</div>
  }

  const orderCurrency = posOrderCurrencyDisplay(order.currency)
  const total = Number.parseFloat(order.total_amount)
  const tipPercents = [5, 10, 15, 20]
  const [tab, setTab] = useState<"order" | "receipt">("order")

  return (
    <div className="px-4 pt-4 pb-6">
      <div className="mb-5 rounded-2xl bg-background-secondary p-4">
        {session?.establishment_name ? (
          <div className="font-semibold text-text text-title-3">{session.establishment_name}</div>
        ) : null}
        <div className={cn("text-caption-1 text-text-secondary", session?.establishment_name && "mt-1")}>
          {formatCurrency(total)} {orderCurrency}
          {" · "}
          {t("POS.HISTORY.ORDER_CARD_LINES", { count: order.items.length })}
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
        <>
          <div className="mb-4 rounded-2xl bg-background-secondary p-4">
            <div className="mb-2 text-caption-1 text-text-secondary">{t("POS.ORDER.ORDER_LINES_TITLE")}</div>
            <div className="flex flex-col gap-2">
              {order.items.map((it) => (
                <div className="flex items-center justify-between" key={it.id}>
                  <span className="text-text">
                    {it.name} x {it.quantity}
                  </span>
                  <span className="text-text-secondary">
                    {formatCurrency(Number.parseFloat(it.price))} {orderCurrency}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-background-secondary p-4">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">{t("POS.POST_ORDER.TOTAL")}</span>
              <span className="font-semibold text-text">
                {formatCurrency(Number.parseFloat(order.total_amount))} {orderCurrency}
              </span>
            </div>
          </div>
        </>
      ) : (
        <div className="mb-4 rounded-2xl bg-background-secondary p-4">
          <div className="mb-2 text-caption-1 text-text-secondary">{t("POS.COMMON.RECEIPT")}</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">{t("POS.ORDER.RECEIPT_ORDER_SUM")}</span>
              <span className="text-sm text-text-secondary">
                {formatCurrency(total)} {orderCurrency}
              </span>
            </div>
            {order.payments.map((pay) => (
              <div className="flex items-center justify-between" key={pay.id}>
                <span className="text-sm text-text-secondary">{posPaymentStatusLabel(t, pay.status)}</span>
                <span className="text-sm text-text-secondary">
                  {formatCurrency(Number.parseFloat(pay.amount))} {orderCurrency}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "order" && posOrderHasStatus(order, "draft") && (
        <div className="mt-4 rounded-2xl bg-background-secondary p-4">
          <div className="mb-2 text-caption-1 text-text-secondary">{t("POS.ORDER.TIPS_TITLE")}</div>
          <div className="mb-3 grid grid-cols-2 gap-2">
            {tipPercents.map((p) => (
              <button className="rounded-xl bg-background px-3.5 py-2.5 text-caption-1 text-text" key={p} type="button">
                {p}% · {formatCurrency((total * p) / 100)} {orderCurrency}
              </button>
            ))}
          </div>
          <button className="w-full rounded-xl bg-background px-3.5 py-2.5 text-caption-1 text-text" type="button">
            {t("POS.ORDER.TIPS_CUSTOM")}
          </button>
          <div className="mt-3 rounded-xl bg-background px-3 py-2 text-caption-1 text-text-secondary">
            {t("POS.ORDER.TIPS_DRAFT_NOTE")}
          </div>
          <div className="mt-2 text-caption-2 text-text-secondary">{t("POS.ORDER.TIPS_DRAFT_STATUS")}</div>
        </div>
      )}

      {tab === "order" && !!order.payments.length && (
        <div className="mt-4 rounded-2xl bg-background-secondary p-4">
          <div className="mb-2 text-caption-1 text-text-secondary">{t("POS.ORDER.PAYMENTS_SECTION")}</div>
          <div className="flex flex-col gap-2">
            {order.payments.map((pay) => (
              <div className="flex items-center justify-between" key={pay.id}>
                <span className="text-sm text-text-secondary">{posPaymentStatusLabel(t, pay.status)}</span>
                <span className="text-sm text-text-secondary">
                  {formatCurrency(Number.parseFloat(pay.amount))} {orderCurrency}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex gap-2.5">
        {posOrderHasStatus(order, "awaiting_payment") && (
          <button
            className="flex-1 rounded-2xl bg-accent py-3.5 font-medium text-white"
            onClick={() => {
              void navigate({ params: { linkId }, to: "/table/$linkId/payment" } as never)
            }}
            type="button"
          >
            {t("POS.ORDER.GO_TO_PAYMENT")}
          </button>
        )}
        <button
          className="flex-1 rounded-2xl bg-background-secondary py-3.5 font-medium text-text"
          onClick={() => {
            void navigate({ params: { linkId }, to: "/table/$linkId/history" } as never)
          }}
          type="button"
        >
          {t("POS.ORDER.BACK_TO_HISTORY")}
        </button>
      </div>

      <button
        className="mt-3 w-full rounded-2xl bg-background-secondary py-3.5 font-medium text-text"
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
