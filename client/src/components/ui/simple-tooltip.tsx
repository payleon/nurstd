import React, { useState } from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Provider component
export function TooltipProvider({ 
  children, 
  delayDuration = 300 
}: { 
  children: React.ReactNode; 
  delayDuration?: number;
}) {
  return (
    <RadixTooltip.Provider delayDuration={delayDuration}>
      {children}
    </RadixTooltip.Provider>
  );
}

// Main tooltip component with animation
interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  delay?: number;
  className?: string;
  contentClassName?: string;
}

export function Tooltip({
  children,
  content,
  side = 'top',
  align = 'center',
  delay = 300,
  className,
  contentClassName,
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const tooltipAnimation = {
    initial: { 
      opacity: 0, 
      scale: 0.95,
      y: side === 'top' ? 8 : side === 'bottom' ? -8 : 0,
      x: side === 'left' ? 8 : side === 'right' ? -8 : 0,
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      x: 0,
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
        <RadixTooltip.Trigger className="inline-flex" asChild>
          {children}
        </RadixTooltip.Trigger>
        
        <AnimatePresence>
          {isOpen && (
            <RadixTooltip.Portal forceMount>
              <RadixTooltip.Content
                side={side}
                align={align}
                sideOffset={5}
                className={className}
                asChild
              >
                <motion.div
                  className={cn(
                    "z-50 overflow-hidden rounded-md bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] px-3 py-1.5 text-sm text-black font-medium font-inter",
                    contentClassName
                  )}
                  variants={tooltipAnimation}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {content}
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