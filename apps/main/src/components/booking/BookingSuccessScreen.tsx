import { useTranslation } from "@point/i18n"

import { AccountScreenLayout } from "@/components/account/AccountScreenLayout"
import { bookingAssets } from "@/components/booking/bookingAssets"

interface BookingSuccessScreenProps {
  onPrimaryAction: () => void
  onSecondaryAction: () => void
}

export function BookingSuccessScreen({ onPrimaryAction, onSecondaryAction }: BookingSuccessScreenProps) {
  const { t } = useTranslation()

  return (
    <AccountScreenLayout
      contentClassName="pb-28"
      footer={
        <div className="fixed inset-x-0 bottom-0 bg-[#efeff4] px-4 pt-3 pb-8">
          <div className="grid grid-cols-2 gap-2.5">
            <button
              className="h-[50px] rounded-2xl bg-white font-medium text-[17px] text-accent leading-normal"
              onClick={onSecondaryAction}
              type="button"
            >
              {t("WAVE1.BOOKING.SUCCESS_SECONDARY_ACTION")}
            </button>
            <button
              className="h-[50px] rounded-2xl bg-accent font-medium text-[17px] text-white leading-normal"
              onClick={onPrimaryAction}
              type="button"
            >
              {t("WAVE1.BOOKING.SUCCESS_ACTION")}
            </button>
          </div>
        </div>
      }
    >
      <div className="flex flex-col items-center pt-[184px]">
        <img alt="" className="size-[200px] rounded-[24px] object-cover" src={bookingAssets.successArt} />
        <div className="mt-4 w-[270px] text-center">
          <p className="font-medium text-[#222222] text-[17px] leading-5">{t("WAVE1.BOOKING.SUCCESS_TITLE")}</p>
          <p className="mt-1 text-[#8d969d] text-[15px] leading-[18px]">{t("WAVE1.BOOKING.SUCCESS_DESC")}</p>
        </div>
      </div>
    </AccountScreenLayout>
  )
}
