import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import styles from '@/styles/Navbar.module.css'
import { useState } from 'react'
import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'

export const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          NPE Tasks
        </Link>

        <div className={styles.menu}>
          {user ? (
            <>
              <Link to="/tasks" className={styles.link}>
                Задачи
              </Link>
              <Link to="/profile" className={styles.link}>
                Профиль
              </Link>
              <span className={styles.username}>{user.username}</span>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Выйти
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setShowLogin(true)} className={styles.secondaryBtn}>
                Войти
              </button>
              <button onClick={() => setShowRegister(true)} className={styles.primaryBtn}>
                Регистрация
              </button>
            </>
          )}
        </div>
      </div>
      <Login isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <Register isOpen={showRegister} onClose={() => setShowRegister(false)} />
    </nav>
  )
}
