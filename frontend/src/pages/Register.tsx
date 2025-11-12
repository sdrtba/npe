import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { Modal } from '@/components/Modal'
import styles from '@/styles/Auth.module.css'
import type { FormEvent } from 'react'

interface RegisterProps {
  isOpen: boolean
  onClose: () => void
}

export const Register = ({ isOpen, onClose }: RegisterProps) => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { register, error, setError } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError({ message: 'Пароли не совпадают' })
      return
    }

    if (password.length < 8) {
      setError({ message: 'Пароль должен содержать минимум 8 символов' })
      return
    }

    setLoading(true)

    try {
      await register(username, email, password)
      onClose()
      setUsername('')
      setPassword('')
      setConfirmPassword('')
      setEmail('')
      setError(null)
      navigate('/tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setUsername('')
    setPassword('')
    setConfirmPassword('')
    setEmail('')
    setError(null)
    onClose()
  }

  useEffect(() => {
    if (isOpen) {
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setError(null)
    }
  }, [isOpen, setError])

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Регистрация">
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error.message}</div>}

        <div className={styles.formGroup}>
          <label htmlFor="username" className={styles.label}>
            Имя пользователя
          </label>
          <input
            id="username"
            type="text"
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Введите имя пользователя"
            required
            disabled={loading}
            autoComplete="username"
            minLength={3}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            id="email"
            type="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Введите email"
            required
            disabled={loading}
            autoComplete="email"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>
            Пароль
          </label>
          <input
            id="password"
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Минимум 8 символов"
            required
            disabled={loading}
            autoComplete="new-password"
            minLength={8}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword" className={styles.label}>
            Подтверждение пароля
          </label>
          <input
            id="confirmPassword"
            type="password"
            className={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Повторите пароль"
            required
            disabled={loading}
            autoComplete="new-password"
            minLength={8}
          />
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>
    </Modal>
  )
}
