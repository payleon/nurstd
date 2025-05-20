import React from 'react';

export interface ExamInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
  title?: string;
  instructions?: string[];
}

export function ExamInstructionsModal({
  isOpen,
  onClose,
  onStart,
  title = "Exam Instructions",
  instructions = [
    "Read each question carefully before selecting your answer.",
    "For multiple-choice questions, select the single best answer.",
    "For select-all-that-apply questions, choose all correct options.",
    "You can mark questions for review and return to them later.",
    "Use the calculator and notes features when needed.",
    "Your progress is automatically saved as you go.",
    "Take your time and pace yourself appropriately."
  ]
}: ExamInstructionsModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#13294B]">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
            &times;
          </button>
        </div>
        
        <div className="mb-6">
          <div className="space-y-3">
            {instructions.map((instruction, index) => (
              <div key={index} className="flex items-start">
                <div className="bg-[#4B9CD3] text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                  {index + 1}
                </div>
                <p className="text-gray-700">{instruction}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md mb-6">
          <h3 className="font-medium text-blue-800 mb-2">Tips for Success</h3>
          <ul className="list-disc ml-5 text-blue-700 space-y-1">
            <li>Eliminate obviously incorrect answers first</li>
            <li>Manage your time to answer all questions</li>
            <li>Trust your knowledge and clinical judgment</li>
            <li>Stay calm and focused throughout the exam</li>
          </ul>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Review Later
          </button>
          <button
            onClick={onStart}
            className="px-4 py-2 bg-[#13294B] text-white rounded-md hover:bg-[#0c1c33]"
          >
            Begin Exam
          </button>
        </div>
      </div>
    </div>
  );
}