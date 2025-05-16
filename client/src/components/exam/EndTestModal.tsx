import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface EndTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEndTest: () => void;
  unansweredCount: number;
}

export function EndTestModal({ isOpen, onClose, onEndTest, unansweredCount }: EndTestModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-blue-800 w-full max-w-md p-5 rounded-lg text-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">End Test</h3>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mb-6 flex flex-col items-center">
          <AlertTriangle className="h-8 w-8 mb-2 text-white" />
          <p className="text-center mb-2">
            Do you want to end this test? Once ended you can review your test results from the previous tests page.
          </p>
          
          {unansweredCount > 0 && (
            <div className="mt-3 px-4 py-2 bg-orange-500 text-white rounded-md w-full text-center">
              You have {unansweredCount} unanswered questions. Use the Navigator to identify and complete them.
            </div>
          )}
        </div>
        
        <div className="flex justify-center space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 min-w-[100px]"
          >
            Return to Test
          </button>
          <button 
            onClick={onEndTest}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 min-w-[100px]"
          >
            End Test
          </button>
        </div>
      </div>
    </div>
  );
}