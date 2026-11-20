import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rate: number;
  count?: number;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rate,
  count,
  showCount = true,
  size = 'sm',
}) => {
  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="flex items-center space-x-1.5" aria-label={`Rating: ${rate} out of 5 stars`}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.round(rate);
          return (
            <Star
              key={star}
              className={`${starSizes[size]} ${
                filled
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-slate-300 fill-slate-100'
              } transition-colors`}
            />
          );
        })}
      </div>
      <span className={`font-semibold text-slate-800 ${textSizes[size]}`}>
        {rate.toFixed(1)}
      </span>
      {showCount && count !== undefined && (
        <span className={`text-slate-500 ${textSizes[size]}`}>
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
};

