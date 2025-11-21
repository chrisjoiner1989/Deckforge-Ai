import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Loader2 } from 'lucide-react'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-6 border-2 border-primary/30 shadow-lg shadow-primary/20">
            <Loader2 className="w-10 h-10 text-primary-foreground animate-spin" />
          </div>
          <p className="text-muted-foreground text-lg font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to auth page if not signed in
  if (!user) {
    return <Navigate to="/auth" replace />
  }

  // User is authenticated, render the protected content
  return children
}
