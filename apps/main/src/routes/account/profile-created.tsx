import { createFileRoute } from "@tanstack/react-router"
import { useMemo } from "react"

import { Icon } from "@point/ui/icon"

import { ShowMainButton } from "@/components/tg-internals"

export const Route = createFileRoute("/account/profile-created")({
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
      title: "Continue",
    }
  }, [navigate])

  return (
    <ShowMainButton {...mainButtonConfig}>
      <div className={"-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 w-full bg-background px-18 py-6"}>
        <div className="flex flex-col items-center bg-background">
          <Icon className="mb-10 size-24 text-transparent" name={"Fire"} />
          <h1 className="mb-1 text-center font-semibold text-title-2">Account Created</h1>
          <p className="text-center text-base text-text-secondary">
            Congratulations, the account has been successfully created!
          </p>
        </div>
      </div>
    </ShowMainButton>
  )
}
