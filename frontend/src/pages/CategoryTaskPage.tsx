import { useParams, Link, useNavigate } from 'react-router-dom'
import { useCategoriesTasks } from '@/hooks/useCategoriesTasks'
import styles from '@/styles/CategoryTask.module.css'

export const CategoryTaskPage = () => {
  const { category } = useParams<{ category: string }>()
  const navigate = useNavigate()

  if (!category) return <div>Категория не указана</div>

  const { tasks, loading, error, refetch } = useCategoriesTasks(category)

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Загрузка задач...</p>
        </div>
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <span className={styles.errorIcon}>⚠️</span>
          <p className={styles.errorMessage}>{error?.message || 'Категория не найдена'}</p>
          <button onClick={() => navigate('/tasks')} className={styles.backButton}>
            Вернуться к категориям
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <button onClick={() => navigate('/tasks')} className={styles.backLink}>
        ← Все категории
      </button>

      <div className={styles.header}>
        <div className={styles.categoryInfo}>
          <span className={styles.categoryIcon}>{'📁'}</span>
          <div>
            <h1 className={styles.title}>{'category.name'}</h1>
            <p className={styles.description}>{'category.description'}</p>
          </div>
        </div>
        <div className={styles.stats}>
          <span className={styles.statItem}>
            📊 {tasks.length} {tasks.length === 1 ? 'задача' : 'задач'}
          </span>
        </div>
      </div>

      {tasks.length > 0 ? (
        <div className={styles.tasksList}>
          {tasks.map((task) => (
            <Link key={task.id} to={`/tasks/${category}/${task.id}`} className={styles.taskCard}>
              <div className={styles.taskHeader}>
                <h3 className={styles.taskTitle}>{task.name}</h3>
                <div className={styles.taskBadges}>
                  <span className={`${styles.badge} ${styles[`difficulty${task.difficulty}`]}`}>
                    {task.difficulty === 'easy' && '🟢 Легко'}
                    {task.difficulty === 'medium' && '🟡 Средне'}
                    {task.difficulty === 'hard' && '🔴 Сложно'}
                  </span>
                  <span className={styles.pointsBadge}>⭐ {task.base_score}</span>
                </div>
              </div>

              <p className={styles.taskDescription}>
                {task?.description && task.description.length > 150
                  ? `${task.description.substring(0, 150)}...`
                  : task.description}
              </p>

              <div className={styles.taskFooter}>
                {task.solved && <span className={styles.solvedBadge}>✅ Решено</span>}
                <span className={styles.arrow}>→</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>📭</span>
          <p className={styles.emptyText}>В этой категории пока нет задач</p>
        </div>
      )}
    </div>
  )
}
