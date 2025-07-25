import { showMenuAtom } from "@/atoms/ui"
import { ShowMainButton } from "@/components/tg-internals"
import { Icon } from "@point/ui/icon"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useSetAtom } from "jotai"

export const Route = createFileRoute("/tips/$placeId/error")({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const router = useRouter()
  const setMenuVisible = useSetAtom(showMenuAtom)

  return (
    <ShowMainButton
      title="Final"
      onClick={() => {
        navigate({
          to: "/map",
        })
        // HACK: force this for avoid bugs
        setMenuVisible(true)
      }}
      secondary={{ title: "Try again", onClick: () => router.history.back() }}
    >
      <div className=" -translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 flex w-full flex-col items-center">
        <Icon name="Error" className="mb-5 block h-36 w-36 text-transparent" />
        <h1 className="mb-2 font-semibold text-title-2">Transaction Error</h1>
        <div className={" max-w-[300px] text-center text-base text-text-secondary leading-snug"}>
          Some kind of error occurred during the transaction. You still have the funds
        </div>
      </div>
    </ShowMainButton>
  )
}
