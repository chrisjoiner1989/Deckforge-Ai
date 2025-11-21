import { createContext, useContext, useState, useEffect } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { auth } from '../services/firebase'

// Create the context
const AuthContext = createContext()

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

// Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    // Cleanup subscription
    return unsubscribe
  }, [])

  // Sign up function
  const signUp = async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      return { user: result.user, error: null }
    } catch (error) {
      return { user: null, error: error.message }
    }
  }

  // Sign in function
  const signIn = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return { user: result.user, error: null }
    } catch (error) {
      return { user: null, error: error.message }
    }
  }

  // Sign out function
  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  }

  // Helper function to format OAuth error messages
  const getOAuthErrorMessage = (error) => {
    switch (error.code) {
      case 'auth/popup-blocked':
        return 'Popup was blocked by your browser. Please allow popups and try again.'
      case 'auth/popup-closed-by-user':
        return 'Sign-in cancelled. Please try again.'
      case 'auth/cancelled-popup-request':
        return 'Only one popup request is allowed at a time.'
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with the same email address but different sign-in credentials. Try signing in using a different method.'
      case 'auth/invalid-credential':
        return 'The credential is invalid or has expired. Please try again.'
      case 'auth/operation-not-allowed':
        return 'This sign-in method is not enabled. Please contact support.'
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.'
      default:
        return error.message || 'An error occurred during sign-in. Please try again.'
    }
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      // Optional: Add custom parameters
      provider.setCustomParameters({
        prompt: 'select_account' // Forces account selection
      })
      const result = await signInWithPopup(auth, provider)
      return { user: result.user, error: null }
    } catch (error) {
      return { user: null, error: getOAuthErrorMessage(error) }
    }
  }

  // Sign in with Apple
  const signInWithApple = async () => {
    try {
      const provider = new OAuthProvider('apple.com')
      // Optional: Request additional scopes
      provider.addScope('email')
      provider.addScope('name')
      const result = await signInWithPopup(auth, provider)
      return { user: result.user, error: null }
    } catch (error) {
      return { user: null, error: getOAuthErrorMessage(error) }
    }
  }

  // Sign in with Facebook
  const signInWithFacebook = async () => {
    try {
      const provider = new FacebookAuthProvider()
      // Optional: Request additional permissions
      provider.addScope('email')
      const result = await signInWithPopup(auth, provider)
      return { user: result.user, error: null }
    } catch (error) {
      return { user: null, error: getOAuthErrorMessage(error) }
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    signInWithApple,
    signInWithFacebook,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
