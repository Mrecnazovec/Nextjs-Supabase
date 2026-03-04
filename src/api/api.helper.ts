import axios from 'axios'

const JSON_CONTENT_TYPE = {
	'Content-Type': 'application/json',
} as const

export const getContentType = () => JSON_CONTENT_TYPE

export const errorCatch = (error: unknown): string => {
	if (axios.isAxiosError<{ message?: string | string[] }>(error)) {
		const message = error.response?.data?.message
		return message ? (Array.isArray(message) ? message[0] : message) : error.message || 'Unknown error'
	}

	if (error instanceof Error) {
		return error.message
	}

	return 'Unknown error'
}
