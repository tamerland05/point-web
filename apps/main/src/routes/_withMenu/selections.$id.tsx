import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

import { useTranslation } from "@point/i18n"
import { wallSelectionDetailQueryOptions } from "@point/shared/api/point/wall"

import { EmptyStateCard } from "@/components/wave1/EmptyStateCard"
import { EntityListCard } from "@/components/wave1/EntityListCard"

export const Route = createFileRoute("/_withMenu/selections/$id")({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  const navigate = Route.useNavigate()
  const id = Route.useParams().id
  const query = useSuspenseQuery(wallSelectionDetailQueryOptions(id))

  const cards = query.data.sections.flatMap((section) => section.cards)

  return (
    <div className="space-y-3 pb-4">
      <h1 className="font-semibold text-title-2">
        {t("WAVE1.SELECTIONS.DETAIL_TITLE_PREFIX")}
        {id}
      </h1>
      {cards.length === 0 ? (
        <EmptyStateCard
          description={t("WAVE1.SELECTIONS.DETAIL_EMPTY_DESC")}
          title={t("WAVE1.SELECTIONS.DETAIL_EMPTY_TITLE")}
        />
      ) : (
        cards.map((card) => (
          <EntityListCard
            badge={card.tag}
            key={`${id}-${card.id}`}
            meta={`${t("WAVE1.SELECTIONS.RATING_PREFIX")} ${card.rating.toFixed(1)}`}
            onClick={() => {
              if (card.establishmentId) {
                void navigate({ params: { id: card.establishmentId }, to: "/menu/$id" })
              }
            }}
            subtitle={card.subtitle}
            title={card.title}
          />
        ))
      )}
    </div>
  )
}
