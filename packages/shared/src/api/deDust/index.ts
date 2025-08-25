import axios from "axios"

export const DEDUST_API_FQDN = "https://api.dedust.io"

const dedustAxiosInstance = axios.create({
  baseURL: `${DEDUST_API_FQDN}/v2`,
  headers: {
    "Content-Type": "application/json",
  },
})

export default dedustAxiosInstance
