import { motion } from 'framer-motion'
import { formatTimeMSm } from '../utils'

const LapDisplay = ({ lapTimes, currentLap }) => {
  return (
    <div className='text-start' style={{ height: '150px', overflowY: 'auto' }}>
      {lapTimes.length > 0 && (
        <>
          <motion.div
            className='fs-6 my-1 mx-2 font-monospace border-start border-4 border-primary ps-2'
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            Lap {lapTimes.length + 1}: {formatTimeMSm(currentLap)}
          </motion.div>
          {lapTimes.map((lapTime, index) => (
            <motion.div
              key={index}
              className={`fs-6 my-1 mx-2 font-monospace ${
                index % 2 === 0 ? 'bg-secondary bg-opacity-25' : ''
              }`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              Lap {lapTimes.length - index}: {formatTimeMSm(lapTime)}
            </motion.div>
          ))}
        </>
      )}
    </div>
  )
}

export default LapDisplay
