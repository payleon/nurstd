import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { BookOpen, Lightbulb, CheckCircle2, Brain, LineChart, Calendar, Pencil, Save, Edit2, Trash2, Plus, X, CheckSquare, Clock, Circle, BrainCircuit, Divide, ClipboardCheck, FileQuestion, Star } from 'lucide-react';

// Type definitions for the component
type LearningStyle = 'visual' | 'auditory' | 'reading' | 'kinesthetic';
type TimeCommitment = 'minimal' | 'moderate' | 'intensive';
type StrengthArea = 'med-surg' | 'pediatrics' | 'obstetrics' | 'psych' | 'pharmacology' | 'fundamentals';
type WeaknessArea = StrengthArea;
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
type GoalCategory = 'content-mastery' | 'practice' | 'exam-prep' | 'time-management' | 'custom';

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

// Interface for schedule tasks
interface ScheduleTask {
  id: string;
  content: string;
  duration: number; // in minutes
  isCompleted: boolean;
  priority: 'high' | 'medium' | 'low';
}

// Interface for time blocks
interface TimeBlock {
  id: string;
  startTime: string;
  endTime: string;
  tasks: ScheduleTask[];
}

// Enhanced daily schedule with time blocks
interface EnhancedDailySchedule {
  morning: string;
  afternoon: string;
  evening: string;
  timeBlocks?: TimeBlock[];
  useDetailedSchedule?: boolean;
}

// Interface for study goals
interface StudyGoal {
  id: string;
  content: string;
  category: GoalCategory;
  deadline?: string;
  isCompleted: boolean;
  progress?: number;
  priority: 'high' | 'medium' | 'low';
}

// Study plan interface with enhanced features
interface StudyPlan {
  name: string;
  createdAt: string;
  lastEdited: string;
  dailySchedule: EnhancedDailySchedule;
  weeklyGoals: string[];
  customGoals: string[];
  structuredGoals?: StudyGoal[];
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
      customTasks?: ScheduleTask[];
      useDetailedSchedule?: boolean;
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
    weaknessAreas: ['pharmacology', 'fundamentals'],
    daysUntilExam: 30,
    confidenceLevel: 6,
    difficultyLevel: 'intermediate',
    studyName: 'My NCLEX Study Plan'
  });

  // Saved plans
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  
  // State for editing daily schedule
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [editedSchedule, setEditedSchedule] = useState<{morning: string; afternoon: string; evening: string}>({
    morning: "",
    afternoon: "",
    evening: ""
  });
  
  // State for time blocks
  const [useDetailedSchedule, setUseDetailedSchedule] = useState(false);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([
    {
      id: "morning-1",
      startTime: "08:00",
      endTime: "09:30",
      tasks: []
    },
    {
      id: "afternoon-1",
      startTime: "13:00",
      endTime: "15:00",
      tasks: []
    },
    {
      id: "evening-1",
      startTime: "19:00",
      endTime: "21:00",
      tasks: []
    }
  ]);
  
  // Weekly schedule editing state
  const [isEditingWeekSchedule, setIsEditingWeekSchedule] = useState(false);
  const [activeEditingDay, setActiveEditingDay] = useState<DayOfWeek | null>(null);
  const [editedWeekSchedule, setEditedWeekSchedule] = useState<{[key in DayOfWeek]?: {tasks: string[], focus: string}}>({});
  
  // Structured goals state
  const [structuredGoals, setStructuredGoals] = useState<StudyGoal[]>([]);
  const [newGoal, setNewGoal] = useState<StudyGoal>({
    id: '',
    content: '',
    category: 'content-mastery',
    isCompleted: false,
    priority: 'medium',
    deadline: undefined
  });
  
  // State for custom tips and goals
  const [customTip, setCustomTip] = useState("");
  const [customGoal, setCustomGoal] = useState("");
  const [customTips, setCustomTips] = useState<string[]>([]);
  const [customGoals, setCustomGoals] = useState<string[]>([]);
  
  // Track which step of the planner we're on
  const [currentStep, setCurrentStep] = useState<'preferences' | 'plan'>('preferences');
  
  // Track the current plan for state updates
  const [currentPlan, setCurrentPlan] = useState<StudyPlan | null>(null);
  
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
  
  // Generate personalized study plan based on preferences
  const generateStudyPlan = (): StudyPlan => {
    // Adjust daily schedule based on time commitment
    let dailySchedule: EnhancedDailySchedule = {
      morning: "Review flashcards for 30 minutes",
      afternoon: "Complete 20 practice questions",
      evening: "Study content review for 1 hour",
      useDetailedSchedule: useDetailedSchedule
    };
    
    if (preferences.timeCommitment === 'minimal') {
      dailySchedule = {
        morning: "Review 10 flashcards",
        afternoon: "Complete 10 practice questions",
        evening: "Review weak areas for 30 minutes",
        useDetailedSchedule: useDetailedSchedule
      };
    } else if (preferences.timeCommitment === 'intensive') {
      dailySchedule = {
        morning: "Content review for 2 hours",
        afternoon: "Complete 50 practice questions and analyze results",
        evening: "Study summary notes and prepare for tomorrow",
        useDetailedSchedule: useDetailedSchedule
      };
    }
    
    // Override with edited schedule if available
    if (isEditingSchedule && editedSchedule.morning && editedSchedule.afternoon && editedSchedule.evening) {
      dailySchedule = {
        ...editedSchedule,
        useDetailedSchedule: useDetailedSchedule,
        timeBlocks: timeBlocks.length > 0 ? timeBlocks : undefined
      };
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
    
    // Apply any edited weekly schedule tasks
    if (isEditingWeekSchedule && Object.keys(editedWeekSchedule).length > 0) {
      Object.keys(editedWeekSchedule).forEach(day => {
        const typedDay = day as DayOfWeek;
        if (editedWeekSchedule[typedDay]) {
          weekSchedule[typedDay] = {
            ...weekSchedule[typedDay],
            ...editedWeekSchedule[typedDay],
            completed: false
          };
        }
      });
    }
    
    // Add default structured goals based on preferences
    const defaultStructuredGoals: StudyGoal[] = [
      {
        id: 'goal-1',
        content: `Complete ${weeklyQuestions} practice questions`,
        category: 'practice',
        isCompleted: false,
        priority: 'high'
      },
      {
        id: 'goal-2',
        content: `Master ${preferences.weaknessAreas.length * 2} concepts in your weak areas`,
        category: 'content-mastery',
        isCompleted: false,
        priority: 'high',
        deadline: new Date(Date.now() + preferences.daysUntilExam * 86400000 * 0.7).toISOString().split('T')[0]
      },
      {
        id: 'goal-3',
        content: `Take at least 3 practice mini-exams`,
        category: 'exam-prep',
        isCompleted: false,
        priority: 'medium'
      }
    ];
    
    // Combine default and user-created structured goals
    const combinedStructuredGoals = [...defaultStructuredGoals, ...structuredGoals];
    
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
      structuredGoals: combinedStructuredGoals,
      recommendedResources: getRecommendedResources(preferences),
      focusAreas,
      studyTips,
      customTips,
      weekSchedule
    };
  };
  
  // Get recommendations based on learning style
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
  
  // Helper function to get color for chart based on index
  const getColorByIndex = (index: number) => {
    const colors = ['blue', 'green', 'purple', 'red', 'orange', 'yellow'];
    return colors[index % colors.length];
  };
  
  // Helper function to render pie chart SVG segments
  const renderPieChart = (areas: {area: string, percentage: number}[]) => {
    let startAngle = 0;
    return areas.map((area, index) => {
      const endAngle = startAngle + (area.percentage / 100 * 360);
      
      // Calculate SVG arc path
      const x1 = 50 + 45 * Math.cos((startAngle - 90) * Math.PI / 180);
      const y1 = 50 + 45 * Math.sin((startAngle - 90) * Math.PI / 180);
      const x2 = 50 + 45 * Math.cos((endAngle - 90) * Math.PI / 180);
      const y2 = 50 + 45 * Math.sin((endAngle - 90) * Math.PI / 180);
      
      // Determine if angle is large (more than 180 degrees)
      const largeArcFlag = (endAngle - startAngle <= 180) ? "0" : "1";
      
      // Create SVG arc
      const pathData = `M 50 50 L ${x1} ${y1} A 45 45 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
      
      const element = (
        <path 
          key={`pie-${index}`}
          d={pathData} 
          fill={`hsl(${210 + index * 30}, 70%, ${60 - index * 5}%)`}
        />
      );
      
      // Update start angle for next segment
      startAngle = endAngle;
      return element;
    });
  };
  
  // Helper function to get recommended daily study time in minutes
  const getRecommendedDailyMinutes = (commitment: TimeCommitment, percentage: number) => {
    const totalMinutes = 
      commitment === 'minimal' ? 90 : // 1.5 hours
      commitment === 'moderate' ? 180 : // 3 hours
      300; // 5 hours for intensive
      
    return Math.round((percentage / 100) * totalMinutes);
  };
  
  // Helper function to get the total weekly hours
  const getTotalWeeklyHours = (commitment: TimeCommitment) => {
    return commitment === 'minimal' ? '10-12' : 
           commitment === 'moderate' ? '20-25' : '35-40';
  };
  
  // Handler functions for user interactions
  
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
    const plan = generateStudyPlan();
    setCurrentPlan(plan);
  };
  
  // Edit preferences
  const handleEditPreferences = () => {
    setCurrentStep('preferences');
  };
  
  // Add new structured goal
  const handleAddStructuredGoal = () => {
    if (newGoal.content.trim() === '') return;
    
    const newStructuredGoal: StudyGoal = {
      id: `goal-${Date.now()}`,
      content: newGoal.content,
      category: newGoal.category,
      isCompleted: false,
      priority: newGoal.priority,
      deadline: newGoal.deadline
    };
    
    setStructuredGoals([...structuredGoals, newStructuredGoal]);
    setNewGoal({
      id: '',
      content: '',
      category: 'content-mastery',
      isCompleted: false,
      priority: 'medium'
    });

    // Update current plan if exists
    if (currentPlan && currentPlan.structuredGoals) {
      setCurrentPlan({
        ...currentPlan,
        structuredGoals: [...currentPlan.structuredGoals, newStructuredGoal]
      });
    }
  };
  
  // Toggle goal completion
  const toggleGoalCompletion = (goalId: string) => {
    // Update local state
    setStructuredGoals(structuredGoals.map(goal => 
      goal.id === goalId ? {...goal, isCompleted: !goal.isCompleted} : goal
    ));
    
    // Update current plan if exists
    if (currentPlan && currentPlan.structuredGoals) {
      setCurrentPlan({
        ...currentPlan,
        structuredGoals: currentPlan.structuredGoals.map(goal => 
          goal.id === goalId ? {...goal, isCompleted: !goal.isCompleted} : goal
        )
      });
    }
  };
  
  // Delete a structured goal
  const deleteStructuredGoal = (goalId: string) => {
    // Update local state
    setStructuredGoals(structuredGoals.filter(goal => goal.id !== goalId));
    
    // Update current plan if exists
    if (currentPlan && currentPlan.structuredGoals) {
      setCurrentPlan({
        ...currentPlan,
        structuredGoals: currentPlan.structuredGoals.filter(goal => goal.id !== goalId)
      });
    }
  };
  
  // Add time block
  const addTimeBlock = () => {
    const newTimeBlock: TimeBlock = {
      id: `time-block-${Date.now()}`,
      startTime: '12:00',
      endTime: '13:00',
      tasks: []
    };
    
    setTimeBlocks([...timeBlocks, newTimeBlock]);
  };
  
  // Edit time block
  const updateTimeBlock = (id: string, updates: Partial<TimeBlock>) => {
    setTimeBlocks(timeBlocks.map(block => 
      block.id === id ? {...block, ...updates} : block
    ));
  };
  
  // Add task to time block
  const addTaskToTimeBlock = (blockId: string, task: ScheduleTask) => {
    setTimeBlocks(timeBlocks.map(block => 
      block.id === blockId 
        ? {...block, tasks: [...block.tasks, task]} 
        : block
    ));
  };
  
  // Delete time block
  const deleteTimeBlock = (blockId: string) => {
    setTimeBlocks(timeBlocks.filter(block => block.id !== blockId));
  };
  
  // Edit weekly schedule for a specific day
  const handleEditDaySchedule = (day: DayOfWeek, focus: string, tasks: string[]) => {
    setEditedWeekSchedule({
      ...editedWeekSchedule,
      [day]: { focus, tasks }
    });
  };
  
  // Save the current plan
  const handleSavePlan = () => {
    const plan = generateStudyPlan();
    const savedPlan: SavedPlan = {
      id: `plan-${Date.now()}`,
      name: plan.name,
      createdAt: plan.createdAt,
      preferences,
      plan
    };
    
    setSavedPlans([...savedPlans, savedPlan]);
  };
  
  // Helper to get category label and icon
  const getCategoryInfo = (category: GoalCategory) => {
    switch(category) {
      case 'content-mastery':
        return { 
          label: 'Content Mastery', 
          icon: <BookOpen className="h-4 w-4 text-blue-600" /> 
        };
      case 'practice':
        return { 
          label: 'Practice', 
          icon: <CheckSquare className="h-4 w-4 text-green-600" /> 
        };
      case 'exam-prep':
        return { 
          label: 'Exam Preparation', 
          icon: <FileQuestion className="h-4 w-4 text-purple-600" /> 
        };
      case 'time-management':
        return { 
          label: 'Time Management', 
          icon: <Clock className="h-4 w-4 text-amber-600" /> 
        };
      case 'custom':
        return { 
          label: 'Custom Goal', 
          icon: <Lightbulb className="h-4 w-4 text-orange-600" /> 
        };
      default:
        return { 
          label: 'Other', 
          icon: <Circle className="h-4 w-4 text-gray-500" /> 
        };
    }
  };
  
  // Helper to get priority color
  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get the personalized study plan
  const studyPlan = currentPlan || generateStudyPlan();
  
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
              {value: 'visual', label: 'Visual', icon: <BookOpen className="h-5 w-5" />, desc: 'You learn best from images, diagrams, and visual aids'},
              {value: 'auditory', label: 'Auditory', icon: <BrainCircuit className="h-5 w-5" />, desc: 'You learn best by listening and speaking'},
              {value: 'reading', label: 'Reading/Writing', icon: <FileQuestion className="h-5 w-5" />, desc: 'You learn best from text and writing'},
              {value: 'kinesthetic', label: 'Hands-on', icon: <Lightbulb className="h-5 w-5" />, desc: 'You learn best through physical activity'}
            ].map(style => (
              <Card 
                key={style.value}
                className={`border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:bg-gray-50 transition-colors ${preferences.learningStyle === style.value ? 'bg-blue-50 border-blue-500' : 'border-black'}`}
                onClick={() => handleLearningStyleChange(style.value as LearningStyle)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${preferences.learningStyle === style.value ? 'bg-blue-100 text-blue-500' : 'bg-gray-100'}`}>
                      {style.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{style.label}</h4>
                      <p className="text-sm text-gray-500">{style.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Time Commitment */}
        <div>
          <h3 className="text-lg font-medium mb-3">How much time can you commit to studying?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {value: 'minimal', label: 'Minimal (1-2 hrs/day)', desc: '10-12 hours per week'},
              {value: 'moderate', label: 'Moderate (3-4 hrs/day)', desc: '20-25 hours per week'},
              {value: 'intensive', label: 'Intensive (5+ hrs/day)', desc: '35+ hours per week'}
            ].map(option => (
              <Card 
                key={option.value}
                className={`border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:bg-gray-50 transition-colors ${preferences.timeCommitment === option.value ? 'bg-green-50 border-green-500' : 'border-black'}`}
                onClick={() => handleTimeCommitmentChange(option.value as TimeCommitment)}
              >
                <CardContent className="p-4">
                  <div>
                    <h4 className="font-medium">{option.label}</h4>
                    <p className="text-sm text-gray-500">{option.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Strength Areas */}
        <div>
          <h3 className="text-lg font-medium mb-3">Select your strongest areas (choose at least one)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              {value: 'med-surg', label: 'Medical-Surgical'},
              {value: 'pediatrics', label: 'Pediatrics'},
              {value: 'obstetrics', label: 'Obstetrics'},
              {value: 'psych', label: 'Psychiatric'},
              {value: 'pharmacology', label: 'Pharmacology'},
              {value: 'fundamentals', label: 'Fundamentals'}
            ].map(area => (
              <Button 
                key={area.value}
                variant={preferences.strengthAreas.includes(area.value as StrengthArea) ? "default" : "outline"} 
                className={`border-2 ${preferences.strengthAreas.includes(area.value as StrengthArea) ? 'border-blue-500 bg-blue-100 text-blue-700 hover:bg-blue-200' : 'border-black hover:bg-gray-50'} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
                onClick={() => toggleStrengthArea(area.value as StrengthArea)}
              >
                {area.label}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Weakness Areas */}
        <div>
          <h3 className="text-lg font-medium mb-3">Select areas you need to improve (choose at least one)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              {value: 'med-surg', label: 'Medical-Surgical'},
              {value: 'pediatrics', label: 'Pediatrics'},
              {value: 'obstetrics', label: 'Obstetrics'},
              {value: 'psych', label: 'Psychiatric'},
              {value: 'pharmacology', label: 'Pharmacology'},
              {value: 'fundamentals', label: 'Fundamentals'}
            ].map(area => (
              <Button 
                key={area.value}
                variant={preferences.weaknessAreas.includes(area.value as WeaknessArea) ? "default" : "outline"} 
                className={`border-2 ${preferences.weaknessAreas.includes(area.value as WeaknessArea) ? 'border-red-500 bg-red-100 text-red-700 hover:bg-red-200' : 'border-black hover:bg-gray-50'} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
                onClick={() => toggleWeaknessArea(area.value as WeaknessArea)}
              >
                {area.label}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Days Until Exam */}
        <div>
          <h3 className="text-lg font-medium mb-3">Days until your exam</h3>
          <div className="space-y-5">
            <div className="flex justify-between">
              <span>1 week</span>
              <span>1 month</span>
              <span>3+ months</span>
            </div>
            <Slider 
              defaultValue={[preferences.daysUntilExam]} 
              max={90} 
              min={7} 
              step={1} 
              onValueChange={handleDaysChange}
            />
            <div className="text-center font-medium text-lg">
              {preferences.daysUntilExam} days
            </div>
          </div>
        </div>
        
        {/* Confidence Level */}
        <div>
          <h3 className="text-lg font-medium mb-3">How confident do you feel about passing?</h3>
          <div className="space-y-5">
            <div className="flex justify-between">
              <span>Not confident</span>
              <span>Moderately confident</span>
              <span>Very confident</span>
            </div>
            <Slider 
              defaultValue={[preferences.confidenceLevel]} 
              max={10} 
              min={1} 
              step={1} 
              onValueChange={handleConfidenceChange}
            />
            <div className="text-center font-medium text-lg">
              Confidence level: {preferences.confidenceLevel}/10
            </div>
          </div>
        </div>
        
        {/* Difficulty Level */}
        <div>
          <h3 className="text-lg font-medium mb-3">Select preferred difficulty level</h3>
          <Select defaultValue={preferences.difficultyLevel} onValueChange={(value) => setPreferences({...preferences, difficultyLevel: value as DifficultyLevel})}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner (Fundamentals focus)</SelectItem>
              <SelectItem value="intermediate">Intermediate (Mixed content)</SelectItem>
              <SelectItem value="advanced">Advanced (Complex scenarios)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Study Plan Name */}
        <div>
          <h3 className="text-lg font-medium mb-3">Name your study plan</h3>
          <div>
            <input
              type="text"
              value={preferences.studyName}
              onChange={e => setPreferences({...preferences, studyName: e.target.value})}
              placeholder="My NCLEX Study Plan"
              className="w-full p-3 border-2 border-black rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:border-[#4B9CD3]"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleCreatePlan}
          disabled={
            preferences.strengthAreas.length === 0 || 
            preferences.weaknessAreas.length === 0 ||
            preferences.studyName.trim() === ''
          }
          className="bg-[#4B9CD3] hover:bg-[#3d7ca9] text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black"
        >
          Create My Study Plan
        </Button>
      </CardFooter>
    </Card>
  );
  
  // JSX for the study plan display
  const studyPlanDisplay = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader>
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div>
              <CardTitle>{studyPlan.name}</CardTitle>
              <CardDescription>
                Created {new Date(studyPlan.createdAt).toLocaleDateString()} • 
                {preferences.daysUntilExam} days until exam
              </CardDescription>
            </div>
            <Button variant="outline" onClick={handleEditPreferences}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Preferences
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Daily Schedule */}
          <Card className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                  Daily Schedule
                </CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setUseDetailedSchedule(!useDetailedSchedule)}
                  >
                    {useDetailedSchedule ? "Simple View" : "Detailed View"}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      if (isEditingSchedule) {
                        // Save changes
                        setIsEditingSchedule(false);
                      } else {
                        // Start editing and initialize form
                        setEditedSchedule({
                          morning: studyPlan.dailySchedule.morning,
                          afternoon: studyPlan.dailySchedule.afternoon,
                          evening: studyPlan.dailySchedule.evening
                        });
                        setIsEditingSchedule(true);
                      }
                    }}
                  >
                    {isEditingSchedule ? (
                      <>
                        <Save className="mr-1 h-4 w-4" />
                        Save
                      </>
                    ) : (
                      <>
                        <Edit2 className="mr-1 h-4 w-4" />
                        Edit
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {useDetailedSchedule ? (
                <div className="space-y-4">
                  {/* Time blocks for detailed schedule */}
                  {timeBlocks.map((block, index) => (
                    <div key={block.id} className="border-2 border-black rounded-md p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{block.startTime} - {block.endTime}</span>
                          {isEditingSchedule && (
                            <div className="flex gap-2">
                              <input 
                                type="time" 
                                value={block.startTime}
                                onChange={(e) => updateTimeBlock(block.id, { startTime: e.target.value })}
                                className="border rounded p-1 text-sm w-24"
                              />
                              <span>-</span>
                              <input 
                                type="time" 
                                value={block.endTime}
                                onChange={(e) => updateTimeBlock(block.id, { endTime: e.target.value })}
                                className="border rounded p-1 text-sm w-24"
                              />
                            </div>
                          )}
                        </div>
                        {isEditingSchedule && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => deleteTimeBlock(block.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        {block.tasks.length > 0 ? (
                          <ul className="space-y-1">
                            {block.tasks.map((task) => (
                              <li key={task.id} className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <input 
                                    type="checkbox" 
                                    checked={task.isCompleted}
                                    onChange={() => {
                                      updateTimeBlock(block.id, {
                                        tasks: block.tasks.map(t => 
                                          t.id === task.id ? {...t, isCompleted: !t.isCompleted} : t
                                        )
                                      });
                                    }}
                                    className="mr-2"
                                  />
                                  <span className={task.isCompleted ? 'line-through text-gray-400' : ''}>
                                    {task.content} ({task.duration} min)
                                  </span>
                                </div>
                                {isEditingSchedule && (
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => {
                                      updateTimeBlock(block.id, {
                                        tasks: block.tasks.filter(t => t.id !== task.id)
                                      });
                                    }}
                                    className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 text-sm italic">No tasks scheduled for this time block</p>
                        )}
                        
                        {isEditingSchedule && (
                          <div className="flex gap-2 mt-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                const newTask: ScheduleTask = {
                                  id: `task-${Date.now()}`,
                                  content: "New task",
                                  duration: 30,
                                  isCompleted: false,
                                  priority: 'medium'
                                };
                                addTaskToTimeBlock(block.id, newTask);
                              }}
                              className="text-xs"
                            >
                              <Plus className="h-3 w-3 mr-1" /> Add Task
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isEditingSchedule && (
                    <Button 
                      variant="outline" 
                      onClick={addTimeBlock}
                      className="w-full border-dashed"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Time Block
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Simple daily schedule */}
                  {['morning', 'afternoon', 'evening'].map((time) => (
                    <div key={time} className="border-2 border-black rounded-md p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <h4 className="font-medium capitalize mb-2">{time}</h4>
                      {isEditingSchedule ? (
                        <textarea
                          value={editedSchedule[time as keyof typeof editedSchedule]}
                          onChange={(e) => setEditedSchedule({
                            ...editedSchedule,
                            [time]: e.target.value
                          })}
                          className="w-full p-2 border-2 border-gray-300 rounded-md"
                          rows={2}
                        />
                      ) : (
                        <p>{studyPlan.dailySchedule[time as keyof EnhancedDailySchedule] as string}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Study Goals with Structured Format */}
          <Card className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-green-500" />
                  Study Goals
                </CardTitle>
                <Tabs defaultValue="simple" className="w-[200px]">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="simple">Simple</TabsTrigger>
                    <TabsTrigger value="structured">Structured</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <CardDescription>Track your progress with clear goals</CardDescription>
            </CardHeader>
            <CardContent>
              <TabsContent value="simple" className="mt-0">
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
                        <X className="h-4 w-4" />
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
                </div>
              </TabsContent>

              <TabsContent value="structured" className="mt-0">
                <div className="space-y-4">
                  {/* Structured goals list */}
                  <div>
                    {studyPlan.structuredGoals && studyPlan.structuredGoals.length > 0 ? (
                      <div className="space-y-3">
                        {studyPlan.structuredGoals.map((goal) => (
                          <div 
                            key={goal.id} 
                            className="p-3 border-2 border-black rounded-md bg-white hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center">
                                <input 
                                  type="checkbox" 
                                  id={`goal-${goal.id}`}
                                  checked={goal.isCompleted}
                                  onChange={() => toggleGoalCompletion(goal.id)}
                                  className="mr-2 h-4 w-4"
                                />
                                <label 
                                  htmlFor={`goal-${goal.id}`}
                                  className={`font-medium ${goal.isCompleted ? 'line-through text-gray-400' : ''}`}
                                >
                                  {goal.content}
                                </label>
                              </div>
                              <button 
                                onClick={() => deleteStructuredGoal(goal.id)}
                                className="text-red-500 hover:text-red-700 ml-2"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="flex justify-between items-center pl-6">
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center">
                                  {getCategoryInfo(goal.category).icon}
                                  <span className="text-xs ml-1">{getCategoryInfo(goal.category).label}</span>
                                </div>
                                {goal.deadline && (
                                  <div className="flex items-center">
                                    <Calendar className="h-3 w-3 text-gray-500" />
                                    <span className="text-xs ml-1">{goal.deadline}</span>
                                  </div>
                                )}
                              </div>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(goal.priority)}`}>
                                {goal.priority}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-md">
                        <p className="text-gray-500 mb-2">No structured goals added yet</p>
                        <p className="text-xs text-gray-400">Create goals with categories, priorities, and deadlines</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Add new structured goal form */}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="text-sm font-medium mb-3">Add New Goal</h4>
                    <div className="space-y-3">
                      <div>
                        <input
                          type="text"
                          value={newGoal.content}
                          onChange={(e) => setNewGoal({...newGoal, content: e.target.value})}
                          placeholder="Enter goal description"
                          className="w-full p-2 border-2 border-black rounded-md focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs mb-1">Category</label>
                          <Select 
                            value={newGoal.category}
                            onValueChange={(value) => setNewGoal({...newGoal, category: value as GoalCategory})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="content-mastery">Content Mastery</SelectItem>
                              <SelectItem value="practice">Practice</SelectItem>
                              <SelectItem value="exam-prep">Exam Preparation</SelectItem>
                              <SelectItem value="time-management">Time Management</SelectItem>
                              <SelectItem value="custom">Custom Goal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-xs mb-1">Priority</label>
                          <Select 
                            value={newGoal.priority}
                            onValueChange={(value) => setNewGoal({...newGoal, priority: value as 'high' | 'medium' | 'low'})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Deadline (Optional)</label>
                        <input
                          type="date"
                          value={newGoal.deadline || ''}
                          onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                          className="w-full p-2 border-2 border-black rounded-md focus:outline-none"
                        />
                      </div>
                      <Button 
                        onClick={handleAddStructuredGoal}
                        disabled={!newGoal.content.trim()}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Structured Goal
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
          
          {/* Focus Areas with Enhanced Visualization */}
          <Card className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center">
                  <LineChart className="mr-2 h-5 w-5 text-purple-500" />
                  Recommended Focus Areas
                </CardTitle>
                <Tabs defaultValue="bars" className="w-[180px]">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="bars">Bars</TabsTrigger>
                    <TabsTrigger value="pie">Pie Chart</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <CardDescription>Allocate your study time according to these percentages</CardDescription>
            </CardHeader>
            <CardContent>
              <TabsContent value="bars" className="mt-0">
                <div className="space-y-4">
                  {studyPlan.focusAreas.map((area, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium flex items-center">
                          <span className={`inline-block h-3 w-3 rounded-full mr-2 bg-blue-${300 + (index * 100)}`}></span>
                          {area.area}
                        </span>
                        <span className="text-sm">{area.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`bg-blue-${500 + (index * 100)} h-2.5 rounded-full`}
                          style={{ width: `${area.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-4 border-t pt-4 border-gray-200">
                    <h4 className="text-sm font-medium mb-2">Recommended Daily Time (Based on {preferences.timeCommitment} commitment)</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {studyPlan.focusAreas.map((area, index) => {
                        // Calculate minutes based on time commitment
                        const minutesPerDay = getRecommendedDailyMinutes(preferences.timeCommitment, area.percentage);
                        return (
                          <div key={`time-${index}`} className="flex justify-between">
                            <span>{area.area}:</span>
                            <span className="font-medium">
                              {minutesPerDay} min/day
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="pie" className="mt-0">
                <div className="p-4 flex justify-center">
                  {/* Simple SVG Pie Chart */}
                  <svg viewBox="0 0 100 100" width="200" height="200">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                    {renderPieChart(studyPlan.focusAreas)}
                  </svg>
                </div>
                
                <div className="grid grid-cols-2 mt-4 gap-2">
                  {studyPlan.focusAreas.map((area, index) => (
                    <div key={`legend-${index}`} className="flex items-center text-sm">
                      <span 
                        className="inline-block h-3 w-3 rounded-full mr-2" 
                        style={{ backgroundColor: `hsl(${210 + index * 30}, 70%, ${60 - index * 5}%)` }}
                      ></span>
                      <span className="truncate">{area.area}</span>
                      <span className="ml-1 text-gray-500">({area.percentage}%)</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 border-t pt-4 border-gray-200">
                  <p className="text-sm text-center mb-2">
                    <span className="font-medium">Total weekly study time:</span>{' '}
                    {getTotalWeeklyHours(preferences.timeCommitment)} hours
                  </p>
                  <div className="flex justify-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        // This would open a modal with detailed breakdown in a real app
                        alert('This would show a detailed weekly schedule with subject-specific time blocks');
                      }}
                    >
                      View Detailed Breakdown
                    </Button>
                  </div>
                </div>
              </TabsContent>
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
                      <X className="h-4 w-4" />
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
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-indigo-500" />
                  Weekly Schedule
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditingWeekSchedule(!isEditingWeekSchedule)}
                  className="text-sm"
                >
                  {isEditingWeekSchedule ? (
                    <>
                      <Save className="h-4 w-4 mr-1" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit2 className="h-4 w-4 mr-1" />
                      Customize
                    </>
                  )}
                </Button>
              </div>
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
                      <th className="border px-2 py-2 bg-gray-100 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(studyPlan.weekSchedule).map(([day, data]) => (
                      <tr key={day} className={activeEditingDay === day as DayOfWeek ? 'bg-blue-50' : ''}>
                        <td className="border px-2 py-2 font-medium capitalize">{day}</td>
                        <td className="border px-2 py-2">
                          {activeEditingDay === day as DayOfWeek ? (
                            <input
                              type="text"
                              value={editedWeekSchedule[day as DayOfWeek]?.focus || data.focus}
                              onChange={(e) => {
                                const updatedSchedule = {
                                  ...editedWeekSchedule,
                                  [day as DayOfWeek]: {
                                    ...editedWeekSchedule[day as DayOfWeek] || { tasks: data.tasks },
                                    focus: e.target.value
                                  }
                                };
                                setEditedWeekSchedule(updatedSchedule);
                              }}
                              className="w-full p-1 border rounded"
                            />
                          ) : (
                            data.focus
                          )}
                        </td>
                        <td className="border px-2 py-2">
                          {activeEditingDay === day as DayOfWeek ? (
                            <div className="space-y-2">
                              {(editedWeekSchedule[day as DayOfWeek]?.tasks || data.tasks).map((task, i) => (
                                <div key={i} className="flex items-center gap-1">
                                  <input
                                    type="text"
                                    value={task}
                                    onChange={(e) => {
                                      const updatedTasks = [...(editedWeekSchedule[day as DayOfWeek]?.tasks || data.tasks)];
                                      updatedTasks[i] = e.target.value;
                                      
                                      const updatedSchedule = {
                                        ...editedWeekSchedule,
                                        [day as DayOfWeek]: {
                                          ...editedWeekSchedule[day as DayOfWeek] || { focus: data.focus },
                                          tasks: updatedTasks
                                        }
                                      };
                                      setEditedWeekSchedule(updatedSchedule);
                                    }}
                                    className="flex-1 p-1 border rounded text-sm"
                                  />
                                  <button
                                    onClick={() => {
                                      const updatedTasks = [...(editedWeekSchedule[day as DayOfWeek]?.tasks || data.tasks)];
                                      updatedTasks.splice(i, 1);
                                      
                                      const updatedSchedule = {
                                        ...editedWeekSchedule,
                                        [day as DayOfWeek]: {
                                          ...editedWeekSchedule[day as DayOfWeek] || { focus: data.focus },
                                          tasks: updatedTasks
                                        }
                                      };
                                      setEditedWeekSchedule(updatedSchedule);
                                    }}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const updatedTasks = [...(editedWeekSchedule[day as DayOfWeek]?.tasks || data.tasks), "New task"];
                                  
                                  const updatedSchedule = {
                                    ...editedWeekSchedule,
                                    [day as DayOfWeek]: {
                                      ...editedWeekSchedule[day as DayOfWeek] || { focus: data.focus },
                                      tasks: updatedTasks
                                    }
                                  };
                                  setEditedWeekSchedule(updatedSchedule);
                                }}
                                className="w-full text-xs"
                              >
                                <Plus className="h-3 w-3 mr-1" /> Add Task
                              </Button>
                            </div>
                          ) : (
                            <ul className="list-disc pl-5 space-y-1">
                              {data.tasks.map((task, i) => (
                                <li key={i} className={data.completed ? 'line-through text-gray-400' : ''}>
                                  {task}
                                </li>
                              ))}
                            </ul>
                          )}
                        </td>
                        <td className="border px-2 py-2 text-center">
                          {isEditingWeekSchedule ? (
                            <Button
                              size="sm"
                              variant={activeEditingDay === day as DayOfWeek ? "default" : "outline"}
                              onClick={() => {
                                if (activeEditingDay === day as DayOfWeek) {
                                  setActiveEditingDay(null);
                                } else {
                                  setActiveEditingDay(day as DayOfWeek);
                                }
                              }}
                              className="w-full text-xs"
                            >
                              {activeEditingDay === day as DayOfWeek ? "Done" : "Edit Day"}
                            </Button>
                          ) : (
                            <div className="flex justify-center">
                              <button
                                onClick={() => {
                                  // Clone the schedule and update the completion status
                                  const newSchedule = { ...studyPlan.weekSchedule };
                                  newSchedule[day as DayOfWeek].completed = !data.completed;
                                  
                                  // Update current plan
                                  if (currentPlan) {
                                    setCurrentPlan({
                                      ...currentPlan,
                                      weekSchedule: newSchedule
                                    });
                                  }
                                }}
                                className={`w-6 h-6 rounded-full ${
                                  data.completed ? 'bg-green-500' : 'bg-gray-200'
                                } flex items-center justify-center`}
                              >
                                {data.completed && (
                                  <CheckCircle2 className="h-4 w-4 text-white" />
                                )}
                              </button>
                            </div>
                          )}
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
              onClick={() => handleSavePlan()}
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