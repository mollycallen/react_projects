import React, { useRef } from 'react'

const getOperatorLabel = operator => {
  switch (operator) {
    case '/':
      return '÷'
    case '*':
      return '×'
    default:
      return operator
  }
}

const Display = ({ operands, operators, currentOperand, error }) => {
  const displayRef = useRef(null)

  const displayItems = []

  operands.forEach((operand, index) => {
    // Add operand
    displayItems.push(<span key={`operand-${index}`}>{operand}</span>)

    // Add operator if it exists
    if (operators[index]) {
      displayItems.push(
        <span key={`operator-${index}`} className='text-primary fw-bold'>
          {'\u00A0' + getOperatorLabel(operators[index]) + '\u00A0'}
        </span>
      )
    }
  })

  // Add current operand if it exists
  if (currentOperand) {
    displayItems.push(<span key='current-operand'>{currentOperand}</span>)
  }

  return (
    <div
      className='border border-2 border-secondary bg-white mb-4 rounded text-end fs-5 fw-semibold overflow-auto'
      style={{ height: '50px' }}
    >
      <div
        ref={displayRef}
        className='w-100 h-100 p-2 text-dark text-end fs-5 fw-semibold overflow-auto text-nowrap'
      >
        {error ? <span className='text-danger'>{error}</span> : displayItems}
      </div>
    </div>
  )
}

export default Display
