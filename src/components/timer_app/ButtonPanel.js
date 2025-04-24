import { PlayCircle, StopCircle, RotateCcw } from 'lucide-react'

const ButtonPanel = ({ onStart, onStop, onReset }) => {
  return (
    <div className='d-flex flex-column align-items-center gap-2'>
      <button
        className='btn btn-success p-3 rounded-circle'
        onClick={onStart}
        aria-label='Start'
      >
        <PlayCircle size={24} />
      </button>
      <button
        className='btn btn-danger p-3 rounded-circle'
        onClick={onStop}
        aria-label='Stop'
      >
        <StopCircle size={24} />
      </button>
      <button
        className='btn btn-secondary p-3 rounded-circle'
        onClick={onReset}
        aria-label='Reset'
      >
        <RotateCcw size={24} />
      </button>
    </div>
  )
}

export default ButtonPanel
