import { useRouter } from "@tanstack/react-router"
import { hapticFeedback } from "@telegram-apps/sdk-react"
import { useSetAtom } from "jotai"

import { useTranslation } from "@point/i18n"
import { isAxiosError } from "@point/shared/utils/isAxiosError"
import { cn } from "@point/ui/cn"

import { showMenuAtom } from "@/atoms/ui"

export const ErrorPage = ({ error }: { error?: Error }) => {
  const setMenuVisible = useSetAtom(showMenuAtom)
  const { t } = useTranslation()

  console.error(error)
  const router = useRouter()

  const handleRefresh = () => {
    hapticFeedback.impactOccurred("light")
    router.invalidate()
  }

  const handleBack = () => {
    hapticFeedback.impactOccurred("light")
    router.navigate({ replace: true, to: "/" })
    setMenuVisible(true)
  }

  const isAxiosErrorProvided = isAxiosError(error)

  return (
    <div
      className={cn(
        "flex min-h-full flex-col items-center justify-center bg-background p-5 text-center font-sans text-text"
      )}
    >
      <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 flex w-full max-w-[360px] flex-col items-center">
        <img alt={t("SYSTEM.STICKER_ALT")} className="mb-5 block h-36 w-36" src="/not-found.webp" />
        <h1 className="mb-2 font-semibold text-title-2">
          {isAxiosErrorProvided
            ? `${error.response?.statusText} [${error.response?.status}]`
            : error?.name || t("UI.TECHNICAL_PROBLEMS")}
        </h1>
        <pre
          className={cn(
            "max-h-[200px] max-w-[300px] overflow-y-auto whitespace-pre-wrap text-left text-base text-text-secondary leading-snug"
          )}
        >
          {isAxiosErrorProvided
            ? // @ts-expect-error it can be here
              error.response?.data?.message ||
              JSON.stringify(error.response?.data, null, 2) ||
              t("UI.TECHNICAL_PROBLEMS_DESCRIPTION")
            : error?.message || t("UI.TECHNICAL_PROBLEMS_DESCRIPTION")}
        </pre>
      </div>

      <div className="mt-auto flex w-full gap-2">
        <button
          className="flex-1 rounded-2xl bg-accent py-3 font-medium text-caption-1 text-white"
          onClick={handleRefresh}
          type="button"
        >
          {t("UI.REFRESH")}
        </button>
        <button
          className="flex-1 rounded-2xl bg-background-secondary py-3 font-medium text-caption-1"
          onClick={handleBack}
          type="button"
        >
          {t("UI.HOME")}
        </button>
      </div>
    </div>
  )
}
