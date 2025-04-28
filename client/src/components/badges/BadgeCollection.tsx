import React from "react";
import { Badge, badges } from "@/lib/badges";
import { BadgeIcon } from "./BadgeIcon";

interface BadgeCollectionProps {
  unlockedBadges: Badge[];
  showLocked?: boolean;
  filterCategory?: 'achievement' | 'progress' | 'specialty' | 'all';
}

export function BadgeCollection({ 
  unlockedBadges, 
  showLocked = false, 
  filterCategory = 'all' 
}: BadgeCollectionProps) {
  // Filter badges based on the selected category
  const filteredBadges = badges.filter(badge => 
    filterCategory === 'all' || badge.category === filterCategory
  );
  
  // Create a map of unlocked badges for quick lookup
  const unlockedBadgeMap = new Map(unlockedBadges.map(badge => [badge.id, badge]));
  
  return (
    <div className="p-1">
      {filteredBadges.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No badges in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          {filteredBadges.map(badge => {
            const isUnlocked = unlockedBadgeMap.has(badge.id);
            
            // If not showing locked badges and this badge is locked, skip it
            if (!showLocked && !isUnlocked) {
              return null;
            }
            
            return (
              <div key={badge.id} className="flex flex-col items-center">
                <BadgeIcon 
                  badge={badge} 
                  size="md" 
                  unlocked={isUnlocked} 
                />
                <div className="text-center mt-2">
                  <p className="text-xs font-semibold text-gray-800">
                    {isUnlocked ? badge.name : "???"}
                  </p>
                  {!isUnlocked && (
                    <p className="text-xs text-gray-500">Locked</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}