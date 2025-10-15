import { Routes, Route } from 'react-router-dom'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'
import { ContactsPage } from '../pages/ContactsPage.jsx'
import { ProfilePage } from '../pages/ProfilePage'
import { NotFound } from '../pages/NotFound'
import { MainLayout } from '../layouts/MainLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { AuthRouter } from './AuthRoute'

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route element={<AuthRouter />}>
          <Route path={'/'} element={<HomePage />} />
          <Route path={'/login'} element={<LoginPage />} />
          <Route path={'/register'} element={<RegisterPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path={'/profile'} element={<ProfilePage />} />
          <Route path={'/notes'} element={<ContactsPage />} />
        </Route>
        <Route path={'*'} element={<NotFound />} />
      </Route>
    </Routes>
  )
}
