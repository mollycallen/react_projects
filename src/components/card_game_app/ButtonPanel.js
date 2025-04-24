import { Play, Plus, ThumbsUp } from 'lucide-react'

export default function ButtonPanel ({ gameOver, startGame, hit, stand }) {
  const buttonClass =
    'btn rounded-pill p-2 m-2 d-flex align-items-center justify-content-center'
  const iconClass = 'me-1'

  return (
    <div className='d-flex justify-content-between align-items-center'>
      <button
        className={`${buttonClass} btn-primary`}
        style={{ width: '140px' }}
        onClick={startGame}
      >
        <Play className={iconClass} size={24} />
        {gameOver ? 'Deal' : 'Redeal'}
      </button>
      <button
        className={`${buttonClass} btn-success`}
        style={{ width: '140px' }}
        onClick={hit}
        disabled={gameOver}
      >
        <Plus className={iconClass} size={24} />
        Hit
      </button>
      <button
        className={`${buttonClass} btn-warning text-dark`}
        style={{ width: '140px' }}
        disabled={gameOver}
        onClick={stand}
      >
        <ThumbsUp className={iconClass} size={24} />
        Stand
      </button>
    </div>
  )
}
