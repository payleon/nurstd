import React from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface ExamNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onNavigate: () => void;
  onPause: () => void;
  onEnd: () => void;
  isPaused: boolean;
  stats?: {
    scoreMax: number;
    scoreCorrect: number;
    scoringRule: string;
    timeSpent: number;
    percentageCorrect: number;
  };
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
  stats
}: ExamNavigationProps) {
  return (
    <div className="bg-gray-100 border-t border-gray-200 py-2 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={onEnd}
          className="flex items-center text-white bg-blue-600 hover:bg-blue-700 py-1.5 px-3 rounded-l-md"
        >
          <span className="mr-1">⊗</span> End
        </button>
        
        <button
          onClick={onPause}
          className="flex items-center text-white bg-blue-600 hover:bg-blue-700 py-1.5 px-3 border-l border-blue-500"
        >
          {isPaused ? (
            <>
              <Play className="h-4 w-4 mr-1" /> Resume
            </>
          ) : (
            <>
              <Pause className="h-4 w-4 mr-1" /> Pause
            </>
          )}
        </button>
        
        <button
          onClick={onNavigate}
          className="flex items-center text-white bg-blue-600 hover:bg-blue-700 py-1.5 px-3 rounded-r-md border-l border-blue-500"
        >
          Navigate <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
      
      {stats && (
        <div className="hidden md:flex items-center space-x-4 text-xs text-gray-600">
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
            <span className="whitespace-nowrap">{stats.scoreCorrect}/{stats.scoreMax} Scored/Max</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-gray-500 mr-1"></span>
            <span className="whitespace-nowrap">{stats.scoringRule}</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
            <span className="whitespace-nowrap">{stats.timeSpent}s Time Spent</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-amber-500 mr-1"></span>
            <span className="whitespace-nowrap">{stats.percentageCorrect}% Answered Correctly</span>
          </div>
        </div>
      )}
      
      <div className="flex items-center">
        <button
          onClick={onPrevious}
          disabled={currentQuestion <= 1}
          className={`flex items-center bg-blue-600 text-white py-1.5 px-3 rounded-l-md ${
            currentQuestion <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Previous
        </button>
        
        <button
          onClick={onNext}
          className="flex items-center bg-blue-600 text-white py-1.5 px-3 rounded-r-md border-l border-blue-500 hover:bg-blue-700"
        >
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
}