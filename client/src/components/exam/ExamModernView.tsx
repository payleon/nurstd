import React, { useState, useEffect } from 'react';
import { Test, Question, QuestionsResponse } from '@shared/schema';
import { useQuery } from '@tanstack/react-query';
import { fetchTestContent, submitExamResults } from '@/lib/api';
import { QuestionRenderer } from '../QuestionRenderer';
import { ExamCalculator } from './ExamCalculator';
import { ExamNotes } from './ExamNotes';
import { ExamInstructionsModal } from './ExamInstructionsModal';
import { EndTestModal } from './EndTestModal';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  
  // Fetch test content if not already provided
  const { data: apiQuestionsData, isLoading, error } = useQuery({
    queryKey: [`/api/tests/${test.id}/content`],
    queryFn: () => fetchTestContent(test.id),
    enabled: !test.questionsData
  });

  // States
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);

  // Use direct or API data
  const questionsData = test.questionsData || apiQuestionsData;
  const questions = typeof questionsData === 'object' && questionsData?.questions ? questionsData.questions : [];
  const currentQuestion = questions[currentQuestionIndex] || null;
  const totalQuestions = questions.length;

  // Timer effect
  useEffect(() => {
    let interval: number;
    
    if (!isPaused && !testCompleted) {
      interval = window.setInterval(() => {
        setTimerSeconds(prev => prev + 1);
        
        const hours = Math.floor(timerSeconds / 3600);
        const minutes = Math.floor((timerSeconds % 3600) / 60);
        const seconds = timerSeconds % 60;
        
        setTimer(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPaused, timerSeconds, testCompleted]);

  // Calculate number of answered questions
  const answeredCount = Object.keys(userAnswers).length;

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
    } else if (currentQuestion.type === 'sata' && 'correctAnswer' in currentQuestion && Array.isArray(currentQuestion.correctAnswer)) {
      if (Array.isArray(answer)) {
        // Check if arrays have same elements
        isCorrect = 
          answer.length === currentQuestion.correctAnswer.length &&
          answer.every(a => currentQuestion.correctAnswer.includes(a));
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

  // Submit exam results
  const handleEndExam = async () => {
    setIsSubmitting(true);
    
    try {
      // Calculate score
      const correctAnswers = Object.values(answerCorrectness).filter(Boolean).length;
      const score = Math.round((correctAnswers / totalQuestions) * 100);
      
      // Submit to server
      await submitExamResults({
        testId: test.id,
        answers: userAnswers,
        score,
        timeSpent: timerSeconds
      });
      
      // Call onComplete callback
      if (onComplete) {
        onComplete(correctAnswers, totalQuestions);
      }
      
      // Show success toast
      toast({
        title: "Exam completed",
        description: `Your score: ${score}% (${correctAnswers}/${totalQuestions})`,
        type: "success"
      });
      
      setTestCompleted(true);
      
      // Navigate back
      setTimeout(() => {
        onBack();
      }, 1000);
    } catch (error) {
      console.error("Error submitting exam results:", error);
      
      toast({
        title: "Error",
        description: "There was a problem submitting your exam results. Please try again.",
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
      setShowEndExam(false);
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
    <div className="flex flex-col h-screen max-h-screen bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm border-b py-2 px-2 sm:px-4 flex-shrink-0">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center flex-grow min-w-0">
            <h1 className="font-medium text-sm sm:text-lg text-blue-700 truncate">{test.title}</h1>
            <span className="ml-2 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
              {currentQuestionIndex + 1}/{totalQuestions}
            </span>
          </div>
          
          <div className="flex space-x-1 sm:space-x-3 items-center">
            <div className="hidden sm:block text-xs sm:text-sm whitespace-nowrap">
              <span className="text-gray-500">Time: </span>
              <span className="font-medium">{timer}</span>
            </div>
            
            <button 
              className="p-1 sm:p-1.5 rounded hover:bg-gray-100"
              onClick={() => setShowCalculator(true)}
              title="Calculator"
              aria-label="Open Calculator"
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
              className="p-1 sm:p-1.5 rounded hover:bg-gray-100"
              onClick={() => setShowNotes(true)}
              title="Notes"
              aria-label="Open Notes"
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
              className={`p-1 sm:p-1.5 rounded ${markedForReview.includes(currentQuestion.id) ? 'bg-amber-100 text-amber-700' : 'hover:bg-gray-100'}`}
              onClick={toggleMarkForReview}
              title={markedForReview.includes(currentQuestion.id) ? "Marked for Review" : "Mark for Review"}
              aria-label={markedForReview.includes(currentQuestion.id) ? "Marked for Review" : "Mark for Review"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2 L15.09 8.26 L22 9.27 L17 14.14 L18.18 21.02 L12 17.77 L5.82 21.02 L7 14.14 L2 9.27 L8.91 8.26 L12 2 Z" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content - using flex-grow-1 and overflow management */}
      <div className="flex-1 flex overflow-hidden">
        {/* Question panel with scroll management - only this should scroll */}
        <div className={`flex-1 ${showRationale[currentQuestion.id] ? 'md:w-1/2' : 'w-full'} overflow-y-auto p-2 sm:p-4 ${showRationale[currentQuestion.id] ? 'border-r' : ''}`}>
          <div className="flex items-start mb-2 sm:mb-4">
            <div className="text-blue-700 mr-2 font-bold">▶</div>
            <div className="min-w-0 w-full">
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
        
        {/* Explanation panel - responsive on mobile, scrollable independently */}
        {showRationale[currentQuestion.id] && (
          <div className="hidden md:block md:w-1/2 bg-white p-2 sm:p-4 overflow-y-auto border-l">
            <div className="mb-2 sm:mb-4">
              <div className="bg-gray-100 inline-block px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium">
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
        
        {/* Mobile explanation panel as a collapsible section */}
        {showRationale[currentQuestion.id] && (
          <div className="md:hidden w-full bg-blue-50 p-2 mt-2 rounded-md">
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer list-none">
                <span className="text-sm font-medium text-blue-700">View Explanation</span>
                <span className="text-blue-700 transition-transform group-open:rotate-180">↓</span>
              </summary>
              <div className="mt-2 text-sm">
                <p>
                  <strong>{currentQuestion.title}</strong> {currentQuestion.rationale || 
                    "The correct answer demonstrates proper nursing principles."}
                </p>
                
                {currentQuestion.type === 'mc' && 'correctAnswer' in currentQuestion && (
                  <div className="mt-2">
                    <h4 className="font-bold text-xs">Correct Answer:</h4>
                    <p className="text-xs">
                      {currentQuestion.correctAnswer}
                    </p>
                  </div>
                )}
              </div>
            </details>
          </div>
        )}
      </div>
      
      {/* Footer navigation - responsive and mobile friendly */}
      <div className="bg-gray-100 border-t border-gray-200 py-2 px-2 sm:py-3 sm:px-4 flex flex-wrap items-center justify-between gap-y-2 flex-shrink-0">
        <div className="flex space-x-1 sm:space-x-2">
          <button
            onClick={() => setShowEndExam(true)}
            className="flex items-center text-white bg-blue-600 hover:bg-blue-700 py-1 px-2 sm:py-1.5 sm:px-3 text-xs sm:text-sm rounded-l-md"
            aria-label="End Exam"
          >
            <span className="mr-1">⊗</span> End
          </button>
          
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center text-white bg-blue-600 hover:bg-blue-700 py-1 px-2 sm:py-1.5 sm:px-3 text-xs sm:text-sm border-l border-blue-500"
            aria-label={isPaused ? "Resume Exam" : "Pause Exam"}
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
            onClick={() => setShowInstructions(true)}
            className="flex items-center text-white bg-blue-600 hover:bg-blue-700 py-1 px-2 sm:py-1.5 sm:px-3 text-xs sm:text-sm rounded-r-md border-l border-blue-500"
            aria-label="Show Instructions"
          >
            <span className="sm:hidden">Help</span>
            <span className="hidden sm:inline">Instructions</span>
            <span className="ml-1">▶</span>
          </button>
        </div>
        
        {/* Stats - hidden on extra small screens */}
        <div className="hidden sm:flex items-center space-x-2 sm:space-x-4 text-xs text-gray-600 flex-wrap justify-center">
          <div className="flex items-center">
            <span className="inline-block w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500 mr-1"></span>
            <span className="whitespace-nowrap">{Object.values(answerCorrectness).filter(Boolean).length}/{totalQuestions} Correct</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-500 mr-1"></span>
            <span className="whitespace-nowrap">Standard Scoring</span>
          </div>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex space-x-1 sm:space-x-2">
          <button
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex <= 0}
            className={`flex items-center bg-blue-600 text-white py-1 px-2 sm:py-1.5 sm:px-3 text-xs sm:text-sm rounded-l-md ${
              currentQuestionIndex <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
            aria-label="Previous Question"
          >
            <span className="h-3 w-3 mr-1">◀</span> Prev
          </button>
          
          <button
            onClick={goToNextQuestion}
            className="flex items-center bg-blue-600 text-white py-1 px-2 sm:py-1.5 sm:px-3 text-xs sm:text-sm rounded-r-md border-l border-blue-500 hover:bg-blue-700"
            aria-label="Next Question"
          >
            Next <span className="h-3 w-3 ml-1">▶</span>
          </button>
        </div>
      </div>
      
      {/* Modals */}
      <ExamCalculator 
        isOpen={showCalculator}
        onClose={() => setShowCalculator(false)}
      />
      
      <ExamNotes 
        isOpen={showNotes}
        onClose={() => setShowNotes(false)}
        examId={test.id}
      />
      
      <ExamInstructionsModal 
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        examTitle={test.title}
        questionCount={totalQuestions}
        timeLimit={test.timeLimit ? Number(test.timeLimit) : undefined}
      />
      
      <EndTestModal 
        isOpen={showEndExam}
        onClose={() => setShowEndExam(false)}
        onConfirmEnd={handleEndExam}
        answeredCount={answeredCount}
        totalQuestions={totalQuestions}
        markedCount={markedForReview.length}
      />
    </div>
  );
}