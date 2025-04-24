import React, { useState, useEffect, useCallback } from 'react'
import Cell from './Cell'
import './Board.css'
import {
  generateCompleteSolution,
  createInitialBoard,
  getCandidates,
  DIFFICULTY_LEVELS
} from './sudokuHelper'

const Board = () => {
  const [board, setBoard] = useState(null)
  const [solution, setSolution] = useState(null)
  const [initialBoard, setInitialBoard] = useState(null)
  const [candidates, setCandidates] = useState(null)
  const [invalidCells, setInvalidCells] = useState([])
  const [statusMessage, setStatusMessage] = useState('')
  const [editableCells, setEditableCells] = useState(null)
  const [error, setError] = useState(null)
  const [showCandidates, setShowCandidates] = useState(true)
  const [difficulty, setDifficulty] = useState(DIFFICULTY_LEVELS.MODERATE)
  const [showModal, setShowModal] = useState(false)
  const [hintedCells, setHintedCells] = useState(new Set())
  const [hintsUsed, setHintsUsed] = useState(0)

  useEffect(() => {
    if (board && !board.some(row => row.includes(0))) {
      // Check if current board matches solution
      const isComplete = board.every((row, i) =>
        row.every((cell, j) => cell === solution[i][j])
      )
      if (isComplete) {
        setShowModal(true)
      }
    }
  }, [board, solution])

  useEffect(() => {
    try {
      generateNewGame()
    } catch (err) {
      setError('Failed to initialize the game. Please try refreshing the page.')
      console.error('Game initialization error:', err)
    }
  }, [])

  useEffect(() => {
    generateNewGame()
  }, [difficulty])

  const generateNewGame = () => {
    // Generate complete solution
    const solution = generateCompleteSolution()
    setSolution(solution)

    // Create initial board setup with current difficulty
    const setup = createInitialBoard(solution, difficulty.givens)
    setInitialBoard(setup)
    setBoard(setup)

    // Create a map of editable cells
    const editable = setup.map(row => row.map(cell => cell === 0))
    setEditableCells(editable)

    // Initial candidates calculation
    const candies = getCandidates(setup)
    setCandidates(candies)

    // Clear any existing status messages or invalid cells
    setStatusMessage('')
    setInvalidCells([])
    setShowModal(false)
    setHintedCells(new Set())
    setHintsUsed(0)
  }

  const handleReset = () => {
    // Reset the board to initial state
    setBoard([...initialBoard.map(row => [...row])])

    // Recalculate candidates for the initial board state
    const candies = getCandidates(initialBoard)
    setCandidates(candies)

    // Clear any error states
    setInvalidCells([])
    setStatusMessage('')
    setHintedCells(new Set())
    setHintsUsed(0)
  }

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage('')
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [statusMessage])

  // Check if value exists in the same row
  const checkRow = (row, value) => {
    return board[row].some(cell => cell === value)
  }

  // Check if value exists in the same column
  const checkColumn = (col, value) => {
    return board.some(row => row[col] === value)
  }

  // Check if value exists in the same 3x3 block
  const checkBlock = (row, col, value) => {
    const blockStartRow = Math.floor(row / 3) * 3
    const blockStartCol = Math.floor(col / 3) * 3

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[blockStartRow + i][blockStartCol + j] === value) {
          return true
        }
      }
    }
    return false
  }

  const updateBoard = (row, col, numValue) => {
    try {
      const newBoard = board.map(r => [...r]) // Deep copy to ensure immutability
      newBoard[row][col] = numValue
      setBoard(newBoard)
      const newCandidates = getCandidates(newBoard)
      setCandidates(newCandidates)
    } catch (err) {
      setError('Failed to update the board. Please try again.')
      console.error('Board update error:', err)
    }
  }

  const handleCellChange = useCallback(
    (row, col, newValue) => {
      // Clear invalid cells and status message
      setInvalidCells([])
      setStatusMessage('')

      // If the new value is empty, update the board and recalculate candidates
      if (newValue === '') {
        updateBoard(row, col, 0) // Use 0 to represent an empty cell
        return
      }

      // Validate that the input is a number between 1 and 9
      const numValue = parseInt(newValue)

      if (isNaN(numValue) || numValue < 1 || numValue > 9) {
        setStatusMessage('Please enter a number between 1 and 9')
        return
      }

      // Check if the value already exists in the same row
      if (checkRow(row, numValue)) {
        setInvalidCells(board[row].map((_, index) => `${row}-${index}`))
        setStatusMessage(`${numValue} already exists in this row!`)
        return
      }

      // Check if the value already exists in the same column
      if (checkColumn(col, numValue)) {
        setInvalidCells(board.map((_, index) => `${index}-${col}`))
        setStatusMessage(`${numValue} already exists in this column!`)
        return
      }

      // Check if the value already exists in the same 3x3 block
      if (checkBlock(row, col, numValue)) {
        const blockStartRow = Math.floor(row / 3) * 3
        const blockStartCol = Math.floor(col / 3) * 3
        const blockCells = []

        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            blockCells.push(`${blockStartRow + i}-${blockStartCol + j}`)
          }
        }

        setInvalidCells(blockCells)
        setStatusMessage(`${numValue} already exists in this 3x3 block!`)
        return
      }

      // If all checks pass, update the board
      updateBoard(row, col, numValue)
    },
    [board, setCandidates]
  )

  const handleHintRequest = (row, col) => {
    if (editableCells[row][col] && board[row][col] === 0) {
      const correctValue = solution[row][col]
      updateBoard(row, col, correctValue)
      setHintedCells(prev => new Set([...prev, `${row}-${col}`]))
      setHintsUsed(prev => prev + 1)
    }
  }

  if (error) {
    return (
      <div className='container mt-4'>
        <div className='alert alert-danger' role='alert'>
          {error}
        </div>
      </div>
    )
  }

  if (!board || !editableCells) {
    return (
      <div className='container mt-4'>
        <div className='text-center'>
          <div className='spinner-border text-primary' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </div>
          <p className='mt-2'>Loading game...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='container py-4'>
      <div className='row justify-content-center'>
        <div className='col-12 col-lg-8'>
          <div className='game-container bg-white shadow-sm rounded-3 p-4'>
            {/* Game Header */}
            <div className='game-header mb-4'>
              <h2 className='text-center mb-4'>Sudoku</h2>

              {/* Main Controls */}
              <div className='d-flex flex-wrap gap-3 justify-content-center mb-4'>
                <button
                  className='btn btn-primary px-4 py-2'
                  onClick={generateNewGame}
                >
                  New Game
                </button>
                <button
                  className='btn btn-outline-secondary px-4 py-2'
                  onClick={handleReset}
                >
                  Reset Board
                </button>
              </div>

              {/* Settings Bar */}
              <div className='settings-bar bg-light rounded-3 p-3'>
                <div className='row align-items-center justify-content-between'>
                  <div className='col-auto'>
                    <div className='difficulty-selector d-flex align-items-center gap-2'>
                      <label
                        className='form-label mb-0'
                        htmlFor='selectDifficulty'
                      >
                        Difficulty:
                      </label>
                      <select
                        className='form-select form-select-sm'
                        id='selectDifficulty'
                        value={difficulty.id}
                        onChange={e => {
                          const newDifficulty = Object.values(
                            DIFFICULTY_LEVELS
                          ).find(level => level.id === e.target.value)
                          if (newDifficulty) {
                            setDifficulty(newDifficulty)
                          }
                        }}
                      >
                        {Object.values(DIFFICULTY_LEVELS).map(level => (
                          <option key={level.id} value={level.id}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className='col-auto'>
                    <div className='form-check form-switch'>
                      <input
                        type='checkbox'
                        className='form-check-input'
                        id='showCandidates'
                        checked={showCandidates}
                        onChange={e => setShowCandidates(e.target.checked)}
                      />
                      <label
                        className='form-check-label'
                        htmlFor='showCandidates'
                      >
                        Show candidates
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Game Board */}
            <div className='board-container'>
              <div className='d-flex justify-content-center'>
                <table className='sudoku-board'>
                  <tbody>
                    {board.map((row, rowIndex) => (
                      <tr key={rowIndex} className='board-row'>
                        {row.map((cell, colIndex) => (
                          <td
                            key={`${rowIndex}-${colIndex}`}
                            className={`cell-container ${
                              invalidCells.includes(`${rowIndex}-${colIndex}`)
                                ? 'invalid-cell'
                                : ''
                            }`}
                          >
                            <Cell
                              row={rowIndex}
                              col={colIndex}
                              value={cell}
                              isEditable={editableCells[rowIndex][colIndex]}
                              onChange={handleCellChange}
                              candidates={candidates.get(
                                `${rowIndex},${colIndex}`
                              )}
                              showCandidates={showCandidates}
                              isHinted={hintedCells.has(
                                `${rowIndex}-${colIndex}`
                              )}
                              onHintRequest={handleHintRequest}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Status Message */}
            {statusMessage && (
              <div className='mt-4'>
                <div className='alert alert-danger mb-0' role='alert'>
                  {statusMessage}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Congratulations Modal */}
      {showModal && (
        <div
          className='modal fade show'
          style={{ display: 'block' }}
          tabIndex='-1'
        >
          <div className='modal-dialog modal-dialog-centered'>
            <div className='modal-content'>
              <div className='modal-header bg-success text-white'>
                <h5 className='modal-title'>🎉 Congratulations! 🎉</h5>
                <button
                  type='button'
                  className='btn-close btn-close-white'
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className='modal-body text-center'>
                <p className='fs-4'>You've solved the puzzle!</p>
                <p className='fs-5'>Difficulty: {difficulty.label}</p>
                <p>
                  Well done on completing this challenging Sudoku puzzle. You've
                  demonstrated great logical thinking and perseverance!
                </p>
                <p className='text-muted'>
                  {hintsUsed > 0
                    ? `You used ${hintsUsed} hint${
                        hintsUsed === 1 ? '' : 's'
                      } to solve this puzzle.`
                    : 'You solved this puzzle without using any hints!'}
                </p>
              </div>
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-secondary'
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <button
                  type='button'
                  className='btn btn-primary'
                  onClick={() => {
                    setShowModal(false)
                    generateNewGame()
                  }}
                >
                  New Game
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModal && <div className='modal-backdrop fade show'></div>}
    </div>
  )
}

export default Board
