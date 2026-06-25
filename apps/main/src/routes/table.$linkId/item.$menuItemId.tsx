import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useAtomValue } from "jotai/react"
import { useLayoutEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"

import {
  addPosOrderItem,
  createPosOrder,
  draftLineForMenuItemAndSize,
  fetchPosSessionCurrent,
  findDraftOrder,
  findMenuProductWithCategory,
  patchPosOrderItem,
  posMenuQueryOptions,
  posQueryKeys,
} from "@point/shared/api/point/posTable"
import { posSessionIdAtom } from "@point/shared/atoms/posTable"
import { useFormatter } from "@point/shared/hooks/useFormatter"
import { generateUUID } from "@point/shared/utils/generateUUID"
import { posOrderCurrencyDisplay } from "@point/shared/utils/posCurrency"
import { cn } from "@point/ui/cn"

import { MenuItemDetailScreen } from "@/components/menu/MenuItemDetailScreen"
import { usePosTableContext } from "@/components/pos-table/posTableContext"

export const Route = createFileRoute("/table/$linkId/item/$menuItemId")({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { linkId, menuItemId } = Route.useParams()
  const sessionId = useAtomValue(posSessionIdAtom)
  const queryClient = useQueryClient()
  const { sessionQuery } = usePosTableContext()
  const { formatCurrency } = useFormatter()

  const [quantity, setQuantity] = useState(1)
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0)
  const [barExpanded, setBarExpanded] = useState(false)

  const menuQuery = useQuery(posMenuQueryOptions(sessionId, { enabled: !!sessionId }))

  const menuCtx = useMemo(() => findMenuProductWithCategory(menuQuery.data, menuItemId), [menuQuery.data, menuItemId])
  const product = menuCtx?.product
  const categoryName = menuCtx?.categoryName ?? ""

  const establishmentName = sessionQuery.data?.session.establishment_name
  const currencyDisplay = posOrderCurrencyDisplay(
    sessionQuery.data?.orders.find((o) => o.currency)?.currency ?? sessionQuery.data?.orders[0]?.currency ?? "RUB"
  )

  const sizes = product?.size_prices ?? []
  const selectedSize = sizes[selectedSizeIdx]

  const productSizeIdForDraft =
    selectedSize?.size_id === undefined || selectedSize?.size_id === ""
      ? null
      : selectedSize?.size_id == null
        ? null
        : String(selectedSize.size_id)

  const lineInDraft = useMemo(
    () =>
      product ? draftLineForMenuItemAndSize(sessionQuery.data?.orders ?? [], product.id, productSizeIdForDraft) : null,
    [product, productSizeIdForDraft, sessionQuery.data?.orders]
  )

  useLayoutEffect(() => {
    if (!product) {
      return
    }
    const line = draftLineForMenuItemAndSize(sessionQuery.data?.orders ?? [], product.id, productSizeIdForDraft)
    if (line && line.quantity >= 1) {
      setQuantity(Math.round(line.quantity))
    } else {
      setQuantity(1)
    }
  }, [product, productSizeIdForDraft, lineInDraft?.lineId, lineInDraft?.quantity, sessionQuery.data?.orders])

  const inDraft = Boolean(lineInDraft && lineInDraft.quantity >= 1)
  const showStepper = inDraft || barExpanded

  const addMut = useMutation({
    mutationFn: async () => {
      if (!sessionId || !product || product.is_stopped) {
        throw new Error("Блюдо недоступно")
      }
      const fresh = await queryClient.fetchQuery({
        queryFn: fetchPosSessionCurrent,
        queryKey: posQueryKeys.sessionCurrent,
      })
      const sizeId = productSizeIdForDraft
      const line = draftLineForMenuItemAndSize(fresh.orders, product.id, sizeId)
      const q = Math.round(quantity)
      if (q < 1) {
        throw new Error("Некорректное количество")
      }

      if (line) {
        if (q !== Math.round(line.quantity)) {
          await patchPosOrderItem({
            itemId: line.lineId,
            orderId: line.orderId,
            quantity: q,
            sessionId,
          })
        }
        return
      }

      let orderId = findDraftOrder(fresh.orders)?.id
      if (!orderId) {
        const created = await createPosOrder(sessionId)
        orderId = created.orderId
      }
      await addPosOrderItem({
        idempotencyKey: generateUUID(),
        menuItemId: product.id,
        orderId,
        productSizeId: sizeId,
        quantity: q,
        sessionId,
      })
    },
    onError: (e: Error) => {
      toast.error(e.message || "Не удалось добавить")
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: posQueryKeys.sessionCurrent })
    },
    onSuccess: async () => {
      toast.success("Добавлено в корзину")
      void navigate({
        params: { linkId },
        to: "/table/$linkId",
      } as never)
    },
  })

  if (menuQuery.isPending) {
    return (
      <div className="flex flex-1 flex-col gap-4 bg-[#efeff4] p-6">
        <div className="h-8 w-8 animate-pulse rounded bg-white" />
        <div className="h-40 animate-pulse rounded-2xl bg-white" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="bg-[#efeff4] p-6">
        <p className="text-[#8d969d]">Блюдо не найдено.</p>
      </div>
    )
  }

  if (product.is_stopped) {
    return (
      <div className="bg-[#efeff4] p-6">
        <p className="text-[#8d969d]">{product.name} сейчас недоступно.</p>
      </div>
    )
  }

  const unitPrice = selectedSize?.price?.current_price
  const lineTotal = unitPrice !== undefined ? unitPrice * quantity : undefined
  const photo = product.image_links?.[0]

  const priceLine = (amount: number | undefined) =>
    amount === undefined ? (
      "—"
    ) : (
      <>
        {formatCurrency(amount)} {currencyDisplay}
      </>
    )

  const infoRows = [
    ...(establishmentName
      ? [
          {
            bottom: <span className="text-accent">{establishmentName}</span>,
            label: "Заведение",
            withSeparator: Boolean(product.description),
          },
        ]
      : []),
    ...(product.description
      ? [
          {
            bottom: product.description,
            label: "Описание",
          },
        ]
      : []),
  ]

  const footer = !showStepper ? (
    <button
      className="w-full rounded-2xl bg-accent py-4 font-semibold text-[17px] text-white disabled:opacity-40"
      disabled={addMut.isPending || unitPrice === undefined}
      onClick={() => setBarExpanded(true)}
      type="button"
    >
      {priceLine(unitPrice)}
    </button>
  ) : (
    <div className="flex items-stretch gap-3">
      <div className="flex min-h-[52px] flex-1 items-center justify-between gap-3 rounded-2xl bg-background-secondary px-3">
        <button
          className="rounded-lg px-3 py-2 font-semibold text-lg text-text disabled:opacity-30"
          disabled={quantity <= 1 || addMut.isPending}
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          type="button"
        >
          −
        </button>
        <span className="min-w-[2ch] text-center font-semibold text-text">{quantity}</span>
        <button
          className="rounded-lg px-3 py-2 font-semibold text-lg text-text disabled:opacity-30"
          disabled={addMut.isPending}
          onClick={() => setQuantity((q) => q + 1)}
          type="button"
        >
          +
        </button>
      </div>
      <button
        className="min-h-[52px] min-w-[120px] shrink-0 rounded-2xl bg-accent px-5 font-semibold text-[17px] text-white disabled:opacity-40"
        disabled={addMut.isPending || lineTotal === undefined}
        onClick={() => addMut.mutate()}
        type="button"
      >
        {addMut.isPending ? "…" : priceLine(lineTotal)}
      </button>
    </div>
  )

  return (
    <>
      {sizes.length > 1 ? (
        <div className="bg-[#efeff4] px-4 pb-2">
          <div className="flex flex-col gap-2">
            <span className="text-caption-1 text-text-secondary">Размер</span>
            <div className="flex flex-wrap gap-2">
              {sizes.map((sp, idx) => (
                <button
                  className={cn(
                    "rounded-xl border border-transparent bg-white px-4 py-2 font-medium text-sm",
                    selectedSizeIdx === idx && "border-accent bg-accent/10 text-accent"
                  )}
                  key={`${sp.size_id ?? idx}`}
                  onClick={() => setSelectedSizeIdx(idx)}
                  type="button"
                >
                  {formatCurrency(sp.price.current_price)}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
      <MenuItemDetailScreen
        categoryLabel={categoryName}
        footer={footer}
        imageAlt={product.name}
        imageUrl={photo}
        infoRows={infoRows}
        title={product.name}
      />
    </>
  )
}
