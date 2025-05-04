import React, { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { ChevronRight, BookOpen, Clock, ArrowLeft, CheckCircle, Circle } from 'lucide-react';
import { LearningPath, LearningPathNode } from '@/lib/learning-path';
import { getLearningPath, markNodeAsCompleted } from '@/api/learning-path';
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

export function LearningPathView() {
  const [_, params] = useRoute('/learning-path/:id');
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  // Fetch the learning path
  useEffect(() => {
    async function fetchLearningPath() {
      if (!params?.id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const path = await getLearningPath(params.id);
        setLearningPath(path);
        
        // Set the first section as active by default
        if (path.sections && path.sections.length > 0) {
          setActiveSection(path.sections[0].id);
        }
      } catch (error) {
        console.error('Error fetching learning path:', error);
        setError((error as Error).message || 'Failed to load learning path');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchLearningPath();
  }, [params?.id]);
  
  // Handle marking a node as completed
  const handleMarkCompleted = async (nodeId: string) => {
    if (!learningPath) return;
    
    try {
      // Call the API to mark the node as completed
      await markNodeAsCompleted(learningPath.id, nodeId);
      
      // Update the local state
      setLearningPath(prevPath => {
        if (!prevPath) return null;
        
        // Create a deep copy of the learning path
        const updatedPath = { ...prevPath };
        
        // Update the node's completed status
        updatedPath.sections = prevPath.sections.map(section => ({
          ...section,
          nodes: section.nodes.map(node => ({
            ...node,
            completed: node.id === nodeId ? true : node.completed,
          })),
        }));
        
        // Update the section completed status if all nodes are completed
        updatedPath.sections = updatedPath.sections.map(section => ({
          ...section,
          completed: section.nodes.every(node => node.completed),
        }));
        
        // Calculate overall progress
        const totalNodes = updatedPath.sections.reduce(
          (sum, section) => sum + section.nodes.length, 0
        );
        const completedNodes = updatedPath.sections.reduce(
          (sum, section) => sum + section.nodes.filter(node => node.completed).length, 0
        );
        
        updatedPath.progress = totalNodes > 0 
          ? Math.round((completedNodes / totalNodes) * 100)
          : 0;
        
        return updatedPath;
      });
    } catch (error) {
      console.error('Error marking node as completed:', error);
      // You might want to show an error message to the user here
    }
  };
  
  // Format difficulty for display
  const formatDifficulty = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return <Badge variant="success">Beginner</Badge>;
      case 'intermediate':
        return <Badge variant="warning">Intermediate</Badge>;
      case 'advanced':
        return <Badge variant="destructive">Advanced</Badge>;
      default:
        return <Badge>{difficulty}</Badge>;
    }
  };
  
  // Format resource type for display
  const formatResourceType = (type: string) => {
    switch (type) {
      case 'video':
        return <Badge variant="info">Video</Badge>;
      case 'article':
        return <Badge variant="secondary">Article</Badge>;
      case 'quiz':
        return <Badge variant="warning">Quiz</Badge>;
      case 'interactive':
        return <Badge variant="destructive">Interactive</Badge>;
      case 'flashcard':
        return <Badge variant="outline">Flashcards</Badge>;
      case 'practice':
        return <Badge variant="success">Practice</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };
  
  // Get the active section
  const getActiveSection = () => {
    if (!learningPath || !activeSection) return null;
    return learningPath.sections.find(section => section.id === activeSection) || null;
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded">
        <h3 className="font-bold mb-2">Error</h3>
        <p>{error}</p>
        <Link href="/create-learning-path">
          <a className="text-blue-500 hover:underline mt-4 inline-block">
            &larr; Back to Create Learning Path
          </a>
        </Link>
      </div>
    );
  }
  
  if (!learningPath) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-4 rounded">
        <h3 className="font-bold mb-2">Learning Path Not Found</h3>
        <p>Unable to load the requested learning path.</p>
        <Link href="/create-learning-path">
          <a className="text-blue-500 hover:underline mt-4 inline-block">
            &larr; Back to Create Learning Path
          </a>
        </Link>
      </div>
    );
  }
  
  const activePathSection = getActiveSection();
  
  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header and overview */}
      <div className="border-b p-6">
        <div className="flex items-center mb-6">
          <Link href="/learning-paths">
            <a className="text-gray-600 hover:text-blue-600 flex items-center mr-4">
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span>Back</span>
            </a>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#13294B]">{learningPath.title}</h1>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <div className="flex items-center mr-4">
                <Clock className="h-4 w-4 mr-1" />
                <span>{learningPath.timeCommitment} time commitment</span>
              </div>
              <div>{formatDifficulty(learningPath.difficulty)}</div>
            </div>
          </div>
          <div className="text-lg font-bold text-[#4B9CD3]">
            {learningPath.progress}% Complete
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-[#13294B] mb-2">Study Plan Overview</h3>
          <p className="text-gray-700">{learningPath.description}</p>
          {learningPath.overview && (
            <div className="mt-3 text-gray-600">{learningPath.overview}</div>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-2">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="text-sm text-gray-500 mb-1">Learning Style</div>
            <div className="font-medium">
              {learningPath.learningStyle.charAt(0).toUpperCase() + learningPath.learningStyle.slice(1)} Learner
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="text-sm text-gray-500 mb-1">Time Commitment</div>
            <div className="font-medium">
              {learningPath.timeCommitment.charAt(0).toUpperCase() + learningPath.timeCommitment.slice(1)}
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="text-sm text-gray-500 mb-1">Difficulty</div>
            <div className="font-medium">
              {learningPath.difficulty.charAt(0).toUpperCase() + learningPath.difficulty.slice(1)}
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="text-sm text-gray-500 mb-1">Focus Areas</div>
            <div className="flex flex-wrap gap-1">
              {learningPath.focusAreas.map((area, index) => (
                <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Learning path content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar with sections */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-lg mb-3 text-[#13294B]">Study Sections</h3>
            <div className="border rounded-lg overflow-hidden">
              {learningPath.sections.map((section, index) => (
                <div 
                  key={section.id}
                  className={`
                    border-b last:border-b-0 py-3 px-4 cursor-pointer
                    ${activeSection === section.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}
                    ${section.completed ? 'bg-green-50' : ''}
                  `}
                  onClick={() => setActiveSection(section.id)}
                >
                  <div className="flex items-center">
                    <div className="mr-3 flex-shrink-0">
                      {section.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 text-gray-700 text-sm font-medium">
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium ${section.completed ? 'text-green-800' : ''}`}>
                        {section.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {section.nodes.filter(n => n.completed).length}/{section.nodes.length} activities
                      </div>
                    </div>
                    <ChevronRight className={`h-5 w-5 text-gray-400 ${activeSection === section.id ? 'transform rotate-90' : ''}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Main content */}
          <div className="md:col-span-3">
            {activePathSection ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-[#13294B]">{activePathSection.title}</h2>
                  <div className="text-sm text-gray-500">
                    {activePathSection.nodes.filter(n => n.completed).length} of {activePathSection.nodes.length} completed
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6">{activePathSection.description}</p>
                
                <div className="space-y-4">
                  {activePathSection.nodes.map((node) => (
                    <div 
                      key={node.id} 
                      className={`border rounded-lg p-4 transition-colors ${
                        node.completed ? 'bg-green-50 border-green-200' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="mr-3 mt-1">
                          {node.completed ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-300" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-lg">{node.title}</h3>
                            <div className="flex items-center space-x-2">
                              {formatResourceType(node.resourceType)}
                              {formatDifficulty(node.difficulty)}
                            </div>
                          </div>
                          
                          <p className="text-gray-700 mb-3">{node.description}</p>
                          
                          <div className="flex flex-wrap items-center justify-between">
                            <div className="flex items-center text-sm text-gray-500 mb-2 sm:mb-0">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>Estimated time: {node.estimatedTime} minutes</span>
                            </div>
                            
                            <div className="flex space-x-3">
                              {node.url && (
                                <a 
                                  href={node.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 flex items-center"
                                >
                                  <BookOpen className="h-4 w-4 mr-1" />
                                  <span>Open Resource</span>
                                </a>
                              )}
                              
                              {!node.completed && (
                                <button
                                  onClick={() => handleMarkCompleted(node.id)}
                                  className="text-green-600 hover:text-green-800 flex items-center"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  <span>Mark as Completed</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-6 rounded-lg">
                <h3 className="font-bold mb-2">No Section Selected</h3>
                <p>Please select a section from the sidebar to view its content.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}