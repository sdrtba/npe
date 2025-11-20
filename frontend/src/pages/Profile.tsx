import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import styles from '@/styles/Profile.module.css'

export const Profile = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!user) {
    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        {/* Шапка профиля */}
        <div className={styles.header}>
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>{user.username.charAt(0).toUpperCase()}</div>
            <div className={styles.userInfo}>
              <h1 className={styles.username}>{user.username}</h1>
              <p className={styles.email}>{user.email}</p>
            </div>
          </div>
        </div>

        {/* Статистика */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🏆</div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>0</span>
              <span className={styles.statLabel}>Решено задач</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>⭐</div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>0</span>
              <span className={styles.statLabel}>Рейтинг</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🔥</div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>0</span>
              <span className={styles.statLabel}>Серия дней</span>
            </div>
          </div>
        </div>

        {/* Секция достижений */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Достижения</h2>
          <div className={styles.achievements}>
            <div className={styles.achievementPlaceholder}>
              <span className={styles.placeholderIcon}>🎯</span>
              <p className={styles.placeholderText}>Начните решать задачи, чтобы получить достижения</p>
            </div>
          </div>
        </div>

        {/* Секция активности */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Последняя активность</h2>
          <div className={styles.activity}>
            <p className={styles.placeholderText}>Пока нет активности</p>
          </div>
        </div>

        {/* Кнопка выхода */}
        <div className={styles.actions}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>
  )
}
