/** Figma inactive category chip circle (node 1:2098). */
export const ESTABLISHMENT_BADGE_DIMMED_FILL = "#8d969d"

const CACHE_VERSION = "v2"

const dimmedSvgByUrl = new Map<string, string>()

/** Background circle geometry shared by establishment type badge SVGs from API. */
const BADGE_CIRCLE_D = "M40 20C40"

/**
 * API badges: colored circle path + white glyph strokes/fills.
 * Must not touch root `<svg fill="none">` or glyph `fill="white"`.
 */
export function replaceEstablishmentBadgeBackgroundFill(svg: string, fill: string): string {
  const circlePathFillAfterD = new RegExp(`(<path\\s+d="${BADGE_CIRCLE_D}[^"]*"\\s+fill=")[^"]+(")`, "i")
  if (circlePathFillAfterD.test(svg)) {
    return svg.replace(circlePathFillAfterD, `$1${fill}$2`)
  }

  const circlePathFillBeforeD = new RegExp(`(<path\\s+fill=")[^"]+("\\s+d="${BADGE_CIRCLE_D}[^"]*")`, "i")
  if (circlePathFillBeforeD.test(svg)) {
    return svg.replace(circlePathFillBeforeD, `$1${fill}$2`)
  }

  const circleElement = /(<circle\b[^>]*\sfill=")[^"]+(")/i
  if (circleElement.test(svg)) {
    return svg.replace(circleElement, `$1${fill}$2`)
  }

  return svg
}

function cacheKey(url: string): string {
  return `${CACHE_VERSION}:${url}`
}

export function getCachedDimmedBadgeSvg(url: string): string | undefined {
  return dimmedSvgByUrl.get(cacheKey(url))
}

export function dimmedBadgeSvgToSrc(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export async function loadDimmedEstablishmentBadgeSvg(url: string): Promise<string | null> {
  const key = cacheKey(url)
  const cached = dimmedSvgByUrl.get(key)
  if (cached) {
    return cached
  }

  const response = await fetch(url)
  if (!response.ok) {
    return null
  }

  const raw = await response.text()
  if (!raw.includes("<svg")) {
    return null
  }

  const dimmed = replaceEstablishmentBadgeBackgroundFill(raw, ESTABLISHMENT_BADGE_DIMMED_FILL)
  dimmedSvgByUrl.set(key, dimmed)
  return dimmed
}
