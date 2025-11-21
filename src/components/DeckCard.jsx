import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function DeckCard({ deck }) {
  return (
    <Link to={`/deck/${deck.id}`}>
      <div className="bg-card border rounded-lg p-4 flex justify-between items-center hover:bg-accent transition-colors">
        <div className="flex-1">
          <h3 className="font-bold text-lg">{deck.name}</h3>
          <p className="text-sm text-muted-foreground">
            {deck.format} • {deck.cardCount} cards
          </p>
          {deck.lastModified && (
            <p className="text-xs text-muted-foreground mt-1">
              Updated {deck.lastModified}
            </p>
          )}
        </div>
        <ChevronRight className="text-muted-foreground flex-shrink-0" size={20} />
      </div>
    </Link>
  )
}
