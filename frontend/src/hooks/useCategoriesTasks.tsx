import { useState, useEffect, useCallback } from 'react'
import { api, toApiError, type ApiError } from '@/api/axios'
import type { Task } from '@/types/task'

type UseCategoriesTasksReturn = {
  tasks: Task[]
  loading: boolean
  error: ApiError | null
  refetch: () => Promise<void>
}

export const useCategoriesTasks = (category: string): UseCategoriesTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)

  const fetchCategoriesTasks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { data } = await api.get<Task[]>(`/categories/${encodeURIComponent(category)}`)
      setTasks(data)
    } catch (err: unknown) {
      const apiError = toApiError(err, 'Ошибка загрузки задач категории')
      setError(apiError)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let mounted = true

    const loadCategoriesTasks = async () => {
      await fetchCategoriesTasks()
    }

    if (mounted) {
      loadCategoriesTasks()
    }

    return () => {
      mounted = false
    }
  }, [fetchCategoriesTasks])

  return { tasks, loading, error, refetch: fetchCategoriesTasks }
}
