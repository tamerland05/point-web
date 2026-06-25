import type { PosMenuCategory, PosMenuProduct } from "@point/shared/api/point/posTable"

export const POPULAR_TAB_ID = "__popular__"

export function filterMenuCategoriesByQuery(categories: PosMenuCategory[], query: string): PosMenuCategory[] {
  const needle = query.trim().toLowerCase()
  if (!needle) {
    return categories
  }

  const walk = (cat: PosMenuCategory): PosMenuCategory | null => {
    const nested = (cat.categories ?? []).map(walk).filter((c): c is PosMenuCategory => c !== null)
    const items = cat.items.filter((it) => it.name.toLowerCase().includes(needle))
    if (items.length === 0 && nested.length === 0) {
      return null
    }
    return { ...cat, categories: nested, items }
  }

  return categories.map(walk).filter((c): c is PosMenuCategory => c !== null)
}

export function flattenCategoryItems(categories: PosMenuCategory[]): PosMenuProduct[] {
  const out: PosMenuProduct[] = []
  const seen = new Set<string>()
  const walk = (nodes: PosMenuCategory[]) => {
    for (const cat of nodes) {
      for (const item of cat.items) {
        if (!seen.has(item.id)) {
          seen.add(item.id)
          out.push(item)
        }
      }
      if (cat.categories?.length) {
        walk(cat.categories)
      }
    }
  }
  walk(categories)
  return out
}

export interface MenuTabOption {
  id: string
  label: string
}

export function buildMenuTabs(categories: PosMenuCategory[], popularLabel: string): MenuTabOption[] {
  const tabs: MenuTabOption[] = [{ id: POPULAR_TAB_ID, label: popularLabel }]
  for (const cat of categories.slice(0, 8)) {
    if (cat.name.trim()) {
      tabs.push({ id: cat.id, label: cat.name })
    }
  }
  return tabs
}

export function itemsForActiveTab(
  categories: PosMenuCategory[],
  activeTabId: string
): { sectionTitle?: string; items: PosMenuProduct[] }[] {
  if (activeTabId === POPULAR_TAB_ID) {
    return [{ items: flattenCategoryItems(categories).slice(0, 12) }]
  }

  const findCategory = (nodes: PosMenuCategory[]): PosMenuCategory | undefined => {
    for (const cat of nodes) {
      if (cat.id === activeTabId) {
        return cat
      }
      const nested = findCategory(cat.categories ?? [])
      if (nested) {
        return nested
      }
    }
    return undefined
  }

  const cat = findCategory(categories)
  if (!cat) {
    return [{ items: flattenCategoryItems(categories).slice(0, 12) }]
  }

  return [{ items: cat.items, sectionTitle: cat.name }]
}

export function productImageUrl(product: PosMenuProduct): string | undefined {
  return product.image_links?.find((url) => url?.trim())?.trim()
}

export function productHasImage(product: PosMenuProduct): boolean {
  return Boolean(productImageUrl(product))
}

export function formatProductMeta(product: PosMenuProduct): string {
  const parts: string[] = []
  const weight = product.weight
  if (weight != null && weight > 0) {
    parts.push(`${Math.round(weight)} г`)
  }
  const energy = product.energy_amount
  if (energy != null && energy > 0) {
    parts.push(`${Math.round(energy)} ккал`)
  }
  return parts.length > 0 ? parts.join(" · ") : "—"
}

export function partitionMenuItems(
  items: PosMenuProduct[],
  layout: "grid" | "list"
): { gridItems: PosMenuProduct[]; listItems: PosMenuProduct[] } {
  if (layout === "list") {
    return { gridItems: [], listItems: items }
  }
  const gridItems: PosMenuProduct[] = []
  const listItems: PosMenuProduct[] = []
  for (const item of items) {
    if (productHasImage(item)) {
      gridItems.push(item)
    } else {
      listItems.push(item)
    }
  }
  return { gridItems, listItems }
}
