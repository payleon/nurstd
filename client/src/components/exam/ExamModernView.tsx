import React, { useState, useEffect } from 'react';
import { Test, Question, QuestionsResponse } from '@shared/schema';
import { useQuery } from '@tanstack/react-query';
import { fetchTestContent } from '@/lib/api';
import { QuestionRenderer } from '../QuestionRenderer';

interface ExamModernViewProps {
  test: Test & { questionsData?: QuestionsResponse };
  onBack: () => void;
  onComplete?: (score: number, totalQuestions: number) => void;
}

export function ExamModernView({ 
  test, 
  onBack, 
  onComplete 
}: ExamModernViewProps) {
  // Fetch test content if not already provided
  const { data: apiQuestionsData, isLoading, error } = useQuery({
    queryKey: [`/api/tests/${test.id}/content`],
    queryFn: () => fetchTestContent(test.id),
    enabled: !test.questionsData
  });

  // States
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState("00:00:00");
  const [userAnswers, setUserAnswers] = useState<Record<number, string | string[]>>({});
  const [showRationale, setShowRationale] = useState<Record<number, boolean>>({});
  const [answerCorrectness, setAnswerCorrectness] = useState<Record<number, boolean>>({});
  const [isPaused, setIsPaused] = useState(false);
  const [markedForReview, setMarkedForReview] = useState<number[]>([]);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showEndExam, setShowEndExam] = useState(false);

  // Use direct or API data
  const questionsData = test.questionsData || apiQuestionsData;
  const questions = typeof questionsData === 'object' && questionsData?.questions ? questionsData.questions : [];
  const currentQuestion = questions[currentQuestionIndex] || null;
  const totalQuestions = questions.length;

  // Timer effect
  useEffect(() => {
    let startTime = Date.now();
    const interval = setInterval(() => {
      if (!isPaused) {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        const hours = Math.floor(elapsedSeconds / 3600);
        const minutes = Math.floor((elapsedSeconds % 3600) / 60);
        const seconds = elapsedSeconds % 60;
        
        setTimer(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isPaused]);

  // Handle answer submission
  const handleAnswerSubmit = (answer: string | string[]) => {
    if (!currentQuestion) return;
    
    const questionId = currentQuestion.id;
    
    // Store user answer
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    
    // Check correctness (simplified for demo)
    let isCorrect = false;
    if (currentQuestion.type === 'mc' && 'correctAnswer' in currentQuestion) {
      if (Array.isArray(answer) && answer.length === 1) {
        isCorrect = answer[0] === currentQuestion.correctAnswer;
      } else if (!Array.isArray(answer)) {
        isCorrect = answer === currentQuestion.correctAnswer;
      }
    }
    
    // Store correctness and show rationale
    setAnswerCorrectness(prev => ({
      ...prev,
      [questionId]: isCorrect
    }));
    
    setShowRationale(prev => ({
      ...prev,
      [questionId]: true
    }));
  };

  // Navigation
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Toggle mark for review
  const toggleMarkForReview = () => {
    if (!currentQuestion) return;
    
    if (markedForReview.includes(currentQuestion.id)) {
      setMarkedForReview(markedForReview.filter(id => id !== currentQuestion.id));
    } else {
      setMarkedForReview([...markedForReview, currentQuestion.id]);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg">Loading exam content...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg">
        <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Exam</h3>
        <p className="mb-4 text-red-600">There was an error loading the exam content.</p>
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Empty state
  if (!currentQuestion) {
    return (
      <div className="p-6 bg-yellow-50 rounded-lg">
        <h3 className="text-lg font-medium text-yellow-800 mb-2">No Questions Available</h3>
        <p className="mb-4 text-yellow-600">This exam doesn't contain any questions.</p>
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b py-2 px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="font-medium text-lg text-blue-700">{test.title}</h1>
            <span className="ml-2 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
              {currentQuestionIndex + 1}/{totalQuestions}
            </span>
          </div>
          
          <div className="flex space-x-3 items-center">
            <div className="hidden md:block text-sm">
              <span className="text-gray-500">Time: </span>
              <span className="font-medium">{timer}</span>
            </div>
            
            <button 
              className="p-1.5 rounded hover:bg-gray-100"
              onClick={() => setShowCalculator(true)}
              title="Calculator"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <line x1="8" x2="16" y1="6" y2="6" />
                <line x1="16" x2="16" y1="14" y2="18" />
                <line x1="8" x2="8" y1="14" y2="18" />
                <line x1="12" x2="12" y1="14" y2="18" />
                <line x1="8" x2="16" y1="10" y2="10" />
                <line x1="8" x2="16" y1="14" y2="14" />
                <line x1="8" x2="16" y1="18" y2="18" />
              </svg>
            </button>
            
            <button 
              className="p-1.5 rounded hover:bg-gray-100"
              onClick={() => setShowNotes(true)}
              title="Notes"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <line x1="10" y1="9" x2="8" y2="9" />
              </svg>
            </button>
            
            <button 
              className={`p-1.5 rounded ${markedForReview.includes(currentQuestion.id) ? 'bg-amber-100 text-amber-700' : 'hover:bg-gray-100'}`}
              onClick={toggleMarkForReview}
              title={markedForReview.includes(currentQuestion.id) ? "Marked for Review" : "Mark for Review"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2 L15.09 8.26 L22 9.27 L17 14.14 L18.18 21.02 L12 17.77 L5.82 21.02 L7 14.14 L2 9.27 L8.91 8.26 L12 2 Z" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex flex-1">
        {/* Question */}
        <div className={`flex-1 p-5 overflow-auto ${showRationale[currentQuestion.id] ? 'border-r' : ''}`}>
          <div className="flex items-start mb-4">
            <div className="text-blue-700 mr-2 font-bold">▶</div>
            <div>
              <div className="mb-2">
                {currentQuestion.text}
              </div>
              
              <div className="mt-4">
                <QuestionRenderer 
                  question={currentQuestion}
                  onAnswer={handleAnswerSubmit}
                  userAnswer={userAnswers[currentQuestion.id]}
                  showRationale={showRationale[currentQuestion.id] || false}
                  isCorrect={answerCorrectness[currentQuestion.id] || false}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Explanation panel */}
        {showRationale[currentQuestion.id] && (
          <div className="w-1/2 bg-white p-5 overflow-auto border-l">
            <div className="mb-4">
              <div className="bg-gray-100 inline-block px-3 py-1 rounded-md text-sm font-medium">
                Explanation
              </div>
            </div>
            
            <div className="prose prose-sm max-w-none">
              <p>
                <strong>{currentQuestion.title}</strong> involves understanding key nursing principles. 
                {currentQuestion.rationale || 
                  "The correct answer demonstrates proper prioritization of care based on the patient's condition and nursing principles."}
              </p>
              
              {currentQuestion.type === 'mc' && 'correctAnswer' in currentQuestion && (
                <div className="mt-4">
                  <h4 className="font-bold">Correct Answer:</h4>
                  <p>
                    {currentQuestion.correctAnswer}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Footer navigation */}
      <div className="bg-gray-100 border-t border-gray-200 py-3 px-4 flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => setShowEndExam(true)}
            className="flex items-center text-white bg-blue-600 hover:bg-blue-700 py-1.5 px-3 rounded-l-md"
          >
            <span className="mr-1">⊗</span> End
          </button>
          
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center text-white bg-blue-600 hover:bg-blue-700 py-1.5 px-3 border-l border-blue-500"
          >
            {isPaused ? (
              <>
                <span className="h-3 w-3 mr-1">▶</span> Resume
              </>
            ) : (
              <>
                <span className="h-3 w-3 mr-1">⏸</span> Pause
              </>
            )}
          </button>
          
          <button
            onClick={() => alert("Navigator coming soon")}
            className="flex items-center text-white bg-blue-600 hover:bg-blue-700 py-1.5 px-3 rounded-r-md border-l border-blue-500"
          >
            Navigate <span className="ml-1">▶</span>
          </button>
        </div>
        
        <div className="hidden md:flex items-center space-x-4 text-xs text-gray-600">
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
            <span className="whitespace-nowrap">{Object.values(answerCorrectness).filter(Boolean).length}/{totalQuestions} Correct</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-gray-500 mr-1"></span>
            <span className="whitespace-nowrap">Standard Scoring</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex <= 0}
            className={`flex items-center bg-blue-600 text-white py-1.5 px-3 rounded-l-md ${
              currentQuestionIndex <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            <span className="h-3 w-3 mr-1">◀</span> Previous
          </button>
          
          <button
            onClick={goToNextQuestion}
            className="flex items-center bg-blue-600 text-white py-1.5 px-3 rounded-r-md border-l border-blue-500 hover:bg-blue-700"
          >
            Next <span className="h-3 w-3 ml-1">▶</span>
          </button>
        </div>
      </div>
      
      {/* Modals will be added here in a full implementation */}
    </div>
  );
}