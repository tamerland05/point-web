import { useTranslation } from "@point/i18n"
import { useRouter } from "@tanstack/react-router"

// мы не смогли найти что вы искали и кнопки обновить (попробоавать еще раз) и назад (вернуться назад)
export const ErrorPage = () => {
  const { t } = useTranslation()
  const router = useRouter()

  const handleRefresh = () => {
    router.invalidate()
  }

  const handleBack = () => {
    router.history.back()
  }

  return (
    <div className="m-4 flex h-screen flex-col items-center justify-center">
      <div className="text-title-2">{t("error.title")}</div>
      <div className="text-caption-1">{t("error.description")}</div>
      <div className="mt-auto flex gap-2">
        <button type="button" className="rounded-xl bg-accent p-4 text-caption-1 text-white" onClick={handleRefresh}>
          {t("error.refresh")}
        </button>
        <button type="button" className="rounded-xl bg-background-secondary p-4 text-caption-1" onClick={handleBack}>
          {t("error.back")}
        </button>
      </div>
    </div>
  )
}
