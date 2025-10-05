import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  className?: string;
}

export default function StarRating({
  rating,
  maxRating = 5,
  className,
}: StarRatingProps) {
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: maxRating }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            'h-4 w-4',
            rating > index
              ? 'text-accent fill-accent'
              : 'text-muted-foreground/50'
          )}
        />
      ))}
    </div>
  );
}
