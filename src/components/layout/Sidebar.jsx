import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

import { getProgress } from '../../utils/progressStorage'

function Sidebar() {
    const [streak, setStreak] = useState(
    () => getProgress().streak,
    )

    useEffect(() => {
    const updateProgress = () => {
        setStreak(getProgress().streak)
    }

    window.addEventListener(
        'mathem-progress-updated',
        updateProgress,
    )

    return () => {
        window.removeEventListener(
        'mathem-progress-updated',
        updateProgress,
        )
    }
    }, [])

  const navItems = [
    { name: 'Home', path: '/home' },
    { name: 'Today', path: '/today' },
    { name: 'Practice', path: '/practice' },
    { name: 'Progress', path: '/progress' },
    { name: 'Settings', path: '/settings' },
  ]

  return (
    <aside className="sidebar">
      <div>
       <NavLink
        to="/"
        className="sidebar-brand"
        aria-label="MathEm landing page"
        >
        math'em
        </NavLink>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-streak">
        <span>🔥</span>
        <div>
          <strong>{streak}</strong>
          <p>current streak</p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar