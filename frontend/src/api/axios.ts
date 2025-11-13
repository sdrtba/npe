import axios from 'axios'
import type { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'

// ---- Token in-memory and headers---------------------------------
let accessToken: string | null = null

export const getAccessToken = () => accessToken
export const setAccessToken = (token: string | null) => {
  accessToken = token
}

function attachAuth(config: AxiosRequestConfig, token: string) {
  config.headers = config.headers ?? {}
  ;(config.headers as Record<string, string>).Authorization = `Bearer ${token}`
}

// ---- Error normalization ---------------------------------------------------------
export type ApiError = { message: string; status?: number; code?: string }

export const toApiError = (err: unknown, customMessage?: string, fallback?: string): ApiError => {
  const ax = err as AxiosError | undefined
  const res = ax?.response
  const status = res?.status
  const data = res?.data as any

  let serverMessage: string | undefined

  if (data && typeof data === 'object') {
    if (typeof data.message === 'string') {
      serverMessage = data.message
    } else if (typeof data.detail === 'string') {
      serverMessage = data.detail
    } else if (Array.isArray(data.detail) && data.detail.length > 0) {
      const first = data.detail[0]
      if (typeof first === 'string') {
        serverMessage = first
      } else if (first && typeof first === 'object' && typeof first.msg === 'string') {
        serverMessage = first.msg
      }
    }
  }

  const code = (ax?.code ?? (typeof data?.code === 'string' ? data.code : undefined)) || undefined

  const message = customMessage ?? serverMessage ?? fallback ?? ax?.message ?? 'Error'

  return { message, status, code }
}

export class AuthExpiredError extends Error {
  constructor(message = 'Session expired') {
    super(message)
    this.name = 'AuthExpiredError'
  }
}

// ---- Axios instances -------------------------------------------------------------
const BASE_URL = import.meta?.env?.VITE_API_URL || '/api'

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 15000,
})

// A raw axios instance without interceptors for token refresh
export const raw: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 15000,
})

// ---- Refresh: single-flight ------------------------------------------------------------
type RetryableConfig = AxiosRequestConfig & { _retry?: boolean }
let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise
  refreshPromise = (async () => {
    try {
      const { data } = await raw.post<{ accessToken?: string }>('/auth/refresh')
      const newToken = data?.accessToken ?? null
      setAccessToken(newToken)
      return newToken
    } catch (e) {
      setAccessToken(null)
      throw e
    } finally {
      refreshPromise = null
    }
  })()
  return refreshPromise
}

// ---- Interceptors ----------------------------------------------------------------
api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) attachAuth(config, token)
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const status = err.response?.status
    const original = err.config as RetryableConfig | undefined
    if (!original) return Promise.reject(err)

    // не трогаем не-401 и /auth-роуты
    const url = (original.url || '').toLowerCase()
    const isAuthRoute = url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/refresh')
    if (status !== 401 || isAuthRoute) {
      return Promise.reject(err)
    }

    // уже пробовали
    if (original._retry) {
      return Promise.reject(new AuthExpiredError())
    }
    original._retry = true

    try {
      const token = await refreshAccessToken()
      if (!token) throw new AuthExpiredError()

      attachAuth(original, token)
      return api(original)
    } catch {
      return Promise.reject(new AuthExpiredError())
    }
  }
)

// ---- Bootstrap at app start ------------------------------------------------------
export const bootstrapAccessToken = async (): Promise<void> => {
  if (accessToken) return
  try {
    await refreshAccessToken()
  } catch {
    setAccessToken(null)
  }
}
