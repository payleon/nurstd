import React from 'react';

interface EndTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmEnd: () => void;
  answeredCount: number;
  totalQuestions: number;
  markedCount: number;
}

export function EndTestModal({
  isOpen,
  onClose,
  onConfirmEnd,
  answeredCount,
  totalQuestions,
  markedCount
}: EndTestModalProps) {
  if (!isOpen) return null;
  
  const unansweredCount = totalQuestions - answeredCount;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        <div className="p-3 bg-blue-600 text-white flex justify-between items-center">
          <h3 className="font-medium">End Test Confirmation</h3>
          <button 
            onClick={onClose}
            className="text-white hover:text-blue-100"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-5">
            <h4 className="text-lg font-medium text-gray-800 mb-3">
              Are you sure you want to end this test?
            </h4>
            <p className="text-gray-600">
              Once you submit your answers, you won't be able to make any changes.
            </p>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{answeredCount}</div>
                <div className="text-xs text-gray-500">Answered</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-red-500">{unansweredCount}</div>
                <div className="text-xs text-gray-500">Unanswered</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-amber-500">{markedCount}</div>
                <div className="text-xs text-gray-500">Marked</div>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Completion:</span>
                <span className="font-medium">{Math.round((answeredCount / totalQuestions) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${Math.round((answeredCount / totalQuestions) * 100)}%` }}
                />
              </div>
            </div>
          </div>
          
          {unansweredCount > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4 text-sm text-amber-800">
              <div className="font-medium">Warning</div>
              <p>You have {unansweredCount} unanswered {unansweredCount === 1 ? 'question' : 'questions'}. Unanswered questions will be marked as incorrect.</p>
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Continue Test
            </button>
            
            <button
              onClick={onConfirmEnd}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              End & Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}