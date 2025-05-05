import React, { Suspense } from 'react';
import { MedicalSpinner } from './medical-spinner';
import { NursingLoadingIndicator, LoadingIndicatorType } from './NursingLoadingIndicator';

interface LazyComponentLoaderProps {
  children: React.ReactNode;
  spinnerType?: LoadingIndicatorType;
  minHeight?: string;
  text?: string;
  useNewIndicators?: boolean;
}

export function LazyComponentLoader({
  children,
  spinnerType = 'medical-spinner',
  minHeight = '400px',
  text = 'Loading content...',
  useNewIndicators = true
}: LazyComponentLoaderProps) {
  return (
    <Suspense
      fallback={
        <div 
          className="w-full flex flex-col items-center justify-center bg-white rounded-md border border-gray-100 shadow-sm p-6"
          style={{ minHeight }}
        >
          {useNewIndicators ? (
            <NursingLoadingIndicator type={spinnerType} size="md" message={text} />
          ) : (
            <MedicalSpinner 
              type={spinnerType as any} 
              size="lg" 
              text={text} 
            />
          )}
        </div>
      }
    >
      {children}
    </Suspense>
  );
}