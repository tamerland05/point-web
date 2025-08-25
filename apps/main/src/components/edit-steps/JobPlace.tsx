import type { JobPlace } from "@point/shared/types/index"

import { useSuspenseQuery } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { popup } from "@telegram-apps/sdk-react"
import { useCallback, useMemo } from "react"
import Img from "react-cool-img"

import { useDeleteEmployeeMutation } from "@point/shared/api/point/employee"
import { establishmentQueryOptions } from "@point/shared/api/point/establishments"
import { Icon } from "@point/ui/icon"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"

import { ShowMainButton } from "../tg-internals"

export const JobPlaceStep = ({ jobPlace }: { jobPlace?: JobPlace }) => {
  const navigate = useNavigate()

  const establishmentQuery = useSuspenseQuery(establishmentQueryOptions(jobPlace?.id))
  const establishment = establishmentQuery.data

  const deleteEmployeeMutation = useDeleteEmployeeMutation()

  const mainButtonConfig = useMemo(() => {
    return {
      hidden: false,
      onClick: () => navigate({ replace: true, to: "/account" }),
      title: "Save",
    }
  }, [navigate])

  const handleDelete = useCallback(async () => {
    const isSupported = await popup.isSupported()

    if (!isSupported) {
      await deleteEmployeeMutation.mutateAsync()
      void navigate({ replace: true, to: "/account/profile-type-updated" })

      return
    }

    const selected = await popup.show({
      buttons: [
        { id: "go", text: "GO", type: "default" },
        { id: "cancel", type: "cancel" },
      ],
      message: "If you delete your place of work, you will be moved to a user type account",
      title: "Delete place of work",
    })

    if (selected === "go") {
      await deleteEmployeeMutation.mutateAsync()
      void navigate({ replace: true, to: "/account/profile-type-updated" })
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
            leftBottomText={establishment.position.address}
            leftIcon={<Img className="size-10 rounded-full" src={establishment?.icon} />}
            leftTopText={establishment.name}
            rightIcon={<Icon className="size-6 text-transparent" name="Bin" onClick={handleDelete} />}
          />
        </List>
      </div>
    </ShowMainButton>
  )
}
