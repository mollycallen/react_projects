import React, { useContext, useState, useEffect } from 'react'
import ButtonPanel from './ButtonPanel'
import TimeDisplay from './TimeDisplay'
import LapDisplay from './LapDisplay'
import { ThemeContext } from '../../App'

const INTERVAL_DELAY = 10

const Stopwatch = () => {
  const { textColor } = useContext(ThemeContext)

  const [currentTime, setCurrentTime] = useState(0)
  const [currentLap, setCurrentLap] = useState(0)
  const [lapTimes, setLapTimes] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  useEffect(() => {
    let intervalId

    if (isRunning) {
      intervalId = setInterval(() => {
        setCurrentTime(prevTime => prevTime + INTERVAL_DELAY)
        setCurrentLap(prevTime => prevTime + INTERVAL_DELAY)
      }, INTERVAL_DELAY)
    }

    return () => {
      clearInterval(intervalId)
    }
  }, [isRunning])

  const handleStart = () => {
    setIsRunning(true)
  }

  const handleStop = () => {
    setIsRunning(false)
  }

  const handleLap = () => {
    setLapTimes([currentLap, ...lapTimes])
    setCurrentLap(0)
  }

  const handleReset = () => {
    setCurrentTime(0)
    setCurrentLap(0)
    setLapTimes([])
    setIsRunning(false)
  }

  return (
    <div className='d-inline-block'>
      <div className='text-center p-2'>
        <div className='d-flex justify-content-between'>
          <div className={textColor}>
            <TimeDisplay time={currentTime} />
            <LapDisplay currentLap={currentLap} lapTimes={lapTimes} />
          </div>
          <ButtonPanel
            onLap={handleLap}
            onReset={handleReset}
            onStart={handleStart}
            onStop={handleStop}
          />
        </div>
      </div>
    </div>
  )
}

export default Stopwatch
