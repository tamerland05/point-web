import type { PosSessionState } from "@point/shared/api/point/posTable"
import type { UseQueryResult } from "@tanstack/react-query"

import { useQuery } from "@tanstack/react-query"
import { createContext, type ReactNode, useContext, useMemo } from "react"

import { findDraftOrder, posSessionCurrentQueryOptions } from "@point/shared/api/point/posTable"
import { PageLoader } from "@point/ui/loader"

import { useDocumentVisibility } from "@/components/pos-table/useDocumentVisibility"

export interface PosTableContextValue {
  draftOrderTotalQty: number
  sessionQuery: UseQueryResult<PosSessionState, Error>
}

const PosTableContext = createContext<PosTableContextValue | null>(null)

export function usePosTableContext(): PosTableContextValue {
  const ctx = useContext(PosTableContext)
  if (!ctx) {
    throw new Error("usePosTableContext must be used under PosTableSessionProvider")
  }
  return ctx
}

export function PosTableSessionProvider({ children }: { children: ReactNode }) {
  const visible = useDocumentVisibility()

  const sessionQuery = useQuery({
    ...posSessionCurrentQueryOptions({ enabled: true }),
    refetchInterval: (q) => {
      const status = q.state.data?.session.status
      if (!visible || status === "closed") {
        return false
      }
      return 4000
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })

  const draftTotalQty = useMemo(() => {
    const draft = sessionQuery.data ? findDraftOrder(sessionQuery.data.orders) : undefined
    if (!draft?.items?.length) {
      return 0
    }
    return draft.items.reduce((acc, li) => acc + li.quantity, 0)
  }, [sessionQuery.data])

  const ctx = useMemo(
    (): PosTableContextValue => ({
      draftOrderTotalQty: draftTotalQty,
      sessionQuery,
    }),
    [draftTotalQty, sessionQuery]
  )

  if (sessionQuery.isPending) {
    return <PageLoader />
  }

  if (sessionQuery.isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-base text-text">Не удалось загрузить сессию стола.</p>
        <button
          className="rounded-xl bg-accent px-6 py-3 font-medium text-white"
          onClick={() => sessionQuery.refetch()}
          type="button"
        >
          Повторить
        </button>
      </div>
    )
  }

  return <PosTableContext.Provider value={ctx}>{children}</PosTableContext.Provider>
}
