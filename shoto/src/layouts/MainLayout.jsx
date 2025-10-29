import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/Navbar'

export const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
