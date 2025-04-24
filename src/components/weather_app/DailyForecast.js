import PropTypes from 'prop-types'
import WeatherIcon from './WeatherIcon'
import './DailyForecast.css'

const DailyForecast = ({
  dates,
  weatherCodes,
  highTemps,
  lowTemps,
  precipChances,
  darkMode
}) => {
  return (
    <div className='daily-forecast-container'>
      <h6 className='my-3'>7-Day Forecast</h6>
      <div className='table-responsive'>
        <table className={`table table-hover ${darkMode ? 'table-dark' : ''}`}>
          <thead>
            <tr className='d-none d-sm-table-row'>
              <th>Date</th>
              <th>Weather</th>
              <th className='text-center'>High / Low</th>
              <th className='text-center'>Precip</th>
            </tr>
          </thead>
          <tbody>
            {dates.map((time, index) => (
              <tr key={time} className='forecast-row'>
                <td className='pe-2 pe-sm-4'>
                  {new Date(time).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    timeZone: 'UTC'
                  })}
                </td>
                <td className='weather-cell'>
                  <WeatherIcon weatherCode={weatherCodes[index]} size={24} />
                </td>
                <td
                  className={`text-center text-nowrap ${
                    darkMode ? 'text-light' : 'text-muted'
                  }`}
                >
                  {highTemps[index].toFixed(0)}°{' / '}
                  {lowTemps[index].toFixed(0)}°
                </td>
                <td
                  className={`text-center precip-cell ${
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

DailyForecast.propTypes = {
  dates: PropTypes.arrayOf(PropTypes.string).isRequired,
  weatherCodes: PropTypes.arrayOf(PropTypes.number).isRequired,
  highTemps: PropTypes.arrayOf(PropTypes.number).isRequired,
  lowTemps: PropTypes.arrayOf(PropTypes.number).isRequired,
  precipChances: PropTypes.arrayOf(PropTypes.number).isRequired,
  darkMode: PropTypes.bool
}

export default DailyForecast
