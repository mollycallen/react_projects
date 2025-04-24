import React, { useContext } from 'react'
import { ThemeContext } from '../../App' // Adjust the import path as necessary
import { formatTimeMSm } from '../utils'

const TimeDisplay = ({ time }) => {
  const { textColor, darkMode } = useContext(ThemeContext)

  const borderColor = darkMode ? 'border-light' : 'border-dark'

  return (
    <div
      className={`${textColor} display-4 font-weight-bold rounded-2 mb-3 p-3 font-monospace text-center border border-2 ${borderColor}`}
    >
      {formatTimeMSm(time)}
    </div>
  )
}

export default TimeDisplay
