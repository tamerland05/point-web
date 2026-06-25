/**
 * ADR-002 unified menu product DTO (Wave 1 baseline).
 * Map (`MenuItem`) and QR (`PosMenuProduct`) adapters normalize into this shape.
 * Presentation differs per surface; price/availability source of truth is iiko/POS.
 */
export interface MenuProductDTO {
  id: string
  name: string
  description?: string
  priceAmount?: number
  priceCurrency?: string
  imageUrl?: string
  isAvailable: boolean
  weightGrams?: number
  energyKcal?: number
  categoryName?: string
  establishmentId?: string
  establishmentName?: string
}

export interface MenuProductPresentationContext {
  surface: "map" | "qr"
  establishmentId?: string
  tableLinkId?: string
}

/** Normalize legacy map menu item fields into unified DTO. */
export function mapMenuItemToProductDTO(input: {
  id: string
  title: string
  description?: string | null
  photo?: string | null
  cost?: { amount?: number; currency?: string }
  category?: string | null
  establishmentId?: string
  establishmentName?: string
}): MenuProductDTO {
  return {
    categoryName: input.category ?? undefined,
    description: input.description ?? undefined,
    establishmentId: input.establishmentId,
    establishmentName: input.establishmentName,
    id: input.id,
    imageUrl: input.photo ?? undefined,
    isAvailable: true,
    name: input.title,
    priceAmount: input.cost?.amount,
    priceCurrency: input.cost?.currency,
  }
}

/** Normalize POS menu product into unified DTO. */
export function posMenuProductToDTO(
  input: {
    id: string
    name: string
    description?: string
    image_links?: string[]
    is_stopped: boolean
    weight?: number
    energy_amount?: number
    size_prices?: { price?: { current_price?: number } }[]
  },
  ctx: { categoryName?: string; currency?: string; establishmentId?: string; establishmentName?: string }
): MenuProductDTO {
  const price = input.size_prices?.[0]?.price?.current_price
  return {
    categoryName: ctx.categoryName,
    description: input.description,
    energyKcal: input.energy_amount,
    establishmentId: ctx.establishmentId,
    establishmentName: ctx.establishmentName,
    id: input.id,
    imageUrl: input.image_links?.find((u) => u?.trim()),
    isAvailable: !input.is_stopped,
    name: input.name,
    priceAmount: price,
    priceCurrency: ctx.currency,
    weightGrams: input.weight,
  }
}
