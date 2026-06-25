import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import toast from "react-hot-toast"

import { useTranslation } from "@point/i18n"
import { useAddPaymentMethodMutation } from "@point/shared/api/point/paymentSystem"

import { AccountScreenLayout } from "@/components/account/AccountScreenLayout"
import { BookingFormBlock } from "@/components/wave1/BookingFormBlock"

export const Route = createFileRoute("/account/payment-system/add")({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  const navigate = Route.useNavigate()
  const addPaymentMethodMutation = useAddPaymentMethodMutation()
  const [cardNumber, setCardNumber] = useState("")
  const [holderName, setHolderName] = useState("")

  const canSubmit = cardNumber.replace(/\s+/g, "").length >= 16 && holderName.trim().length >= 2

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast.error(t("WAVE1.PAYMENT.FILL_CARD_ERROR"))
      return
    }
    await addPaymentMethodMutation.mutateAsync({ cardNumber, holderName })
    void navigate({ to: "/account/payment-system/success" })
  }

  return (
    <AccountScreenLayout>
      <h1 className="font-medium text-[#222222] text-[17px] leading-normal">{t("WAVE1.PAYMENT.ADD_CARD_TITLE")}</h1>
      <BookingFormBlock
        label={t("WAVE1.PAYMENT.CARD_NUMBER_LABEL")}
        onChange={setCardNumber}
        placeholder="0000 0000 0000 0000"
        value={cardNumber}
      />
      <BookingFormBlock
        label={t("WAVE1.PAYMENT.HOLDER_NAME_LABEL")}
        onChange={setHolderName}
        placeholder="IVAN IVANOV"
        value={holderName}
      />
      <button
        className="w-full rounded-xl bg-accent px-4 py-3 text-caption-1 text-white disabled:opacity-50"
        disabled={!canSubmit || addPaymentMethodMutation.isPending}
        onClick={() => void handleSubmit()}
        type="button"
      >
        {addPaymentMethodMutation.isPending ? t("WAVE1.PAYMENT.SAVING_CARD") : t("WAVE1.PAYMENT.SAVE_CARD")}
      </button>
    </AccountScreenLayout>
  )
}
