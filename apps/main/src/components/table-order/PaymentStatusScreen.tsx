import { useTranslation } from "@point/i18n"
import { cn } from "@point/ui/cn"

export type PaymentStatusVariant = "success" | "error" | "no-funds"

interface PaymentStatusScreenProps {
  variant: PaymentStatusVariant
  onPrimaryAction: () => void
  onBackToMenu?: () => void
}

const VARIANT_ICON: Record<PaymentStatusVariant, string> = {
  error: "!",
  "no-funds": "₽",
  success: "✓",
}

const VARIANT_TONE: Record<PaymentStatusVariant, string> = {
  error: "bg-[#ff3b30]",
  "no-funds": "bg-[#ff9500]",
  success: "bg-[#34c759]",
}

export function PaymentStatusScreen({ variant, onPrimaryAction, onBackToMenu }: PaymentStatusScreenProps) {
  const { t } = useTranslation()

  const titleKey =
    variant === "success"
      ? "WAVE1.ORDER_PROCESSING.SUCCESS_TITLE"
      : variant === "error"
        ? "WAVE1.ORDER_PROCESSING.ERROR_TITLE"
        : "WAVE1.ORDER_PROCESSING.NO_FUNDS_TITLE"

  const descKey =
    variant === "success"
      ? "WAVE1.ORDER_PROCESSING.SUCCESS_DESC"
      : variant === "error"
        ? "WAVE1.ORDER_PROCESSING.ERROR_DESC"
        : "WAVE1.ORDER_PROCESSING.NO_FUNDS_DESC"

  const actionKey =
    variant === "success"
      ? "WAVE1.ORDER_PROCESSING.SUCCESS_ACTION"
      : variant === "error"
        ? "WAVE1.ORDER_PROCESSING.ERROR_ACTION"
        : "WAVE1.ORDER_PROCESSING.NO_FUNDS_ACTION"

  return (
    <div className="flex min-h-full flex-col bg-[#efeff4] px-4 pt-16 pb-8">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center text-center">
        <div
          className={cn(
            "mb-6 flex size-20 items-center justify-center rounded-full font-semibold text-[32px] text-white",
            VARIANT_TONE[variant]
          )}
        >
          {VARIANT_ICON[variant]}
        </div>
        <h1 className="font-semibold text-[#222222] text-[22px]">{t(titleKey)}</h1>
        <p className="mt-3 max-w-sm text-[#8d969d] text-[15px] leading-relaxed">{t(descKey)}</p>
        <button
          className="mt-8 w-full max-w-sm rounded-2xl bg-accent px-4 py-4 font-semibold text-[17px] text-white"
          onClick={onPrimaryAction}
          type="button"
        >
          {t(actionKey)}
        </button>
        {onBackToMenu ? (
          <button
            className="mt-3 w-full max-w-sm rounded-2xl bg-white px-4 py-4 font-medium text-[#222222] text-[17px]"
            onClick={onBackToMenu}
            type="button"
          >
            {t("WAVE1.ORDER_PROCESSING.BACK_TO_MENU")}
          </button>
        ) : null}
      </div>
    </div>
  )
}
