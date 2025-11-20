import { useState } from 'react'
import { useAuth } from '@/auth/AuthContext'
import { Modal } from '@/components/Modal'
import styles from '../styles/Auth.module.css'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'login' | 'register'
}

export const AuthModal = ({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')

  const { login, register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      if (mode === 'login') {
        await login(formData.username, formData.password)
      } else {
        await register(formData.username, formData.email, formData.password)
      }
      onClose()
      setFormData({ username: '', email: '', password: '' })
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Произошла ошибка')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    setError('')
    setFormData({ username: '', email: '', password: '' })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'login' ? 'Вход' : 'Регистрация'}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.inputGroup}>
          <label className={styles.label}>Имя пользователя</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={styles.input}
            required
            autoComplete="username"
          />
        </div>

        {mode === 'register' && (
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              required
              autoComplete="email"
            />
          </div>
        )}

        <div className={styles.inputGroup}>
          <label className={styles.label}>Пароль</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={styles.input}
            required
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
        </button>

        <div className={styles.switchMode}>
          <span className={styles.switchText}>{mode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}</span>
          <button type="button" onClick={switchMode} className={styles.switchButton}>
            {mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
