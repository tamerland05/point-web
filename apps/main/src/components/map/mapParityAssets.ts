export const mapParityAssets = {
  topBackdrop: "/parity/map/top-backdrop.png",
} as const

export function resolveMapParityBackdrop() {
  return mapParityAssets.topBackdrop
}
