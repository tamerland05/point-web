import axios from "axios"
import { getDefaultStore } from "jotai"

import { accessTokenAtom } from "../../atoms/user"

// export const VITE_POINT_API_FQDN = "/point-api"

const pointAxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_POINT_API_FQDN}/v1`,
  headers: {
    "Content-Type": "application/json",
  },
})

pointAxiosInstance.interceptors.request.use(
  (config) => {
    const store = getDefaultStore()
    const token = store.get(accessTokenAtom)

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default pointAxiosInstance
