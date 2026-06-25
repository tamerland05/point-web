import type { PosOrder } from "@point/shared/api/point/posTable"

import { useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { openLink } from "@telegram-apps/sdk-react"
import { useAtomValue } from "jotai/react"
import { useState } from "react"
import toast from "react-hot-toast"

import { useTranslation } from "@point/i18n"
import { findAwaitingPaymentOrder, posQueryKeys } from "@point/shared/api/point/posTable"
import { posCheckoutUrlAtom } from "@point/shared/atoms/posTable"

import { usePosTableContext } from "@/components/pos-table/posTableContext"

export const Route = createFileRoute("/table/$linkId/payment")({
  component: RouteComponent,
})

function pendingPaymentId(order: PosOrder): string | undefined {
  return order.payments?.find((p) => (p.status ?? "").toLowerCase() === "pending")?.id
}

function RouteComponent() {
  const navigate = Route.useNavigate()
  const queryClient = useQueryClient()
  const { linkId } = Route.useParams()
  const checkoutUrl = useAtomValue(posCheckoutUrlAtom)
  const { sessionQuery } = usePosTableContext()
  const { t } = useTranslation()
  const [simBusy, setSimBusy] = useState(false)

  const postWebhook = async (paymentId: string) => {
    const base = import.meta.env.VITE_POINT_API_FQDN
    if (typeof base !== "string" || !base.trim()) {
      throw new Error("VITE_POINT_API_FQDN")
    }
    const url = `${base.replace(/\/$/, "")}/v1/point/pos/payments/webhook`
    const res = await fetch(url, {
      body: JSON.stringify({ payment_id: paymentId, status: "succeeded" }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })
    const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string; message?: string } | null
    if (!res.ok || data?.ok !== true) {
      const msg = data?.message ?? data?.error ?? `HTTP ${res.status}`
      throw new Error(msg)
    }
  }

  const onSimulateDev = async () => {
    const ord = findAwaitingPaymentOrder(sessionQuery.data?.orders ?? [])
    const pid = ord ? pendingPaymentId(ord) : undefined
    if (!pid) {
      toast.error("Нет ожидающего платежа в сессии")
      return
    }
    setSimBusy(true)
    try {
      await postWebhook(pid)
      await queryClient.invalidateQueries({ queryKey: posQueryKeys.sessionCurrent })
      toast.success("Оплата подтверждена")
      void navigate({ params: { linkId }, to: "/table/$linkId/payment-status/success" } as never)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Не удалось вызвать webhook")
    } finally {
      setSimBusy(false)
    }
  }

  return (
    <div className="flex min-h-full flex-col px-4 pt-4 pb-6">
      <div className="mb-5 flex justify-end">
        <button
          className="rounded-2xl bg-background-secondary px-3.5 py-2.5 text-caption-1 text-text"
          onClick={() => {
            void navigate({ params: { linkId }, to: "/table/$linkId/" } as never)
          }}
          type="button"
        >
          {t("POS.PAYMENT.CLOSE")}
        </button>
      </div>

      <div className="mb-6 rounded-2xl bg-background-secondary p-5">
        <h1 className="mb-2 font-semibold text-title-2">{t("POS.PAYMENT.TITLE")}</h1>
        <p className="text-caption-1 text-text-secondary">{t("POS.PAYMENT.DESCRIPTION")}</p>
      </div>

      <button
        className="mb-3 w-full rounded-2xl bg-accent py-3.5 font-semibold text-white disabled:opacity-40"
        disabled={!checkoutUrl}
        onClick={() => {
          if (checkoutUrl) {
            openLink(checkoutUrl)
          } else {
            toast.error("Ссылка на оплату пока не готова")
          }
        }}
        type="button"
      >
        {t("POS.PAYMENT.OPEN_PAYMENT_PAGE")}
      </button>

      {true ? (
        <>
          <button
            className="mb-3 w-full rounded-2xl border border-accent/40 bg-background py-3.5 font-semibold text-accent"
            disabled={simBusy}
            onClick={() => void onSimulateDev()}
            type="button"
          >
            {simBusy ? "…" : t("POS.PAYMENT.DEV_SIMULATE_PAY")}
          </button>
          <button
            className="mb-2 w-full rounded-2xl border border-black/10 bg-background py-3 text-caption-1 text-text"
            onClick={() => {
              void navigate({ params: { linkId }, to: "/table/$linkId/payment-status/error" } as never)
            }}
            type="button"
          >
            Симулировать ошибку
          </button>
          <button
            className="mb-3 w-full rounded-2xl border border-black/10 bg-background py-3 text-caption-1 text-text"
            onClick={() => {
              void navigate({ params: { linkId }, to: "/table/$linkId/payment-status/no-funds" } as never)
            }}
            type="button"
          >
            Симулировать нет средств
          </button>
        </>
      ) : null}
    </div>
  )
}
