import { showMenuAtom } from "@/atoms/ui"
import { isAxiosError } from "@point/shared/utils/isAxiosError"
import { cn } from "@point/ui/cn"
import { useRouter } from "@tanstack/react-router"
import { hapticFeedback } from "@telegram-apps/sdk-react"
import { useSetAtom } from "jotai"

export const ErrorPage = ({ error }: { error?: Error }) => {
  const setMenuVisible = useSetAtom(showMenuAtom)

  // biome-ignore lint/suspicious/noConsole: its important to log errors here
  console.error(error)
  const router = useRouter()

  const handleRefresh = () => {
    hapticFeedback.impactOccurred("light")
    router.invalidate()
  }

  const handleBack = () => {
    hapticFeedback.impactOccurred("light")
    router.navigate({ to: "/", replace: true })
    setMenuVisible(true)
  }

  const isAxiosErrorProvided = isAxiosError(error)

  return (
    <div
      className={cn(
        "flex min-h-full flex-col items-center justify-center bg-background p-5 text-center font-sans text-text"
      )}
    >
      <div className=" -translate-x-1/2 -translate-y-1/2 justify-cente absolute top-1/2 left-1/2 flex w-full flex-col items-center">
        <img alt="Telegram sticker" src="/not-found.webp" className="mb-5 block h-36 w-36" />
        <h1 className="mb-2 font-semibold text-title-2">
          {isAxiosErrorProvided
            ? `${error.response?.statusText} [${error.response?.status}]`
            : error?.name || "Technical Problems"}
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
              "Oops! There were technical problems. We are solving the problem."
            : error?.message || "Oops! There were technical problems. We are solving the problem."}
        </pre>
      </div>

      <div className="mt-auto flex gap-2">
        <button type="button" className="rounded-xl bg-accent p-4 text-caption-1 text-white" onClick={handleRefresh}>
          Refresh
        </button>
        <button type="button" className="rounded-xl bg-background-secondary p-4 text-caption-1" onClick={handleBack}>
          Home
        </button>
      </div>
    </div>
  )
}
