import { Home, Library, Search, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export default function BottomNav() {
  const location = useLocation()

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
    <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="glass rounded-full px-6 py-3 flex items-center gap-8 pointer-events-auto shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/10 animate-fade-in-up bg-background/80 backdrop-blur-2xl">
        {navItems.map((item) => {
          const active = location.pathname === item.path
          const Icon = item.icon
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center justify-center w-12 h-12 transition-all duration-300 group ${
                active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {/* Active Glow Background */}
              {active && (
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-md animate-pulse-glow" />
              )}

              {/* Icon with hover effect */}
              <div className={`relative z-10 transition-transform duration-300 ${active ? 'scale-110 drop-shadow-[0_0_8px_rgba(234,88,12,0.5)]' : 'group-hover:scale-110'}`}>
                <Icon size={24} strokeWidth={active ? 2.5 : 2} />
              </div>

              {/* Label (only visible on active) */}
              <span className={`absolute -bottom-1 text-[10px] font-bold tracking-wider transition-all duration-300 ${
                active ? 'opacity-100 translate-y-0 text-primary' : 'opacity-0 translate-y-2'
              }`}>
                {item.label}
              </span>

              {/* Active Indicator Dot */}
              {active && (
                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_5px_var(--primary)] animate-pulse" />
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
