interface EmptyStateCardProps {
  title: string
  description: string
  actionLabel?: string
  onActionClick?: () => void
}

export function EmptyStateCard({ title, description, actionLabel, onActionClick }: EmptyStateCardProps) {
  return (
    <div className="rounded-2xl bg-background-secondary px-4 py-6 text-center">
      <h2 className="font-medium text-base text-text">{title}</h2>
      <p className="mt-2 text-caption-1 text-text-secondary">{description}</p>
      {actionLabel && onActionClick ? (
        <button
          className="mt-4 rounded-xl bg-accent px-4 py-2 text-caption-1 text-white"
          onClick={onActionClick}
          type="button"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}
