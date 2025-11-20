import { Link } from 'react-router-dom'
import { useCategories } from '@/hooks/useCategories'
import styles from '../styles/Tasks.module.css'

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
        <p className={styles.subtitle}>
          Выберите категорию и проверьте свои навыки в различных областях кибербезопасности
        </p>
      </div>

      <div className={styles.categories}>
        {categories.map((category) => (
          <Link key={category.id} to={`/tasks/${category.name}`} className={styles.categoryCard}>
            <div className={styles.categoryIcon}>{'📁'}</div>
            <h3 className={styles.categoryName}>{category.name}</h3>
            <p className={styles.categoryDescription}>{'123'}</p>
            <div className={styles.categoryFooter}>
              <span className={styles.taskCount}>
                {category?.tasks_count || 0} {category?.tasks_count === '1' ? 'задача' : 'задач'}
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
