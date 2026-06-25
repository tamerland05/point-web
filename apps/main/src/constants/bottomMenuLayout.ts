/**
 * Figma bottom menu layout (Карта `1:1358` / `1:1612`, Аккаунт `1:3809` / `1:3811`).
 * Frame 852×393; pill `Frame 1682` h=80; gap 4px; home indicator h=34.
 */

/** Distance from screen bottom to menu pill bottom edge (4 + 34 = 38px). */
export const BOTTOM_MENU_INSET_FROM_BOTTOM_PX = 38

/** Gap between menu pill and home indicator. */
export const BOTTOM_MENU_GAP_ABOVE_HOME_INDICATOR_PX = 4

/** Menu pill height. */
export const BOTTOM_MENU_PILL_HEIGHT_PX = 80

/** Scroll padding: pill + inset (80 + 38 = 118px). */
export const BOTTOM_MENU_SCROLL_PADDING_PX = 118

/** Reference only: 38 / 852 × 100. */
export const BOTTOM_MENU_INSET_FROM_BOTTOM_PERCENT = 4.46

/** Reference only: 118 / 852 × 100. */
export const BOTTOM_MENU_SCROLL_PADDING_PERCENT = 13.85

/** @internal Tailwind class — must be a static string literal for JIT. */
export const BOTTOM_MENU_INSET_CLASS = "bottom-[max(38px,calc(env(safe-area-inset-bottom)+4px))]" as const

/** @internal Tailwind class — must be a static string literal for JIT. */
export const BOTTOM_MENU_SCROLL_PADDING_CLASS = "pb-[118px]" as const
