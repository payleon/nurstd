import React from 'react';
import { Clock, Calculator, FileText, AlertTriangle } from 'lucide-react';

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
    <div className="bg-cyan-600 text-white p-3 flex flex-col">
      <div className="flex justify-between items-center">
        <div className="text-lg font-medium">
          {examTitle}
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm">
            <Clock className="h-4 w-4 inline mr-1" /> {timeElapsed}
          </div>
          <div className="text-sm">
            Question {currentQuestion} of {totalQuestions}
          </div>
        </div>
      </div>
      <div className="flex mt-2 space-x-1">
        <button 
          onClick={onNotesClick}
          className="flex items-center bg-cyan-700 hover:bg-cyan-800 py-1 px-2 rounded text-xs"
        >
          <FileText className="h-3 w-3 mr-1" /> Notes
        </button>
        <button 
          onClick={onCalculatorClick}
          className="flex items-center bg-cyan-700 hover:bg-cyan-800 py-1 px-2 rounded text-xs"
        >
          <Calculator className="h-3 w-3 mr-1" /> Calculator
        </button>
        <button 
          onClick={onReportIssueClick}
          className="flex items-center bg-cyan-700 hover:bg-cyan-800 py-1 px-2 rounded text-xs"
        >
          <AlertTriangle className="h-3 w-3 mr-1" /> Report Issue
        </button>
        <button 
          onClick={onMarkForReviewClick}
          className={`flex items-center py-1 px-2 rounded text-xs ${
            isQuestionMarkedForReview 
              ? 'bg-amber-500 hover:bg-amber-600' 
              : 'bg-cyan-700 hover:bg-cyan-800'
          }`}
        >
          <span className="mr-1">✓</span> Mark for Review
        </button>
      </div>
    </div>
  );
}