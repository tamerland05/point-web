import { useTranslation } from "@point/i18n"

import { EstablishmentTypeIcon } from "@/components/map/EstablishmentTypeIcon"
import { mapAssets } from "@/components/map/mapAssets"
import { truncateCategoryLabel } from "@/utils/truncateCategoryLabel"

export function CategoryFilterCancelChip({ onClick }: { onClick: () => void }) {
  const { t } = useTranslation()

  return (
    <button className="flex w-[65px] shrink-0 flex-col items-center gap-1 px-2.5" onClick={onClick} type="button">
      <img alt="" className="size-11 shrink-0" src={mapAssets.categoryFilterCancel} />
      <p className="whitespace-nowrap text-center text-[#8d969d] text-[15px] leading-[18px]">{t("UI.CANCEL")}</p>
    </button>
  )
}

export function CategoryFilterChip({
  dimmed,
  icon,
  label,
  onClick,
  tone,
}: {
  dimmed: boolean
  icon: string
  label: string
  onClick: () => void
  tone: string
}) {
  const displayLabel = truncateCategoryLabel(label)

  return (
    <button className="flex w-[65px] shrink-0 flex-col items-center gap-1 px-2.5" onClick={onClick} type="button">
      <EstablishmentTypeIcon dimmed={dimmed} icon={icon} tone={tone} />
      <p className="w-[65px] whitespace-nowrap text-center text-[#8d969d] text-[15px] leading-[18px]">{displayLabel}</p>
    </button>
  )
}
