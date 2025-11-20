import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth, type User } from '@/auth/AuthContext'
import { NotFound } from '@/pages/NotFound'
import type { FC } from 'react'

export type AuthGateProps = {
  requireAuth?: boolean
  guestOnly?: boolean
  allow?: (user: User) => boolean
  redirectTo?: string
}

export const AuthGate: FC<AuthGateProps> = ({ requireAuth, guestOnly, allow, redirectTo = '/' }) => {
  const { user, isAuth, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div>Загрузка...</div>
  }

  if (guestOnly) {
    if (isAuth) {
      return <Navigate to={redirectTo} replace />
    }
    return <Outlet />
  }

  if (allow) {
    if (!isAuth || !user || !allow(user)) {
      return <NotFound />
    }
    return <Outlet />
  }

  if (requireAuth) {
    if (!isAuth) {
      return <Navigate to={redirectTo} state={{ from: location }} replace />
    }
    return <Outlet />
  }

  return <Outlet />
}
