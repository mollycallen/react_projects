import React, { useState, useEffect } from 'react'
import { cities } from './utils'
import DisplayLocation from './DisplayLocation'

import { LOCATION_SOURCES } from './utils'

const SelectCity = ({ onLocationUpdate }) => {
  const [selectedCityData, setSelectedCityData] = useState(null)

  const handleSelectCity = e => {
    const selectedCity = e.target.value
    const data = cities.find(city => city.city === selectedCity)
    setSelectedCityData(data || null)
  }

  useEffect(() => {
    if (selectedCityData) {
      onLocationUpdate(
        {
          city: selectedCityData.city,
          latitude: selectedCityData.latitude,
          longitude: selectedCityData.longitude
        },
        LOCATION_SOURCES.CITY
      )
    }
  }, [selectedCityData, onLocationUpdate])

  return (
    <div className='mb-3'>
      <label htmlFor='citySelect' className='form-label text-dark'>
        Select City
      </label>

      <select
        id='citySelect'
        className='form-select'
        style={{
          width: 'auto',
          maxWidth: '100%'
        }}
        value={selectedCityData ? selectedCityData.name : ''}
        onChange={handleSelectCity}
        aria-label='Select a city'
      >
        <option value=''>Choose a city...</option>
        {cities.map((city, index) => (
          <option key={index} value={city.city}>
            {city.city}
          </option>
        ))}
      </select>
      {selectedCityData && <DisplayLocation location={selectedCityData} />}
    </div>
  )
}

export default SelectCity
