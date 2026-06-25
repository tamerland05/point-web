import type { ReactNode } from "react"

import { useTranslation } from "@point/i18n"
import { useFormatter } from "@point/shared/hooks/useFormatter"
import { cn } from "@point/ui/cn"

import { AccountScreenLayout } from "@/components/account/AccountScreenLayout"
import { AccountSectionFootnote, AccountSectionHeading } from "@/components/account/accountListUi"
import { bookingAssets } from "@/components/booking/bookingAssets"
import { useParityCapture } from "@/hooks/useParityCapture"

export type BookingFormVariant = "filled" | "process"

interface BookingFormScreenProps {
  accountName?: string
  dateTime: Date
  establishmentAddress?: string
  establishmentName?: string
  establishmentPhoto?: string
  footer: ReactNode
  name: string
  onDateToggle: () => void
  onNameChange: (value: string) => void
  variant: BookingFormVariant
}

export function BookingFormScreen({
  accountName,
  dateTime,
  establishmentAddress,
  establishmentName,
  establishmentPhoto,
  footer,
  name,
  onDateToggle,
  onNameChange,
  variant,
}: BookingFormScreenProps) {
  const { t } = useTranslation()
  const { formatDate } = useFormatter()
  const parityCapture = useParityCapture()
  const isFilled = variant === "filled"
  const dateLabel = parityCapture
    ? dateTime.getDate() === 21
      ? t("WAVE1.BOOKING.DATE_VALUE_2")
      : t("WAVE1.BOOKING.DATE_VALUE_1")
    : formatDate(dateTime, true, { month: "long" })
  const displayAccountName = parityCapture
    ? t("WAVE1.BOOKING.ACCOUNT_NAME")
    : accountName?.trim() || t("WAVE1.BOOKING.ACCOUNT_NAME")
  const filledName = name.trim() || displayAccountName
  const placeName = parityCapture ? t("WAVE1.BOOKING.PLACE_NAME") : establishmentName || t("WAVE1.BOOKING.PLACE_NAME")
  const placeAddress = parityCapture
    ? t("WAVE1.BOOKING.PLACE_ADDRESS")
    : establishmentAddress || t("WAVE1.BOOKING.PLACE_ADDRESS")
  const placePhoto = parityCapture ? bookingAssets.logo : establishmentPhoto || bookingAssets.logo

  return (
    <AccountScreenLayout contentClassName="pb-28" footer={footer}>
      <div className="flex h-[68px] items-center rounded-2xl bg-white px-4">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-full">
            <img alt="" className="absolute inset-0 size-full object-cover" src={placePhoto} />
            {parityCapture ? (
              <img alt="" className="absolute inset-0 size-full object-cover" src={bookingAssets.logoOverlay} />
            ) : null}
          </div>
          <div className="min-w-0 py-3">
            <div className="flex items-center gap-1">
              <p className="font-medium text-[#222222] text-[17px] leading-5">{placeName}</p>
              <img alt="" className="h-3.5 w-3.5" src={bookingAssets.verified} />
            </div>
            <p className="text-[#8d969d] text-[15px] leading-[18px]">{placeAddress}</p>
          </div>
        </div>
      </div>

      <section>
        <AccountSectionHeading>{t("WAVE1.BOOKING.INFO_SECTION")}</AccountSectionHeading>
        <div className="overflow-hidden rounded-2xl bg-white">
          {isFilled ? (
            <div className="flex h-12 items-center border-black/10 border-b px-4">
              <span className="text-[#222222] text-[17px] leading-5">
                {parityCapture ? t("WAVE1.BOOKING.ACCOUNT_NAME") : filledName}
              </span>
            </div>
          ) : parityCapture ? (
            <div className="flex h-12 items-center border-black/10 border-b px-4">
              <span className="text-[#8d969d] text-[17px] leading-5">{t("WAVE1.BOOKING.NAME_PLACEHOLDER")}</span>
            </div>
          ) : (
            <input
              className="h-12 w-full border-black/10 border-b bg-transparent px-4 text-[#222222] text-[17px] leading-5 outline-none placeholder:text-[#8d969d]"
              onChange={(event) => onNameChange(event.target.value)}
              placeholder={t("WAVE1.BOOKING.NAME_PLACEHOLDER")}
              value={name}
            />
          )}
          <div className="flex h-12 items-center justify-between px-4">
            <span className="text-[#222222] text-[17px] leading-5">{t("WAVE1.BOOKING.ACCOUNT_LABEL")}</span>
            <span className="text-[#8d969d] text-[17px] leading-5">{displayAccountName}</span>
          </div>
        </div>
        <AccountSectionFootnote>{t("WAVE1.BOOKING.MANAGER_NOTE")}</AccountSectionFootnote>
      </section>

      <section>
        <div className="flex h-[42px] items-center justify-between rounded-2xl bg-white px-4">
          <span className="text-[#222222] text-[17px] leading-5">{t("WAVE1.BOOKING.DATE_LABEL")}</span>
          <button
            className="rounded-[10px] bg-[#efeff4] px-3 py-1.5 text-[17px] text-accent leading-5"
            onClick={onDateToggle}
            type="button"
          >
            {dateLabel}
          </button>
        </div>
        <AccountSectionFootnote>{t("WAVE1.BOOKING.LATE_NOTE")}</AccountSectionFootnote>
      </section>
    </AccountScreenLayout>
  )
}

export function BookingPrimaryButton({
  children,
  className,
  disabled,
  onClick,
  variant,
}: {
  children: ReactNode
  className?: string
  disabled?: boolean
  onClick?: () => void
  variant: BookingFormVariant
}) {
  return (
    <button
      className={cn(
        "h-[50px] w-full rounded-2xl font-medium text-[17px] text-white leading-normal",
        variant === "process" ? "bg-accent/35" : "bg-accent",
        className
      )}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  )
}
