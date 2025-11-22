import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'
import { db } from './firebase'

// ==================== DECK OPERATIONS ====================

/**
 * Get all decks for a user
 * @param {string} userId - The user's ID
 * @returns {Promise<Array>} Array of deck objects with IDs
 */
export async function getUserDecks(userId) {
  try {
    const decksRef = collection(db, 'users', userId, 'decks')
    const q = query(decksRef, orderBy('updatedAt', 'desc'))
    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error getting user decks:', error)
    throw error
  }
}

/**
 * Get a single deck by ID
 * @param {string} userId - The user's ID
 * @param {string} deckId - The deck's ID
 * @returns {Promise<Object>} Deck object with ID
 */
export async function getDeck(userId, deckId) {
  try {
    const deckRef = doc(db, 'users', userId, 'decks', deckId)
    const deckSnap = await getDoc(deckRef)

    if (!deckSnap.exists()) {
      throw new Error('Deck not found')
    }

    return {
      id: deckSnap.id,
      ...deckSnap.data()
    }
  } catch (error) {
    console.error('Error getting deck:', error)
    throw error
  }
}

/**
 * Create a new deck
 * @param {string} userId - The user's ID
 * @param {Object} deckData - Deck data (name, format, description)
 * @returns {Promise<string>} The new deck's ID
 */
export async function createDeck(userId, deckData) {
  try {
    const decksRef = collection(db, 'users', userId, 'decks')
    const newDeck = {
      name: deckData.name,
      format: deckData.format || 'Standard',
      description: deckData.description || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    const docRef = await addDoc(decksRef, newDeck)
    return docRef.id
  } catch (error) {
    console.error('Error creating deck:', error)
    throw error
  }
}

/**
 * Update a deck
 * @param {string} userId - The user's ID
 * @param {string} deckId - The deck's ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export async function updateDeck(userId, deckId, updates) {
  try {
    const deckRef = doc(db, 'users', userId, 'decks', deckId)
    await updateDoc(deckRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error updating deck:', error)
    throw error
  }
}

/**
 * Delete a deck and all its cards
 * @param {string} userId - The user's ID
 * @param {string} deckId - The deck's ID
 * @returns {Promise<void>}
 */
export async function deleteDeck(userId, deckId) {
  try {
    // Delete all cards in the deck first
    const cardsRef = collection(db, 'users', userId, 'decks', deckId, 'cards')
    const cardsSnapshot = await getDocs(cardsRef)

    const deletePromises = cardsSnapshot.docs.map(cardDoc =>
      deleteDoc(cardDoc.ref)
    )
    await Promise.all(deletePromises)

    // Then delete the deck
    const deckRef = doc(db, 'users', userId, 'decks', deckId)
    await deleteDoc(deckRef)
  } catch (error) {
    console.error('Error deleting deck:', error)
    throw error
  }
}

// ==================== CARD OPERATIONS ====================

/**
 * Get all cards in a deck
 * @param {string} userId - The user's ID
 * @param {string} deckId - The deck's ID
 * @returns {Promise<Array>} Array of card objects
 */
export async function getDeckCards(userId, deckId) {
  try {
    const cardsRef = collection(db, 'users', userId, 'decks', deckId, 'cards')
    const snapshot = await getDocs(cardsRef)

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error getting deck cards:', error)
    throw error
  }
}

/**
 * Add a card to a deck
 * @param {string} userId - The user's ID
 * @param {string} deckId - The deck's ID
 * @param {Object} cardData - Card data from Scryfall
 * @param {string} board - 'main' or 'sideboard' (default: 'main')
 * @returns {Promise<string>} The card document ID
 */
export async function addCardToDeck(userId, deckId, cardData, board = 'main') {
  try {
    const cardsRef = collection(db, 'users', userId, 'decks', deckId, 'cards')

    // Check if card already exists in deck AND in the same board
    const q = query(
      cardsRef, 
      where('scryfallId', '==', cardData.id),
      where('board', '==', board)
    )
    const existingCards = await getDocs(q)

    if (!existingCards.empty) {
      // Card exists in this board, increment quantity
      const existingCard = existingCards.docs[0]
      const currentQuantity = existingCard.data().quantity || 1
      await updateDoc(existingCard.ref, {
        quantity: currentQuantity + 1
      })
      return existingCard.id
    } else {
      // Card doesn't exist in this board, add it
      const newCard = {
        scryfallId: cardData.id,
        name: cardData.name,
        type: cardData.type,
        manaCost: cardData.manaCost || '',
        cmc: cardData.cmc || 0,
        imageUrl: cardData.imageUrl || '',
        category: determineCardCategory(cardData.type),
        quantity: 1,
        board: board,
        price: cardData.price || '0.00',
        addedAt: serverTimestamp()
      }

      const docRef = await addDoc(cardsRef, newCard)

      // Update deck's updatedAt timestamp
      await updateDeck(userId, deckId, {})

      return docRef.id
    }
  } catch (error) {
    console.error('Error adding card to deck:', error)
    throw error
  }
}

/**
 * Update card quantity in a deck
 * @param {string} userId - The user's ID
 * @param {string} deckId - The deck's ID
 * @param {string} cardId - The card document ID
 * @param {number} quantity - New quantity
 * @returns {Promise<void>}
 */
export async function updateCardQuantity(userId, deckId, cardId, quantity) {
  try {
    if (quantity <= 0) {
      // If quantity is 0 or less, remove the card
      await removeCardFromDeck(userId, deckId, cardId)
      return
    }

    const cardRef = doc(db, 'users', userId, 'decks', deckId, 'cards', cardId)
    await updateDoc(cardRef, { quantity })

    // Update deck's updatedAt timestamp
    await updateDeck(userId, deckId, {})
  } catch (error) {
    console.error('Error updating card quantity:', error)
    throw error
  }
}

/**
 * Remove a card from a deck
 * @param {string} userId - The user's ID
 * @param {string} deckId - The deck's ID
 * @param {string} cardId - The card document ID
 * @returns {Promise<void>}
 */
export async function removeCardFromDeck(userId, deckId, cardId) {
  try {
    const cardRef = doc(db, 'users', userId, 'decks', deckId, 'cards', cardId)
    await deleteDoc(cardRef)

    // Update deck's updatedAt timestamp
    await updateDeck(userId, deckId, {})
  } catch (error) {
    console.error('Error removing card from deck:', error)
    throw error
  }
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Determine card category based on type line
 * @param {string} typeLine - The card's type line
 * @returns {string} Category (Creatures, Spells, or Lands)
 */
function determineCardCategory(typeLine) {
  const typeLineLower = typeLine.toLowerCase()

  if (typeLineLower.includes('creature')) {
    return 'Creatures'
  } else if (typeLineLower.includes('land')) {
    return 'Lands'
  } else {
    // Instants, Sorceries, Enchantments, Artifacts, Planeswalkers
    return 'Spells'
  }
}

/**
 * Get deck statistics
 * @param {Array} cards - Array of card objects
 * @returns {Object} Statistics object
 */
export function calculateDeckStats(cards) {
  const mainDeckCards = cards.filter(card => card.board !== 'sideboard')
  const sideboardCards = cards.filter(card => card.board === 'sideboard')

  const totalCards = mainDeckCards.reduce((sum, card) => sum + (card.quantity || 1), 0)
  const totalSideboard = sideboardCards.reduce((sum, card) => sum + (card.quantity || 1), 0)

  const cardsByCategory = mainDeckCards.reduce((acc, card) => {
    const category = card.category || 'Spells'
    if (!acc[category]) acc[category] = []
    acc[category].push(card)
    return acc
  }, {})

  const manaCurve = mainDeckCards.reduce((acc, card) => {
    // Skip lands for mana curve
    if (card.category === 'Lands') return acc
    
    const cmc = Math.min(card.cmc || 0, 7)
    const quantity = card.quantity || 1
    acc[cmc] = (acc[cmc] || 0) + quantity
    return acc
  }, {})

  // Calculate total value if prices are available (mock for now or if added later)
  const totalValue = cards.reduce((sum, card) => {
    const price = parseFloat(card.price || 0)
    return sum + (price * (card.quantity || 1))
  }, 0)

  return {
    totalCards,
    totalSideboard,
    cardsByCategory,
    manaCurve,
    totalValue
  }
}
