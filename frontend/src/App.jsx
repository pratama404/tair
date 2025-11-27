import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider } from './contexts/AppContext'
import { Layout } from './components/layout/Layout'
import { Dashboard } from './pages/Dashboard'
import { Settings } from './pages/Settings'
import { Profile } from './pages/Profile'
import { Notifications } from './pages/Notifications'
import { Help } from './pages/Help'
import { News } from './pages/News'
import { ArticleDetail } from './pages/ArticleDetail'
import './App.css'

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="news" element={<News />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="help" element={<Help />} />
            <Route path="article/:id" element={<ArticleDetail />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  )
}

export default App