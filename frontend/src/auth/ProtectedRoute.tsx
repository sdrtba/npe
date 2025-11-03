import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

export const ProtectedRoute = () => {
  const { isAuth, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div>Loading...</div>
  }
  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return <Outlet />
}
