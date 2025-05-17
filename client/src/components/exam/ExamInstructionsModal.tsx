import React from 'react';

interface ExamInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  examTitle: string;
  questionCount: number;
  timeLimit?: number; // in minutes
}

export function ExamInstructionsModal({
  isOpen,
  onClose,
  examTitle,
  questionCount,
  timeLimit
}: ExamInstructionsModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-4/5 max-w-3xl overflow-hidden">
        <div className="p-3 bg-blue-600 text-white flex justify-between items-center">
          <h3 className="font-medium">Exam Instructions</h3>
          <button 
            onClick={onClose}
            className="text-white hover:text-blue-100"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">{examTitle}</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
              <div className="text-sm text-gray-500">Number of Questions</div>
              <div className="text-lg font-medium">{questionCount}</div>
            </div>
            
            {timeLimit && (
              <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                <div className="text-sm text-gray-500">Time Limit</div>
                <div className="text-lg font-medium">
                  {timeLimit} {timeLimit === 1 ? 'minute' : 'minutes'}
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <section>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Exam Format</h3>
              <p className="text-gray-600 mb-2">
                This exam contains multiple types of questions that simulate the NCLEX exam format:
              </p>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                <li>Multiple choice questions (select one correct answer)</li>
                <li>Select all that apply (SATA) questions</li>
                <li>Prioritization/ordered response questions</li>
                <li>Hotspot questions (where applicable)</li>
                <li>Exhibit or chart-based questions</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Exam Controls</h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                <li>Use the <strong>Previous</strong> and <strong>Next</strong> buttons to navigate between questions</li>
                <li>Click <strong>Mark for Review</strong> to flag questions you want to revisit</li>
                <li>The <strong>Calculator</strong> is available for drug dosage calculations</li>
                <li>Use <strong>Notes</strong> to jot down important information during the exam</li>
                <li>You can <strong>Pause</strong> the exam if you need a break</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Scoring</h3>
              <p className="text-gray-600">
                Your performance will be evaluated based on the percentage of questions answered correctly.
                After submitting, you'll receive detailed feedback with explanations for each question.
              </p>
            </section>
            
            <section>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Tips for Success</h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                <li>Read each question carefully before selecting an answer</li>
                <li>For SATA questions, evaluate each option independently</li>
                <li>Prioritize based on patient safety and ABC (Airway, Breathing, Circulation) principles</li>
                <li>Watch your time—pace yourself throughout the exam</li>
                <li>If unsure, mark the question for review and come back to it later</li>
              </ul>
            </section>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button 
              onClick={onClose}
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              Begin Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}