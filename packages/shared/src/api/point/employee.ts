import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosResponse } from "axios"

import pointAxiosInstance from "@/api/point"
import type { PurposeOfFunding } from "@/types"
import { ensureAccessTokenIsAvailable } from "@/utils/ensureAccessTokenIsAvailable"

interface EmployeeDTO {
  name: string
  username: string
  rank: number
  tipsLeft: number
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
        `/point/account/employee/${id}`
      )

      return response.data
    },
  })

export interface UpdateEmployeeDTO {
  purpose: PurposeOfFunding | null
  meta: {
    showJob: boolean
    showPurpose: boolean
  } | null
}

const config = {
  headers: {
    "content-type": "multipart/form-data",
  },
}

export const useUpdateEmployeeMutation = (authHash?: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: FormData) => {
      await ensureAccessTokenIsAvailable()

      const response = await pointAxiosInstance.put<FormData, AxiosResponse<FormData>>(
        "/point/account/employee",
        data,
        config
      )

      return response.data
    },
    // after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", { hash: authHash }] })
    },
  })
}
