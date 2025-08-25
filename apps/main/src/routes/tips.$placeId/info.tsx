import { createFileRoute } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { useCallback, useMemo } from "react"
import z from "zod"

import { Icon } from "@point/ui/icon"

import { ShowMainButton } from "@/components/tg-internals"

const infoSchema = z.object({
  id: z.string().or(z.number()).optional(),
  placeWallet: z.string().optional(),
})

export const Route = createFileRoute("/tips/$placeId/info")({
  component: RouteComponent,
  validateSearch: zodValidator(infoSchema),
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { placeWallet, id } = Route.useSearch()

  if (!placeWallet && !id) {
    throw new Error("placeWallet or id is required")
  }

  const isPlaceWalletMode = !!placeWallet

  const handleContinueClick = useCallback(() => {
    if (isPlaceWalletMode) {
      navigate({ search: { recipient: placeWallet }, to: "/tips/$placeId/assets" })
      return
    }

    if (!id) {
      throw new Error("id is required")
    }

    navigate({ search: { id }, to: "/tips/$placeId/profile" })
  }, [navigate, id, isPlaceWalletMode, placeWallet])

  const mainButtonConfig = useMemo(
    () => ({
      disabled: false,
      loading: false,
      onClick: handleContinueClick,
      title: "Continue",
    }),
    [handleContinueClick]
  )

  return (
    <ShowMainButton {...mainButtonConfig}>
      <div className="mt-[20vh] flex w-full flex-col items-center justify-center">
        <Icon className="h-43 w-43 text-accent" name={isPlaceWalletMode ? "Frame 951 (1)" : "Frame 951"} />
        <div className="m-8 flex flex-col gap-1 text-center">
          <h1 className="font-semibold text-title-2">{isPlaceWalletMode ? "Project Bank" : "Fair Distribution"}</h1>
          <p className="font-normal text-text-secondary">
            {isPlaceWalletMode
              ? "Funds are automatically distributed evenly among all employees of the establishment"
              : "Funds are automatically distributed to the employee, project and our bank wallets"}
          </p>
        </div>
      </div>
    </ShowMainButton>
  )
}
