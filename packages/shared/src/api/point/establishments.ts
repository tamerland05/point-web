import { queryOptions } from "@tanstack/react-query"

import pointAxiosInstance from "@/api/point"
import type { Coordinates } from "@/types"
import type { AxiosResponse } from "axios"

interface PlaceDTO {
  id: string
  name: string
  photo: string
  establishmentId: string
  position: Coordinates
  rating: number
}

export const establishmentsQueryOptions = queryOptions({
  queryKey: ["establishments"],
  queryFn: async () => {
    const response = await pointAxiosInstance.post<PlaceDTO[], AxiosResponse<PlaceDTO[]>>("/point/map/establishments")

    return response.data
  },
})
