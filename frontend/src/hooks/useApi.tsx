import { useState, useEffect, useCallback } from 'react'
import { api, toApiError, type ApiError } from '@/api/axios'

type UseApiOptions<T> = {
  url: string
  defaultValue: T
  errorMessage?: string
  skip?: boolean // опция не загружать данные сразу
}

type UseApiReturn<T> = {
  data: T
  loading: boolean
  error: ApiError | null
  refetch: () => Promise<void>
  setData: React.Dispatch<React.SetStateAction<T>>
  clearError: () => void
}

export function useApi<T>({
  url,
  defaultValue,
  errorMessage = 'Ошибка загрузки данных',
  skip = false,
}: UseApiOptions<T>): UseApiReturn<T> {
  const [data, setData] = useState<T>(defaultValue)
  const [loading, setLoading] = useState(!skip)
  const [error, setError] = useState<ApiError | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get<T>(url)
      setData(response.data)
    } catch (err: unknown) {
      const apiError = toApiError(err, errorMessage)
      setError(apiError)
      throw apiError // пробрасываем ошибку дальше если нужно
    } finally {
      setLoading(false)
    }
  }, [url, errorMessage])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  useEffect(() => {
    if (!skip) {
      fetchData()
    }
  }, [fetchData, skip])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    setData,
    clearError,
  }
}
