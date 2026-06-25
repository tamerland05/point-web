import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { useAtomValue } from "jotai/react"
import { useMemo, useState } from "react"
import { z } from "zod"

import { useTranslation } from "@point/i18n"
import { findDraftOrder, posMenuQueryOptions, posOrderHasStatus } from "@point/shared/api/point/posTable"
import { posSessionIdAtom } from "@point/shared/atoms/posTable"
import { useFormatter } from "@point/shared/hooks/useFormatter"
import { posOrderCurrencyDisplay } from "@point/shared/utils/posCurrency"

import { posOrderStatusLabel } from "@/components/pos-table/posStatusI18n"
import { usePosTableContext } from "@/components/pos-table/posTableContext"
import { type QrMenuLayout, QrMenuScreen, type QrMenuStepperMode } from "@/components/qr/QrMenuScreen"

const tableMenuSearchSchema = z.object({
  layout: z.enum(["grid", "list"]).optional(),
  stepper: z.enum(["default", "always"]).optional(),
})

export const Route = createFileRoute("/table/$linkId/")({
  component: RouteComponent,
  validateSearch: zodValidator(tableMenuSearchSchema),
})

function OrderStatusLabel({ status }: { status: string }) {
  const { t } = useTranslation()
  return <span>{posOrderStatusLabel(t, status)}</span>
}

function OrdersOverview() {
  const navigate = Route.useNavigate()
  const { linkId } = Route.useParams()
  const { sessionQuery } = usePosTableContext()
  const { formatCurrency } = useFormatter()

  const rows = useMemo(() => {
    const orders = sessionQuery.data?.orders ?? []
    return orders.filter((o) => !posOrderHasStatus(o, "draft"))
  }, [sessionQuery.data?.orders])

  if (!rows.length) {
    return null
  }

  return (
    <details className="rounded-2xl bg-white px-4 py-3">
      <summary className="cursor-pointer font-medium text-[#222222] text-[15px]">Заказы по столу</summary>
      <button
        className="mt-3 rounded-xl bg-[#efeff4] px-3 py-2 text-[#707579] text-[14px]"
        onClick={() => {
          void navigate({ params: { linkId }, to: "/table/$linkId/history" } as never)
        }}
        type="button"
      >
        Открыть полную историю
      </button>
      <ul className="mt-3 flex flex-col gap-3">
        {rows.map((o) => (
          <li
            className="border-black/[0.06] border-b pb-3 last:border-b-0 last:pb-0"
            key={o.id}
            onClick={() => {
              void navigate({ params: { linkId, orderId: o.id }, to: "/table/$linkId/order/$orderId" } as never)
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <OrderStatusLabel status={o.status} />
              <span className="text-[#8d969d] text-[13px]">
                {formatCurrency(Number.parseFloat(o.total_amount))} {posOrderCurrencyDisplay(o.currency)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </details>
  )
}

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { linkId } = Route.useParams()
  const { layout, stepper } = Route.useSearch()
  const sessionId = useAtomValue(posSessionIdAtom)
  const { sessionQuery } = usePosTableContext()
  const [menuSearch, setMenuSearch] = useState("")

  const menuLayout: QrMenuLayout = layout === "list" ? "list" : "grid"
  const stepperMode: QrMenuStepperMode = stepper === "always" ? "always" : "default"

  const currencyFallback = posOrderCurrencyDisplay(
    sessionQuery.data?.orders.find((o) => o.currency)?.currency ?? sessionQuery.data?.orders[0]?.currency
  )

  const menuQuery = useQuery(posMenuQueryOptions(sessionId, { enabled: !!sessionId }))

  const checkoutTotal = useMemo(() => {
    const draft = findDraftOrder(sessionQuery.data?.orders ?? [])
    if (!draft?.items?.length) {
      return 0
    }
    let sum = 0
    for (const li of draft.items) {
      sum += Number.parseFloat(li.price) * li.quantity
    }
    return Number.isFinite(sum) && sum > 0 ? sum : 0
  }, [sessionQuery.data?.orders])

  const establishmentName = sessionQuery.data?.session.establishment_name
  const establishmentAddress = sessionQuery.data?.session.establishment_address
  const categories = menuQuery.data?.categories ?? []

  return (
    <QrMenuScreen
      categories={categories}
      checkoutTotal={checkoutTotal}
      currencyFallback={currencyFallback}
      establishmentAddress={establishmentAddress}
      establishmentName={establishmentName}
      isEmpty={!categories.length && !menuQuery.isPending}
      isError={menuQuery.isError}
      isLoading={menuQuery.isPending}
      layout={menuLayout}
      linkId={linkId}
      onCheckout={() => {
        void navigate({ params: { linkId }, to: "/table/$linkId/cart" } as never)
      }}
      onOpenItem={(item) => {
        void navigate({
          params: { linkId, menuItemId: item.id },
          to: "/table/$linkId/item/$menuItemId",
        })
      }}
      onRetry={() => {
        void menuQuery.refetch()
      }}
      onSearchChange={setMenuSearch}
      ordersOverview={<OrdersOverview />}
      searchQuery={menuSearch}
      stepperMode={stepperMode}
    />
  )
}
