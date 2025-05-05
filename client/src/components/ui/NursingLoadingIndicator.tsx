import React from 'react';
import { 
  Heart, 
  Stethoscope, 
  Pill, 
  Syringe, 
  Thermometer, 
  Activity, 
  Brain,
  Clipboard,
  HeartPulse,
  Hourglass
} from 'lucide-react';

export type LoadingIndicatorType = 
  | 'heart' 
  | 'stethoscope' 
  | 'pill' 
  | 'syringe' 
  | 'thermometer' 
  | 'activity' 
  | 'brain'
  | 'clipboard'
  | 'pulse'
  | 'medical-spinner'
  | 'hourglass';

interface NursingLoadingIndicatorProps {
  type?: LoadingIndicatorType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  showProgress?: boolean;
  progress?: number;
  color?: string;
}

export function NursingLoadingIndicator({
  type = 'medical-spinner',
  size = 'md',
  message = 'Loading...',
  showProgress = false,
  progress = 0,
  color = '#4B9CD3' // Default NCLEX blue
}: NursingLoadingIndicatorProps) {
  // Size mappings
  const sizeMap = {
    sm: {
      iconSize: 'h-6 w-6',
      containerClass: 'p-2',
      textClass: 'text-sm',
      spinnerSize: 'h-14 w-14'
    },
    md: {
      iconSize: 'h-8 w-8',
      containerClass: 'p-3',
      textClass: 'text-base',
      spinnerSize: 'h-20 w-20'
    },
    lg: {
      iconSize: 'h-12 w-12',
      containerClass: 'p-4',
      textClass: 'text-lg',
      spinnerSize: 'h-28 w-28'
    },
    xl: {
      iconSize: 'h-16 w-16',
      containerClass: 'p-5',
      textClass: 'text-xl',
      spinnerSize: 'h-36 w-36'
    }
  };

  // Get the current size config
  const currentSize = sizeMap[size];

  // Standard icon-based indicator
  const renderIconIndicator = () => {
    let Icon;
    
    switch (type) {
      case 'heart':
        Icon = Heart;
        break;
      case 'stethoscope':
        Icon = Stethoscope;
        break;
      case 'pill':
        Icon = Pill;
        break;
      case 'syringe':
        Icon = Syringe;
        break;
      case 'thermometer':
        Icon = Thermometer;
        break;
      case 'activity':
        Icon = Activity;
        break;
      case 'brain':
        Icon = Brain;
        break;
      case 'clipboard':
        Icon = Clipboard;
        break;
      case 'pulse':
        Icon = HeartPulse;
        break;
      case 'hourglass':
        Icon = Hourglass;
        break;
      default:
        Icon = Stethoscope;
    }
    
    return (
      <div className={`animate-pulse flex-shrink-0 ${currentSize.iconSize}`} style={{ color }}>
        <Icon className={`${currentSize.iconSize}`} />
      </div>
    );
  };
  
  // Medical spinner (more complex SVG animation)
  const renderMedicalSpinner = () => {
    return (
      <div className={`relative ${currentSize.spinnerSize}`}>
        {/* Outer circle */}
        <div 
          className="absolute inset-0 rounded-full border-4 border-gray-200"
          style={{ borderColor: `${color}20` }}
        ></div>
        
        {/* Spinning arc */}
        <div className="absolute inset-0">
          <svg className="w-full h-full animate-spin" viewBox="0 0 100 100">
            <circle
              className="stroke-current transition-all duration-300"
              style={{ color, strokeDashoffset: showProgress ? 100 - progress : 25 }}
              strokeWidth="4"
              strokeDasharray="100"
              strokeLinecap="round"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
            />
          </svg>
        </div>
        
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Heart 
            className="w-1/3 h-1/3 animate-pulse" 
            style={{ color }}
          />
        </div>
      </div>
    );
  };
  
  // Render the EKG line animation
  const renderEKGLine = () => {
    return (
      <div className="w-full h-12 flex items-center overflow-hidden">
        <svg 
          viewBox="0 0 120 25" 
          className="w-full"
          style={{ color }}
        >
          <path
            className="ekg-line"
            d="M 0,12 
               L 8,12 
               L 10,4 
               L 12,20 
               L 14,12 
               L 16,12 
               L 18,12 
               L 20,12 
               L 22,12 
               L 24,12
               L 26,12 
               L 28,12 
               L 30,12 
               L 32,12 
               L 34,12 
               L 36,12
               L 38,4 
               L 40,20 
               L 42,12 
               L 44,12 
               L 46,12 
               L 48,12
               L 50,12 
               L 52,12 
               L 54,12 
               L 56,12 
               L 58,12 
               L 60,12
               L 62,12 
               L 64,12 
               L 66,12 
               L 68,12 
               L 70,4 
               L 72,20
               L 74,12 
               L 76,12 
               L 78,12 
               L 80,12 
               L 82,12 
               L 84,12
               L 86,12 
               L 88,12 
               L 90,12 
               L 92,12 
               L 94,12 
               L 96,12
               L 98,4 
               L 100,20 
               L 102,12 
               L 104,12 
               L 106,12 
               L 108,12
               L 110,12 
               L 112,12 
               L 114,12 
               L 116,12 
               L 118,12 
               L 120,12"
            fill="none"
            strokeWidth="2"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="240"
            strokeDashoffset="240"
            className="animate-ekg"
          />
        </svg>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {type === 'medical-spinner' ? renderMedicalSpinner() : renderIconIndicator()}
      
      {message && (
        <div className={`mt-4 text-center ${currentSize.textClass}`}>
          <p className="font-medium" style={{ color }}>
            {message}
          </p>
        </div>
      )}
      
      {showProgress && type !== 'medical-spinner' && (
        <div className="w-full max-w-xs mt-4">
          <div className="bg-gray-200 rounded-full h-2.5 mt-1 mb-2">
            <div 
              className="h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%`, backgroundColor: color }}
            ></div>
          </div>
          {progress > 0 && (
            <p className="text-xs text-gray-500 text-center">{Math.round(progress)}%</p>
          )}
        </div>
      )}

      {type === 'pulse' && renderEKGLine()}
    </div>
  );
}