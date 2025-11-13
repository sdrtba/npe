import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { AuthModal } from '@/components/AuthModal'
import styles from '@/styles/Navbar.module.css'

export const Navbar = () => {
  const { user, logout } = useAuth()
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const openLogin = () => {
    setAuthMode('login')
    setShowAuth(true)
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          NPE Tasks
        </Link>

        <div className={styles.menu}>
          {user ? (
            <>
              <Link
                to="/tasks"
                // className={styles.link}
                className={`${styles.link} ${isActive('/tasks') ? styles.active : ''}`}
              >
                Задачи
              </Link>
              <Link
                to="/profile"
                // className={styles.link}
                className={`${styles.link} ${isActive('/profile') ? styles.active : ''}`}
              >
                Профиль
              </Link>
              <span className={styles.username}>{user.username}</span>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Выйти
              </button>
            </>
          ) : (
            <>
              <button onClick={openLogin} className={styles.secondaryBtn}>
                Войти
              </button>
            </>
          )}
        </div>
      </div>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} initialMode={authMode} />
    </nav>
  )
}
