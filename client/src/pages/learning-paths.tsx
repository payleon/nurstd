import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Calendar, Clock, BookOpen, Plus } from 'lucide-react';
import { getUserLearningPaths } from '@/api/learning-path';
import { LearningPath } from '@/lib/learning-path';
import { Badge } from '@/components/ui/badge';

// Local Link component that works with wouter
const Link = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const [_, setLocation] = useLocation();
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setLocation(href);
  };
  
  return (
    <a href={href} onClick={handleClick}>
      {children}
    </a>
  );
};

export default function LearningPathsPage() {
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch the user's learning paths
  useEffect(() => {
    async function fetchLearningPaths() {
      try {
        setIsLoading(true);
        setError(null);
        
        const paths = await getUserLearningPaths();
        setLearningPaths(paths);
      } catch (error) {
        console.error('Error fetching learning paths:', error);
        setError((error as Error).message || 'Failed to load learning paths');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchLearningPaths();
  }, []);
  
  // Format the date for display
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#13294B]">Learning Paths</h1>
          <p className="text-gray-600 mt-1">Personalized study plans tailored to your learning style</p>
        </div>
        
        <Link href="/create-learning-path">
          <a className="bg-[#4B9CD3] hover:bg-[#3d7eaa] text-white py-2 px-4 rounded-md flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Create New
          </a>
        </Link>
      </div>
      
      {isLoading && (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded mb-6">
          <h3 className="font-bold mb-2">Error</h3>
          <p>{error}</p>
        </div>
      )}
      
      {!isLoading && !error && learningPaths.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 p-6 rounded-lg text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-blue-500" />
          <h3 className="text-xl font-bold mb-2">No Learning Paths Found</h3>
          <p className="mb-4">You haven't created any personalized learning paths yet.</p>
          <Link href="/create-learning-path">
            <a className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md inline-flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Learning Path
            </a>
          </Link>
        </div>
      )}
      
      {!isLoading && !error && learningPaths.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningPaths.map((path) => (
            <Link key={path.id} href={`/learning-path/${path.id}`}>
              <a className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border">
                <div className={`h-3 ${getProgressColor(path.progress)}`}></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#13294B] mb-2 line-clamp-2">{path.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{path.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {path.focusAreas.slice(0, 3).map((area, index) => (
                      <Badge key={index} variant="secondary">{area}</Badge>
                    ))}
                    {path.focusAreas.length > 3 && (
                      <Badge variant="outline">+{path.focusAreas.length - 3} more</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t text-sm">
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(path.createdAt)}</span>
                    </div>
                    
                    <div className="flex items-center font-medium text-[#4B9CD3]">
                      <span>{path.progress}% Complete</span>
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper function to get progress bar color based on completion percentage
function getProgressColor(progress: number): string {
  if (progress < 25) return 'bg-red-500';
  if (progress < 50) return 'bg-orange-500';
  if (progress < 75) return 'bg-yellow-500';
  return 'bg-green-500';
}