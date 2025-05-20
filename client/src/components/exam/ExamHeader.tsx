import React from 'react';
import { Calculator, FileText, Flag, AlertTriangle } from 'lucide-react';

export interface ExamHeaderProps {
  examTitle: string;
  currentQuestion: number;
  totalQuestions: number;
  timeElapsed: string;
  onCalculatorClick: () => void;
  onNotesClick: () => void;
  onReportIssueClick: () => void;
  onMarkForReviewClick: () => void;
  isQuestionMarkedForReview: boolean;
  adaptiveDifficulty?: 'beginner' | 'intermediate' | 'advanced';
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
  isQuestionMarkedForReview,
  adaptiveDifficulty
}: ExamHeaderProps) {
  return (
    <div className="bg-[#13294B] text-white p-3 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold mr-4">{examTitle}</h1>
          
          {adaptiveDifficulty && (
            <div className="hidden md:block ml-4 px-2 py-1 rounded text-xs font-medium bg-opacity-20 border" 
              style={{
                backgroundColor: adaptiveDifficulty === 'beginner' ? 'rgba(74, 222, 128, 0.2)' : 
                                adaptiveDifficulty === 'intermediate' ? 'rgba(250, 204, 21, 0.2)' : 
                                'rgba(248, 113, 113, 0.2)',
                borderColor: adaptiveDifficulty === 'beginner' ? 'rgb(74, 222, 128)' : 
                             adaptiveDifficulty === 'intermediate' ? 'rgb(250, 204, 21)' : 
                             'rgb(248, 113, 113)',
                color: adaptiveDifficulty === 'beginner' ? 'rgb(74, 222, 128)' : 
                       adaptiveDifficulty === 'intermediate' ? 'rgb(250, 204, 21)' : 
                       'rgb(248, 113, 113)',
              }}
            >
              {adaptiveDifficulty.toUpperCase()}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-1 md:space-x-3">
          <div className="flex items-center">
            <span className="text-sm hidden sm:inline">Time:</span>
            <span className="ml-1 text-sm font-mono">{timeElapsed}</span>
          </div>
          
          <div className="flex items-center ml-4 space-x-2">
            <button
              onClick={onCalculatorClick}
              className="p-2 hover:bg-[#4B9CD3] rounded-full transition-colors"
              title="Calculator"
            >
              <Calculator className="h-5 w-5" />
            </button>
            
            <button
              onClick={onNotesClick}
              className="p-2 hover:bg-[#4B9CD3] rounded-full transition-colors"
              title="Notes"
            >
              <FileText className="h-5 w-5" />
            </button>
            
            <button
              onClick={onMarkForReviewClick}
              className={`p-2 ${isQuestionMarkedForReview ? 'bg-yellow-500' : 'hover:bg-[#4B9CD3]'} rounded-full transition-colors`}
              title={isQuestionMarkedForReview ? "Marked for review - Click to unmark" : "Mark for review"}
            >
              <Flag className="h-5 w-5" />
            </button>
            
            <button
              onClick={onReportIssueClick}
              className="p-2 hover:bg-[#4B9CD3] rounded-full transition-colors"
              title="Report Issue"
            >
              <AlertTriangle className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Progress indicator */}
      <div className="w-full bg-gray-700 h-1 mt-2">
        <div 
          className="bg-[#4B9CD3] h-1" 
          style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
        />
      </div>
    </div>
  );
}