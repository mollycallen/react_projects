export const DIFFICULTY_LEVELS = {
  BEGINNER: {
    id: 'BEGINNER',
    label: 'Beginner',
    givens: 65
  },
  EASY: {
    id: 'EASY',
    label: 'Easy',
    givens: 52
  },
  MODERATE: {
    id: 'MODERATE',
    label: 'Moderate',
    givens: 41
  },
  CHALLENGING: {
    id: 'CHALLENGING',
    label: 'Challenging',
    givens: 32
  }
}

/**
 * Generates a complete, valid Sudoku solution as a 9x9 grid.
 * Uses a backtracking algorithm to fill the grid while maintaining Sudoku rules:
 * - Each row must contain numbers 1-9 without repetition
 * - Each column must contain numbers 1-9 without repetition
 * - Each 3x3 sub-grid must contain numbers 1-9 without repetition
 *
 * @returns {number[][]} A 9x9 array containing a valid Sudoku solution.
 *                      Each cell contains a number from 1-9.
 * @example
 * const solution = generateCompleteSolution();
 *  Returns something like:
 *  [
 *    [5, 3, 4, 6, 7, 8, 9, 1, 2],
 *    [6, 7, 2, 1, 9, 5, 3, 4, 8],
 *    [1, 9, 8, 3, 4, 2, 5, 6, 7],
 *    ...
 *  ]
 */
export function generateCompleteSolution () {
  // Define the size of the Sudoku grid (9x9)
  const size = 9
  // Initialize a 9x9 grid filled with zeros
  const grid = Array(size)
    .fill()
    .map(() => Array(size).fill(0))

  /**
   * Checks if a number can be placed in a specific position while maintaining Sudoku rules
   * @param {number} num - The number to check (1-9)
   * @param {number} row - The row index (0-8)
   * @param {number} col - The column index (0-8)
   * @returns {boolean} - True if the number can be placed, false otherwise
   */
  function isValid (num, row, col) {
    // Check if the number already exists in the current row
    for (let x = 0; x < size; x++) {
      if (grid[row][x] === num) return false
    }

    // Check if the number already exists in the current column
    for (let x = 0; x < size; x++) {
      if (grid[x][col] === num) return false
    }

    // Find the top-left corner of the 3x3 sub-grid that contains this position
    const startRow = row - (row % 3)
    const startCol = col - (col % 3)

    // Check if the number exists in the 3x3 sub-grid
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[i + startRow][j + startCol] === num) return false
      }
    }

    // If all checks pass, the number can be placed here
    return true
  }

  /**
   * Recursively fills the Sudoku grid using a backtracking algorithm
   * @param {number} row - Current row being filled (0-8)
   * @param {number} col - Current column being filled (0-8)
   * @returns {boolean} - True if the grid is successfully filled, false if no valid solution exists
   */
  function fillGrid (row = 0, col = 0) {
    // If we've filled beyond the last column, move to the next row
    if (col === size) {
      row++
      col = 0
    }

    // If we've filled all rows, the grid is complete
    if (row === size) return true

    // Create an array of numbers 1-9 that we'll try in random order
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9]

    // Try placing each number in the current cell
    for (let i = 0; i < size; i++) {
      // Randomly select a number from our remaining options
      // This randomization helps generate different valid solutions each time
      const index = Math.floor(Math.random() * nums.length)
      const num = nums[index]
      // Remove the selected number from our options
      nums.splice(index, 1)

      // If this number is valid in the current position
      if (isValid(num, row, col)) {
        // Place the number
        grid[row][col] = num

        // Recursively try to fill the rest of the grid
        // If successful, we're done with this branch
        if (fillGrid(row, col + 1)) return true

        // If we couldn't complete the grid with this number,
        // backtrack by setting the cell back to 0 and try the next number
        grid[row][col] = 0
      }
    }

    // If we've tried all numbers and none worked, return false
    // This will trigger backtracking in the previous recursive call
    return false
  }

  // Start the grid filling process
  fillGrid()

  // Print the completed solution to console for debugging/verification
  //console.log('Generated Sudoku Solution:')
  //grid.forEach(row => console.log(row.join(' ')))

  // Return the completed grid
  return grid
}

/**
 * Creates an initial Sudoku board by removing numbers from a complete solution
 * while ensuring a unique solution.
 *
 * @param {number[][]} completeSolution - A 9x9 array containing a complete valid Sudoku solution
 * @param {number} givens - Number of cells to remain filled (default: 41)
 * @returns {number[][]} A 9x9 array with some cells empty (represented by 0)
 */
export function createInitialBoard (completeSolution, givens = 41) {
  // Validate inputs
  if (
    !completeSolution ||
    completeSolution.length !== 9 ||
    !completeSolution.every(row => row.length === 9)
  ) {
    throw new Error('Invalid complete solution provided')
  }

  if (givens < 17 || givens > 81) {
    throw new Error('Number of givens must be between 17 and 81')
  }

  console.log('givens: ', givens)
  // Create a deep copy of the complete solution
  const board = completeSolution.map(row => [...row])

  // Calculate how many numbers to remove
  const cellsToRemove = 81 - givens

  // Create array of all possible positions
  const positions = []
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      positions.push([i, j])
    }
  }

  // Randomly shuffle positions
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[positions[i], positions[j]] = [positions[j], positions[i]]
  }

  // Remove numbers while ensuring a unique solution
  let removed = 0
  for (const [row, col] of positions) {
    if (removed >= cellsToRemove) break

    const temp = board[row][col]
    board[row][col] = 0

    // Check if the board still has a unique solution
    const solutions = countSolutions(board)
    if (solutions !== 1) {
      // If not, put the number back
      board[row][col] = temp
    } else {
      removed++
    }
  }

  // Print the board to console for testing
  // console.log('Initial board:')
  // board.forEach(row => {
  //   console.log(row.join(' '))
  // })

  return board
}

/**
 * Counts the number of solutions for a given Sudoku board
 * @param {number[][]} board - The Sudoku board to solve
 * @returns {number} The number of solutions
 */
function countSolutions (board) {
  const emptyCell = findEmptyCell(board)
  if (!emptyCell) {
    return 1 // Board is filled, this is a solution
  }

  const [row, col] = emptyCell
  let count = 0

  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num
      count += countSolutions(board)
      board[row][col] = 0 // backtrack
    }
    if (count > 1) return count // Early exit if multiple solutions found
  }

  return count
}

/**
 * Finds an empty cell in the Sudoku board
 * @param {number[][]} board - The Sudoku board
 * @returns {[number, number]|null} The coordinates of an empty cell, or null if the board is full
 */
function findEmptyCell (board) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) {
        return [i, j]
      }
    }
  }
  return null
}

/**
 * Checks if a number is valid in a given position
 * @param {number[][]} board - The Sudoku board
 * @param {number} row - The row to check
 * @param {number} col - The column to check
 * @param {number} num - The number to check
 * @returns {boolean} Whether the number is valid in the given position
 */
function isValid (board, row, col, num) {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) return false
  }

  // Check 3x3 box
  const startRow = Math.floor(row / 3) * 3
  const startCol = Math.floor(col / 3) * 3

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i + startRow][j + startCol] === num) return false
    }
  }

  return true
}

/**
 * Returns a map of candidate values for each empty cell in the Sudoku board.
 * @param {number[][]} board - The partially completed Sudoku board
 * @returns {Map<string, number[]>} A map where keys are "row,col" strings and values are arrays of possible numbers
 */
export function getCandidates (board) {
  const candidates = new Map()

  // Check each cell
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      // Only find candidates for empty cells
      if (board[row][col] === 0) {
        const possibleValues = []
        // Try each number 1-9
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            possibleValues.push(num)
          }
        }
        candidates.set(`${row},${col}`, possibleValues)
      }
    }
  }

  return candidates
}
