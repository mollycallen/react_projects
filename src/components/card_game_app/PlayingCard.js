import { useState, useEffect } from 'react'
import './styles/card_game.css'

const SUITS = {
  HEARTS: 'hearts',
  DIAMONDS: 'diamonds',
  CLUBS: 'clubs',
  SPADES: 'spades'
}

const PlayingCard = ({
  faceValue,
  suit,
  initialFaceUp = true,
  width = '90px'
}) => {
  const [faceUp, setFaceUp] = useState(initialFaceUp)

  useEffect(() => {
    setFaceUp(initialFaceUp)
  }, [initialFaceUp])

  const getSuitEntity = suit => {
    switch (suit.toLowerCase()) {
      case SUITS.HEARTS:
        return '♥'
      case SUITS.DIAMONDS:
        return '♦'
      case SUITS.CLUBS:
        return '♣'
      case SUITS.SPADES:
        return '♠'
      default:
        return suit
    }
  }

  const suitEntity = getSuitEntity(suit)
  const isRed =
    suit.toLowerCase() === SUITS.HEARTS || suit.toLowerCase() === SUITS.DIAMONDS

  const height = `${(parseInt(width) * 4) / 3}px`

  const cardDescription = `${faceValue} of ${suit}`
  const commonStyles =
    'card-face border border-2 border-dark rounded shadow user-select-none overflow-hidden'
  return (
    <div
      className='card-container'
      style={{
        width: width,
        height: height,
        cursor: 'pointer'
      }}
      // onClick={() => setFaceUp(prev => !prev)}
      aria-label={cardDescription}
      role='img'
      aria-roledescription='playing card'
    >
      <div className={`card ${faceUp ? '' : 'flipped'}`}>
        <div className={`card-front ${commonStyles}`}>
          <div
            className={`text-start lh-1 ${isRed ? 'text-danger' : 'text-dark'}`}
          >
            {faceValue}
            <br />
            {suitEntity}
          </div>
          <div
            className={`text-center fs-2 ${
              isRed ? 'text-danger' : 'text-dark'
            }`}
          >
            {suitEntity}
          </div>
          <div
            className={`text-end lh-1 ${isRed ? 'text-danger' : 'text-dark'}`}
          >
            {suitEntity}
            <br />
            {faceValue}
          </div>
        </div>
        <div className={`card-back ${commonStyles}`} aria-label='Card back'>
          <div className='display-1'>🂠</div>
        </div>
      </div>
    </div>
  )
}

export default PlayingCard
