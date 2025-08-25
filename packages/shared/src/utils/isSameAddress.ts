import { Address } from "@ton/core"

import { isValidAddress } from "./isValidAddress"

export const isSameAddress = (firstAddress?: string | null, secondAddress?: string | null) => {
  if (!firstAddress || !secondAddress) {
    return false
  }

  if (!isValidAddress(firstAddress) || !isValidAddress(secondAddress)) {
    return false
  }

  const firstAddressParsed = Address.parse(firstAddress)
  const secondAddressParsed = Address.parse(secondAddress)

  return firstAddressParsed.equals(secondAddressParsed)
}
