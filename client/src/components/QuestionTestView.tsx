import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Test, Question } from "@shared/schema";
import { fetchQuestions } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock, Flag, PanelLeftClose, HelpCircle, Save, ChevronLeft, ChevronRight, Check, Award } from "lucide-react";
import { QuestionRenderer } from "./QuestionRenderer";
import { useBadges } from "@/contexts/BadgeContext";
import { toast } from "@/hooks/use-toast";

interface QuestionTestViewProps {
  test: Test;
  onBack: () => void;
}

export function QuestionTestView({ test, onBack }: QuestionTestViewProps) {
  const { data: questionsData, isLoading, error } = useQuery({
    queryKey: ['/api/questions'],
    queryFn: fetchQuestions
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
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [showRationale, setShowRationale] = useState<Record<number, boolean>>({});
  const [answerCorrectness, setAnswerCorrectness] = useState<Record<number, boolean>>({});
  
  const questions = questionsData?.questions || [];
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
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
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
    const question = questions.find(q => q.id === questionId);
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
    setCurrentQuestionIndex(index);
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

  return (
    <div className="max-w-5xl mx-auto">
      {/* Professional Exam Header - Top Bar */}
      <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
        <div className="bg-[#13294B] text-white py-3 px-6 flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="flex items-center mb-3 md:mb-0">
            <h2 className="font-bold text-xl">NCLEX Exam: {test.title}</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-[#0A1E3A] py-2 px-4 rounded-md border border-[#4B9CD3]">
              <Clock className="h-5 w-5 mr-2 text-[#4B9CD3]" />
              <span className="font-mono font-bold">{timer}</span>
            </div>
            <button 
              onClick={onBack}
              className="bg-[#4B9CD3] hover:bg-[#3d7eaa] text-white py-2 px-4 rounded-md flex items-center transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="font-medium">Exit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Exam Content Container */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Left side: Question number & tools */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h3 className="font-bold text-[#13294B] text-lg border-b pb-2 mb-3">Question Navigator</h3>
            
            {/* Question number indicator */}
            <div className="bg-[#f3f4f6] p-3 rounded-md mb-3 text-center">
              <span className="block text-sm text-gray-500 mb-1">Question</span>
              <span className="text-3xl font-bold text-[#13294B]">{currentQuestionIndex + 1}</span>
              <span className="block text-sm text-gray-500 mt-1">of {totalQuestions}</span>
            </div>
            
            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{Math.round(calculateProgress())}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#4B9CD3]"
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="space-y-2">
              <button 
                className={`w-full py-2 px-3 flex items-center justify-between rounded border transition-colors ${
                  isQuestionFlagged(currentQuestion?.id) 
                    ? "border-[#4B9CD3] bg-[#4B9CD3]/10 text-[#13294B]"
                    : "border-gray-200 text-[#13294B] hover:bg-gray-50"
                }`}
                onClick={toggleFlagQuestion}
                disabled={isLoading || !currentQuestion}
              >
                <span className="font-medium">
                  {isQuestionFlagged(currentQuestion?.id) ? "Unflag Question" : "Flag Question"}
                </span>
                <Flag className={`h-4 w-4 ${isQuestionFlagged(currentQuestion?.id) ? "fill-[#4B9CD3] text-[#4B9CD3]" : ""}`} />
              </button>
              
              <div className="py-2">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">Question List</h4>
                  <div className="flex text-xs">
                    <button 
                      className={`px-2 py-1 rounded-l ${!showFlaggedOnly ? "bg-[#13294B] text-white" : "bg-gray-100"}`}
                      onClick={() => setShowFlaggedOnly(false)}
                    >
                      All
                    </button>
                    <button 
                      className={`px-2 py-1 rounded-r ${showFlaggedOnly ? "bg-[#13294B] text-white" : "bg-gray-100"}`}
                      onClick={() => setShowFlaggedOnly(true)}
                    >
                      Flagged
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-5 gap-1 max-h-48 overflow-y-auto p-1">
                  {questions.map((question, index) => {
                    if (showFlaggedOnly && !isQuestionFlagged(question.id)) {
                      return null;
                    }
                    
                    return (
                      <button
                        key={question.id}
                        className={`h-8 w-full flex items-center justify-center rounded text-sm font-medium ${
                          currentQuestionIndex === index
                            ? "bg-[#13294B] text-white"
                            : isQuestionAnswered(question.id)
                              ? "bg-[#4B9CD3]/80 text-white"
                              : isQuestionFlagged(question.id)
                                ? "bg-amber-100 border border-amber-300"
                                : "bg-gray-100 hover:bg-gray-200"
                        }`}
                        onClick={() => goToQuestion(index)}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          
          {/* Submit exam button */}
          <div className="bg-[#13294B] text-white rounded-lg shadow-md p-4 text-center hidden md:block">
            <p className="mb-3 text-sm">When you've completed all questions:</p>
            <button 
              className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                Object.keys(userAnswers).length === totalQuestions
                  ? "bg-[#4B9CD3] hover:bg-[#3d7eaa]" 
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={Object.keys(userAnswers).length !== totalQuestions}
            >
              Submit Exam
            </button>
          </div>
        </div>
        
        {/* Right side: Question Content */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Question Content */}
            <div className="p-6 border-b border-gray-200">
              {isLoading || !currentQuestion ? (
                <div className="space-y-6">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  
                  <div className="space-y-3 mt-8">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </div>
              ) : (
                <QuestionRenderer 
                  question={currentQuestion}
                  onAnswer={handleAnswerSubmit}
                  userAnswer={userAnswers[currentQuestion.id]}
                  showRationale={showRationale[currentQuestion.id] || false}
                  isCorrect={answerCorrectness[currentQuestion.id] || false}
                />
              )}
            </div>
            
            {/* Question Navigation - Professional Style */}
            <div className="bg-gray-50 p-4 flex justify-between items-center">
              <button 
                className={`bg-[#13294B] text-white py-2 px-6 rounded-md flex items-center transition-colors ${
                  currentQuestionIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#0A1E3A]"
                }`}
                onClick={goToPreviousQuestion}
                disabled={currentQuestionIndex === 0 || isLoading}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </button>
              <div className="text-sm text-gray-500 font-medium hidden md:block">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </div>
              <button 
                className={`bg-[#4B9CD3] text-white py-2 px-6 rounded-md transition-colors flex items-center ${
                  currentQuestionIndex === totalQuestions - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#3d7eaa]"
                }`}
                onClick={goToNextQuestion}
                disabled={currentQuestionIndex === totalQuestions - 1 || isLoading}
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Mobile submit button */}
          <div className="mt-4 md:hidden">
            <button 
              className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
                Object.keys(userAnswers).length === totalQuestions
                  ? "bg-[#4B9CD3] hover:bg-[#3d7eaa]" 
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={Object.keys(userAnswers).length !== totalQuestions}
            >
              Submit Exam
            </button>
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
    </div>
  );
}