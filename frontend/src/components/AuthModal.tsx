import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal } from '@/components/Modal'
import { useAuth } from '@/auth/AuthContext'
import styles from '@/styles/Auth.module.css'

type Mode = 'login' | 'register'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: Mode
}

export const AuthModal = ({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) => {
  const [mode, setMode] = useState<Mode>(initialMode)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const { login, register, error, setError } = useAuth()
  const navigate = useNavigate()

  // когда модал открывается из Navbar с другим режимом — синхронизируем
  useEffect(() => {
    if (isOpen) setMode(initialMode)
  }, [isOpen, initialMode])

  // очистка состояния при открытии и закрытии
  useEffect(() => {
    if (isOpen) {
      setUsername('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setError(null)
    }
  }, [isOpen, setError])

  const title = useMemo(() => (mode === 'login' ? 'Вход в систему' : 'Регистрация'), [mode])

  const switchAction = () => {
    setError(null)
    setPassword('')
    setConfirmPassword('')
    setMode((m) => (m === 'login' ? 'register' : 'login'))
  }

  const handleClose = () => {
    setUsername('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setError(null)
    onClose()
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        if (password !== confirmPassword) {
          setError({ message: 'Пароли не совпадают' })
          return
        }
        if (password.length < 8) {
          setError({ message: 'Пароль должен содержать минимум 8 символов' })
          return
        }
        await register(username, email, password)
      }
      handleClose()
      navigate('/tasks')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title}>
      <form onSubmit={onSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error.message}</div>}

        {mode === 'register' && (
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
        )}

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
            placeholder={mode === 'register' ? 'Минимум 8 символов' : 'Введите пароль'}
            required
            disabled={loading}
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            minLength={mode === 'register' ? 8 : undefined}
          />
        </div>

        {mode === 'register' && (
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
        )}

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading
            ? mode === 'login'
              ? 'Вход...'
              : 'Регистрация...'
            : mode === 'login'
              ? 'Войти'
              : 'Зарегистрироваться'}
        </button>

        <div className={styles.switchRow}>
          {mode === 'login' ? (
            <button type="button" className={styles.linkBtn} onClick={switchAction}>
              Нет аккаунта? Зарегистрироваться
            </button>
          ) : (
            <button type="button" className={styles.linkBtn} onClick={switchAction}>
              Уже есть аккаунт? Войти
            </button>
          )}
        </div>
      </form>
    </Modal>
  )
}
