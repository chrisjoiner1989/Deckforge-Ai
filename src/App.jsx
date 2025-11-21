import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from './context/AuthContext'
import { DeckProvider } from './context/DeckContext'
import ErrorBoundary from './components/ErrorBoundary'
import ProtectedRoute from './components/ProtectedRoute'
import BottomNav from './components/BottomNav'
import Home from './screens/Home'
import DeckList from './screens/DeckList'
import DeckBuilder from './screens/DeckBuilder'
import CardSearch from './screens/CardSearch'
import Auth from './screens/Auth'
import Profile from './screens/Profile'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <DeckProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-background pb-16">
              <Toaster
                position="top-center"
                toastOptions={{
                  style: {
                    background: 'var(--card)',
                    color: 'var(--card-foreground)',
                    border: '2px solid',
                    borderColor: 'var(--primary)',
                    borderRadius: '0.75rem',
                  },
                }}
              />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route
                  path="/decks"
                  element={
                    <ProtectedRoute>
                      <DeckList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/deck/:id"
                  element={
                    <ProtectedRoute>
                      <DeckBuilder />
                    </ProtectedRoute>
                  }
                />
                <Route path="/search" element={<CardSearch />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
              </Routes>
              <BottomNav />
            </div>
          </BrowserRouter>
        </DeckProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
