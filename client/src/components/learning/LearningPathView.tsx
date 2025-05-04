import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Video, 
  FileText, 
  Play, 
  PenTool, 
  Layers,
  CheckCircle,
  CircleSlash,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { 
  LearningPath, 
  LearningPathNode, 
  updateLearningPathProgress, 
  getNextRecommendedNode 
} from '@/lib/learning-path';

export function LearningPathView() {
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [nextNode, setNextNode] = useState<LearningPathNode | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  // Load learning path from localStorage
  useEffect(() => {
    const currentPathId = localStorage.getItem('currentLearningPathId');
    if (currentPathId) {
      const storedPaths = JSON.parse(localStorage.getItem('learningPaths') || '[]');
      const currentPath = storedPaths.find((path: LearningPath) => path.id === currentPathId);
      
      if (currentPath) {
        // Convert string date back to Date object
        currentPath.createdAt = new Date(currentPath.createdAt);
        setLearningPath(currentPath);
        
        // Auto-expand the section containing the next recommended node
        const recommended = getNextRecommendedNode(currentPath);
        setNextNode(recommended);
        
        if (recommended) {
          const section = currentPath.sections.find(section => 
            section.nodes.some(node => node.id === recommended.id)
          );
          if (section) {
            setExpandedSections([section.id]);
          }
        }
      } else {
        toast({
          title: "Path Not Found",
          description: "The learning path could not be found. Please create a new one.",
          variant: "destructive"
        });
        navigate('/create-learning-path');
      }
    } else {
      toast({
        title: "No Learning Path",
        description: "You don't have an active learning path. Create one to get started.",
        variant: "default"
      });
      navigate('/create-learning-path');
    }
  }, [toast, navigate]);

  // Handle marking a node as complete/incomplete
  const handleToggleNodeCompletion = (nodeId: string, completed: boolean) => {
    if (!learningPath) return;
    
    const updatedPath = updateLearningPathProgress(learningPath, nodeId, completed);
    setLearningPath(updatedPath);
    
    // Update next recommended node
    setNextNode(getNextRecommendedNode(updatedPath));
    
    // Update in localStorage
    const storedPaths = JSON.parse(localStorage.getItem('learningPaths') || '[]');
    const updatedPaths = storedPaths.map((path: LearningPath) => 
      path.id === updatedPath.id ? updatedPath : path
    );
    localStorage.setItem('learningPaths', JSON.stringify(updatedPaths));
    
    toast({
      title: completed ? "Marked as Complete" : "Marked as Incomplete",
      description: completed 
        ? "Great job completing this learning resource!" 
        : "This resource has been marked as incomplete.",
      variant: "default"
    });
  };

  // Handle expanding/collapsing a section
  const handleToggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      if (prev.includes(sectionId)) {
        return prev.filter(id => id !== sectionId);
      } else {
        return [...prev, sectionId];
      }
    });
  };

  // Get resource type icon
  const getResourceTypeIcon = (resourceType: string) => {
    switch (resourceType) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'article':
        return <FileText className="h-4 w-4" />;
      case 'practice':
        return <Play className="h-4 w-4" />;
      case 'quiz':
        return <PenTool className="h-4 w-4" />;
      case 'flashcard':
        return <Layers className="h-4 w-4" />;
      case 'interactive':
        return <Play className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  // Create a new learning path
  const handleCreateNewPath = () => {
    navigate('/create-learning-path');
  };

  if (!learningPath) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <p className="mb-4 text-gray-500">Loading your learning path...</p>
          <Button onClick={handleCreateNewPath}>Create New Learning Path</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Learning Path Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold text-[#13294B]">{learningPath.title}</CardTitle>
              <CardDescription className="mt-2">{learningPath.description}</CardDescription>
            </div>
            <Button variant="outline" onClick={handleCreateNewPath}>
              Create New Path
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm text-gray-500">{learningPath.createdAt.toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Estimated Completion</p>
                <p className="text-sm text-gray-500">{learningPath.estimatedCompletionWeeks} weeks</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Learning Style</p>
                <p className="text-sm text-gray-500">{learningPath.learningStyle.charAt(0).toUpperCase() + learningPath.learningStyle.slice(1)}</p>
              </div>
            </div>
          </div>
          
          {/* Overall Progress */}
          <div className="space-y-2 mt-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">Overall Progress</p>
              <p className="text-sm font-medium">{learningPath.progress}%</p>
            </div>
            <Progress value={learningPath.progress} className="h-2" />
          </div>
          
          {/* Next Recommended Node */}
          {nextNode && (
            <div className="mt-6 border rounded-md p-4 bg-blue-50">
              <h3 className="font-medium mb-2 flex items-center">
                <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                Next Recommended Resource
              </h3>
              <p className="font-semibold text-[#13294B]">{nextNode.title}</p>
              <p className="text-sm text-gray-600 mt-1">{nextNode.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="outline" className="flex items-center gap-1">
                  {getResourceTypeIcon(nextNode.resourceType)}
                  <span>{nextNode.resourceType.charAt(0).toUpperCase() + nextNode.resourceType.slice(1)}</span>
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{nextNode.estimatedTime} min</span>
                </Badge>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {nextNode.url && (
                  <Button size="sm" variant="default" asChild>
                    <a href={nextNode.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                      Start Learning
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleToggleNodeCompletion(nextNode.id, true)}
                >
                  Mark Complete
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Learning Path Content */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Resources</CardTitle>
          <CardDescription>
            All study materials organized by nursing topic
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {learningPath.sections.map((section) => (
              <div key={section.id} className="border rounded-md overflow-hidden">
                <div 
                  className={`flex justify-between items-center p-4 cursor-pointer ${
                    section.completed ? 'bg-green-50' : expandedSections.includes(section.id) ? 'bg-blue-50' : 'bg-gray-50'
                  }`}
                  onClick={() => handleToggleSection(section.id)}
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