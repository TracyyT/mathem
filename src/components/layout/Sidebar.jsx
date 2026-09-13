import { NavLink } from 'react-router-dom'

function Sidebar() {
  const navItems = [
    { name: 'Home', path: '/home' },
    { name: 'Today', path: '/today' },
    { name: 'Progress', path: '/progress' },
    { name: 'Settings', path: '/settings' },
  ]

  return (
    <aside className="sidebar">
      <div>
        <p className="sidebar-brand">math'em</p>

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
          <strong>0</strong>
          <p>current streak</p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar