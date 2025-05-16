import React, { useState, useEffect } from 'react';
import { Test, Question, QuestionsResponse } from '@shared/schema';
import { useQuery } from '@tanstack/react-query';
import { fetchTestContent } from '@/lib/api';
import { MedicalSpinner } from '@/components/ui/medical-spinner';
import { ExamInstructionsModal } from './ExamInstructionsModal';
import { ExamHeader } from './ExamHeader';
import { ExamBody } from './ExamBody';
import { ExamNavigation } from './ExamNavigation';
import { ExamCalculator } from './ExamCalculator';
import { ExamNotes } from './ExamNotes';
import { EndTestModal } from './EndTestModal';
import { ExplanationPanel } from './ExplanationPanel';
import { useBadges } from '@/contexts/BadgeContext';

interface EnhancedExamViewProps {
  test: Test & { questionsData?: QuestionsResponse };
  onBack: () => void;
  onComplete?: (score: number, totalQuestions: number) => void;
}

export function EnhancedExamView({ 
  test, 
  onBack, 
  onComplete 
}: EnhancedExamViewProps) {
  // Fetch test content if not already provided
  const { data: apiQuestionsData, isLoading, error } = useQuery({
    queryKey: [`/api/tests/${test.id}/content`],
    queryFn: () => fetchTestContent(test.id),
    enabled: !test.questionsData
  });

  // Modal states
  const [showInstructions, setShowInstructions] = useState(true);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showEndTestModal, setShowEndTestModal] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Exam states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState("00:00:00");
  const [userAnswers, setUserAnswers] = useState<Record<number, string | string[]>>({});
  const [showRationale, setShowRationale] = useState<Record<number, boolean>>({});
  const [answerCorrectness, setAnswerCorrectness] = useState<Record<number, boolean>>({});
  const [markedForReview, setMarkedForReview] = useState<number[]>([]);

  const { updateAfterQuestionAnswered, updateAfterTestCompleted } = useBadges();

  // Use direct or API data
  const questionsData = test.questionsData || apiQuestionsData;
  const questions = typeof questionsData === 'object' && questionsData?.questions ? questionsData.questions : [];
  const currentQuestion = questions[currentQuestionIndex] || null;
  const totalQuestions = questions.length;

  // Calculate elapsed time for display
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

  // Navigation functions
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

  // Normalize answer strings by removing quotes if present
  const normalizeAnswerString = (value: string): string => {
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith('\"') && value.endsWith('\"'))) {
      try {
        const parsed = JSON.parse(value);
        if (typeof parsed === 'string') {
          return normalizeAnswerString(parsed);
        }
        return String(parsed);
      } catch (e) {
        return value.substring(1, value.length - 1);
      }
    }
    return value;
  };

  // Normalize a single answer or an array of answers
  const normalizeAnswer = (answer: string | string[]): string | string[] => {
    if (Array.isArray(answer)) {
      return answer.map(a => typeof a === 'string' ? normalizeAnswerString(a) : a);
    }
    return typeof answer === 'string' ? normalizeAnswerString(answer) : answer;
  };

  // Handle answer submission
  const handleAnswerSubmit = (answer: string | string[]) => {
    if (!currentQuestion) return;
    
    const questionId = currentQuestion.id;
    const normalizedAnswer = normalizeAnswer(answer);
    
    setUserAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: normalizedAnswer
    }));
    
    checkAnswer(questionId, normalizedAnswer);
    
    setShowRationale(prevState => ({
      ...prevState,
      [questionId]: true
    }));
  };

  // Check if the answer is correct
  const checkAnswer = (questionId: number, answer: string | string[]) => {
    const question = questions.find((q: Question) => q.id === questionId);
    if (!question) return;
    
    let isCorrect = false;
    
    // Handle different question types
    if (question.type === 'mc' && 'correctAnswer' in question) {
      let normalizedUserAnswer = '';
      
      if (Array.isArray(answer) && answer.length === 1) {
        normalizedUserAnswer = normalizeAnswerString(answer[0]);
      } else if (!Array.isArray(answer)) {
        normalizedUserAnswer = normalizeAnswerString(answer);
      }
      
      let correctAnswer = '';
      if ('correctAnswer' in question) {
        correctAnswer = typeof question.correctAnswer === 'string' 
                        ? normalizeAnswerString(question.correctAnswer) 
                        : '';
      }
      
      isCorrect = normalizedUserAnswer === correctAnswer;
    } 
    // Handle other question types (SATA, etc.)
    // ...similar logic for other question types
    
    setAnswerCorrectness(prevState => ({
      ...prevState,
      [questionId]: isCorrect
    }));
    
    // Update badge progress
    updateAfterQuestionAnswered(question, isCorrect, 1, false);
  };

  // Toggle mark for review
  const toggleMarkForReview = () => {
    if (!currentQuestion) return;
    
    const questionId = currentQuestion.id;
    
    if (markedForReview.includes(questionId)) {
      setMarkedForReview(markedForReview.filter(id => id !== questionId));
    } else {
      setMarkedForReview([...markedForReview, questionId]);
    }
  };

  // Check if current question is marked for review
  const isQuestionMarkedForReview = (questionId: number) => {
    return markedForReview.includes(questionId);
  };

  // Get the correct answer for the current question
  const getCorrectAnswer = () => {
    if (!currentQuestion) return "";
    
    if (currentQuestion.type === 'mc' && 'correctAnswer' in currentQuestion) {
      return currentQuestion.correctAnswer;
    } else if (currentQuestion.type === 'sata' && 'correctAnswer' in currentQuestion) {
      return currentQuestion.correctAnswer;
    }
    
    return "";
  };

  // Calculate the number of unanswered questions
  const calculateUnansweredCount = () => {
    return totalQuestions - Object.keys(userAnswers).length;
  };

  // If loading, show spinner
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <MedicalSpinner type="cardiogram" size="lg" text="Loading exam content..." />
      </div>
    );
  }

  // If error, show error message
  if (error) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-md">
        <h3 className="text-lg font-medium text-red-700 mb-2">Error Loading Exam</h3>
        <p className="text-red-600">There was an error loading the exam content. Please try again later.</p>
        <button 
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // If no questions, show empty state
  if (!currentQuestion) {
    return (
      <div className="p-8 bg-yellow-50 border border-yellow-200 rounded-md">
        <h3 className="text-lg font-medium text-yellow-700 mb-2">No Questions Available</h3>
        <p className="text-yellow-600">This exam doesn't contain any questions yet.</p>
        <button 
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Calculate stats for navigation display
  const stats = {
    scoreMax: totalQuestions,
    scoreCorrect: Object.values(answerCorrectness).filter(Boolean).length,
    scoringRule: "0/1 Scoring",
    timeSpent: 12, // Mock time spent on current question in seconds
    percentageCorrect: Math.round((Object.values(answerCorrectness).filter(Boolean).length / Object.keys(userAnswers).length) * 100) || 0
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Instruction Modal */}
      <ExamInstructionsModal 
        isOpen={showInstructions} 
        onClose={() => setShowInstructions(false)}
        onStart={() => setShowInstructions(false)}
      />
      
      {/* Calculator Modal */}
      <ExamCalculator 
        isOpen={showCalculator}
        onClose={() => setShowCalculator(false)}
      />
      
      {/* Notes Modal */}
      <ExamNotes 
        isOpen={showNotes}
        onClose={() => setShowNotes(false)}
        questionId={currentQuestion?.id}
      />
      
      {/* End Test Modal */}
      <EndTestModal 
        isOpen={showEndTestModal}
        onClose={() => setShowEndTestModal(false)}
        onEndTest={() => {
          if (onComplete) {
            onComplete(
              Object.values(answerCorrectness).filter(Boolean).length,
              totalQuestions
            );
          }
          onBack();
        }}
        unansweredCount={calculateUnansweredCount()}
      />
      
      {/* Exam Header */}
      <ExamHeader 
        examTitle={`Tutored CAT ${currentQuestionIndex+1}/${totalQuestions}`}
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
        timeElapsed={timer}
        onCalculatorClick={() => setShowCalculator(true)}
        onNotesClick={() => setShowNotes(true)}
        onReportIssueClick={() => alert("Report issue feature coming soon")}
        onMarkForReviewClick={toggleMarkForReview}
        isQuestionMarkedForReview={isQuestionMarkedForReview(currentQuestion.id)}
      />
      
      {/* Main Content */}
      <div className="flex-grow flex">
        {/* Left side - Question */}
        <div className={`flex-1 overflow-auto ${showRationale[currentQuestion.id] ? 'border-r' : ''}`}>
          <ExamBody 
            question={currentQuestion}
            onAnswer={handleAnswerSubmit}
            userAnswer={userAnswers[currentQuestion.id]}
            showRationale={showRationale[currentQuestion.id]}
            isCorrect={answerCorrectness[currentQuestion.id]}
          />
        </div>
        
        {/* Right side - Explanation (visible when showing rationale) */}
        {showRationale[currentQuestion.id] && (
          <div className="w-1/2 overflow-auto">
            <ExplanationPanel 
              isVisible={showRationale[currentQuestion.id]}
              question={currentQuestion}
              correctAnswer={getCorrectAnswer()}
              explanationText={currentQuestion.rationale}
            />
          </div>
        )}
      </div>
      
      {/* Navigation Footer */}
      <ExamNavigation 
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
        onPrevious={goToPreviousQuestion}
        onNext={goToNextQuestion}
        onNavigate={() => alert("Navigator coming soon")}
        onPause={() => setIsPaused(!isPaused)}
        onEnd={() => setShowEndTestModal(true)}
        isPaused={isPaused}
        stats={stats}
      />
    </div>
  );
}