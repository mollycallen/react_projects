import React from 'react'

const ButtonPanel = ({ onStart, onLap, onStop, onReset }) => {
  return (
    <div className='d-grid gap-1 ms-3' style={{ width: '100px' }}>
      <button className='btn btn-success fs-5' onClick={onStart}>
        Start
      </button>
      <button className='btn btn-primary fs-5' onClick={onLap}>
        Lap
      </button>
      <button className='btn btn-danger fs-5' onClick={onStop}>
        Stop
      </button>
      <button className='btn btn-secondary fs-5 mt-4' onClick={onReset}>
        Reset
      </button>
    </div>
  )
}

export default ButtonPanel
