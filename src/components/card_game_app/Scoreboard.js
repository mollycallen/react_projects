const Scoreboard = ({ player1, player2, message = '' }) => {
  const PlayerScore = ({ player }) => {
    const isWinner = message && message.includes(player.name)
    const winnerClass = isWinner ? 'winner-pulse' : ''

    return (
      <div className={`text-center p-2 rounded ${winnerClass}`}>
        {player.name}: {player.score}
      </div>
    )
  }

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.2);
              color:red;
            }
            100% {
              transform: scale(1);
            }
          }
          .winner-pulse {
            animation: pulse 2s ease-in-out;
          }
        `}
      </style>
      <div>
        <div className='d-flex justify-content-between align-items-center'>
          <PlayerScore player={player1} />
          {message && (
            <div className='text-center mx-2'>
              <span className='fs-3'>{message}</span>
            </div>
          )}
          <PlayerScore player={player2} />
        </div>
      </div>
    </>
  )
}

export default Scoreboard
