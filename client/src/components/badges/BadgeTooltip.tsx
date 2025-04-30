import React, { useState } from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/lib/badges';

interface BadgeTooltipProps {
  badge: Badge;
  children: React.ReactElement;
  getLevelColor: (level?: 'bronze' | 'silver' | 'gold') => string;
}

export function BadgeTooltip({ 
  badge, 
  children,
  getLevelColor
}: BadgeTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const tooltipAnimation = {
    initial: { 
      opacity: 0, 
      scale: 0.95,
      y: 8 
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 350,
        damping: 25,
        duration: 0.3,
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: {
        duration: 0.15,
      }
    }
  };

  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root open={isOpen} onOpenChange={setIsOpen}>
        <RadixTooltip.Trigger className="inline-flex">
          {children}
        </RadixTooltip.Trigger>
        
        <AnimatePresence>
          {isOpen && (
            <RadixTooltip.Portal forceMount>
              <RadixTooltip.Content
                side="top"
                align="center"
                sideOffset={5}
                asChild
              >
                <motion.div
                  className="z-50 overflow-hidden rounded-md bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] px-3 py-1.5 text-sm text-black font-medium"
                  variants={tooltipAnimation}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <div className="text-center max-w-xs">
                    <h3 className="font-bold">{badge.name}</h3>
                    <p className="text-sm text-gray-600">{badge.description}</p>
                    {badge.level && (
                      <p className="text-xs mt-1 capitalize" style={{ color: getLevelColor(badge.level) }}>
                        {badge.level} Level
                      </p>
                    )}
                  </div>
                  <RadixTooltip.Arrow 
                    className="fill-white stroke-black stroke-2" 
                    width={12} 
                    height={6} 
                  />
                </motion.div>
              </RadixTooltip.Content>
            </RadixTooltip.Portal>
          )}
        </AnimatePresence>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}