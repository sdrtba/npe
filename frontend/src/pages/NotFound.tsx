import { Link } from 'react-router-dom'
import styles from '@/styles/NotFound.module.css'

export const NotFound = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <span className={styles.searchIcon}>🔍</span>
        </div>
        <div className={styles.errorCode}>404</div>
        <h1 className={styles.title}>Страница не найдена</h1>
        <p className={styles.description}>
          Похоже, вы заблудились в киберпространстве. Страница, которую вы ищете, не существует или была перемещена.
        </p>
        <div className={styles.actions}>
          <Link to="/" className={styles.homeButton}>
            Вернуться на главную
          </Link>
          <Link to="/tasks" className={styles.tasksButton}>
            К задачам
          </Link>
        </div>
      </div>
    </div>
  )
}
