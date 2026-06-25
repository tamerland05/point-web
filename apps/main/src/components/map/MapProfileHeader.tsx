import { hapticFeedback } from "@telegram-apps/sdk-react"
import Img from "react-cool-img"

import { useTranslation } from "@point/i18n"

import { accountAssets } from "@/components/account/accountAssets"

interface MapProfileHeaderProps {
  onNotificationsClick: () => void
  onScannerClick: () => void
  userName: string
  userPhoto?: string | null
}

export function MapProfileHeader({ onNotificationsClick, onScannerClick, userName, userPhoto }: MapProfileHeaderProps) {
  const { t } = useTranslation()

  const handleScannerClick = () => {
    hapticFeedback.impactOccurred("light")
    onScannerClick()
  }

  const handleNotificationsClick = () => {
    hapticFeedback.impactOccurred("light")
    onNotificationsClick()
  }

  return (
    <div className="pointer-events-auto h-[68px] rounded-2xl bg-white pl-4 shadow-[0_0_4px_rgba(0,0,0,0.06)]">
      <div className="flex h-full items-center gap-4 py-[10px] pr-4">
        <Img
          className="size-12 shrink-0 rounded-full border border-black/[0.05] object-cover"
          error="/user-ph.svg"
          placeholder="/user-ph.svg"
          src={userPhoto}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="truncate font-medium text-[17px] text-text leading-[17px]">{userName}</p>
          <div className="flex items-center gap-1">
            <img alt="" className="h-3 w-[15px]" src={accountAssets.expertThumb} />
            <p className="text-[15px] text-text-secondary leading-[15px]">{t("WAVE1.SELECTIONS.USER_ROLE")}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="shrink-0" onClick={handleScannerClick} type="button">
            <img alt="" className="size-11" src={accountAssets.actionScanner} />
          </button>
          <button className="shrink-0" onClick={handleNotificationsClick} type="button">
            <img alt="" className="size-11" src={accountAssets.actionBell} />
          </button>
        </div>
      </div>
    </div>
  )
}
