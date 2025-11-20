import { useParams, useNavigate } from 'react-router-dom'
import { useTask } from '@/hooks/useTask'
import styles from '../styles/TaskDetails.module.css'

export const TaskDetailsPage = () => {
  const { taskId } = useParams<{ taskId: string }>()
  const navigate = useNavigate()
  const { task, loading, error, submitFlag } = useTask(taskId!)

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Загрузка задачи...</p>
        </div>
      </div>
    )
  }

  if (error || !task || !taskId) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <span className={styles.errorIcon}>⚠️</span>
          <p className={styles.errorMessage}>{error?.message || 'Задача не найдена'}</p>
          <button onClick={() => navigate('/tasks')} className={styles.backButton}>
            Вернуться к задачам
          </button>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const flag = formData.get('flag') as string

    await submitFlag(taskId, flag)
    if (!error) {
      e.currentTarget.reset()
    }
  }

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backLink}>
        ← Назад
      </button>

      <div className={styles.taskCard}>
        {/* Заголовок */}
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>{task.name}</h1>
            <div className={styles.badges}>
              <span className={`${styles.badge} ${styles[`difficulty${task.difficulty}`]}`}>
                {task.difficulty === 'easy' && '🟢 Легко'}
                {task.difficulty === 'medium' && '🟡 Средне'}
                {task.difficulty === 'hard' && '🔴 Сложно'}
              </span>
              <span className={styles.badge}>{task.base_score} очков</span>
            </div>
          </div>
        </div>

        {/* Описание */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Описание</h2>
          <div className={styles.description}>{task.description}</div>
        </div>

        {/* Файлы */}
        {/* {task.files && task.files.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Файлы</h2>
            <div className={styles.files}>
              {task.files.map((file, index) => (
                <a key={index} href={file} target="_blank" rel="noopener noreferrer" className={styles.fileLink}>
                  📎 Скачать файл {index + 1}
                </a>
              ))}
            </div>
          </div>
        )} */}

        {/* Форма отправки флага */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Решение</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <input type="text" name="flag" placeholder="Введите флаг..." className={styles.input} required />
              <button type="submit" className={styles.submitButton}>
                Отправить
              </button>
            </div>
          </form>
        </div>

        {/* Статус решения */}
        {task.solved && <div className={styles.solved}>✅ Задача решена!</div>}
      </div>
    </div>
  )
}
