import type { AxiosResponse } from "axios"

import { queryOptions } from "@tanstack/react-query"

import pointAxiosInstance from "@/api/point"
import { ensureAccessTokenIsAvailable } from "@/utils/ensureAccessTokenIsAvailable"

export type WallTabId = "popular" | "new" | "beautiful" | "media"

export interface WallCardDTO {
  id: string
  title: string
  subtitle: string
  tag: string
  rating: number
  imageUrl: string
  establishmentId: string | null
  distanceLabel?: string | null
  travelTimeLabel?: string | null
}

export interface WallSectionDTO {
  id: string
  title: string
  cards: WallCardDTO[]
}

export interface WallFeedDTO {
  tab: WallTabId
  sections: WallSectionDTO[]
}

export interface WallPromoDTO {
  id: string
  title: string
  subtitle: string
  priceLabel: string
  imageUrl: string
  establishmentId: string | null
}

function normalizeWallCard(raw: unknown, fallbackId: string): WallCardDTO | null {
  if (!raw || typeof raw !== "object") {
    return null
  }

  const card = raw as Record<string, unknown>
  const title = typeof card["title"] === "string" ? card["title"].trim() : ""
  if (!title) {
    return null
  }

  const establishmentIdRaw = card["establishmentId"] ?? card["establishment_id"]
  const distanceLabelRaw = card["distanceLabel"] ?? card["distance_label"]
  const travelTimeLabelRaw = card["travelTimeLabel"] ?? card["travel_time_label"]
  const imageUrlRaw = card["imageUrl"] ?? card["image_url"]

  return {
    distanceLabel: typeof distanceLabelRaw === "string" ? distanceLabelRaw : null,
    establishmentId:
      typeof establishmentIdRaw === "string" && establishmentIdRaw.trim().length > 0 ? establishmentIdRaw : null,
    id: typeof card["id"] === "string" ? card["id"] : fallbackId,
    imageUrl: typeof imageUrlRaw === "string" ? imageUrlRaw : "",
    rating: typeof card["rating"] === "number" && Number.isFinite(card["rating"]) ? card["rating"] : 0,
    subtitle: typeof card["subtitle"] === "string" ? card["subtitle"] : "",
    tag: typeof card["tag"] === "string" ? card["tag"] : "",
    title,
    travelTimeLabel: typeof travelTimeLabelRaw === "string" ? travelTimeLabelRaw : null,
  }
}

function normalizeWallFeed(raw: unknown, tab: WallTabId): WallFeedDTO {
  if (!raw || typeof raw !== "object") {
    return { sections: [], tab }
  }

  const payload = raw as { sections?: unknown[]; tab?: unknown }
  const sectionsRaw = Array.isArray(payload.sections) ? payload.sections : []

  const sections = sectionsRaw
    .map((sectionRaw, sectionIdx) => {
      if (!sectionRaw || typeof sectionRaw !== "object") {
        return null
      }

      const section = sectionRaw as Record<string, unknown>
      const cardsRaw = Array.isArray(section["cards"]) ? section["cards"] : []
      const cards = cardsRaw
        .map((cardRaw, cardIdx) => normalizeWallCard(cardRaw, `${tab}-${sectionIdx}-${cardIdx}`))
        .filter((card): card is WallCardDTO => card !== null)

      if (!cards.length) {
        return null
      }

      return {
        cards,
        id: typeof section["id"] === "string" ? section["id"] : `${tab}-section-${sectionIdx}`,
        title: typeof section["title"] === "string" ? section["title"] : `Подборка ${sectionIdx + 1}`,
      } satisfies WallSectionDTO
    })
    .filter((section): section is WallSectionDTO => section !== null)

  const resolvedTab =
    payload.tab === "popular" || payload.tab === "new" || payload.tab === "beautiful" || payload.tab === "media"
      ? payload.tab
      : tab

  return { sections, tab: resolvedTab }
}

function normalizeWallCards(raw: unknown): WallCardDTO[] {
  if (!raw || typeof raw !== "object") {
    return []
  }

  const payload = raw as { cards?: unknown[] }
  if (!Array.isArray(payload.cards)) {
    return []
  }

  return payload.cards
    .map((cardRaw, index) => normalizeWallCard(cardRaw, `wall-card-${index}`))
    .filter((card): card is WallCardDTO => card !== null)
}

function normalizeWallPromos(raw: unknown): WallPromoDTO[] {
  if (!raw || typeof raw !== "object") {
    return []
  }

  const payload = raw as { items?: unknown[] }
  if (!Array.isArray(payload.items)) {
    return []
  }

  return payload.items
    .map((itemRaw, index) => {
      if (!itemRaw || typeof itemRaw !== "object") {
        return null
      }

      const item = itemRaw as Record<string, unknown>
      const title = typeof item["title"] === "string" ? item["title"].trim() : ""
      if (!title) {
        return null
      }

      const establishmentIdRaw = item["establishmentId"] ?? item["establishment_id"]
      const imageUrlRaw = item["imageUrl"] ?? item["image_url"]
      const priceLabelRaw = item["priceLabel"] ?? item["price_label"]

      return {
        establishmentId:
          typeof establishmentIdRaw === "string" && establishmentIdRaw.trim().length > 0 ? establishmentIdRaw : null,
        id: typeof item["id"] === "string" ? item["id"] : `promo-${index}`,
        imageUrl: typeof imageUrlRaw === "string" ? imageUrlRaw : "",
        priceLabel: typeof priceLabelRaw === "string" ? priceLabelRaw : "",
        subtitle: typeof item["subtitle"] === "string" ? item["subtitle"] : "",
        title,
      } satisfies WallPromoDTO
    })
    .filter((item): item is WallPromoDTO => item !== null)
}

async function fetchWallFeed(tab: WallTabId, latitude?: number, longitude?: number): Promise<WallFeedDTO> {
  await ensureAccessTokenIsAvailable()

  const response = await pointAxiosInstance.post<
    unknown,
    AxiosResponse<unknown>,
    {
      latitude?: number
      longitude?: number
      tab: WallTabId
    }
  >("/point/selection/s", {
    latitude,
    longitude,
    tab,
  })

  return normalizeWallFeed(response.data, tab)
}

export const wallFeedQueryOptions = (tab: WallTabId, coordinates?: { latitude: number; longitude: number }) =>
  queryOptions({
    queryFn: () => fetchWallFeed(tab, coordinates?.latitude, coordinates?.longitude),
    queryKey: ["wall", "feed", tab, coordinates?.latitude ?? null, coordinates?.longitude ?? null],
    staleTime: 60_000,
  })

export const wallRecommendedQueryOptions = queryOptions({
  queryFn: async () => {
    await ensureAccessTokenIsAvailable()
    const response = await pointAxiosInstance.get<unknown, AxiosResponse<unknown>>("/point/selection/recommended")
    return normalizeWallCards(response.data)
  },
  queryKey: ["wall", "recommended"],
  staleTime: 60_000,
})

export const wallNearbyQueryOptions = (latitude: number, longitude: number) =>
  queryOptions({
    queryFn: async () => {
      await ensureAccessTokenIsAvailable()
      const response = await pointAxiosInstance.get<unknown, AxiosResponse<unknown>>("/point/selection/nearby", {
        params: { latitude, longitude },
      })
      return normalizeWallCards(response.data)
    },
    queryKey: ["wall", "nearby", latitude, longitude],
    staleTime: 60_000,
  })

export const wallPromosQueryOptions = queryOptions({
  queryFn: async () => {
    await ensureAccessTokenIsAvailable()
    const response = await pointAxiosInstance.get<unknown, AxiosResponse<unknown>>("/point/selection/promos")
    return normalizeWallPromos(response.data)
  },
  queryKey: ["wall", "promos"],
  staleTime: 60_000,
})

export const wallSelectionDetailQueryOptions = (selectionId: string) =>
  queryOptions({
    enabled: selectionId.trim().length > 0,
    queryFn: async () => {
      await ensureAccessTokenIsAvailable()
      const response = await pointAxiosInstance.post<unknown, AxiosResponse<unknown>>(
        `/point/selection/${selectionId}`,
        { id: selectionId }
      )
      return normalizeWallFeed(response.data, "popular")
    },
    queryKey: ["wall", "selection", selectionId],
    staleTime: 60_000,
  })
