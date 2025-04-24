import React, { useState, useEffect } from 'react'
import Flashcard from './Flashcard'
import stateCapitals from './stateCapitals'

const FlashcardManager = () => {
  const [currentCard, setCurrentCard] = useState({ question: '', answer: '' })

  // Function to get a random state
  const getRandomState = () => {
    const randomIndex = Math.floor(Math.random() * stateCapitals.length)
    const stateData = stateCapitals[randomIndex]
    setCurrentCard({
      question: `What is the capital of ${stateData.state}?`,
      answer: stateData.capital
    })
  }

  // Get initial random state when component mounts
  useEffect(() => {
    getRandomState()
  }, [])

  return (
    <div className='container p-4'>
      <h5 className='h5 mb-4'>State Capitals Flashcards</h5>
      <Flashcard question={currentCard.question} answer={currentCard.answer} />
      <button onClick={getRandomState} className='btn btn-primary mt-3'>
        Next Card
      </button>
    </div>
  )
}

export default FlashcardManager
