import React, { useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { fetchTest } from '@/lib/api';
import { AdvancedExamView } from '@/components/exam/AdvancedExamView';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Clock, BarChart } from 'lucide-react';
import { Test } from '@shared/schema';

function AdvancedExamPageComponent() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/advanced-exam/:id');
  const testId = params?.id ? parseInt(params.id) : null;
  const [isCompleted, setIsCompleted] = useState(false);
  const [examResults, setExamResults] = useState<any>(null);
  
  // Fetch test data
  const { data: test, isLoading, error } = useQuery({
    queryKey: [`/api/tests/${testId}`],
    queryFn: () => fetchTest(testId as number),
    enabled: testId !== null
  });
  
  // Handle back button click
  const handleBack = () => {
    setLocation('/tests');
  };
  
  // Handle exam completion
  const handleExamComplete = (results: any) => {
    setExamResults(results);
    setIsCompleted(true);
    
    // Save results to local storage
    const historyKey = `exam_history_${testId}`;
    const existingHistory = localStorage.getItem(historyKey);
    const historyArray = existingHistory ? JSON.parse(existingHistory) : [];
    historyArray.push({
      ...results,
      testId,
      testTitle: test?.title || 'Unknown Test',
      timestamp: new Date().toISOString()
    });
    localStorage.setItem(historyKey, JSON.stringify(historyArray));
  };
  
  // Get study suggestions based on results
  const getStudySuggestions = () => {
    if (!examResults) return [];
    
    const weakCategories = Object.entries(examResults.categoryPerformance)
      .filter(([_, data]: [string, any]) => data.percentage < 70)
      .sort((a: [string, any], b: [string, any]) => a[1].percentage - b[1].percentage)
      .slice(0, 3)
      .map(([category]: [string, any]) => category);
    
    return weakCategories;
  };
  
  // Create exam session setup UI
  const renderExamSetup = () => {
    if (!test) return null;
    
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="mb-6 flex items-center text-gray-600"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Tests
        </Button>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-[#13294B] mb-2">{test.title}</h2>
            <p className="text-gray-600 mb-6">{test.description}</p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-6">
                <div className="bg-blue-50 p-3 rounded-full">
                  <BarChart className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Exam Features</h3>
                  <ul className="mt-2 text-sm text-gray-600 space-y-1">
                    <li>• Comprehensive NCLEX-style questions</li>
                    <li>• Detailed explanations and rationales</li>
                    <li>• Question marking and review</li>
                    <li>• Performance tracking by category</li>
                    <li>• Interactive exam tools (calculator, notes)</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex items-start space-x-6">
                <div className="bg-amber-50 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Exam Options</h3>
                  <div className="mt-3 space-y-4">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="adaptive-difficulty" 
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="adaptive-difficulty" className="ml-2 text-sm text-gray-700">
                        Enable adaptive difficulty
                      </label>
                    </div>
                    
                    <div>
                      <label htmlFor="time-limit" className="block text-sm text-gray-700 mb-1">
                        Time limit (minutes)
                      </label>
                      <select 
                        id="time-limit" 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="">No time limit</option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="90">1.5 hours</option>
                        <option value="120">2 hours</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <Button 
                onClick={() => setExamResults(null)}
                className="px-5 py-2 bg-[#13294B] text-white hover:bg-[#0c1c33]"
              >
                Begin Exam
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Create results component 
  const renderExamResults = () => {
    if (!examResults || !test) return null;
    
    const weakCategories = getStudySuggestions();
    const scorePercentage = Math.round((examResults.correctAnswers / examResults.totalQuestions) * 100);
    const isPassing = scorePercentage >= 65;
    
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="mb-6 flex items-center text-gray-600"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Tests
        </Button>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-[#13294B] mb-2">
              {test.title} - Exam Results
            </h2>
            
            <div className="mt-6 text-center">
              <div className="inline-flex items-center justify-center p-4 bg-gray-50 rounded-full mb-4">
                <div className={`text-5xl font-bold ${isPassing ? 'text-green-600' : 'text-red-600'}`}>
                  {scorePercentage}%
                </div>
              </div>
              
              <div className="text-lg font-medium mb-2">
                {isPassing ? 'Congratulations!' : 'Keep practicing!'}
              </div>
              
              <div className="text-gray-600">
                You answered {examResults.correctAnswers} out of {examResults.totalQuestions} questions correctly.
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Questions</span>
                    <span className="font-medium">{examResults.totalQuestions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Correct Answers</span>
                    <span className="font-medium text-green-600">{examResults.correctAnswers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Incorrect Answers</span>
                    <span className="font-medium text-red-600">{examResults.incorrectAnswers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Skipped Questions</span>
                    <span className="font-medium text-yellow-600">{examResults.skippedQuestions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Time Spent</span>
                    <span className="font-medium">
                      {Math.floor(examResults.timeSpent / 60)}:{(examResults.timeSpent % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Areas for Improvement
                </h3>
                {weakCategories.length > 0 ? (
                  <div className="space-y-3">
                    {weakCategories.map((category, index) => (
                      <div key={index} className="p-3 bg-red-50 rounded-md border border-red-100">
                        <div className="font-medium text-red-700">{category}</div>
                        <div className="text-sm text-red-600 mt-1">
                          {examResults.categoryPerformance[category].percentage}% accuracy
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-green-50 rounded-md border border-green-100">
                    <div className="font-medium text-green-700">Great job!</div>
                    <div className="text-sm text-green-600 mt-1">
                      You're performing well across all categories.
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Next Steps</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Review Incorrect Answers
                </Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Generate Study Plan
                </Button>
                <Button onClick={handleBack} className="bg-gray-600 hover:bg-gray-700">
                  Return to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-pulse h-16 w-16 mx-auto mb-4 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          <p className="text-lg font-medium">Loading exam...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error || !testId) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
          <h2 className="text-xl font-medium text-red-700 mb-2">Error Loading Exam</h2>
          <p className="text-red-600 mb-4">
            {error instanceof Error ? error.message : "Couldn't find the requested exam."}
          </p>
          <Button onClick={handleBack} className="bg-blue-600 hover:bg-blue-700">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  // If no test data
  if (!test) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-6 text-center">
          <h2 className="text-xl font-medium text-yellow-700 mb-2">Exam Not Found</h2>
          <p className="text-yellow-600 mb-4">
            The exam you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={handleBack} className="bg-blue-600 hover:bg-blue-700">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  // Add safety for TypeScript
  const testData = test as Test;
  
  // If results are available, show them
  if (isCompleted && examResults) {
    return renderExamResults();
  }
  
  // If we have exam data but no results yet, show setup/intro screen
  if (examResults === null) {
    return renderExamSetup();
  }
  
  // Otherwise show the exam
  return (
    <AdvancedExamView
      test={test}
      onBack={handleBack}
      onComplete={handleExamComplete}
      adaptiveDifficulty={true}
      timeLimit={90}
    />
  );
}

export default AdvancedExamPageComponent;