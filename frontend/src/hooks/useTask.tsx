import { useState, useEffect, useCallback } from 'react'
import { api, toApiError, type ApiError } from '@/api/axios'
import type { Task } from '@/types/task'

type UseTaskReturn = {
  task: Task | null
  loading: boolean
  error: ApiError | null
  refetch: () => Promise<void>
  sendFlag: (taskId: string, flag: string) => Promise<void>
}

export const useTask = (taskId: string): UseTaskReturn => {
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)

  const fetchTask = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { data } = await api.get<Task>(`/categories/tasks/${encodeURIComponent(taskId)}`)
      setTask(data)
    } catch (err: unknown) {
      const apiError = toApiError(err, 'Ошибка загрузки задачи')
      setError(apiError)
    } finally {
      setLoading(false)
    }
  }, [])

  const sendFlag = useCallback(async (taskId: string, flag: string) => {
    try {
      setLoading(true)
      setError(null)
      const { data } = await api.post<string>(`/categories/tasks/${encodeURIComponent(taskId)}/submit`, { flag })
      console.log(data)
    } catch (err: unknown) {
      const apiError = toApiError(err, 'Ошибка загрузки флага')
      setError(apiError)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let mounted = true

    const loadTask = async () => {
      await fetchTask()
    }

    if (mounted) {
      loadTask()
    }

    return () => {
      mounted = false
    }
  }, [fetchTask])

  return { task, loading, error, refetch: fetchTask, sendFlag }
}
