import React from 'react';
import { useMicrolearning } from '../contexts/MicrolearningContext';

interface MicrolearningSettingsProps {
  className?: string;
}

export function MicrolearningSettings({ className = '' }: MicrolearningSettingsProps) {
  const { isIdleTimerEnabled, setIdleTimerEnabled, showTip } = useMicrolearning();

  return (
    <div className={`rounded-lg border p-4 ${className}`}>
      <h3 className="text-lg font-semibold mb-2">Microlearning Settings</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Show Quick Tips During Idle Time</h4>
            <p className="text-sm text-gray-500">
              Display nursing knowledge tips when you're inactive
            </p>
          </div>
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setIdleTimerEnabled(!isIdleTimerEnabled)}
              className={`
                relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${isIdleTimerEnabled ? 'bg-blue-600' : 'bg-gray-200'}
              `}
              role="switch"
              aria-checked={isIdleTimerEnabled}
            >
              <span
                aria-hidden="true"
                className={`
                  pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                  transition duration-200 ease-in-out
                  ${isIdleTimerEnabled ? 'translate-x-5' : 'translate-x-0'}
                `}
              />
            </button>
          </div>
        </div>
        
        <div>
          <button
            onClick={showTip}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors"
          >
            Show Example Tip
          </button>
          <p className="text-xs text-gray-500 mt-1">
            Click to see an example of a microlearning tip
          </p>
        </div>
      </div>
    </div>
  );
}