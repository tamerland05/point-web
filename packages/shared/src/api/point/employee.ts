import { queryOptions } from "@tanstack/react-query"
import type { AxiosResponse } from "axios"

import pointAxiosInstance from "@/api/point"
import { ensureAccessTokenIsAvailable } from "@/utils/ensureAccessTokenIsAvailable"

interface EmployeeDTO {
  name: string
  username: string
  rank: number
  typsLeft: number
  account: {
    id: string
    jobPlace: {
      id: string
      name: string
      address: string
    } | null
    purpose: {
      icon: string
      title: string
      description: string
    } | null
  }
}

export const employeeQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["employee", id],
    queryFn: async () => {
      await ensureAccessTokenIsAvailable()

      const response = await pointAxiosInstance.get<EmployeeDTO, AxiosResponse<EmployeeDTO>>(
        `/point/user/employee/${id}`
      )

      return response.data
    },
  })
