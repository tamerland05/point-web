import { formatAccountAmount } from "./accountAssets"

interface AccountHistoryRowProps {
  amount: number
  currency: string
  icon: string | null
  isLast?: boolean
  itemsLabel: string
  onClick?: () => void
  title: string
}

export function AccountHistoryRow({
  amount,
  currency,
  icon,
  isLast,
  itemsLabel,
  onClick,
  title,
}: AccountHistoryRowProps) {
  const content = (
    <>
      <div className="relative shrink-0">
        {icon ? (
          <img alt="" className="size-[62px] rounded-xl object-cover" src={icon} />
        ) : (
          <div className="flex size-[62px] items-center justify-center rounded-xl bg-[#1e1e1c] font-medium text-[17px] text-white">
            {title.slice(0, 1).toUpperCase()}
          </div>
        )}
      </div>
      <div className={`flex min-w-0 flex-1 items-center pr-4 ${isLast ? "" : "border-black/15 border-b"}`}>
        <div className="flex min-w-0 max-w-[170px] flex-1 flex-col gap-0.5">
          <p className="truncate font-medium text-[#222222] text-[17px] leading-5">{title}</p>
          <p className="truncate text-[#8d969d] text-[15px] leading-[18px]">{itemsLabel}</p>
        </div>
        <p className="w-20 shrink-0 text-right font-medium text-[#8d969d] text-[17px] leading-5">
          {formatAccountAmount(amount, currency)}
        </p>
      </div>
    </>
  )

  if (onClick) {
    return (
      <button
        className="relative flex h-[88px] w-full items-center gap-4 pl-4 text-left"
        onClick={onClick}
        type="button"
      >
        {content}
      </button>
    )
  }

  return <div className="relative flex h-[88px] items-center gap-4 pl-4">{content}</div>
}
