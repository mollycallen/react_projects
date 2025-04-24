import React, { useState, useCallback, useMemo } from 'react'
import Hand from './Hand'
import useCardDeck from './useCardDeck'
import { calculateScore } from './utils'
import Scoreboard from './Scoreboard'
import ButtonPanel from './ButtonPanel'

const INITIAL_DEAL = 2
const MIN_CARDS_FOR_GAME = 10 // Assuming a maximum of 3 hits each for player and dealer

const Blackjack = () => {
  const { dealCards, resetDeck, remainingCards } = useCardDeck()
  const [dealerCards, setDealerCards] = useState([])
  const [playerCards, setPlayerCards] = useState([])
  const [gameOver, setGameOver] = useState(true)
  const [gameStart, setGameStart] = useState(false)
  const [winner, setWinner] = useState(null)
  const [playerWins, setPlayerWins] = useState(0)
  const [dealerWins, setDealerWins] = useState(0)

  const playerScore = useMemo(() => calculateScore(playerCards), [playerCards])
  const dealerScore = useMemo(() => calculateScore(dealerCards), [dealerCards])

  const determineWinner = useCallback((playerScore, dealerScore) => {
    if (playerScore > 21) {
      return 'Dealer'
    } else if (dealerScore > 21) {
      return 'Player'
    } else if (playerScore > dealerScore) {
      return 'Player'
    } else if (dealerScore > playerScore) {
      return 'Dealer'
    } else if (dealerScore === playerScore) {
      return 'Tie'
    }
  }, [])

  const startGame = () => {
    if (remainingCards < MIN_CARDS_FOR_GAME) {
      resetDeck() // Reset the deck only when there are not enough cards
    }
    setGameStart(true)
    setGameOver(false)
    setWinner(null)
    const newPlayerCards = dealCards(INITIAL_DEAL)
    setPlayerCards(newPlayerCards)
    const newDealerCards = dealCards(INITIAL_DEAL)
    setDealerCards(newDealerCards)
  }

  const hit = () => {
    const newCards = dealCards(1)
    const updatedPlayerCards = [...playerCards, ...newCards]
    setPlayerCards(updatedPlayerCards)

    const newPlayerScore = calculateScore(updatedPlayerCards)
    if (newPlayerScore > 21) {
      setTimeout(() => {
        endGame(newPlayerScore, dealerScore)
      }, 500) // Delay of .5 second
    }
  }

  const stand = async () => {
    let currentDealerCards = dealerCards
    let currentDealerScore = calculateScore(currentDealerCards)

    while (currentDealerScore < 17) {
      await new Promise(resolve => setTimeout(resolve, 500)) // Delay of .5 seconds
      const newCards = dealCards(1)
      currentDealerCards = [...currentDealerCards, ...newCards]
      currentDealerScore = calculateScore(currentDealerCards)
      setDealerCards(currentDealerCards)
    }

    endGame(playerScore, currentDealerScore)
  }

  const endGame = (finalPlayerScore, finalDealerScore) => {
    setGameOver(true)
    const winner = determineWinner(finalPlayerScore, finalDealerScore)
    if (winner === 'Player') {
      setWinner('Player wins!')
      setPlayerWins(prevWins => prevWins + 1)
    } else if (winner === 'Dealer') {
      setWinner('Dealer wins!')
      setDealerWins(prevWins => prevWins + 1)
    } else if (winner === 'Tie') {
      setWinner("It's a tie!")
    }
  }

  return (
    <div className=''>
      <div>
        <Scoreboard
          player1={{ name: 'Dealer', score: dealerWins }}
          player2={{ name: 'Player', score: playerWins }}
          message={winner}
        />
      </div>

      <div className='text-dark border border-2 border-dark-subtle bg-success-subtle rounded-2 card-deck mb-3 p-3 d-flex justify-content-between'>
        <div className='d-flex flex-column w-100 align-items-start'>
          <div className='mb-2'>
            <div className='fs-6 fw-medium'>
              Dealer: {dealerScore !== 0 && gameOver ? dealerScore : ''}
            </div>
            <Hand
              dealtCards={dealerCards}
              dealer={true}
              gameOver={gameOver}
              gameStart={gameStart}
            />
          </div>

          <div className='mt-2'>
            <div className='fs-6 fw-medium'>
              Player: {playerScore !== 0 ? playerScore : ''}
            </div>
            <Hand
              dealtCards={playerCards}
              dealer={false}
              gameOver={gameOver}
              gameStart={gameStart}
            />
          </div>
        </div>
      </div>
      <ButtonPanel
        gameOver={gameOver}
        startGame={startGame}
        hit={hit}
        stand={stand}
      />
    </div>
  )
}

export default Blackjack
