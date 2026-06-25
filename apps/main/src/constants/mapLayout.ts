/** Map controls bottom edge: fixed 48% from viewport bottom (all nearby states). */
export const MAP_CONTROLS_BOTTOM_OFFSET = "48%"

/** Default (middle) nearby sheet height from bottom of viewport (Figma 1:1358 ≈ 45%). */
export const MAP_NEARBY_DEFAULT_HEIGHT_DVH = 45

/** Low nearby sheet height from bottom of viewport (Figma 1:3060 ≈ 25%). */
export const MAP_NEARBY_LOW_HEIGHT_DVH = 25

/** Tailwind hook on Drawer root; keep in sync with MAP_NEARBY_DEFAULT_HEIGHT_DVH. */
export const MAP_NEARBY_DEFAULT_DRAWER_PANEL_CLASS = "[&_[role=presentation]]:!h-[45dvh]" as const

/** Tailwind hook on Drawer root; keep in sync with MAP_NEARBY_LOW_HEIGHT_DVH. */
export const MAP_NEARBY_LOW_DRAWER_PANEL_CLASS = "[&_[role=presentation]]:!h-[25dvh]" as const

/** @deprecated Use MAP_NEARBY_DEFAULT_HEIGHT_DVH */
export const MAP_NEARBY_DEFAULT_HEIGHT_PERCENT = MAP_NEARBY_DEFAULT_HEIGHT_DVH

/** Extra gap below Telegram content safe area when nearby list is swipe-expanded. */
export const MAP_NEARBY_EXPANDED_EXTRA_TOP_GAP_PX = 24

/** Extra top gap in search mode (Figma 1:2852 content inset; same as swipe-expanded). */
export const MAP_NEARBY_SEARCH_TOP_GAP_PX = 24

/** Max visible characters for nearby list address before ellipsis (Figma 1:3694). */
export const MAP_NEARBY_ADDRESS_MAX_LENGTH = 22

export function truncateMapAddress(address: string, maxLength = MAP_NEARBY_ADDRESS_MAX_LENGTH): string {
  if (address.length <= maxLength) {
    return address
  }

  return `${address.slice(0, maxLength)}...`
}
