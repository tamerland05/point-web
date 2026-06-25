import { useEffect, useState } from "react"

import { cn } from "@point/ui/cn"

import {
  dimmedBadgeSvgToSrc,
  ESTABLISHMENT_BADGE_DIMMED_FILL,
  getCachedDimmedBadgeSvg,
  loadDimmedEstablishmentBadgeSvg,
} from "@/components/map/establishmentTypeBadge"

/** Parity capture glyphs only — not used for live API category icons. */
export function isParityGlyphIcon(src: string | undefined): boolean {
  return Boolean(src?.startsWith("/parity/"))
}

const CHIP_GLYPH_CLASS = "h-8 w-8 object-contain"

interface EstablishmentTypeIconProps {
  className?: string
  dimmed?: boolean
  icon?: string
  tone?: string
}

function DimmedApiBadge({ className, icon }: { className: string; icon: string }) {
  const [src, setSrc] = useState<string | null>(() => {
    const cached = getCachedDimmedBadgeSvg(icon)
    return cached ? dimmedBadgeSvgToSrc(cached) : null
  })

  useEffect(() => {
    const cached = getCachedDimmedBadgeSvg(icon)
    if (cached) {
      setSrc(dimmedBadgeSvgToSrc(cached))
      return
    }

    let cancelled = false

    void loadDimmedEstablishmentBadgeSvg(icon).then((markup) => {
      if (!cancelled && markup) {
        setSrc(dimmedBadgeSvgToSrc(markup))
      }
    })

    return () => {
      cancelled = true
    }
  }, [icon])

  if (!src) {
    return (
      <div className={cn("rounded-full", className)} style={{ backgroundColor: ESTABLISHMENT_BADGE_DIMMED_FILL }} />
    )
  }

  return <img alt="" className={cn("rounded-full object-cover", className)} src={src} />
}

export function EstablishmentTypeIcon({ className, dimmed = false, icon, tone }: EstablishmentTypeIconProps) {
  const boxClass = cn("h-11 w-11 shrink-0", className)

  if (icon && !isParityGlyphIcon(icon)) {
    if (dimmed) {
      return <DimmedApiBadge className={boxClass} icon={icon} />
    }

    return <img alt="" className={cn(boxClass, "rounded-full object-cover")} src={icon} />
  }

  if (dimmed) {
    return (
      <div
        className={cn("flex items-center justify-center rounded-full", boxClass)}
        style={{ backgroundColor: ESTABLISHMENT_BADGE_DIMMED_FILL }}
      >
        {icon ? <img alt="" className={CHIP_GLYPH_CLASS} src={icon} /> : null}
      </div>
    )
  }

  const isHexTone = tone?.startsWith("#")

  return (
    <div
      className={cn("flex items-center justify-center rounded-full", boxClass, !isHexTone && tone)}
      style={isHexTone ? { backgroundColor: tone } : undefined}
    >
      {icon ? <img alt="" className={CHIP_GLYPH_CLASS} src={icon} /> : null}
    </div>
  )
}
