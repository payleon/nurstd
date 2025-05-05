import React, { useState, useEffect } from 'react';
import { NursingLoadingIndicator, LoadingIndicatorType } from '@/components/ui/NursingLoadingIndicator';

interface WithLoadingIndicatorProps {
  isLoading: boolean;
  indicatorType?: LoadingIndicatorType;
  indicatorSize?: 'sm' | 'md' | 'lg' | 'xl';
  loadingMessage?: string;
  showProgress?: boolean;
  progress?: number;
  className?: string;
  color?: string;
  minLoadingTime?: number; // Minimum loading time in ms
}

/**
 * Higher-order component that adds a loading indicator
 * This can be used to wrap any component that needs a loading state
 */
export function WithLoadingIndicator({
  isLoading,
  indicatorType = 'medical-spinner',
  indicatorSize = 'md',
  loadingMessage = 'Loading...',
  showProgress = false,
  progress = 0,
  className = '',
  color = '#4B9CD3',
  minLoadingTime = 0, // Default to no minimum
  children
}: React.PropsWithChildren<WithLoadingIndicatorProps>) {
  // If minLoadingTime is set, we want to show the loading indicator
  // for at least that amount of time, even if isLoading becomes false earlier
  const [showLoader, setShowLoader] = useState(isLoading);
  
  useEffect(() => {
    if (isLoading) {
      setShowLoader(true);
    } else if (minLoadingTime > 0) {
      const timer = setTimeout(() => setShowLoader(false), minLoadingTime);
      return () => clearTimeout(timer);
    } else {
      setShowLoader(false);
    }
  }, [isLoading, minLoadingTime]);

  // Render the loading indicator or the children
  return (
    <div className={`relative w-full h-full ${className}`}>
      {showLoader ? (
        <div className="flex items-center justify-center h-full p-4">
          <NursingLoadingIndicator
            type={indicatorType}
            size={indicatorSize}
            message={loadingMessage}
            showProgress={showProgress}
            progress={progress}
            color={color}
          />
        </div>
      ) : (
        children
      )}
    </div>
  );
}

/**
 * Component that auto-switches between multiple loading indicator types
 * Can be used for longer loading operations to keep the user engaged
 */
export function CyclingLoadingIndicator({
  isLoading,
  indicatorSize = 'md',
  loadingMessages = ['Loading your content...', 'Preparing your materials...', 'Getting things ready...'],
  cycleInterval = 3000, // Time between indicator changes (ms)
  className = '',
  color = '#4B9CD3'
}: {
  isLoading: boolean;
  indicatorSize?: 'sm' | 'md' | 'lg' | 'xl';
  loadingMessages?: string[];
  cycleInterval?: number;
  className?: string;
  color?: string;
}) {
  // Array of nursing-themed indicator types to cycle through
  const nursingIndicators: LoadingIndicatorType[] = [
    'medical-spinner',
    'heart',
    'stethoscope',
    'pulse',
    'thermometer',
    'pill',
    'syringe'
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Switch to the next indicator every interval
  useEffect(() => {
    if (!isLoading) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % nursingIndicators.length);
    }, cycleInterval);
    
    return () => clearInterval(interval);
  }, [isLoading, cycleInterval, nursingIndicators.length]);
  
  if (!isLoading) return null;
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <NursingLoadingIndicator
        type={nursingIndicators[currentIndex]}
        size={indicatorSize}
        message={loadingMessages[currentIndex % loadingMessages.length]}
        color={color}
      />
    </div>
  );
}