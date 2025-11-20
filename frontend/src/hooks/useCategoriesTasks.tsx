import { useApi } from '@/hooks/useApi'
import type { Task } from '@/types/task'
import type { ApiError } from '@/api/axios'

type UseCategoriesTasksReturn = {
  tasks: Task[]
  loading: boolean
  error: ApiError | null
  refetch: () => Promise<void>
  clearError: () => void
}

export const useCategoriesTasks = (category: string): UseCategoriesTasksReturn => {
  const { data, loading, error, refetch, clearError } = useApi<Task[]>({
    url: `/categories/${encodeURIComponent(category)}`,
    defaultValue: [],
    errorMessage: 'Ошибка загрузки задач категории',
  })

  return {
    tasks: data,
    loading,
    error,
    refetch,
    clearError,
  }
}
