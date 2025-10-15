import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/axiosApi'

export const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [, setToken] = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    setError(null)

    const formData = new URLSearchParams()
    formData.append('username', username)
    formData.append('password', password)

    await api
      .post('/token', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .then((response) => {
        setToken(response.data.access_token)
        navigate('/')
      })
      .catch((err) => {
        if (err.response.status === 401) {
          setError('Неверный логин или пароль')
        } else {
          setError('Что-то пошло не так')
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <main className="container card">
      <article>
        <h1>Вход</h1>

        <form onSubmit={handleSubmit}>
          {error && <p>{error}</p>}

          <label>
            <input
              type="text"
              name="username"
              placeholder="Логин"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={255}
              required
            />
          </label>

          <label>
            <input
              type="password"
              name="password"
              placeholder="Пароль"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={255}
              required
            />
          </label>

          <button type="submit" className="contrast" aria-busy={loading}>
            Войти
          </button>
        </form>
      </article>
    </main>
  )
}
