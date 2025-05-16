import React from 'react';
import { Question } from '@shared/schema';
import { QuestionRenderer } from '../QuestionRenderer';

interface ExamBodyProps {
  question: Question;
  onAnswer: (answer: string | string[]) => void;
  userAnswer?: string | string[];
  showRationale?: boolean;
  isCorrect?: boolean;
}

export function ExamBody({ 
  question, 
  onAnswer, 
  userAnswer, 
  showRationale = false,
  isCorrect = false
}: ExamBodyProps) {
  return (
    <div className="p-5">
      <div className="flex items-start mb-4">
        <div className="text-blue-700 mr-2 font-bold">▶</div>
        <div>
          <div className="question-content">
            {question.text}
          </div>
          <div className="mt-2">
            <QuestionRenderer 
              question={question}
              onAnswer={onAnswer}
              userAnswer={userAnswer}
              showRationale={showRationale}
              isCorrect={isCorrect}
            />
          </div>
        </div>
      </div>
      
      {!showRationale && (
        <div className="mt-4">
          <button 
            onClick={() => {
              if (userAnswer) {
                onAnswer(userAnswer);
              }
            }}
            disabled={!userAnswer}
            className={`px-4 py-2 rounded ${
              userAnswer 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}