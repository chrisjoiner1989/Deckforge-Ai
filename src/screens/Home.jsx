import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Sparkles, Zap, TrendingUp, Search, ArrowRight, Shield, Layers, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30">
      {/* Background Gradients - MTG Mana Colors */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-[oklch(0.25_0.15_260)]/20 rounded-full blur-[150px] animate-pulse delay-1000" />
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-[oklch(0.65_0.2_25)]/5 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 px-6 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-br from-primary via-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(234,88,12,0.3)] border border-white/20 group-hover:scale-110 transition-transform duration-300">
            <Flame className="text-white w-7 h-7 fill-white/20" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-glow">DekForge.ai</span>
        </div>
        <div className="flex items-center gap-4">
          {!user && (
            <Button variant="ghost" onClick={() => navigate('/auth')} className="hidden sm:flex hover:bg-white/5 hover:text-primary transition-colors">
              Sign In
            </Button>
          )}
          <Button
            onClick={() => navigate(user ? '/decks' : '/auth')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(234,88,12,0.4)] px-8 py-6 rounded-xl font-bold tracking-wide transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(234,88,12,0.6)]"
          >
            {user ? 'Enter Vault' : 'Begin Journey'}
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg hover:border-primary/50 transition-colors cursor-default">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
              </span>
              <span className="text-sm font-medium text-gray-300 tracking-wide">Powered by Scryfall API</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-[1] drop-shadow-2xl">
              Forge Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-500 to-orange-600 animate-shimmer bg-[length:200%_100%]">Legacy</span>
            </h1>

            <p className="text-xl text-gray-400 max-w-lg leading-relaxed font-light">
              The ultimate deck building companion for Magic: The Gathering. Analyze synergies, optimize curves, and dominate the meta.
            </p>
            
            <div className="flex flex-wrap gap-6">
              <Button
                size="lg"
                onClick={() => navigate('/search')}
                className="h-16 px-10 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md text-white font-bold text-lg rounded-2xl transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] group"
              >
                <Search className="w-6 h-6 mr-3 group-hover:text-primary transition-colors" />
                Card Search
              </Button>
              <Button
                size="lg"
                onClick={() => navigate(user ? '/decks' : '/auth')}
                className="h-16 px-10 bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90 text-white font-bold text-lg rounded-2xl shadow-[0_0_30px_rgba(234,88,12,0.4)] transition-all hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(234,88,12,0.6)]"
              >
                Build Deck
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </div>

            <div className="flex items-center gap-10 pt-8 border-t border-white/5">
              <div className="flex items-center gap-3 group">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 group-hover:border-blue-500/50 transition-colors">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <span className="font-medium text-gray-300">Pro Analysis</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 group-hover:border-amber-500/50 transition-colors">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                </div>
                <span className="font-medium text-gray-300">Smart Synergy</span>
              </div>
            </div>
          </div>

          {/* Floating UI Elements */}
          <div className="relative hidden lg:block h-[700px] perspective-[2000px]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-full blur-[120px] animate-pulse-glow" />
            
            {/* Card 1 - Main Feature */}
            <div className="absolute top-20 right-10 w-80 glass-card p-6 rounded-2xl animate-float border border-white/10 rotate-y-[-10deg] rotate-x-[5deg] shadow-[20px_20px_60px_rgba(0,0,0,0.5)] z-20" style={{ animationDelay: '0s' }}>
              <div className="h-40 bg-gradient-to-br from-orange-900/50 to-red-900/50 rounded-xl mb-6 border border-white/10 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://cards.scryfall.io/art_crop/front/4/e/4e4fb50c-9484-45f4-9842-69df8cad4617.jpg?1628801729')] bg-cover bg-center opacity-60 group-hover:scale-110 transition-transform duration-700" />
                <Flame className="w-16 h-16 text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.8)] relative z-10" />
              </div>
              <div className="space-y-3">
                <div className="h-6 w-3/4 bg-white/10 rounded-md animate-pulse" />
                <div className="h-4 w-1/2 bg-white/5 rounded-md" />
                <div className="flex gap-2 mt-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-mana-r flex items-center justify-center text-xs font-bold shadow-[0_0_10px_var(--mana-r)]">R</div>
                  <div className="w-8 h-8 rounded-full bg-gradient-mana-r flex items-center justify-center text-xs font-bold shadow-[0_0_10px_var(--mana-r)]">R</div>
                </div>
              </div>
            </div>

            {/* Card 2 - Stats */}
            <div className="absolute top-60 left-0 w-72 glass-card p-6 rounded-2xl animate-float z-30 border border-white/10 rotate-y-[10deg] rotate-x-[5deg] shadow-[20px_20px_60px_rgba(0,0,0,0.5)]" style={{ animationDelay: '2s' }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-lg shadow-primary/20">
                  <TrendingUp className="text-white w-8 h-8" />
                </div>
                <div>
                  <div className="font-bold text-lg">Win Rate</div>
                  <div className="text-sm text-green-400 font-mono">+12.5%</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-400">Power Level</span>
                  <span className="text-primary">9.2</span>
                </div>
                <div className="h-3 bg-black/40 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full w-[92%] bg-gradient-to-r from-primary to-yellow-500 rounded-full shadow-[0_0_10px_rgba(234,88,12,0.5)]" />
                </div>
              </div>
            </div>

            {/* Card 3 - Mana Curve */}
            <div className="absolute bottom-20 right-20 w-64 glass-card p-5 rounded-2xl animate-float border border-white/10 rotate-y-[-5deg] shadow-[20px_20px_60px_rgba(0,0,0,0.5)] z-10" style={{ animationDelay: '4s' }}>
              <div className="flex items-center justify-between mb-6">
                <span className="font-bold text-gray-200">Mana Curve</span>
                <Layers className="w-5 h-5 text-primary" />
              </div>
              <div className="flex items-end gap-2 h-32">
                {[30, 65, 45, 80, 25, 15].map((h, i) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-primary/40 to-primary/80 rounded-t-sm hover:from-primary hover:to-yellow-400 transition-all duration-300 border-t border-l border-r border-white/10" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 px-6 py-32 bg-black/20 backdrop-blur-3xl border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Master the <span className="text-gradient-gold">Meta</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-xl font-light">
              Advanced tools designed for competitive players and deck brewers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 h-auto md:h-[600px]">
            {/* Large Feature */}
            <div className="md:col-span-2 md:row-span-2 glass-card rounded-3xl p-10 relative overflow-hidden group border border-white/10 hover:border-primary/30 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-orange-600 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(234,88,12,0.3)]">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-4xl font-bold mb-4">AI-Powered Analysis</h3>
                  <p className="text-gray-400 max-w-md text-lg leading-relaxed">
                    Our engine analyzes thousands of tournament decks to suggest optimal card choices, land counts, and sideboard options.
                  </p>
                </div>
                <div className="mt-10 h-64 bg-black/40 rounded-2xl border border-white/10 backdrop-blur-md p-8 relative overflow-hidden">
                  {/* Mana symbols display */}
                  <div className="flex gap-4 mb-6 justify-center">
                    {['w', 'u', 'b', 'r', 'g'].map((c) => (
                      <div key={c} className={`w-12 h-12 rounded-full bg-gradient-mana-${c} flex items-center justify-center text-xl font-bold shadow-[0_0_15px_var(--mana-${c})] border-2 border-white/10 transform hover:scale-110 transition-transform cursor-pointer`}>
                        {c.toUpperCase()}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                      <span className="text-sm text-gray-400">Synergy</span>
                      <span className="text-green-400 font-bold">98%</span>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                      <span className="text-sm text-gray-400">Curve</span>
                      <span className="text-primary font-bold">Perfect</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tall Feature */}
            <div className="md:row-span-2 glass-card rounded-3xl p-10 relative overflow-hidden group border border-white/10 hover:border-blue-500/30 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                  <Search className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Oracle Search</h3>
                <p className="text-gray-400 mb-10 text-lg">
                  Lightning fast search across the entire MTG multiverse.
                </p>
                <div className="space-y-4">
                  {[
                    { q: 'Black Lotus', color: 'mana-c', rarity: 'border-mythic' },
                    { q: 'Ancestral Recall', color: 'mana-u', rarity: 'border-rare' },
                    { q: 'Lightning Bolt', color: 'mana-r', rarity: 'border-common' }
                  ].map((item, i) => (
                    <div key={i} className={`p-4 rounded-xl bg-black/40 border border-white/10 flex items-center gap-4 hover:bg-white/5 transition-colors cursor-pointer group/item ${item.rarity === 'border-mythic' ? 'hover:border-orange-500/50' : ''}`}>
                      <div className={`w-8 h-8 rounded-full bg-gradient-${item.color} flex items-center justify-center text-xs font-bold shadow-sm`}>
                        {item.color === 'mana-c' ? 'C' : item.color === 'mana-u' ? 'U' : 'R'}
                      </div>
                      <span className="font-bold text-gray-200 group-hover/item:text-white transition-colors">{item.q}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Small Feature 1 */}
            <div className="glass-card rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden group border border-white/10 hover:border-yellow-500/30 transition-colors">
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500">
                <Zap className="w-20 h-20 text-yellow-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Mana Optimization</h3>
              <p className="text-gray-400">Calculate the perfect land ratio for your deck's color requirements.</p>
            </div>

            {/* Small Feature 2 */}
            <div className="glass-card rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden group border border-white/10 hover:border-green-500/30 transition-colors">
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500">
                <TrendingUp className="w-20 h-20 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Price Tracking</h3>
              <p className="text-gray-400">Real-time market data from TCGPlayer and CardKingdom.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
