import React from 'react';
import { useLocation } from 'wouter';
import { Test } from '@shared/schema';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, Brain, Clock3, Award, ArrowUpRight } from 'lucide-react';

interface TestsListProps {
  tests: Test[];
  isLoading?: boolean;
}

export function TestsList({ tests, isLoading = false }: TestsListProps) {
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
            <div className="flex justify-between">
              <div className="h-8 bg-gray-200 rounded w-24"></div>
              <div className="h-8 bg-gray-200 rounded w-36"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tests.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <div className="text-gray-400 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No tests available</h3>
        <p className="text-gray-600">Check back later for new practice tests.</p>
      </div>
    );
  }

  const handleTestClick = (testId: number) => {
    setLocation(`/test/${testId}`);
  };

  const handleAdvancedModeClick = (testId: number) => {
    setLocation(`/advanced-exam/${testId}`);
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {tests.map(test => (
        <div key={test.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-[#13294B] mb-2">{test.title}</h3>
                <p className="text-gray-600 mb-4">{test.description}</p>
              </div>
              {test.difficulty && (
                <Badge className={
                  test.difficulty === 'beginner' ? 'bg-green-100 text-green-800 border-green-200' :
                  test.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                  'bg-red-100 text-red-800 border-red-200'
                }>
                  {test.difficulty}
                </Badge>
              )}
            </div>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center text-sm text-gray-500">
                <BarChart3 className="h-4 w-4 mr-1" />
                <span>{test.questionCount || 'Various'} questions</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-500">
                <Brain className="h-4 w-4 mr-1" />
                <span>{test.category || 'Mixed'}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-500">
                <Clock3 className="h-4 w-4 mr-1" />
                <span>{test.estimatedTime || '30-60'} mins</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-500">
                <Award className="h-4 w-4 mr-1" />
                <span>{test.passRate || '75'}% pass rate</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-end">
              <Button 
                className="border border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
                onClick={() => handleTestClick(test.id)}
              >
                Standard Mode
              </Button>
              
              <Button 
                className="bg-[#13294B] hover:bg-[#0c1c33] flex items-center"
                onClick={() => handleAdvancedModeClick(test.id)}
              >
                Advanced Mode
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}