import React, { useState, useCallback, useMemo, useContext } from 'react'
import SelectCity from './SelectCity'
import GeoLocation from './GeoLocation'
import Forecast from './Forecast'
import LineGraphDisplay from './LineGraphDisplay'
import { ThemeContext } from '../../App'

import { LOCATION_SOURCES, VIEW_TYPES } from './utils'

const extractTimestamps = dateTimeArray => {
  return dateTimeArray.map(dateTime => {
    const time = dateTime.split('T')[1]
    return time
  })
}

const WeatherApp = () => {
  const [forecast, setForecast] = useState(null)
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [activeOption, setActiveOption] = useState(null)
  const [activeView, setActiveView] = useState(VIEW_TYPES.DAILY)

  const { textColor, bgColor } = useContext(ThemeContext)

  const getUserTimezone = () => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone
    } catch (e) {
      return 'UTC' // Fallback to UTC if unable to get user's timezone
    }
  }

  const fetchForecast = useCallback(async (latitude, longitude) => {
    try {
      const userTimezone = getUserTimezone()
      const encodedTimezone = encodeURIComponent(userTimezone)

      const url =
        `https://api.open-meteo.com/v1/forecast?` +
        `latitude=${latitude}&` +
        `longitude=${longitude}&` +
        `current=temperature_2m,apparent_temperature,precipitation&` +
        `hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,weather_code&` +
        `daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&` +
        `temperature_unit=fahrenheit&` +
        `wind_speed_unit=mph&` +
        `timezone=${encodedTimezone}`

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch forecast data')
      }
      const data = await response.json()
      setForecast(data)
    } catch (err) {
      setError('Error fetching forecast: ' + err.message)
    }
  }, [])

  const handleLocationUpdate = useCallback(
    (newLocation, source) => {
      if (newLocation) {
        setLocation(newLocation)
        setActiveOption(source)
        fetchForecast(newLocation.latitude, newLocation.longitude)
      }
    },
    [fetchForecast]
  )

  const toggleView = () => {
    setActiveView(prev =>
      prev === VIEW_TYPES.HOURLY ? VIEW_TYPES.DAILY : VIEW_TYPES.HOURLY
    )
  }

  const hourlyDataConfig = useMemo(() => {
    if (!forecast) return null
    return {
      xAxisData: extractTimestamps(forecast.hourly.time.slice(0, 25)),
      xAxisLabel: 'Hour',
      yAxisLabel: 'Temperature (°F)',
      series: [
        {
          dataKey: 'high',
          label: 'Temperature',
          data: forecast.hourly.temperature_2m.slice(0, 24),
          color: '#ff7300'
        },
        {
          dataKey: 'low',
          label: 'Feels Like Temperature',
          data: forecast.hourly.apparent_temperature.slice(0, 24),
          color: '#0088fe'
        }
      ]
    }
  }, [forecast])

  const dailyDataConfig = useMemo(() => {
    if (!forecast) return null
    return {
      xAxisData: forecast.daily.time,
      xAxisLabel: 'Date',
      yAxisLabel: 'Temperature (°F)',
      series: [
        {
          dataKey: 'high',
          label: 'High Temperature',
          data: forecast.daily.temperature_2m_max,
          color: '#ff7300'
        },
        {
          dataKey: 'low',
          label: 'Low Temperature',
          data: forecast.daily.temperature_2m_min,
          color: '#0088fe'
        }
      ]
    }
  }, [forecast])

  return (
    <div className='container mt-1'>
      <div className='card shadow mb-4'>
        <div className={`card-body ${bgColor} ${textColor}`}>
          <h5 className='card-title mb-3'>Choose Your Location</h5>
          <p className='`mb-4'>
            Select a city from the dropdown or use your current location to get
            the weather forecast.
          </p>
          <div className='row g-3'>
            <div className='col-md-6'>
              <div
                className={`h-100 p-3 rounded text-dark ${
                  activeOption === LOCATION_SOURCES.CITY
                    ? 'bg-warning-subtle'
                    : 'bg-secondary-subtle'
                }`}
              >
                <SelectCity onLocationUpdate={handleLocationUpdate} />
              </div>
            </div>
            <div className='col-md-6'>
              <div
                className={`h-100 p-3 rounded ${
                  activeOption === LOCATION_SOURCES.GEOLOCATION
                    ? 'bg-warning-subtle'
                    : 'bg-secondary-subtle'
                }`}
              >
                <GeoLocation onLocationUpdate={handleLocationUpdate} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {forecast && (
        <>
          <div className='d-flex justify-content-end mb-3'>
            <button className='btn btn-primary' onClick={toggleView}>
              Switch to{' '}
              {activeView === VIEW_TYPES.HOURLY
                ? VIEW_TYPES.DAILY
                : VIEW_TYPES.HOURLY}{' '}
              View
            </button>
          </div>
          <Forecast forecast={forecast} location={location} view={activeView} />
          {activeView === VIEW_TYPES.HOURLY ? (
            <LineGraphDisplay
              title='Hourly Temperatures'
              location={location.city}
              dataConfig={hourlyDataConfig}
              textColor={textColor}
              bgColor={bgColor}
            />
          ) : (
            <LineGraphDisplay
              title='Daily Temperatures'
              location={location.city}
              dataConfig={dailyDataConfig}
              textColor={textColor}
              bgColor={bgColor}
            />
          )}
        </>
      )}
      {error && <p className='text-danger'>{error}</p>}
    </div>
  )
}

export default WeatherApp
