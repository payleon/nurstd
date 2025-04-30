import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Test, Question, QuestionsResponse } from "@shared/schema";
import { fetchQuestions, fetchTestContent } from "@/lib/api";
import { MedicalSpinner, LoadingScreen, QuestionLoader } from "@/components/ui/medical-spinner";
import { 
  ArrowLeft, Clock, Flag, PanelLeftClose, HelpCircle, Save, ChevronLeft, 
  ChevronRight, Check, Award, BookOpen, Lightbulb, Bell, AlertTriangle,
  User, LogOut, Monitor, Maximize, Minimize, Meh, Smile, Frown, Clipboard,
  CheckSquare, PauseCircle, PlayCircle, RotateCcw, X, Menu, Calculator
} from "lucide-react";
import { QuestionRenderer } from "./QuestionRenderer";
import { FlashcardReview } from "./FlashcardReview";
import { useBadges } from "@/contexts/BadgeContext";
import { toast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { motion, AnimatePresence } from "framer-motion";

interface QuestionTestViewProps {
  test: Test & { questionsData?: QuestionsResponse };
  onBack: () => void;
}

export function QuestionTestView({ test, onBack }: QuestionTestViewProps) {
  // Use the directly passed questions data if available, otherwise fetch from API for the specific test
  const { data: apiQuestionsData, isLoading: apiLoading, error: apiError } = useQuery({
    queryKey: [`/api/tests/${test.id}/content`],
    queryFn: () => fetchTestContent(test.id),
    // Skip this query if we already have the questions data
    enabled: !test.questionsData
  });
  
  const { updateAfterQuestionAnswered, updateAfterTestCompleted } = useBadges();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string | string[]>>({});
  const [timer, setTimer] = useState("02:00:00");
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
  const [incorrectAnswers, setIncorrectAnswers] = useState<number[]>([]);
  const [showReviewMode, setShowReviewMode] = useState(false);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [showRationale, setShowRationale] = useState<Record<number, boolean>>({});
  const [answerCorrectness, setAnswerCorrectness] = useState<Record<number, boolean>>({});
  
  // Use the direct questionsData if available, otherwise use API data
  const questionsData = test.questionsData || apiQuestionsData;
  const isLoading = !test.questionsData && apiLoading;
  const error = apiError;
  
  // Handle both string and object response types
  const questions = typeof questionsData === 'object' && questionsData?.questions ? questionsData.questions : [];
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  
  // Mock decreasing timer for demo purposes
  useEffect(() => {
    const interval = setInterval(() => {
      const [hours, minutes, seconds] = timer.split(':').map(Number);
      let newSeconds = seconds - 1;
      let newMinutes = minutes;
      let newHours = hours;
      
      if (newSeconds < 0) {
        newSeconds = 59;
        newMinutes -= 1;
      }
      
      if (newMinutes < 0) {
        newMinutes = 59;
        newHours -= 1;
      }
      
      if (newHours < 0) {
        clearInterval(interval);
        return;
      }
      
      setTimer(
        `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}:${newSeconds.toString().padStart(2, '0')}`
      );
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timer]);

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      // Hide rationale when moving to next question if not answered
      const nextQuestionId = questions[currentQuestionIndex + 1]?.id;
      if (nextQuestionId && !userAnswers[nextQuestionId]) {
        setShowRationale({
          ...showRationale,
          [nextQuestionId]: false
        });
      }
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      // When going back to a previous question, show rationale if it was answered
      const prevQuestionId = questions[currentQuestionIndex - 1]?.id;
      if (prevQuestionId && userAnswers[prevQuestionId] !== undefined) {
        setShowRationale({
          ...showRationale,
          [prevQuestionId]: true
        });
      }
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleAnswerSubmit = (answer: string | string[]) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: answer
    });
    
    // If this is a change to an existing answer, check if it was correct
    checkAnswer(currentQuestion.id, answer);
    
    // Show rationale after answering
    setShowRationale({
      ...showRationale,
      [currentQuestion.id]: true
    });
  };
  
  const checkAnswer = (questionId: number, answer: string | string[]) => {
    const question = questions.find((q: Question) => q.id === questionId);
    if (!question) return;
    
    let isCorrect = false;
    
    if (Array.isArray(question.correctAnswer) && Array.isArray(answer)) {
      // For select all that apply questions
      isCorrect = 
        answer.length === question.correctAnswer.length && 
        answer.every(a => question.correctAnswer.includes(a));
    } else if (!Array.isArray(question.correctAnswer) && !Array.isArray(answer)) {
      // For multiple choice and fill in blank questions
      isCorrect = answer === question.correctAnswer;
    }
    
    // Update answer correctness state
    setAnswerCorrectness({
      ...answerCorrectness,
      [questionId]: isCorrect
    });
    
    // Track incorrect answers for review
    if (!isCorrect && !incorrectAnswers.includes(questionId)) {
      setIncorrectAnswers([...incorrectAnswers, questionId]);
    } else if (isCorrect && incorrectAnswers.includes(questionId)) {
      setIncorrectAnswers(incorrectAnswers.filter(id => id !== questionId));
    }
    
    // Update badge progress
    const timeSpent = (Date.now() - questionStartTime) / 1000 / 60; // in minutes
    const isFlagged = flaggedQuestions.includes(questionId);
    updateAfterQuestionAnswered(question, isCorrect, timeSpent, isFlagged);
    
    // Reset timer for next question
    setQuestionStartTime(Date.now());
  };

  const toggleFlagQuestion = () => {
    const questionId = currentQuestion.id;
    
    if (flaggedQuestions.includes(questionId)) {
      setFlaggedQuestions(flaggedQuestions.filter(id => id !== questionId));
    } else {
      setFlaggedQuestions([...flaggedQuestions, questionId]);
    }
  };

  const calculateProgress = () => {
    const answeredCount = Object.keys(userAnswers).length;
    return (answeredCount / totalQuestions) * 100;
  };

  const isQuestionAnswered = (questionId: number) => {
    return userAnswers[questionId] !== undefined;
  };

  const isQuestionFlagged = (questionId: number) => {
    return flaggedQuestions.includes(questionId);
  };

  const goToQuestion = (index: number) => {
    // When jumping to a question from the list, ensure rationale is shown if answered
    const question = questions[index];
    if (question) {
      const questionId = question.id;
      // If the question has been answered, make sure the rationale is shown
      if (userAnswers[questionId] !== undefined) {
        setShowRationale({
          ...showRationale,
          [questionId]: true
        });
      }
    }
    setCurrentQuestionIndex(index);
  };
  
  const handleSubmitExam = () => {
    // Only allow submission if all questions are answered
    if (Object.keys(userAnswers).length !== totalQuestions) {
      toast({
        title: "Incomplete Exam",
        description: "Please answer all questions before submitting the exam.",
        variant: "destructive"
      });
      return;
    }
    
    // Show loading animation
    setIsSubmitting(true);
    
    // Simulate processing time for the submission
    setTimeout(() => {
      // Calculate score
      const correctCount = Object.entries(answerCorrectness).filter(([_, isCorrect]) => isCorrect).length;
      const isPerfectScore = correctCount === totalQuestions;
      
      // Update badges and progress
      updateAfterTestCompleted(correctCount, totalQuestions, isPerfectScore);
      
      // Set test as submitted
      setTestSubmitted(true);
      setIsSubmitting(false);
      
      toast({
        title: "Exam Submitted Successfully",
        description: `You scored ${correctCount} out of ${totalQuestions} questions correctly.`,
        variant: "default"
      });
    }, 3000); // 3 second delay to show the loading animation
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-300">
        <h3 className="font-bold mb-2">Error Loading Questions</h3>
        <p>There was a problem loading the exam questions.</p>
        <button 
          onClick={onBack}
          className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded font-medium hover:bg-red-200"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }
  
  // Show loading screen when initially loading test data
  if (isLoading && questions.length === 0) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <LoadingScreen text="Preparing your NCLEX practice exam..." />
          
          <div className="mt-8 space-y-3">
            <div className="bg-gray-100 p-3 rounded-md flex items-center animate-pulse">
              <div className="w-6 h-6 rounded-full bg-[#4B9CD3] mr-3 flex items-center justify-center text-white">
                1
              </div>
              <div className="text-gray-600">Loading exam questions...</div>
            </div>
            <div className="bg-gray-100 p-3 rounded-md flex items-center animate-pulse">
              <div className="w-6 h-6 rounded-full bg-[#4B9CD3] mr-3 flex items-center justify-center text-white">
                2
              </div>
              <div className="text-gray-600">Preparing test environment...</div>
            </div>
            <div className="bg-gray-100 p-3 rounded-md flex items-center animate-pulse">
              <div className="w-6 h-6 rounded-full bg-[#4B9CD3] mr-3 flex items-center justify-center text-white">
                3
              </div>
              <div className="text-gray-600">Setting up learning analytics...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* NCLEX-style header with tools */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-md mb-4">
        <div className="flex justify-between items-center bg-[#f3f4f6] p-2 border-b border-gray-200">
          <div className="flex items-center">
            <button 
              className="p-2 text-gray-600 hover:bg-gray-200 rounded-md"
              title="Full Screen Mode"
            >
              <Maximize className="h-5 w-5" />
            </button>
            <div className="mx-2 h-6 border-r border-gray-300"></div>
            <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-md" title="Test Settings">
              <Menu className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center border border-gray-300 rounded bg-white py-1 px-3 text-sm">
              <span className="text-gray-500 mr-2">Questions Answered:</span>
              <span className="font-semibold">{Object.keys(userAnswers).length}/{totalQuestions}</span>
            </div>
            <div className="flex items-center border border-gray-300 rounded bg-white py-1 px-3 text-sm">
              <Clock className="h-4 w-4 mr-1 text-gray-500" />
              <span className="font-mono">{timer}</span>
            </div>
            <button 
              onClick={onBack}
              className="border border-red-300 text-red-600 hover:bg-red-50 py-1 px-3 rounded flex items-center text-sm"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Exit
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h2 className="font-bold text-lg text-[#13294B]">NCLEX-RN: {test.title}</h2>
            <div className="text-sm text-gray-500 flex items-center mt-1">
              <User className="h-4 w-4 mr-1" />
              <span>NURS'TD Practice Exam</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              className={`p-2 rounded-full border ${isQuestionFlagged(currentQuestion?.id) ? 'bg-amber-50 border-amber-300 text-amber-600' : 'border-gray-300 hover:bg-gray-100 text-gray-600'}`} 
              onClick={toggleFlagQuestion}
              title="Flag for Review"
            >
              <Flag className="h-5 w-5" />
            </button>
            <button 
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 text-gray-600"
              onClick={() => setShowReviewMode(true)}
              title="Review Flashcards"
            >
              <BookOpen className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 text-gray-600" title="Calculator">
              <Calculator className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 text-gray-600" title="Help">
              <HelpCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Exam Content Container with improved layout */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {/* Left side: Question navigator */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg border-2 border-gray-200 shadow-md overflow-hidden sticky top-4">
            <div className="bg-[#13294B] text-white p-3 flex justify-between items-center">
              <h3 className="font-medium">Question Navigator</h3>
              <span className="text-sm bg-[#4B9CD3] py-1 px-2 rounded">
                {currentQuestionIndex + 1} of {totalQuestions}
              </span>
            </div>
            
            {/* Progress indicator */}
            <div className="px-4 pt-4 pb-2">
              <div className="mb-1 flex items-center justify-between text-sm">
                <span>Completion Progress</span>
                <span className="font-medium">{Math.round(calculateProgress())}%</span>
              </div>
              <Progress value={calculateProgress()} className="h-2" />
            </div>
            
            {/* Question list tabs */}
            <div className="p-3 border-b border-gray-200">
              <div className="flex p-1 bg-gray-100 rounded-md">
                <button 
                  className={`flex-1 py-1.5 px-2 text-sm font-medium rounded ${!showFlaggedOnly ? 'bg-white shadow text-[#13294B]' : 'text-gray-600'}`}
                  onClick={() => setShowFlaggedOnly(false)}
                >
                  All Questions
                </button>
                <button 
                  className={`flex-1 py-1.5 px-2 text-sm font-medium rounded flex items-center justify-center ${showFlaggedOnly ? 'bg-white shadow text-[#13294B]' : 'text-gray-600'}`}
                  onClick={() => setShowFlaggedOnly(true)}
                >
                  <Flag className="h-3.5 w-3.5 mr-1" />
                  Flagged
                </button>
              </div>
            </div>
            
            {/* Question grid with color-coded status */}
            <div className="max-h-[400px] overflow-y-auto p-3">
              <div className="grid grid-cols-5 gap-1.5">
                {questions.map((question: Question, index: number) => {
                  if (showFlaggedOnly && !isQuestionFlagged(question.id)) {
                    return null;
                  }
                  
                  // Determine button style based on status
                  let buttonStyle = "flex items-center justify-center h-9 w-full rounded font-medium text-sm";
                  let textContent = (index + 1).toString();
                  let icon = null;
                  
                  if (currentQuestionIndex === index) {
                    // Current question
                    buttonStyle += " bg-[#13294B] text-white";
                  } else if (isQuestionAnswered(question.id)) {
                    if (answerCorrectness[question.id]) {
                      // Answered correctly
                      buttonStyle += " bg-green-600 text-white";
                      icon = <Check className="h-3 w-3" />;
                    } else {
                      // Answered incorrectly
                      buttonStyle += " bg-red-500 text-white";
                      icon = <X className="h-3 w-3" />;
                    }
                  } else if (isQuestionFlagged(question.id)) {
                    // Flagged but not answered
                    buttonStyle += " bg-amber-100 border border-amber-300 text-[#13294B]";
                    icon = <Flag className="h-3 w-3" />;
                  } else {
                    // Not answered or flagged
                    buttonStyle += " bg-gray-100 border border-gray-300 hover:bg-gray-200 text-gray-700";
                  }
                  
                  return (
                    <button
                      key={question.id}
                      className={buttonStyle}
                      onClick={() => goToQuestion(index)}
                    >
                      {icon ? (
                        <div className="flex items-center">
                          <span className="mr-1">{textContent}</span>
                          {icon}
                        </div>
                      ) : textContent}
                    </button>
                  );
                })}
              </div>
              
              {/* Legend */}
              <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500 space-y-1.5">
                <div className="flex items-center">
                  <div className="h-4 w-4 bg-[#13294B] rounded mr-2"></div>
                  <span>Current Question</span>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 bg-gray-100 border border-gray-300 rounded mr-2"></div>
                  <span>Unanswered</span>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 bg-amber-100 border border-amber-300 rounded mr-2"></div>
                  <span>Flagged for Review</span>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 bg-green-600 rounded mr-2"></div>
                  <span>Answered Correctly</span>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 bg-red-500 rounded mr-2"></div>
                  <span>Answered Incorrectly</span>
                </div>
              </div>
            </div>
            
            {/* Submit exam button */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <button 
                className={`w-full py-2.5 px-4 rounded font-medium transition-colors flex items-center justify-center ${
                  Object.keys(userAnswers).length === totalQuestions
                    ? "bg-green-600 hover:bg-green-700 text-white" 
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
                disabled={Object.keys(userAnswers).length !== totalQuestions || isSubmitting}
                onClick={handleSubmitExam}
              >
                {isSubmitting ? (
                  <>
                    <MedicalSpinner type="pulse" size="sm" color="white" />
                    <span className="ml-2">Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckSquare className="mr-2 h-4 w-4" />
                    Submit Exam
                  </>
                )}
              </button>
              
              <div className="mt-3 text-center">
                <button className="text-xs text-[#4B9CD3] hover:underline">
                  Pause Exam
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side: Question Content */}
        <div className="md:col-span-5">
          <div className="bg-white rounded-lg border-2 border-gray-200 shadow-md overflow-hidden">
            {/* Question Content */}
            <div className="p-6 border-b border-gray-200 min-h-[500px]">
              {isLoading || !currentQuestion ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <QuestionLoader />
                </motion.div>
              ) : (
                <QuestionRenderer 
                  question={currentQuestion}
                  onAnswer={handleAnswerSubmit}
                  userAnswer={userAnswers[currentQuestion.id]}
                  showRationale={showRationale[currentQuestion.id] || false}
                  isCorrect={answerCorrectness[currentQuestion.id] || false}
                  hideSubmitButton={true} // Hide submit button since we have it in the test view
                />
              )}
            </div>
            
            {/* Question Navigation - Improved professional style */}
            <div className="bg-[#f3f4f6] p-4 border-t border-gray-200 flex justify-between items-center">
              <div className="flex items-center">
                <button 
                  className={`py-2.5 px-5 rounded-md flex items-center transition-colors ${
                    currentQuestionIndex === 0 
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                      : 'bg-[#13294B] text-white hover:bg-[#0A1E3A]'
                  }`}
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  <ChevronLeft className="mr-1.5 h-4 w-4" />
                  Previous
                </button>
                
                {/* Extra button for marking for review */}
                <button 
                  className={`ml-2 py-2.5 px-4 rounded-md flex items-center ${
                    isQuestionFlagged(currentQuestion?.id)
                      ? 'bg-amber-100 border border-amber-300 text-amber-700 hover:bg-amber-200'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={toggleFlagQuestion}
                >
                  <Flag className="mr-1.5 h-4 w-4" />
                  {isQuestionFlagged(currentQuestion?.id) ? 'Flagged' : 'Flag for Review'}
                </button>
              </div>
              
              <div className="hidden md:flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <button className="p-1.5 rounded-full border border-gray-300 bg-white hover:bg-gray-100 text-gray-600">
                    <Smile className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 rounded-full border border-gray-300 bg-white hover:bg-gray-100 text-gray-600">
                    <Meh className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 rounded-full border border-gray-300 bg-white hover:bg-gray-100 text-gray-600">
                    <Frown className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <button 
                className={`py-2.5 px-5 rounded-md flex items-center ${
                  currentQuestionIndex === totalQuestions - 1 
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-[#4B9CD3] hover:bg-[#3d7eaa] text-white'
                }`}
                onClick={goToNextQuestion}
              >
                {currentQuestionIndex === totalQuestions - 1 ? 'Finish' : 'Next'}
                <ChevronRight className="ml-1.5 h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Mobile-only answer status and submit */}
          <div className="mt-4 md:hidden space-y-3">
            <div className="bg-white rounded-lg border-2 border-gray-200 p-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-blue-50 border border-blue-200 rounded p-2">
                  <div className="text-xs text-blue-500 mb-1">Answered</div>
                  <div className="font-bold text-blue-700">{Object.keys(userAnswers).length}/{totalQuestions}</div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded p-2">
                  <div className="text-xs text-amber-500 mb-1">Flagged</div>
                  <div className="font-bold text-amber-700">{flaggedQuestions.length}</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded p-2">
                  <div className="text-xs text-green-500 mb-1">Correct</div>
                  <div className="font-bold text-green-700">{Object.values(answerCorrectness).filter(Boolean).length}</div>
                </div>
              </div>
              
              {/* Mobile submit button */}
              <div className="mt-3">
                <button 
                  className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors flex items-center justify-center ${
                    Object.keys(userAnswers).length === totalQuestions
                      ? "bg-green-600 hover:bg-green-700" 
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  disabled={Object.keys(userAnswers).length !== totalQuestions || isSubmitting}
                  onClick={handleSubmitExam}
                >
                  {isSubmitting ? (
                    <>
                      <MedicalSpinner type="pulse" size="sm" color="white" />
                      <span className="ml-2">Processing...</span>
                    </>
                  ) : (
                    <>
                      <CheckSquare className="mr-2 h-4 w-4" />
                      Submit Exam
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Exam Instructions - Desktop Footer */}
      <div className="bg-white rounded-lg shadow-md p-4 mt-4 text-sm border-l-4 border-[#4B9CD3] hidden md:block">
        <p className="text-gray-700">
          <span className="font-medium">Instructions:</span> Read each question carefully before selecting an answer. 
          You can flag questions to review later, and your progress is automatically saved.
          Use the navigation buttons or question list to move between questions.
        </p>
      </div>
      
      {/* Flashcard Review Mode */}
      {showReviewMode && questions.length > 0 && (
        <FlashcardReview 
          questions={questions} 
          onClose={() => setShowReviewMode(false)} 
        />
      )}
      
      {/* Submit Loading Overlay */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md">
              <div className="flex flex-col items-center">
                <MedicalSpinner type="heartbeat" size="lg" color="#13294B" />
                <h3 className="mt-6 text-xl font-bold text-[#13294B]">Submitting Your Exam</h3>
                <p className="mt-3 text-gray-600 text-center">
                  Your answers are being processed and your performance is being analyzed.
                </p>
                
                <div className="w-full mt-8 space-y-3">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-[#4B9CD3] mr-3 flex items-center justify-center text-white text-xs">
                      <Check className="h-3 w-3" />
                    </div>
                    <div className="text-sm">Calculating score...</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-gray-200 mr-3 flex items-center justify-center text-white text-xs">
                      <span className="animate-pulse">2</span>
                    </div>
                    <div className="text-sm">Analyzing performance...</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-gray-200 mr-3 flex items-center justify-center text-white text-xs">
                      <span className="animate-pulse">3</span>
                    </div>
                    <div className="text-sm">Generating results...</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}