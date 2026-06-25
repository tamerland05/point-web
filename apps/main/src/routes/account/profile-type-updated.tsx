import { createFileRoute } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { openTelegramLink } from "@telegram-apps/sdk-react"
import { useMemo } from "react"
import { z } from "zod"

import { useTranslation } from "@point/i18n"
import { Icon } from "@point/ui/icon"

import { ShowMainButton } from "@/components/tg-internals"

const searchSchema = z.object({
  to: z.enum(["user", "employee"]).default("user"),
})

export const Route = createFileRoute("/account/profile-type-updated")({
  component: RouteComponent,
  validateSearch: zodValidator(searchSchema),
})

function RouteComponent() {
  const { to } = Route.useSearch()
  const navigate = Route.useNavigate()
  const { t } = useTranslation()

  const mainButtonConfig = useMemo(() => {
    return {
      disabled: false,
      hidden: false,
      loading: false,
      onClick: () => navigate({ replace: true, to: to === "user" ? "/" : "/account/my-profile/edit" }),
      title: t("UI.CONTINUE"),
    }
  }, [navigate, to])

  const secondaryButtonConfig = useMemo(
    () => ({
      // TODO: if user.employee -  hide
      hidden: false,
      onClick: () => openTelegramLink("https://t.me/samvuoto"),
      position: "bottom" as const,
      title: t("ACCOUNT.PROFILE_TYPE_UPDATED.SUPPORT"),
    }),
    []
  )

  return (
    <ShowMainButton secondary={secondaryButtonConfig} {...mainButtonConfig}>
      <div className={"-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 w-full bg-background px-12 py-6"}>
        <div className="flex flex-col items-center bg-background">
          <Icon className="mb-10 size-24 text-transparent" name={to === "user" ? "User" : "Users"} />
          <h1 className="mb-1 text-center font-semibold text-title-2">{t("ACCOUNT.PROFILE_TYPE_UPDATED.TITLE")}</h1>
          <p className="text-center text-base text-text-secondary">
            {to === "user"
              ? t("ACCOUNT.PROFILE_TYPE_UPDATED.USER_DESCRIPTION")
              : t("ACCOUNT.PROFILE_TYPE_UPDATED.EMPLOYEE_DESCRIPTION")}
          </p>
        </div>
      </div>
    </ShowMainButton>
  )
}
