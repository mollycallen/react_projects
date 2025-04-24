// WeatherIcon.jsx
import { getWeatherInfo } from './utils'

export default function WeatherIcon ({
  weatherCode,
  size = 24,
  className = '',
  showIcon = true
}) {
  const weatherInfo = getWeatherInfo(weatherCode)
  const IconComponent = weatherInfo.icon
  return (
    <div className='d-flex align-items-center'>
      {showIcon && (
        <IconComponent
          size={size}
          className={`weather-icon ${className}`}
          color={weatherInfo.color}
        />
      )}
      <span className={`px-2 ${!showIcon ? 'ps-0' : ''}`}>
        {weatherInfo.description}
      </span>
    </div>
  )
}
