import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LogOut, Mail, Sparkles, Crown, TrendingUp, Zap } from 'lucide-react'

export default function Profile() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  if (!user) {
    return (
      <div className="p-4 pb-24">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-16 animate-fade-in-up">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles size={40} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Sign in to continue</h2>
            <p className="text-muted-foreground mb-6">
              Create an account to save your decks and unlock premium features
            </p>
            <Button onClick={() => navigate('/auth')} size="lg" className="group">
              Get Started
              <Sparkles className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const stats = [
    { label: 'Total Decks', value: '3', icon: TrendingUp },
    { label: 'Cards Added', value: '180', icon: Zap },
    { label: 'Days Active', value: '12', icon: Sparkles },
  ]

  return (
    <div className="p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        {/* User Card */}
        <Card className="animate-fade-in-up border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {user.email?.[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl mb-1">
                  {user.displayName || 'Deck Builder'}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail size={14} />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 animate-fade-in-up animation-delay-200">
          {stats.map((stat, index) => (
            <Card
              key={stat.label}
              className="hover:border-primary hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${300 + index * 100}ms` }}
            >
              <CardContent className="p-4 text-center">
                <stat.icon className="w-5 h-5 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Settings Section */}
        <div className="glass-card rounded-3xl p-8 animate-fade-in-up animation-delay-400">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5 text-muted-foreground" />
            Account Settings
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Crown size={20} />
                </div>
                <div>
                  <div className="font-medium">Subscription Plan</div>
                  <div className="text-sm text-muted-foreground">Pro Plan ($9.99/mo)</div>
                </div>
              </div>
              <Button variant="ghost" size="sm">Manage</Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <User size={20} />
                </div>
                <div>
                  <div className="font-medium">Profile Details</div>
                  <div className="text-sm text-muted-foreground">Update your personal information</div>
                </div>
              </div>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }
      `}</style>
    </div>
  )
}
