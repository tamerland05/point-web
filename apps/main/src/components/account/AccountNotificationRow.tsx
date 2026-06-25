import { accountAssets } from "./accountAssets"

interface AccountNotificationRowProps {
  icon: string
  isLast?: boolean
  read: boolean
  text: string
  title: string
}

export function AccountNotificationRow({ icon, isLast, read, text, title }: AccountNotificationRowProps) {
  return (
    <div className="relative flex h-[88px] items-center gap-4 pl-4">
      <div className="relative shrink-0">
        <img alt="" className="size-[62px] rounded-xl object-cover" src={icon} />
        {!read ? (
          <img alt="" className="-right-0.5 -top-0.5 absolute size-[15px]" src={accountAssets.unreadDot} />
        ) : null}
      </div>
      <div className={`flex min-w-0 flex-1 items-center gap-9 pr-4 ${isLast ? "" : "border-black/15 border-b"}`}>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="truncate font-medium text-[#222222] text-[17px] leading-5">{title}</p>
          <p className="truncate text-[#8d969d] text-[15px] leading-[18px]">{text}</p>
        </div>
        <img alt="" className="h-[11px] w-[6px] shrink-0" src={accountAssets.chevron} />
      </div>
    </div>
  )
}
