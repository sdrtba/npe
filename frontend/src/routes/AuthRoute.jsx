import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'

export const AuthRouter = () => {
  const [token] = useAuth()

  if (token) {
    return <Navigate to="/notes" replace />
  }

  return <Outlet />
}
