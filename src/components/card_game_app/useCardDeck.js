import { useState, useCallback, useRef } from 'react'

// Define the card suits and values
const suits = ['hearts', 'diamonds', 'clubs', 'spades']
const values = [
  'A',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K'
]

// Create the deck of cards
const createDeck = () =>
  suits.flatMap(suit => values.map(value => ({ suit, value })))

// Shuffle the deck using the Fisher-Yates algorithm
const shuffleDeck = deck => {
  const shuffledDeck = [...deck]
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]]
  }
  return shuffledDeck
}

// Custom hook for managing the card deck
const useCardDeck = () => {
  const [deck, setDeck] = useState(() => shuffleDeck(createDeck()))
  const currentIndexRef = useRef(0)

  const dealCards = useCallback(
    count => {
      if (currentIndexRef.current + count <= deck.length) {
        const dealtCards = deck.slice(
          currentIndexRef.current,
          currentIndexRef.current + count
        )
        currentIndexRef.current += count
        return dealtCards
      }
      return []
    },
    [deck]
  )

  const resetDeck = useCallback(() => {
    setDeck(shuffleDeck(createDeck()))
    currentIndexRef.current = 0
  }, [])

  return {
    dealCards,
    resetDeck,
    remainingCards: deck.length - currentIndexRef.current
  }
}

export default useCardDeck
