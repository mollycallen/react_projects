import React, { useState } from 'react'
import Display from './Display'
import ButtonPanel from './ButtonPanel'

const Calculator = () => {
  const [operators, setOperators] = useState([])
  const [operands, setOperands] = useState([])
  const [currentOperand, setCurrentOperand] = useState('')
  const [error, setError] = useState('')

  // Handles the click event for operator buttons
  // If there's a current operand, it adds the operator and operand to the respective arrays
  // If there's no current operand but there are previous operators, it replaces the last operator
  const handleOperatorClick = value => {
    if (currentOperand) {
      setOperators(prevOperators => [...prevOperators, value])
      setOperands(prevOperands => [...prevOperands, parseFloat(currentOperand)])
      setCurrentOperand('')
    } else if (operators.length > 0) {
      // Replace the last operator if currentOperand is empty
      setOperators(prevOperators => [...prevOperators.slice(0, -1), value])
    }
  }

  // Handles the click event for the equal button
  // If there's a current operand, it adds it to the operands array
  // Calculates the answer, resets the state, and sets currentOperand to the answer
  const handleEqualClick = () => {
    let updatedOperands = [...operands]
    if (currentOperand) {
      updatedOperands = [...operands, parseFloat(currentOperand)]
    }
    const answer = calculateExpression(updatedOperands, operators)

    // Reset the state and set currentOperand to the answer
    setOperators([])
    setOperands([])
    setCurrentOperand(answer.toString())
  }

  function calculateExpression (operands, operators) {
    let expression = ''

    // Build the expression string
    for (let i = 0; i < operands.length; i++) {
      // Check if the operand is negative
      if (operands[i] < 0) {
        expression += `(${operands[i]})`
      } else {
        expression += operands[i]
      }

      // Add operator if it exists
      if (i < operators.length) {
        expression += operators[i]
      }

      //console.log(expression)
    }

    // Evaluate the expression
    try {
      // eslint-disable-next-line
      let result = eval(expression)

      // if infinity or NaN, set error and clear result
      if (!Number.isFinite(result)) {
        if (Number.isNaN(result)) {
          setError('Error: Result is NaN')
        } else {
          setError('Error: Result is infinity')
        }
        return ''
      }

      return result
    } catch (error) {
      setError('Error: Invalid expression')
      return ''
    }
  }

  // Handles the click event for number buttons
  // Appends the clicked number to the current operand
  const handleNumberClick = value => {
    setCurrentOperand(prevOperand => prevOperand + value.toString())
    setError('')
  }

  // Clears the calculator state, resetting all values to their initial state
  const handleClearClick = () => {
    setOperands([])
    setOperators([])
    setCurrentOperand('')
  }

  // Toggles the sign of the current operand
  // If the current operand starts with a negative sign, it removes it
  // If the current operand doesn't start with a negative sign, it adds one
  const handleSignClick = () => {
    let newValue = +currentOperand // convert to number
    newValue = newValue * -1
    console.log(newValue)
    setCurrentOperand(newValue)
  }

  // Handles the click event for the backspace button
  // If there's a current operand, it removes the last character
  // If there's no current operand but there are previous operands and operators,
  // it removes the last operator and operand and sets the last operand as the current operand
  const handleBackspaceClick = () => {
    if (currentOperand) {
      // If we have a current operand, remove last character
      setCurrentOperand(prev => prev.slice(0, -1))
    } else if (operands.length > 0) {
      // No current operand, so we need to remove the last operator and operand
      // and set the last operand to the current operand
      setOperators(prevOperators => prevOperators.slice(0, -1))
      setOperands(prevOperands => {
        const newOperands = prevOperands.slice(0, -1)
        setCurrentOperand(prevOperands[prevOperands.length - 1].toString())
        return newOperands
      })
    }
  }
  // Generates a random number between -100 and 100 and appends it to the current operand
  const handleRandomClick = () => {
    const randomNumber = Math.floor(Math.random() * 201) - 100
    setCurrentOperand(prevOperand => {
      if (prevOperand === '') {
        // If the current operand is empty, the random number becomes the new operand
        return randomNumber.toString()
      } else if (randomNumber < 0) {
        // If the random number is negative and there are already digits, add the negative sign to the front
        return '-' + prevOperand + Math.abs(randomNumber).toString()
      } else {
        // If the random number is positive, append it directly to the current operand
        return prevOperand + randomNumber.toString()
      }
    })
    setError('')
  }

  return (
    <div style={{ width: '20rem' }}>
      <div className='w-100 overflow-hidden'>
        <Display
          operands={operands}
          operators={operators}
          currentOperand={currentOperand}
          error={error}
        />
      </div>

      <ButtonPanel
        onNumberClick={handleNumberClick}
        onOperatorClick={handleOperatorClick}
        onSignClick={handleSignClick}
        onBackspaceClick={handleBackspaceClick}
        onEqualClick={handleEqualClick}
        onClearClick={handleClearClick}
        onRandomClick={handleRandomClick}
      />
    </div>
  )
}

export default Calculator
