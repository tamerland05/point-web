interface BookingFormBlockProps {
  label: string
  value: string
  onChange: (next: string) => void
  placeholder: string
}

export function BookingFormBlock({ label, value, onChange, placeholder }: BookingFormBlockProps) {
  return (
    <label className="flex flex-col gap-2 rounded-2xl bg-background-secondary p-4">
      <span className="text-caption-1 text-text-secondary">{label}</span>
      <input
        className="rounded-xl bg-background px-3 py-2 text-base text-text placeholder:text-text-secondary/70 focus:outline-none"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </label>
  )
}
