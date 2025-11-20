import { useEffect } from 'react'
import { useTask } from '@/hooks/useTask'
import styles from '@/styles/TaskModal.module.css'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  taskId: string | null
}

export const TaskModal = ({ isOpen, onClose, taskId }: TaskModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen || !taskId) return null

  return <TaskModalContent taskId={taskId} onClose={onClose} />
}

interface TaskModalContentProps {
  taskId: string
  onClose: () => void
}

const TaskModalContent = ({ taskId, onClose }: TaskModalContentProps) => {
  const { task, loading, error, submitFlag } = useTask(taskId)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const flag = formData.get('flag') as string

    await submitFlag(flag)
    if (!error) {
      e.currentTarget.reset()
    }
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <button onClick={onClose} className={styles.closeButton}>
          ✕
        </button>

        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Загрузка задачи...</p>
          </div>
        ) : error || !task ? (
          <div className={styles.error}>
            <span className={styles.errorIcon}>⚠️</span>
            <p className={styles.errorMessage}>{error?.message || 'Задача не найдена'}</p>
          </div>
        ) : (
          <div className={styles.content}>
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
            {task.attachments && task.attachments.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Файлы</h2>
                <div className={styles.files}>
                  {task.attachments.map((file) => (
                    <a
                      key={file.id}
                      href={file.download_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.fileLink}
                    >
                      📎 {file.filename}
                    </a>
                  ))}
                </div>
              </div>
            )}

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
        )}
      </div>
    </div>
  )
}
