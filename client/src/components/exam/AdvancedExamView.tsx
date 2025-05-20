import React, { useState, useEffect, useRef } from 'react';
import { Test, Question, QuestionsResponse } from '@shared/schema';
import { useQuery } from '@tanstack/react-query';
import { fetchTestContent } from '@/lib/api';
import { ExamHeader } from './ExamHeader';
import { ExamNavigation } from './ExamNavigation';
import { QuestionRenderer } from '../QuestionRenderer';
import { ExamInstructionsModal } from './ExamInstructionsModal';
import { ExamCalculator } from './ExamCalculator';
import { ExamNotes } from './ExamNotes';
import { EndTestModal } from './EndTestModal';
import { ExplanationPanel } from './ExplanationPanel';
import { debounce } from '@/lib/utils';
import { Confetti } from '@/components/ui/confetti';

// Define types for the drag and drop functionality
type QuestionStatus = 'unanswered' | 'answered' | 'marked' | 'correct' | 'incorrect';

interface QuestionItem {
  id: number;
  index: number;
  status: QuestionStatus;
}

interface TimerState {
  startTime: number;
  elapsedTime: number;
  isPaused: boolean;
  pauseStartTime: number | null;
}

interface AdvancedExamViewProps {
  test: Test & { questionsData?: QuestionsResponse };
  onBack: () => void;
  onComplete?: (results: ExamResults) => void;
  adaptiveDifficulty?: boolean;
  timeLimit?: number; // in minutes
}

interface ExamResults {
  score: number;
  totalQuestions: number;
  timeSpent: number; // in seconds
  answeredQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
  markedQuestions: number;
  categoryPerformance: Record<string, {
    correct: number;
    incorrect: number;
    total: number;
    percentage: number;
  }>;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completedAt: string;
}

export function AdvancedExamView({ 
  test, 
  onBack, 
  onComplete,
  adaptiveDifficulty = false,
  timeLimit
}: AdvancedExamViewProps) {
  // Refs for scrolling
  const questionContentRef = useRef<HTMLDivElement>(null);
  
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
  const [showExamSummary, setShowExamSummary] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Exam states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string | string[]>>({});
  const [showRationale, setShowRationale] = useState<Record<number, boolean>>({});
  const [answerCorrectness, setAnswerCorrectness] = useState<Record<number, boolean>>({});
  const [markedForReview, setMarkedForReview] = useState<number[]>([]);
  const [visitedQuestions, setVisitedQuestions] = useState<number[]>([]);
  const [questionNotes, setQuestionNotes] = useState<Record<number, string>>({});
  const [examCompleted, setExamCompleted] = useState(false);
  const [currentDifficulty, setCurrentDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>(
    'intermediate'
  );
  
  // Store the time when the user started the exam
  const [timerState, setTimerState] = useState<TimerState>({
    startTime: Date.now(),
    elapsedTime: 0,
    isPaused: false,
    pauseStartTime: null
  });
  
  const [timer, setTimer] = useState("00:00:00");

  // Use direct or API data
  const questionsData = test.questionsData || apiQuestionsData;
  const questions = typeof questionsData === 'object' && questionsData?.questions ? questionsData.questions : [];
  const currentQuestion = questions[currentQuestionIndex] || null;
  const totalQuestions = questions.length;

  // Track when a question is first visited
  useEffect(() => {
    if (currentQuestion && !visitedQuestions.includes(currentQuestion.id)) {
      setVisitedQuestions([...visitedQuestions, currentQuestion.id]);
    }
    
    // Scroll to top when changing questions
    if (questionContentRef.current) {
      questionContentRef.current.scrollTo(0, 0);
    }
  }, [currentQuestionIndex, currentQuestion, visitedQuestions]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const updateTimer = () => {
      if (!timerState.isPaused) {
        const now = Date.now();
        let elapsedMilliseconds = timerState.elapsedTime + (now - timerState.startTime);
        
        // Check if time limit has been reached (in milliseconds)
        if (timeLimit && elapsedMilliseconds >= timeLimit * 60 * 1000) {
          setTimerState(prev => ({
            ...prev,
            isPaused: true,
          }));
          handleEndTest();
          return;
        }
        
        const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
        const hours = Math.floor(elapsedSeconds / 3600);
        const minutes = Math.floor((elapsedSeconds % 3600) / 60);
        const seconds = elapsedSeconds % 60;
        
        setTimer(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }
    };
    
    interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [timerState, timeLimit]);

  // Function to toggle timer pause state
  const togglePause = () => {
    setTimerState(prev => {
      if (prev.isPaused) {
        // Resuming - calculate new startTime based on current time
        return {
          ...prev,
          isPaused: false,
          startTime: Date.now(),
          pauseStartTime: null
        };
      } else {
        // Pausing - save the current elapsed time
        return {
          ...prev,
          isPaused: true,
          elapsedTime: prev.elapsedTime + (Date.now() - prev.startTime),
          pauseStartTime: Date.now()
        };
      }
    });
  };

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

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
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
    
    // Store the user's answer
    setUserAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: normalizedAnswer
    }));
    
    // Check if the answer is correct
    let isCorrect = false;
    
    if (currentQuestion.type === 'mc' && 'correctAnswer' in currentQuestion) {
      let normalizedUserAnswer = '';
      
      if (Array.isArray(normalizedAnswer) && normalizedAnswer.length === 1) {
        normalizedUserAnswer = normalizeAnswerString(normalizedAnswer[0]);
      } else if (!Array.isArray(normalizedAnswer)) {
        normalizedUserAnswer = normalizeAnswerString(normalizedAnswer);
      }
      
      let correctAnswer = '';
      if ('correctAnswer' in currentQuestion) {
        correctAnswer = typeof currentQuestion.correctAnswer === 'string' 
                      ? normalizeAnswerString(currentQuestion.correctAnswer) 
                      : '';
      }
      
      isCorrect = normalizedUserAnswer === correctAnswer;
    } else if (currentQuestion.type === 'sata' && 'correctAnswer' in currentQuestion) {
      // For SATA questions, check that all correct answers are selected and no incorrect answers are selected
      if (Array.isArray(normalizedAnswer) && Array.isArray(currentQuestion.correctAnswer)) {
        const correctAnswers = new Set(
          currentQuestion.correctAnswer.map(a => typeof a === 'string' ? normalizeAnswerString(a) : a)
        );
        
        const userAnswerSet = new Set(
          normalizedAnswer.map(a => typeof a === 'string' ? normalizeAnswerString(a) : a)
        );
        
        // Check if sets are equal (same size and all elements match)
        isCorrect = correctAnswers.size === userAnswerSet.size && 
                   [...correctAnswers].every(value => userAnswerSet.has(value));
      }
    } else if (currentQuestion.type === 'ordered-response' && 'correctAnswer' in currentQuestion) {
      // For ordered response, check if the arrays match exactly in order
      if (Array.isArray(normalizedAnswer) && Array.isArray(currentQuestion.correctAnswer)) {
        isCorrect = normalizedAnswer.length === currentQuestion.correctAnswer.length &&
                   normalizedAnswer.every((value, index) => {
                     const correctItem = currentQuestion.correctAnswer[index];
                     return value === correctItem;
                   });
      }
    }
    
    // Store the correctness status
    setAnswerCorrectness(prevState => ({
      ...prevState,
      [questionId]: isCorrect
    }));
    
    // Show rationale
    setShowRationale(prevState => ({
      ...prevState,
      [questionId]: true
    }));
    
    // Update adaptive difficulty if enabled
    if (adaptiveDifficulty) {
      updateAdaptiveDifficulty();
    }
    
    // Automatically go to next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        goToNextQuestion();
      } else {
        // If this was the last question, show completion message or summary
        if (Object.keys(userAnswers).length === questions.length) {
          setShowCelebration(true);
          setTimeout(() => {
            setExamCompleted(true);
            setShowExamSummary(true);
          }, 3000);
        }
      }
    }, 1500);
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

  // Save notes for the current question
  const saveNotes = (notes: string) => {
    if (!currentQuestion) return;
    
    setQuestionNotes(prev => ({
      ...prev,
      [currentQuestion.id]: notes
    }));
  };

  // Adaptive difficulty adjustment based on user performance
  const updateAdaptiveDifficulty = () => {
    // Calculate current performance
    const answeredCount = Object.keys(answerCorrectness).length;
    if (answeredCount < 5) return; // Need minimum questions to determine level
    
    const correctCount = Object.values(answerCorrectness).filter(Boolean).length;
    const currentAccuracy = correctCount / answeredCount;
    
    // Adjust difficulty based on performance
    if (currentAccuracy > 0.85) {
      setCurrentDifficulty('advanced');
    } else if (currentAccuracy < 0.65) {
      setCurrentDifficulty('beginner');
    } else {
      setCurrentDifficulty('intermediate');
    }
  };

  // Get question status for navigation
  const getQuestionStatus = (questionId: number): QuestionStatus => {
    if (markedForReview.includes(questionId)) {
      return 'marked';
    } else if (answerCorrectness[questionId] === true) {
      return 'correct';
    } else if (answerCorrectness[questionId] === false) {
      return 'incorrect';
    } else if (userAnswers[questionId]) {
      return 'answered';
    } else {
      return 'unanswered';
    }
  };

  // Get all questions statuses for navigation
  const getQuestionsStatuses = (): QuestionItem[] => {
    return questions.map((q, index) => ({
      id: q.id,
      index,
      status: getQuestionStatus(q.id)
    }));
  };

  // Calculate exam statistics
  const calculateExamStats = (): ExamResults => {
    const answeredQuestions = Object.keys(userAnswers).length;
    const correctAnswers = Object.values(answerCorrectness).filter(Boolean).length;
    const incorrectAnswers = answeredQuestions - correctAnswers;
    const skippedQuestions = totalQuestions - answeredQuestions;
    
    // Calculate performance by category
    const categoryPerformance: Record<string, {correct: number, incorrect: number, total: number, percentage: number}> = {};
    
    questions.forEach(question => {
      const category = question.category || 'Uncategorized';
      
      if (!categoryPerformance[category]) {
        categoryPerformance[category] = {
          correct: 0,
          incorrect: 0,
          total: 0,
          percentage: 0
        };
      }
      
      categoryPerformance[category].total += 1;
      
      if (userAnswers[question.id]) {
        if (answerCorrectness[question.id]) {
          categoryPerformance[category].correct += 1;
        } else {
          categoryPerformance[category].incorrect += 1;
        }
      }
    });
    
    // Calculate percentages
    Object.keys(categoryPerformance).forEach(category => {
      const { correct, total } = categoryPerformance[category];
      categoryPerformance[category].percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    });
    
    // Total time spent in seconds
    const timeSpent = Math.floor(
      (timerState.elapsedTime + (Date.now() - timerState.startTime)) / 1000
    );
    
    return {
      score: correctAnswers,
      totalQuestions,
      timeSpent,
      answeredQuestions,
      correctAnswers,
      incorrectAnswers,
      skippedQuestions,
      markedQuestions: markedForReview.length,
      categoryPerformance,
      difficulty: currentDifficulty,
      completedAt: new Date().toISOString()
    };
  };

  // Handle end test
  const handleEndTest = () => {
    setTimerState(prev => ({
      ...prev,
      isPaused: true,
    }));
    
    const results = calculateExamStats();
    
    if (onComplete) {
      onComplete(results);
    }
    
    setExamCompleted(true);
    setShowExamSummary(true);
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

  // If loading, show a loading message
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-pulse h-16 w-16 mx-auto mb-4 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          <p className="text-lg font-medium">Loading exam content...</p>
        </div>
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
    timeSpent: Math.floor((timerState.elapsedTime + (Date.now() - timerState.startTime)) / 1000),
    percentageCorrect: Math.round((Object.values(answerCorrectness).filter(Boolean).length / Math.max(1, Object.keys(userAnswers).length)) * 100)
  };

  // If exam is completed and summary is shown
  if (examCompleted && showExamSummary) {
    const examStats = calculateExamStats();
    const percentage = Math.round((examStats.correctAnswers / examStats.totalQuestions) * 100);
    const isPassing = percentage >= 65; // Standard NCLEX passing threshold
    
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="bg-[#13294B] text-white p-4 shadow-md">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">{test.title} - Results</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm">Time: {timer}</span>
              <button 
                onClick={onBack}
                className="px-4 py-2 bg-[#4B9CD3] hover:bg-[#3d7eaa] rounded text-white"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex-grow p-6 max-w-7xl mx-auto w-full">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#13294B] mb-2">Exam Completed!</h2>
              <p className="text-gray-600 mb-4">
                Here's how you performed on this exam.
              </p>
              
              <div className="inline-block mb-4">
                <div className={`text-6xl font-bold ${isPassing ? 'text-green-600' : 'text-red-600'}`}>
                  {percentage}%
                </div>
                <div className={`text-sm mt-1 ${isPassing ? 'text-green-600' : 'text-red-600'}`}>
                  {isPassing ? 'PASSED' : 'NEEDS IMPROVEMENT'}
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">{examStats.correctAnswers}</div>
                  <div className="text-sm text-gray-600">Correct</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-red-700">{examStats.incorrectAnswers}</div>
                  <div className="text-sm text-gray-600">Incorrect</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-gray-700">{examStats.skippedQuestions}</div>
                  <div className="text-sm text-gray-600">Unanswered</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-700">
                    {Math.floor(examStats.timeSpent / 60)}:{(examStats.timeSpent % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm text-gray-600">Time (m:s)</div>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-bold text-[#13294B] mb-4">Performance by Category</h3>
              <div className="space-y-3">
                {Object.entries(examStats.categoryPerformance).map(([category, data]) => (
                  <div key={category} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{category}</span>
                      <span className={data.percentage >= 65 ? 'text-green-600' : 'text-red-600'}>
                        {data.percentage}% ({data.correct}/{data.total})
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${data.percentage >= 65 ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${data.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-bold text-[#13294B] mb-4">Next Steps</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md">
                  Review Incorrect Answers
                </button>
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-md">
                  Generate Study Plan
                </button>
                <button 
                  onClick={onBack}
                  className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-md"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Show confetti when all questions are correct */}
      {showCelebration && <Confetti />}
      
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
        initialNotes={questionNotes[currentQuestion?.id] || ''}
        onSave={saveNotes}
      />
      
      {/* End Test Modal */}
      <EndTestModal 
        isOpen={showEndTestModal}
        onClose={() => setShowEndTestModal(false)}
        onEndTest={handleEndTest}
        unansweredCount={calculateUnansweredCount()}
      />
      
      {/* Exam Header - Fixed */}
      <div className="flex-shrink-0">
        <ExamHeader 
          examTitle={`${test.title} (${currentQuestionIndex+1}/${totalQuestions})`}
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={totalQuestions}
          timeElapsed={timer}
          onCalculatorClick={() => setShowCalculator(true)}
          onNotesClick={() => setShowNotes(true)}
          onReportIssueClick={() => alert("Report issue feature coming soon")}
          onMarkForReviewClick={toggleMarkForReview}
          isQuestionMarkedForReview={markedForReview.includes(currentQuestion.id)}
          adaptiveDifficulty={adaptiveDifficulty ? currentDifficulty : undefined}
        />
      </div>
      
      {/* Main Content - Only this section should scroll */}
      <div className="flex-grow flex overflow-hidden">
        {showRationale[currentQuestion.id] ? (
          // Split view with explanation
          <>
            {/* Left side - Question (scrollable) */}
            <div className="w-1/2 overflow-y-auto p-5 border-r" ref={questionContentRef}>
              <div className="flex items-start mb-4">
                <div className="text-blue-700 mr-2 font-bold flex-shrink-0">▶</div>
                <div className="w-full">
                  <div className="question-content mb-3">
                    {currentQuestion.category && (
                      <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                        Category: {currentQuestion.category}
                      </div>
                    )}
                    <div className="text-lg">{currentQuestion.text}</div>
                  </div>
                  <div className="mt-2">
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
            
            {/* Right side - Explanation */}
            <div className="w-1/2 overflow-y-auto p-5">
              <ExplanationPanel 
                isVisible={true}
                question={currentQuestion}
                correctAnswer={getCorrectAnswer()}
                explanationText={currentQuestion.rationale}
              />
            </div>
          </>
        ) : (
          // Full width question view
          <div className="w-full overflow-y-auto p-5" ref={questionContentRef}>
            <div className="flex items-start mb-4">
              <div className="text-blue-700 mr-2 font-bold flex-shrink-0">▶</div>
              <div className="w-full">
                <div className="question-content mb-3">
                  {currentQuestion.category && (
                    <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                      Category: {currentQuestion.category}
                    </div>
                  )}
                  <div className="text-lg">{currentQuestion.text}</div>
                </div>
                <div className="mt-2">
                  <QuestionRenderer 
                    question={currentQuestion}
                    onAnswer={handleAnswerSubmit}
                    userAnswer={userAnswers[currentQuestion.id]}
                    showRationale={showRationale[currentQuestion.id] || false}
                    isCorrect={answerCorrectness[currentQuestion.id] || false}
                  />
                </div>
                {questionNotes[currentQuestion.id] && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="text-sm font-medium text-yellow-800 mb-1">Your Notes</div>
                    <div className="text-sm text-gray-700">{questionNotes[currentQuestion.id]}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Navigation Footer - Fixed */}
      <div className="flex-shrink-0">
        <ExamNavigation 
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={totalQuestions}
          onPrevious={goToPreviousQuestion}
          onNext={goToNextQuestion}
          onNavigate={() => {
            // Show question navigator
            const questionsStatuses = getQuestionsStatuses();
            // Would display a question grid here
            alert(`Question Navigator: ${questionsStatuses.length} questions`);
          }}
          onPause={togglePause}
          onEnd={() => setShowEndTestModal(true)}
          isPaused={timerState.isPaused}
          stats={stats}
          questionsStatuses={getQuestionsStatuses()}
          onQuestionSelect={goToQuestion}
        />
      </div>
    </div>
  );
}