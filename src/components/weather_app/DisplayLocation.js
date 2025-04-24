import React, { useContext } from 'react'
import { ThemeContext } from '../../App'

import { MapPin } from 'lucide-react'

const DisplayLocation = ({ location }) => {
  const { textColor, bgColor } = useContext(ThemeContext)

  if (!location) return null

  return (
    <div
      className={`card shadow-sm p-3  mt-1 ${textColor} ${bgColor}`}
      style={{ width: 'fit-content' }}
    >
      <h5 className='py-2 d-flex align-items-center'>
        <MapPin className='me-2' />
        <strong>{location.city}</strong>
      </h5>
      <div className='lh-sm ms-4'>
        <p className='mb-1'>Latitude: {location.latitude.toFixed(4)}</p>
        <p className='mb-0'>Longitude: {location.longitude.toFixed(4)}</p>
      </div>
    </div>
  )
}

export default DisplayLocation
