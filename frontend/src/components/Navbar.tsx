import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '@/auth/AuthContext'
import { AuthModal } from '@/components/AuthModal'
import styles from '@/styles/Navbar.module.css'

export const Navbar = () => {
  const { user } = useAuth()
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const location = useLocation()

  const openLogin = () => {
    setAuthMode('login')
    setShowAuth(true)
  }

  const isActive = (path: string) => location.pathname.includes(path)

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Логотип слева */}
        <Link to="/" className={styles.logo}>
          NPE Tasks
        </Link>

        {/* Центральное меню (только для авторизованных) */}
        {user && (
          <div className={styles.centerMenu}>
            <Link to="/tasks" className={`${styles.link} ${isActive('/tasks') ? styles.active : ''}`}>
              Задачи
            </Link>
            <Link to="/learn" className={`${styles.link} ${isActive('/learn') ? styles.active : ''}`}>
              Обучение
            </Link>
          </div>
        )}

        {/* Правое меню */}
        <div className={styles.rightMenu}>
          {user ? (
            <Link to="/profile" className={`${styles.profileButton} ${isActive('/profile') ? styles.active : ''}`}>
              Профиль
            </Link>
          ) : (
            <button onClick={openLogin} className={styles.loginButton}>
              Войти
            </button>
          )}
        </div>
      </div>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} initialMode={authMode} />
    </nav>
  )
}
