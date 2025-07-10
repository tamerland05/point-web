import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosResponse } from "axios"

import pointAxiosInstance from "@/api/point"
import type { PurposeOfFunding } from "@/types"
import { ensureAccessTokenIsAvailable } from "@/utils/ensureAccessTokenIsAvailable"
import { useMemo } from "react"

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

export const useUpdateEmployeeMutation = (authHash?: string, isCreate?: boolean) => {
  const queryClient = useQueryClient()

  const config = useMemo(
    () => ({
      headers: {
        "content-type": "multipart/form-data",
      },
    }),
    []
  )

  return useMutation({
    mutationFn: async (data: FormData) => {
      await ensureAccessTokenIsAvailable()

      const method = isCreate ? "post" : "put"

      const response = await pointAxiosInstance[method]<FormData, AxiosResponse<FormData>>(
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

export interface InvitationDTO {
  establishmentId: string
  profession: string
}

export const invitationQueryOptions = queryOptions({
  queryKey: ["invitation"],
  queryFn: async () => {
    await ensureAccessTokenIsAvailable()

    const response = await pointAxiosInstance.get<InvitationDTO, AxiosResponse<InvitationDTO>>(
      "/point/account/invitation"
    )

    return response.data
  },
  retry: false,
})

export const useDeleteEmployeeMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await ensureAccessTokenIsAvailable()

      const response = await pointAxiosInstance.delete("/point/account/employee")

      return response.data
    },
    // after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] })
    },
  })
}
