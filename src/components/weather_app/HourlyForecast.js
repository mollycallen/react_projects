import PropTypes from 'prop-types'
import WeatherIcon from './WeatherIcon'
import './HourlyForecast.css'

const HourlyForecast = ({
  hours,
  weatherCodes,
  temps,
  apparentTemps,
  precipChances,
  darkMode
}) => {
  const formatDate = date => {
    const options = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC'
    }
    return new Date(date).toLocaleString('en-US', options)
  }

  const formatDateMedium = date => {
    const options = {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      hour12: true,
      timeZone: 'UTC'
    }
    return new Date(date).toLocaleString('en-US', options)
  }

  const formatDateSmall = date => {
    const options = {
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      hour12: true,
      timeZone: 'UTC'
    }
    return new Date(date).toLocaleString('en-US', options)
  }

  return (
    <div className='hourly-forecast-container'>
      <h6 className='my-3'>Hourly Forecast</h6>
      <div
        className={`table-responsive`}
        style={{ height: '400px', overflowY: 'auto' }}
      >
        <table className={`table table-hover ${darkMode ? 'table-dark' : ''}`}>
          <thead className='sticky-top bg-white'>
            <tr>
              <th className='py-2'>Hour</th>
              <th className='py-2'>Weather</th>
              <th className='py-2 text-center'>Temp</th>
              <th className='py-2 text-center'>Feels Like</th>
              <th className='py-2 text-end'>
                <span className='d-none d-sm-inline'>Precip</span>
                <span className='d-sm-none'>Pcp</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {hours.map((hour, index) => (
              <tr key={hour}>
                <td className='pe-4'>
                  <span className='date-large'>{formatDate(hour)}</span>
                  <span className='date-medium'>{formatDateMedium(hour)}</span>
                  <span className='date-small'>{formatDateSmall(hour)}</span>
                </td>
                <td>
                  <WeatherIcon weatherCode={weatherCodes[index]} size={24} />
                </td>
                <td
                  className={`text-center text-nowrap ${
                    darkMode ? 'text-light' : 'text-muted'
                  }`}
                >
                  {temps[index].toFixed(0)}°
                </td>
                <td
                  className={`text-center text-nowrap ${
                    darkMode ? 'text-light' : 'text-muted'
                  }`}
                >
                  {apparentTemps[index].toFixed(0)}°
                </td>
                <td
                  className={`text-center text-nowrap ${
                    darkMode ? 'text-light' : 'text-muted'
                  }`}
                >
                  {precipChances[index]}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

HourlyForecast.propTypes = {
  hours: PropTypes.arrayOf(PropTypes.string).isRequired,
  weatherCodes: PropTypes.arrayOf(PropTypes.number).isRequired,
  temps: PropTypes.arrayOf(PropTypes.number).isRequired,
  apparentTemps: PropTypes.arrayOf(PropTypes.number).isRequired,
  precipChances: PropTypes.arrayOf(PropTypes.number).isRequired,
  darkMode: PropTypes.bool.isRequired
}

export default HourlyForecast
