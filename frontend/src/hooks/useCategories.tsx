import { useState, useEffect, useCallback } from 'react'
import { api, toApiError, type ApiError } from '@/api/axios'
import type { Category } from '@/types/task'

type UseCategoriesReturn = {
  categories: Category[]
  loading: boolean
  error: ApiError | null
  refetch: () => Promise<void>
}

export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { data } = await api.get<Category[]>('/categories')
      setCategories(data)
    } catch (err: unknown) {
      const apiError = toApiError(err, 'Ошибка загрузки категорий')
      setError(apiError)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let mounted = true

    const loadCategories = async () => {
      await fetchCategories()
    }

    if (mounted) {
      loadCategories()
    }

    return () => {
      mounted = false
    }
  }, [fetchCategories])

  return { categories, loading, error, refetch: fetchCategories }
}
