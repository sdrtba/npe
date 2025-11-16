import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, setAccessToken, bootstrapAccessToken, toApiError, AuthExpiredError } from '@/api/axios'
import type { FC, PropsWithChildren } from 'react'

export type User = {
  id: string
  username: string
  email: string
  roles?: [string]
}

export type AuthError = {
  message: string
  code?: string
}

type Status = 'idle' | 'authenticating' | 'authenticated' | 'guest'

type AuthContextValue = {
  user: User | null
  loading: boolean
  status: Status
  isAuth: boolean
  error: AuthError | null
  setError: (error: AuthError | null) => void
  refreshProfile: () => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<AuthError | null>(null)
  // const [actionLoading, setActionLoading] = useState(false)

  const loading = status === 'idle' || status === 'authenticating'

  const setErrorSafe = useCallback((err: AuthError | null) => setError(err), [])

  const refreshProfile = useCallback(async () => {
    try {
      const { data } = await api.get<User>('/auth/me')
      setUser(data)
      setError(null)
      setStatus('authenticated')
    } catch (err: unknown) {
      if (err instanceof AuthExpiredError) {
        setAccessToken(null)
      }

      const apiErr = toApiError(err, 'Ошибка загрузки профиля')
      setError({ message: apiErr.message, code: apiErr.code })
      setUser(null)
      setStatus('guest')
    }
  }, [])

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      setStatus('authenticating')
      try {
        setError(null)
        const { data } = await api.post<{ accessToken: string }>('/auth/register', { username, email, password })
        setAccessToken(data.accessToken)
        await refreshProfile()
      } catch (err: unknown) {
        const apiErr = toApiError(err, 'Ошибка регистрации')
        setError({ message: apiErr.message, code: apiErr.code })
        setStatus('guest')
        throw err
      }
    },
    [refreshProfile]
  )

  const login = useCallback(
    async (email: string, password: string) => {
      setStatus('authenticating')
      try {
        setError(null)
        const { data } = await api.post<{ accessToken: string }>('/auth/login', { email, password })
        setAccessToken(data.accessToken)
        await refreshProfile()
      } catch (err: unknown) {
        const apiErr = toApiError(err)
        setError({ message: apiErr.message, code: apiErr.code })
        setStatus('guest')
        throw err
      }
    },
    [refreshProfile]
  )

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout')
    } finally {
      setAccessToken(null)
      setUser(null)
      setError(null)
      setStatus('guest')
    }
  }, [])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setStatus('authenticating')
        await bootstrapAccessToken()
        if (mounted) {
          await refreshProfile()
        }
      } finally {
        if (mounted && status === 'idle') {
          setStatus((prev) => (prev === 'idle' ? 'guest' : prev))
        }
      }
    })()
    return () => {
      mounted = false
    }
  }, [refreshProfile])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      status,
      isAuth: status === 'authenticated',
      error,
      setError: setErrorSafe,
      refreshProfile,
      register,
      login,
      logout,
    }),
    [user, loading, status, error, setErrorSafe, refreshProfile, register, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
