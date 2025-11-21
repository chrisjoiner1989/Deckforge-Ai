import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Sparkles, Zap, TrendingUp, Search, ArrowRight, Shield, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30">
      {/* Background Gradients - MTG Mana Colors */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/15 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[oklch(0.75_0.15_250)]/10 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-[30%] right-[20%] w-[30%] h-[30%] bg-[oklch(0.65_0.18_140)]/8 rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 px-6 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-primary via-amber-600 to-yellow-500 rounded-lg flex items-center justify-center shadow-lg shadow-primary/30 border-2 border-primary/30">
            <Sparkles className="text-primary-foreground w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Grimoire</span>
        </div>
        <div className="flex items-center gap-4">
          {!user && (
            <Button variant="ghost" onClick={() => navigate('/auth')} className="hidden sm:flex hover:bg-card/50">
              Sign In
            </Button>
          )}
          <Button
            onClick={() => navigate(user ? '/decks' : '/auth')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 px-6 font-semibold"
          >
            {user ? 'My Collection' : 'Begin Your Journey'}
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border-2 border-primary/20 backdrop-blur-sm animate-fade-in shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-sm font-medium text-muted-foreground">Powered by Scryfall</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
              Build Championship <br />
              <span className="text-gradient">Decks</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
              Your ultimate companion for Magic: The Gathering deck building. Discover powerful synergies, perfect your mana curve, and dominate the battlefield.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={() => navigate('/search')}
                className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg shadow-xl shadow-primary/30 transition-transform hover:scale-105 border-2 border-primary/30"
              >
                <Search className="w-5 h-5 mr-2" />
                Search Cards
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate(user ? '/decks' : '/auth')}
                className="h-14 px-8 border-2 border-primary/30 bg-card/50 hover:bg-card backdrop-blur-sm text-lg font-semibold transition-transform hover:scale-105"
              >
                Build a Deck
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-medium">Tournament Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span className="font-medium">Smart Analysis</span>
              </div>
            </div>
          </div>

          {/* Floating UI Elements */}
          <div className="relative hidden lg:block h-[600px]">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-[100px]" />
            
            {/* Card 1 - MTG Card Preview */}
            <div className="absolute top-10 right-10 w-64 glass-card p-4 rounded-xl animate-float border-2 border-primary/20" style={{ animationDelay: '0s' }}>
              <div className="h-32 bg-gradient-to-br from-[oklch(0.65_0.2_25)]/30 to-[oklch(0.65_0.2_25)]/10 rounded-lg mb-4 border-2 border-[oklch(0.65_0.2_25)]/30 flex items-center justify-center">
                <span className="text-3xl">🔥</span>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-3/4 bg-primary/20 rounded" />
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full mana-red flex items-center justify-center text-xs font-bold">R</div>
                  <div className="w-6 h-6 rounded-full mana-red flex items-center justify-center text-xs font-bold">R</div>
                </div>
              </div>
            </div>

            {/* Card 2 - Deck Analysis */}
            <div className="absolute top-40 left-10 w-72 glass-card p-6 rounded-xl animate-float z-20 border-2 border-primary/20" style={{ animationDelay: '2s' }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-amber-600 flex items-center justify-center border-2 border-primary/30">
                  <Sparkles className="text-primary-foreground w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold">Deck Synergy</div>
                  <div className="text-xs text-green-500 font-semibold">Excellent Match</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Consistency</span>
                  <span className="font-mono font-bold text-primary">9/10</span>
                </div>
                <div className="h-2 bg-card rounded-full overflow-hidden border border-primary/20">
                  <div className="h-full w-[90%] bg-gradient-to-r from-primary to-amber-500 rounded-full" />
                </div>
              </div>
            </div>

            {/* Card 3 - Mana Curve */}
            <div className="absolute bottom-20 right-20 w-60 glass-card p-4 rounded-xl animate-float border-2 border-primary/20" style={{ animationDelay: '4s' }}>
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-sm">Mana Curve</span>
                <Layers className="w-4 h-4 text-primary" />
              </div>
              <div className="flex items-end gap-2 h-24">
                {[40, 70, 45, 30, 20, 10].map((h, i) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-primary/60 to-amber-500/40 rounded-t hover:from-primary hover:to-amber-500 transition-colors border border-primary/30" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid Features */}
      <div className="relative z-10 px-6 py-24 bg-card/30 backdrop-blur-3xl border-t-2 border-primary/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Forge Your Path to Victory</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Everything you need to craft tournament-winning decks and master your favorite formats.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 h-auto md:h-[600px]">
            {/* Large Feature */}
            <div className="md:col-span-2 md:row-span-2 glass-card rounded-2xl p-8 relative overflow-hidden group border-2 border-primary/20">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-amber-600 rounded-xl flex items-center justify-center mb-6 border-2 border-primary/30 shadow-lg shadow-primary/20">
                    <Sparkles className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-3xl font-bold mb-3">Intelligent Deck Analysis</h3>
                  <p className="text-muted-foreground max-w-md text-lg leading-relaxed">
                    Get instant feedback on your deck construction. Analyze card synergies, optimize your mana base, and identify weak spots before your next tournament.
                  </p>
                </div>
                <div className="mt-8 h-64 bg-card/50 rounded-xl border-2 border-primary/20 backdrop-blur-sm p-6 relative overflow-hidden">
                  {/* Mana symbols display */}
                  <div className="flex gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full mana-white flex items-center justify-center text-lg font-bold shadow-md">W</div>
                    <div className="w-10 h-10 rounded-full mana-blue flex items-center justify-center text-lg font-bold shadow-md">U</div>
                    <div className="w-10 h-10 rounded-full mana-black flex items-center justify-center text-lg font-bold shadow-md">B</div>
                    <div className="w-10 h-10 rounded-full mana-red flex items-center justify-center text-lg font-bold shadow-md">R</div>
                    <div className="w-10 h-10 rounded-full mana-green flex items-center justify-center text-lg font-bold shadow-md">G</div>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <div className="flex items-center justify-between p-2 bg-background/50 rounded">
                      <span>Card Draw</span>
                      <span className="text-green-500 font-semibold">✓ Good</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-background/50 rounded">
                      <span>Removal</span>
                      <span className="text-primary font-semibold">★ Excellent</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tall Feature */}
            <div className="md:row-span-2 glass-card rounded-2xl p-8 relative overflow-hidden group border-2 border-primary/20">
              <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.75_0.15_250)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-[oklch(0.75_0.15_250)] to-[oklch(0.65_0.18_250)] rounded-xl flex items-center justify-center mb-6 border-2 border-[oklch(0.75_0.15_250)]/30">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Comprehensive Search</h3>
                <p className="text-muted-foreground mb-8">
                  Access the complete Scryfall database. Find any card by name, type, color, or ability.
                </p>
                <div className="space-y-3">
                  {[
                    { q: 'Lightning Bolt', color: 'mana-red' },
                    { q: 'Counterspell', color: 'mana-blue' },
                    { q: 'Birds of Paradise', color: 'mana-green' }
                  ].map((item, i) => (
                    <div key={i} className="p-3 rounded-lg bg-card/50 border-2 border-primary/10 text-sm flex items-center gap-3 hover:border-primary/30 transition-colors">
                      <div className={`w-6 h-6 rounded-full ${item.color} flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                        {item.color === 'mana-red' ? 'R' : item.color === 'mana-blue' ? 'U' : 'G'}
                      </div>
                      <span className="font-medium">{item.q}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Small Feature 1 */}
            <div className="glass-card rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden group border-2 border-primary/20">
              <div className="absolute top-0 right-0 p-6 opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-500">
                <Zap className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Curve Analysis</h3>
              <p className="text-sm text-muted-foreground">Visualize and optimize your mana curve for consistency.</p>
            </div>

            {/* Small Feature 2 */}
            <div className="glass-card rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden group border-2 border-primary/20">
              <div className="absolute top-0 right-0 p-6 opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-500">
                <TrendingUp className="w-12 h-12 text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Format Support</h3>
              <p className="text-sm text-muted-foreground">Build decks for Standard, Modern, Commander, and more.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
