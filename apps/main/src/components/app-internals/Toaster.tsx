import type { DefaultToastOptions } from "react-hot-toast"

import { useSignal, viewport } from "@telegram-apps/sdk-react"
import { memo, useMemo } from "react"
import { Toaster } from "react-hot-toast"

import { cn } from "@point/ui/cn"

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
    className: cn("!text-headline !shadow-elevation3 !rounded-2xl !bg-[#2D2D2E] !px-4 !py-2 !font-medium !text-white"),
    duration: 2000,
    error: {
      className: cn("!bg-accent !text-headline !shadow-elevation3 !rounded-2xl !px-4 !py-2 !font-medium !text-white"),
      duration: 5000,
    },
  }

  return <Toaster containerStyle={tgSpacesStyle} toastOptions={toastOptions} />
})

StyledToaster.displayName = "StyledToaster"
