import { useNavigate } from "@tanstack/react-router"

export function PosSessionClosed() {
  const navigate = useNavigate()

  const goHome = () => {
    void navigate({ replace: true, to: "/account" })
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 py-16 text-center [view-transition-name:main-content]">
      <div>
        <h2 className="font-semibold text-text text-title-2">Стол закрыт</h2>
        <p className="mt-3 text-caption-1 text-text-secondary leading-relaxed">
          Сессия в ресторане завершена. Чтобы заказать снова, отсканируйте QR-код на столе.
        </p>
      </div>
      <button className="rounded-2xl bg-accent px-8 py-4 font-semibold text-white" onClick={goHome} type="button">
        На главную
      </button>
    </div>
  )
}
