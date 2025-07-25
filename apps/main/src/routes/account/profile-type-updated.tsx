import { ShowMainButton } from "@/components/tg-internals"
import { Icon } from "@point/ui/icon"
import { createFileRoute } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { openTelegramLink } from "@telegram-apps/sdk-react"
import { useMemo } from "react"
import { z } from "zod"

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

  const mainButtonConfig = useMemo(() => {
    return {
      title: "Continue",
      loading: false,
      disabled: false,
      hidden: false,
      onClick: () => navigate({ to: to === "user" ? "/" : "/account/my-profile/edit", replace: true }),
    }
  }, [navigate, to])

  const secondaryButtonConfig = useMemo(
    () => ({
      title: "Contact Support",
      position: "bottom" as const,
      // TODO: if user.employee -  hide
      hidden: false,
      onClick: () => openTelegramLink("https://t.me/samvuoto"),
    }),
    []
  )

  return (
    <ShowMainButton secondary={secondaryButtonConfig} {...mainButtonConfig}>
      <div className={"-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 w-full bg-background px-12 py-6"}>
        <div className="flex flex-col items-center bg-background">
          <Icon name={to === "user" ? "User" : "Users"} className="mb-10 size-24 text-transparent" />
          <h1 className="mb-1 text-center font-semibold text-title-2">Account Type Updated</h1>
          <p className="text-center text-base text-text-secondary">
            {to === "user"
              ? "By deleting your place of work, you have moved to a new account type — user"
              : "When you received an invitation from the establishment, you switched to a new type of account — employee"}
          </p>
        </div>
      </div>
    </ShowMainButton>
  )
}
