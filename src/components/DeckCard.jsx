import { ChevronRight, Layers, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'

export default function DeckCard({ deck }) {
  // Mock color identity for visual flair - in a real app this would come from the deck prop
  const colors = deck.colors || ['R', 'G'] 
  
  const colorMap = {
    W: 'bg-gradient-mana-w shadow-[0_0_10px_var(--mana-w)]',
    U: 'bg-gradient-mana-u shadow-[0_0_10px_var(--mana-u)]',
    B: 'bg-gradient-mana-b shadow-[0_0_10px_var(--mana-b)]',
    R: 'bg-gradient-mana-r shadow-[0_0_10px_var(--mana-r)]',
    G: 'bg-gradient-mana-g shadow-[0_0_10px_var(--mana-g)]',
    C: 'bg-gradient-to-br from-gray-400 to-gray-600'
  }

  return (
    <Link to={`/deck/${deck.id}`} className="block group relative">
      {/* Hover Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-purple-600/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
      
      <div className="glass-card rounded-2xl p-0.5 relative overflow-hidden h-full">
        {/* Shimmer Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer z-20 pointer-events-none" />

        <div className="bg-card/60 backdrop-blur-sm rounded-[14px] p-5 h-full flex flex-col relative overflow-hidden">
          {/* Background Ambient Gradient */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-primary/20 duration-500" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="flex -space-x-2">
                {colors.map((c, i) => (
                  <div 
                    key={`${c}-${i}`} 
                    className={`w-6 h-6 rounded-full border-2 border-card ${colorMap[c] || 'bg-gray-500'} flex items-center justify-center text-[10px] font-bold text-white shadow-sm z-${10-i}`}
                  >
                    <span className="drop-shadow-md">{c}</span>
                  </div>
                ))}
              </div>
              <Badge variant="outline" className="bg-black/40 backdrop-blur border-white/10 text-xs uppercase tracking-wider font-semibold text-muted-foreground group-hover:text-primary group-hover:border-primary/50 transition-colors">
                {deck.format}
              </Badge>
            </div>

            <h3 className="font-bold text-xl mb-1 text-foreground group-hover:text-gradient-gold transition-all line-clamp-1 tracking-tight">
              {deck.name}
            </h3>
            
            <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mt-4">
              <div className="flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded-md border border-white/5">
                <Layers size={12} className="text-primary" />
                <span>{deck.cardCount} cards</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded-md border border-white/5">
                <Calendar size={12} className="text-primary" />
                <span>{deck.lastModified}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
            <span className="text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors uppercase tracking-widest">
              Open Deck
            </span>
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all shadow-lg group-hover:shadow-primary/50">
              <ChevronRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
