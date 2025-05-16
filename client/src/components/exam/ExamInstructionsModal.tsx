import React from 'react';
import { X, Check, Info, AlertTriangle } from 'lucide-react';

interface ExamInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
}

export function ExamInstructionsModal({ isOpen, onClose, onStart }: ExamInstructionsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Info className="mr-2 text-blue-600 h-5 w-5" />
            Exam Instructions
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mb-6 max-h-[60vh] overflow-y-auto">
          <div className="mb-4">
            <h3 className="font-bold text-lg mb-2 text-blue-700">NCLEX-Style Exam Rules</h3>
            <p className="text-gray-700 mb-2">
              This exam simulates the actual NCLEX exam experience with adaptive testing. 
              The questions and difficulty will adjust based on your performance.
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <h4 className="font-semibold mb-2">Exam Navigation:</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                <span>You must answer the current question before proceeding to the next.</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                <span>You cannot go back to previous questions once answered.</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                <span>Detailed rationales will be provided after each answer submission.</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                <span>Time remaining is displayed at the top of the screen.</span>
              </li>
            </ul>
          </div>
          
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Question Types:</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                <span><strong>Multiple Choice:</strong> Select the single best answer.</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                <span><strong>Select All That Apply (SATA):</strong> Choose all correct options.</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                <span><strong>Ordered Response:</strong> Arrange items in the correct sequence.</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                <span><strong>Hotspot:</strong> Click on the specific area indicated in the question.</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                <span><strong>Chart/Exhibit:</strong> Review provided materials to answer questions.</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                <span><strong>Fill-in-the-Blank:</strong> Enter the appropriate response.</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-amber-800">Important Notes:</h4>
                <ul className="space-y-1 mt-1 text-sm text-amber-800">
                  <li>The calculator is available throughout the exam for math questions.</li>
                  <li>You can use the notes feature for any calculations or memory aids.</li>
                  <li>Once the exam begins, the timer cannot be paused, but you can take breaks.</li>
                  <li>Make sure to manage your time appropriately for all questions.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={onStart}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
          >
            Begin Exam
          </button>
        </div>
      </div>
    </div>
  );
}