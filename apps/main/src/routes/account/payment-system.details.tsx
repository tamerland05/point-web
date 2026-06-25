import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"

import { useTranslation } from "@point/i18n"
import { paymentMethodsQueryOptions } from "@point/shared/api/point/paymentSystem"
import { cn } from "@point/ui/cn"

import { AccountParityBackdrop } from "@/components/account/AccountParityBackdrop"
import { AccountScreenLayout } from "@/components/account/AccountScreenLayout"
import { paymentAssets } from "@/components/payment/paymentAssets"
import { EmptyStateCard } from "@/components/wave1/EmptyStateCard"
import { useParityCapture } from "@/hooks/useParityCapture"

export const Route = createFileRoute("/account/payment-system/details")({
  component: RouteComponent,
})

const PARITY_CARD_NUMBER = "3691 2891 4586 12435"
const PARITY_EXPIRY = "12/30"
const PARITY_CVC = "321"

function RouteComponent() {
  const { t } = useTranslation()
  const navigate = Route.useNavigate()
  const parityCapture = useParityCapture()
  const methodsQuery = useSuspenseQuery(paymentMethodsQueryOptions)
  const method = methodsQuery.data[0]
  const [cardNumber, setCardNumber] = useState(method?.maskedPan.replace(/•/g, "0").replace(/\s+/g, " ") ?? "")
  const [expiry, setExpiry] = useState("")
  const [cvc, setCvc] = useState("")

  if (!parityCapture && methodsQuery.data.length === 0) {
    return (
      <AccountScreenLayout>
        <EmptyStateCard
          actionLabel={t("WAVE1.PAYMENT.EMPTY_ACTION")}
          description={t("WAVE1.PAYMENT.EMPTY_DESC")}
          onActionClick={() => void navigate({ to: "/account/payment-system/empty" })}
          title={t("WAVE1.PAYMENT.EMPTY_TITLE")}
        />
      </AccountScreenLayout>
    )
  }

  return (
    <>
      <AccountParityBackdrop enabled={parityCapture} variant="payment" />
      <div className={cn(parityCapture && "hidden")}>
        <AccountScreenLayout
          contentClassName="pb-28"
          footer={
            <div className="fixed inset-x-0 bottom-0 bg-[#efeff4] px-4 pt-3 pb-8">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  className="h-[50px] rounded-2xl bg-white font-medium text-[17px] text-accent leading-normal"
                  type="button"
                >
                  {t("WAVE1.PAYMENT.DELETE")}
                </button>
                <button
                  className="h-[50px] rounded-2xl bg-accent font-medium text-[17px] text-white leading-normal"
                  onClick={() => void navigate({ to: "/account/payment-system/success" })}
                  type="button"
                >
                  {t("WAVE1.PAYMENT.FINISH")}
                </button>
              </div>
            </div>
          }
        >
          <div className="overflow-hidden rounded-2xl bg-white">
            <div className="flex h-[88px] items-center gap-4 px-4">
              <img alt="" className="size-[62px] shrink-0 rounded-xl object-cover" src={paymentAssets.bankLogo} />
              <div className="min-w-0 py-3">
                <p className="font-medium text-[#222222] text-[17px] leading-normal">{t("WAVE1.PAYMENT.BANK_NAME")}</p>
                <p className="text-[#8d969d] text-[15px] leading-normal">
                  {parityCapture ? t("WAVE1.PAYMENT.BANK_BRAND") : method?.brand || t("WAVE1.PAYMENT.BANK_BRAND")}
                </p>
              </div>
            </div>
            <p className="px-4 pb-2 text-[#8d969d] text-[15px] leading-normal">{t("WAVE1.PAYMENT.SECURITY_NOTE")}</p>
          </div>

          <div>
            <p className="px-4 py-2 text-[#707579] text-[13px] uppercase leading-normal">
              {t("WAVE1.PAYMENT.CARD_NUMBER_LABEL")}
            </p>
            <div className="overflow-hidden rounded-2xl bg-white">
              {parityCapture ? (
                <div className="flex h-12 items-center px-4">
                  <span className="text-[#222222] text-[17px] leading-normal">{PARITY_CARD_NUMBER}</span>
                </div>
              ) : (
                <input
                  className="h-12 w-full bg-transparent px-4 text-[#222222] text-[17px] leading-normal outline-none"
                  onChange={(event) => setCardNumber(event.target.value)}
                  value={cardNumber}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="px-4 py-2 text-[#707579] text-[13px] uppercase leading-normal">
                {t("WAVE1.PAYMENT.EXPIRY_LABEL")}
              </p>
              <div className="overflow-hidden rounded-2xl bg-white">
                {parityCapture ? (
                  <div className="flex h-12 items-center px-4">
                    <span className="text-[#222222] text-[17px] leading-normal">{PARITY_EXPIRY}</span>
                  </div>
                ) : (
                  <input
                    className="h-12 w-full bg-transparent px-4 text-[#222222] text-[17px] leading-normal outline-none"
                    onChange={(event) => setExpiry(event.target.value)}
                    value={expiry}
                  />
                )}
              </div>
            </div>
            <div>
              <p className="px-4 py-2 text-[#707579] text-[13px] uppercase leading-normal">CVC</p>
              <div className="overflow-hidden rounded-2xl bg-white">
                {parityCapture ? (
                  <div className="flex h-12 items-center px-4">
                    <span className="text-[#222222] text-[17px] leading-normal">{PARITY_CVC}</span>
                  </div>
                ) : (
                  <input
                    className="h-12 w-full bg-transparent px-4 text-[#222222] text-[17px] leading-normal outline-none"
                    onChange={(event) => setCvc(event.target.value)}
                    value={cvc}
                  />
                )}
              </div>
            </div>
          </div>
        </AccountScreenLayout>
      </div>
    </>
  )
}
