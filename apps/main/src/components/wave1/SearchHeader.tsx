import { Input } from "@point/ui/input"

interface SearchHeaderProps {
  title: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  actionLabel?: string
  onActionClick?: () => void
}

export function SearchHeader({ title, placeholder, value, onChange, actionLabel, onActionClick }: SearchHeaderProps) {
  return (
    <header className="mb-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-semibold text-title-2">{title}</h1>
        {actionLabel && onActionClick ? (
          <button
            className="rounded-xl bg-background-secondary px-3 py-2 text-caption-1 text-text"
            onClick={onActionClick}
            type="button"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
      <Input onChange={onChange} placeholder={placeholder} value={value} />
    </header>
  )
}
