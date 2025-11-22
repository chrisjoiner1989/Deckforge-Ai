import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import {
  getUserDecks,
  getDeck,
  getDeckCards,
  createDeck,
  updateDeck,
  deleteDeck,
  addCardToDeck,
  updateCardQuantity,
  removeCardFromDeck,
  calculateDeckStats
} from '../services/firestore'

const DeckContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export function useDecks() {
  const context = useContext(DeckContext)
  if (!context) {
    throw new Error('useDecks must be used within a DeckProvider')
  }
  return context
}

export function DeckProvider({ children }) {
  const { user } = useAuth()
  const [decks, setDecks] = useState([])
  const [currentDeck, setCurrentDeck] = useState(null)
  const [currentDeckCards, setCurrentDeckCards] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // ==================== DECK OPERATIONS ====================

  const loadUserDecks = useCallback(async () => {
    if (!user) return

    setLoading(true)
    setError(null)
    try {
      const userDecks = await getUserDecks(user.uid)
      setDecks(userDecks)
    } catch (err) {
      setError(err.message)
      console.error('Error loading user decks:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  const loadDeck = useCallback(async (deckId) => {
    if (!user) return

    setLoading(true)
    setError(null)
    try {
      const [deck, cards] = await Promise.all([
        getDeck(user.uid, deckId),
        getDeckCards(user.uid, deckId)
      ])

      setCurrentDeck(deck)
      setCurrentDeckCards(cards)
      return { deck, cards }
    } catch (err) {
      setError(err.message)
      console.error('Error loading deck:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [user])

  // Load user's decks when they sign in
  useEffect(() => {
    if (user) {
      loadUserDecks()
    } else {
      setDecks([])
      setCurrentDeck(null)
      setCurrentDeckCards([])
    }
  }, [user, loadUserDecks])

  async function createNewDeck(deckData) {
    if (!user) throw new Error('User must be signed in')

    setLoading(true)
    setError(null)
    try {
      const deckId = await createDeck(user.uid, deckData)
      await loadUserDecks() // Refresh the deck list
      return deckId
    } catch (err) {
      setError(err.message)
      console.error('Error creating deck:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function updateCurrentDeck(updates) {
    if (!user || !currentDeck) throw new Error('No deck selected')

    setLoading(true)
    setError(null)
    try {
      await updateDeck(user.uid, currentDeck.id, updates)

      // Update local state
      setCurrentDeck(prev => ({
        ...prev,
        ...updates
      }))

      // Refresh deck list
      await loadUserDecks()
    } catch (err) {
      setError(err.message)
      console.error('Error updating deck:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function deleteCurrentDeck(deckId) {
    if (!user) throw new Error('User must be signed in')

    setLoading(true)
    setError(null)
    try {
      await deleteDeck(user.uid, deckId)

      // Clear current deck if it's the one being deleted
      if (currentDeck?.id === deckId) {
        setCurrentDeck(null)
        setCurrentDeckCards([])
      }

      // Refresh deck list
      await loadUserDecks()
    } catch (err) {
      setError(err.message)
      console.error('Error deleting deck:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // ==================== CARD OPERATIONS ====================

  async function addCard(deckId, cardData, board = 'main') {
    if (!user) throw new Error('User must be signed in')

    setError(null)
    try {
      const cardId = await addCardToDeck(user.uid, deckId, cardData, board)

      // If this is the current deck, reload its cards
      if (currentDeck?.id === deckId) {
        const cards = await getDeckCards(user.uid, deckId)
        setCurrentDeckCards(cards)
      }

      return cardId
    } catch (err) {
      setError(err.message)
      console.error('Error adding card to deck:', err)
      throw err
    }
  }

  async function updateCard(deckId, cardId, quantity) {
    if (!user) throw new Error('User must be signed in')

    setError(null)
    try {
      await updateCardQuantity(user.uid, deckId, cardId, quantity)

      // If this is the current deck, reload its cards
      if (currentDeck?.id === deckId) {
        const cards = await getDeckCards(user.uid, deckId)
        setCurrentDeckCards(cards)
      }

      return true
    } catch (err) {
      setError(err.message)
      console.error('Error updating card quantity:', err)
      throw err
    }
  }

  async function removeCard(deckId, cardId) {
    if (!user) throw new Error('User must be signed in')

    setError(null)
    try {
      await removeCardFromDeck(user.uid, deckId, cardId)

      // If this is the current deck, reload its cards
      if (currentDeck?.id === deckId) {
        const cards = await getDeckCards(user.uid, deckId)
        setCurrentDeckCards(cards)
      }

      return true
    } catch (err) {
      setError(err.message)
      console.error('Error removing card from deck:', err)
      throw err
    }
  }

  // ==================== COMPUTED VALUES ====================

  const deckStats = currentDeckCards.length > 0
    ? calculateDeckStats(currentDeckCards)
    : { totalCards: 0, cardsByCategory: {}, manaCurve: {} }

  const value = {
    // State
    decks,
    currentDeck,
    currentDeckCards,
    loading,
    error,
    deckStats,

    // Deck operations
    loadUserDecks,
    loadDeck,
    createNewDeck,
    updateCurrentDeck,
    deleteCurrentDeck,

    // Card operations
    addCard,
    updateCard,
    removeCard
  }

  return <DeckContext.Provider value={value}>{children}</DeckContext.Provider>
}
