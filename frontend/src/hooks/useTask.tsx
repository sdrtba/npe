import { useCallback, useState } from 'react'
import { api, toApiError, type ApiError } from '@/api/axios'
import type { Task, CheckFlagResponse } from '@/types/task'
import { useApi } from './useApi'

type UseTaskReturn = {
  task: Task | null
  loading: boolean
  error: ApiError | null
  refetch: () => Promise<void>
  submitFlag: (flag: string) => Promise<CheckFlagResponse>
  clearError: () => void
  submitting: boolean // отдельный флаг для отправки
}

export const useTask = (taskId: string): UseTaskReturn => {
  const { data, loading, error, refetch, clearError } = useApi<Task | null>({
    url: `/categories/tasks/${encodeURIComponent(taskId)}`,
    defaultValue: null,
    errorMessage: 'Ошибка загрузки задачи',
  })

  const [submitting, setSubmitting] = useState(false)

  const submitFlag = useCallback(
    async (flag: string): Promise<CheckFlagResponse> => {
      try {
        setSubmitting(true)
        clearError()
        const { data } = await api.post<CheckFlagResponse>(`/categories/tasks/${encodeURIComponent(taskId)}/submit`, {
          flag,
        })
        await refetch()
        return data
      } catch (err: unknown) {
        const apiError = toApiError(err, 'Ошибка отправки флага')
        throw apiError // пробрасываем ошибку чтобы компонент мог её обработать
      } finally {
        setSubmitting(false)
      }
    },
    [taskId, clearError, refetch]
  )

  return {
    task: data,
    loading,
    error,
    refetch,
    submitFlag,
    clearError,
    submitting,
  }
}
