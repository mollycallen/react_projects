import React, { useRef, useEffect, useState } from 'react'
import ButtonPanel from './ButtonPanel'
import SelectPanel from './SelectPanel'
import { formatTimeHMS } from '../utils'
import sound from '../../sounds/whistle.mp3'

export default function Timer () {
  const [totalSeconds, setTotalSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const selectRef = useRef({ hours: null, minutes: null, seconds: null })

  const playSound = () => {
    const audio = new Audio(sound)
    audio.play()
  }

  useEffect(() => {
    let timerIntervalId

    if (isRunning) {
      timerIntervalId = setInterval(() => {
        setTotalSeconds(prevTotalSeconds => {
          if (prevTotalSeconds === 1) {
            setIsRunning(false)
            setIsFinished(true)
            playSound()
            return 0
          }
          return prevTotalSeconds - 1
        })
      }, 1000)
    }
    return () => {
      clearInterval(timerIntervalId)
    }
  }, [isRunning])

  const handleStart = () => {
    if (!isRunning) {
      setIsFinished(false)
      if (totalSeconds === 0) {
        const hours = parseInt(selectRef.current.hours.value, 10)
        const minutes = parseInt(selectRef.current.minutes.value, 10)
        const seconds = parseInt(selectRef.current.seconds.value, 10)
        const newTotalSeconds = hours * 3600 + minutes * 60 + seconds
        setTotalSeconds(newTotalSeconds)
      }
      setIsRunning(true)
    }
  }

  const handleStop = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setIsFinished(false)
    setTotalSeconds(0)
    selectRef.current.hours.value = 0
    selectRef.current.minutes.value = 0
    selectRef.current.seconds.value = 0
  }

  const handleSelectChange = (hours, minutes, seconds) => {
    if (!isRunning) {
      const newTotalSeconds = hours * 3600 + minutes * 60 + seconds
      setTotalSeconds(newTotalSeconds)
      setIsFinished(false)
    }
  }

  return (
    <div className='d-flex p-2 rounded'>
      <div className='flex-grow-1 d-flex flex-column justify-content-between'>
        <SelectPanel
          ref={selectRef}
          onValuesChange={handleSelectChange}
          isDisabled={isRunning}
        />
        <div
          className={`${
            isFinished ? 'bg-warning' : ''
          } border rounded-2 border-2 p-3 mt-2 fs-1 fw-bold font-monospace text-center`}
        >
          {formatTimeHMS(totalSeconds)}
        </div>
      </div>
      <div className='ms-4'>
        <ButtonPanel
          onStart={handleStart}
          onStop={handleStop}
          onReset={handleReset}
        />
      </div>
    </div>
  )
}
