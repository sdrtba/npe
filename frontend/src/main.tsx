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
import { CategoryTaskPage } from '@/pages/CategoryTaskPage'
import { TaskDetailsPage } from '@/pages/TaskDetailsPage'
import { LearnIndex } from '@/pages/LearnIndex'
import { CategoryPage } from '@/pages/CategoryPage'
import { ArticlePage } from '@/pages/ArticlePage'
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
                <Route path=":category" element={<CategoryTaskPage />} />
                <Route path=":category/:taskId" element={<TaskDetailsPage />} />
              </Route>
              <Route path="/learn">
                <Route index element={<LearnIndex />} />
                <Route path=":category" element={<CategoryPage />} />
                <Route path=":category/:slug" element={<ArticlePage />} />
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
