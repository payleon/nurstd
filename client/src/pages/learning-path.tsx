import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { PageHeader } from '@/components/ui/page-header';
import { LearningPathView } from '@/components/learning/LearningPathView';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Plus, Lightbulb } from 'lucide-react';
import { getEnhancedRecommendations, LearningPath } from '@/lib/learning-path';
import { useStudyProgress } from '@/hooks/useStudyProgress';

export default function LearningPathPage() {
  const [_, navigate] = useLocation();
  const [hasPath, setHasPath] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const { studyAreas } = useStudyProgress();
  
  // Check if the user has any learning paths
  useEffect(() => {
    const checkForPaths = () => {
      try {
        const pathIdString = localStorage.getItem('currentLearningPathId');
        const pathsString = localStorage.getItem('learningPaths');
        
        if (pathIdString && pathsString) {
          try {
            const paths = JSON.parse(pathsString);
            if (paths.length > 0) {
              setHasPath(true);
              
              // Get recommendations for current path
              const currentPath = paths.find((path: LearningPath) => path.id === pathIdString);
              if (currentPath) {
                const pathRecommendations = getEnhancedRecommendations(currentPath, studyAreas);
                setRecommendations(pathRecommendations);
              }
            }
          } catch (e) {
            console.error('Error parsing learning paths:', e);
          }
        }
      } catch (error) {
        console.error('Error checking for learning paths:', error);
      }
    };
    
    checkForPaths();
  }, [studyAreas]);
  
  // Handle creating new path
  const handleCreateNew = () => {
    navigate('/create-learning-path');
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader 
        title="Personalized Learning Path" 
        description="Follow your personalized NCLEX learning path designed for your unique learning style and needs."
        action={
          <Button onClick={handleCreateNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {hasPath ? 'Create New Path' : 'Create Path'}
          </Button>
        }
      />
      
      <div className="mt-8">
        {hasPath ? (
          <>
            {recommendations.length > 0 && (
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    AI Learning Recommendations
                  </CardTitle>
                  <CardDescription>
                    Based on your learning progress and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            
            <LearningPathView />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <BookOpen className="h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-[#13294B] mb-2">No Learning Path Found</h2>
            <p className="text-gray-600 max-w-md mb-6">
              Create a personalized learning path to receive customized NCLEX preparation materials tailored to your learning style and needs.
            </p>
            <Button size="lg" onClick={handleCreateNew} className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create Your First Learning Path
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}