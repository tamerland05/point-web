import { type AuthReq, authQueryOptions } from "@point/shared/api/point/auth"
import { useUpdateUserMutation } from "@point/shared/api/point/user"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useTonAddress } from "@tonconnect/ui-react"
import { useEffect } from "react"

export const WalletAddressWatcher = ({ auth }: { auth: AuthReq }) => {
  const address = useTonAddress()

  const authQuery = useSuspenseQuery(authQueryOptions(auth))
  const data = authQuery.data

  const { mutateAsync } = useUpdateUserMutation(auth.hash)

  useEffect(() => {
    if (!address) return

    const isAddressChanged = data?.user.wallet !== address

    if (isAddressChanged) {
      mutateAsync({ wallet: address })
    }
  }, [address, data?.user.wallet, mutateAsync])

  return null
}
