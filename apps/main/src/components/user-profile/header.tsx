import { memo } from "react"
import Img from "react-cool-img"

interface UserProfileHeaderProps {
  photo: string | null
  name: string | null
  username: string | null
  jobPlace?: boolean

  isJobPlaceHidden?: boolean
}

export const UserProfileHeader = memo(
  ({ photo, name, username, jobPlace, isJobPlaceHidden = false }: UserProfileHeaderProps) => {
    const jobPlaceText = jobPlace ? "Employee" : "User"

    return (
      <header className="mb-4 flex flex-col items-center justify-center">
        <Img
          placeholder="/user-ph.svg"
          error="/user-ph.svg"
          className="mb-4 size-24 rounded-full object-cover"
          src={photo}
          alt={name || username || "User photo"}
        />
        <div className="mb-2 text-center font-medium text-title-1">{name}</div>
        {!isJobPlaceHidden && (
          <div className="text-center font-normal text-caption-1 text-text-secondary">{jobPlaceText}</div>
        )}
      </header>
    )
  }
)

UserProfileHeader.displayName = "UserProfileHeader"
