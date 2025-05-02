import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { fetchQuizQuestions } from '../utils/api';
import { QuestionsResponse } from '../types/question';
import { MedicalSpinner } from './ui/medical-spinner';

const questionCategories = [
  'All',
  'Fundamentals',
  'Medical-Surgical',
  'Pediatric',
  'Obstetric',
  'Mental Health',
  'Pharmacology',
  'Leadership'
];

export function QuizGenerator() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [questionCount, setQuestionCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  // Handle question count change
  const handleCountChange = (value: number[]) => {
    setQuestionCount(value[0]);
  };

  // Generate quiz
  const handleGenerateQuiz = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      // Fetch questions based on category and count
      const quizData = await fetchQuizQuestions(selectedCategory, questionCount);

      if (!quizData.questions || quizData.questions.length === 0) {
        setError('No questions found for the selected category. Please try a different category or count.');
        setIsGenerating(false);
        return;
      }

      // Store the quiz data in session storage for retrieval on the next page
      sessionStorage.setItem('customQuiz', JSON.stringify(quizData));

      // Navigate to a custom quiz page with the generated quiz
      setLocation('/custom-quiz');
    } catch (error) {
      console.error('Error generating quiz:', error);
      setError('Failed to generate quiz. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="quiz-generator-container">
      <div className="bg-white rounded-lg shadow-md p-6 border-2 border-[#e2e8f0]">
        <h2 className="text-2xl font-bold text-[#13294B] mb-6">Create Your Own Quiz</h2>
        
        <div className="mb-6">
          <Label htmlFor="category" className="block mb-2 font-medium">
            Select Category
          </Label>
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger id="category" className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {questionCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-8">
          <Label htmlFor="question-count" className="block mb-2 font-medium">
            Number of Questions: {questionCount}
          </Label>
          <Slider
            id="question-count"
            defaultValue={[10]}
            max={30}
            min={5}
            step={1}
            onValueChange={handleCountChange}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>5</span>
            <span>30</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {isGenerating ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            <MedicalSpinner type="nurse" size="md" text="Preparing your nursing questions..." />
            <div className="text-sm text-gray-500">
              Selecting {questionCount} questions about {selectedCategory !== 'All' ? selectedCategory : 'nursing topics'}
            </div>
          </div>
        ) : (
          <Button 
            onClick={handleGenerateQuiz} 
            disabled={isGenerating}
            className="w-full py-6 text-lg font-semibold bg-[#4B9CD3] hover:bg-[#13294B] text-white rounded-md transition-colors"
          >
            Generate Quiz
          </Button>
        )}
      </div>
    </div>
  );
}
