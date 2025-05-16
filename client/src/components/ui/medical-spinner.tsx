import React from 'react';

type SpinnerType = 'cardiogram' | 'pulse' | 'loading';
type SpinnerSize = 'sm' | 'md' | 'lg';

interface MedicalSpinnerProps {
  type?: SpinnerType;
  size?: SpinnerSize;
  text?: string;
}

export function MedicalSpinner({ type = 'cardiogram', size = 'md', text }: MedicalSpinnerProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`${sizeClasses[size]} text-blue-600 animate-pulse`}>
        {type === 'cardiogram' && (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 12H3.5L6.5 4L9.5 20L12.5 8L15.5 14L18.5 10L22 12" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="animate-ecg"/>
          </svg>
        )}
        
        {type === 'pulse' && (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 12H18L15 21L9 3L6 12H2" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="animate-pulse"/>
          </svg>
        )}
        
        {type === 'loading' && (
          <svg className="animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="32" strokeDashoffset="12" />
          </svg>
        )}
      </div>
      
      {text && <p className="mt-2 text-sm font-medium text-gray-600">{text}</p>}
    </div>
  );
}

export function LoadingScreen({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
      <div className="text-center">
        <MedicalSpinner size="lg" type="cardiogram" />
        <p className="mt-4 text-lg font-medium text-gray-800">{message}</p>
      </div>
    </div>
  );
}

export function QuestionLoader() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="mt-8 space-y-2">
        <div className="h-10 bg-gray-200 rounded w-full"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );
}