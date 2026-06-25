import type { AxiosResponse } from "axios"

import { queryOptions } from "@tanstack/react-query"

import pointAxiosInstance from "@/api/point"
import { ensureAccessTokenIsAvailable } from "@/utils/ensureAccessTokenIsAvailable"

export interface WallCategoryDTO {
  id: string
  name: string
  icon: string
  count: number
  colorCode: string | null
}

function normalizeWallCategories(raw: unknown): WallCategoryDTO[] {
  if (!Array.isArray(raw)) {
    return []
  }

  return raw
    .map((itemRaw, index) => {
      if (!itemRaw || typeof itemRaw !== "object") {
        return null
      }

      const item = itemRaw as Record<string, unknown>
      const name = typeof item["name"] === "string" ? item["name"].trim() : ""
      if (!name) {
        return null
      }

      const colorCodeRaw = item["colorCode"] ?? item["color_code"]
      const iconRaw = item["icon"] ?? item["iconUrl"] ?? item["icon_url"]
      const countRaw = item["count"]

      return {
        colorCode: typeof colorCodeRaw === "string" ? colorCodeRaw : null,
        count: typeof countRaw === "number" && Number.isFinite(countRaw) ? Math.max(0, countRaw) : 0,
        icon: typeof iconRaw === "string" ? iconRaw : "",
        id: typeof item["id"] === "string" ? item["id"] : `wall-category-${index}`,
        name,
      } satisfies WallCategoryDTO
    })
    .filter((item): item is WallCategoryDTO => item !== null)
}

export const wallCategoriesQueryOptions = queryOptions({
  gcTime: Number.POSITIVE_INFINITY,
  queryFn: async () => {
    await ensureAccessTokenIsAvailable()
    const response = await pointAxiosInstance.get<unknown, AxiosResponse<unknown>>("/point/selection/categories")
    return normalizeWallCategories(response.data)
  },
  queryKey: ["wall", "categories"],
  staleTime: 60_000,
})
