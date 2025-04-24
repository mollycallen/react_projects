import React, { useState } from 'react'
import './Cell.css'

const Cell = ({
  row,
  col,
  value,
  isEditable,
  onChange,
  candidates = [],
  showCandidates = false,
  isHinted = false,
  onHintRequest
}) => {
  const [showHintIcon, setShowHintIcon] = useState(false)

  const handleChange = event => {
    if (isEditable) {
      onChange(row, col, event.target.value)
    }
  }

  return (
    <div
      className='sudoku-cell'
      onMouseEnter={() => isEditable && !value && setShowHintIcon(true)}
      onMouseLeave={() => setShowHintIcon(false)}
    >
      <div className='candidates-container'>
        <div className='candidates'>
          {showCandidates &&
            !value &&
            candidates.length > 0 &&
            candidates.sort().join('')}
        </div>
      </div>
      <input
        type='text'
        value={value || ''}
        onChange={handleChange}
        disabled={!isEditable}
        className={`cell-input ${isEditable ? '' : 'font-weight-bold'} ${
          isHinted ? 'text-primary' : ''
        }`}
        maxLength={1}
      />
      {showHintIcon && (
        <div
          className='hint-icon'
          onClick={e => {
            e.stopPropagation()
            onHintRequest(row, col)
          }}
        >
          ?
        </div>
      )}
    </div>
  )
}

export default Cell
