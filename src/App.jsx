import { Routes, Route } from 'react-router-dom'

import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import TodayPage from './pages/TodayPage'
import ProgressPage from './pages/ProgressPage'
import SettingsPage from './pages/SettingsPage'
import AboutPage from './pages/AboutPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/today" element={<TodayPage />} />
      <Route path="/progress" element={<ProgressPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  )
}

export default App