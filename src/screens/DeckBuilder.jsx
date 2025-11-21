import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function DeckBuilder() {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <button
          onClick={() => navigate('/decks')}
          className="mr-3 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft />
        </button>
        <h1 className="text-2xl font-bold">Deck Builder</h1>
      </div>

      <div className="text-center py-12 text-muted-foreground">
        <p>Deck ID: {id}</p>
        <p className="mt-2">Deck builder coming soon...</p>
      </div>
    </div>
  )
}
