import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
import { api } from '../api/axiosApi'
import { useNavigate } from 'react-router-dom'

export const RegisterPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmationPassword, setConfirmationPassword] = useState('')
  const [isPasswordError, setIsPasswordError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [, setToken] = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()

    setIsPasswordError(false)
    setLoading(true)
    setError(null)

    if (password !== confirmationPassword) {
      setIsPasswordError(true)
      setError('Пароль не совпадает')
    } else if (password.length < 3) {
      setIsPasswordError(true)
      setError('Пароль должен быть больше 3 символов')
    } else {
      await api
        .post(
          '/users',
          { username, password },
          {
            headers: { 'Content-Type': 'application/json' }
          }
        )
        .then((response) => {
          setToken(response.data.access_token)
        })
        .catch((err) => {
          if (err.response.status === 409) {
            setError('Пользователь уже существует')
          } else {
            setError('Что-то пошло не так')
          }
        })
    }
    setLoading(false)
  }

  return (
    <main className="container card">
      <article>
        <h1>Создать аккаунт</h1>

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
              aria-invalid={isPasswordError ? true : ''}
              maxLength={255}
              required
            />
          </label>

          <label>
            <input
              type="password"
              name="confirmationPassword"
              placeholder="Подтвердите пароль"
              autoComplete="current-password"
              value={confirmationPassword}
              onChange={(e) => setConfirmationPassword(e.target.value)}
              aria-invalid={isPasswordError ? true : ''}
              maxLength={255}
              required
            />
          </label>

          <button type="submit" className="contrast" aria-busy={loading}>
            Продолжить
          </button>
        </form>
      </article>
    </main>
  )
}
