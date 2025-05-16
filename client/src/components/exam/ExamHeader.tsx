import React from 'react';
import { Calculator, FileText, Flag, HelpCircle } from 'lucide-react';

interface ExamHeaderProps {
  examTitle: string;
  currentQuestion: number;
  totalQuestions: number;
  timeElapsed: string;
  onCalculatorClick: () => void;
  onNotesClick: () => void;
  onReportIssueClick: () => void;
  onMarkForReviewClick: () => void;
  isQuestionMarkedForReview: boolean;
}

export function ExamHeader({
  examTitle,
  currentQuestion,
  totalQuestions,
  timeElapsed,
  onCalculatorClick,
  onNotesClick,
  onReportIssueClick,
  onMarkForReviewClick,
  isQuestionMarkedForReview
}: ExamHeaderProps) {
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="flex items-center justify-between p-2 px-4">
        <div className="flex items-center">
          <h1 className="font-semibold text-lg text-blue-700">{examTitle}</h1>
          <span className="ml-2 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
            {currentQuestion}/{totalQuestions}
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:block text-sm">
            <span className="text-gray-500">Time: </span>
            <span className="font-semibold">{timeElapsed}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={onCalculatorClick}
              className="p-1.5 rounded-md hover:bg-gray-100 text-gray-700"
              title="Calculator"
            >
              <Calculator className="h-4 w-4" />
            </button>
            
            <button 
              onClick={onNotesClick}
              className="p-1.5 rounded-md hover:bg-gray-100 text-gray-700"
              title="Notes"
            >
              <FileText className="h-4 w-4" />
            </button>
            
            <button 
              onClick={onReportIssueClick}
              className="p-1.5 rounded-md hover:bg-gray-100 text-gray-700"
              title="Report Issue"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
            
            <button 
              onClick={onMarkForReviewClick}
              className={`p-1.5 rounded-md ${isQuestionMarkedForReview ? 'bg-amber-100 text-amber-700' : 'hover:bg-gray-100 text-gray-700'}`}
              title={isQuestionMarkedForReview ? "Marked for Review" : "Mark for Review"}
            >
              <Flag className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}