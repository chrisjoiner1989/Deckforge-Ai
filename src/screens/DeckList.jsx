import { useState } from 'react'
import { Plus, Sparkles, Search, Filter, Loader2, LayoutGrid, List } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useDecks } from '../context/DeckContext'
import DeckCard from '../components/DeckCard'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function DeckList() {
  const navigate = useNavigate()
  const { decks, loading, createNewDeck } = useDecks()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [deckName, setDeckName] = useState('')
  const [deckFormat, setDeckFormat] = useState('Standard')
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const formats = [
    'Standard',
    'Pioneer',
    'Modern',
    'Legacy',
    'Vintage',
    'Commander',
    'Pauper',
    'Historic',
    'Alchemy'
  ]

  const handleCreateDeck = async () => {
    if (!deckName.trim()) return

    setIsCreating(true)
    try {
      const newDeckId = await createNewDeck({
        name: deckName.trim(),
        format: deckFormat
      })

      toast.success(`"${deckName}" created successfully!`)

      // Close dialog and navigate to the new deck
      setIsCreateDialogOpen(false)
      setDeckName('')
      setDeckFormat('Standard')
      navigate(`/deck/${newDeckId}`)
    } catch (error) {
      toast.error('Failed to create deck. Please try again.')
      console.error('Error creating deck:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const filteredDecks = decks.filter(deck =>
    deck.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deck.format.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header Section */}
      <div className="relative pt-12 pb-16 px-6 mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="text-5xl font-bold mb-3 tracking-tight text-glow">My Decks</h1>
              <p className="text-muted-foreground text-lg font-light">Manage your arsenal of spells and strategies.</p>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-72 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search collection..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 w-full transition-all font-medium placeholder:text-muted-foreground/50"
                />
              </div>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(234,88,12,0.3)] font-bold rounded-xl transition-all hover:scale-105">
                <Plus className="w-5 h-5 mr-2" />
                New Deck
              </Button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {[
              { label: 'Total Decks', value: decks.length, icon: '📚', color: 'text-blue-400' },
              { label: 'Favorite Format', value: decks.length > 0 ? decks[0].format : 'None', icon: '⭐', color: 'text-yellow-400' },
              { label: 'Win Rate', value: '54%', icon: '📈', color: 'text-green-400' },
              { label: 'Collection Value', value: '$1,240', icon: '💎', color: 'text-purple-400' }
            ].map((stat, i) => (
              <div key={i} className="glass p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all hover:bg-white/5 group">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl filter drop-shadow-lg">{stat.icon}</span>
                  <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{stat.label}</div>
                </div>
                <div className={`text-2xl font-bold ${stat.color} group-hover:scale-105 transition-transform origin-left`}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Deck Grid */}
      <div className="max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="text-center py-32">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(234,88,12,0.3)] animate-pulse">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Summoning Decks...</h3>
            <p className="text-muted-foreground">Consulting the archives</p>
          </div>
        ) : filteredDecks.length === 0 ? (
          <div className="text-center py-32 animate-fade-in-up">
            <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/10">
              <Sparkles className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Collection Empty</h3>
            <p className="text-muted-foreground mb-10 max-w-sm mx-auto text-lg">
              {searchQuery ? "No decks match your search query." : "Your journey begins with a single card."}
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)} size="lg" className="h-14 px-8 bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90 text-white font-bold rounded-2xl shadow-[0_0_30px_rgba(234,88,12,0.4)] transition-all hover:-translate-y-1">
              <Plus className="w-5 h-5 mr-2" />
              Forge First Deck
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Create New Card (Ghost) */}
            <button
              onClick={() => setIsCreateDialogOpen(true)}
              className="group h-full min-h-[280px] border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center p-8 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 animate-fade-in-up"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:border-primary transition-all duration-300 shadow-lg">
                <Plus className="w-8 h-8 text-muted-foreground group-hover:text-white transition-colors" />
              </div>
              <span className="font-bold text-lg text-muted-foreground group-hover:text-primary transition-colors">Create New Deck</span>
            </button>

            {filteredDecks.map((deck, index) => (
              <div
                key={deck.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <DeckCard deck={deck} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Deck Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent onClose={() => setIsCreateDialogOpen(false)} className="glass border border-white/10 sm:max-w-[500px] p-0 overflow-hidden gap-0">
          <div className="p-6 bg-gradient-to-b from-primary/10 to-transparent border-b border-white/5">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                New Deck
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                Begin a new strategy. Choose your format wisely.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Deck Name</label>
              <Input
                placeholder="e.g., Dimir Control"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateDeck()
                  }
                }}
                autoFocus
                className="bg-black/20 border-white/10 focus:border-primary/50 h-12 text-lg font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Format</label>
              <div className="grid grid-cols-3 gap-2">
                {formats.slice(0, 6).map((format) => (
                  <button
                    key={format}
                    onClick={() => setDeckFormat(format)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                      deckFormat === format
                        ? 'bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(234,88,12,0.2)]'
                        : 'bg-black/20 border-white/5 text-muted-foreground hover:bg-white/5 hover:border-white/10'
                    }`}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 bg-black/20 border-t border-white/5">
            <Button
              variant="ghost"
              onClick={() => {
                setIsCreateDialogOpen(false)
                setDeckName('')
                setDeckFormat('Standard')
              }}
              className="hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateDeck}
              disabled={!deckName.trim() || isCreating}
              className="bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Forging...
                </>
              ) : (
                'Create Deck'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
