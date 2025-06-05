import axios from "axios"

export const POINT_API_FQDN = "http://84.201.150.47:8000/api"
// export const POINT_API_FQDN = "/point-api"

const pointAxiosInstance = axios.create({
	baseURL: `${POINT_API_FQDN}/v1`,
	headers: {
		"Content-Type": "application/json",
	},
})

export default pointAxiosInstance
