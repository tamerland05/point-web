import axios from "axios"

export const POINT_API_FQDN = "https://point-dev-back.meyson.tech/api"
// export const POINT_API_FQDN = "/point-api"

const pointAxiosInstance = axios.create({
  baseURL: `${POINT_API_FQDN}/v1`,
  headers: {
    "Content-Type": "application/json",
  },
})

export default pointAxiosInstance
