import { Link } from 'react-router-dom'
import { useCategories } from '@/hooks/useCategories'
import styles from '@/styles/Tasks.module.css'

export const Tasks = () => {
  const { categories, loading, error } = useCategories()

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Загрузка категорий...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <span className={styles.errorIcon}>⚠️</span>
          <p className={styles.errorMessage}>Ошибка загрузки: {error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Категории задач</h1>
      </div>

      <div className={styles.categories}>
        {[...categories]
          .sort((a, b) => {
            const countA = Number(a.tasks_count) || 0
            const countB = Number(b.tasks_count) || 0
            return countB - countA // По убыванию (сначала больше задач)
          })
          .map((category) => (
            <Link
              key={category.id}
              to={`/tasks/${category.name}`}
              className={`${styles.categoryCard} ${!category?.tasks_count || category.tasks_count === '0' ? styles.disabled : ''}`}
            >
              <div className={styles.categoryIcon}>{'📁'}</div>
              <h3 className={styles.categoryName}>{category.name.toLocaleUpperCase()}</h3>
              <div className={styles.categoryFooter}>
                <span className={styles.taskCount}>
                  {category?.tasks_count || 'WIP'} {category?.tasks_count ? '💻' : '🛠️'}
                </span>
              </div>
            </Link>
          ))}
      </div>

      {categories.length === 0 && (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>📭</span>
          <p className={styles.emptyText}>Пока нет доступных категорий</p>
        </div>
      )}
    </div>
  )
}
