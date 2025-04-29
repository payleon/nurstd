import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Calendar, Clock, BookOpen, BrainCircuit, Divide, LineChart, Lightbulb, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Types for learning style, study time, and strategies
type LearningStyle = 'visual' | 'auditory' | 'reading' | 'kinesthetic';
type TimeCommitment = 'minimal' | 'moderate' | 'intensive';
type StrengthArea = 'med-surg' | 'pediatrics' | 'obstetrics' | 'psych' | 'pharmacology' | 'fundamentals';
type WeaknessArea = StrengthArea;
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

// Days of week for scheduler
type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

// User preferences interface
interface UserPreferences {
  learningStyle: LearningStyle;
  timeCommitment: TimeCommitment;
  strengthAreas: StrengthArea[];
  weaknessAreas: WeaknessArea[];
  daysUntilExam: number;
  confidenceLevel: number;
  difficultyLevel: DifficultyLevel;
  studyName: string;
}

// Study plan interface
interface StudyPlan {
  name: string;
  createdAt: string;
  lastEdited: string;
  dailySchedule: {
    morning: string;
    afternoon: string;
    evening: string;
  };
  weeklyGoals: string[];
  customGoals: string[];
  recommendedResources: {
    title: string;
    description: string;
    icon: React.ReactNode;
  }[];
  focusAreas: {
    area: string;
    percentage: number;
  }[];
  studyTips: string[];
  customTips: string[];
  weekSchedule: {
    [key in DayOfWeek]: {
      tasks: string[];
      focus: string;
      completed: boolean;
    }
  };
}

// Saved plan type
interface SavedPlan {
  id: string;
  name: string;
  createdAt: string;
  preferences: UserPreferences;
  plan: StudyPlan;
}

export function StudyStrategyPlanner() {
  // Initial user preferences
  const [preferences, setPreferences] = useState<UserPreferences>({
    learningStyle: 'visual',
    timeCommitment: 'moderate',
    strengthAreas: ['med-surg'],
    weaknessAreas: ['pharmacology'],
    daysUntilExam: 30,
    confidenceLevel: 50,
    difficultyLevel: 'intermediate',
    studyName: 'My NCLEX Study Plan',
  });
  
  // State for saved study plans
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  
  // State for editing daily schedule
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [editedSchedule, setEditedSchedule] = useState<{morning: string; afternoon: string; evening: string}>({
    morning: "",
    afternoon: "",
    evening: ""
  });
  
  // State for custom tips and goals
  const [customTip, setCustomTip] = useState("");
  const [customGoal, setCustomGoal] = useState("");
  const [customTips, setCustomTips] = useState<string[]>([]);
  const [customGoals, setCustomGoals] = useState<string[]>([]);
  
  // Track which step of the planner we're on
  const [currentStep, setCurrentStep] = useState<'preferences' | 'plan'>('preferences');
  
  // Generate personalized study plan based on preferences
  const generateStudyPlan = (): StudyPlan => {
    // This function would ideally use more sophisticated logic to generate a truly personalized plan
    // For now, we'll use preferences to create a semi-customized plan
    
    // Adjust daily schedule based on time commitment
    let dailySchedule = {
      morning: "Review flashcards for 30 minutes",
      afternoon: "Complete 20 practice questions",
      evening: "Study content review for 1 hour"
    };
    
    if (preferences.timeCommitment === 'minimal') {
      dailySchedule = {
        morning: "Review 10 flashcards",
        afternoon: "Complete 10 practice questions",
        evening: "Review weak areas for 30 minutes"
      };
    } else if (preferences.timeCommitment === 'intensive') {
      dailySchedule = {
        morning: "Content review for 2 hours",
        afternoon: "Complete 50 practice questions and analyze results",
        evening: "Study summary notes and prepare for tomorrow"
      };
    }
    
    // Override with edited schedule if available
    if (isEditingSchedule && editedSchedule.morning && editedSchedule.afternoon && editedSchedule.evening) {
      dailySchedule = editedSchedule;
    }
    
    // Weekly goals based on days until exam
    const weeklyQuestions = preferences.daysUntilExam < 14 ? 350 : 
                           preferences.daysUntilExam < 30 ? 200 : 100;
    
    // Focus areas calculation - more time on weaknesses, but maintain strengths
    const focusAreas: Array<{area: string, percentage: number}> = [];
    const allAreas = Array.from(new Set([...preferences.strengthAreas, ...preferences.weaknessAreas]));
    let remainingPercentage = 100;
    
    // Allocate percentages to weakness areas first
    preferences.weaknessAreas.forEach(area => {
      const percentage = Math.floor(60 / preferences.weaknessAreas.length);
      focusAreas.push({
        area: getAreaLabel(area),
        percentage
      });
      remainingPercentage -= percentage;
    });
    
    // Allocate remaining percentage to strength areas
    const strengthAreasNotInWeaknesses = preferences.strengthAreas.filter(
      area => !preferences.weaknessAreas.includes(area)
    );
    
    strengthAreasNotInWeaknesses.forEach(area => {
      if (strengthAreasNotInWeaknesses.length === 0) return;
      const percentage = Math.floor(remainingPercentage / strengthAreasNotInWeaknesses.length);
      focusAreas.push({
        area: getAreaLabel(area),
        percentage
      });
      remainingPercentage -= percentage;
    });
    
    // If there's any percentage left, add it to the first area
    if (remainingPercentage > 0 && focusAreas.length > 0) {
      focusAreas[0].percentage += remainingPercentage;
    }
    
    // Get study tips based on learning style
    const studyTips = getLearningStyleTips(preferences.learningStyle);
    
    // Setup weekly schedule
    const weekSchedule: {[key in DayOfWeek]: {tasks: string[], focus: string, completed: boolean}} = {
      monday: {
        tasks: [`Review ${getAreaLabel(preferences.weaknessAreas[0] || 'med-surg')}`, 'Practice 30 questions'],
        focus: getAreaLabel(preferences.weaknessAreas[0] || 'med-surg'),
        completed: false
      },
      tuesday: {
        tasks: [`Study ${getAreaLabel(preferences.weaknessAreas[1] || 'pharmacology')}`, 'Complete 20 questions'],
        focus: getAreaLabel(preferences.weaknessAreas[1] || 'pharmacology'),
        completed: false
      },
      wednesday: {
        tasks: ['Review incorrect questions', 'Study weak areas'],
        focus: 'Review',
        completed: false
      },
      thursday: {
        tasks: [`Focus on ${getAreaLabel(preferences.strengthAreas[0] || 'fundamentals')}`, 'Complete 30 questions'],
        focus: getAreaLabel(preferences.strengthAreas[0] || 'fundamentals'),
        completed: false
      },
      friday: {
        tasks: ['Complete mini exam', 'Review results'],
        focus: 'Assessment',
        completed: false
      },
      saturday: {
        tasks: ['Focused review of weak areas', 'Complete 50 questions'],
        focus: 'Weak Areas',
        completed: false
      },
      sunday: {
        tasks: ['Rest day', 'Light review of key concepts'],
        focus: 'Rest & Review',
        completed: false
      }
    };
    
    return {
      name: preferences.studyName,
      createdAt: new Date().toISOString(),
      lastEdited: new Date().toISOString(),
      dailySchedule,
      weeklyGoals: [
        `Complete ${weeklyQuestions} practice questions`,
        `Master ${preferences.weaknessAreas.length * 2} concepts in your weak areas`,
        `Create summary notes for ${preferences.weaknessAreas.map(getAreaLabel).join(' and ')}`,
        `Set aside 3 blocks of time for simulated mini-exams`
      ],
      customGoals: customGoals,
      recommendedResources: getRecommendedResources(preferences),
      focusAreas,
      studyTips,
      customTips,
      weekSchedule
    };
  };
  
  // Helper function to get human-readable area labels
  const getAreaLabel = (area: StrengthArea | WeaknessArea): string => {
    const labels: Record<StrengthArea | WeaknessArea, string> = {
      'med-surg': 'Medical-Surgical',
      'pediatrics': 'Pediatrics',
      'obstetrics': 'Obstetrics',
      'psych': 'Psychiatric Nursing',
      'pharmacology': 'Pharmacology',
      'fundamentals': 'Fundamentals'
    };
    return labels[area];
  };
  
  // Helper function to get recommendations based on learning style
  const getRecommendedResources = (prefs: UserPreferences) => {
    const baseResources = [
      {
        title: 'NCLEX Question Bank',
        description: 'Practice with thousands of NCLEX-style questions',
        icon: <BrainCircuit className="h-5 w-5 text-blue-500" />
      },
      {
        title: 'Content Review Notes',
        description: 'Condensed study materials for quick review',
        icon: <BookOpen className="h-5 w-5 text-green-500" />
      }
    ];
    
    const styleSpecificResources: Record<LearningStyle, {title: string, description: string, icon: React.ReactNode}[]> = {
      'visual': [
        {
          title: 'Concept Maps & Diagrams',
          description: 'Visual representations of complex concepts',
          icon: <Divide className="h-5 w-5 text-purple-500" />
        }
      ],
      'auditory': [
        {
          title: 'Nursing Lecture Recordings',
          description: 'Listen to expert explanations of key topics',
          icon: <Lightbulb className="h-5 w-5 text-yellow-500" />
        }
      ],
      'reading': [
        {
          title: 'Comprehensive Study Guides',
          description: 'In-depth written explanations of all topics',
          icon: <LineChart className="h-5 w-5 text-red-500" />
        }
      ],
      'kinesthetic': [
        {
          title: 'Interactive Case Studies',
          description: 'Hands-on application of nursing concepts',
          icon: <Lightbulb className="h-5 w-5 text-orange-500" />
        }
      ]
    };
    
    return [...baseResources, ...styleSpecificResources[prefs.learningStyle]];
  };
  
  // Get study tips based on learning style
  const getLearningStyleTips = (style: LearningStyle): string[] => {
    const commonTips = [
      'Take frequent breaks - try the Pomodoro technique (25 min study, 5 min break)',
      'Review content before bed to improve retention',
      'Teach concepts to someone else to solidify your understanding'
    ];
    
    const styleTips: Record<LearningStyle, string[]> = {
      'visual': [
        'Use color-coding for different systems or concepts',
        'Create mind maps to visualize relationships between concepts',
        'Watch videos demonstrating procedures and patient assessments',
        'Use flashcards with diagrams and images'
      ],
      'auditory': [
        'Record yourself explaining difficult concepts and listen to playback',
        'Study with a group where you can discuss topics aloud',
        'Use text-to-speech for reading material',
        'Create and recite mnemonic devices aloud'
      ],
      'reading': [
        'Take detailed notes and rewrite them in your own words',
        'Summarize key points after reading a chapter',
        'Create outlines of complex topics',
        'Use practice questions with detailed rationales'
      ],
      'kinesthetic': [
        'Act out procedures using household items',
        'Create physical flashcards you can manipulate',
        'Study while standing or walking when possible',
        'Use simulation scenarios to apply knowledge'
      ]
    };
    
    return [...commonTips, ...styleTips[style].slice(0, 2)];
  };
  
  // Handle learning style selection
  const handleLearningStyleChange = (style: LearningStyle) => {
    setPreferences({...preferences, learningStyle: style});
  };
  
  // Handle time commitment selection
  const handleTimeCommitmentChange = (time: TimeCommitment) => {
    setPreferences({...preferences, timeCommitment: time});
  };
  
  // Handle days until exam change
  const handleDaysChange = (days: number[]) => {
    setPreferences({...preferences, daysUntilExam: days[0]});
  };
  
  // Handle confidence level change
  const handleConfidenceChange = (confidence: number[]) => {
    setPreferences({...preferences, confidenceLevel: confidence[0]});
  };
  
  // Toggle strength area selection
  const toggleStrengthArea = (area: StrengthArea) => {
    if (preferences.strengthAreas.includes(area)) {
      setPreferences({
        ...preferences, 
        strengthAreas: preferences.strengthAreas.filter(a => a !== area)
      });
    } else {
      setPreferences({
        ...preferences, 
        strengthAreas: [...preferences.strengthAreas, area]
      });
    }
  };
  
  // Toggle weakness area selection
  const toggleWeaknessArea = (area: WeaknessArea) => {
    if (preferences.weaknessAreas.includes(area)) {
      setPreferences({
        ...preferences, 
        weaknessAreas: preferences.weaknessAreas.filter(a => a !== area)
      });
    } else {
      setPreferences({
        ...preferences, 
        weaknessAreas: [...preferences.weaknessAreas, area]
      });
    }
  };
  
  // Create the study plan when user completes preferences
  const handleCreatePlan = () => {
    setCurrentStep('plan');
  };
  
  // Edit preferences
  const handleEditPreferences = () => {
    setCurrentStep('preferences');
  };
  
  // Get the personalized study plan
  const studyPlan = generateStudyPlan();
  
  // JSX for the preferences form
  const preferencesForm = (
    <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <CardHeader>
        <CardTitle>Personalize Your Study Strategy</CardTitle>
        <CardDescription>
          Answer a few questions to get a customized NCLEX preparation plan
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Learning Style Selection */}
        <div>
          <h3 className="text-lg font-medium mb-3">What's your preferred learning style?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { value: 'visual', label: 'Visual', description: 'Learn best from images, diagrams, and videos' },
              { value: 'auditory', label: 'Auditory', description: 'Learn best from lectures, discussions, and audio' },
              { value: 'reading', label: 'Reading/Writing', description: 'Learn best from reading and taking notes' },
              { value: 'kinesthetic', label: 'Kinesthetic', description: 'Learn best from hands-on practice and activities' }
            ].map((style) => (
              <div
                key={style.value}
                className={cn(
                  "relative border-2 border-black rounded-md p-4 cursor-pointer",
                  preferences.learningStyle === style.value ? "bg-blue-50" : "bg-white"
                )}
                onClick={() => handleLearningStyleChange(style.value as LearningStyle)}
              >
                <h4 className="font-medium">{style.label}</h4>
                <p className="text-sm text-gray-600">{style.description}</p>
                {preferences.learningStyle === style.value && (
                  <CheckCircle2 className="h-5 w-5 text-blue-500 absolute top-2 right-2" />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Time Commitment */}
        <div>
          <h3 className="text-lg font-medium mb-3">How much time can you commit to studying?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { value: 'minimal', label: 'Minimal', description: '1-2 hours per day' },
              { value: 'moderate', label: 'Moderate', description: '3-4 hours per day' },
              { value: 'intensive', label: 'Intensive', description: '5+ hours per day' }
            ].map((time) => (
              <div
                key={time.value}
                className={cn(
                  "relative border-2 border-black rounded-md p-4 cursor-pointer",
                  preferences.timeCommitment === time.value ? "bg-blue-50" : "bg-white"
                )}
                onClick={() => handleTimeCommitmentChange(time.value as TimeCommitment)}
              >
                <h4 className="font-medium">{time.label}</h4>
                <p className="text-sm text-gray-600">{time.description}</p>
                {preferences.timeCommitment === time.value && (
                  <CheckCircle2 className="h-5 w-5 text-blue-500 absolute top-2 right-2" />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Strength Areas */}
        <div>
          <h3 className="text-lg font-medium mb-3">What are your strongest areas? (Select all that apply)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { value: 'med-surg', label: 'Medical-Surgical' },
              { value: 'pediatrics', label: 'Pediatrics' },
              { value: 'obstetrics', label: 'Obstetrics' },
              { value: 'psych', label: 'Psychiatric Nursing' },
              { value: 'pharmacology', label: 'Pharmacology' },
              { value: 'fundamentals', label: 'Fundamentals' }
            ].map((area) => (
              <div
                key={area.value}
                className={cn(
                  "relative border-2 border-black rounded-md p-3 cursor-pointer",
                  preferences.strengthAreas.includes(area.value as StrengthArea) ? "bg-green-50" : "bg-white"
                )}
                onClick={() => toggleStrengthArea(area.value as StrengthArea)}
              >
                <h4 className="font-medium">{area.label}</h4>
                {preferences.strengthAreas.includes(area.value as StrengthArea) && (
                  <CheckCircle2 className="h-5 w-5 text-green-500 absolute top-2 right-2" />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Weakness Areas */}
        <div>
          <h3 className="text-lg font-medium mb-3">What areas do you need the most improvement? (Select all that apply)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { value: 'med-surg', label: 'Medical-Surgical' },
              { value: 'pediatrics', label: 'Pediatrics' },
              { value: 'obstetrics', label: 'Obstetrics' },
              { value: 'psych', label: 'Psychiatric Nursing' },
              { value: 'pharmacology', label: 'Pharmacology' },
              { value: 'fundamentals', label: 'Fundamentals' }
            ].map((area) => (
              <div
                key={area.value}
                className={cn(
                  "relative border-2 border-black rounded-md p-3 cursor-pointer",
                  preferences.weaknessAreas.includes(area.value as WeaknessArea) ? "bg-red-50" : "bg-white"
                )}
                onClick={() => toggleWeaknessArea(area.value as WeaknessArea)}
              >
                <h4 className="font-medium">{area.label}</h4>
                {preferences.weaknessAreas.includes(area.value as WeaknessArea) && (
                  <CheckCircle2 className="h-5 w-5 text-red-500 absolute top-2 right-2" />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Days Until Exam */}
        <div>
          <h3 className="text-lg font-medium mb-3">How many days until your exam?</h3>
          <div className="space-y-3">
            <Slider 
              defaultValue={[preferences.daysUntilExam]} 
              max={90} 
              min={7}
              step={1}
              onValueChange={handleDaysChange}
            />
            <div className="flex justify-between">
              <span>7 days</span>
              <span className="font-bold">{preferences.daysUntilExam} days</span>
              <span>90 days</span>
            </div>
          </div>
        </div>
        
        {/* Confidence Level */}
        <div>
          <h3 className="text-lg font-medium mb-3">How confident are you in passing the NCLEX?</h3>
          <div className="space-y-3">
            <Slider 
              defaultValue={[preferences.confidenceLevel]} 
              max={100} 
              step={5}
              onValueChange={handleConfidenceChange}
            />
            <div className="flex justify-between">
              <span>Not confident</span>
              <span className="font-bold">{preferences.confidenceLevel}%</span>
              <span>Very confident</span>
            </div>
          </div>
        </div>

        {/* Study Plan Name */}
        <div>
          <h3 className="text-lg font-medium mb-3">Name your study plan</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={preferences.studyName}
              onChange={(e) => setPreferences({...preferences, studyName: e.target.value})}
              placeholder="Enter a name for your study plan"
              className="w-full p-2 border-2 border-black rounded-md focus:outline-none focus:border-[#4B9CD3] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            />
            <p className="text-sm text-gray-500">
              Give your study plan a name to help you identify it later.
            </p>
          </div>
        </div>

        {/* Difficulty Level */}
        <div>
          <h3 className="text-lg font-medium mb-3">Select your difficulty level</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { value: 'beginner', label: 'Beginner', description: 'Just starting to prepare for NCLEX' },
              { value: 'intermediate', label: 'Intermediate', description: 'Some preparation completed' },
              { value: 'advanced', label: 'Advanced', description: 'Well-prepared, focusing on weak areas' }
            ].map((difficulty) => (
              <div
                key={difficulty.value}
                className={cn(
                  "relative border-2 border-black rounded-md p-4 cursor-pointer",
                  preferences.difficultyLevel === difficulty.value ? "bg-blue-50" : "bg-white"
                )}
                onClick={() => setPreferences({...preferences, difficultyLevel: difficulty.value as DifficultyLevel})}
              >
                <h4 className="font-medium">{difficulty.label}</h4>
                <p className="text-sm text-gray-600">{difficulty.description}</p>
                {preferences.difficultyLevel === difficulty.value && (
                  <CheckCircle2 className="h-5 w-5 text-blue-500 absolute top-2 right-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleCreatePlan}
          className="w-full"
        >
          Create My Study Plan
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
  
  // JSX for the study plan
  const studyPlanDisplay = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Your Personalized NCLEX Study Plan</CardTitle>
              <CardDescription>
                Based on your learning style: <span className="font-medium capitalize">{preferences.learningStyle}</span> | 
                Time commitment: <span className="font-medium capitalize">{preferences.timeCommitment}</span> |
                Days until exam: <span className="font-medium">{preferences.daysUntilExam}</span>
              </CardDescription>
            </div>
            <Button variant="outline" onClick={handleEditPreferences}>
              Edit Preferences
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Daily Schedule */}
            <Card className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-blue-500" />
                  Daily Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditingSchedule ? (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label className="font-medium">Morning:</label>
                      <input
                        type="text"
                        value={editedSchedule.morning}
                        onChange={(e) => setEditedSchedule({...editedSchedule, morning: e.target.value})}
                        placeholder="Enter morning activity"
                        className="w-full p-2 border-2 border-black rounded-md focus:outline-none focus:border-[#4B9CD3] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-medium">Afternoon:</label>
                      <input
                        type="text"
                        value={editedSchedule.afternoon}
                        onChange={(e) => setEditedSchedule({...editedSchedule, afternoon: e.target.value})}
                        placeholder="Enter afternoon activity"
                        className="w-full p-2 border-2 border-black rounded-md focus:outline-none focus:border-[#4B9CD3] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-medium">Evening:</label>
                      <input
                        type="text"
                        value={editedSchedule.evening}
                        onChange={(e) => setEditedSchedule({...editedSchedule, evening: e.target.value})}
                        placeholder="Enter evening activity"
                        className="w-full p-2 border-2 border-black rounded-md focus:outline-none focus:border-[#4B9CD3] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button 
                        size="sm" 
                        onClick={() => {
                          setIsEditingSchedule(false);
                        }}
                      >
                        Save Changes
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setIsEditingSchedule(false);
                          setEditedSchedule({
                            morning: studyPlan.dailySchedule.morning,
                            afternoon: studyPlan.dailySchedule.afternoon,
                            evening: studyPlan.dailySchedule.evening
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Morning:</span>
                      <span>{studyPlan.dailySchedule.morning}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Afternoon:</span>
                      <span>{studyPlan.dailySchedule.afternoon}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Evening:</span>
                      <span>{studyPlan.dailySchedule.evening}</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        setEditedSchedule(studyPlan.dailySchedule);
                        setIsEditingSchedule(true);
                      }}
                      className="w-full mt-2"
                    >
                      Customize Schedule
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Weekly Goals */}
            <Card className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-green-500" />
                  Weekly Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {studyPlan.weeklyGoals.map((goal, index) => (
                    <li key={`preset-${index}`} className="flex items-start">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span>{goal}</span>
                    </li>
                  ))}
                  
                  {studyPlan.customGoals && studyPlan.customGoals.map((goal, index) => (
                    <li key={`custom-${index}`} className="flex items-start">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                      <span className="flex-1">{goal}</span>
                      <button 
                        onClick={() => {
                          const newCustomGoals = [...customGoals];
                          newCustomGoals.splice(index, 1);
                          setCustomGoals(newCustomGoals);
                        }}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-4 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customGoal}
                      onChange={(e) => setCustomGoal(e.target.value)}
                      placeholder="Add a custom goal..."
                      className="flex-1 p-2 border-2 border-black rounded-md focus:outline-none focus:border-[#4B9CD3] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && customGoal.trim() !== '') {
                          setCustomGoals([...customGoals, customGoal]);
                          setCustomGoal('');
                        }
                      }}
                    />
                    <Button 
                      size="sm"
                      onClick={() => {
                        if (customGoal.trim() !== '') {
                          setCustomGoals([...customGoals, customGoal]);
                          setCustomGoal('');
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">Press Enter or click Add to save your custom goal</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Focus Areas with Progress Bars */}
          <Card className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Recommended Focus Areas</CardTitle>
              <CardDescription>Allocate your study time according to these percentages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studyPlan.focusAreas.map((area, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{area.area}</span>
                      <span>{area.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${area.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Recommended Resources */}
          <Card className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Recommended Resources</CardTitle>
              <CardDescription>Based on your learning style preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {studyPlan.recommendedResources.map((resource, index) => (
                  <Card key={index} className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        {resource.icon}
                        <span className="ml-2">{resource.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{resource.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Study Tips */}
          <Card className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
                Study Tips For {preferences.learningStyle === 'kinesthetic' ? 'Hands-on' : 
                               preferences.learningStyle === 'auditory' ? 'Auditory' :
                               preferences.learningStyle === 'reading' ? 'Reading/Writing' : 'Visual'} Learners
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {studyPlan.studyTips.map((tip, index) => (
                  <li key={`preset-tip-${index}`} className="flex items-start">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
                
                {studyPlan.customTips && studyPlan.customTips.map((tip, index) => (
                  <li key={`custom-tip-${index}`} className="flex items-start">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-purple-500 mt-1 flex-shrink-0" />
                    <span className="flex-1">{tip}</span>
                    <button 
                      onClick={() => {
                        const newCustomTips = [...customTips];
                        newCustomTips.splice(index, 1);
                        setCustomTips(newCustomTips);
                      }}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
              
              <div className="mt-4 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customTip}
                    onChange={(e) => setCustomTip(e.target.value)}
                    placeholder="Add your own study tip..."
                    className="flex-1 p-2 border-2 border-black rounded-md focus:outline-none focus:border-[#4B9CD3] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && customTip.trim() !== '') {
                        setCustomTips([...customTips, customTip]);
                        setCustomTip('');
                      }
                    }}
                  />
                  <Button 
                    size="sm"
                    onClick={() => {
                      if (customTip.trim() !== '') {
                        setCustomTips([...customTips, customTip]);
                        setCustomTip('');
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <p className="text-xs text-gray-500">Add your own tips based on what works for you</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Weekly Schedule */}
          <Card className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-indigo-500" />
                Weekly Schedule
              </CardTitle>
              <CardDescription>Your personalized weekly study plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border px-2 py-2 bg-gray-100 text-left">Day</th>
                      <th className="border px-2 py-2 bg-gray-100 text-left">Focus Area</th>
                      <th className="border px-2 py-2 bg-gray-100 text-left">Tasks</th>
                      <th className="border px-2 py-2 bg-gray-100 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(studyPlan.weekSchedule).map(([day, data]) => (
                      <tr key={day}>
                        <td className="border px-2 py-2 font-medium capitalize">{day}</td>
                        <td className="border px-2 py-2">{data.focus}</td>
                        <td className="border px-2 py-2">
                          <ul className="list-disc pl-5 space-y-1">
                            {data.tasks.map((task, i) => (
                              <li key={i}>{task}</li>
                            ))}
                          </ul>
                        </td>
                        <td className="border px-2 py-2 text-center">
                          <button
                            onClick={() => {
                              // Clone the schedule and update the completion status
                              const newSchedule = { ...studyPlan.weekSchedule };
                              newSchedule[day as DayOfWeek].completed = !data.completed;
                              
                              // We would normally update the state here
                              // This is just a UI demonstration for now
                            }}
                            className={`w-6 h-6 rounded-full ${
                              data.completed ? 'bg-green-500' : 'bg-gray-200'
                            } flex items-center justify-center`}
                          >
                            {data.completed && (
                              <CheckCircle2 className="h-4 w-4 text-white" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          {/* Save and Print Buttons */}
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline"
              onClick={() => {
                // Generate a unique ID for the plan
                const id = `plan-${Date.now()}`;
                const newSavedPlan: SavedPlan = {
                  id,
                  name: studyPlan.name,
                  createdAt: studyPlan.createdAt,
                  preferences,
                  plan: studyPlan
                };
                setSavedPlans([...savedPlans, newSavedPlan]);
                alert("Study plan saved! You can access it later from your saved plans.");
              }}
            >
              Save Plan
            </Button>
            <Button>
              Print Study Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
  
  return (
    <div className="w-full max-w-6xl mx-auto">
      {currentStep === 'preferences' ? preferencesForm : studyPlanDisplay}
    </div>
  );
}