import { ShowMainButton } from "@/components/tg-internals"
import { Icon } from "@point/ui/icon"
import { createFileRoute } from "@tanstack/react-router"
import { openTelegramLink } from "@telegram-apps/sdk-react"
import { useMemo } from "react"

export const Route = createFileRoute("/account/profile-type-updated")({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()

  const mainButtonConfig = useMemo(() => {
    return {
      title: "Continue",
      loading: false,
      disabled: false,
      hidden: false,
      onClick: () => navigate({ to: "/", replace: true }),
    }
  }, [navigate])

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
        <div className="justify-cente flex flex-col items-center bg-background">
          <Icon name={"User"} className="mb-10 size-24 text-transparent" />
          <h1 className="mb-1 text-center font-semibold text-title-2">Account Type Updated</h1>
          <p className="text-center text-base text-text-secondary">
            By deleting your place of work, you have moved to a new account type — user
          </p>
        </div>
      </div>
    </ShowMainButton>
  )
}
