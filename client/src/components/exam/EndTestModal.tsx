import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface EndTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEndTest: () => void;
  unansweredCount: number;
}

export function EndTestModal({ 
  isOpen, 
  onClose, 
  onEndTest,
  unansweredCount
}: EndTestModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center text-red-600">
            <AlertTriangle className="mr-2 h-5 w-5" />
            End Exam?
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            Are you sure you want to end this exam? Once submitted, you will not be able to return to it.
          </p>
          
          {unansweredCount > 0 && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-amber-800">Warning</h4>
                  <p className="text-sm text-amber-800 mt-1">
                    You have <span className="font-bold">{unansweredCount}</span> unanswered {unansweredCount === 1 ? 'question' : 'questions'}.
                    All unanswered questions will be marked as incorrect.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Continue Exam
          </button>
          
          <button
            onClick={onEndTest}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
          >
            End Exam
          </button>
        </div>
      </div>
    </div>
  );
}