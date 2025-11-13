import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/auth/AuthContext'
import { AuthGate } from '@/auth/AuthGate'
import { Profile } from '@/pages/Profile'
import { Tasks } from '@/pages/Tasks'
import { Home } from '@/pages/Home'
import { NotFound } from '@/pages/NotFound'
import { MainLayout } from '@/components/MainLayout'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />

            <Route element={<AuthGate requireAuth redirectTo="/" />}>
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route element={<AuthGate allow={(u) => (u as any).roles?.includes('admin')} redirectTo="/" />}>
              <Route path="/admin" element={<Profile />} />
            </Route>

            <Route path={'*'} element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
