import React, { useState, useEffect } from 'react';
import { Test, Question, QuestionsResponse } from '@shared/schema';
import { useQuery } from '@tanstack/react-query';
import { fetchTestContent, submitExamResults } from '@/lib/api';
import { QuestionRenderer } from '../QuestionRenderer';
import { ExamCalculator } from './ExamCalculator';
import { ExamNotes } from './ExamNotes';
import { ExamInstructionsModal } from './ExamInstructionsModal';
import { EndTestModal } from './EndTestModal';
import { ExamReviewScreen } from '../ExamReviewScreen';
import { useToast } from '@/hooks/use-toast';

interface FixedExamViewProps {
  test: Test & { questionsData?: QuestionsResponse };
  onBack: () => void;
  onComplete?: (score: number, totalQuestions: number) => void;
}

export function FixedExamView({ 
  test, 
  onBack, 
  onComplete 
}: FixedExamViewProps) {
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
  const [showReviewScreen, setShowReviewScreen] = useState(false);
  const [examScore, setExamScore] = useState(0);

  // Get questions from data
  const getQuestions = (): Question[] => {
    if (test.questionsData && test.questionsData.questions) {
      return test.questionsData.questions;
    }
    
    if (apiQuestionsData && apiQuestionsData.questions) {
      return apiQuestionsData.questions;
    }
    
    return [];
  };
  
  const questions = getQuestions();
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
    
    // Check correctness - simplified version
    let isCorrect = false;
    if ('correctAnswer' in currentQuestion) {
      if (Array.isArray(currentQuestion.correctAnswer) && Array.isArray(answer)) {
        // For multi-select questions
        isCorrect = 
          currentQuestion.correctAnswer.length === answer.length &&
          currentQuestion.correctAnswer.every(a => answer.includes(a));
      } else if (!Array.isArray(currentQuestion.correctAnswer) && !Array.isArray(answer)) {
        // For single-select questions
        isCorrect = answer === currentQuestion.correctAnswer;
      }
    }
    
    // Store correctness
    setAnswerCorrectness(prev => ({
      ...prev,
      [questionId]: isCorrect
    }));
    
    // Show rationale
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
      setExamScore(correctAnswers);
      
      // Show review screen
      setShowReviewScreen(true);
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

  // Show review screen if exam is completed
  if (showReviewScreen) {
    return (
      <ExamReviewScreen
        score={examScore}
        totalQuestions={totalQuestions}
        questions={questions}
        userAnswers={userAnswers}
        answerCorrectness={answerCorrectness}
        timeTaken={timer}
        onBack={onBack}
        onRetakeExam={() => {
          // Reset exam state for retake
          setUserAnswers({});
          setShowRationale({});
          setAnswerCorrectness({});
          setMarkedForReview([]);
          setTimerSeconds(0);
          setTimer("00:00:00");
          setCurrentQuestionIndex(0);
          setTestCompleted(false);
          setShowReviewScreen(false);
        }}
      />
    );
  }

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

  // Render explanation panel for the current question
  const renderExplanation = () => {
    if (!currentQuestion || !showRationale[currentQuestion.id]) return null;

    // Format correct answer text based on question type
    const getCorrectAnswerDisplay = () => {
      if (!('correctAnswer' in currentQuestion)) return null;
      
      const correctAnswer = currentQuestion.correctAnswer;
      
      if (currentQuestion.type === 'ordered-response' && Array.isArray(correctAnswer)) {
        return (
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Correct Order:</h4>
            <ol className="list-decimal pl-5 space-y-1">
              {correctAnswer.map((item, index) => {
                const text = typeof item === 'object' && item !== null && 'text' in item 
                  ? item.text 
                  : String(item);
                return <li key={index} className="mb-1">{text}</li>;
              })}
            </ol>
          </div>
        );
      }
      
      if (currentQuestion.type === 'sata' && Array.isArray(correctAnswer)) {
        return (
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Correct Options:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {correctAnswer.map((item, index) => {
                const text = typeof item === 'object' && item !== null && 'text' in item 
                  ? item.text 
                  : String(item);
                return <li key={index} className="mb-1">{text}</li>;
              })}
            </ul>
          </div>
        );
      }
      
      // For single-choice questions
      const answerText = typeof correctAnswer === 'object' && correctAnswer !== null && 'text' in correctAnswer 
        ? correctAnswer.text 
        : String(correctAnswer);
        
      return (
        <div>
          <h4 className="font-medium text-blue-800 mb-2">Correct Answer:</h4>
          <p>{answerText}</p>
        </div>
      );
    };

    return (
      <div className="bg-blue-50 p-4 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">Explanation</h3>
        
        <div className="mb-4">
          {answerCorrectness[currentQuestion.id] ? (
            <div className="p-2 bg-green-100 border border-green-300 rounded text-green-800 font-medium">
              ✓ Correct Answer
            </div>
          ) : (
            <div className="p-2 bg-red-100 border border-red-300 rounded text-red-800 font-medium">
              ✗ Incorrect Answer
            </div>
          )}
        </div>
        
        <div className="mb-4 whitespace-pre-line text-gray-700">
          {currentQuestion.rationale || 
            "The correct answer demonstrates proper understanding of nursing principles and prioritization of care."}
        </div>
        
        {getCorrectAnswerDisplay()}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gray-50 overflow-hidden">
      {/* Modals */}
      <ExamCalculator 
        isOpen={showCalculator}
        onClose={() => setShowCalculator(false)}
      />
      
      <ExamNotes 
        isOpen={showNotes}
        onClose={() => setShowNotes(false)}
        questionId={currentQuestion?.id}
      />
      
      <ExamInstructionsModal 
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        onStart={() => setShowInstructions(false)}
      />
      
      <EndTestModal 
        isOpen={showEndExam}
        onClose={() => setShowEndExam(false)}
        onEndTest={handleEndExam}
        unansweredCount={totalQuestions - answeredCount}
      />
      
      {/* Header - Fixed at top */}
      <header className="bg-white shadow-sm border-b py-2 px-4 flex-shrink-0">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center flex-grow min-w-0">
            <h1 className="font-medium text-lg text-blue-700 truncate">{test.title}</h1>
            <span className="ml-2 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
              {currentQuestionIndex + 1}/{totalQuestions}
            </span>
          </div>
          
          <div className="flex space-x-3 items-center">
            <div className="text-sm whitespace-nowrap">
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
      
      {/* Main content area - Split view for question and explanation */}
      <div className="flex-1 flex overflow-auto">
        {/* Left panel - Question */}
        <div className={`${showRationale[currentQuestion.id] ? 'w-1/2' : 'w-full'} p-4 overflow-y-auto`}>
          <div className="max-w-3xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              {/* Question header */}
              <div className="bg-blue-50 p-3 border-b border-blue-100">
                <h2 className="text-blue-800 font-medium text-lg">Question {currentQuestionIndex + 1}</h2>
              </div>
              
              {/* Question content */}
              <div className="p-4">
                <p className="text-gray-800 mb-4">{currentQuestion.text}</p>
                
                <div className="mt-6">
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
        </div>
        
        {/* Right panel - Explanation (only shown after answering) */}
        {showRationale[currentQuestion.id] && (
          <div className="w-1/2 p-4 overflow-y-auto border-l border-gray-200">
            <div className="max-w-3xl mx-auto">
              {renderExplanation()}
            </div>
          </div>
        )}
      </div>
      
      {/* Footer with navigation controls */}
      <div className="bg-white border-t border-gray-200 p-3 flex justify-between items-center">
        <button
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className={`px-4 py-2 rounded ${
            currentQuestionIndex === 0 ? 'text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          Previous
        </button>
        
        <div className="flex space-x-2">
          {userAnswers[currentQuestion.id] && !showRationale[currentQuestion.id] && (
            <button
              onClick={() => {
                setShowRationale(prev => ({
                  ...prev,
                  [currentQuestion.id]: true
                }));
              }}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Show Explanation
            </button>
          )}
          
          <button
            onClick={() => setShowEndExam(true)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            End Exam
          </button>
        </div>
        
        <button
          onClick={goToNextQuestion}
          disabled={currentQuestionIndex === questions.length - 1}
          className={`px-4 py-2 rounded ${
            currentQuestionIndex === questions.length - 1 ? 'text-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}