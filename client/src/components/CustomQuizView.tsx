import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Question } from '../types/question';
import { QuestionTestView } from './QuestionTestView';
import { MedicalSpinner } from './ui/medical-spinner';

export function CustomQuizView() {
  const [quizData, setQuizData] = useState<{ questions: Question[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  // Load quiz data from sessionStorage when component mounts
  useEffect(() => {
    try {
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
    } catch (error) {
      console.error('Error loading custom quiz:', error);
      setError('Failed to load quiz data. Please generate a new quiz.');
    }
  }, []);

  // Handle back button
  const handleBack = () => {
    setLocation('/case-studies');
  };

  // If there's an error, display it with a button to go back
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-[#4B9CD3] text-white rounded-md hover:bg-[#13294B] transition-colors"
          >
            Return to Quiz Generator
          </button>
        </div>
      </div>
    );
  }

  // If quiz data is not yet loaded, show a loading indicator
  if (!quizData) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          {/* Import the MedicalSpinner component for a more nursing-related loading animation */}
          <MedicalSpinner type="cardiogram" size="lg" text="Preparing your nursing quiz..." />
          
          <div className="mt-6 bg-gray-50 p-4 rounded-md shadow-sm border border-gray-100">
            <div className="text-sm text-gray-600 italic">
              Verifying question bank with {quizData?.questions?.length || '...'} questions
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Create a test object format for the QuestionTestView
  const customTest = {
    id: 0,
    title: 'Custom Quiz',
    path: '',
    description: 'Your custom generated quiz',
    questionCount: quizData.questions.length,
    timeLimit: null,
    category: null,
    createdAt: null,
    questionsData: { questions: quizData.questions }
  };

  // Render the QuestionTestView with the quiz data
  return <QuestionTestView test={customTest} onBack={handleBack} />;
}
