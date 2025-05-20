import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Test } from '@shared/schema';
import { AdvancedExamView } from './AdvancedExamView';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Clock, BarChart3, BrainCircuit, Timer, Flag, BarChart } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';

interface ExamDashboardProps {
  testId?: number;
  onBack?: () => void;
}

interface ExamConfig {
  adaptiveDifficulty: boolean;
  timeLimit: number | null;
  showAllQuestions: boolean;
  allowReview: boolean;
}

interface ExamHistory {
  timestamp: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  difficulty: string;
}

export function ExamDashboard({ testId, onBack }: ExamDashboardProps) {
  const [, setLocation] = useLocation();
  const [test, setTest] = useState<Test | null>(null);
  const [examMode, setExamMode] = useState<'setup' | 'exam' | 'results'>('setup');
  const [examConfig, setExamConfig] = useState<ExamConfig>({
    adaptiveDifficulty: true,
    timeLimit: 90, // 90 minutes default
    showAllQuestions: true,
    allowReview: true
  });
  const [examResults, setExamResults] = useState<any>(null);
  const [examHistory, setExamHistory] = useState<ExamHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch test data if testId is provided
  useEffect(() => {
    if (!testId) {
      setIsLoading(false);
      return;
    }
    
    // Simulated fetch (would be replaced with actual API call)
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Simulated API response
        const mockTest: Test = {
          id: testId,
          title: 'Advanced NCLEX Practice Exam',
          description: 'Comprehensive exam covering multiple nursing topics including med-surg, pharmacology, and more.',
          category: 'Mixed',
          questionCount: 75,
          timeLimit: 120,
          path: `/test/${testId}`,
          createdAt: new Date()
        };
        
        setTest(mockTest);
        
        // Load exam history from local storage
        const historyKey = `exam_history_${testId}`;
        const storedHistory = localStorage.getItem(historyKey);
        if (storedHistory) {
          setExamHistory(JSON.parse(storedHistory));
        }
      } catch (error) {
        console.error('Error fetching test:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [testId]);
  
  // Handle back navigation
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setLocation('/tests');
    }
  };
  
  // Start the exam with configured settings
  const handleStartExam = () => {
    setExamMode('exam');
  };
  
  // Handle exam completion
  const handleExamComplete = (results: any) => {
    setExamResults(results);
    setExamMode('results');
    
    // Save to history
    const newHistoryEntry: ExamHistory = {
      timestamp: new Date().toISOString(),
      score: results.score,
      totalQuestions: results.totalQuestions,
      timeSpent: results.timeSpent,
      difficulty: results.difficulty
    };
    
    const updatedHistory = [newHistoryEntry, ...examHistory].slice(0, 10);
    setExamHistory(updatedHistory);
    
    // Save to local storage
    if (testId) {
      const historyKey = `exam_history_${testId}`;
      localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
    }
  };
  
  // Toggle exam configuration options
  const toggleAdaptiveDifficulty = () => {
    setExamConfig({
      ...examConfig,
      adaptiveDifficulty: !examConfig.adaptiveDifficulty
    });
  };
  
  const updateTimeLimit = (minutes: number | null) => {
    setExamConfig({
      ...examConfig,
      timeLimit: minutes
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-pulse h-16 w-16 mx-auto mb-4 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          <p className="text-lg font-medium">Loading exam dashboard...</p>
        </div>
      </div>
    );
  }
  
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
  
  // If in exam mode, show the exam component
  if (examMode === 'exam') {
    return (
      <AdvancedExamView
        test={test}
        onBack={handleBack}
        onComplete={handleExamComplete}
        adaptiveDifficulty={examConfig.adaptiveDifficulty}
        timeLimit={examConfig.timeLimit || undefined}
      />
    );
  }
  
  // If in results mode, show the results
  if (examMode === 'results' && examResults) {
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
                  Category Performance
                </h3>
                <div className="space-y-3">
                  {Object.entries(examResults.categoryPerformance).map(([category, data]: [string, any]) => (
                    <div key={category} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700 font-medium">{category}</span>
                        <span className={data.percentage >= 65 ? 'text-green-600' : 'text-red-600'}>
                          {data.percentage}%
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
                <Button 
                  onClick={() => setExamMode('setup')}
                  className="bg-gray-600 hover:bg-gray-700"
                >
                  Take Exam Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Setup mode (default)
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={handleBack}
        className="mb-6 flex items-center text-gray-600"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Tests
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Exam info and settings */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-[#13294B]">{test.title}</h2>
                <p className="text-gray-600 mt-1">{test.description}</p>
              </div>
              {test.category && (
                <Badge className='bg-blue-100 text-blue-800 border-blue-200'>
                  {test.category}
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
                <BrainCircuit className="h-6 w-6 text-blue-600 mb-2" />
                <span className="text-sm text-gray-600">Questions</span>
                <span className="font-bold text-blue-700">{test.questionCount || 'Varies'}</span>
              </div>
              
              <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
                <Clock className="h-6 w-6 text-green-600 mb-2" />
                <span className="text-sm text-gray-600">Time Limit</span>
                <span className="font-bold text-green-700">{test.timeLimit ? `${test.timeLimit} min` : 'None'}</span>
              </div>
              
              <div className="flex flex-col items-center p-3 bg-amber-50 rounded-lg">
                <BarChart className="h-6 w-6 text-amber-600 mb-2" />
                <span className="text-sm text-gray-600">Avg. Score</span>
                <span className="font-bold text-amber-700">75%</span>
              </div>
              
              <div className="flex flex-col items-center p-3 bg-purple-50 rounded-lg">
                <Flag className="h-6 w-6 text-purple-600 mb-2" />
                <span className="text-sm text-gray-600">Difficulty</span>
                <span className="font-bold text-purple-700">Adaptive</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-medium text-lg text-gray-900 mb-4">Exam Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Adaptive Difficulty</h4>
                    <p className="text-sm text-gray-600">Questions adjust based on your performance</p>
                  </div>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                    <input
                      type="checkbox"
                      id="adaptiveDifficulty"
                      className="opacity-0 absolute w-0 h-0"
                      checked={examConfig.adaptiveDifficulty}
                      onChange={toggleAdaptiveDifficulty}
                    />
                    <label
                      htmlFor="adaptiveDifficulty"
                      className={cn(
                        "absolute cursor-pointer inset-0 rounded-full transition-colors duration-200",
                        examConfig.adaptiveDifficulty ? "bg-blue-600" : "bg-gray-300"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 transform",
                          examConfig.adaptiveDifficulty ? "translate-x-6" : "translate-x-0"
                        )}
                      />
                    </label>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Time Limit</h4>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateTimeLimit(null)}
                      className={cn(
                        "px-3 py-1 text-sm rounded-md",
                        examConfig.timeLimit === null
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      )}
                    >
                      No limit
                    </button>
                    <button
                      onClick={() => updateTimeLimit(60)}
                      className={cn(
                        "px-3 py-1 text-sm rounded-md",
                        examConfig.timeLimit === 60
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      )}
                    >
                      60 min
                    </button>
                    <button
                      onClick={() => updateTimeLimit(90)}
                      className={cn(
                        "px-3 py-1 text-sm rounded-md",
                        examConfig.timeLimit === 90
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      )}
                    >
                      90 min
                    </button>
                    <button
                      onClick={() => updateTimeLimit(120)}
                      className={cn(
                        "px-3 py-1 text-sm rounded-md",
                        examConfig.timeLimit === 120
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      )}
                    >
                      120 min
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-center">
              <Button
                onClick={handleStartExam}
                className="bg-[#13294B] text-white hover:bg-[#0c1c33] py-2 px-6 text-lg"
              >
                Start Exam
              </Button>
            </div>
          </div>
        </div>
        
        {/* Right column - Exam history */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-medium text-lg text-gray-900 mb-4">Your Exam History</h3>
            
            {examHistory.length > 0 ? (
              <div className="space-y-4">
                {examHistory.map((history, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-3">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm text-gray-600">
                        {formatDate(new Date(history.timestamp), 'MMM d, yyyy')}
                      </div>
                      <Badge className={
                        history.score / history.totalQuestions * 100 >= 65
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : 'bg-red-100 text-red-800 border-red-200'
                      }>
                        {Math.round(history.score / history.totalQuestions * 100)}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500 block">Questions</span>
                        <span className="font-medium">{history.totalQuestions}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Time</span>
                        <span className="font-medium">
                          {Math.floor(history.timeSpent / 60)}:{(history.timeSpent % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Difficulty</span>
                        <span className="font-medium capitalize">{history.difficulty}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>No exam history yet.</p>
                <p className="text-sm">Complete your first exam to see your progress here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}