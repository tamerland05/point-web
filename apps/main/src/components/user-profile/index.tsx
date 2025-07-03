import type { JobPlace, PurposeOfFunding } from "@point/shared/types"
import { Icon } from "@point/ui/icon"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"
import { Link } from "@tanstack/react-router"
import { openTelegramLink } from "@telegram-apps/sdk-react"
import { memo } from "react"
import Img from "react-cool-img"
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
}

export const UserProfile = memo(
  ({ jobPlace, purpose, photo, name, username, rank, tipsLeft, onEdit, onShare }: UserProfileProps) => {
    return (
      <div className="relative">
        <UserProfileHeader
          photo={photo}
          name={name}
          username={username}
          jobPlace={!!jobPlace}
          isJobPlaceHidden={!jobPlace}
        />

        {purpose && (
          <List className="mb-7" title="Fundraising">
            <ListItem
              leftIcon={<Img className="h-12 w-12 rounded-full" src={purpose?.icon} alt={purpose?.title} />}
              leftTopText={<span className="font-medium">{purpose?.title}</span>}
              leftBottomText={<span className="">{purpose?.description}</span>}
            />
          </List>
        )}

        <List>
          <ListItem
            leftTopText={<span className="text-caption-1 text-text-secondary">Telegram</span>}
            leftBottomText={
              <button
                type="button"
                onClick={() => {
                  openTelegramLink(`t.me/${username}`)
                }}
                className="text-accent text-base"
              >
                @{username}
              </button>
            }
            withSeparator
          />

          <ListItem
            leftTopText={<span className="text-caption-1 text-text-secondary">User Rank</span>}
            leftBottomText={
              <span className="text-base text-text">
                At this moment in time, the user is ranked{" "}
                <Link className="text-accent" to="/earn/rating">
                  #{rank || 0}
                </Link>{" "}
                in the overall ranking
              </span>
            }
            withSeparator
          />

          {jobPlace && (
            <ListItem
              leftTopText={<span className="text-caption-1 text-text-secondary">Place of Work</span>}
              leftBottomText={<span className="text-base text-text">{jobPlace?.name}</span>}
              withSeparator
            />
          )}
          {jobPlace && (
            <ListItem
              leftTopText={<span className="text-caption-1 text-text-secondary">Address</span>}
              leftBottomText={<span className="text-base text-text">{jobPlace?.address}</span>}
            />
          )}
          {!jobPlace && (
            <ListItem
              leftTopText={<span className="text-caption-1 text-text-secondary">Tips left</span>}
              leftBottomText={<span className="text-base text-text">{tipsLeft || 0} USDT</span>}
            />
          )}
        </List>

        {onEdit && (
          <button
            onClick={onEdit}
            type="button"
            className="absolute top-0 left-0 m-0 flex items-center justify-center rounded-full bg-[#E1E0E6] p-2"
          >
            <Icon name="Edit" className="m-0 h-5 w-5 text-transparent" />
          </button>
        )}

        {onShare && (
          <button
            onClick={onShare}
            type="button"
            className="absolute top-0 right-0 m-0 flex items-center justify-center rounded-full bg-[#E1E0E6] p-2"
          >
            <Icon name="Share" className="m-0 h-5 w-5 text-transparent" />
          </button>
        )}
      </div>
    )
  }
)

UserProfile.displayName = "UserProfile"
