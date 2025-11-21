import { Search } from 'lucide-react'

export default function CardSearch() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Card Search</h1>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
        <input
          type="text"
          placeholder="Search for cards..."
          className="w-full pl-10 pr-4 py-2 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="text-center py-12 text-muted-foreground">
        <p>Card search coming soon...</p>
        <p className="text-sm mt-2">We'll use the Scryfall API to search cards</p>
      </div>
    </div>
  )
}
