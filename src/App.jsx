import { Routes, Route } from 'react-router-dom'

import AppLayout from './components/layout/AppLayout'

import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import TodayPage from './pages/TodayPage'
import ProgressPage from './pages/ProgressPage'
import SettingsPage from './pages/SettingsPage'
import AboutPage from './pages/AboutPage'
import PracticePage from './pages/PracticePage'
import SetupPage from './pages/SetupPage'


function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/setup" element={<SetupPage />} />

      <Route element={<AppLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/today" element={<TodayPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/practice" element={<PracticePage />} />
        
      </Route>
    </Routes>
  )
}

export default App