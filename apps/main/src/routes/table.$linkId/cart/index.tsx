import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useAtomValue, useSetAtom } from "jotai/react"
import { useMemo } from "react"
import toast from "react-hot-toast"

import {
  checkoutPosOrder,
  deletePosOrderItem,
  fetchPosSessionCurrent,
  findDraftOrder,
  initPosPayment,
  type PosOrderItem,
  patchPosOrderItem,
  posQueryKeys,
} from "@point/shared/api/point/posTable"
import { posCheckoutUrlAtom, posSessionIdAtom } from "@point/shared/atoms/posTable"
import { useFormatter } from "@point/shared/hooks/useFormatter"
import { posOrderCurrencyDisplay } from "@point/shared/utils/posCurrency"
import { cn } from "@point/ui/cn"
import { Icon } from "@point/ui/icon"

import { usePosTableContext } from "@/components/pos-table/posTableContext"

/** Subtitle under «Комментарий»: draft label or saved text (Figma / SF Pro Text). */
const COMMENT_SUBTITLE_CLASS =
  "mt-0.5 line-clamp-3 font-normal text-[14px] leading-5 tracking-[-0.23px] [font-family:-apple-system,BlinkMacSystemFont,'SF_Pro_Text','Segoe_UI',Roboto,sans-serif]"

export const Route = createFileRoute("/table/$linkId/cart/")({
  component: CartScreen,
})

function posItemsLabel(n: number): string {
  const m = n % 100
  if (m >= 11 && m <= 14) {
    return `${n} позиций`
  }
  const d = n % 10
  if (d === 1) {
    return `${n} позиция`
  }
  if (d >= 2 && d <= 4) {
    return `${n} позиции`
  }
  return `${n} позиций`
}

function draftLineKey(itemId: string, orderId: string): string {
  return `${orderId}:${itemId}`
}

function firstOrderItemImageUrl(li: PosOrderItem): string | undefined {
  const raw = li.image_links ?? (li as { imageLinks?: string[] }).imageLinks
  if (!Array.isArray(raw)) {
    return undefined
  }
  const hit = raw.find((u) => u.trim() !== "")
  return hit?.trim()
}

function CartScreen() {
  const navigate = Route.useNavigate()
  const { linkId } = Route.useParams()
  const sessionId = useAtomValue(posSessionIdAtom)
  const queryClient = useQueryClient()
  const { sessionQuery } = usePosTableContext()
  const setCheckoutUrl = useSetAtom(posCheckoutUrlAtom)

  const { formatCurrency } = useFormatter()

  const orders = sessionQuery.data?.orders ?? []
  const draft = findDraftOrder(orders)
  const session = sessionQuery.data?.session

  const items = draft?.items ?? []
  const currency = posOrderCurrencyDisplay(draft?.currency ?? orders.find((o) => o.currency)?.currency ?? "RUB")

  const subtotal = useMemo(() => {
    let s = 0
    for (const li of items) {
      s += Number.parseFloat(li.price) * li.quantity
    }
    return s
  }, [items])

  const commentPreview = (draft?.guest_comment ?? "").trim()

  const payMut = useMutation({
    mutationFn: async () => {
      if (!sessionId) {
        throw new Error("Нет сессии")
      }
      const fresh = await queryClient.fetchQuery({
        queryFn: fetchPosSessionCurrent,
        queryKey: posQueryKeys.sessionCurrent,
      })
      const currentDraft = findDraftOrder(fresh.orders)
      if (!currentDraft?.items.length) {
        throw new Error("Корзина пуста")
      }
      await checkoutPosOrder(sessionId, currentDraft.id)
      const { checkoutUrl } = await initPosPayment(sessionId, currentDraft.id)
      setCheckoutUrl(checkoutUrl)
      if (fresh.session.link_id) {
        void navigate({ params: { linkId }, to: "/table/$linkId/payment" } as never)
      } else {
        const { openLink } = await import("@telegram-apps/sdk-react")
        openLink(checkoutUrl)
      }
    },
    onError: (e: Error) => {
      toast.error(e.message || "Оплата недоступна")
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: posQueryKeys.sessionCurrent })
    },
  })

  const patchMut = useMutation({
    mutationFn: async (p: { itemId: string; orderId: string; quantity: number }) => {
      if (!sessionId) {
        throw new Error("Нет сессии")
      }
      await patchPosOrderItem({ ...p, sessionId })
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: posQueryKeys.sessionCurrent })
    },
  })

  const deleteMut = useMutation({
    mutationFn: async (p: { itemId: string; orderId: string }) => {
      if (!sessionId) {
        throw new Error("Нет сессии")
      }
      await deletePosOrderItem({ ...p, sessionId })
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: posQueryKeys.sessionCurrent })
    },
  })

  const onDec = (li: (typeof items)[0]) => {
    if (!draft) {
      return
    }
    if (li.quantity <= 1) {
      deleteMut.mutate({ itemId: li.id, orderId: draft.id })
    } else {
      patchMut.mutate({ itemId: li.id, orderId: draft.id, quantity: li.quantity - 1 })
    }
  }

  const onInc = (li: (typeof items)[0]) => {
    if (!draft) {
      return
    }
    patchMut.mutate({ itemId: li.id, orderId: draft.id, quantity: li.quantity + 1 })
  }

  const canPay = !!(draft && items.length > 0 && draft.status === "draft")

  if (!draft || !items.length) {
    return (
      <div className="flex flex-1 flex-col px-4 pt-4 pb-8">
        <div className="mb-6 flex justify-center">
          <h1 className="font-semibold text-text text-title-3">Заказ</h1>
        </div>
        <p className="py-12 text-center text-caption-1 text-text-secondary">Корзина пуста</p>
        <button
          className="mt-auto w-full rounded-2xl bg-accent py-4 font-semibold text-white"
          onClick={() => void navigate({ params: { linkId }, to: "/table/$linkId" } as never)}
          type="button"
        >
          В меню
        </button>
      </div>
    )
  }

  const establishmentName = session?.establishment_name

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-center border-black/5 border-b bg-background px-4 py-3">
        <h1 className="font-semibold text-text text-title-3">Заказ</h1>
      </header>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pt-4 pb-44">
        <div className="flex items-center gap-3 rounded-2xl bg-background-secondary p-4">
          <Icon aria-hidden className="size-11 shrink-0 text-transparent" name="EstablishmentHouseCard" />
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-base text-text">{establishmentName ?? "Заведение"}</div>
            <div className="mt-1 text-caption-1 text-text-secondary">
              {formatCurrency(subtotal)} {currency}
              {" · "}
              {posItemsLabel(items.length)}
            </div>
          </div>
        </div>

        <div>
          <div className="mx-1 mb-2 text-caption-3 text-text-secondary uppercase tracking-wide">Заказ</div>
          <div className="flex flex-col gap-2">
            {items.map((li) => {
              const unit = Number.parseFloat(li.price)
              const lineSum = unit * li.quantity
              const thumb = firstOrderItemImageUrl(li)
              const stepper = (
                <div className="flex w-fit items-center gap-2 rounded-xl bg-background px-1 py-1">
                  <button
                    className="rounded-lg px-3 py-1.5 font-semibold text-text disabled:opacity-30"
                    disabled={patchMut.isPending || deleteMut.isPending}
                    onClick={() => onDec(li)}
                    type="button"
                  >
                    −
                  </button>
                  <span className="min-w-[2ch] text-center font-semibold text-sm">{li.quantity}</span>
                  <button
                    className="rounded-lg px-3 py-1.5 font-semibold text-text disabled:opacity-30"
                    disabled={patchMut.isPending}
                    onClick={() => onInc(li)}
                    type="button"
                  >
                    +
                  </button>
                </div>
              )
              return (
                <div
                  className={cn(
                    "flex gap-3 rounded-2xl bg-background-secondary p-4",
                    thumb ? "items-start justify-between" : "items-center justify-between"
                  )}
                  key={draftLineKey(li.id, draft.id)}
                >
                  <div className="flex min-w-0 flex-1 flex-col justify-center gap-3">
                    <div>
                      <div className="font-semibold text-base text-text">{li.name}</div>
                      <div className="mt-1 text-caption-1 text-text-secondary">
                        {formatCurrency(lineSum)} {currency}
                      </div>
                    </div>
                    {thumb ? stepper : null}
                  </div>
                  {thumb ? (
                    <img alt="" className="size-20 shrink-0 rounded-xl object-cover" decoding="async" src={thumb} />
                  ) : (
                    <div className="flex shrink-0 items-center">{stepper}</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div>
          <div className="mx-1 mb-2 text-caption-3 text-text-secondary uppercase tracking-wide">Дополнительно</div>
          <button
            className="w-full rounded-2xl bg-background-secondary p-4 text-left active:opacity-90"
            onClick={() => void navigate({ params: { linkId }, to: "/table/$linkId/cart/comment" } as never)}
            type="button"
          >
            <div className="flex items-start gap-3">
              <Icon className="mt-0.5 size-6 shrink-0 text-accent" name="Pencil" />
              <div className="min-w-0 flex-1">
                <div className="font-medium text-base text-text">Комментарий</div>
                {commentPreview ? (
                  <div className={cn(COMMENT_SUBTITLE_CLASS, "text-text")}>{commentPreview}</div>
                ) : (
                  <div className={cn(COMMENT_SUBTITLE_CLASS, "text-text-secondary")}>Черновик</div>
                )}
              </div>
            </div>
          </button>
        </div>
      </div>

      <footer className="fixed right-0 bottom-0 left-0 border-black/5 border-t bg-background px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          className="w-full rounded-2xl bg-accent py-4 font-semibold text-[17px] text-white disabled:opacity-40"
          disabled={!canPay || payMut.isPending}
          onClick={() => payMut.mutate()}
          type="button"
        >
          {payMut.isPending ? "Оформление…" : "Оплатить"}
        </button>
      </footer>
    </div>
  )
}
