import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTask } from '@/hooks/useTask'
import styles from '@/styles/Tasks.module.css'

export const TaskDetailsPage = () => {
  const { taskId } = useParams<{ taskId: string }>()
  if (!taskId) return <div>Задача не указана</div>

  const { task, loading, error, refetch, sendFlag } = useTask(taskId)
  const [flag, setFlag] = useState('')

  if (loading || !task) {
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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await sendFlag(taskId, flag)
    } catch {}
  }

  return (
    <div>
      <h2>{task.name}</h2>
      <p>Категория: {task.category.name}</p>
      <p>{task.id}</p>
      <p>{task.name}</p>
      <p>{task.difficulty}</p>
      <p>{task.base_score}</p>
      <p>{task.category.id}</p>
      <p>{task.category.name}</p>
      <p>{task.slug}</p>
      <p>{task.author}</p>
      <p>{task.description}</p>
      <p>{task.createdAt}</p>
      <p>{task.updatedAt}</p>
      <ul>
        {task.attachments.map((attach) => (
          <li key={attach.id}>
            <p>{attach.id}</p>
            <p>{attach.task_id}</p>
            <p>{attach.filename}</p>
            <a href={attach.download_url}>{attach.download_url}</a>
            <p>{attach.sha256}</p>
            <p>{attach.created_at}</p>
          </li>
        ))}
      </ul>

      <form onSubmit={onSubmit} className={styles.form}>
        <input
          id="flag"
          type="text"
          className={styles.input}
          value={flag}
          onChange={(e) => setFlag(e.target.value)}
          placeholder="Введите Flag"
          required
          disabled={loading}
        />
      </form>
    </div>
  )
}
