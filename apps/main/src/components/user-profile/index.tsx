import type { JobPlace, PurposeOfFunding } from "@point/shared/types"

import { openTelegramLink } from "@telegram-apps/sdk-react"
import { memo } from "react"
import Img from "react-cool-img"

import { Icon } from "@point/ui/icon"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"

import { UserProfileHeader } from "./header"

interface UserProfileProps {
  jobPlace?: JobPlace | null
  purpose?: PurposeOfFunding | null

  photo: string | null
  name: string | null
  username: string | null
  rank: number | null
  tipsLeft?: number | null

  onEdit?: () => void
  onShare?: () => void
  onFundraisingClick?: () => void
}

export const UserProfile = memo(
  ({
    jobPlace,
    purpose,
    photo,
    name,
    username,
    rank,
    tipsLeft,
    onEdit,
    onShare,
    onFundraisingClick,
  }: UserProfileProps) => {
    return (
      <div className="relative">
        <UserProfileHeader
          isJobPlaceHidden={!jobPlace}
          jobPlace={!!jobPlace}
          name={name}
          photo={photo}
          username={username}
        />

        {purpose && (
          <List className="mb-7" title="Fundraising">
            <ListItem
              leftBottomText={<span className="line-clamp-1">{purpose?.description}</span>}
              leftIcon={<Img alt={purpose?.title} className="h-12 w-12 rounded-full" src={purpose?.icon} />}
              leftTopText={<span className="font-medium">{purpose?.title}</span>}
              onClick={onFundraisingClick}
            />
          </List>
        )}

        <List>
          {username && (
            <ListItem
              leftBottomText={
                <button
                  className="text-accent text-base"
                  onClick={() => {
                    openTelegramLink(`https://t.me/${username}`)
                  }}
                  type="button"
                >
                  @{username}
                </button>
              }
              leftTopText={<span className="text-caption-1 text-text-secondary">TG</span>}
              withSeparator
            />
          )}

          <ListItem
            leftBottomText={<span className="text-base text-text">Текущий ранг в общем рейтинге #{rank || 0}</span>}
            leftTopText={<span className="text-caption-1 text-text-secondary">Эксперт</span>}
            withSeparator
          />

          {jobPlace && (
            <ListItem
              leftBottomText={<span className="text-base text-text">{jobPlace?.name}</span>}
              leftTopText={<span className="text-caption-1 text-text-secondary">Для бизнеса</span>}
              withSeparator
            />
          )}
          {jobPlace && (
            <ListItem
              leftBottomText={<span className="text-base text-text">{jobPlace?.address}</span>}
              leftTopText={<span className="text-caption-1 text-text-secondary">Информация</span>}
            />
          )}
          <ListItem
            leftBottomText={
              <span className="text-base text-text">{tipsLeft !== null ? `${tipsLeft} USDT` : "Информация"}</span>
            }
            leftTopText={<span className="text-caption-1 text-text-secondary">Система оплаты</span>}
          />
        </List>

        {onEdit && (
          <button
            className="absolute top-0 left-0 m-0 flex items-center justify-center rounded-full bg-[#E1E0E6] p-2"
            onClick={onEdit}
            type="button"
          >
            <Icon className="m-0 h-5 w-5 text-transparent" name="Edit" />
          </button>
        )}

        {onShare && (
          <button
            className="absolute top-0 right-0 m-0 flex items-center justify-center rounded-full bg-[#E1E0E6] p-2"
            onClick={onShare}
            type="button"
          >
            <Icon className="m-0 h-5 w-5 text-transparent" name="Share" />
          </button>
        )}
      </div>
    )
  }
)

UserProfile.displayName = "UserProfile"
