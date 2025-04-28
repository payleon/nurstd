import React from 'react';
import { Badge, badges } from '@/lib/badges';
import { BadgeIcon } from './BadgeIcon';

interface BadgeCollectionProps {
  unlockedBadges: Badge[];
  showLocked?: boolean;
  filterCategory?: 'achievement' | 'progress' | 'specialty' | 'all';
}

export function BadgeCollection({ 
  unlockedBadges, 
  showLocked = true,
  filterCategory = 'all'
}: BadgeCollectionProps) {
  const unlockedBadgeIds = unlockedBadges.map(badge => badge.id);
  
  const filteredBadges = badges.filter(badge => {
    if (filterCategory !== 'all' && badge.category !== filterCategory) {
      return false;
    }
    return true;
  });
  
  return (
    <div className="py-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredBadges.map(badge => {
          const isUnlocked = unlockedBadgeIds.includes(badge.id);
          
          if (!isUnlocked && !showLocked) return null;
          
          return (
            <div key={badge.id} className="flex flex-col items-center">
              <BadgeIcon 
                badge={badge} 
                unlocked={isUnlocked}
                size="md" 
              />
              <div className="mt-2 text-center">
                <p className="text-sm font-medium">{badge.name}</p>
                <p className="text-xs text-gray-500 line-clamp-2">{badge.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}