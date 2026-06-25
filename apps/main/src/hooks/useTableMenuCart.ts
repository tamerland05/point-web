import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAtomValue } from "jotai/react"
import { useCallback, useMemo } from "react"
import toast from "react-hot-toast"

import {
  addPosOrderItem,
  createPosOrder,
  deletePosOrderItem,
  draftCartQtyByMenuItemId,
  draftLineByMenuItemId,
  findDraftOrder,
  type PosMenuProduct,
  patchPosOrderItem,
  pickDefaultSize,
  posQueryKeys,
} from "@point/shared/api/point/posTable"
import { posSessionIdAtom } from "@point/shared/atoms/posTable"
import { generateUUID } from "@point/shared/utils/generateUUID"

import { usePosTableContext } from "@/components/pos-table/posTableContext"

export function useTableMenuCart() {
  const sessionId = useAtomValue(posSessionIdAtom)
  const queryClient = useQueryClient()
  const { sessionQuery } = usePosTableContext()

  const orders = sessionQuery.data?.orders ?? []

  const cartQtyByMenuItemId = useMemo(() => draftCartQtyByMenuItemId(orders), [orders])
  const draftLineByMenuItemIdMap = useMemo(() => draftLineByMenuItemId(orders), [orders])

  const invalidateSession = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: posQueryKeys.sessionCurrent })
  }, [queryClient])

  const incMut = useMutation({
    mutationFn: async (item: PosMenuProduct) => {
      if (!sessionId) {
        throw new Error("Нет сессии")
      }
      if (item.is_stopped) {
        throw new Error("Блюдо недоступно")
      }
      const ordersSnapshot = sessionQuery.data?.orders ?? []
      let orderId = findDraftOrder(ordersSnapshot)?.id
      if (!orderId) {
        const created = await createPosOrder(sessionId)
        orderId = created.orderId
      }
      const def = pickDefaultSize(item)
      await addPosOrderItem({
        idempotencyKey: generateUUID(),
        menuItemId: item.id,
        orderId,
        productSizeId: def.sizeId,
        quantity: 1,
        sessionId,
      })
    },
    onError: (e: Error) => {
      toast.error(e.message || "Не удалось добавить")
    },
    onSettled: invalidateSession,
  })

  const patchMut = useMutation({
    mutationFn: async (p: { itemId: string; orderId: string; quantity: number }) => {
      if (!sessionId) {
        throw new Error("Нет сессии")
      }
      await patchPosOrderItem({ ...p, sessionId })
    },
    onError: (e: Error) => {
      toast.error(e.message || "Не удалось изменить")
    },
    onSettled: invalidateSession,
  })

  const deleteMut = useMutation({
    mutationFn: async (p: { itemId: string; orderId: string }) => {
      if (!sessionId) {
        throw new Error("Нет сессии")
      }
      await deletePosOrderItem({ ...p, sessionId })
    },
    onError: (e: Error) => {
      toast.error(e.message || "Не удалось удалить")
    },
    onSettled: invalidateSession,
  })

  const isMutating = incMut.isPending || patchMut.isPending || deleteMut.isPending

  const incrementItem = useCallback(
    (item: PosMenuProduct) => {
      if (item.is_stopped) {
        return
      }
      incMut.mutate(item)
    },
    [incMut]
  )

  const decrementItem = useCallback(
    (item: PosMenuProduct) => {
      const draftLine = draftLineByMenuItemIdMap.get(item.id)
      const inCartQty = cartQtyByMenuItemId.get(item.id) ?? 0
      if (!draftLine || item.is_stopped || inCartQty <= 0) {
        return
      }
      if (inCartQty <= 1) {
        deleteMut.mutate({ itemId: draftLine.lineId, orderId: draftLine.orderId })
      } else {
        patchMut.mutate({ itemId: draftLine.lineId, orderId: draftLine.orderId, quantity: inCartQty - 1 })
      }
    },
    [cartQtyByMenuItemId, deleteMut, draftLineByMenuItemIdMap, patchMut]
  )

  return {
    cartQtyByMenuItemId,
    decrementItem,
    draftLineByMenuItemIdMap,
    incrementItem,
    isMutating,
  }
}
