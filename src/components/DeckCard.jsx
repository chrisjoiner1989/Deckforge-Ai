import { ChevronRight, Layers, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'

export default function DeckCard({ deck }) {
  // Mock color identity for visual flair
  const colors = ['R', 'G'] 
  
  const colorMap = {
    W: 'bg-yellow-100 text-yellow-900',
    U: 'bg-blue-100 text-blue-900',
    B: 'bg-gray-800 text-white',
    R: 'bg-red-100 text-red-900',
    G: 'bg-green-100 text-green-900'
  }

  return (
    <Link to={`/deck/${deck.id}`} className="block group">
      <div className="glass-card rounded-2xl p-1 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-primary/20">
        <div className="bg-card/50 rounded-xl p-5 h-full flex flex-col relative overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:scale-150 duration-500" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-1">
                {colors.map(c => (
                  <div key={c} className={`w-3 h-3 rounded-full ${c === 'R' ? 'bg-red-500' : 'bg-green-500'}`} />
                ))}
              </div>
              <Badge variant="outline" className="bg-background/50 backdrop-blur border-white/10">
                {deck.format}
              </Badge>
            </div>

            <h3 className="font-bold text-xl mb-1 group-hover:text-primary transition-colors line-clamp-1">
              {deck.name}
            </h3>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
              <div className="flex items-center gap-1.5">
                <Layers size={14} />
                <span>{deck.cardCount} cards</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={14} />
                <span>{deck.lastModified}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              View Deck
            </span>
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
              <ChevronRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
