import { createFileRoute } from "@tanstack/react-router"
import { openTelegramLink } from "@telegram-apps/sdk-react"
import { useMemo } from "react"

import { Icon } from "@point/ui/icon"

import { ShowMainButton } from "@/components/tg-internals"

export const Route = createFileRoute("/account/access-restricted")({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()

  const mainButtonConfig = useMemo(() => {
    return {
      disabled: false,
      hidden: false,
      loading: false,
      onClick: () => navigate({ replace: true, to: "/" }),
      title: "Continue as User",
    }
  }, [navigate])

  const secondaryButtonConfig = useMemo(
    () => ({
      // TODO: if user.employee -  hide
      hidden: false,
      onClick: () => openTelegramLink("https://t.me/samvuoto"),
      position: "bottom" as const,
      title: "Contact Support",
    }),
    []
  )

  return (
    <ShowMainButton secondary={secondaryButtonConfig} {...mainButtonConfig}>
      <div className={"-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 w-full bg-background px-12 py-6"}>
        <div className="flex flex-col items-center bg-background">
          <Icon className="mb-10 size-24 text-transparent" name={"Lock"} />
          <h1 className="mb-1 text-center font-semibold text-title-2">Access is restricted</h1>
          <p className="text-center text-base text-text-secondary">
            Only invited users from connected institutions have access to the employee's account
          </p>
        </div>
      </div>
    </ShowMainButton>
  )
}
