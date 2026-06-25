import { queryOptions } from "@tanstack/react-query"
import { requestLocation } from "@telegram-apps/sdk-react"
import toast from "react-hot-toast"

import { DEFAULT_LATITUDE, DEFAULT_LONGITUDE } from "@/constants/map"

interface UserLocation {
  longitude: number
  latitude: number
}

export const userLocationQueryOptions = queryOptions<UserLocation>({
  queryFn: async () => {
    try {
      return await requestLocation()
    } catch (_error) {
      toast.error(
        // "TODO: Телеграм не дал данные о локации пользователя, используем дефолтные координаты, либо в будущем будем на бeке вычислять по IP",
        "User location",
        {
          duration: 3500,
          id: "user-location-error",
          position: "top-left",
        }
      )
      // TODO: data from api by ip address
      return {
        latitude: DEFAULT_LATITUDE,
        longitude: DEFAULT_LONGITUDE,
      }
    }
  },
  queryKey: ["user-location"],
  staleTime: Number.POSITIVE_INFINITY,
})
