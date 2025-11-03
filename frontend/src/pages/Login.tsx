import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import type { FormEvent } from 'react'

export const Login = () => {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Ошибка входа')
    }
  }

  return (
    <div style={{ maxWidth: 380, margin: '64px auto', display: 'grid', gap: 12 }}>
      <h1>Вход</h1>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8 }}>
        <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input
          type="password"
          placeholder="пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Войти</button>
      </form>
      {error && <div style={{ color: 'crimson' }}>{error}</div>}
    </div>
  )
}
