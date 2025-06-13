import axios from "axios"

export const VITE_POINT_API_FQDN = "https://point-dev-back.meyson.tech/api"

// export const VITE_POINT_API_FQDN = "https://api.point.yachts/api"

const pointAxiosInstance = axios.create({
  baseURL: `${VITE_POINT_API_FQDN}/v1`,
  headers: {
    "Content-Type": "application/json",
  },
})

export default pointAxiosInstance
