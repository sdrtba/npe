import axios from 'axios'
import type { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'

let accessToken: string | null = null

export const getAccessToken = () => accessToken
export const setAccessToken = (t: string | null) => {
  accessToken = t
}

export const api: AxiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 15000,
  headers: { Accept: 'application/json' },
})

// A raw axios instance without interceptors for token refresh
export const raw: AxiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 15000,
  headers: { Accept: 'application/json' },
})

// Add a request interceptor to include the access token in headers
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// Queue to hold requests while refreshing token
let isRefreshing: boolean = false
type QueueEntry = {
  resolve: (token: string | null) => void
  reject: (err: any) => void
}
let queue: QueueEntry[] = []
const flushQueue = (err: any, token: string | null = null) => {
  queue.forEach((p) => (err ? p.reject(err) : p.resolve(token)))
  queue = []
}

// Add a response interceptor to handle 401 errors and refresh token
api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const status = err.response?.status
    const original = err.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined

    if (status !== 401 || !original || original._retry) {
      return Promise.reject(err)
    }
    original._retry = true

    // If token is refreshing, queue the request
    if (isRefreshing) {
      return new Promise((fulfill, fail) => {
        queue.push({
          resolve: (newToken) => {
            if (newToken && original.headers) {
              original.headers.Authorization = `Bearer ${newToken}`
            }
            fulfill(api(original))
          },
          reject: fail,
        })
      })
    }

    isRefreshing = true
    try {
      const { data } = await raw.post('/auth/refresh-token')
      const newToken = data?.accessToken as string | null
      if (!newToken) {
        throw new Error('No access token in refresh response')
      }

      setAccessToken(newToken)
      flushQueue(null, newToken)

      // Retry the original request with new token
      if (original.headers) {
        original.headers.Authorization = `Bearer ${newToken}`
      }
      return api(original)
    } catch (refreshErr) {
      // Refresh token failed, clear access token and reject all queued requests
      setAccessToken(null)
      flushQueue(refreshErr, null)
      return Promise.reject(refreshErr)
    } finally {
      isRefreshing = false
    }
  }
)

export type ApiError = {
  status?: number
  code?: string
  message: string
  details?: unknown
}
export const toApiError = (err: unknown): ApiError => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status
    const data = err.response?.data as any
    return {
      status,
      code: data?.code || err.code,
      message: data?.message || err.message || 'Request failed',
      details: data,
    }
  }
  return { message: (err as any)?.message ?? 'Unknown error' }
}

// Bootstrap function to refresh access token on app start
export const bootstrapAccessToken = async (): Promise<boolean> => {
  if (accessToken) return true
  try {
    const { data } = await raw.post('/auth/refresh-token')
    const newToken = data?.accessToken as string | null
    if (!newToken) return false
    setAccessToken(newToken)
    return true
  } catch {
    setAccessToken(null)
    return false
  }
}
