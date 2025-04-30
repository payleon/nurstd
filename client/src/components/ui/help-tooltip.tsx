import React, { useState } from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { AnimatePresence, motion } from 'framer-motion';
import { InfoIcon, AlertCircle, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ContextHelpSize = 'sm' | 'md' | 'lg';
type ContextHelpType = 'info' | 'help' | 'warning' | 'definition';

interface HelpTooltipProps {
  content: React.ReactNode;
  type?: ContextHelpType;
  size?: ContextHelpSize;
  className?: string;
  tooltipAlign?: 'start' | 'center' | 'end';
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  inline?: boolean;
}

export function HelpTooltip({
  content,
  type = 'info',
  size = 'md',
  className,
  tooltipAlign = 'center',
  tooltipSide = 'top',
  inline = false,
}: HelpTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const typeStyles = {
    info: 'text-blue-500 hover:text-blue-600',
    help: 'text-purple-500 hover:text-purple-600',
    warning: 'text-amber-500 hover:text-amber-600',
    definition: 'text-emerald-500 hover:text-emerald-600',
  };

  const getIcon = () => {
    switch (type) {
      case 'info':
        return <InfoIcon className={cn(sizeMap[size], typeStyles[type], "stroke-[2.5px]")} />;
      case 'warning':
        return <AlertCircle className={cn(sizeMap[size], typeStyles[type], "stroke-[2.5px]")} />;
      case 'definition':
      case 'help':
      default:
        return <HelpCircle className={cn(sizeMap[size], typeStyles[type], "stroke-[2.5px]")} />;
    }
  };

  const contextColors = {
    info: 'bg-blue-50 border-blue-200',
    help: 'bg-purple-50 border-purple-200',
    warning: 'bg-amber-50 border-amber-200',
    definition: 'bg-emerald-50 border-emerald-200',
  };
  
  const tooltipAnimation = {
    initial: { 
      opacity: 0, 
      scale: 0.95,
      y: tooltipSide === 'top' ? 8 : tooltipSide === 'bottom' ? -8 : 0,
      x: tooltipSide === 'left' ? 8 : tooltipSide === 'right' ? -8 : 0,
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
    <span className={cn('inline-flex', inline ? 'mx-1' : '', className)}>
      <RadixTooltip.Provider>
        <RadixTooltip.Root open={isOpen} onOpenChange={setIsOpen}>
          <RadixTooltip.Trigger className="inline-flex">
            <button 
              type="button"
              aria-label={`${type} tooltip`}
              className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {getIcon()}
            </button>
          </RadixTooltip.Trigger>
          
          <AnimatePresence>
            {isOpen && (
              <RadixTooltip.Portal forceMount>
                <RadixTooltip.Content
                  side={tooltipSide}
                  align={tooltipAlign}
                  sideOffset={5}
                  asChild
                >
                  <motion.div
                    className={cn(
                      "z-50 overflow-hidden rounded-md bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] px-3 py-1.5 text-sm text-black font-medium",
                      contextColors[type]
                    )}
                    variants={tooltipAnimation}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <div className={cn('max-w-xs')}>
                      {content}
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
    </span>
  );
}