import React from "react";
import { Test, Question, QuestionsResponse } from "@shared/schema";
import { EnhancedExamView } from "./exam/EnhancedExamView";

interface QuestionTestViewProps {
  test: Test & { questionsData?: QuestionsResponse };
  onBack: () => void;
  onComplete?: (score: number, totalQuestions: number) => void;
  onBookmarkQuestion?: (question: Question) => void;
  bookmarkedQuestions?: number[];
}

export function QuestionTestView({ 
  test, 
  onBack, 
  onComplete,
  onBookmarkQuestion,
  bookmarkedQuestions = []
}: QuestionTestViewProps) {
  // Use the new enhanced exam interface that matches the screenshots
  return (
    <EnhancedExamView 
      test={test}
      onBack={onBack}
      onComplete={onComplete}
    />
  );
}
  
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
  const currentQuestion = questions[currentQuestionIndex] || null;
  const totalQuestions = questions.length;

  // Debug current state of showRationale when it changes
  useEffect(() => {
    if (currentQuestion) {
      console.log(`DEBUG - Current showRationale state for question ${currentQuestion.id}:`, showRationale);
      console.log(`DEBUG - Should show rationale for current question: ${showRationale[currentQuestion.id] || false}`);
    }
  }, [showRationale, currentQuestion]);
  
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
      if (nextQuestionId) {
        // If the question has been answered, show the rationale, otherwise hide it
        const showRationaleForNext = userAnswers[nextQuestionId] !== undefined;
        setShowRationale(prevState => ({
          ...prevState,
          [nextQuestionId]: showRationaleForNext
        }));
        console.log(`Going to next question ${nextQuestionId}, rationale shown:`, showRationaleForNext);
      }
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      // When going back to a previous question, show rationale if it was answered
      const prevQuestionId = questions[currentQuestionIndex - 1]?.id;
      if (prevQuestionId && userAnswers[prevQuestionId] !== undefined) {
        setShowRationale(prevState => ({
          ...prevState,
          [prevQuestionId]: true
        }));
        console.log(`Going to previous question ${prevQuestionId}, rationale shown:`, true);
      }
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Normalize a single answer or an array of answers
  const normalizeAnswer = (answer: string | string[]): string | string[] => {
    if (Array.isArray(answer)) {
      return answer.map(a => typeof a === 'string' ? normalizeAnswerString(a) : a);
    }
    return typeof answer === 'string' ? normalizeAnswerString(answer) : answer;
  };

  const handleAnswerSubmit = (answer: string | string[]) => {
    if (!currentQuestion) return;
    
    const questionId = currentQuestion.id;
    
    // Normalize the answer before storing it
    const normalizedAnswer = normalizeAnswer(answer);
    console.log(`handleAnswerSubmit for question ${questionId} with answer:`, answer);
    console.log(`Normalized answer:`, normalizedAnswer);
    
    // Store the normalized answer using functional update pattern
    setUserAnswers(prevAnswers => {
      const newAnswers = {
        ...prevAnswers,
        [questionId]: normalizedAnswer
      };
      console.log('Updated userAnswers:', newAnswers);
      return newAnswers;
    });
    
    // Check if the answer is correct with normalized answer
    checkAnswer(questionId, normalizedAnswer);
    
    // Force show rationale to true for this question
    console.log(`Setting showRationale[${questionId}] = true`);
    setShowRationale(prevState => {
      const newState = {
        ...prevState,
        [questionId]: true
      };
      console.log('New showRationale state:', newState);
      return newState;
    });
  };
  
  // Helper function to normalize answer strings (remove quotes if present)
  const normalizeAnswerString = (value: string): string => {
    // Handle nested quotes from JSON stringification (e.g., "\"A\"") 
    // First try to parse it as JSON if it looks like a JSON string
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith('\"') && value.endsWith('\"'))) {
      try {
        // Try to parse as JSON first - this handles cases like "\"A\""
        const parsed = JSON.parse(value);
        if (typeof parsed === 'string') {
          // If the result is still a string, it might have more quotes to remove
          return normalizeAnswerString(parsed); // Recursively normalize
        }
        return String(parsed);
      } catch (e) {
        // If parsing fails, just remove the outer quotes
        return value.substring(1, value.length - 1);
      }
    }
    // Return as is if no quotes
    return value;
  };
  
  const checkAnswer = (questionId: number, answer: string | string[]) => {
    const question = questions.find((q: Question) => q.id === questionId);
    if (!question) return;
    
    let isCorrect = false;
    
    // Handle different question types
    if (question.type === 'mc') {
      // For multiple choice, normalize both the user answer and correct answer
      // Handle the case when answer is a string or an array with a single element
      let normalizedUserAnswer = '';
      
      if (Array.isArray(answer) && answer.length === 1) {
        // If answer is an array with a single element, extract it
        normalizedUserAnswer = normalizeAnswerString(answer[0]);
      } else if (!Array.isArray(answer)) {
        // If answer is a string, normalize it directly
        normalizedUserAnswer = normalizeAnswerString(answer);
      }
      
      // Get the correct answer and normalize it
      let correctAnswer = '';
      if ('correctAnswer' in question) {
        correctAnswer = typeof question.correctAnswer === 'string' 
                        ? normalizeAnswerString(question.correctAnswer) 
                        : '';
      }
      
      console.log(`Question ${questionId} - MC comparison:`, {
        userAnswer: answer,
        normalizedUserAnswer,
        correctAnswer: question.correctAnswer,
        normalizedCorrectAnswer: correctAnswer
      });
      
      // Compare normalized values
      isCorrect = normalizedUserAnswer === correctAnswer;
    } else if (question.type === 'fill_in_blank') {
      if ('correctAnswer' in question) {
        // Handle both string and array cases
        let normalizedUserAnswer = '';
        
        if (Array.isArray(answer) && answer.length === 1) {
          // If the answer is an array with a single element, extract it
          normalizedUserAnswer = normalizeAnswerString(answer[0]);
        } else if (!Array.isArray(answer)) {
          // If the answer is a string, normalize it directly
          normalizedUserAnswer = normalizeAnswerString(answer);
        }
        
        // Normalize correct answer
        let correctAnswer = '';
        if (typeof question.correctAnswer === 'string') {
          correctAnswer = normalizeAnswerString(question.correctAnswer);
        } else if (Array.isArray(question.correctAnswer) && question.correctAnswer.length === 1) {
          correctAnswer = normalizeAnswerString(question.correctAnswer[0]);
        }
        
        console.log(`Question ${questionId} - Fill-in-blank comparison:`, {
          userAnswer: answer,
          normalizedUserAnswer,
          correctAnswer: question.correctAnswer,
          normalizedCorrectAnswer: correctAnswer
        });
        
        isCorrect = normalizedUserAnswer === correctAnswer;
      }
    } else if (question.type === 'sata') {
      if (Array.isArray(answer) && 'correctAnswer' in question && Array.isArray(question.correctAnswer)) {
        // For SATA, normalize each answer in both arrays
        const normalizedUserAnswers = answer.map(normalizeAnswerString);
        const normalizedCorrectAnswers = question.correctAnswer.map(normalizeAnswerString);
        
        isCorrect = 
          normalizedUserAnswers.length === normalizedCorrectAnswers.length && 
          normalizedUserAnswers.every(a => normalizedCorrectAnswers.includes(a));
      }
    } else if (question.type === 'hotspot') {
      // For hotspot questions, compare the selected areas with correct areas
      if (Array.isArray(answer) && 'correctAreas' in question && question.correctAreas.length > 0) {
        const correctAreaIds = question.correctAreas.map(area => area.id);
        // Check if the user selected all correct areas and no incorrect areas
        isCorrect = answer.length === correctAreaIds.length && 
                   answer.every(selected => correctAreaIds.includes(selected as string));
      }
    } else if (question.type === 'ordered-response') {
      // For ordered response questions
      if (Array.isArray(answer) && 'correctOrder' in question && Array.isArray(question.correctOrder)) {
        // Normalize all items in both arrays
        const normalizedUserOrder = answer.map(normalizeAnswerString);
        const normalizedCorrectOrder = question.correctOrder.map(normalizeAnswerString);
        
        isCorrect = JSON.stringify(normalizedUserOrder) === JSON.stringify(normalizedCorrectOrder);
      }
    } else if (question.type === 'chart-exhibit') {
      // For chart exhibit questions with nested sub-questions
      if ('questions' in question && Array.isArray(question.questions) && question.questions.length > 0) {
        // In the actual app, chart-exhibit would have multiple sub-questions
        // For now, we'll check the first sub-question as it's the only one we're showing
        const subQuestion = question.questions[0];
        if (subQuestion && 'correctAnswer' in subQuestion) {
          // Check if the answer is correct based on the first sub-question
          if (Array.isArray(subQuestion.correctAnswer) && Array.isArray(answer)) {
            // Handle multi-select sub-questions - normalize all values
            const normalizedUserAnswers = answer.map(normalizeAnswerString);
            const normalizedCorrectAnswers = subQuestion.correctAnswer.map(normalizeAnswerString);
            
            isCorrect = normalizedUserAnswers.length === normalizedCorrectAnswers.length && 
                       normalizedUserAnswers.every(a => normalizedCorrectAnswers.includes(a));
          } else if (!Array.isArray(subQuestion.correctAnswer) && !Array.isArray(answer)) {
            // Handle single-select sub-questions - normalize both values
            const normalizedUserAnswer = normalizeAnswerString(answer);
            const normalizedCorrectAnswer = typeof subQuestion.correctAnswer === 'string' 
                                          ? normalizeAnswerString(subQuestion.correctAnswer) 
                                          : '';
                                          
            isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;
          }
        }
      }
    }
    
    // Update answer correctness state using functional update for consistency
    setAnswerCorrectness(prevState => ({
      ...prevState,
      [questionId]: isCorrect
    }));
    
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
    if (!currentQuestion) return;
    
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
        setShowRationale(prevState => ({
          ...prevState,
          [questionId]: true
        }));
        console.log(`Going to question ${questionId}, rationale shown:`, true);
      }
    }
    setCurrentQuestionIndex(index);
  };
  
  // Handle bookmarking the current question
  const handleBookmarkQuestion = () => {
    if (!currentQuestion || !onBookmarkQuestion) return;
    
    onBookmarkQuestion(currentQuestion);
  };
  
  // Check if current question is bookmarked
  const isQuestionBookmarked = (questionId: number) => {
    return bookmarkedQuestions.includes(questionId);
  };
  
  const handleSubmitExam = () => {
    // Get all answered questions
    const answeredCount = Object.keys(userAnswers).length;
    
    // Show a warning if not all questions are answered, but still allow submission
    if (answeredCount < totalQuestions) {
      const unansweredCount = totalQuestions - answeredCount;
      
      // Show a confirmation dialog
      if (!window.confirm(`You have ${unansweredCount} unanswered question(s). Are you sure you want to submit the exam?`)) {
        return; // User canceled submission
      }
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
      
      // Set test as submitted to show the review screen
      setTestSubmitted(true);
      setIsSubmitting(false);
      
      // Call onComplete callback if provided
      if (onComplete) {
        onComplete(correctCount, totalQuestions);
      }
      
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
  
  // Show review screen if the test is submitted
  if (testSubmitted) {
    const correctCount = Object.entries(answerCorrectness).filter(([_, isCorrect]) => isCorrect).length;
    
    return (
      <ExamReviewScreen 
        score={correctCount}
        totalQuestions={totalQuestions}
        questions={questions}
        userAnswers={userAnswers}
        answerCorrectness={answerCorrectness}
        timeTaken={timer}
        onBack={onBack}
        onRetakeExam={() => {
          // Reset all states to start the exam again
          setUserAnswers({});
          setShowRationale({});
          setAnswerCorrectness({});
          setCurrentQuestionIndex(0);
          setFlaggedQuestions([]);
          setTestSubmitted(false);
          setTimer("02:00:00");
        }}
      />
    );
  }

  // Show loading screen when initially loading test data
  if (isLoading && questions.length === 0) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <LoadingScreen text="Preparing your NCLEX practice exam..." spinnerType="iv-drip" />
          
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
              <div className="text-gray-600">Setting up medical knowledge base...</div>
            </div>
            <div className="bg-gray-100 p-3 rounded-md flex items-center animate-pulse">
              <div className="w-6 h-6 rounded-full bg-[#4B9CD3] mr-3 flex items-center justify-center text-white">
                4
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
              Exit Exam
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
              className={`p-2 rounded-full border ${currentQuestion && isQuestionFlagged(currentQuestion.id) ? 'bg-amber-50 border-amber-300 text-amber-600' : 'border-gray-300 hover:bg-gray-100 text-gray-600'}`} 
              onClick={toggleFlagQuestion}
              title="Flag for Review"
              aria-label="Flag this question for review"
            >
              <Flag className="h-5 w-5" aria-hidden="true" />
            </button>
            {onBookmarkQuestion && currentQuestion && (
              <button 
                className={`p-2 rounded-full border ${currentQuestion && isQuestionBookmarked(currentQuestion.id) ? 'bg-blue-50 border-blue-300 text-blue-600' : 'border-gray-300 hover:bg-gray-100 text-gray-600'}`}
                onClick={handleBookmarkQuestion}
                title={isQuestionBookmarked(currentQuestion.id) ? "Remove Bookmark" : "Bookmark Question"}
                aria-label={isQuestionBookmarked(currentQuestion.id) ? "Remove this question from bookmarks" : "Bookmark this question for later reference"}
              >
                {isQuestionBookmarked(currentQuestion.id) ? (
                  <BookmarkCheck className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Bookmark className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            )}
            <button 
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 text-gray-600"
              onClick={() => setShowReviewMode(true)}
              title="Review Flashcards"
              aria-label="Open flashcard review"
            >
              <BookOpen className="h-5 w-5" aria-hidden="true" />
            </button>
            <button 
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 text-gray-600" 
              title="Calculator"
              aria-label="Open calculator"
            >
              <Calculator className="h-5 w-5" aria-hidden="true" />
            </button>
            <button 
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 text-gray-600" 
              title="Help"
              aria-label="Show help information"
            >
              <HelpCircle className="h-5 w-5" aria-hidden="true" />
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
                  let ariaLabel = `Question ${index + 1}`;
                  let status = '';
                  
                  if (currentQuestionIndex === index) {
                    // Current question
                    buttonStyle += " bg-[#13294B] text-white";
                    status = 'current';
                    ariaLabel += ' (current question)';
                  } else if (isQuestionAnswered(question.id)) {
                    if (answerCorrectness[question.id]) {
                      // Answered correctly
                      buttonStyle += " bg-green-600 text-white";
                      icon = <Check className="h-3 w-3" aria-hidden="true" />;
                      status = 'answered correctly';
                      ariaLabel += ' (answered correctly)';
                    } else {
                      // Answered incorrectly
                      buttonStyle += " bg-red-500 text-white";
                      icon = <X className="h-3 w-3" aria-hidden="true" />;
                      status = 'answered incorrectly';
                      ariaLabel += ' (answered incorrectly)';
                    }
                  } else if (isQuestionFlagged(question.id)) {
                    // Flagged but not answered
                    buttonStyle += " bg-amber-100 border border-amber-300 text-[#13294B]";
                    icon = <Flag className="h-3 w-3" aria-hidden="true" />;
                    status = 'flagged';
                    ariaLabel += ' (flagged for review)';
                  } else {
                    // Not answered or flagged
                    buttonStyle += " bg-gray-100 border border-gray-300 hover:bg-gray-200 text-gray-700";
                    status = 'unanswered';
                  }
                  
                  return (
                    <button
                      key={`question-${question.id}-${index}`}
                      className={buttonStyle}
                      onClick={() => goToQuestion(index)}
                      aria-label={ariaLabel}
                      aria-current={currentQuestionIndex === index ? "true" : "false"}
                      data-status={status}
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
            
            {/* Submit exam button - Desktop only */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 hidden md:block">
              <button 
                className={`w-full py-2.5 px-4 rounded font-medium transition-colors flex items-center justify-center ${
                  Object.keys(userAnswers).length > 0
                    ? "bg-green-600 hover:bg-green-700 text-white" 
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
                disabled={Object.keys(userAnswers).length === 0 || isSubmitting}
                onClick={handleSubmitExam}
                aria-label={
                  Object.keys(userAnswers).length === totalQuestions 
                    ? "Submit exam for grading" 
                    : "Submit exam with some unanswered questions"
                }
                aria-busy={isSubmitting ? "true" : "false"}
              >
                {isSubmitting ? (
                  <>
                    <MedicalSpinner type="pulse" size="sm" color="white" />
                    <span className="ml-2">Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckSquare className="mr-2 h-4 w-4" aria-hidden="true" />
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
                  isCorrect={answerCorrectness[currentQuestion.id] !== undefined ? answerCorrectness[currentQuestion.id] : false}
                  hideSubmitButton={true} // Hide submit button since we have it in the test view
                />
              )}
            </div>
            
            {/* Submit Answer Button - Only show if question hasn't been answered yet */}
            {currentQuestion && userAnswers[currentQuestion.id] === undefined && (
              <div className="px-6 pb-4 border-b border-gray-200">
                <button
                  onClick={() => {
                    if (!currentQuestion) return;
                    
                    // This will store the answer we need to submit
                    let answer: string | string[] | null = null;
                    
                    // Handle different question types
                    if (currentQuestion.type === 'mc') {
                      // Find any selected choice on the current question
                      const selectedElement = document.querySelector('.multiple-choice-container .bg-blue-50');
                      if (selectedElement) {
                        const choiceId = selectedElement.getAttribute('data-choice-id');
                        if (choiceId) {
                          answer = choiceId;
                          console.log('Submitting MC answer:', answer);
                        }
                      }
                    } else if (currentQuestion.type === 'sata') {
                      // For select-all-that-apply, find all selected choices
                      const selectedElements = document.querySelectorAll('.select-all-container .bg-blue-50');
                      if (selectedElements.length > 0) {
                        const choiceIds: string[] = [];
                        selectedElements.forEach(element => {
                          const choiceId = element.getAttribute('data-choice-id');
                          if (choiceId) choiceIds.push(choiceId);
                        });
                        answer = choiceIds;
                        console.log('Submitting SATA answer:', answer);
                      }
                    } else if (currentQuestion.type === 'fill_in_blank') {
                      // For fill-in-blank, get text from the input
                      const inputElement = document.querySelector('.fill-in-blank-container input') as HTMLInputElement;
                      if (inputElement && inputElement.value.trim() !== '') {
                        answer = inputElement.value.trim();
                        console.log('Submitting fill-in-blank answer:', answer);
                      }
                    } else if (currentQuestion.type === 'ordered-response') {
                      // For ordered response, get the current order
                      // (this is handled directly by the component, so we don't need to do anything here)
                      console.log('Ordered response answers are submitted automatically.');
                      return;
                    } else if (currentQuestion.type === 'hotspot') {
                      // For hotspot, get selected areas
                      const selectedAreas = document.querySelectorAll('.hotspot-container .hotspot-area.selected');
                      if (selectedAreas.length > 0) {
                        const areaIds: string[] = [];
                        selectedAreas.forEach(area => {
                          const areaId = area.getAttribute('data-area-id');
                          if (areaId) areaIds.push(areaId);
                        });
                        answer = areaIds;
                        console.log('Submitting hotspot answer:', answer);
                      }
                    }
                    
                    // If we have an answer, submit it
                    if (answer !== null) {
                      // Add delay to ensure DOM updates have been processed
                      setTimeout(() => {
                        handleAnswerSubmit(answer as string | string[]);
                      }, 50);
                    } else {
                      // No answer selected
                      console.log('No answer selected');
                      toast({
                        title: "No Answer Selected",
                        description: "Please select an answer before submitting.",
                        variant: "destructive"
                      });
                    }
                  }}
                  className="w-full py-3 px-6 bg-[#13294B] text-white rounded-md hover:bg-[#0A1E3A] transition-colors flex items-center justify-center"
                >
                  <span className="font-medium">Submit Answer</span>
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            )}
            
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
                  aria-label="Go to previous question"
                >
                  <ChevronLeft className="mr-1.5 h-4 w-4" aria-hidden="true" />
                  Previous
                </button>
                
                {/* Extra button for marking for review */}
                <button 
                  className={`ml-2 py-2.5 px-4 rounded-md flex items-center ${
                    currentQuestion && isQuestionFlagged(currentQuestion.id)
                      ? 'bg-amber-100 border border-amber-300 text-amber-700 hover:bg-amber-200'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={toggleFlagQuestion}
                  aria-pressed={currentQuestion && isQuestionFlagged(currentQuestion.id) ? "true" : "false"}
                  aria-label={currentQuestion && isQuestionFlagged(currentQuestion.id) ? "Unflag this question" : "Flag this question for review"}
                >
                  <Flag className="mr-1.5 h-4 w-4" aria-hidden="true" />
                  {currentQuestion && isQuestionFlagged(currentQuestion.id) ? 'Flagged' : 'Flag for Review'}
                </button>
              </div>
              
              <div className="hidden md:flex items-center space-x-2">
                <div className="flex items-center space-x-1" role="group" aria-label="Rate question difficulty">
                  <button 
                    className="p-1.5 rounded-full border border-gray-300 bg-white hover:bg-gray-100 text-gray-600"
                    aria-label="Rate as easy"
                    title="Easy"
                  >
                    <Smile className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button 
                    className="p-1.5 rounded-full border border-gray-300 bg-white hover:bg-gray-100 text-gray-600"
                    aria-label="Rate as moderate"
                    title="Moderate"
                  >
                    <Meh className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button 
                    className="p-1.5 rounded-full border border-gray-300 bg-white hover:bg-gray-100 text-gray-600"
                    aria-label="Rate as difficult"
                    title="Difficult"
                  >
                    <Frown className="h-4 w-4" aria-hidden="true" />
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
                aria-label={currentQuestionIndex === totalQuestions - 1 ? "Finish exam" : "Go to next question"}
              >
                {currentQuestionIndex === totalQuestions - 1 ? 'Finish' : 'Next'}
                <ChevronRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
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
                    Object.keys(userAnswers).length > 0
                      ? "bg-green-600 hover:bg-green-700" 
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  disabled={Object.keys(userAnswers).length === 0 || isSubmitting}
                  onClick={handleSubmitExam}
                  aria-label={
                    Object.keys(userAnswers).length === totalQuestions 
                      ? "Submit exam for grading" 
                      : "Submit exam with some unanswered questions"
                  }
                  aria-busy={isSubmitting ? "true" : "false"}
                >
                  {isSubmitting ? (
                    <>
                      <MedicalSpinner type="pulse" size="sm" color="white" />
                      <span className="ml-2">Processing...</span>
                    </>
                  ) : (
                    <>
                      <CheckSquare className="mr-2 h-4 w-4" aria-hidden="true" />
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
                <div aria-label="Loading indicator" role="status">
                  <MedicalSpinner type="heartbeat" size="lg" color="#13294B" aria-hidden="true" />
                  <span className="sr-only">Processing your exam submission</span>
                </div>
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