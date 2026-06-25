import { cn } from "@point/ui/cn"

interface EntityListCardProps {
  title: string
  subtitle: string
  meta?: string
  badge?: string
  onClick?: () => void
}

export function EntityListCard({ title, subtitle, meta, badge, onClick }: EntityListCardProps) {
  return (
    <button
      className={cn(
        "w-full rounded-2xl bg-background-secondary px-4 py-3 text-left",
        onClick && "active:bg-background-secondary/80"
      )}
      onClick={onClick}
      type="button"
    >
      <div className="mb-1 flex items-start justify-between gap-2">
        <div className="line-clamp-1 font-medium text-base text-text">{title}</div>
        {badge ? <span className="rounded-full bg-accent/10 px-2 py-1 text-accent text-caption-2">{badge}</span> : null}
      </div>
      <div className="line-clamp-2 text-caption-1 text-text-secondary">{subtitle}</div>
      {meta ? <div className="mt-2 text-caption-2 text-text-secondary">{meta}</div> : null}
    </button>
  )
}
