import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Grid, Pause, Play, CheckSquare } from 'lucide-react';

// Define the question status type
type QuestionStatus = 'unanswered' | 'answered' | 'marked' | 'correct' | 'incorrect';

// Define the question item interface
interface QuestionItem {
  id: number;
  index: number;
  status: QuestionStatus;
}

// Define component props
export interface ExamNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onNavigate: () => void;
  onPause: () => void;
  onEnd: () => void;
  isPaused: boolean;
  stats: {
    scoreMax: number;
    scoreCorrect: number;
    scoringRule: string;
    timeSpent: number;
    percentageCorrect: number;
  };
  questionsStatuses?: QuestionItem[];
  onQuestionSelect?: (index: number) => void;
}

export function ExamNavigation({
  currentQuestion,
  totalQuestions,
  onPrevious,
  onNext,
  onNavigate,
  onPause,
  onEnd,
  isPaused,
  stats,
  questionsStatuses = [],
  onQuestionSelect
}: ExamNavigationProps) {
  const [showQuestionGrid, setShowQuestionGrid] = useState(false);
  
  // Format time for display (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Get status color for question in grid
  const getStatusColor = (status: QuestionStatus) => {
    switch (status) {
      case 'correct':
        return 'bg-green-500 border-green-600';
      case 'incorrect':
        return 'bg-red-500 border-red-600';
      case 'marked':
        return 'bg-yellow-500 border-yellow-600';
      case 'answered':
        return 'bg-blue-500 border-blue-600';
      case 'unanswered':
      default:
        return 'bg-gray-200 border-gray-300';
    }
  };
  
  return (
    <>
      {/* Question navigation grid overlay */}
      {showQuestionGrid && questionsStatuses.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" 
             onClick={() => setShowQuestionGrid(false)}>
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
               onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Question Navigator</h3>
              <button onClick={() => setShowQuestionGrid(false)} className="text-gray-500 hover:text-gray-700">
                &times;
              </button>
            </div>
            
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 mb-4">
              {questionsStatuses.map((q) => (
                <button
                  key={q.id}
                  className={`w-8 h-8 flex items-center justify-center border-2 text-sm rounded-md 
                    ${getStatusColor(q.status)} 
                    ${q.index + 1 === currentQuestion ? 'ring-2 ring-blue-600' : ''}`}
                  onClick={() => {
                    if (onQuestionSelect) {
                      onQuestionSelect(q.index);
                      setShowQuestionGrid(false);
                    }
                  }}
                >
                  {q.index + 1}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded-sm mr-1"></div>
                <span>Unanswered</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 border border-blue-600 rounded-sm mr-1"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 border border-yellow-600 rounded-sm mr-1"></div>
                <span>Marked</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 border border-green-600 rounded-sm mr-1"></div>
                <span>Correct</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 border border-red-600 rounded-sm mr-1"></div>
                <span>Incorrect</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Navigation footer */}
      <div className="bg-white border-t border-gray-200 p-3 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center">
          {/* Left side - Navigation buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onPrevious}
              disabled={currentQuestion <= 1}
              className={`flex items-center px-3 py-2 rounded ${
                currentQuestion <= 1 
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                  : 'text-[#13294B] border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Previous</span>
            </button>
            
            <button
              onClick={onNext}
              disabled={currentQuestion >= totalQuestions}
              className={`flex items-center px-3 py-2 rounded ${
                currentQuestion >= totalQuestions 
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                  : 'text-[#13294B] border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
            
            <div className="hidden sm:block text-sm text-gray-500 ml-2">
              Question {currentQuestion} of {totalQuestions}
            </div>
          </div>
          
          {/* Middle/Right - Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowQuestionGrid(true)}
              className="flex items-center px-3 py-2 text-[#13294B] border border-gray-200 rounded hover:bg-gray-50"
            >
              <Grid className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Questions</span>
            </button>
            
            <button
              onClick={onPause}
              className="flex items-center px-3 py-2 text-[#13294B] border border-gray-200 rounded hover:bg-gray-50"
            >
              {isPaused ? <Play className="h-4 w-4 mr-1" /> : <Pause className="h-4 w-4 mr-1" />}
              <span className="hidden sm:inline">{isPaused ? 'Resume' : 'Pause'}</span>
            </button>
            
            <button
              onClick={onEnd}
              className="flex items-center px-3 py-2 bg-[#13294B] text-white rounded hover:bg-[#0c1c33]"
            >
              <CheckSquare className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">End Exam</span>
            </button>
          </div>
        </div>
        
        {/* Stats bar - Only show on larger screens */}
        <div className="hidden md:flex justify-between mt-2 text-xs text-gray-500 max-w-7xl mx-auto">
          <div>
            Score: {stats.scoreCorrect}/{stats.scoreMax} ({stats.percentageCorrect}%)
          </div>
          <div>
            {stats.scoringRule}
          </div>
          <div>
            Time spent: {formatTime(stats.timeSpent)}
          </div>
        </div>
      </div>
    </>
  );
}