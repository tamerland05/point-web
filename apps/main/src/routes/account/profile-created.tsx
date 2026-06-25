import { createFileRoute } from "@tanstack/react-router"
import { useMemo } from "react"

import { useTranslation } from "@point/i18n"
import { Icon } from "@point/ui/icon"

import { ShowMainButton } from "@/components/tg-internals"

export const Route = createFileRoute("/account/profile-created")({
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
      title: t("UI.CONTINUE"),
    }
  }, [navigate])

  return (
    <ShowMainButton {...mainButtonConfig}>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 w-full bg-background px-8 py-6">
        <div className="mx-auto flex max-w-[340px] flex-col items-center bg-background">
          <Icon className="mb-8 size-24 text-transparent" name={"Fire"} />
          <h1 className="mb-1 text-center font-semibold text-title-2">{t("ACCOUNT.PROFILE_CREATED.TITLE")}</h1>
          <p className="text-center text-base text-text-secondary leading-snug">
            {t("ACCOUNT.PROFILE_CREATED.DESCRIPTION")}
          </p>
        </div>
      </div>
    </ShowMainButton>
  )
}
