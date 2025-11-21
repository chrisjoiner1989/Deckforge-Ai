import { Plus } from 'lucide-react'
import DeckCard from '../components/DeckCard'

export default function DeckList() {
  // Mock data for now - we'll connect to Firebase later
  const mockDecks = [
    {
      id: '1',
      name: 'Goblin Aggro',
      format: 'Standard',
      cardCount: 60,
      lastModified: '2 days ago'
    },
    {
      id: '2',
      name: 'Atraxa Commander',
      format: 'Commander',
      cardCount: 100,
      lastModified: '1 week ago'
    },
    {
      id: '3',
      name: 'Control Blue',
      format: 'Modern',
      cardCount: 60,
      lastModified: '3 days ago'
    },
  ]

  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold mb-4">My Decks</h1>

      {mockDecks.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No decks yet. Create your first deck!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {mockDecks.map(deck => (
            <DeckCard key={deck.id} deck={deck} />
          ))}
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => console.log('Create new deck')}
        className="fixed bottom-20 right-4 bg-primary text-primary-foreground rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
      >
        <Plus size={24} />
      </button>
    </div>
  )
}
