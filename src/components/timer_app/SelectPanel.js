import React, { forwardRef } from 'react'

const SelectPanel = forwardRef(({ onValuesChange, isDisabled }, ref) => {
  const handleChange = () => {
    const hours = parseInt(ref.current.hours.value, 10)
    const minutes = parseInt(ref.current.minutes.value, 10)
    const seconds = parseInt(ref.current.seconds.value, 10)
    onValuesChange(hours, minutes, seconds)
  }

  return (
    <div className='d-flex justify-content-between'>
      <div className='p-2'>
        <select
          ref={el => (ref.current.hours = el)}
          id='hours'
          className='form-select'
          onChange={handleChange}
          disabled={isDisabled}
        >
          {[...Array(24).keys()].map(hour => (
            <option key={hour} value={hour}>
              {hour.toString().padStart(2, '0')}
            </option>
          ))}
        </select>
        <label htmlFor='hours' className='ms-2'>
          Hours
        </label>
      </div>
      <div className='p-2'>
        <select
          ref={el => (ref.current.minutes = el)}
          id='minutes'
          className='form-select'
          onChange={handleChange}
          disabled={isDisabled}
        >
          {[...Array(60).keys()].map(minute => (
            <option key={minute} value={minute}>
              {minute.toString().padStart(2, '0')}
            </option>
          ))}
        </select>
        <label htmlFor='minutes' className='ms-2'>
          Minutes
        </label>
      </div>
      <div className='p-2'>
        <select
          ref={el => (ref.current.seconds = el)}
          id='seconds'
          className='form-select'
          onChange={handleChange}
          disabled={isDisabled}
        >
          {[...Array(60).keys()].map(second => (
            <option key={second} value={second}>
              {second.toString().padStart(2, '0')}
            </option>
          ))}
        </select>
        <label htmlFor='seconds' className='ms-2'>
          Seconds
        </label>
      </div>
    </div>
  )
})

export default SelectPanel
