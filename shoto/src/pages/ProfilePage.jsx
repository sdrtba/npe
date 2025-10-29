import { useAuth } from '../hooks/useAuth.jsx'
import { api } from '../api/axiosApi.js'
import React, { useState } from 'react'

export const ProfilePage = () => {
  const [token] = useAuth()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [isPasswordError, setIsPasswordError] = useState(null)
  const [isSuccess, setIsSuccess] = useState(null)

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    setIsPasswordError(null)
    setIsSuccess(null)

    await api
      .post(
        '/change-password',
        {
          old_password: oldPassword,
          new_password: newPassword
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          }
        }
      )
      .then(() => {
        setStatus('Пароль обновлен')
        setIsSuccess(true)
      })
      .catch((err) => {
        setIsSuccess(false)
        setIsPasswordError(false)
        if (err.response.status === 404) {
          setStatus('Пользователь не существует')
        } else if (err.response.status === 401) {
          setStatus('Неверный текущий пароль')
          setIsPasswordError(true)
        } else {
          setStatus('Что-то пошло не так')
        }
      })

    setLoading(false)
  }

  return (
    <main className="container card">
      <article>
        <h2>🔐 Обновить пароль</h2>

        <form onSubmit={handlePasswordUpdate}>
          {status && (
            <p
              style={{
                color: isSuccess ? 'green' : 'crimson'
              }}
            >
              {status}
            </p>
          )}

          <label>
            <input
              type="password"
              name="oldPassword"
              placeholder="Текущий пароль"
              autoComplete="current-password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              aria-invalid={isPasswordError}
              required
            />
          </label>

          <label>
            <input
              type="password"
              name="newPassword"
              placeholder="Новый пароль"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              aria-invalid={isSuccess ? false : ''}
              required
            />
          </label>

          <button type="submit" className="contrast" aria-busy={loading}>
            Обновить
          </button>
        </form>
      </article>
    </main>
  )
}
