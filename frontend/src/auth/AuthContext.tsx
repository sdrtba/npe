import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api, setAccessToken, bootstrapAccessToken } from '@/api/axios'
import type { FC, PropsWithChildren } from 'react'

export type User = {
  id: string
  email: string
  name?: string
  roles?: string[]
}

type AuthContextValue = {
  user: User | null
  loading: boolean
  isAuth: boolean
  register: (username: string, email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('AuthContext not found')
  return context
}

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = async () => {
    try {
      const { data } = await api.get<User>('/auth/me')
      setUser(data)
    } catch {
      setUser(null)
    }
  }

  const register = async (username: string, email: string, password: string) => {
    const { data } = await api.post<{ accessToken: string }>('/auth/register', { username, email, password })
    setAccessToken(data.accessToken)
    await refreshProfile()
  }

  const login = async (email: string, password: string) => {
    const { data } = await api.post<{ accessToken: string }>('/auth/login', { email, password })
    setAccessToken(data.accessToken)
    await refreshProfile()
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {}
    setAccessToken(null)
    setUser(null)
  }

  useEffect(() => {
    ;(async () => {
      try {
        await bootstrapAccessToken()
        await refreshProfile()
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuth: !!user,
      register,
      login,
      logout,
      refreshProfile,
    }),
    [user, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
