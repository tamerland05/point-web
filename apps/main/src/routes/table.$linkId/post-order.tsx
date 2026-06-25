import { createFileRoute } from "@tanstack/react-router"

import { useTranslation } from "@point/i18n"
import { findAwaitingPaymentOrder, findLatestPaidOrder } from "@point/shared/api/point/posTable"
import { useFormatter } from "@point/shared/hooks/useFormatter"
import { posOrderCurrencyDisplay } from "@point/shared/utils/posCurrency"
import { cn } from "@point/ui/cn"

import { usePosTableContext } from "@/components/pos-table/posTableContext"

export const Route = createFileRoute("/table/$linkId/post-order")({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { linkId } = Route.useParams()
  const { sessionQuery } = usePosTableContext()
  const { formatCurrency } = useFormatter()
  const { t } = useTranslation()

  const session = sessionQuery.data?.session
  const orders = sessionQuery.data?.orders ?? []
  const awaitingOrder = findAwaitingPaymentOrder(orders)
  const latestPaid = findLatestPaidOrder(orders)
  const paidCurrency = latestPaid ? posOrderCurrencyDisplay(latestPaid.currency) : ""

  return (
    <div className="flex min-h-full flex-col px-4 pt-4 pb-6">
      <h1 className={cn("font-semibold text-title-2", session?.establishment_name ? "mb-2" : "mb-5")}>
        {t("POS.POST_ORDER.TITLE")}
      </h1>
      {session?.establishment_name ? (
        <p className="mb-5 text-caption-1 text-text-secondary">{session.establishment_name}</p>
      ) : null}

      {awaitingOrder ? (
        <div className="mb-4 rounded-2xl border border-accent/25 bg-accent/5 p-4">
          <div className="mb-1 font-medium text-base text-text">{t("POS.POST_ORDER.AWAITING_TITLE")}</div>
          <p className="mb-3 text-caption-1 text-text-secondary">{t("POS.POST_ORDER.AWAITING_DESC")}</p>
          <button
            className="w-full rounded-2xl bg-accent py-3 font-semibold text-white"
            onClick={() => {
              void navigate({ params: { linkId }, to: "/table/$linkId/payment" } as never)
            }}
            type="button"
          >
            {t("POS.ORDER.GO_TO_PAYMENT")}
          </button>
        </div>
      ) : null}

      <div className="mb-8 rounded-2xl bg-background-secondary p-4">
        <div className="mb-2 text-caption-1 text-text-secondary">{t("POS.COMMON.ORDER")}</div>
        {latestPaid ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-caption-1 text-text-secondary">{t("POS.POST_ORDER.TOTAL")}</span>
              <span className="font-medium text-text">
                {formatCurrency(Number.parseFloat(latestPaid.total_amount))} {paidCurrency}
              </span>
            </div>
            <ul className="flex flex-col gap-2 border-black/5 border-t pt-3">
              {latestPaid.items.map((it) => (
                <li className="flex items-start justify-between gap-3 text-caption-1" key={it.id}>
                  <span className="min-w-0 text-text">
                    {it.name}
                    {it.quantity !== 1 ? ` × ${it.quantity}` : ""}
                  </span>
                  <span className="shrink-0 text-text-secondary">
                    {formatCurrency(Number.parseFloat(it.price) * it.quantity)} {paidCurrency}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-caption-1 text-text-secondary">{t("POS.POST_ORDER.NO_PAID_YET")}</div>
        )}
      </div>

      <div className="mt-auto flex gap-2.5">
        <button
          className="flex-1 rounded-2xl bg-background-secondary py-3.5 font-medium text-text"
          onClick={() => {
            void navigate({ params: { linkId }, to: "/table/$linkId/history" } as never)
          }}
          type="button"
        >
          {t("POS.COMMON.HISTORY")}
        </button>
        <button
          className="flex-1 rounded-2xl bg-accent py-3.5 font-medium text-white"
          onClick={() => {
            void navigate({ params: { linkId }, to: "/table/$linkId/" } as never)
          }}
          type="button"
        >
          {t("POS.COMMON.MENU")}
        </button>
      </div>

      <button
        className="mt-3 w-full rounded-2xl bg-background-secondary py-3.5 font-medium text-text"
        onClick={() => {
          void navigate({ params: { linkId }, to: "/table/$linkId/" } as never)
        }}
        type="button"
      >
        Понятно
      </button>
    </div>
  )
}
