import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  LearningPath, 
  LearningPathNode, 
  updateLearningPathProgress,
  getNextRecommendedNode
} from '@/lib/learning-path';
import { 
  Book, 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  ExternalLink, 
  SlidersHorizontal, 
  Timer, 
  Video, 
  FileText, 
  CircleSlash
} from 'lucide-react';

export function LearningPathView() {
  const [_, navigate] = useLocation();
  const [currentPath, setCurrentPath] = useState<LearningPath | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [recommendedNode, setRecommendedNode] = useState<LearningPathNode | null>(null);
  
  // Load learning path from localStorage
  useEffect(() => {
    const loadLearningPath = () => {
      try {
        const currentPathId = localStorage.getItem('currentLearningPathId');
        if (!currentPathId) {
          return;
        }
        
        const storedPathsString = localStorage.getItem('learningPaths');
        if (!storedPathsString) {
          return;
        }
        
        const storedPaths = JSON.parse(storedPathsString);
        const currentPath = storedPaths.find((path: LearningPath) => path.id === currentPathId);
        
        if (currentPath) {
          // Convert the string date back to a Date object
          currentPath.createdAt = new Date(currentPath.createdAt);
          setCurrentPath(currentPath);
          
          // Find recommended node
          const nextNode = getNextRecommendedNode(currentPath);
          setRecommendedNode(nextNode);
          
          // If we have a recommended node, expand its section
          if (nextNode) {
            const section = currentPath.sections.find(section => 
              section.nodes.some(node => node.id === nextNode.id)
            );
            if (section) {
              setExpandedSections([section.id]);
            }
          }
        }
      } catch (error) {
        console.error('Error loading learning path:', error);
      }
    };
    
    loadLearningPath();
  }, []);
  
  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };
  
  // Handle marking node as complete/incomplete
  const handleToggleNodeCompletion = (nodeId: string, completed: boolean) => {
    if (!currentPath) return;
    
    // Update the path
    const updatedPath = updateLearningPathProgress(currentPath, nodeId, completed);
    setCurrentPath(updatedPath);
    
    // Update in localStorage
    try {
      const storedPathsString = localStorage.getItem('learningPaths');
      if (!storedPathsString) return;
      
      const storedPaths = JSON.parse(storedPathsString);
      const updatedPaths = storedPaths.map((path: LearningPath) => 
        path.id === updatedPath.id ? updatedPath : path
      );
      
      localStorage.setItem('learningPaths', JSON.stringify(updatedPaths));
      
      // Update recommended node
      const nextNode = getNextRecommendedNode(updatedPath);
      setRecommendedNode(nextNode);
    } catch (error) {
      console.error('Error updating learning path:', error);
    }
  };
  
  // Handle creating a new path
  const handleCreateNew = () => {
    navigate('/create-learning-path');
  };
  
  // Helper to get appropriate icon for resource type
  const getResourceTypeIcon = (resourceType: string) => {
    switch (resourceType.toLowerCase()) {
      case 'video':
        return <Video className="h-3 w-3" />;
      case 'article':
        return <FileText className="h-3 w-3" />;
      case 'interactive':
        return <SlidersHorizontal className="h-3 w-3" />;
      case 'quiz':
        return <Book className="h-3 w-3" />;
      case 'flashcard':
        return <BookOpen className="h-3 w-3" />;
      case 'practice':
        return <Timer className="h-3 w-3" />;
      default:
        return <Book className="h-3 w-3" />;
    }
  };
  
  // Helper to calculate total time
  const calculateTotalTime = () => {
    if (!currentPath) return 0;
    
    return currentPath.sections.reduce((total, section) => {
      return total + section.nodes.reduce((sectionTotal, node) => {
        return sectionTotal + node.estimatedTime;
      }, 0);
    }, 0);
  };
  
  // If no learning path is found
  if (!currentPath) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <BookOpen className="h-16 w-16 text-gray-400" />
        <h3 className="text-xl font-semibold text-[#13294B]">No Learning Path Found</h3>
        <p className="text-gray-600 text-center max-w-md">
          You haven't created a personalized learning path yet. Create one to get started with your NCLEX preparation.
        </p>
        <Button onClick={handleCreateNew} className="mt-4">
          Create Learning Path
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Summary card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{currentPath.title}</CardTitle>
              <CardDescription className="mt-2">{currentPath.description}</CardDescription>
            </div>
            <Button variant="outline" onClick={handleCreateNew}>
              Create New
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Progress</span>
                <span className="font-medium">{currentPath.progress}%</span>
              </div>
              <Progress value={currentPath.progress} className="h-2" />
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-blue-50 p-4 rounded-lg flex items-center space-x-4">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Created</p>
                  <p className="font-medium">{currentPath.createdAt.toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg flex items-center space-x-4">
                <Clock className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Est. Time</p>
                  <p className="font-medium">{Math.round(calculateTotalTime() / 60)} hours</p>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg flex items-center space-x-4">
                <BookOpen className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Learning Style</p>
                  <p className="font-medium capitalize">{currentPath.learningStyle}</p>
                </div>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg flex items-center space-x-4">
                <Timer className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="text-sm text-gray-600">Time Commitment</p>
                  <p className="font-medium capitalize">{currentPath.timeCommitment}</p>
                </div>
              </div>
            </div>
            
            {/* Next recommended study */}
            {recommendedNode && (
              <div className="mt-6 border border-blue-200 bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-[#13294B] flex items-center">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                  Recommended Next Step
                </h3>
                <div className="mt-2 p-3 bg-white rounded-md border border-blue-100">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-[#13294B]">{recommendedNode.title}</h4>
                    <Badge variant="outline" className="flex items-center gap-1 ml-2">
                      <Clock className="h-3 w-3" />
                      <span>{recommendedNode.estimatedTime} min</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{recommendedNode.description}</p>
                  
                  <div className="flex justify-between items-center mt-3">
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getResourceTypeIcon(recommendedNode.resourceType)}
                      <span>{recommendedNode.resourceType.charAt(0).toUpperCase() + recommendedNode.resourceType.slice(1)}</span>
                    </Badge>
                    
                    <div className="space-x-2">
                      {recommendedNode.url && (
                        <Button size="sm" variant="outline" asChild className="h-8">
                          <a href={recommendedNode.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                            Access
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        onClick={() => handleToggleNodeCompletion(recommendedNode.id, true)}
                        className="h-8 bg-green-600 hover:bg-green-700"
                      >
                        Mark Complete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Learning path content */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Path Content</CardTitle>
          <CardDescription>
            Work through these sections to complete your personalized learning path
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentPath.sections.map((section) => (
              <div key={section.id} className="border rounded-lg overflow-hidden">
                <div 
                  className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center gap-2">
                    {section.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    )}
                    <h3 className="font-semibold text-[#13294B]">{section.title}</h3>
                    <Badge 
                      variant={section.completed ? "default" : "outline"} 
                      className={`ml-2 ${section.completed ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}`}
                    >
                      {section.nodes.filter(node => node.completed).length}/{section.nodes.length}
                    </Badge>
                  </div>
                  {expandedSections.includes(section.id) ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
                
                {expandedSections.includes(section.id) && (
                  <div className="p-4 space-y-4">
                    <p className="text-sm text-gray-600">{section.description}</p>
                    
                    <div className="space-y-3">
                      {section.nodes.map((node) => (
                        <div 
                          key={node.id} 
                          className={`border rounded-md p-3 ${
                            node.completed ? 'bg-green-50 border-green-200' : 'bg-white'
                          }`}
                        >
                          <div className="flex justify-between">
                            <h4 className={`font-medium ${node.completed ? 'text-green-800' : 'text-[#13294B]'}`}>
                              {node.title}
                            </h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleNodeCompletion(node.id, !node.completed)}
                              className={`h-6 px-2 ${node.completed ? 'text-green-700' : 'text-gray-500'}`}
                            >
                              {node.completed ? (
                                <span className="flex items-center">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Completed
                                </span>
                              ) : (
                                <span className="flex items-center">
                                  <CircleSlash className="h-4 w-4 mr-1" />
                                  Mark Complete
                                </span>
                              )}
                            </Button>
                          </div>
                          
                          <p className="text-sm text-gray-600 mt-1">{node.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Badge variant="outline" className="flex items-center gap-1">
                              {getResourceTypeIcon(node.resourceType)}
                              <span>{node.resourceType.charAt(0).toUpperCase() + node.resourceType.slice(1)}</span>
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{node.estimatedTime} min</span>
                            </Badge>
                            <Badge variant={
                              node.difficulty === 'beginner' ? 'default' : 
                              node.difficulty === 'intermediate' ? 'secondary' : 
                              'destructive'
                            } className="flex items-center gap-1">
                              {node.difficulty.charAt(0).toUpperCase() + node.difficulty.slice(1)}
                            </Badge>
                          </div>
                          
                          {node.url && (
                            <div className="mt-3">
                              <Button size="sm" variant="link" asChild className="h-6 px-0">
                                <a href={node.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                  Access Resource
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}