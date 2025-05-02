import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Question } from '../types/question';
import { QuestionTestView } from './QuestionTestView';
import { MedicalSpinner } from './ui/medical-spinner';
import { toast } from '@/hooks/use-toast';
import { BookmarkIcon, ClockIcon, RotateCwIcon } from 'lucide-react';
import { Button } from './ui/button';

// Define interface for bookmark data
interface BookmarkedQuestion {
  id: number;
  title: string;
  category?: string;
  timestamp: number;
}

export function CustomQuizView() {
  const [quizData, setQuizData] = useState<{ questions: Question[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const [timeLimit, setTimeLimit] = useState<number | null>(null);
  const [quizTitle, setQuizTitle] = useState<string>('Custom Quiz');
  const [quizDescription, setQuizDescription] = useState<string>('Your custom generated quiz');
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<BookmarkedQuestion[]>([]);

  // Load quiz data and options from sessionStorage when component mounts
  useEffect(() => {
    try {
      // Load quiz data
      const storedQuiz = sessionStorage.getItem('customQuiz');
      
      if (!storedQuiz) {
        setError('No quiz data found. Please generate a new quiz.');
        return;
      }

      const parsedQuiz = JSON.parse(storedQuiz);
      
      if (!parsedQuiz || !parsedQuiz.questions || !Array.isArray(parsedQuiz.questions) || parsedQuiz.questions.length === 0) {
        setError('Invalid quiz data. Please generate a new quiz.');
        return;
      }

      setQuizData(parsedQuiz);
      
      // Load time limit if available
      const storedTimeLimit = sessionStorage.getItem('quizTimeLimit');
      if (storedTimeLimit) {
        const parsedTimeLimit = parseInt(storedTimeLimit);
        if (!isNaN(parsedTimeLimit) && parsedTimeLimit > 0) {
          setTimeLimit(parsedTimeLimit);
          
          // Update description to include time limit
          const timeDescription = parsedTimeLimit === 60 ? '1 hour' : 
                                 parsedTimeLimit === 90 ? '1.5 hours' : 
                                 parsedTimeLimit === 120 ? '2 hours' : 
                                 `${parsedTimeLimit} minutes`;
          setQuizDescription(`Your custom generated quiz (${timeDescription} time limit)`);
        }
      }
      
      // Load bookmarks if available
      const storedBookmarks = localStorage.getItem('bookmarkedQuestions');
      if (storedBookmarks) {
        try {
          const parsedBookmarks = JSON.parse(storedBookmarks);
          if (Array.isArray(parsedBookmarks)) {
            setBookmarkedQuestions(parsedBookmarks);
          }
        } catch (e) {
          console.error('Failed to parse bookmarked questions:', e);
        }
      }
      
    } catch (error) {
      console.error('Error loading custom quiz:', error);
      setError('Failed to load quiz data. Please generate a new quiz.');
    }
  }, []);

  // Handle back button
  const handleBack = () => {
    setLocation('/exams-and-studies');
  };
  
  // Handle quiz completion - store results
  const handleQuizComplete = (score: number, totalQuestions: number) => {
    // Store quiz result in localStorage
    try {
      const timestamp = Date.now();
      const quizResult = {
        id: timestamp,
        title: quizTitle,
        score,
        totalQuestions,
        timestamp,
        categories: sessionStorage.getItem('quizCategories') || 'Custom Quiz'
      };
      
      // Get existing quiz history or initialize empty array
      const existingHistory = localStorage.getItem('quizHistory');
      const quizHistory = existingHistory ? JSON.parse(existingHistory) : [];
      
      // Add new result and save
      quizHistory.push(quizResult);
      localStorage.setItem('quizHistory', JSON.stringify(quizHistory));
      
      toast({
        title: "Quiz Results Saved",
        description: `Your score of ${score}/${totalQuestions} has been saved to your quiz history.`,
        duration: 5000,
      });
    } catch (error) {
      console.error('Error saving quiz results:', error);
    }
  };
  
  // Handle bookmarking questions
  const handleBookmarkQuestion = (question: Question) => {
    if (!question) return;
    
    try {
      const newBookmark: BookmarkedQuestion = {
        id: question.id,
        title: question.title || question.text.substring(0, 50) + "...",
        category: question.category,
        timestamp: Date.now()
      };
      
      // Check if already bookmarked
      const isAlreadyBookmarked = bookmarkedQuestions.some(bq => bq.id === question.id);
      
      if (isAlreadyBookmarked) {
        // Remove if already bookmarked
        const updatedBookmarks = bookmarkedQuestions.filter(bq => bq.id !== question.id);
        setBookmarkedQuestions(updatedBookmarks);
        localStorage.setItem('bookmarkedQuestions', JSON.stringify(updatedBookmarks));
        
        toast({
          title: "Question Removed from Bookmarks",
          description: "This question has been removed from your bookmarks.",
          duration: 3000,
        });
      } else {
        // Add to bookmarks
        const updatedBookmarks = [...bookmarkedQuestions, newBookmark];
        setBookmarkedQuestions(updatedBookmarks);
        localStorage.setItem('bookmarkedQuestions', JSON.stringify(updatedBookmarks));
        
        toast({
          title: "Question Bookmarked",
          description: "This question has been added to your bookmarks for future reference.",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error managing bookmarks:', error);
      toast({
        title: "Bookmark Error",
        description: "There was an error updating your bookmarks.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  // If there's an error, display it with a button to go back
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            onClick={handleBack}
            className="px-4 py-2 bg-[#4B9CD3] text-white rounded-md hover:bg-[#13294B] transition-colors"
          >
            Return to Quiz Generator
          </Button>
        </div>
      </div>
    );
  }

  // If quiz data is not yet loaded, show a loading indicator
  if (!quizData) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <MedicalSpinner type="cardiogram" size="lg" text="Preparing your nursing quiz..." />
          
          <div className="mt-6 bg-gray-50 p-4 rounded-md shadow-sm border border-gray-100">
            <div className="text-sm text-gray-600 italic">
              Verifying question bank with {quizData?.questions?.length || '...'} questions
            </div>
            {timeLimit && (
              <div className="flex items-center mt-2 text-sm text-gray-600 italic">
                <ClockIcon size={14} className="mr-1" />
                Time limit: {timeLimit === 60 ? '1 hour' : 
                  timeLimit === 90 ? '1.5 hours' : 
                  timeLimit === 120 ? '2 hours' : 
                  `${timeLimit} minutes`}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Create a test object format for the QuestionTestView
  const customTest = {
    id: 0,
    title: quizTitle,
    path: '',
    description: quizDescription,
    questionCount: quizData.questions.length,
    timeLimit: timeLimit,
    category: 'Custom',
    createdAt: new Date().toISOString(),
    questionsData: { questions: quizData.questions }
  };

  // Render the QuestionTestView with the quiz data
  return (
    <QuestionTestView 
      test={customTest} 
      onBack={handleBack}
      onComplete={handleQuizComplete}
      onBookmarkQuestion={handleBookmarkQuestion}
      bookmarkedQuestions={bookmarkedQuestions.map(bq => bq.id)}
    />
  );
}
