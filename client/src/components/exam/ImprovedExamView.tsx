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

interface ImprovedExamViewProps {
  test: Test & { questionsData?: QuestionsResponse };
  onBack: () => void;
  onComplete?: (score: number, totalQuestions: number) => void;
}

export function ImprovedExamView({ 
  test, 
  onBack, 
  onComplete 
}: ImprovedExamViewProps) {
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

  // Use direct or API data
  const questionsData = test.questionsData || apiQuestionsData;
  const questions = questionsData && typeof questionsData === 'object' && 'questions' in questionsData ? 
                    (questionsData.questions as Question[]) : 
                    [];
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

  // Format answer text for display
  const formatAnswerText = (answer: any): string => {
    if (!answer) return '';
    
    if (typeof answer === 'object' && answer !== null) {
      if ('text' in answer) return answer.text;
      if (Array.isArray(answer)) {
        return answer.map(item => typeof item === 'object' && item !== null && 'text' in item ? item.text : String(item)).join(', ');
      }
    }
    
    return String(answer);
  };

  // Handle answer submission
  const handleAnswerSubmit = (answer: string | string[]) => {
    if (!currentQuestion) return;
    
    const questionId = currentQuestion.id;
    
    // Store user answer
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    
    // Check correctness based on question type
    let isCorrect = false;
    
    if ('correctAnswer' in currentQuestion) {
      if (currentQuestion.type === 'mc') {
        // Single choice question
        if (Array.isArray(answer) && answer.length === 1) {
          isCorrect = answer[0] === currentQuestion.correctAnswer;
        } else if (!Array.isArray(answer)) {
          isCorrect = answer === currentQuestion.correctAnswer;
        }
      } 
      else if (currentQuestion.type === 'sata' && Array.isArray(currentQuestion.correctAnswer)) {
        // Multi-select question
        if (Array.isArray(answer)) {
          isCorrect = 
            answer.length === currentQuestion.correctAnswer.length &&
            answer.every(a => currentQuestion.correctAnswer.includes(a));
        }
      }
      else if (currentQuestion.type === 'ordered-response' && Array.isArray(currentQuestion.correctAnswer)) {
        // Prioritization question
        if (Array.isArray(answer)) {
          // Get IDs only from complex objects if needed
          const getItemId = (item: any): string => {
            return typeof item === 'object' && item !== null && 'id' in item ? item.id : String(item);
          };
          
          const correctAnswerIds = currentQuestion.correctAnswer.map(getItemId);
          const userAnswerIds = answer.map(ans => String(ans));
          
          // Check if arrays have same elements in the same order
          isCorrect = 
            userAnswerIds.length === correctAnswerIds.length && 
            userAnswerIds.every((item, index) => item === correctAnswerIds[index]);
        }
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

  // Render the correct answer based on question type
  const renderCorrectAnswer = () => {
    if (!currentQuestion || !('correctAnswer' in currentQuestion)) {
      return null;
    }
    
    const correctAnswer = currentQuestion.correctAnswer;
    
    // For ordered-response questions (prioritization)
    if (currentQuestion.type === 'ordered-response' && Array.isArray(correctAnswer)) {
      return (
        <div>
          <h4 className="font-bold mt-4 mb-2">Correct Order:</h4>
          <ol className="list-decimal ml-5 space-y-1">
            {correctAnswer.map((answer, index) => (
              <li key={index} className="text-green-700">
                {typeof answer === 'object' && answer !== null && 'text' in answer ? answer.text : String(answer)}
              </li>
            ))}
          </ol>
        </div>
      );
    }
    
    // For SATA questions
    if (currentQuestion.type === 'sata' && Array.isArray(correctAnswer)) {
      return (
        <div>
          <h4 className="font-bold mt-4 mb-2">Correct Selections:</h4>
          <ul className="list-disc ml-5 space-y-1">
            {correctAnswer.map((answer, index) => (
              <li key={index} className="text-green-700">
                {typeof answer === 'object' && answer !== null && 'text' in answer ? answer.text : String(answer)}
              </li>
            ))}
          </ul>
        </div>
      );
    }
    
    // For MC questions
    return (
      <div>
        <h4 className="font-bold mt-4 mb-2">Correct Answer:</h4>
        <p className="text-green-700">
          {typeof correctAnswer === 'object' && correctAnswer !== null && 'text' in correctAnswer 
            ? correctAnswer.text 
            : String(correctAnswer)}
        </p>
      </div>
    );
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
      
      // Show review screen instead of navigating back
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
      
      {/* Main Content - Only this section should scroll */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Content section with question and explanation */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left panel - Question */}
          <div className={`${showRationale[currentQuestion.id] ? 'w-1/2' : 'w-full'} overflow-y-auto p-4 border-r`}>
            <div className="flex items-start mb-4">
              <div className="text-blue-700 mr-2 font-bold flex-shrink-0">▶</div>
              <div className="w-full">
                <div className="mb-2 text-lg font-medium">
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
          
          {/* Right panel - Explanation (only shown after answering) */}
          {showRationale[currentQuestion.id] && (
            <div className="w-1/2 overflow-y-auto p-4 bg-white border-l">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Explanation</h3>
                
                {answerCorrectness[currentQuestion.id] ? (
                  <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
                    <span className="font-medium text-green-700">✓ Correct Answer</span>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                    <span className="font-medium text-red-700">✗ Incorrect Answer</span>
                  </div>
                )}
                
                <div className="text-gray-700 whitespace-pre-line mb-4">
                  {currentQuestion.rationale || 
                    "The correct answer demonstrates proper understanding of nursing principles and prioritization of care."}
                </div>
                
                {renderCorrectAnswer()}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer with navigation controls */}
        <div className="flex justify-between items-center p-4 bg-white border-t">
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
    </div>
  );
}