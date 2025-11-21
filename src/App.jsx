import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import Home from './screens/Home'
import DeckList from './screens/DeckList'
import DeckBuilder from './screens/DeckBuilder'
import CardSearch from './screens/CardSearch'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background pb-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/decks" element={<DeckList />} />
          <Route path="/deck/:id" element={<DeckBuilder />} />
          <Route path="/search" element={<CardSearch />} />
          <Route path="/profile" element={
            <div className="p-4">
              <h1 className="text-2xl font-bold">Profile</h1>
              <p className="text-muted-foreground mt-2">Coming soon...</p>
            </div>
          } />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}

export default App
