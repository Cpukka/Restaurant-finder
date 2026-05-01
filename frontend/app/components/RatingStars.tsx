'use client';

import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface RatingStarsProps {
  rating: number;
  size?: 'small' | 'medium' | 'large';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export default function RatingStars({ 
  rating, 
  size = 'medium', 
  interactive = false, 
  onRatingChange 
}: RatingStarsProps) {
  const stars = [1, 2, 3, 4, 5];
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6',
  };

  return (
    <div className="flex items-center space-x-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onRatingChange?.(star)}
          disabled={!interactive}
          className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} focus:outline-none`}
          aria-label={`Rate ${star} stars`}
        >
          {star <= Math.round(rating) ? (
            <StarIcon className={`${sizeClasses[size]} text-yellow-400 drop-shadow-sm`} />
          ) : (
            <StarOutlineIcon className={`${sizeClasses[size]} text-gray-300 dark:text-gray-600`} />
          )}
        </button>
      ))}
    </div>
  );
}