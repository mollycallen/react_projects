import React, { useContext } from 'react'
import { Droplets } from 'lucide-react'
import WeatherIcon from './WeatherIcon'
import DailyForecast from './DailyForecast'
import HourlyForecast from './HourlyForecast'
import { ThemeContext } from '../../App'

import { VIEW_TYPES } from './utils'

const Forecast = ({ forecast, location, view }) => {
  const { darkMode, textColor, bgColor } = useContext(ThemeContext)

  return (
    <div className={`card shadow ${bgColor} ${textColor}`}>
      <div className='card-body'>
        <h5 className='card-title mb-4'>
          {location ? `Current Weather in ${location.city}` : 'Current Weather'}
        </h5>

        <div>
          <div className={`card border mb-4 ${bgColor} ${textColor}`}>
            <div className='card-body'>
              <div className='d-flex flex-wrap gap-4 justify-content-between align-items-center'>
                <div className='d-flex align-items-center'>
                  {forecast.daily.weather_code && (
                    <WeatherIcon
                      weatherCode={forecast.daily.weather_code[0]}
                      size={64}
                    />
                  )}
                </div>
                <div className='d-flex align-items-center'>
                  <div>
                    <h2 className='mb-0'>
                      {forecast.current.temperature_2m.toFixed(1)}°F
                    </h2>
                    <p className='text-muted mb-0'>
                      Feels like:{' '}
                      {forecast.current.apparent_temperature.toFixed(1)}°F
                    </p>
                  </div>
                </div>
                <div className='d-flex align-items-center'>
                  <Droplets className='me-2 text-primary' size={24} />
                  <div>
                    <p className='mb-0'>
                      {forecast.current.precipitation.toFixed(2)} in
                    </p>
                    <p className='mb-0 text-muted small'>Precipitation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {view === VIEW_TYPES.DAILY ? (
            <DailyForecast
              dates={forecast.daily.time}
              weatherCodes={forecast.daily.weather_code}
              highTemps={forecast.daily.temperature_2m_max}
              lowTemps={forecast.daily.temperature_2m_min}
              precipChances={forecast.daily.precipitation_probability_max}
              darkMode={darkMode}
            />
          ) : (
            <HourlyForecast
              hours={forecast.hourly.time}
              weatherCodes={forecast.hourly.weather_code}
              temps={forecast.hourly.temperature_2m}
              apparentTemps={forecast.hourly.apparent_temperature}
              precipChances={forecast.hourly.precipitation_probability}
              darkMode={darkMode}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Forecast
