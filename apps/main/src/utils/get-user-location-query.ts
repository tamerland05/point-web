import { DEFAULT_LATITUDE, DEFAULT_LONGITUDE } from "@/constants/map"
import { queryOptions } from "@tanstack/react-query"
import { requestLocation } from "@telegram-apps/sdk-react"
import toast from "react-hot-toast"

export interface UserLocation {
  longitude: number
  latitude: number
}

export const userLocationQueryOptions = queryOptions<UserLocation>({
  queryKey: ["user-location"],
  queryFn: async () => {
    try {
      const location = await requestLocation()

      return location
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
        longitude: DEFAULT_LONGITUDE,
        latitude: DEFAULT_LATITUDE,
      }
    }
  },
  refetchInterval: 30 * 1000,
})
