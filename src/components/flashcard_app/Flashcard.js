import React, { useState, useEffect } from 'react'
import './flashcard.css' // We'll create this CSS file for animations

const Flashcard = ({ question, answer }) => {
  const [showAnswer, setShowAnswer] = useState(false)
  const [animate, setAnimate] = useState(false)

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer)
  }

  // Hide the answer and trigger animation when the question changes
  useEffect(() => {
    setShowAnswer(false)
    setAnimate(true)
    const timer = setTimeout(() => setAnimate(false), 300) // Match this to your CSS animation duration
    return () => clearTimeout(timer)
  }, [question])

  return (
    <div
      onClick={toggleAnswer}
      className={`card flashcard ${animate ? 'animate' : ''}`}
      style={{
        maxWidth: '400px',
        minHeight: '250px',
        backgroundColor: 'white',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        position: 'relative',
        overflowY: 'auto',
        overflowX: 'hidden',
        cursor: 'pointer'
      }}
    >
      <div className='card-body d-flex flex-column'>
        <div className='mb-3'>
          <h6
            className='card-subtitle mb-3 text-muted'
            style={{ fontVariant: 'small-caps' }}
          >
            Question:
          </h6>
          <p className='card-text text-wrap'>{question}</p>
        </div>

        <div
          style={{
            position: 'relative',
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden'
          }}
        >
          <div
            style={{
              transform: showAnswer ? 'translateX(0)' : 'translateX(100%)',
              transition: 'transform 0.3s ease-in-out',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              backgroundColor: '#cff4fc',
              padding: '1rem',
              borderRadius: '4px',
              width: '100%',
              height: 'auto'
            }}
          >
            <div>
              <h6
                className='card-subtitle mb-2 text-muted'
                style={{ fontVariant: 'small-caps' }}
              >
                Answer:
              </h6>
              <p className='card-text' style={{ fontWeight: 'bold' }}>
                {answer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Flashcard
