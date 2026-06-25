import { createFileRoute } from "@tanstack/react-router"
import { openTelegramLink } from "@telegram-apps/sdk-react"
import { useMemo } from "react"

import { useTranslation } from "@point/i18n"
import { Icon } from "@point/ui/icon"

import { ShowMainButton } from "@/components/tg-internals"

export const Route = createFileRoute("/account/access-restricted")({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { t } = useTranslation()

  const mainButtonConfig = useMemo(() => {
    return {
      disabled: false,
      hidden: false,
      loading: false,
      onClick: () => navigate({ replace: true, to: "/" }),
      title: t("ACCOUNT.ACCESS_RESTRICTED.CONTINUE_AS_USER"),
    }
  }, [navigate])

  const secondaryButtonConfig = useMemo(
    () => ({
      // TODO: if user.employee -  hide
      hidden: false,
      onClick: () => openTelegramLink("https://t.me/samvuoto"),
      position: "bottom" as const,
      title: t("ACCOUNT.ACCESS_RESTRICTED.SUPPORT"),
    }),
    []
  )

  return (
    <ShowMainButton secondary={secondaryButtonConfig} {...mainButtonConfig}>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 w-full bg-background px-8 py-6">
        <div className="mx-auto flex max-w-[340px] flex-col items-center bg-background">
          <Icon className="mb-8 size-24 text-transparent" name={"Lock"} />
          <h1 className="mb-1 text-center font-semibold text-title-2">{t("ACCOUNT.ACCESS_RESTRICTED.TITLE")}</h1>
          <p className="text-center text-base text-text-secondary leading-snug">
            {t("ACCOUNT.ACCESS_RESTRICTED.DESCRIPTION")}
          </p>
        </div>
      </div>
    </ShowMainButton>
  )
}
