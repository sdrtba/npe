import { Link } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import styles from '@/styles/Home.module.css'

export const Home = () => {
  const { user } = useAuth()

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>NPE Tasks</h1>
        <p className={styles.subtitle}>
          Платформа для решения CTF-задач. Проверьте свои навыки в области кибербезопасности, криптографии,
          стеганографии и OSINT.
        </p>
        <div className={styles.buttonGroup}>
          {user ? (
            <Link to="/tasks" className={styles.button}>
              К задачам
            </Link>
          ) : (
            <></>
          )}
        </div>
      </div>

      <div className={styles.features}>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>🔐</div>
          <h3 className={styles.featureTitle}>Криптография</h3>
          <p className={styles.featureDescription}>Решайте задачи по шифрованию и дешифровке данных</p>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>🕵️</div>
          <h3 className={styles.featureTitle}>OSINT</h3>
          <p className={styles.featureDescription}>Используйте открытые источники для поиска информации</p>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>🖼️</div>
          <h3 className={styles.featureTitle}>Стеганография</h3>
          <p className={styles.featureDescription}>Находите скрытые данные в изображениях и файлах</p>
        </div>
      </div>
    </div>
  )
}
