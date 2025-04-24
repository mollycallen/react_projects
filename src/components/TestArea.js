import React from 'react'

const TestArea = () => {
  function calculateRPN (operands, operators) {
    // Convert infix to RPN
    const rpn = infixToRPN(operands, operators)

    // Evaluate RPN
    const stack = []

    for (const token of rpn) {
      if (typeof token === 'number') {
        stack.push(token)
      } else {
        const b = stack.pop()
        const a = stack.pop()
        switch (token) {
          case '+':
            stack.push(a + b)
            break
          case '-':
            stack.push(a - b)
            break
          case '*':
            stack.push(a * b)
            break
          case '/':
            if (b === 0) throw new Error('Division by zero')
            stack.push(a / b)
            break
          default:
            throw new Error('Unknown operator: ' + token)
        }
      }
    }

    return stack[0]
  }

  function infixToRPN (operands, operators) {
    const output = []
    const opStack = []
    const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 }

    for (let i = 0; i < operands.length; i++) {
      output.push(operands[i])

      if (i < operators.length) {
        const op = operators[i]
        while (
          opStack.length > 0 &&
          precedence[opStack[opStack.length - 1]] >= precedence[op]
        ) {
          output.push(opStack.pop())
        }
        opStack.push(op)
      }
    }

    while (opStack.length > 0) {
      output.push(opStack.pop())
    }

    return output
  }

  // Example usage:
  const operands = [5, 3, 8, 2]
  const operators = ['+', '*', '-']

  try {
    const result = calculateRPN(operands, operators)
    console.log(result) // Output: 27 (5 + 3 * 8 - 2)
  } catch (error) {
    console.error('Error:', error.message)
  }
  return <div>TestArea</div>
}

export default TestArea
