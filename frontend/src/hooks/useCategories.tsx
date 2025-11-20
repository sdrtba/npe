import { useApi } from '@/hooks/useApi'
import type { Category } from '@/types/task'
import type { ApiError } from '@/api/axios'

type UseCategoriesReturn = {
  categories: Category[]
  loading: boolean
  error: ApiError | null
  refetch: () => Promise<void>
  clearError: () => void
}

export const useCategories = (): UseCategoriesReturn => {
  const { data, loading, error, refetch, clearError } = useApi<Category[]>({
    url: '/categories',
    defaultValue: [],
    errorMessage: 'Ошибка загрузки категорий',
  })

  return {
    categories: data,
    loading,
    error,
    refetch,
    clearError,
  }
}
