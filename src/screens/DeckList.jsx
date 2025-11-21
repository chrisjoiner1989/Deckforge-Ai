import { useState } from 'react'
import { Plus, Sparkles, Search, Filter, Loader2 } from 'lucide-react'
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
    <div className="min-h-screen bg-background pb-24">
      {/* Header Section */}
      <div className="relative bg-card/50 border-b-2 border-primary/20 pt-8 pb-12 px-6 mb-8 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Decks</h1>
              <p className="text-muted-foreground text-lg font-medium">Build, manage, and perfect your collection</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search decks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-card/80 border-2 border-primary/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/40 w-full md:w-64 transition-all font-medium"
                />
              </div>
              <Button variant="outline" size="icon" className="bg-card/50 border-2 border-primary/30 hover:bg-card">
                <Filter className="w-4 h-4" />
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 font-bold border-2 border-primary/30">
                <Plus className="w-4 h-4 mr-2" />
                New Deck
              </Button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: 'Total Decks', value: decks.length, icon: '📚' },
              { label: 'Favorite Format', value: decks.length > 0 ? decks[0].format : 'None', icon: '⭐' },
              { label: 'Active Decks', value: decks.length, icon: '🎴' },
              { label: 'Collection', value: `${decks.length} deck${decks.length !== 1 ? 's' : ''}`, icon: '💎' }
            ].map((stat, i) => (
              <div key={i} className="glass-card p-5 rounded-xl border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{stat.icon}</span>
                  <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">{stat.label}</div>
                </div>
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Deck Grid */}
      <div className="max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-28 h-28 bg-gradient-to-br from-primary to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-6 border-2 border-primary/30 shadow-lg shadow-primary/20">
              <Loader2 className="w-14 h-14 text-primary-foreground animate-spin" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Loading Decks...</h3>
            <p className="text-muted-foreground max-w-sm mx-auto text-lg">
              Fetching your collection from the vault
            </p>
          </div>
        ) : filteredDecks.length === 0 ? (
          <div className="text-center py-20 animate-fade-in-up">
            <div className="w-28 h-28 bg-gradient-to-br from-primary to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-6 border-2 border-primary/30 shadow-lg shadow-primary/20">
              <Sparkles className="w-14 h-14 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-3">No Decks Found</h3>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto text-lg">
              {searchQuery ? "Try adjusting your search terms" : "Start building your collection of championship decks"}
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-6 font-bold shadow-lg shadow-primary/30 border-2 border-primary/30">
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Deck
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDecks.map((deck, index) => (
              <div
                key={deck.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <DeckCard deck={deck} />
              </div>
            ))}
            
            {/* Create New Card (Ghost) */}
            <button
              onClick={() => setIsCreateDialogOpen(true)}
              className="group h-full min-h-[200px] border-2 border-dashed border-primary/30 rounded-xl flex flex-col items-center justify-center p-6 hover:border-primary/60 hover:bg-primary/5 transition-all duration-300 animate-fade-in-up bg-card/30"
              style={{ animationDelay: `${filteredDecks.length * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <Plus className="w-7 h-7 text-primary" />
              </div>
              <span className="font-bold text-foreground group-hover:text-primary transition-colors">Create New Deck</span>
            </button>
          </div>
        )}
      </div>

      {/* Create Deck Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent onClose={() => setIsCreateDialogOpen(false)} className="glass-card border-2 border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Create New Deck</DialogTitle>
            <DialogDescription className="text-base">
              Name your deck and select a format to begin brewing.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <label className="text-sm font-bold">Deck Name</label>
              <Input
                placeholder="e.g., Goblin Aggro"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateDeck()
                  }
                }}
                autoFocus
                className="bg-card/80 border-2 border-primary/20 focus:border-primary/50 h-11 text-base font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold">Format</label>
              <select
                value={deckFormat}
                onChange={(e) => setDeckFormat(e.target.value)}
                className="w-full px-3 py-2 bg-card/80 border-2 border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 hover:border-primary/30 text-foreground h-11 font-medium"
              >
                {formats.map((format) => (
                  <option key={format} value={format} className="bg-card text-foreground">
                    {format}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false)
                setDeckName('')
                setDeckFormat('Standard')
              }}
              className="border-2 border-primary/30 hover:bg-card/50 font-semibold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateDeck}
              disabled={!deckName.trim() || isCreating}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/30 border-2 border-primary/30"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Deck'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
      `}</style>
    </div>
  )
}
