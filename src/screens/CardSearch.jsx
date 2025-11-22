import { useState } from 'react'
import { Search, Filter, Plus, Loader2, ArrowLeft, Layers, X, Check } from 'lucide-react'
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
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilters, setActiveFilters] = useState({})
  
  // Filter options
  const formats = ['Standard', 'Modern', 'Commander', 'Legacy', 'Vintage', 'Pioneer', 'Pauper']
  const rarities = ['Common', 'Uncommon', 'Rare', 'Mythic']
  const types = ['Creature', 'Instant', 'Sorcery', 'Enchantment', 'Artifact', 'Planeswalker', 'Land']

  const handleSearch = async (e) => {
    const query = e?.target?.value ?? searchQuery
    if (e?.target?.value !== undefined) setSearchQuery(query)
    
    if (query.length > 2) {
      setIsLoading(true)
      try {
        // Build complex query
        let complexQuery = query
        
        // Add colors
        if (selectedColors.length > 0) {
          complexQuery += ` c:${selectedColors.join('')}`
        }
        
        // Add filters
        if (activeFilters.format) complexQuery += ` f:${activeFilters.format}`
        if (activeFilters.rarity && activeFilters.rarity.length > 0) {
          complexQuery += ` (${activeFilters.rarity.map(r => `r:${r}`).join(' or ')})`
        }
        if (activeFilters.type && activeFilters.type.length > 0) {
          complexQuery += ` (${activeFilters.type.map(t => `t:${t}`).join(' or ')})`
        }

        const results = await searchCards(complexQuery)
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

  // Trigger search when filters change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyFilters = (newFilters) => {
    setActiveFilters(newFilters)
    setShowFilters(false)
    // Trigger search with new filters
    if (searchQuery.length > 2) {
      // We need to call handleSearch logic but handleSearch expects an event or uses state.
      // Let's extract the search logic or just call it manually.
      // Since handleSearch uses state for filters (which we just updated but state update is async),
      // we should pass the new filters directly or wait.
      // Better: Refactor handleSearch to accept filters as arg or use a useEffect.
      // For now, let's just rely on the user to hit enter or type, OR force a re-search.
      // Actually, let's make handleSearch use the *current* state, which might be stale here.
      // So let's pass filters to a search function.
      
      // Re-implementing search logic here for immediate update:
      setIsLoading(true)
      let complexQuery = searchQuery
      if (selectedColors.length > 0) complexQuery += ` c:${selectedColors.join('')}`
      if (newFilters.format) complexQuery += ` f:${newFilters.format}`
      if (newFilters.rarity?.length > 0) complexQuery += ` (${newFilters.rarity.map(r => `r:${r}`).join(' or ')})`
      if (newFilters.type?.length > 0) complexQuery += ` (${newFilters.type.map(t => `t:${t}`).join(' or ')})`
      
      searchCards(complexQuery).then(setCards).finally(() => setIsLoading(false))
    }
  }

  // Update search when colors change
  const toggleColor = (symbol) => {
    const newColors = selectedColors.includes(symbol)
      ? selectedColors.filter(c => c !== symbol)
      : [...selectedColors, symbol]
    
    setSelectedColors(newColors)
    
    // Trigger search immediately
    if (searchQuery.length > 2) {
      setIsLoading(true)
      let complexQuery = searchQuery
      if (newColors.length > 0) complexQuery += ` c:${newColors.join('')}`
      if (activeFilters.format) complexQuery += ` f:${activeFilters.format}`
      if (activeFilters.rarity?.length > 0) complexQuery += ` (${activeFilters.rarity.map(r => `r:${r}`).join(' or ')})`
      if (activeFilters.type?.length > 0) complexQuery += ` (${activeFilters.type.map(t => `t:${t}`).join(' or ')})`
      
      searchCards(complexQuery).then(setCards).finally(() => setIsLoading(false))
    }
  }

  const colors = [
    { symbol: 'W', name: 'White', svg: 'https://svgs.scryfall.io/card-symbols/W.svg' },
    { symbol: 'U', name: 'Blue', svg: 'https://svgs.scryfall.io/card-symbols/U.svg' },
    { symbol: 'B', name: 'Black', svg: 'https://svgs.scryfall.io/card-symbols/B.svg' },
    { symbol: 'R', name: 'Red', svg: 'https://svgs.scryfall.io/card-symbols/R.svg' },
    { symbol: 'G', name: 'Green', svg: 'https://svgs.scryfall.io/card-symbols/G.svg' },
    { symbol: 'C', name: 'Colorless', svg: 'https://svgs.scryfall.io/card-symbols/C.svg' },
  ]



  const handleAddToDeck = async (card, event, board = 'main') => {
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
        colors: card.colors || [],
        price: card.price || '0.00'
      }

      await addCard(deckId, cardData, board)
      toast.success(`Added ${card.name} to ${board === 'sideboard' ? 'Sideboard' : 'Deck'}!`)
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
      {/* Header / Search Section */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-white/10 pb-6 pt-6 px-6 shadow-2xl">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            {deckId && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(`/deck/${deckId}`)}
                className="hover:bg-white/10 rounded-full"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
            )}
            <div>
              <h1 className="text-3xl font-bold text-glow">Card Search</h1>
              {deckId && (
                <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Adding cards to deck
                </p>
              )}
            </div>
          </div>

          <div className="relative group max-w-3xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500" />
            <div className="relative flex items-center bg-black/50 border border-white/10 rounded-2xl overflow-hidden shadow-inner backdrop-blur-sm">
              <Search className="ml-5 text-muted-foreground group-focus-within:text-primary transition-colors w-6 h-6" />
              <input
                type="text"
                placeholder="Search the multiverse..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full p-5 bg-transparent border-none focus:outline-none text-xl placeholder:text-muted-foreground/50 font-medium text-white"
                autoFocus
              />
              {isLoading && <Loader2 className="mr-5 w-6 h-6 animate-spin text-primary" />}
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center justify-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowFilters(true)}
              className={`rounded-full border-white/10 bg-white/5 hover:bg-white/10 font-semibold ${Object.keys(activeFilters).length > 0 ? 'border-primary text-primary bg-primary/10' : ''}`}
            >
              <Filter className="w-3 h-3 mr-2" />
              Filters
              {Object.keys(activeFilters).length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">
                  {Object.keys(activeFilters).length}
                </Badge>
              )}
            </Button>
            <div className="w-px h-6 bg-white/10 mx-2" />
            {colors.map((color) => (
              <button
                key={color.symbol}
                onClick={() => toggleColor(color.symbol)}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg overflow-hidden
                  ${selectedColors.includes(color.symbol) 
                    ? 'scale-110 ring-2 ring-offset-2 ring-offset-background ring-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]' 
                    : 'opacity-70 hover:opacity-100 hover:scale-105 grayscale hover:grayscale-0'}
                `}
                title={color.name}
              >
                <img src={color.svg} alt={color.name} className="w-full h-full" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {cards.length === 0 && !isLoading ? (
          <div className="text-center py-32 animate-fade-in-up">
            <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <Search className="w-16 h-16 text-muted-foreground" />
            </div>
            <h3 className="text-3xl font-bold mb-4 text-glow">Explore the Archive</h3>
            <p className="text-muted-foreground max-w-md mx-auto text-xl">
              Enter a card name to summon results from the Scryfall database.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {cards.map((card, index) => (
              <div
                key={card.id}
                onClick={() => setSelectedCard(card)}
                className="group relative aspect-[2.5/3.5] rounded-xl overflow-hidden cursor-pointer bg-black/40 border border-white/10 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)] animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
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
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-bold text-white mb-2 line-clamp-1">{card.name}</h3>
                    <div className="flex justify-between items-center gap-2">
                      <Badge variant="outline" className="bg-black/50 backdrop-blur border-white/20 text-white text-xs">
                        {card.set.toUpperCase()}
                      </Badge>
                      {deckId && (
                        <Button
                          size="icon"
                          onClick={(e) => handleAddToDeck(card, e)}
                          disabled={addingCardId === card.id}
                          className="h-8 w-8 rounded-full bg-primary text-white hover:bg-primary/90 shadow-lg hover:scale-110 transition-transform"
                        >
                          {addingCardId === card.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Plus className="w-4 h-4" />
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
        <DialogContent className="glass border border-white/10 max-w-4xl p-0 overflow-hidden gap-0 shadow-2xl">
          {selectedCard && (
            <div className="grid md:grid-cols-2 h-[600px]">
              <div className="bg-black/40 p-8 flex items-center justify-center relative overflow-hidden">
                {/* Background Blur of Card Art */}
                {selectedCard.imageUrl && (
                  <div 
                    className="absolute inset-0 opacity-30 blur-3xl scale-150"
                    style={{ backgroundImage: `url(${selectedCard.imageUrl})`, backgroundPosition: 'center', backgroundSize: 'cover' }}
                  />
                )}
                
                {selectedCard.imageUrl ? (
                  <img
                    src={selectedCard.imageUrl}
                    alt={selectedCard.name}
                    className="rounded-xl shadow-2xl max-h-full relative z-10 border border-white/10 transform hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-64 h-80 bg-card rounded-lg flex items-center justify-center border-2 border-primary/20 relative z-10">
                    No Image
                  </div>
                )}
              </div>

              <div className="flex flex-col h-full bg-background/80 backdrop-blur-xl">
                <div className="p-8 border-b border-white/10">
                  <DialogHeader>
                    <DialogTitle className="text-3xl font-bold mb-2 text-glow">{selectedCard.name}</DialogTitle>
                    <div className="flex items-center gap-3 text-lg font-medium text-muted-foreground">
                      <span>{selectedCard.type}</span>
                      <span className="text-white/20">•</span>
                      <span className="font-mono text-foreground bg-white/5 px-2 py-0.5 rounded">{selectedCard.manaCost}</span>
                    </div>
                  </DialogHeader>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                  {selectedCard.text && (
                    <div className="p-6 rounded-xl bg-white/5 border border-white/5 text-lg leading-relaxed font-serif">
                      {selectedCard.text.split('\n').map((line, i) => (
                        <p key={i} className="mb-2 last:mb-0">{line}</p>
                      ))}
                    </div>
                  )}

                  {selectedCard.flavorText && (
                    <div className="text-sm italic text-muted-foreground border-l-2 border-primary/50 pl-4 py-1">
                      "{selectedCard.flavorText}"
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-xs text-muted-foreground block font-bold uppercase tracking-wider mb-1">Set</span>
                      <span className="font-bold text-lg">{selectedCard.set.toUpperCase()}</span>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-xs text-muted-foreground block font-bold uppercase tracking-wider mb-1">Rarity</span>
                      <span className="font-bold text-lg capitalize">{selectedCard.rarity}</span>
                    </div>
                  </div>
                </div>

                {deckId && (
                  <div className="p-6 border-t border-white/10 bg-black/20 flex gap-3">
                    <Button
                      onClick={(e) => handleAddToDeck(selectedCard, e, 'main')}
                      disabled={addingCardId === selectedCard.id}
                      className="flex-1 h-14 bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90 text-white text-lg font-bold shadow-lg shadow-primary/20 rounded-xl transition-all hover:scale-[1.02]"
                    >
                      {addingCardId === selectedCard.id ? (
                        <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                      ) : (
                        <Plus className="w-6 h-6 mr-2" />
                      )}
                      Add to Main
                    </Button>
                    <Button
                      onClick={(e) => handleAddToDeck(selectedCard, e, 'sideboard')}
                      disabled={addingCardId === selectedCard.id}
                      variant="outline"
                      className="flex-1 h-14 border-2 border-primary/30 hover:bg-primary/10 text-primary text-lg font-bold rounded-xl transition-all hover:scale-[1.02]"
                    >
                      {addingCardId === selectedCard.id ? (
                        <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                      ) : (
                        <Layers className="w-6 h-6 mr-2" />
                      )}
                      Add to Sideboard
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent className="bg-background/95 backdrop-blur-xl border-2 border-primary/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-glow flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" />
              Advanced Filters
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Format */}
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Format</label>
              <div className="flex flex-wrap gap-2">
                {formats.map(format => (
                  <button
                    key={format}
                    onClick={() => setActiveFilters(prev => ({ ...prev, format: prev.format === format.toLowerCase() ? null : format.toLowerCase() }))}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                      activeFilters.format === format.toLowerCase()
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card border-white/10 hover:border-primary/50'
                    }`}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>

            {/* Rarity */}
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Rarity</label>
              <div className="flex flex-wrap gap-2">
                {rarities.map(rarity => {
                  const isSelected = activeFilters.rarity?.includes(rarity.toLowerCase())
                  return (
                    <button
                      key={rarity}
                      onClick={() => {
                        const current = activeFilters.rarity || []
                        const updated = isSelected 
                          ? current.filter(r => r !== rarity.toLowerCase())
                          : [...current, rarity.toLowerCase()]
                        setActiveFilters(prev => ({ ...prev, rarity: updated }))
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                        isSelected
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-card border-white/10 hover:border-primary/50'
                      }`}
                    >
                      {rarity}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Type */}
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Card Type</label>
              <div className="flex flex-wrap gap-2">
                {types.map(type => {
                  const isSelected = activeFilters.type?.includes(type.toLowerCase())
                  return (
                    <button
                      key={type}
                      onClick={() => {
                        const current = activeFilters.type || []
                        const updated = isSelected 
                          ? current.filter(t => t !== type.toLowerCase())
                          : [...current, type.toLowerCase()]
                        setActiveFilters(prev => ({ ...prev, type: updated }))
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                        isSelected
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-card border-white/10 hover:border-primary/50'
                      }`}
                    >
                      {type}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-white/10">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => {
                setActiveFilters({})
                applyFilters({})
              }}
            >
              Clear All
            </Button>
            <Button 
              className="flex-1 bg-primary text-primary-foreground font-bold"
              onClick={() => applyFilters(activeFilters)}
            >
              Apply Filters
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
