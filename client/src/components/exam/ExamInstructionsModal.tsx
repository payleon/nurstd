import React from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';

interface ExamInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
}

export function ExamInstructionsModal({ isOpen, onClose, onStart }: ExamInstructionsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-none flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="h-6 w-6" />
          </button>
          <div className="text-right">
            <span className="text-sm">Naxlex.com</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 bg-gray-100">
          <h2 className="text-xl font-medium mb-6">Please read the following before starting:</h2>
          
          <ol className="list-decimal pl-8 space-y-4">
            <li>Never <strong>memorize</strong> questions and answers.</li>
            <li>Make sure to <strong>note</strong> any new or complex concepts as you study.</li>
            <li>Go through our <strong>Test taking strategies</strong> for better scores.</li>
            <li>Each question has a <strong>Cheat sheet</strong>, go through each cheat sheet of each question.</li>
            <li>Familiarize yourself with the <strong>structure and types of questions</strong>.</li>
            <li><strong>Focus</strong> more on areas where you <strong>struggle</strong> and review them thoroughly.</li>
            <li>Use the <strong>Submit Button</strong> to submit your answers</li>
          </ol>

          <p className="mt-6">Wishing you all the best!</p>

          <div className="mt-8 flex justify-center">
            <Button 
              onClick={onStart}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
            >
              Start Tutored Exam
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}