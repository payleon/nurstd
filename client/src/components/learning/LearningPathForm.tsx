import React, { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { DifficultyLevel, LearningPreferences, LearningStyle, TimeCommitment, generateLearningPath } from '@/lib/learning-path';
import { useStudyProgress } from '@/hooks/useStudyProgress';

const NURSING_AREAS = [
  { id: 'fundamentals', label: 'Fundamentals' },
  { id: 'pharmacology', label: 'Pharmacology' },
  { id: 'med-surg', label: 'Medical-Surgical' },
  { id: 'pediatrics', label: 'Pediatrics' },
  { id: 'obstetrics', label: 'Obstetrics/Maternity' },
  { id: 'psychiatric', label: 'Psychiatric/Mental Health' },
  { id: 'prioritization', label: 'Prioritization & Delegation' },
  { id: 'leadership', label: 'Leadership & Management' }
];

export function LearningPathForm() {
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  const { studyAreas } = useStudyProgress();

  // State for user preferences
  const [learningStyle, setLearningStyle] = useState<LearningStyle>('visual');
  const [timeCommitment, setTimeCommitment] = useState<TimeCommitment>('moderate');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('intermediate');
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [excludedAreas, setExcludedAreas] = useState<string[]>([]);
  const [daysUntilExam, setDaysUntilExam] = useState<number>(30);
  const [isExamDateSet, setIsExamDateSet] = useState<boolean>(false);

  // Handle checkbox changes for focus areas
  const handleFocusAreaToggle = (areaId: string) => {
    setFocusAreas(prev => {
      if (prev.includes(areaId)) {
        return prev.filter(id => id !== areaId);
      } else {
        return [...prev, areaId];
      }
    });

    // Remove from excluded if it's being focused
    if (excludedAreas.includes(areaId)) {
      setExcludedAreas(prev => prev.filter(id => id !== areaId));
    }
  };

  // Handle checkbox changes for excluded areas
  const handleExcludedAreaToggle = (areaId: string) => {
    setExcludedAreas(prev => {
      if (prev.includes(areaId)) {
        return prev.filter(id => id !== areaId);
      } else {
        return [...prev, areaId];
      }
    });

    // Remove from focus if it's being excluded
    if (focusAreas.includes(areaId)) {
      setFocusAreas(prev => prev.filter(id => id !== areaId));
    }
  };

  // Generate the learning path
  const handleGeneratePath = () => {
    if (focusAreas.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select at least one focus area for your learning path.",
        variant: "destructive"
      });
      return;
    }

    // Create learning preferences object
    const preferences: LearningPreferences = {
      learningStyle,
      timeCommitment,
      difficulty,
      focusAreas,
      excludedAreas: excludedAreas.length > 0 ? excludedAreas : undefined,
      daysUntilExam: isExamDateSet ? daysUntilExam : undefined
    };

    try {
      // Generate the learning path
      const learningPath = generateLearningPath(preferences, studyAreas);
      
      // Store the learning path in localStorage
      const storedPaths = JSON.parse(localStorage.getItem('learningPaths') || '[]');
      localStorage.setItem('learningPaths', JSON.stringify([...storedPaths, learningPath]));
      
      // Store the current path ID
      localStorage.setItem('currentLearningPathId', learningPath.id);
      
      toast({
        title: "Learning Path Created",
        description: "Your personalized learning path has been generated successfully.",
        variant: "default"
      });

      // Navigate to learning path view
      navigate('/learning-path');
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem creating your learning path. Please try again.",
        variant: "destructive"
      });
      console.error("Learning path generation error:", error);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#13294B]">Create Your Learning Path</CardTitle>
        <CardDescription>
          Customize a personalized study plan based on your preferences and learning style
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Learning Style */}
        <div className="space-y-2">
          <Label htmlFor="learning-style">Your Learning Style</Label>
          <Select 
            value={learningStyle} 
            onValueChange={(value: LearningStyle) => setLearningStyle(value)}
          >
            <SelectTrigger id="learning-style" className="w-full">
              <SelectValue placeholder="Select your learning style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="visual">Visual (Videos & Diagrams)</SelectItem>
              <SelectItem value="auditory">Auditory (Lectures & Discussions)</SelectItem>
              <SelectItem value="reading">Reading/Writing (Articles & Notes)</SelectItem>
              <SelectItem value="kinesthetic">Kinesthetic (Practice & Interaction)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500">
            {learningStyle === 'visual' ? 
              "You learn best through videos, diagrams, and visual demonstrations." : 
            learningStyle === 'auditory' ? 
              "You learn best through listening to lectures, discussions, and verbal explanations." :
            learningStyle === 'reading' ? 
              "You learn best through reading texts, articles, and writing notes." :
              "You learn best through practice, hands-on activities, and interactive exercises."}
          </p>
        </div>
        
        {/* Time Commitment */}
        <div className="space-y-2">
          <Label htmlFor="time-commitment">Weekly Time Commitment</Label>
          <Select 
            value={timeCommitment} 
            onValueChange={(value: TimeCommitment) => setTimeCommitment(value)}
          >
            <SelectTrigger id="time-commitment" className="w-full">
              <SelectValue placeholder="Select your time commitment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minimal">Minimal (3-4 hours/week)</SelectItem>
              <SelectItem value="moderate">Moderate (6-8 hours/week)</SelectItem>
              <SelectItem value="intensive">Intensive (10+ hours/week)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Difficulty Level */}
        <div className="space-y-2">
          <Label htmlFor="difficulty">Content Difficulty</Label>
          <Select 
            value={difficulty} 
            onValueChange={(value: DifficultyLevel) => setDifficulty(value)}
          >
            <SelectTrigger id="difficulty" className="w-full">
              <SelectValue placeholder="Select difficulty level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner (Fundamental Concepts)</SelectItem>
              <SelectItem value="intermediate">Intermediate (Standard NCLEX Level)</SelectItem>
              <SelectItem value="advanced">Advanced (Challenging Content)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Exam Date */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="exam-date" 
              checked={isExamDateSet} 
              onCheckedChange={(checked) => setIsExamDateSet(checked === true)}
            />
            <Label htmlFor="exam-date">I have a scheduled exam date</Label>
          </div>
          
          {isExamDateSet && (
            <div className="mt-4 space-y-4">
              <Label>Days until your NCLEX exam: {daysUntilExam}</Label>
              <Slider
                defaultValue={[30]}
                min={7}
                max={90}
                step={1}
                value={[daysUntilExam]}
                onValueChange={(value) => setDaysUntilExam(value[0])}
              />
              <p className="text-sm text-gray-500">
                Your learning path will be optimized to complete before your exam.
              </p>
            </div>
          )}
        </div>
        
        {/* Focus Areas */}
        <div className="space-y-3">
          <Label>Study Focus Areas (select at least one)</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {NURSING_AREAS.map(area => (
              <div key={area.id} className="flex items-start space-x-2">
                <Checkbox 
                  id={`focus-${area.id}`} 
                  checked={focusAreas.includes(area.id)}
                  onCheckedChange={() => handleFocusAreaToggle(area.id)}
                  className="mt-1"
                />
                <div>
                  <Label 
                    htmlFor={`focus-${area.id}`}
                    className="font-medium"
                  >
                    {area.label}
                  </Label>
                  {studyAreas[area.id] && (
                    <p className="text-xs mt-1">
                      Current confidence: 
                      <span className={
                        studyAreas[area.id].confidenceLevel === 1 ? "text-red-600 ml-1 font-medium" :
                        studyAreas[area.id].confidenceLevel === 2 ? "text-amber-600 ml-1 font-medium" :
                        "text-green-600 ml-1 font-medium"
                      }>
                        {studyAreas[area.id].confidenceLevel === 1 ? "Low" :
                         studyAreas[area.id].confidenceLevel === 2 ? "Medium" : "High"}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Excluded Areas */}
        <div className="space-y-3">
          <Label>Exclude Areas (optional)</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {NURSING_AREAS.map(area => (
              <div key={area.id} className="flex items-start space-x-2">
                <Checkbox 
                  id={`exclude-${area.id}`} 
                  checked={excludedAreas.includes(area.id)}
                  onCheckedChange={() => handleExcludedAreaToggle(area.id)}
                  className="mt-1"
                />
                <Label 
                  htmlFor={`exclude-${area.id}`}
                  className="font-medium"
                >
                  {area.label}
                </Label>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            Excluded areas will not be included in your learning path.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleGeneratePath} className="w-full sm:w-auto">
          Generate Learning Path
        </Button>
      </CardFooter>
    </Card>
  );
}