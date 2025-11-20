import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCategoriesTasks } from '@/hooks/useCategoriesTasks'
import { TaskModal } from '@/components/TaskModal'
import styles from '@/styles/CategoryTask.module.css'

export const TasksCategories = () => {
  const { category } = useParams<{ category: string }>()
  const navigate = useNavigate()
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

  if (!category) return <div>Категория не указана</div>

  const { tasks, loading, error } = useCategoriesTasks(category)

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

  const handleTaskClick = (e: React.MouseEvent, taskId: string) => {
    // Предотвращаем открытие модального окна если кликнули на ссылку или кнопку
    const target = e.target as HTMLElement
    if (target.tagName === 'A' || target.closest('a')) {
      return
    }
    setSelectedTaskId(taskId)
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.categoryTitle}>{category.toUpperCase()}</h1>
      </div>

      {tasks.length > 0 ? (
        <div className={styles.tasksList}>
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={(e) => handleTaskClick(e, task.id)}
              className={styles.taskCard}
              style={{ cursor: 'pointer' }}
            >
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
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>📭</span>
          <p className={styles.emptyText}>В этой категории пока нет задач</p>
        </div>
      )}

      <TaskModal isOpen={!!selectedTaskId} onClose={() => setSelectedTaskId(null)} taskId={selectedTaskId} />
    </div>
  )
}
