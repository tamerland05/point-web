import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useState } from "react"

/** Тестовая страница: имитирует вызов `POST /pos/payments/webhook` после «оплаты». */
const WEBHOOK_REL = "/point/pos/payments/webhook"

type StubState = "loading" | "success" | "already" | "error"

export const Route = createFileRoute("/pos/pay/stub")({
  component: PosPayStubPage,
  validateSearch: (search: Record<string, unknown>) => ({
    payment_id: typeof search["payment_id"] === "string" ? search["payment_id"] : "",
  }),
})

function PosPayStubPage() {
  const { payment_id } = Route.useSearch()
  const [state, setState] = useState<StubState>("loading")
  const [detail, setDetail] = useState<string | null>(null)

  useEffect(() => {
    const id = payment_id?.trim()
    if (!id) {
      setState("error")
      setDetail("В ссылке нет параметра payment_id.")
      return
    }

    const base = import.meta.env.VITE_POINT_API_FQDN
    if (typeof base !== "string" || !base.trim()) {
      setState("error")
      setDetail("Не задан VITE_POINT_API_FQDN (база API).")
      return
    }

    let cancelled = false
    const url = `${base.replace(/\/$/, "")}/v1${WEBHOOK_REL}`

    void fetch(url, {
      body: JSON.stringify({ payment_id: id, status: "succeeded" }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })
      .then(async (res) => {
        const raw = (await res.json().catch(() => null)) as Record<string, unknown> | null
        if (cancelled) {
          return
        }
        const err = typeof raw?.["error"] === "string" ? raw["error"] : ""
        const message = typeof raw?.["message"] === "string" ? raw["message"] : ""
        const ok = raw?.["ok"] === true

        if (res.ok && ok) {
          setState("success")
          setDetail("Оплата зафиксирована. Вернитесь в приложение — статус заказа обновится автоматически.")
          return
        }

        if (err === "pos-payment-invalid" || err === "pos-order-invalid-state") {
          setState("already")
          setDetail(message || "Платёж уже обработан или заказ в другом состоянии.")
          return
        }

        setState("error")
        setDetail(message || err || `Запрос завершился с кодом ${res.status}.`)
      })
      .catch((e: unknown) => {
        if (cancelled) {
          return
        }
        setState("error")
        setDetail(e instanceof Error ? e.message : "Сеть или CORS: не удалось вызвать webhook.")
      })

    return () => {
      cancelled = true
    }
  }, [payment_id])

  return (
    <div className="flex min-h-full flex-col bg-background px-4 py-8">
      <h1 className="mb-2 font-semibold text-text text-title-2">Тестовая оплата</h1>
      <p className="mb-6 text-caption-1 text-text-secondary">Имитация вебхука платёжного шлюза для разработки.</p>

      {state === "loading" ? <p className="text-base text-text">Подтверждаем оплату…</p> : null}

      {state === "success" ? (
        <p className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-base text-emerald-800">{detail}</p>
      ) : null}

      {state === "already" ? (
        <p className="rounded-2xl bg-background-secondary px-4 py-3 text-base text-text">{detail}</p>
      ) : null}

      {state === "error" ? (
        <p className="rounded-2xl bg-red-500/10 px-4 py-3 text-base text-red-800">{detail}</p>
      ) : null}
    </div>
  )
}
