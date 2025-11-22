import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '@/components/ui/button'
import { LogOut, Mail, Sparkles, Crown, TrendingUp, Zap, Settings, User, Shield } from 'lucide-react'

export default function Profile() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 pb-24">
        <div className="max-w-md w-full text-center animate-fade-in-up">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(234,88,12,0.3)] rotate-3 hover:rotate-0 transition-transform duration-500">
            <Sparkles size={48} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-3 text-glow">Identify Yourself</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Sign in to access your DekForge and unlock premium features.
          </p>
          <Button onClick={() => navigate('/auth')} size="lg" className="h-14 px-8 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 w-full text-lg">
            Begin Journey
            <Sparkles className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    )
  }

  const stats = [
    { label: 'Decks Created', value: '3', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Cards Collected', value: '180', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Planes Visited', value: '12', icon: Shield, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  ]

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header Background */}
      <div className="h-64 bg-gradient-to-b from-primary/20 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="max-w-3xl mx-auto px-6 -mt-32 relative z-10 space-y-8">
        {/* Planeswalker Identity Card */}
        <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl animate-fade-in-up">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-primary via-orange-500 to-yellow-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
              <div className="w-32 h-32 bg-black rounded-full relative flex items-center justify-center border-4 border-background overflow-hidden">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl font-bold text-primary bg-gradient-to-br from-primary/20 to-transparent w-full h-full flex items-center justify-center">
                    {user.email?.[0].toUpperCase()}
                  </span>
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-background shadow-lg" title="Online" />
            </div>
            
            <div className="text-center md:text-left flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest mb-3">
                Planeswalker
              </div>
              <h1 className="text-4xl font-bold mb-2 text-glow">{user.displayName || 'Unknown Wizard'}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                <Mail size={16} />
                <span>{user.email}</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/50 transition-all"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mt-10 border-t border-white/10 pt-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-2xl hover:bg-white/5 transition-colors group cursor-default">
                <div className={`w-10 h-10 mx-auto mb-3 rounded-xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings Section */}
        <div className="glass p-8 rounded-3xl border border-white/10 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
            <Settings className="w-6 h-6 text-gray-400" />
            Account Settings
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-5 rounded-2xl bg-black/20 border border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-600/20 flex items-center justify-center border border-yellow-500/30 group-hover:scale-110 transition-transform">
                  <Crown size={24} className="text-yellow-500" />
                </div>
                <div>
                  <div className="font-bold text-lg group-hover:text-primary transition-colors">Subscription Plan</div>
                  <div className="text-sm text-muted-foreground">Pro Plan ($9.99/mo)</div>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-muted-foreground group-hover:text-foreground">Manage</Button>
            </div>

            <div className="flex items-center justify-between p-5 rounded-2xl bg-black/20 border border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-600/20 flex items-center justify-center border border-purple-500/30 group-hover:scale-110 transition-transform">
                  <User size={24} className="text-purple-400" />
                </div>
                <div>
                  <div className="font-bold text-lg group-hover:text-primary transition-colors">Profile Details</div>
                  <div className="text-sm text-muted-foreground">Update your personal information</div>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-muted-foreground group-hover:text-foreground">Edit</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
