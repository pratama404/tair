import { Outlet } from 'react-router-dom'
import { Navigation } from './Navigation'
import { NotificationToast } from '../ui/NotificationToast'
import { useApp } from '../../contexts/AppContext'

export function Layout() {
  const { state } = useApp()

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      state.settings.theme === 'dark' ? 'dark bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50 text-gray-900'
    }`}>
      <div className="pb-20">
        <Outlet />
      </div>
      <Navigation />
      <NotificationToast />
    </div>
  )
}