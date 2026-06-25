import type { ReactNode } from "react"

import Img from "react-cool-img"

import { cn } from "@point/ui/cn"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"

export interface MenuItemDetailInfoRow {
  bottom: ReactNode
  label: string
  onClick?: () => void
  withSeparator?: boolean
}

interface MenuItemDetailScreenProps {
  categoryLabel?: string
  footer: ReactNode
  imageAlt: string
  imageUrl?: string
  infoRows: MenuItemDetailInfoRow[]
  listTitle?: string
  title: string
  topBar?: ReactNode
}

export function MenuItemDetailScreen({
  categoryLabel,
  footer,
  imageAlt,
  imageUrl,
  infoRows,
  listTitle = "Информация о блюде",
  title,
  topBar,
}: MenuItemDetailScreenProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#efeff4]">
      <div className="flex flex-1 flex-col overflow-y-auto px-4 pt-4 pb-40">
        {topBar ?? (
          <div className="mb-4 flex justify-center">
            <h1 className="max-w-full truncate text-center font-semibold text-[#222222] text-[20px]">{title}</h1>
          </div>
        )}

        {imageUrl ? (
          <Img
            alt={imageAlt}
            className="mb-3 h-56 w-full rounded-2xl object-cover"
            error="/img-ph.svg"
            placeholder="/img-ph.svg"
            src={imageUrl}
          />
        ) : null}

        {categoryLabel ? <div className="mb-6 text-[#8d969d] text-[14px]">{categoryLabel}</div> : null}

        {infoRows.length > 0 ? (
          <div className="mb-6">
            <List title={listTitle}>
              {infoRows.map((row, index) => (
                <ListItem
                  key={row.label}
                  leftBottomText={<span className="text-base text-text">{row.bottom}</span>}
                  leftTopText={<span className="text-caption-1 text-text-secondary">{row.label}</span>}
                  onClick={row.onClick}
                  withSeparator={row.withSeparator ?? index < infoRows.length - 1}
                />
              ))}
            </List>
          </div>
        ) : null}
      </div>

      <div
        className={cn(
          "fixed right-0 bottom-0 left-0 border-black/5 border-t bg-background px-4 pt-3",
          "pb-[max(1rem,env(safe-area-inset-bottom))]"
        )}
      >
        {footer}
      </div>
    </div>
  )
}
