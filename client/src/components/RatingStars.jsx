import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 0, count, size = 16, interactive = false, onSelect }) => {
  const numRating = Number(rating) || 0;

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= numRating;
        return (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            disabled={!interactive}
            onClick={() => interactive && onSelect && onSelect(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          >
            <Star
              size={size}
              className={`${
                isFilled
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-gray-200 text-gray-300'
              }`}
            />
          </button>
        );
      })}
      {count !== undefined && (
        <span className="text-xs text-gray-400 ml-1 font-body font-medium">({count})</span>
      )}
    </div>
  );
};

export default RatingStars;

