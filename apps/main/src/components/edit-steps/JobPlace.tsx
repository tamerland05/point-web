import type { JobPlace } from "@point/shared/types/index"

import { useSuspenseQuery } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { popup } from "@telegram-apps/sdk-react"
import { useCallback, useMemo } from "react"
import Img from "react-cool-img"

import { useTranslation } from "@point/i18n"
import { useDeleteEmployeeMutation } from "@point/shared/api/point/employee"
import { establishmentQueryOptions } from "@point/shared/api/point/establishments"
import { Icon } from "@point/ui/icon"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"

import { ShowMainButton } from "../tg-internals"

export const JobPlaceStep = ({ jobPlace }: { jobPlace?: JobPlace }) => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const establishmentQuery = useSuspenseQuery(establishmentQueryOptions(jobPlace?.id))
  const establishment = establishmentQuery.data

  const deleteEmployeeMutation = useDeleteEmployeeMutation()

  const mainButtonConfig = useMemo(() => {
    return {
      hidden: false,
      onClick: () => navigate({ replace: true, to: "/account" }),
      title: t("WORK.JOB_PLACE_STEP.SAVE"),
    }
  }, [navigate, t])

  const handleDelete = useCallback(async () => {
    const isSupported = await popup.isSupported()

    if (!isSupported) {
      await deleteEmployeeMutation.mutateAsync()
      void navigate({ replace: true, to: "/account/profile-type-updated" })

      return
    }

    const selected = await popup.show({
      buttons: [
        { id: "go", text: t("UI.CONTINUE"), type: "default" },
        { id: "cancel", type: "cancel" },
      ],
      message: t("WORK.JOB_PLACE_STEP.DELETE_CONFIRM_MESSAGE"),
      title: t("WORK.JOB_PLACE_STEP.DELETE_CONFIRM_TITLE"),
    })

    if (selected === "go") {
      await deleteEmployeeMutation.mutateAsync()
      void navigate({ replace: true, to: "/account/profile-type-updated" })
    }

    return
  }, [deleteEmployeeMutation.mutateAsync, navigate, t])

  if (!jobPlace || !establishment?.icon) {
    return null
  }

  return (
    <ShowMainButton {...mainButtonConfig}>
      <div className="flex flex-col px-4 pt-4 pb-6">
        <List title={t("WORK.JOB_PLACE_STEP.TITLE")}>
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
