import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import React from 'react'
import styles from '../styles/navbar.module.css'

export const Navbar = () => {
  const [token, setToken] = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    setToken(null)
    navigate('/')
  }

  return (
    <header className="container">
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <img src="/vite.svg" alt="Notebook Logo" />
          <strong>
            <Link to="/" className="contrast">
              Контактник
            </Link>
          </strong>
        </div>

        <ul className={styles.navLinks}>
          {token ? (
            <>
              <li>
                <Link to="/notes" className="secondary">
                  Контакты
                </Link>
              </li>
              {/*<li>*/}
              {/*  <Link to="/profile" className="secondary">*/}
              {/*    Профиль*/}
              {/*  </Link>*/}
              {/*</li>*/}
              <li>
                <button className="contrast" onClick={handleLogout}>
                  Выйти
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="secondary">
                  Войти
                </Link>
              </li>
              <li>
                <Link to="/register" className="secondary">
                  Регистрация
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  )
}
