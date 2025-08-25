import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useSetAtom } from "jotai"

import { Icon } from "@point/ui/icon"

import { showMenuAtom } from "@/atoms/ui"
import { ShowMainButton } from "@/components/tg-internals"

export const Route = createFileRoute("/tips/$placeId/error")({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const router = useRouter()
  const setMenuVisible = useSetAtom(showMenuAtom)

  return (
    <ShowMainButton
      onClick={() => {
        navigate({
          to: "/map",
        })
        // HACK: force this for avoid bugs
        setMenuVisible(true)
      }}
      secondary={{ onClick: () => router.history.back(), title: "Try again" }}
      title="Final"
    >
      <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 flex w-full flex-col items-center">
        <Icon className="mb-5 block h-36 w-36 text-transparent" name="Error" />
        <h1 className="mb-2 font-semibold text-title-2">Transaction Error</h1>
        <div className={"max-w-[300px] text-center text-base text-text-secondary leading-snug"}>
          Some kind of error occurred during the transaction. You still have the funds
        </div>
      </div>
    </ShowMainButton>
  )
}
