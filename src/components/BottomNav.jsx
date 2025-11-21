import { Home, Library, Search, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export default function BottomNav() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/decks', icon: Library, label: 'Decks' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/profile', icon: User, label: 'Profile' },
  ]

  // Hide nav on auth page
  if (location.pathname === '/auth') {
    return null
  }

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="glass-card rounded-full px-8 py-4 flex items-center gap-10 pointer-events-auto shadow-2xl shadow-primary/20 border-2 border-primary/30 animate-fade-in-up bg-card/90">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = isActive(path)
          return (
            <Link
              key={path}
              to={path}
              className={`relative flex flex-col items-center gap-1 transition-all duration-300 group ${
                active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {/* Active Glow */}
              {active && (
                <div className="absolute -inset-4 bg-primary/30 rounded-full blur-xl opacity-70" />
              )}

              {/* Icon */}
              <div className={`relative z-10 transition-transform duration-300 ${active ? '-translate-y-1 scale-110' : 'group-hover:-translate-y-1 group-hover:scale-105'}`}>
                <Icon size={24} strokeWidth={active ? 2.5 : 2} />
              </div>

              {/* Label (only visible on active) */}
              <span className={`absolute -bottom-3 text-[10px] font-bold transition-all duration-300 ${
                active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}>
                {label}
              </span>

              {/* Active Indicator */}
              {active && (
                <div className="absolute -bottom-2 w-1.5 h-1.5 bg-primary rounded-full shadow-sm shadow-primary" />
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
