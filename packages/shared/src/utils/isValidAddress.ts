import { Address } from "@ton/core";

export const isValidAddress = (address: string) => {
  try {
    Address.parse(address);
    return true;
  } catch {
    return false;
  }
};
