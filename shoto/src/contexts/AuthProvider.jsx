import { useState, useEffect } from 'react'
import { AuthContext } from './AuthContext'
import { api } from '../api/axiosApi'

export const AuthProvider = (props) => {
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    const fetchUser = async () => {
      await api
        .get('/users/me', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })
        .then(() => {
          localStorage.setItem('token', token)
        })
        .catch((err) => {
          setToken(null)
          localStorage.removeItem('token')
          console.error(err)
        })
    }

    fetchUser().then()
  }, [token])

  return <AuthContext.Provider value={[token, setToken]}>{props.children}</AuthContext.Provider>
}
