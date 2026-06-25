import type { AxiosResponse } from "axios"

import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query"

import pointAxiosInstance from "@/api/point"
import { ensureAccessTokenIsAvailable } from "@/utils/ensureAccessTokenIsAvailable"

export interface UserNotificationDTO {
  id: string
  title: string
  text: string
  createdAt: string
  read: boolean
}

function normalizeNotifications(raw: unknown): UserNotificationDTO[] {
  if (!Array.isArray(raw)) {
    return []
  }

  return raw
    .map((entry) => {
      if (!entry || typeof entry !== "object") {
        return null
      }
      const row = entry as Record<string, unknown>
      const id = row["id"]
      const title = row["title"]
      const text = row["text"] ?? row["message"]
      const createdAt = row["createdAt"] ?? row["created_at"]
      if (
        typeof id !== "string" ||
        typeof title !== "string" ||
        typeof text !== "string" ||
        typeof createdAt !== "string"
      ) {
        return null
      }
      return {
        createdAt,
        id,
        read: Boolean(row["read"] ?? row["isRead"]),
        text,
        title,
      } satisfies UserNotificationDTO
    })
    .filter((item): item is UserNotificationDTO => item !== null)
}

export const notificationsQueryOptions = (search = "") =>
  queryOptions({
    queryFn: async () => {
      await ensureAccessTokenIsAvailable()

      const response = await pointAxiosInstance.get<UserNotificationDTO[]>("/point/account/notifications", {
        params: search.trim().length > 0 ? { q: search } : undefined,
      })
      return normalizeNotifications(response.data)
    },
    queryKey: ["account", "notifications", search],
    staleTime: 30_000,
  })

export const notificationUnreadCountQueryOptions = queryOptions({
  queryFn: async () => {
    await ensureAccessTokenIsAvailable()

    const response = await pointAxiosInstance.get<{ count: number }, AxiosResponse<{ count: number }>>(
      "/point/account/notifications/unread-count"
    )
    return response.data.count
  },
  queryKey: ["account", "notifications", "unread-count"],
  staleTime: 10_000,
})

export const useMarkNotificationReadMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (notificationId: string) => {
      await ensureAccessTokenIsAvailable()
      await pointAxiosInstance.post(`/point/account/notifications/${notificationId}/read`)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "notifications"] })
    },
  })
}

export const useMarkAllNotificationsReadMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await ensureAccessTokenIsAvailable()
      await pointAxiosInstance.post("/point/account/notifications/read-all")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "notifications"] })
    },
  })
}
