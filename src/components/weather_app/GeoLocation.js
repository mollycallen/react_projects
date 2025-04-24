import React, { useState } from 'react'
import DisplayLocation from './DisplayLocation'

import { LOCATION_SOURCES } from './utils'

const API_KEY = '1012f9575c9243dfb3bf2e47af182a28'

const GeoLocation = ({ onLocationUpdate }) => {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)

  async function getLocation () {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async position => {
          const city = await getCityName(
            position.coords.latitude,
            position.coords.longitude
          )
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            city: city
          }
          setLocation(newLocation)
          if (onLocationUpdate) {
            onLocationUpdate(newLocation, LOCATION_SOURCES.GEOLOCATION)
          }
        },
        err => {
          setError('Error: ' + err.message)
        }
      )
    } else {
      setError('Geolocation is not supported by your browser')
    }
  }

  async function getCityName (lat, lon) {
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${API_KEY}`,
        { method: 'GET' }
      )
      const result = await response.json()
      return `${result.features[0].properties.city}, ${result.features[0].properties.state_code}`
    } catch (error) {
      console.error('Error fetching city name:', error)
      return ''
    }
  }

  return (
    <div>
      <label htmlFor='citySelect' className='form-label text-dark'>
        Use Current Location&nbsp;
      </label>

      <button className='btn btn-primary' onClick={getLocation}>
        Get My Location
      </button>

      {location && <DisplayLocation location={location} />}

      {error && <p className='text-danger'>{error}</p>}
    </div>
  )
}

export default GeoLocation
