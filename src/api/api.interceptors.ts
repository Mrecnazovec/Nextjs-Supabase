import { SERVER_URL } from '@/config/api.config'
import axios, { CreateAxiosDefaults } from 'axios'
import { getContentType } from './api.helper'
import { getAccessToken, removeFromStorage } from '@/services/auth/auth-token.service'

const options: CreateAxiosDefaults = {
	baseURL: SERVER_URL,
	headers: getContentType(),
	withCredentials: true,
}

const axiosClassic = axios.create(options)
const axiosWithAuth = axios.create(options)

axiosWithAuth.interceptors.request.use((config) => {
	const accessToken = getAccessToken()

	if (config?.headers && accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`
	}

	return config
})

axiosWithAuth.interceptors.response.use(
	(config) => config,
	(error) => {
		const responseMessage = error.response?.data?.message
		const normalizedMessage = Array.isArray(responseMessage) ? responseMessage[0] : responseMessage
		const isUnauthorized =
			error?.response?.status === 401 || normalizedMessage === 'jwt expired' || normalizedMessage === 'jwt must be provided'

		if (
			isUnauthorized &&
			error.config &&
			!error.config._isRetry
		) {
			removeFromStorage()
		}
		throw error
	}
)

export { axiosClassic, axiosWithAuth }
