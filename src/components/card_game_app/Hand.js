import React, { useEffect, useState } from 'react'
import PlayingCard from './PlayingCard'

const Hand = ({
  dealtCards,
  dealer = false,
  gameStart = false,
  gameOver = false
}) => {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (gameStart) {
      // Slight delay to ensure the class is applied after the initial render
      const timer = setTimeout(() => setAnimate(true), 50)
      return () => clearTimeout(timer)
    } else {
      setAnimate(false)
    }
  }, [gameStart])

  return (
    <div className='hand d-flex m-2' style={{ height: '120px' }}>
      <style>
        {`
          .card-transition {
            opacity: 0;
            transition: opacity 1s ease-in;
          }
          .card-transition.animate {
            opacity: 1;
          }
        `}
      </style>
      {(!dealtCards || dealtCards.length === 0) && (
        <span className='text-dark-subtle fst-italic'>No cards to show.</span>
      )}
      <div className='d-flex position-relative' style={{ height: '120px' }}>
        {dealtCards.map((card, index) => (
          <div
            key={index}
            className={`card-transition ${animate ? 'animate' : ''}`}
            style={{
              width: '70px',
              height: '120px',
              position: 'absolute',
              left: `${index * 40}px`,
              zIndex: index
            }}
          >
            <PlayingCard
              faceValue={card.value}
              suit={card.suit}
              initialFaceUp={gameOver || !(dealer && index === 0)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Hand
