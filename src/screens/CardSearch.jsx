import { useState } from 'react'
import { Search, Filter, X, Plus, Loader2, ArrowLeft } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useDecks } from '@/context/DeckContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { searchCards } from '@/services/scryfall'

export default function CardSearch() {
  const location = useLocation()
  const navigate = useNavigate()
  const { addCard } = useDecks()
  const deckId = location.state?.deckId // Check if we're adding to a specific deck
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [cards, setCards] = useState([])
  const [selectedColors, setSelectedColors] = useState([])
  const [selectedCard, setSelectedCard] = useState(null)
  const [addingCardId, setAddingCardId] = useState(null)

  const handleSearch = async (e) => {
    const query = e.target.value
    setSearchQuery(query)
    
    if (query.length > 2) {
      setIsLoading(true)
      try {
        const results = await searchCards(query)
        setCards(results)
      } catch (error) {
        console.error("Search failed:", error)
      } finally {
        setIsLoading(false)
      }
    } else {
      setCards([])
    }
  }

  const colors = [
    { symbol: 'W', name: 'White', class: 'mana-white' },
    { symbol: 'U', name: 'Blue', class: 'mana-blue' },
    { symbol: 'B', name: 'Black', class: 'mana-black' },
    { symbol: 'R', name: 'Red', class: 'mana-red' },
    { symbol: 'G', name: 'Green', class: 'mana-green' },
  ]

  const toggleColor = (symbol) => {
    if (selectedColors.includes(symbol)) {
      setSelectedColors(selectedColors.filter(c => c !== symbol))
    } else {
      setSelectedColors([...selectedColors, symbol])
    }
  }

  const handleAddToDeck = async (card, event) => {
    event?.stopPropagation() // Prevent card details dialog from opening

    if (!deckId) {
      toast.error('No deck selected. Navigate from a deck to add cards.')
      return
    }

    setAddingCardId(card.id)
    try {
      // Transform Scryfall card data to our format
      const cardData = {
        scryfallId: card.id,
        name: card.name,
        type: card.type,
        manaCost: card.manaCost || '',
        cmc: card.cmc || 0,
        imageUrl: card.imageUrl || '',
        text: card.text || '',
        flavorText: card.flavorText || '',
        set: card.set || '',
        rarity: card.rarity || '',
        colors: card.colors || []
      }

      await addCard(cardData)
      toast.success(`Added ${card.name} to deck!`)
    } catch (error) {
      console.error('Failed to add card:', error)
      toast.error('Failed to add card. Please try again.')
    } finally {
      setAddingCardId(null)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header / Search Section */}
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-xl border-b-2 border-primary/20 pb-6 pt-6 px-6 shadow-lg">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex items-center gap-4">
            {deckId && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(`/deck/${deckId}`)}
                className="hover:bg-card/50"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <div>
              <h1 className="text-3xl font-bold">Card Search</h1>
              {deckId && (
                <p className="text-sm text-muted-foreground font-medium">
                  Adding cards to deck
                </p>
              )}
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-amber-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center bg-card/80 border-2 border-primary/20 rounded-xl overflow-hidden shadow-lg transition-all focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary/40">
              <Search className="ml-4 text-primary w-5 h-5" />
              <input
                type="text"
                placeholder="Search the multiverse..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full p-4 bg-transparent border-none focus:outline-none text-lg placeholder:text-muted-foreground/50 font-medium"
                autoFocus
              />
              {isLoading && <Loader2 className="mr-4 w-5 h-5 animate-spin text-primary" />}
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Button variant="outline" size="sm" className="rounded-full border-2 border-primary/30 bg-card/50 hover:bg-card font-semibold">
              <Filter className="w-3 h-3 mr-2" />
              Filters
            </Button>
            <div className="w-px h-6 bg-primary/20 mx-2" />
            {colors.map((color) => (
              <button
                key={color.symbol}
                onClick={() => toggleColor(color.symbol)}
                className={`
                  w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-200 font-bold shadow-md
                  ${selectedColors.includes(color.symbol) ? 'scale-110 ring-2 ring-offset-2 ring-offset-background ring-primary shadow-lg' : 'opacity-80 hover:opacity-100 hover:scale-105'}
                  ${color.class}
                `}
                title={color.name}
              >
                {color.symbol}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {cards.length === 0 && !isLoading ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-6 border-2 border-primary/30 shadow-lg shadow-primary/20">
              <Search className="w-12 h-12 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Explore the Multiverse</h3>
            <p className="text-muted-foreground max-w-sm mx-auto text-lg">
              Search through thousands of Magic cards to find the perfect addition to your deck.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cards.map((card) => (
              <div
                key={card.id}
                onClick={() => setSelectedCard(card)}
                className="group relative aspect-[2.5/3.5] rounded-lg overflow-hidden cursor-pointer bg-card border-2 border-primary/20 hover:border-primary/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/30"
              >
                {card.imageUrl ? (
                  <img 
                    src={card.imageUrl} 
                    alt={card.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-white/5">
                    <span className="font-bold text-lg mb-2">{card.name}</span>
                    <span className="text-xs text-muted-foreground">{card.type}</span>
                  </div>
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-bold text-white mb-2">{card.name}</h3>
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary" className="bg-primary/30 hover:bg-primary/40 text-white border border-primary/50 font-semibold">
                        {card.set}
                      </Badge>
                      {deckId && (
                        <Button
                          size="icon"
                          onClick={(e) => handleAddToDeck(card, e)}
                          disabled={addingCardId === card.id}
                          className="h-9 w-9 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-primary/30 shadow-lg"
                        >
                          {addingCardId === card.id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Plus className="w-5 h-5" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Card Details Dialog */}
      <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
        <DialogContent className="glass-card border-2 border-primary/30 max-w-3xl p-0 overflow-hidden">
          {selectedCard && (
            <div className="grid md:grid-cols-2">
              <div className="bg-background/80 p-8 flex items-center justify-center border-r-2 border-primary/20">
                {selectedCard.imageUrl ? (
                  <img
                    src={selectedCard.imageUrl}
                    alt={selectedCard.name}
                    className="rounded-lg shadow-2xl max-h-[400px] border-2 border-primary/20"
                  />
                ) : (
                  <div className="w-64 h-80 bg-card rounded-lg flex items-center justify-center border-2 border-primary/20">
                    No Image
                  </div>
                )}
              </div>

              <div className="p-8 bg-card/80 backdrop-blur-xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold mb-2">{selectedCard.name}</DialogTitle>
                  <div className="flex items-center gap-2 text-muted-foreground mb-4 font-medium">
                    <span>{selectedCard.type}</span>
                    <span>•</span>
                    <span className="font-mono">{selectedCard.manaCost}</span>
                  </div>
                </DialogHeader>

                <div className="space-y-6">
                  <div className="p-4 rounded-lg bg-background/50 border-2 border-primary/10 text-sm leading-relaxed">
                    {selectedCard.text}
                  </div>

                  {selectedCard.flavorText && (
                    <div className="text-sm italic text-muted-foreground border-l-2 border-primary/50 pl-4 py-2">
                      "{selectedCard.flavorText}"
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-background/50 border border-primary/10">
                      <span className="text-xs text-muted-foreground block font-semibold">Set</span>
                      <span className="font-bold">{selectedCard.set}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-background/50 border border-primary/10">
                      <span className="text-xs text-muted-foreground block font-semibold">Rarity</span>
                      <span className="font-bold">{selectedCard.rarity}</span>
                    </div>
                  </div>

                  {deckId && (
                    <Button
                      onClick={() => handleAddToDeck(selectedCard)}
                      disabled={addingCardId === selectedCard.id}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg font-bold shadow-lg shadow-primary/30 border-2 border-primary/30"
                    >
                      {addingCardId === selectedCard.id ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="w-5 h-5 mr-2" />
                          Add to Deck
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
