import { useState } from 'react'
import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'
import styles from '@/styles/Home.module.css'

export const Home = () => {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Добро пожаловать в NPE Tasks</h1>
      </div>

      <Login isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <Register isOpen={showRegister} onClose={() => setShowRegister(false)} />
    </div>
  )
}
