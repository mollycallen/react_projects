import React, { useState, useEffect, useCallback } from 'react'
import Flashcard from './Flashcard'
import stateCapitals from './stateCapitals'
import planetData from './planetData'

// Constants for question types
const QUESTION_TYPES = {
  MULTIPLICATION: 'multiplication',
  CAPITALS: 'capitals',
  ASTRONOMY: 'astronomy'
}

const FlashcardManager = () => {
  const [cards, setCards] = useState([])
  const [questionType, setQuestionType] = useState(
    QUESTION_TYPES.MULTIPLICATION
  )
  const [cardCount, setCardCount] = useState(3)

  // Function to generate a random multiplication question
  const getRandomMultiplication = () => {
    const num1 = Math.floor(Math.random() * 12) + 1
    const num2 = Math.floor(Math.random() * 12) + 1
    const answer = num1 * num2
    return {
      question: `What is ${num1} × ${num2}?`,
      answer: answer.toString()
    }
  }

  // Function to get a random state
  const getRandomState = () => {
    const randomIndex = Math.floor(Math.random() * stateCapitals.length)
    const stateData = stateCapitals[randomIndex]
    return {
      question: `What is the capital of ${stateData.state}?`,
      answer: stateData.capital
    }
  }

  // Function to get a random planet question
  const getRandomPlanet = () => {
    const randomIndex = Math.floor(Math.random() * planetData.length)
    const planet = planetData[randomIndex]
    return {
      question: `${planet.description}?`,
      answer: planet.planet
    }
  }

  // Function to get new unique questions based on selected type and count
  const getNextQuestions = useCallback(() => {
    const getQuestion = () => {
      switch (questionType) {
        case QUESTION_TYPES.MULTIPLICATION:
          return getRandomMultiplication()
        case QUESTION_TYPES.CAPITALS:
          return getRandomState()
        case QUESTION_TYPES.ASTRONOMY:
          return getRandomPlanet()
        default:
          return getRandomMultiplication()
      }
    }

    const uniqueQuestions = new Set()
    const newCards = []

    while (uniqueQuestions.size < cardCount) {
      const newQuestion = getQuestion()
      if (!uniqueQuestions.has(newQuestion.question)) {
        uniqueQuestions.add(newQuestion.question)
        newCards.push({
          ...newQuestion,
          key: Date.now() + Math.random()
        })
      }
    }

    setCards(newCards)
  }, [questionType, cardCount])

  // Update questions when type changes, card count changes, or component mounts
  useEffect(() => {
    getNextQuestions()
  }, [getNextQuestions])

  return (
    <div className='container-fluid py-5 bg-light'>
      <div className='row justify-content-center'>
        <div className='col-12 col-lg-10'>
          <div className='card shadow-lg border-0'>
            <div className='card-header bg-primary text-white py-4'>
              <h3 className='mb-0 text-center'>Flashcards</h3>
              <div className='mt-3 d-flex flex-wrap justify-content-center align-items-center'>
                <div className='mx-3 mb-2 mb-md-0'>
                  <label
                    htmlFor='questionType'
                    className='form-label me-2 fw-bold'
                  >
                    Question Type:
                  </label>
                  <select
                    id='questionType'
                    className='form-select form-select-sm'
                    value={questionType}
                    onChange={e => setQuestionType(e.target.value)}
                  >
                    <option value={QUESTION_TYPES.MULTIPLICATION}>
                      Multiplication
                    </option>
                    <option value={QUESTION_TYPES.CAPITALS}>
                      State Capitals
                    </option>
                    <option value={QUESTION_TYPES.ASTRONOMY}>Astronomy</option>
                  </select>
                </div>
                <div className='mx-3'>
                  <label
                    htmlFor='cardCount'
                    className='form-label me-2 fw-bold'
                  >
                    Number of Cards:
                  </label>
                  <select
                    id='cardCount'
                    className='form-select form-select-sm'
                    value={cardCount}
                    onChange={e => setCardCount(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className='card-body'>
              <div className='d-flex flex-row flex-wrap justify-content-center gap-3 mb-4'>
                {cards.map(card => (
                  <div key={card.key} style={{ width: '250px' }}>
                    <Flashcard question={card.question} answer={card.answer} />
                  </div>
                ))}
              </div>

              <div className='text-center'>
                <button
                  onClick={getNextQuestions}
                  className='btn btn-primary btn-lg px-4 py-2'
                >
                  Next Cards
                </button>
              </div>
            </div>

            <div className='card-footer text-center text-muted bg-light'>
              <small>Click on each card to reveal its answer</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlashcardManager
