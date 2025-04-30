import React, { useState } from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/lib/badges';

interface SimpleBadgeTooltipProps {
  badge: Badge;
  children: React.ReactElement;
  getLevelColor: (level?: 'bronze' | 'silver' | 'gold') => string;
}

export function SimpleBadgeTooltip({ 
  badge, 
  children,
  getLevelColor
}: SimpleBadgeTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div 
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="relative inline-block"
      >
        {children}
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute z-50 w-48 bg-white rounded-md shadow-lg border-2 border-black p-2 top-full left-1/2 transform -translate-x-1/2 -translate-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
            >
              <div className="text-center">
                <h3 className="font-bold">{badge.name}</h3>
                <p className="text-sm text-gray-600">{badge.description}</p>
                {badge.level && (
                  <p className="text-xs mt-1 capitalize" style={{ color: getLevelColor(badge.level) }}>
                    {badge.level} Level
                  </p>
                )}
              </div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-3 h-3 bg-white border-l-2 border-t-2 border-black"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}