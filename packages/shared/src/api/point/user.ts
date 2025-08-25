import type { AxiosResponse } from "axios"
import type { JobPlace, PurposeOfFunding } from "@/types"

import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query"

import pointAxiosInstance from "@/api/point"
import { ensureAccessTokenIsAvailable } from "@/utils/ensureAccessTokenIsAvailable"
import { isExists } from "@/utils/isExists"

interface UserDTO {
  name: string
  username: string

  photoUrl: string | null
  wallet: string | null
  rank: number | null
  tipsLeft: number | null

  employee: {
    id: string
    name: string
    photo: string
    profession: string
    jobPlace: JobPlace | null
    purpose: PurposeOfFunding | null
  } | null
}

export const userQueryOptions = (userId: string | number | undefined) =>
  queryOptions({
    enabled: !!userId,
    queryFn: async () => {
      await ensureAccessTokenIsAvailable()

      const response = await pointAxiosInstance.get<UserDTO, AxiosResponse<UserDTO>>(`/point/account/user/${userId}`)

      return response.data
    },
    queryKey: ["get-user", { userId }],
  })

interface UpdateUserReq {
  wallet?: string
  meta?: {
    showTipsLeft?: boolean
  }
}

export const useUpdateUserMutation = (authHash?: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ showTipsLeft, wallet }: { showTipsLeft?: boolean; wallet?: string }) => {
      await ensureAccessTokenIsAvailable()

      const data: UpdateUserReq = {
        meta: isExists(showTipsLeft) ? { showTipsLeft } : undefined,
        wallet: wallet ?? undefined,
      }

      const response = await pointAxiosInstance.put<UpdateUserReq, AxiosResponse<UpdateUserReq>>(
        "/point/account/user",
        data
      )

      return response.data
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", { hash: authHash }] })
    },
  })
}
