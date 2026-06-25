import axios from "axios"
import { getDefaultStore } from "jotai"

import { accessTokenAtom } from "../../atoms/user"

const posAxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_POINT_API_FQDN}/v1`,
  headers: {
    "Content-Type": "application/json",
  },
})

posAxiosInstance.interceptors.request.use((config) => {
  const store = getDefaultStore()
  const token = store.get(accessTokenAtom)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default posAxiosInstance
