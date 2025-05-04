import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  value: number;       // Value between 0-100
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

export function ProgressIndicator({ 
  value, 
  size = 'md', 
  color = 'primary',
  showLabel = true,
  animated = true,
  className 
}: ProgressIndicatorProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  
  useEffect(() => {
    if (animated) {
      // Start from current animated value to avoid jumps
      const startValue = animatedValue;
      const duration = 500; // animation duration in ms
      const startTime = performance.now();

      const animateProgress = (currentTime: number) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const currentValue = startValue + progress * (value - startValue);

        setAnimatedValue(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animateProgress);
        }
      };

      requestAnimationFrame(animateProgress);
    } else {
      setAnimatedValue(value);
    }
  }, [value]);

  // Size classes
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  // Color classes
  const colorClasses = {
    primary: 'bg-[#4B9CD3]',
    secondary: 'bg-[#13294B]',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="w-full bg-gray-200 rounded-full overflow-hidden border border-black">
        <div 
          className={cn(
            "rounded-full transition-all",
            sizeClasses[size],
            colorClasses[color]
          )}
          style={{ width: `${animatedValue}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-xs">
          <span>{Math.round(animatedValue)}%</span>
          <span>Complete</span>
        </div>
      )}
    </div>
  );
}