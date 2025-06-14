import axios from "axios"

// export const VITE_POINT_API_FQDN = "/point-api"

const pointAxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_POINT_API_FQDN}/v1`,
  headers: {
    "Content-Type": "application/json",
  },
})

export default pointAxiosInstance
