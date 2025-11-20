import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/auth/AuthContext'
import { AuthGate } from '@/auth/AuthGate'
import { MainLayout } from '@/components/MainLayout'
import { NotFound } from '@/pages/NotFound'
import { Home } from '@/pages/Home'
import { Profile } from '@/pages/Profile'
import { Tasks } from '@/pages/Tasks'
import { TasksCategories } from '@/pages/TasksCategories'
import { Learn } from '@/pages/Learn'
import { LearnCategories } from '@/pages/LearnCategories'
import { LearnDetailsPage } from '@/pages/LearnDetailsPage'
import '@/styles/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />

            <Route element={<AuthGate requireAuth redirectTo="/" />}>
              <Route path="/tasks">
                <Route index element={<Tasks />} />
                <Route path=":category" element={<TasksCategories />} />
              </Route>
              <Route path="/learn">
                <Route index element={<Learn />} />
                <Route path=":category" element={<LearnCategories />} />
                <Route path=":category/:slug" element={<LearnDetailsPage />} />
              </Route>
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
