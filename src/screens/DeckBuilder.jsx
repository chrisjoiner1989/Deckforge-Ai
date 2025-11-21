import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, BarChart3, Sparkles, Loader2, TrendingUp, AlertTriangle, CheckCircle2, Layers, Save } from 'lucide-react'
import { toast } from 'sonner'
import { useDecks } from '@/context/DeckContext'
import { analyzeDeck } from '@/services/ai'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DeckBuilder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentDeck, currentDeckCards, loading, deckStats, loadDeck, removeCard } = useDecks()
  const [activeTab, setActiveTab] = useState('deck')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)

  // Load deck on mount
  useEffect(() => {
    if (id) {
      loadDeck(id).catch(error => {
        console.error('Failed to load deck:', error)
        toast.error('Failed to load deck. Redirecting...')
        setTimeout(() => navigate('/decks'), 2000)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleAnalyzeDeck = async () => {
    if (!currentDeck || !currentDeckCards) return

    setIsAnalyzing(true)
    try {
      const result = await analyzeDeck(currentDeck, currentDeckCards)
      setAnalysis(result)
      toast.success('Deck analysis complete!')
    } catch (error) {
      console.error("Failed to analyze deck:", error)
      toast.error('Failed to analyze deck. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleRemoveCard = async (cardId) => {
    if (!id) {
      toast.error('No deck selected')
      return
    }

    try {
      await removeCard(id, cardId)
      toast.success('Card removed from deck')
    } catch (error) {
      console.error('Failed to remove card:', error)
      toast.error('Failed to remove card. Please try again.')
    }
  }

  const handleAddCards = () => {
    // Navigate to search page with deck id in state so we can add cards
    navigate('/search', { state: { deckId: id } })
  }

  // Show loading state
  if (loading || !currentDeck) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-28 h-28 bg-gradient-to-br from-primary to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-6 border-2 border-primary/30 shadow-lg shadow-primary/20">
            <Loader2 className="w-14 h-14 text-primary-foreground animate-spin" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Loading Deck...</h3>
          <p className="text-muted-foreground max-w-sm mx-auto text-lg">
            Summoning your cards from the library
          </p>
        </div>
      </div>
    )
  }

  const deck = currentDeck
  const deckCards = currentDeckCards || []
  const totalCards = deckStats?.totalCards || 0

  // Group cards by category
  const cardsByCategory = deckCards.reduce((acc, card) => {
    if (!acc[card.category]) acc[card.category] = []
    acc[card.category].push(card)
    return acc
  }, {})

  // Calculate mana curve - use deckStats if available, otherwise calculate
  const manaCurve = deckStats?.manaCurve || deckCards.reduce((acc, card) => {
    const cmc = Math.min(card.cmc || 0, 7)
    acc[cmc] = (acc[cmc] || 0) + card.quantity
    return acc
  }, {})

  const maxCurveValue = Object.keys(manaCurve).length > 0
    ? Math.max(...Object.values(manaCurve))
    : 1 // Default to 1 if no cards

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-xl border-b-2 border-primary/20 px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/decks')} className="hover:bg-card/50">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                {deck.name}
                <Badge variant="outline" className="text-xs font-semibold border-2 border-primary/30 bg-primary/10 text-primary">
                  {deck.format}
                </Badge>
              </h1>
              <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                <span className="flex items-center gap-1">
                  <Layers className="w-3 h-3 text-primary" /> {totalCards} Cards
                </span>
                {deckStats?.totalValue && (
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-green-500" /> ${deckStats.totalValue.toFixed(2)} Value
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleAddCards}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 font-semibold border-2 border-primary/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Cards
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card/50 border-2 border-primary/20 p-1 rounded-xl shadow-md">
            <TabsTrigger value="deck" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold">Deck List</TabsTrigger>
            <TabsTrigger value="stats" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold">Stats & Curve</TabsTrigger>
            <TabsTrigger value="ai" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold">
              <Sparkles className="w-4 h-4 mr-2" />
              Analysis
            </TabsTrigger>
          </TabsList>

          {/* Deck List Tab */}
          <TabsContent value="deck" className="space-y-6 animate-fade-in">
            {deckCards.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-28 h-28 bg-gradient-to-br from-primary to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-6 border-2 border-primary/30 shadow-lg shadow-primary/20">
                  <Plus className="w-14 h-14 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Empty Deck</h3>
                <p className="text-muted-foreground mb-8 max-w-sm mx-auto text-lg">
                  Start building your deck by adding cards from the multiverse.
                </p>
                <Button
                  onClick={handleAddCards}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-6 font-bold shadow-lg shadow-primary/30 border-2 border-primary/30"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Cards
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {/* Main Deck Column */}
                <div className="md:col-span-2 space-y-6">
                  {Object.entries(cardsByCategory).map(([category, cards]) => (
                  <div key={category} className="space-y-3">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider pl-1 flex items-center justify-between border-b-2 border-primary/20 pb-2">
                      {category}
                      <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full font-bold border border-primary/30">{cards.reduce((s, c) => s + c.quantity, 0)}</span>
                    </h3>
                    <div className="space-y-2">
                      {cards.map((card) => (
                        <div key={card.id} className="group flex items-center gap-3 p-3 rounded-lg bg-card/80 border-2 border-primary/10 hover:border-primary/40 hover:bg-card transition-all cursor-pointer hover:shadow-md">
                          <div className="w-9 h-9 flex items-center justify-center bg-primary/10 rounded-lg font-bold text-sm border-2 border-primary/30 text-primary">
                            {card.quantity}
                          </div>
                          <div className="w-11 h-11 rounded-lg bg-background/50 overflow-hidden border-2 border-primary/20">
                            <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold group-hover:text-primary transition-colors">{card.name}</div>
                            <div className="text-xs text-muted-foreground font-medium">{card.type}</div>
                          </div>
                          <div className="font-mono text-sm font-semibold text-muted-foreground">{card.manaCost}</div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveCard(card.id)}
                            className="opacity-0 group-hover:opacity-100 h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Stats Column */}
              <div className="space-y-6">
                <div className="glass-card p-6 rounded-xl sticky top-24 border-2 border-primary/20">
                  <h3 className="font-bold mb-4 flex items-center gap-2 text-lg">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Mana Curve
                  </h3>
                  <div className="flex items-end justify-between h-32 gap-2">
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((cmc) => {
                      const count = manaCurve[cmc] || 0
                      const height = maxCurveValue ? (count / maxCurveValue) * 100 : 0
                      return (
                        <div key={cmc} className="flex-1 flex flex-col items-center gap-2 group">
                          <div className="w-full bg-card rounded-t relative h-full flex items-end overflow-hidden border-2 border-primary/20">
                            <div
                              className="w-full bg-gradient-to-t from-primary to-amber-500 group-hover:from-primary/80 group-hover:to-amber-400 transition-all duration-500 rounded-t"
                              style={{ height: `${height}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono font-bold text-muted-foreground">{cmc === 7 ? '7+' : cmc}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="animate-fade-in">
             <div className="grid md:grid-cols-2 gap-6">
               <div className="glass-card p-6 rounded-2xl">
                 <h3 className="font-bold mb-4">Color Distribution</h3>
                 <div className="flex h-4 rounded-full overflow-hidden">
                   <div className="bg-red-500 w-[85%]" />
                   <div className="bg-green-500 w-[15%]" />
                 </div>
                 <div className="flex gap-4 mt-4 text-sm">
                   <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-500" />
                     <span>Red (85%)</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full bg-green-500" />
                     <span>Green (15%)</span>
                   </div>
                 </div>
               </div>
             </div>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="ai" className="space-y-6 animate-fade-in">
            {!analysis ? (
              <div className="text-center py-12 glass-card rounded-2xl border-dashed border-2 border-primary/30">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-6 border-2 border-primary/30 shadow-lg shadow-primary/20">
                  <Sparkles className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Deck Analysis</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
                  Get detailed insights on your deck's synergies, mana curve, and competitive strength.
                </p>
                <Button
                  size="lg"
                  onClick={handleAnalyzeDeck}
                  disabled={isAnalyzing}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-14 px-8 text-lg shadow-xl shadow-primary/30 font-bold border-2 border-primary/30"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing Deck...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Analyze Deck
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Score Card */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="glass-card p-6 rounded-xl flex flex-col items-center justify-center text-center relative overflow-hidden border-2 border-primary/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                    <div className="relative z-10">
                      <div className="text-sm text-muted-foreground uppercase tracking-wider mb-2 font-bold">Power Level</div>
                      <div className="text-6xl font-bold text-primary mb-2">{analysis.score}</div>
                      <Badge variant="outline" className="bg-primary/20 text-primary border-2 border-primary/50 text-lg px-4 py-1 font-bold">
                        {analysis.grade}
                      </Badge>
                    </div>
                  </div>

                  <div className="md:col-span-2 glass-card p-6 rounded-xl border-2 border-primary/20">
                    <h3 className="font-bold mb-4 flex items-center gap-2 text-lg">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Analysis Summary
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-base">
                      {analysis.summary}
                    </p>
                  </div>
                </div>

                {/* Synergies */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        Key Synergies
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {analysis.synergies.map((synergy, i) => (
                          <li key={i} className="flex flex-col gap-1 p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-sm">{synergy.name}</span>
                              <Badge variant="outline" className="text-[10px] h-5 border-green-500/50 text-green-500">
                                {synergy.rating} Impact
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{synergy.description}</p>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Suggestions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        Suggestions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {analysis.suggestions.map((suggestion, i) => (
                          <li key={i} className="flex flex-col gap-1 p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-sm">{suggestion.name}</span>
                              <div className="flex items-center gap-2 text-xs">
                                <span className="text-green-500 font-mono">+{suggestion.add}</span>
                                <span className="text-red-500 font-mono">-{suggestion.cut}</span>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
