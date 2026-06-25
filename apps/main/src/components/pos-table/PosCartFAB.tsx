import { useNavigate, useRouterState } from "@tanstack/react-router"

import { findDraftOrder } from "@point/shared/api/point/posTable"
import { useFormatter } from "@point/shared/hooks/useFormatter"
import { posOrderCurrencyDisplay } from "@point/shared/utils/posCurrency"
import { cn } from "@point/ui/cn"

import { usePosTableContext } from "@/components/pos-table/posTableContext"

/** Shopping bag (layout spec); not in shared Icon sprite. */
function PosCartBagIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden={true} className={className} fill="none" viewBox="0 0 20 22" xmlns="http://www.w3.org/2000/svg">
      <title>Shopping bag</title>
      <rect height="14.4444" rx="4" stroke="currentColor" strokeWidth={2} width="17.7778" x="1" y="6.55566" />
      <path
        d="M14.3332 8.77778V5C14.3332 2.79086 12.5424 1 10.3332 1H9.44434C7.2352 1 5.44434 2.79086 5.44434 5L5.44434 8.77778"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={2}
      />
    </svg>
  )
}

export function PosCartFAB() {
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const { sessionQuery } = usePosTableContext()
  const { formatCurrency } = useFormatter()

  const draft = sessionQuery.data ? findDraftOrder(sessionQuery.data.orders) : undefined
  const linkId = sessionQuery.data?.session.link_id

  let sum = 0
  if (draft?.items?.length) {
    for (const li of draft.items) {
      sum += Number.parseFloat(li.price) * li.quantity
    }
  }

  const currency = posOrderCurrencyDisplay(
    draft?.currency ?? sessionQuery.data?.orders.find((o) => o.currency)?.currency
  )

  const hasNonZeroTotal = Number.isFinite(sum) && sum > 0

  if (!draft?.items?.length || !hasNonZeroTotal || !linkId) {
    return null
  }

  if (pathname.includes(`/table/${linkId}/cart`)) {
    return null
  }

  if (pathname === `/table/${linkId}` || pathname === `/table/${linkId}/`) {
    return null
  }

  return (
    <button
      className={cn(
        "fixed right-4 bottom-24 z-30 flex h-[49px] max-w-[calc(100vw-2rem)] items-center gap-2.5 rounded-full bg-[#007AFF] px-4 text-white shadow-lg",
        "[view-transition-name:pos-cart-fab]"
      )}
      onClick={() => void navigate({ params: { linkId }, to: "/table/$linkId/cart" } as never)}
      type="button"
    >
      <span className="min-w-0 truncate font-semibold text-[17px] leading-none tracking-tight">
        {formatCurrency(sum)} {currency}
      </span>
      <PosCartBagIcon className="size-[22px] shrink-0" />
    </button>
  )
}
