
import React, { useState } from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Import separate tooltip primitives for better composition
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
  arrowClassName?: string;
  contentClassName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Tooltip({
  children,
  content,
  side = 'top',
  align = 'center',
  delay = 300,
  className,
  arrowClassName,
  contentClassName,
  open,
  onOpenChange,
}: TooltipProps) {
  const [controlledOpen, setControlledOpen] = useState(false);
  
  const isOpen = open !== undefined ? open : controlledOpen;
  const handleOpenChange = onOpenChange || setControlledOpen;

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
    <RadixTooltip.Root open={isOpen} onOpenChange={handleOpenChange}>
      <RadixTooltip.Trigger asChild>
        {children}
      </RadixTooltip.Trigger>
      
      <AnimatePresence>
        {isOpen && (
          <RadixTooltip.Portal forceMount>
            <RadixTooltip.Content
              side={side}
              align={align}
              sideOffset={5}
              asChild
              className={className}
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
                  className={cn("fill-white stroke-black stroke-2", arrowClassName)} 
                  width={12} 
                  height={6} 
                />
              </motion.div>
            </RadixTooltip.Content>
          </RadixTooltip.Portal>
        )}
      </AnimatePresence>
    </RadixTooltip.Root>
  );
}
