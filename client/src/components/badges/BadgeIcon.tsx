import React from 'react';
import { Badge } from '@/lib/badges';
import { cn } from '@/lib/utils';

interface BadgeIconProps {
  badge: Badge;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  unlocked?: boolean;
}

export function BadgeIcon({ 
  badge, 
  size = 'md',
  showTooltip = true,
  unlocked = true 
}: BadgeIconProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl'
  };
  
  const levelColors = {
    bronze: 'bg-amber-100 border-amber-400',
    silver: 'bg-gray-200 border-gray-400',
    gold: 'bg-yellow-100 border-yellow-400'
  };
  
  const lockedClasses = unlocked ? '' : 'grayscale opacity-50';
  
  return (
    <div className="relative group">
      <div 
        className={cn(
          "flex items-center justify-center rounded-full border-2 shadow-sm transition-transform transform group-hover:scale-105",
          sizeClasses[size],
          badge.level ? levelColors[badge.level] : 'bg-gray-100 border-gray-300',
          lockedClasses
        )}
      >
        <span role="img" aria-label={badge.name}>
          {badge.icon}
        </span>
      </div>
      
      {showTooltip && (
        <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm bg-gray-900 text-white rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          <div className="font-bold">{badge.name}</div>
          <div className="text-xs text-gray-300">{badge.description}</div>
          {!unlocked && <div className="text-xs mt-1 italic">Locked</div>}
        </div>
      )}
    </div>
  );
}