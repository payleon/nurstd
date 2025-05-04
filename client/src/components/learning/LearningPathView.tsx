import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  Calendar, 
  CheckCircle, 
  User, 
  Brain, 
  LucideIcon,
  Video,
  FileText,
  HelpCircle,
  MousePointer,
  FlashIcon,
  PenTool,
  ExternalLink,
  Loader2,
  CheckIcon
} from 'lucide-react';
import { getLearningPath, completePathNode } from '@/api/learning-path';
import { LearningPath, LearningPathNode } from '@/lib/learning-path';
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

// Resource type icons
const resourceIcons: Record<string, LucideIcon> = {
  video: Video,
  article: FileText,
  quiz: HelpCircle,
  interactive: MousePointer,
  flashcard: FlashIcon,
  practice: PenTool,
};

// Difficulty badge color mapping
const difficultyColors = {
  beginner: 'bg-green-100 text-green-800 border-green-200',
  intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  advanced: 'bg-red-100 text-red-800 border-red-200',
};

// Helper to format minutes into hours and minutes
const formatTime = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours} hr ${mins} min` : `${hours} hr`;
};

// Node component to display individual learning activities
const LearningPathNodeCard = ({ 
  node, 
  onComplete, 
  isCompleting,
}: { 
  node: LearningPathNode; 
  onComplete: () => void;
  isCompleting: boolean;
}) => {
  const ResourceIcon = resourceIcons[node.resourceType] || BookOpen;
  
  return (
    <div className={`border rounded-lg overflow-hidden mb-4 ${
      node.completed ? 'bg-gray-50 border-gray-300' : 'bg-white border-gray-200'
    }`}>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <ResourceIcon className="h-5 w-5 mr-2 text-blue-600" />
              <span className="text-sm font-medium text-blue-600 uppercase">
                {node.resourceType.replace('-', ' ')}
              </span>
              
              <span className="mx-2 text-gray-400">•</span>
              
              <Badge variant="outline" className={`text-xs ${difficultyColors[node.difficulty]}`}>
                {node.difficulty}
              </Badge>
              
              <span className="mx-2 text-gray-400">•</span>
              
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="h-4 w-4 mr-1" />
                <span>{formatTime(node.estimatedTime)}</span>
              </div>
            </div>
            
            <h3 className={`text-lg font-semibold mb-1 ${node.completed ? 'text-gray-600' : 'text-gray-900'}`}>
              {node.title}
            </h3>
            
            <p className="text-gray-600 mb-3">
              {node.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-2">
              {node.url && (
                <a 
                  href={node.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Open Resource <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              )}
              
              <button
                onClick={onComplete}
                disabled={node.completed || isCompleting}
                className={`
                  inline-flex items-center text-sm font-medium px-3 py-1 rounded-md
                  ${node.completed 
                    ? 'bg-green-100 text-green-800 cursor-default' 
                    : isCompleting 
                      ? 'bg-gray-100 text-gray-500 cursor-wait'
                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  }
                `}
              >
                {node.completed ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Completed
                  </>
                ) : isCompleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Marking as Complete...
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-4 w-4 mr-1" />
                    Mark as Complete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function LearningPathView() {
  const [location] = useLocation();
  const pathId = location.split('/').pop() || '';
  
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completingNodeId, setCompletingNodeId] = useState<string | null>(null);
  
  // Fetch the learning path data
  useEffect(() => {
    async function fetchLearningPath() {
      try {
        setIsLoading(true);
        setError(null);
        
        const path = await getLearningPath(pathId);
        setLearningPath(path);
      } catch (error) {
        console.error('Error fetching learning path:', error);
        setError((error as Error).message || 'Failed to load learning path');
      } finally {
        setIsLoading(false);
      }
    }
    
    if (pathId) {
      fetchLearningPath();
    }
  }, [pathId]);
  
  // Format the date for display
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Handle marking a node as complete
  const handleCompleteNode = async (nodeId: string) => {
    if (!learningPath) return;
    
    setCompletingNodeId(nodeId);
    
    try {
      await completePathNode(pathId, nodeId);
      
      // Update the local state to reflect the change
      setLearningPath(prevPath => {
        if (!prevPath) return null;
        
        // Create a deep copy of the path to update
        const updatedPath = { ...prevPath };
        
        // Find and update the node
        let nodeFound = false;
        let totalNodes = 0;
        let completedNodes = 0;
        
        updatedPath.sections = prevPath.sections.map(section => {
          const updatedSection = { ...section };
          
          updatedSection.nodes = section.nodes.map(node => {
            totalNodes++;
            
            if (node.id === nodeId) {
              nodeFound = true;
              completedNodes++;
              return { ...node, completed: true };
            }
            
            if (node.completed) completedNodes++;
            return node;
          });
          
          // Update section completed status
          updatedSection.completed = updatedSection.nodes.every(node => node.completed);
          
          return updatedSection;
        });
        
        // Update overall progress
        updatedPath.progress = totalNodes > 0 
          ? Math.round((completedNodes / totalNodes) * 100)
          : 0;
        
        return updatedPath;
      });
    } catch (error) {
      console.error('Error completing node:', error);
      // Optionally show error message
    } finally {
      setCompletingNodeId(null);
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-2" />
          <p className="text-gray-600">Loading learning path...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg text-center max-w-lg mx-auto">
        <h2 className="text-xl font-bold mb-2">Error Loading Learning Path</h2>
        <p className="mb-4">{error}</p>
        <Link href="/learning-paths">
          <a className="text-blue-600 hover:text-blue-800 font-medium">
            Back to All Learning Paths
          </a>
        </Link>
      </div>
    );
  }
  
  // No learning path found
  if (!learningPath) {
    return (
      <div className="bg-blue-50 border border-blue-200 text-blue-700 p-6 rounded-lg text-center max-w-lg mx-auto">
        <h2 className="text-xl font-bold mb-2">Learning Path Not Found</h2>
        <p className="mb-4">The learning path you're looking for doesn't exist or has been removed.</p>
        <Link href="/learning-paths">
          <a className="text-blue-600 hover:text-blue-800 font-medium">
            Back to All Learning Paths
          </a>
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      {/* Header with navigation */}
      <div className="mb-6">
        <Link href="/learning-paths">
          <a className="text-gray-600 hover:text-blue-600 flex items-center mb-4">
            <ArrowLeft className="h-5 w-5 mr-1" />
            <span>Back to Learning Paths</span>
          </a>
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#13294B]">{learningPath.title}</h1>
            <p className="text-gray-600 mt-1 mb-2">{learningPath.description}</p>
            
            <div className="flex flex-wrap gap-2 mt-3">
              {learningPath.focusAreas.map((area, index) => (
                <Badge key={index} variant="secondary">{area}</Badge>
              ))}
            </div>
          </div>
          
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4 min-w-[240px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Progress</h3>
              <span className="text-blue-600 font-medium">{learningPath.progress}%</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div 
                className={`h-2.5 rounded-full ${
                  learningPath.progress < 25 ? 'bg-red-500' :
                  learningPath.progress < 50 ? 'bg-orange-500' :
                  learningPath.progress < 75 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${learningPath.progress}%` }}
              ></div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Created:</span>
                </div>
                <span className="text-gray-900">{formatDate(learningPath.createdAt)}</span>
              </div>
              
              <div className="flex justify-between">
                <div className="flex items-center text-gray-600">
                  <User className="h-4 w-4 mr-1" />
                  <span>Difficulty:</span>
                </div>
                <span className="capitalize text-gray-900">{learningPath.difficulty}</span>
              </div>
              
              <div className="flex justify-between">
                <div className="flex items-center text-gray-600">
                  <Brain className="h-4 w-4 mr-1" />
                  <span>Learning Style:</span>
                </div>
                <span className="capitalize text-gray-900">{learningPath.learningStyle}</span>
              </div>
              
              <div className="flex justify-between">
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Time Commitment:</span>
                </div>
                <span className="capitalize text-gray-900">{learningPath.timeCommitment}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overview section */}
      {learningPath.overview && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8">
          <h2 className="text-xl font-semibold mb-2 text-blue-800">Overview</h2>
          <p className="text-blue-900">{learningPath.overview}</p>
        </div>
      )}
      
      {/* Learning path sections */}
      <div className="space-y-10">
        {learningPath.sections.map((section, index) => (
          <div key={section.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-2xl font-bold mb-2 text-[#13294B] flex items-start">
              <span className="bg-[#4B9CD3] text-white w-7 h-7 flex items-center justify-center rounded-full text-sm mr-3 flex-shrink-0">
                {index + 1}
              </span>
              {section.title}
              {section.completed && (
                <CheckCircle className="h-5 w-5 ml-2 text-green-600" />
              )}
            </h2>
            
            <p className="text-gray-600 ml-10 mb-6">{section.description}</p>
            
            <div className="ml-10">
              {section.nodes.map(node => (
                <LearningPathNodeCard
                  key={node.id}
                  node={node}
                  onComplete={() => handleCompleteNode(node.id)}
                  isCompleting={completingNodeId === node.id}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}