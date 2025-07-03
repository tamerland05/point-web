export const trimAddress = (address: string | undefined, leftLength = 6, rightLength = 5) =>
  address ? `${address?.slice(0, leftLength)}...${address?.slice(-rightLength)}` : ""
