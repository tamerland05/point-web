import { useDeleteEmployeeMutation } from "@point/shared/api/point/employee"
import { establishmentQueryOptions } from "@point/shared/api/point/establishments"
import type { JobPlace } from "@point/shared/types/index"
import { Icon } from "@point/ui/icon"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { popup } from "@telegram-apps/sdk-react"
import { useCallback, useMemo } from "react"
import Img from "react-cool-img"
import { ShowMainButton } from "../tg-internals"

export const JobPlaceStep = ({ jobPlace }: { jobPlace?: JobPlace }) => {
  const navigate = useNavigate()

  const establishmentQuery = useSuspenseQuery(establishmentQueryOptions(jobPlace?.id))
  const establishment = establishmentQuery.data

  const deleteEmployeeMutation = useDeleteEmployeeMutation()

  const mainButtonConfig = useMemo(() => {
    return {
      title: "Save",
      hidden: false,
      onClick: () => navigate({ to: "/account/my-profile/view", replace: true }),
    }
  }, [navigate])

  const handleDelete = useCallback(async () => {
    const selected = await popup.show({
      title: "Delete place of work",
      message: "If you delete your place of work, you will be moved to a user type account",
      buttons: [
        { type: "default", text: "GO", id: "go" },
        { type: "cancel", id: "cancel" },
      ],
    })

    if (selected === "go") {
      await deleteEmployeeMutation.mutateAsync()
      navigate({ to: "/account/profile-type-updated", replace: true })
    }

    return
  }, [deleteEmployeeMutation.mutateAsync, navigate])

  if (!jobPlace || !establishment?.icon) {
    return null
  }

  return (
    <ShowMainButton {...mainButtonConfig}>
      <div className="flex flex-col p-4">
        <List title="place of work">
          <ListItem
            className="py-3"
            leftTopText={establishment.name}
            leftBottomText={establishment.position.address}
            leftIcon={<Img src={establishment?.icon} className="h-7 w-7" />}
            rightIcon={<Icon name="Bin" className="h-7 w-7 text-accent" onClick={handleDelete} />}
          />
        </List>
      </div>
    </ShowMainButton>
  )
}
