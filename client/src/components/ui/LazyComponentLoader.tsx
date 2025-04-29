import React, { Suspense } from 'react';
import { MedicalSpinner } from './medical-spinner';

interface LazyComponentLoaderProps {
  children: React.ReactNode;
  spinnerType?: 'pulse' | 'heartbeat' | 'stethoscope';
  minHeight?: string;
  text?: string;
}

export function LazyComponentLoader({
  children,
  spinnerType = 'pulse',
  minHeight = '400px',
  text = 'Loading content...'
}: LazyComponentLoaderProps) {
  return (
    <Suspense
      fallback={
        <div 
          className="w-full flex flex-col items-center justify-center bg-white rounded-md border border-gray-100 shadow-sm p-6"
          style={{ minHeight }}
        >
          <MedicalSpinner type={spinnerType} size="lg" text={text} />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}