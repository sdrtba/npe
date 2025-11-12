import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { Modal } from '@/components/Modal'
import styles from '@/styles/Auth.module.css'
import type { FormEvent } from 'react'

interface LoginProps {
  isOpen: boolean
  onClose: () => void
}

export const Login = ({ isOpen, onClose }: LoginProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, error, setError } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(email, password)
      onClose()
      setEmail('')
      setPassword('')
      setError(null)
      navigate('/profile')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setEmail('')
    setPassword('')
    setError(null)
    onClose()
  }

  useEffect(() => {
    if (isOpen) {
      setEmail('')
      setPassword('')
      setError(null)
    }
  }, [isOpen, setError])

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Вход в систему">
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error.message}</div>}

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
            placeholder="Введите пароль"
            required
            disabled={loading}
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Вход...' : 'Войти'}
        </button>
      </form>
    </Modal>
  )
}
