import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useAtomValue } from "jotai/react"
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

import {
  fetchPosSessionCurrent,
  findDraftOrder,
  patchPosDraftOrder,
  posQueryKeys,
} from "@point/shared/api/point/posTable"
import { posSessionIdAtom } from "@point/shared/atoms/posTable"
import { cn } from "@point/ui/cn"

import { usePosTableContext } from "@/components/pos-table/posTableContext"

const COMMENT_HINT_CLASS =
  "font-normal text-[14px] leading-5 tracking-[-0.23px] text-text-secondary [font-family:-apple-system,BlinkMacSystemFont,'SF_Pro_Text','Segoe_UI',Roboto,sans-serif]"

const TEXTAREA_MAX_PX = 280

export const Route = createFileRoute("/table/$linkId/cart/comment")({
  component: OrderCommentScreen,
})

function useAutosizeTextarea(value: string) {
  const ref = useRef<HTMLTextAreaElement>(null)

  const sync = useCallback(() => {
    const el = ref.current
    if (!el) {
      return
    }
    el.style.overflow = "hidden"
    el.style.height = "auto"
    const sh = el.scrollHeight
    const capped = Math.min(Math.max(sh, 52), TEXTAREA_MAX_PX)
    el.style.height = `${capped}px`
    el.style.overflowY = sh > TEXTAREA_MAX_PX ? "auto" : "hidden"
  }, [])

  useLayoutEffect(() => {
    sync()
  }, [value, sync])

  return ref
}

function OrderCommentScreen() {
  const navigate = Route.useNavigate()
  const { linkId } = Route.useParams()
  const sessionId = useAtomValue(posSessionIdAtom)
  const queryClient = useQueryClient()
  const { sessionQuery } = usePosTableContext()

  const draft = findDraftOrder(sessionQuery.data?.orders ?? [])
  const [text, setText] = useState("")
  const textareaRef = useAutosizeTextarea(text)

  useEffect(() => {
    setText(String(draft?.guest_comment ?? ""))
  }, [draft?.guest_comment, draft?.id])

  const saveMut = useMutation({
    mutationFn: async () => {
      if (!sessionId) {
        throw new Error("Нет сессии")
      }
      const fresh = await fetchPosSessionCurrent()
      const current = findDraftOrder(fresh.orders)
      if (!current?.id) {
        throw new Error("Нет заказа")
      }
      const trimmed = text.trim()
      await patchPosDraftOrder({
        guestComment: trimmed === "" ? null : text,
        orderId: current.id,
        sessionId,
      })
    },
    onError: (e: Error) => {
      toast.error(e.message || "Не удалось сохранить")
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: posQueryKeys.sessionCurrent })
      void navigate({ params: { linkId }, to: "/table/$linkId/cart" } as never)
    },
  })

  if (!draft) {
    return (
      <div className="flex flex-1 flex-col bg-background px-4 pt-4 pb-8">
        <p className="py-8 text-center text-caption-1 text-text-secondary">Заказ недоступен</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <div className="flex flex-1 flex-col gap-3 px-4 pt-4 pb-36">
        <textarea
          autoFocus
          className={cn(
            "w-full resize-none rounded-xl border border-black/10 bg-background px-3 py-3 text-base text-text outline-none",
            "max-h-[280px] min-h-[52px] placeholder:text-text-secondary/70 focus:border-accent/50",
            "[font-family:-apple-system,BlinkMacSystemFont,'SF_Pro_Text','Segoe_UI',Roboto,sans-serif]"
          )}
          onChange={(e) => setText(e.target.value)}
          placeholder="Текст комментария"
          ref={textareaRef}
          rows={1}
          value={text}
        />
        <p className={COMMENT_HINT_CLASS}>Указанный комментарий будет передан персоналу выбранного заведения</p>
      </div>

      <footer className="fixed right-0 bottom-0 left-0 border-black/5 border-t bg-background px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          className="w-full rounded-2xl bg-accent py-4 font-semibold text-[17px] text-white disabled:opacity-40"
          disabled={saveMut.isPending}
          onClick={() => saveMut.mutate()}
          type="button"
        >
          {saveMut.isPending ? "Сохранение…" : "Сохранить"}
        </button>
      </footer>
    </div>
  )
}
