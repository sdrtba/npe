import { useParams, Link } from 'react-router-dom'
import { useCategoriesTasks } from '@/hooks/useCategoriesTasks'
import styles from '@/styles/Tasks.module.css'

export const CategoryTasksPage = () => {
  const { category } = useParams<{ category: string }>()
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

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error.message}</p>
          {error.status && <span className={styles.errorCode}>Код ошибки: {error.status}</span>}
          <button onClick={refetch} className={styles.retryBtn}>
            Повторить
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2>Задачи</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <Link to={`/tasks/${encodeURIComponent(category)}/${encodeURIComponent(task.id)}`}>{task.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
