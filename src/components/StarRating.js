import React from "react";
import "./StarRating.css";

const StarRating = ({ rating, maxRating = 5, color = "#ffd700" }) => {
  // Ensure rating is within valid range
  const normalizedRating = Math.max(0, Math.min(rating, maxRating));

  // Calculate full stars, half star, and empty stars
  const fullStars = Math.floor(normalizedRating);
  const hasHalfStar = normalizedRating % 1 >= 0.5;
  const emptyStars = maxRating - Math.ceil(normalizedRating);

  return (
    <div className="star-rating">
      {/* Full stars */}
      {[...Array(fullStars)].map((_, index) => (
        <span
          key={`full-${index}`}
          className="star full-star"
          style={{ color }}
        >
          ★
        </span>
      ))}

      {/* Half star */}
      {hasHalfStar && (
        <span className="star half-star" style={{ color }}>
          ★
        </span>
      )}

      {/* Empty stars */}
      {[...Array(emptyStars)].map((_, index) => (
        <span
          key={`empty-${index}`}
          className="star empty-star"
          style={{ color: "#ccc" }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
