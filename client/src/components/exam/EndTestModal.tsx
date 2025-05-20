import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface EndTestModalProps {
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
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 animate-in zoom-in-95">
        <div className="flex items-start mb-4">
          <div className="bg-red-100 p-2 rounded-full mr-3">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">End Exam?</h2>
            <p className="text-gray-500 mt-1">
              Are you sure you want to end this exam? All your answers will be submitted for grading.
            </p>
          </div>
        </div>
        
        {unansweredCount > 0 && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800 font-medium">Warning</p>
            <p className="text-yellow-700 text-sm">
              You have {unansweredCount} unanswered {unansweredCount === 1 ? 'question' : 'questions'}.
              Ending now may affect your score.
            </p>
          </div>
        )}
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Continue Exam
          </button>
          <button
            onClick={onEndTest}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            End Exam
          </button>
        </div>
      </div>
    </div>
  );
}