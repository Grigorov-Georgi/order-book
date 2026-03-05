import axios, { AxiosError } from 'axios'

type TokenProvider = () => string | null

let tokenProvider: TokenProvider = () => null

export const setTokenProvider = (provider: TokenProvider): void => {
  tokenProvider = provider
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = tokenProvider()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const getApiErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    if (error.response?.data && typeof error.response.data === 'object') {
      const maybeMessage = (error.response.data as Record<string, unknown>).message
      if (typeof maybeMessage === 'string') {
        return maybeMessage
      }
    }
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Unexpected error'
}
