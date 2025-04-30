import React from 'react';
import { Tooltip, TooltipProvider } from '../ui/simple-tooltip';
import { InfoIcon, AlertCircle, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ContextHelpSize = 'sm' | 'md' | 'lg';
type ContextHelpType = 'info' | 'help' | 'warning' | 'definition';

interface ContextualHelpProps {
  content: React.ReactNode;
  type?: ContextHelpType;
  size?: ContextHelpSize;
  className?: string;
  tooltipAlign?: 'start' | 'center' | 'end';
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  inline?: boolean;
}

export function ContextualHelp({
  content,
  type = 'info',
  size = 'md',
  className,
  tooltipAlign = 'center',
  tooltipSide = 'top',
  inline = false,
}: ContextualHelpProps) {
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

  return (
    <span className={cn('inline-flex', inline ? 'mx-1' : '', className)}>
      <TooltipProvider>
        <Tooltip
          content={
            <div className={cn('max-w-xs')}>
              {content}
            </div>
          }
          contentClassName={contextColors[type]}
          side={tooltipSide}
          align={tooltipAlign}
        >
          <button 
            type="button"
            aria-label={`${type} tooltip`}
            className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            {getIcon()}
          </button>
        </Tooltip>
      </TooltipProvider>
    </span>
  );
}