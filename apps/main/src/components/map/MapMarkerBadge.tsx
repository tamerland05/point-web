import { cn } from "@point/ui/cn"

function resolveMarkerLabelColor(colorCode?: string | null): string | undefined {
  if (!colorCode) {
    return undefined
  }

  if (colorCode.startsWith("#")) {
    return colorCode
  }

  const match = colorCode.match(/#([0-9a-fA-F]{3,8})/)
  return match ? `#${match[1]}` : undefined
}

interface MapMarkerBadgeProps {
  colorCode?: string | null
  dimmed?: boolean
  icon: string
  label: string
}

export function MapMarkerBadge({ colorCode, dimmed = false, icon, label }: MapMarkerBadgeProps) {
  const labelColor = dimmed ? undefined : resolveMarkerLabelColor(colorCode)

  return (
    <div className={cn("flex w-20 flex-col items-center gap-0.5", dimmed && "opacity-60 grayscale")}>
      <img alt="" className="size-[30px] object-contain" src={icon} />
      <p
        className={cn(
          "text-center font-medium text-[13px] leading-none tracking-[0.2px]",
          dimmed ? "text-[#8d969d]" : !labelColor && "text-[#222222]"
        )}
        style={labelColor ? { color: labelColor } : undefined}
      >
        {label}
      </p>
    </div>
  )
}
