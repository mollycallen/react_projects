import React, { useState, useEffect } from 'react'
import Cell from './Cell'
import './Board.css'
import {
  generateCompleteSolution,
  createInitialBoard,
  getCandidates
} from './sudokuHelper'

const SolutionBoard = () => {
  const [solution, setSolution] = useState(null)
  const [initialBoard, setInitialBoard] = useState(null)
  const [candidates, setCandidates] = useState(null)

  useEffect(() => {
    // This effect runs once when the component mounts
    generateNewGame()
  }, [])

  const generateNewGame = () => {
    // 1. Generate complete solution
    const solution = generateCompleteSolution()
    setSolution(solution)
    const setup = createInitialBoard(solution)
    setInitialBoard(setup)

    const candies = getCandidates(setup)
    setCandidates(candies)
  }

  return (
    <div className='container mt-4'>
      {solution && (
        <table className='sudoku-board'>
          <tbody>
            {solution.map((row, rowIndex) => (
              <tr key={rowIndex} className='board-row'>
                {row.map((cell, colIndex) => (
                  <td
                    key={`${rowIndex}-${colIndex}`}
                    className={`cell-container`}
                  >
                    <Cell
                      row={rowIndex}
                      col={colIndex}
                      value={cell}
                      isEditable={true}
                      showCandidates={false}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {initialBoard && (
        <table className='sudoku-board'>
          <tbody>
            {initialBoard.map((row, rowIndex) => (
              <tr key={rowIndex} className='board-row'>
                {row.map((cell, colIndex) => (
                  <td
                    key={`${rowIndex}-${colIndex}`}
                    className={`cell-container`}
                  >
                    <Cell
                      row={rowIndex}
                      col={colIndex}
                      value={cell}
                      isEditable={true}
                      candidates={candidates.get(`${rowIndex},${colIndex}`)}
                      showCandidates={true}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default SolutionBoard
