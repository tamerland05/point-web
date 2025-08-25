import { useNavigate } from "@tanstack/react-router"
import { openTelegramLink } from "@telegram-apps/sdk-react"
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react"
import { useCallback, useEffect, useMemo } from "react"

import { Icon } from "@point/ui/icon"

import { ShowMainButton } from "../tg-internals"

export const ConnectWalletStep = () => {
  const [tc] = useTonConnectUI()
  const address = useTonAddress()
  const navigate = useNavigate()

  // biome-ignore lint/correctness/useExhaustiveDependencies: not needed
  useEffect(() => {
    if (address) {
      void navigate({ to: "/account/profile-created" })
    }
  }, [address])

  const handleConnectWallet = useCallback(async () => {
    await tc.modal.open()
  }, [tc.modal.open])

  const mainButtonConfig = useMemo(() => {
    return {
      disabled: false,
      hidden: false,
      loading: false,
      onClick: handleConnectWallet,
      title: "Connect Wallet",
    }
  }, [handleConnectWallet])

  const secondaryButtonConfig = useMemo(
    () => ({
      // TODO: if user.employee -  hide
      hidden: false,
      onClick: () => openTelegramLink("https://t.me/samvuoto?text=`ICANTUSEWALLET2025`"),
      position: "bottom" as const,
      title: "Detailed Manual",
    }),
    []
  )

  return (
    <ShowMainButton secondary={secondaryButtonConfig} {...mainButtonConfig}>
      <div className={"-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 w-full bg-background px-18 py-6"}>
        <div className="flex flex-col items-center bg-background">
          <Icon className="mb-10 size-24 text-transparent" name={"User"} />
          <h1 className="mb-1 text-center font-semibold text-title-2">Connect Wallet</h1>
          <p className="text-center text-base text-text-secondary">
            Connect your TON wallet, which will receive your clients' tips
          </p>
        </div>
      </div>
    </ShowMainButton>
  )
}
