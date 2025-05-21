import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Test } from '@shared/schema';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, BookOpen, BarChart, Award, Bookmark, CheckCircle2 } from 'lucide-react';
import { Progress } from '../ui/progress';

interface EnhancedTestCardProps {
  test: Test;
  userProgress?: {
    attempts: number;
    bestScore: number;
    lastCompleted?: string;
    isCompleted: boolean;
  };
  isRecommended?: boolean;
}

export function EnhancedTestCard({ test, userProgress, isRecommended = false }: EnhancedTestCardProps) {
  // Define category colors
  const getCategoryColor = (category: string) => {
    const categoryMap: Record<string, { bg: string, text: string, border: string }> = {
      'Fundamentals': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
      'Medical-Surgical': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
      'Maternity': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
      'Pediatric': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
      'Psychiatric': { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' },
      'Emergency/Critical Care': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
      'Mixed': { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' },
    };
    
    return categoryMap[category] || { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
  };
  
  const categoryColor = getCategoryColor(test.category);
  const hasTakenTest = userProgress?.attempts && userProgress.attempts > 0;
  
  // Format the time nicely
  const formatTimeLimit = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 
        ? `${hours}h ${remainingMinutes}m` 
        : `${hours}h`;
    }
  };
  
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className={`h-full overflow-hidden flex flex-col border-2 ${isRecommended ? 'border-amber-300 shadow-amber-100/50' : 'border-gray-200'} shadow-md`}>
        {isRecommended && (
          <div className="bg-amber-400 text-amber-900 text-xs text-center py-1 font-semibold">
            RECOMMENDED FOR YOU
          </div>
        )}
        
        <CardHeader className="pb-3 relative">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-bold">{test.title}</CardTitle>
              <CardDescription className="mt-1 line-clamp-2">
                {test.description}
              </CardDescription>
            </div>
          </div>
          
          <Badge className={`absolute top-4 right-4 ${categoryColor.bg} ${categoryColor.text} border ${categoryColor.border}`}>
            {test.category}
          </Badge>
        </CardHeader>
        
        <CardContent className="flex-1 pb-2">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center text-sm">
              <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
              <span><strong>{test.questionCount}</strong> Questions</span>
            </div>
            
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              <span><strong>{formatTimeLimit(test.timeLimit)}</strong> Time</span>
            </div>
            
            {hasTakenTest && (
              <>
                <div className="flex items-center text-sm">
                  <BarChart className="h-4 w-4 mr-2 text-gray-500" />
                  <span><strong>{userProgress?.bestScore}%</strong> Best Score</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Award className="h-4 w-4 mr-2 text-gray-500" />
                  <span><strong>{userProgress?.attempts}</strong> Attempts</span>
                </div>
              </>
            )}
          </div>
          
          {hasTakenTest && (
            <div className="mt-2 space-y-1">
              <div className="flex justify-between items-center text-xs text-gray-600">
                <span>Highest Score</span>
                <span className={userProgress?.bestScore && userProgress.bestScore >= 70 ? 'text-green-600' : 'text-amber-600'}>
                  {userProgress?.bestScore}%
                </span>
              </div>
              <Progress 
                value={userProgress?.bestScore || 0} 
                className="h-2"
                indicatorClassName={userProgress?.bestScore && userProgress.bestScore >= 70 ? 'bg-green-500' : 'bg-amber-500'}
              />
              <div className="text-xs text-gray-500 mt-1">
                Last taken: {formatDate(userProgress?.lastCompleted)}
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="bg-gray-50 border-t pt-3 pb-3">
          <div className="w-full">
            <Link to={`/advanced-exam/${test.id}`}>
              <Button className="w-full bg-[#13294B] hover:bg-[#0A1E3A]">
                {hasTakenTest ? 'Retake Exam' : 'Start Exam'}
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}