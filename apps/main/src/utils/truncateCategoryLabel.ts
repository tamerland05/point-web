/** Figma map category chips: max 8 chars; longer labels → 6 chars + "...". */
export function truncateCategoryLabel(label: string): string {
  if (label.length <= 8) {
    return label
  }

  return `${label.slice(0, 6)}...`
}
