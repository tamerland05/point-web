import type { DefaultToastOptions } from "react-hot-toast"

import { memo, useMemo } from "react"
import { Toaster } from "react-hot-toast"

import { cn } from "@point/ui/cn"
import { viewport } from "@telegram-apps/sdk-react"
import { useSignal } from "@telegram-apps/sdk-react"

export const StyledToaster = memo(() => {
  const inset = useSignal(viewport.safeAreaInsets)
  const contentInset = useSignal(viewport.contentSafeAreaInsets)

  const tgSpacesStyle = useMemo(
    () => ({
      marginTop: inset.top + contentInset.top,
    }),
    [inset, contentInset]
  )

  const toastOptions: DefaultToastOptions = {
    duration: 2000,
    className: cn("!text-headline !shadow-elevation3 !rounded-2xl !bg-[#2D2D2E] !px-4 !py-2 !font-medium !text-white"),
    error: {
      duration: 5000,
      className: cn("!bg-accent !text-headline !shadow-elevation3 !rounded-2xl !px-4 !py-2 !font-medium !text-white"),
    },
  }

  return <Toaster containerStyle={tgSpacesStyle} toastOptions={toastOptions} />
})

StyledToaster.displayName = "StyledToaster"
