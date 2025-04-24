/**
 * Formats time from milliseconds to MM:SS:ms format, handling both negative and positive numbers.
 * @param {number} timeInMilliseconds - The time in milliseconds.
 * @returns {string} The formatted time string in MM:SS:ms format.
 */
export const formatTimeMSm = timeInMilliseconds => {
  const isNegative = timeInMilliseconds < 0
  const absoluteTime = Math.abs(timeInMilliseconds)

  const minutes = Math.floor(absoluteTime / 60000)
  const seconds = Math.floor((absoluteTime % 60000) / 1000)
  const milliseconds = Math.floor((absoluteTime % 1000) / 10)

  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`

  return isNegative ? `-${formattedTime}` : formattedTime
}

/**
 * Formats time from seconds to HH:MM:SS format, handling both negative and positive numbers.
 * @param {number} timeInSeconds - The time in seconds.
 * @returns {string} The formatted time string in HH:MM:SS format.
 */
export const formatTimeHMS = timeInSeconds => {
  const isNegative = timeInSeconds < 0
  const absoluteTime = Math.abs(timeInSeconds)

  const hours = Math.floor(absoluteTime / 3600)
  const minutes = Math.floor((absoluteTime % 3600) / 60)
  const seconds = Math.floor(absoluteTime % 60)

  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  return isNegative ? `-${formattedTime}` : formattedTime
}
