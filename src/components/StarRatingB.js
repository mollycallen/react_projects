import React from 'react'

const StarRatingB = ({ rating }) => {
  // Create an array for stars based on the total number of stars you want to display
  const totalStars = 5
  const stars = []

  for (let i = 1; i <= totalStars; i++) {
    if (i <= Math.floor(rating)) {
      // Full star
      stars.push(<span key={i}>&#9733;</span>)
    } else if (i - rating < 1) {
      // Half star
      stars.push(<span key={i}>&#9734;</span>)
    } else {
      // Empty star
      stars.push(<span key={i}>&#9734;</span>)
    }
  }

  return <div style={{ color: 'orange', fontSize: '24px' }}>{stars}</div>
}

export default StarRatingB
