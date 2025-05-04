import React, { useState } from 'react';
import { Link } from 'wouter';
import { 
  BookOpen, 
  Brain, 
  ClipboardCheck, 
  Clock, 
  CheckCircle2, 
  ListChecks, 
  BadgeInfo, 
  LineChart, 
  TrendingUp, 
  Calendar, 
  Trophy, 
  BarChart2, 
  Activity, 
  FileText, 
  Target, 
  Zap, 
  User,
  CheckSquare,
  BrainCircuit,
  BookMarked,
  PenTool,
  TimerOff,
  Bell,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Info,
  Lightbulb,
  Divide,
  FileQuestion,
  X,
  Circle,
  Save
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LearningProgressChart } from "@/components/progress/LearningProgressChart";
import { BadgeCollection } from "@/components/badges/BadgeCollection";
import type { Badge, UserStats } from "@/lib/badges";

// Type definitions for our dashboard data
interface DashboardUserStats {
  streakDays: number;
  questionsAnswered: number;
  questionsCorrect: number;
  totalStudyHours: number;
  masteryLevels: {
    category: string;
    progress: number;
    color: string;
  }[];
  recentActivity: {
    date: string;
    activity: string;
    details: string;
    icon: React.ReactNode;
  }[];
  upcomingExams: {
    name: string;
    date: string;
    daysUntil: number;
    readiness: number;
  }[];
  studySchedule: {
    day: string;
    tasks: {
      name: string;
      duration: string;
      completed: boolean;
    }[];
  }[];
  performanceByTopic: {
    topic: string;
    performance: number;
    questions: number;
  }[];
  performanceByQuestionType: {
    type: string;
    performance: number;
  }[];
  weeklyStudyHours: number[];
}

// Sample data for demonstration
const sampleUserStats: DashboardUserStats = {
  streakDays: 12,
  questionsAnswered: 457,
  questionsCorrect: 356,
  totalStudyHours: 42.5,
  masteryLevels: [
    { category: "Med-Surg", progress: 72, color: "bg-emerald-500" },
    { category: "Pharmacology", progress: 58, color: "bg-amber-500" },
    { category: "Fundamentals", progress: 85, color: "bg-blue-500" },
    { category: "Pediatrics", progress: 67, color: "bg-indigo-500" },
    { category: "Obstetrics", progress: 70, color: "bg-purple-500" },
    { category: "Psychiatric", progress: 75, color: "bg-pink-500" }
  ],
  recentActivity: [
    {
      date: "Today, 10:30 AM",
      activity: "Completed Test",
      details: "Scored 75% on Cardiac Emergency Nursing",
      icon: <CheckCircle2 className="h-4 w-4 text-green-500" />
    },
    {
      date: "Yesterday, 3:15 PM",
      activity: "Practice Session",
      details: "45 minutes of pharmacology questions",
      icon: <BookOpen className="h-4 w-4 text-blue-500" />
    },
    {
      date: "Yesterday, 9:20 AM",
      activity: "Earned Badge",
      details: "Unlocked 'Consistency Champion'",
      icon: <Trophy className="h-4 w-4 text-amber-500" />
    },
    {
      date: "Aug 12, 2:45 PM",
      activity: "Study Session",
      details: "2 hours of NCLEX preparation",
      icon: <Clock className="h-4 w-4 text-gray-500" />
    }
  ],
  upcomingExams: [
    {
      name: "NCLEX-RN",
      date: "October 15, 2023",
      daysUntil: 21,
      readiness: 76
    },
    {
      name: "Med-Surg Final",
      date: "September 5, 2023",
      daysUntil: 7,
      readiness: 82
    }
  ],
  studySchedule: [
    {
      day: "Monday",
      tasks: [
        { name: "Pharmacology Review", duration: "1 hour", completed: true },
        { name: "Practice Questions", duration: "30 mins", completed: true }
      ]
    },
    {
      day: "Tuesday",
      tasks: [
        { name: "Critical Care Notes", duration: "1.5 hours", completed: false },
        { name: "Study Group Session", duration: "1 hour", completed: false }
      ]
    },
    {
      day: "Wednesday",
      tasks: [
        { name: "Practice Test", duration: "2 hours", completed: false },
        { name: "Review Wrong Answers", duration: "45 mins", completed: false }
      ]
    }
  ],
  performanceByTopic: [
    { topic: "Cardiovascular", performance: 78, questions: 65 },
    { topic: "Respiratory", performance: 82, questions: 48 },
    { topic: "Neurological", performance: 75, questions: 52 },
    { topic: "Gastrointestinal", performance: 68, questions: 43 },
    { topic: "Endocrine", performance: 72, questions: 37 }
  ],
  performanceByQuestionType: [
    { type: "Multiple Choice", performance: 82 },
    { type: "Select All That Apply", performance: 67 },
    { type: "Ordered Response", performance: 74 },
    { type: "Hot Spot", performance: 79 },
    { type: "Chart/Exhibit", performance: 71 }
  ],
  weeklyStudyHours: [2.5, 3.0, 4.5, 2.0, 3.5, 5.0, 1.5]
};

interface EnhancedDashboardProps {
  userStats?: {
    streakDays?: number;
    questionsAnswered?: number;
    questionsCorrect?: number;
    [key: string]: any;
  };
  unlockedBadges: Badge[]; // Using the Badge type from lib/badges
}

export function EnhancedDashboard({ 
  userStats: providedStats = {}, 
  unlockedBadges = [] 
}: EnhancedDashboardProps) {
  // Merge provided stats with sample stats for demo purposes
  const userStats = { 
    ...sampleUserStats, 
    ...providedStats,
    // Ensure we have these properties even if the provided stats don't include them
    streakDays: providedStats.streakDays !== undefined ? providedStats.streakDays : sampleUserStats.streakDays,
    questionsAnswered: providedStats.questionsAnswered !== undefined ? providedStats.questionsAnswered : sampleUserStats.questionsAnswered,
    questionsCorrect: providedStats.questionsCorrect !== undefined ? providedStats.questionsCorrect : sampleUserStats.questionsCorrect
  };
  
  // Add state for interactive features
  const [expandedActivity, setExpandedActivity] = useState<number | null>(null);
  const [focusedCategory, setFocusedCategory] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(false);
  
  // State for active tabs and panels
  const [activeMainTab, setActiveMainTab] = useState<string>('overview');
  
  // Create a compatible UserStats object for LearningProgressChart
  const userStatsForChart: UserStats = {
    questionsAnswered: userStats.questionsAnswered,
    questionsCorrect: userStats.questionsCorrect,
    questionsIncorrect: userStats.questionsAnswered - userStats.questionsCorrect,
    streakDays: userStats.streakDays,
    testsCompleted: 0,
    specialtyQuestionsCompleted: {
      "Med-Surg": 45,
      "Pediatrics": 30,
      "Obstetrics": 25,
      "Psychiatric": 20,
      "Fundamentals": 50
    },
    perfectScores: 0,
    flaggedQuestions: 0,
    timeSpent: userStats.totalStudyHours * 60 // convert hours to minutes
  };
  
  // Calculate correct percentage
  const correctPercentage = 
    userStats.questionsCorrect > 0 
      ? Math.round((userStats.questionsCorrect / userStats.questionsAnswered) * 100) 
      : 0;
  
  // Calculate the study plan completion for today
  const todayStudyPlan = userStats.studySchedule[0];
  const completedTasks = todayStudyPlan?.tasks.filter((t: {completed: boolean}) => t.completed).length || 0;
  const totalTasks = todayStudyPlan?.tasks.length || 0;
  const todayCompletionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Calculate upcoming exam urgency
  const getExamUrgencyColor = (daysUntil: number) => {
    if (daysUntil <= 7) return "text-red-500";
    if (daysUntil <= 14) return "text-amber-500";
    return "text-emerald-500";
  };
  
  // Calculate readiness indicator color
  const getReadinessColor = (readiness: number) => {
    if (readiness >= 80) return "bg-emerald-500";
    if (readiness >= 70) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Quick Study Tips Alert */}
      {showTips && (
        <Alert className="bg-blue-50 border-blue-100 mb-4">
          <AlertCircle className="h-4 w-4 text-blue-500" />
          <AlertTitle className="text-blue-700">Study Tips</AlertTitle>
          <AlertDescription className="text-blue-600">
            <ul className="list-disc pl-5 pt-2 space-y-1 text-sm">
              <li>Focus on understanding concepts rather than memorizing facts</li>
              <li>Take regular breaks - 50 minutes of study followed by a 10-minute break works well</li>
              <li>Review your incorrect answers to understand why you got them wrong</li>
              <li>Use SATA questions to build critical thinking skills</li>
              <li>Study in a distraction-free environment for maximum concentration</li>
            </ul>
            <div className="flex justify-end mt-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs" 
                onClick={() => setShowTips(false)}
              >
                <X className="h-3 w-3 mr-1" />
                Close Tips
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Study Tips Button (when tips are hidden) */}
      {!showTips && (
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 text-xs border-blue-200 text-blue-700 hover:bg-blue-50" 
            onClick={() => setShowTips(true)}
          >
            <Lightbulb className="h-3 w-3 mr-1 text-amber-500" />
            Show Study Tips
          </Button>
        </div>
      )}
      
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Questions Completed</p>
              <h3 className="text-2xl font-bold">{userStats.questionsAnswered}</h3>
              <p className="text-xs text-gray-500 mt-1">
                <span className="text-green-500 font-medium">
                  <TrendingUp className="inline-block h-3 w-3 mr-1" />
                  15%
                </span> vs. last week
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <BrainCircuit className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Accuracy Rate</p>
              <h3 className="text-2xl font-bold">{correctPercentage}%</h3>
              <p className="text-xs text-gray-500 mt-1">
                <span className="text-green-500 font-medium">
                  <TrendingUp className="inline-block h-3 w-3 mr-1" />
                  5%
                </span> vs. last week
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckSquare className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Study Streak</p>
              <h3 className="text-2xl font-bold">{userStats.streakDays} days</h3>
              <p className="text-xs text-green-500 font-medium mt-1">
                <Zap className="inline-block h-3 w-3 mr-1" />
                Keep it going!
              </p>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <Activity className="h-6 w-6 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Study Time</p>
              <h3 className="text-2xl font-bold">{userStats.totalStudyHours} hrs</h3>
              <p className="text-xs text-gray-500 mt-1">
                <span className="text-amber-500 font-medium">
                  <Clock className="inline-block h-3 w-3 mr-1" />
                  {userStats.weeklyStudyHours.reduce((a, b) => a + b, 0).toFixed(1)} hrs this week
                </span>
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" onValueChange={setActiveMainTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 md:w-auto md:inline-grid">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Current Progress */}
            <div className="md:col-span-2">
              <Card className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <LineChart className="h-5 w-5 mr-2 text-blue-600" />
                    Learning Progress
                  </CardTitle>
                  <CardDescription>Your progress across all nursing domains</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userStats.masteryLevels.map((item, index) => (
                      <div 
                        key={index} 
                        className={`${focusedCategory === item.category ? 'bg-gray-50 p-3 rounded-md border border-gray-200' : ''}`}
                        onMouseEnter={() => setFocusedCategory(item.category)}
                        onMouseLeave={() => setFocusedCategory(null)}
                      >
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{item.category}</span>
                          <span className="text-sm font-medium">{item.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${item.color} h-2 rounded-full transition-all duration-300 ease-in-out`} 
                            style={{ width: `${focusedCategory === item.category ? Math.min(100, item.progress + 5) : item.progress}%` }}
                          ></div>
                        </div>
                        
                        {focusedCategory === item.category && (
                          <div className="mt-2 text-xs">
                            <div className="flex justify-between text-gray-500 mb-1">
                              <span>Questions attempted:</span>
                              <span className="font-medium">{(userStats.questionsAnswered * (item.progress / 100)).toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                              <span>Learning score:</span>
                              <span className={`font-medium ${
                                item.progress >= 80 ? 'text-emerald-600' : 
                                item.progress >= 60 ? 'text-amber-600' : 
                                'text-red-600'
                              }`}>
                                {item.progress >= 80 ? 'Advanced' : 
                                 item.progress >= 60 ? 'Intermediate' : 
                                 'Beginner'}
                              </span>
                            </div>
                            
                            <Button 
                              size="sm" 
                              className="w-full mt-2 h-7 text-xs bg-blue-600 text-white hover:bg-blue-700"
                            >
                              Focus on {item.category}
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <Link href="/learning-progress">
                      <Button variant="outline" className="border-2 border-black">
                        View Detailed Progress
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Activity */}
            <div>
              <Card className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Activity className="h-5 w-5 mr-2 text-green-600" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Your latest learning activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userStats.recentActivity.map((activity, index) => (
                      <div 
                        key={index} 
                        className={`flex items-start border-b border-gray-100 pb-2 last:border-b-0 
                                    ${expandedActivity === index ? 'bg-blue-50 rounded p-2 -m-2' : ''}
                                    hover:bg-gray-50 cursor-pointer transition-colors duration-150`}
                        onClick={() => setExpandedActivity(expandedActivity === index ? null : index)}
                      >
                        <div className="flex-shrink-0 mt-1">{activity.icon}</div>
                        <div className="ml-2 flex-1">
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-medium">{activity.activity}</p>
                            {expandedActivity === index ? (
                              <ChevronUp className="h-4 w-4 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{activity.details}</p>
                          <p className="text-xs text-gray-400">{activity.date}</p>
                          
                          {expandedActivity === index && (
                            <div className="mt-2 text-sm bg-white p-2 rounded border border-blue-100">
                              <div className="flex items-center mb-1">
                                <Info className="h-3 w-3 text-blue-500 mr-1" />
                                <span className="text-blue-600 text-xs font-medium">Activity Details</span>
                              </div>
                              {activity.activity === "Completed Test" && (
                                <>
                                  <p className="text-xs text-gray-600 mb-1">You've made significant progress in this area!</p>
                                  <div className="flex justify-between text-xs">
                                    <span>Accuracy:</span>
                                    <span className="font-medium text-green-600">75%</span>
                                  </div>
                                  <Button size="sm" variant="outline" className="mt-2 text-xs h-7 w-full">Review Test</Button>
                                </>
                              )}
                              
                              {activity.activity === "Practice Session" && (
                                <>
                                  <p className="text-xs text-gray-600 mb-1">Focus on pharmacology is improving your knowledge</p>
                                  <div className="flex justify-between text-xs">
                                    <span>Questions:</span>
                                    <span className="font-medium">24</span>
                                  </div>
                                  <Button size="sm" variant="outline" className="mt-2 text-xs h-7 w-full">Continue Practice</Button>
                                </>
                              )}
                              
                              {activity.activity === "Earned Badge" && (
                                <>
                                  <p className="text-xs text-gray-600 mb-1">Congratulations on your achievement!</p>
                                  <div className="text-center my-1">
                                    <Trophy className="h-5 w-5 text-amber-500 mx-auto" />
                                  </div>
                                  <Button size="sm" variant="outline" className="mt-1 text-xs h-7 w-full">View Badges</Button>
                                </>
                              )}
                              
                              {activity.activity === "Study Session" && (
                                <>
                                  <p className="text-xs text-gray-600 mb-1">Your dedicated study time is paying off</p>
                                  <div className="flex justify-between text-xs">
                                    <span>Focus level:</span>
                                    <span className="font-medium text-green-600">High</span>
                                  </div>
                                  <Button size="sm" variant="outline" className="mt-2 text-xs h-7 w-full">Session Stats</Button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Upcoming Exams */}
            <Card className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Calendar className="h-5 w-5 mr-2 text-amber-600" />
                  Upcoming Exams
                </CardTitle>
                <CardDescription>Your scheduled exams and readiness</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userStats.upcomingExams.map((exam, index) => (
                    <div key={index} className="border rounded-md p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{exam.name}</h4>
                          <p className="text-sm text-gray-500">{exam.date}</p>
                        </div>
                        <UIBadge className={getExamUrgencyColor(exam.daysUntil)}>
                          {exam.daysUntil} days left
                        </UIBadge>
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs">Readiness</span>
                          <span className="text-xs font-medium">{exam.readiness}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`${getReadinessColor(exam.readiness)} h-1.5 rounded-full`} 
                            style={{ width: `${exam.readiness}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {userStats.upcomingExams.length === 0 && (
                  <div className="py-8 text-center">
                    <Calendar className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500 mb-1">No upcoming exams</p>
                    <p className="text-xs text-gray-400">Schedule your next exam to see it here</p>
                  </div>
                )}
                <div className="mt-3 text-center">
                  <Link href="/study-strategies">
                    <Button variant="outline" className="border-2 border-black">
                      Plan Your Exam Prep
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            {/* Today's Study Plan */}
            <Card className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <CheckSquare className="h-5 w-5 mr-2 text-blue-600" />
                  Today's Study Plan
                </CardTitle>
                <CardDescription>Your study tasks for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Completion</span>
                    <span className="text-sm font-medium">{todayCompletionPercentage}%</span>
                  </div>
                  <Progress value={todayCompletionPercentage} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  {todayStudyPlan?.tasks.map((task, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 ${task.completed ? 'text-green-500' : 'text-gray-300'}`}>
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <span className={`ml-2 ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>{task.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">{task.duration}</span>
                    </div>
                  ))}
                  
                  {(!todayStudyPlan || todayStudyPlan.tasks.length === 0) && (
                    <div className="py-6 text-center">
                      <CheckSquare className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                      <p className="text-gray-500 mb-1">No tasks planned for today</p>
                      <p className="text-xs text-gray-400">Create a study plan to get started</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 text-center">
                  <Link href="/study-strategies">
                    <Button className="bg-blue-600 text-white hover:bg-blue-700 border-2 border-black">
                      Update Study Plan
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-4">
          {/* Summary Statistics at the top */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
            <div className="p-4 bg-white rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-700">Accuracy Trend</h3>
                  <p className="text-2xl font-bold">{correctPercentage}%</p>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +5% this month
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-white rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-full">
                  <BadgeInfo className="h-5 w-5 text-purple-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-700">Total Questions</h3>
                  <p className="text-2xl font-bold">{userStats.questionsAnswered}</p>
                  <p className="text-xs text-gray-500 flex items-center">
                    Across {userStats.performanceByTopic.length} topics
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-white rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-start">
                <div className="bg-amber-100 p-2 rounded-full">
                  <Trophy className="h-5 w-5 text-amber-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-700">Strongest Area</h3>
                  <p className="text-lg font-bold">
                    {userStats.performanceByTopic.sort((a, b) => b.performance - a.performance)[0]?.topic || "N/A"}
                  </p>
                  <p className="text-xs text-amber-600 flex items-center">
                    {userStats.performanceByTopic.sort((a, b) => b.performance - a.performance)[0]?.performance || 0}% accuracy
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Performance by Topic */}
            <Card className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <BarChart2 className="h-5 w-5 mr-2 text-blue-600" />
                  Performance by Topic
                </CardTitle>
                <CardDescription>Your mastery across different nursing topics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userStats.performanceByTopic.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <div className="flex items-center">
                          <span className="text-sm font-medium">{item.topic}</span>
                          <span className="text-xs ml-2 text-gray-500">({item.questions} questions)</span>
                        </div>
                        <span className="text-sm font-medium">{item.performance}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            item.performance >= 80 ? 'bg-emerald-500' : 
                            item.performance >= 70 ? 'bg-amber-500' : 
                            'bg-red-500'
                          }`} 
                          style={{ width: `${item.performance}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Performance by Question Type */}
            <Card className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Target className="h-5 w-5 mr-2 text-purple-600" />
                  Performance by Question Type
                </CardTitle>
                <CardDescription>Your accuracy across different question formats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userStats.performanceByQuestionType.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{item.type}</span>
                        <span className="text-sm font-medium">{item.performance}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            item.performance >= 80 ? 'bg-emerald-500' : 
                            item.performance >= 70 ? 'bg-amber-500' : 
                            'bg-red-500'
                          }`} 
                          style={{ width: `${item.performance}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium mb-2">Improvement Recommendations</h4>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-start">
                      <AlertCircle className="h-4 w-4 mr-2 text-amber-500 mt-0.5" />
                      <span>Focus on SATA questions to improve selection skills</span>
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="h-4 w-4 mr-2 text-amber-500 mt-0.5" />
                      <span>Practice prioritization for ordered response questions</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Performance by Difficulty */}
          <Card className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Target className="h-5 w-5 mr-2 text-red-600" />
                Performance by Difficulty
              </CardTitle>
              <CardDescription>Your accuracy based on question difficulty</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-2/5 w-full">
                <div className="space-y-3">
                  {/* Easy questions */}
                  <div className="relative">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Easy</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-emerald-500 h-3 rounded-full" 
                        style={{ width: "92%" }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>124 questions</span>
                    </div>
                  </div>
                  
                  {/* Medium questions */}
                  <div className="relative">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Medium</span>
                      <span className="text-sm font-medium">76%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-amber-500 h-3 rounded-full" 
                        style={{ width: "76%" }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>209 questions</span>
                    </div>
                  </div>
                  
                  {/* Hard questions */}
                  <div className="relative">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Hard</span>
                      <span className="text-sm font-medium">62%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-red-500 h-3 rounded-full" 
                        style={{ width: "62%" }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>124 questions</span>
                    </div>
                  </div>
                </div>
                
                {/* Insight callout */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
                  <div className="flex items-start">
                    <Info className="h-4 w-4 mt-0.5 mr-2 text-blue-500" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-700">Targeted Improvement</h4>
                      <p className="text-xs text-blue-600 mt-1">Focus on the hard-level questions to improve your overall NCLEX readiness. Aim for at least 70% accuracy on difficult questions.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Chart visualization */}
              <div className="md:w-3/5 w-full">
                <h4 className="text-center text-sm font-medium mb-2">Accuracy Distribution</h4>
                <div className="h-60 relative">
                  {/* SVG Donut Chart */}
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="10" />
                    
                    {/* Hard questions - red segment (62% of 30% = 18.6% of total) */}
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="none" 
                      stroke="#ef4444" 
                      strokeWidth="10" 
                      strokeDasharray="251.2" 
                      strokeDashoffset="204.5"
                      transform="rotate(-90 50 50)" 
                    />
                    
                    {/* Medium questions - yellow segment (76% of 45% = 34.2% of total) */}
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="none" 
                      stroke="#f59e0b" 
                      strokeWidth="10" 
                      strokeDasharray="251.2" 
                      strokeDashoffset="161.5"
                      transform="rotate(18.6 50 50) rotate(-90 50 50)" 
                    />
                    
                    {/* Easy questions - green segment (92% of 25% = 23% of total) */}
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="none" 
                      stroke="#10b981" 
                      strokeWidth="10" 
                      strokeDasharray="251.2" 
                      strokeDashoffset="226.1"
                      transform="rotate(52.8 50 50) rotate(-90 50 50)" 
                    />
                    
                    {/* Inner circle with total percentage */}
                    <circle cx="50" cy="50" r="32" fill="white" />
                    <text x="50" y="45" textAnchor="middle" fontSize="10" fontWeight="bold">Overall</text>
                    <text x="50" y="58" textAnchor="middle" fontSize="14" fontWeight="bold">{correctPercentage}%</text>
                  </svg>
                </div>
                
                {/* Legend */}
                <div className="flex justify-center mt-2 space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full mr-1"></div>
                    <span className="text-xs">Easy</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-amber-500 rounded-full mr-1"></div>
                    <span className="text-xs">Medium</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                    <span className="text-xs">Hard</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Learning Progress Visualization */}
          <Card className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <LineChart className="h-5 w-5 mr-2 text-green-600" />
                Learning Progress Trends
              </CardTitle>
              <CardDescription>Your progress over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <LearningProgressChart userStats={userStatsForChart} />
              </div>
            </CardContent>
          </Card>
          
          {/* Recently Earned Badges */}
          <Card className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Trophy className="h-5 w-5 mr-2 text-amber-600" />
                Recently Earned Badges
              </CardTitle>
              <CardDescription>Your achievements and accomplishments</CardDescription>
            </CardHeader>
            <CardContent>
              <BadgeCollection 
                unlockedBadges={unlockedBadges.slice(0, 8)} 
                showLocked={false}
              />
              <div className="mt-4 text-center">
                <Link href="/achievements">
                  <Button variant="outline" className="border-2 border-black">
                    View All Achievements
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {userStats.studySchedule.map((day, index) => (
              <Card key={index} className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{day.day}</CardTitle>
                  <CardDescription>
                    {day.tasks.length} study tasks planned
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {day.tasks.map((task, taskIndex) => (
                      <div key={taskIndex} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 ${task.completed ? 'text-green-500' : 'text-gray-300'}`}>
                            <CheckCircle2 className="h-5 w-5" />
                          </div>
                          <span className={`ml-2 text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                            {task.name}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">{task.duration}</span>
                      </div>
                    ))}
                  </div>
                  {day.tasks.length === 0 && (
                    <div className="py-6 text-center">
                      <Calendar className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                      <p className="text-gray-500 mb-1">No tasks planned</p>
                      <p className="text-xs text-gray-400">Add study tasks to your schedule</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {/* Weekly Overview */}
            <Card className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Weekly Study Hours
                </CardTitle>
                <CardDescription>Your study time throughout the week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40 flex items-end space-x-4">
                  {userStats.weeklyStudyHours.map((hours, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div className="h-32 w-full flex items-end">
                        <div 
                          className="w-full bg-blue-500 rounded-t-md"
                          style={{ height: `${(hours / Math.max(...userStats.weeklyStudyHours)) * 100}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 text-xs font-medium">
                        {['M','T','W','T','F','S','S'][idx]}
                      </div>
                      <div className="text-xs text-gray-500">{hours}h</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium">Total Weekly Hours</h4>
                      <p className="text-2xl font-bold">{userStats.weeklyStudyHours.reduce((a, b) => a + b, 0).toFixed(1)}</p>
                    </div>
                    <Link href="/study-timer">
                      <Button className="bg-blue-600 text-white hover:bg-blue-700 border-2 border-black">
                        Start Study Session
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="text-center">
              <Link href="/study-strategies">
                <Button className="bg-blue-600 text-white hover:bg-blue-700 border-2 border-black">
                  Create Comprehensive Study Plan
                </Button>
              </Link>
            </div>
          </div>
        </TabsContent>
        
        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Study Pattern Insights */}
            <Card className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <BrainCircuit className="h-5 w-5 mr-2 text-indigo-600" />
                  Study Pattern Insights
                </CardTitle>
                <CardDescription>Analysis of your study habits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                    <h3 className="font-medium flex items-center text-blue-800">
                      <Zap className="h-4 w-4 mr-2" />
                      Peak Productivity
                    </h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Your data shows you perform best during morning study sessions (8-11 AM).
                    </p>
                  </div>
                  
                  <div className="bg-amber-50 p-3 rounded-md border border-amber-100">
                    <h3 className="font-medium flex items-center text-amber-800">
                      <Clock className="h-4 w-4 mr-2" />
                      Session Length
                    </h3>
                    <p className="text-sm text-amber-700 mt-1">
                      Your most effective sessions are 45-60 minutes long with short breaks.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-md border border-green-100">
                    <h3 className="font-medium flex items-center text-green-800">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Learning Progress
                    </h3>
                    <p className="text-sm text-green-700 mt-1">
                      You're improving most rapidly in Fundamentals and Med-Surg categories.
                    </p>
                  </div>
                  
                  <div className="bg-red-50 p-3 rounded-md border border-red-100">
                    <h3 className="font-medium flex items-center text-red-800">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Attention Needed
                    </h3>
                    <p className="text-sm text-red-700 mt-1">
                      Your performance decreases after 2 hours of continuous study. Consider shorter sessions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Personalized Recommendations */}
            <Card className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Brain className="h-5 w-5 mr-2 text-amber-600" />
                  Personalized Recommendations
                </CardTitle>
                <CardDescription>AI-powered suggestions for your study</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Calculate recommendations based on performance data */}
                  {userStats.performanceByQuestionType.some(qt => qt.type === "Select All That Apply" && qt.performance < 70) && (
                    <div className="p-3 border-2 border-black rounded-md bg-white hover:bg-gray-50 transition-colors cursor-pointer" 
                         onClick={() => window.location.href = "/practice?type=sata"}>
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center">
                          <span className="font-medium">Focus on SATA Questions</span>
                        </div>
                        <UIBadge className="bg-red-100 text-red-800 hover:bg-red-200">Focus Area</UIBadge>
                      </div>
                      <p className="text-sm text-gray-600">Your performance data shows lower accuracy on select-all-that-apply questions</p>
                      <div className="mt-2 flex items-center justify-end">
                        <Button size="sm" variant="outline" className="h-7 text-xs">Practice Now</Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Morning study recommendation */}
                  <div className="p-3 border-2 border-black rounded-md bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                       onClick={() => window.location.href = "/study-timer"}>
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center">
                        <span className="font-medium">Morning Study Sessions</span>
                      </div>
                      <UIBadge className="bg-green-100 text-green-800 hover:bg-green-200">Schedule</UIBadge>
                    </div>
                    <p className="text-sm text-gray-600">Your timer data shows better retention in morning sessions</p>
                    <div className="mt-2 text-xs text-gray-500">
                      <div className="flex items-center mb-1">
                        <Clock className="h-3 w-3 mr-1 text-gray-400" />
                        <span>Optimal time: 8:00 AM - 11:00 AM</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Recommendation based on weakest topic */}
                  {userStats.performanceByTopic.sort((a, b) => a.performance - b.performance)[0] && (
                    <div className="p-3 border-2 border-black rounded-md bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                         onClick={() => window.location.href = `/practice?topic=${userStats.performanceByTopic.sort((a, b) => a.performance - b.performance)[0].topic.toLowerCase()}`}>
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center">
                          <span className="font-medium">Strengthen {userStats.performanceByTopic.sort((a, b) => a.performance - b.performance)[0].topic}</span>
                        </div>
                        <UIBadge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Topic</UIBadge>
                      </div>
                      <p className="text-sm text-gray-600">This area needs more attention based on your recent performance</p>
                      <div className="mt-2 flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mr-2">
                          <div 
                            className="bg-amber-500 h-1.5 rounded-full" 
                            style={{ width: `${userStats.performanceByTopic.sort((a, b) => a.performance - b.performance)[0].performance}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{userStats.performanceByTopic.sort((a, b) => a.performance - b.performance)[0].performance}%</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Study technique recommendation */}
                  <div className="p-3 border-2 border-black rounded-md bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                       onClick={() => setShowTips(true)}>
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center">
                        <span className="font-medium">Spaced Repetition</span>
                      </div>
                      <UIBadge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Technique</UIBadge>
                    </div>
                    <p className="text-sm text-gray-600">Based on your learning style, try using spaced repetition for pharmacology concepts</p>
                    <div className="mt-2 flex justify-end">
                      <Button size="sm" variant="outline" className="h-7 text-xs">Learn Technique</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Study Efficiency Analysis */}
          <Card className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <FileText className="h-5 w-5 mr-2 text-emerald-600" />
                Study Efficiency Analysis
              </CardTitle>
              <CardDescription>Review and optimize your learning approach</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-md">
                    <div className="flex items-center mb-2">
                      <Clock className="h-5 w-5 text-blue-500 mr-2" />
                      <h3 className="font-medium">Time Efficiency</h3>
                    </div>
                    <div className="flex items-center">
                      <div className="w-16 h-16 relative">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle 
                            cx="50" cy="50" r="45" 
                            fill="none" stroke="#E5E7EB" 
                            strokeWidth="10" 
                          />
                          <circle 
                            cx="50" cy="50" r="45" 
                            fill="none" stroke="#3B82F6" 
                            strokeWidth="10" 
                            strokeDasharray="283"
                            strokeDashoffset="85"
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                          <span className="text-lg font-bold">70%</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-600">You complete tasks efficiently but take longer on Pharmacology topics</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <div className="flex items-center mb-2">
                      <BookMarked className="h-5 w-5 text-purple-500 mr-2" />
                      <h3 className="font-medium">Material Usage</h3>
                    </div>
                    <div className="flex items-center">
                      <div className="w-16 h-16 relative">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle 
                            cx="50" cy="50" r="45" 
                            fill="none" stroke="#E5E7EB" 
                            strokeWidth="10" 
                          />
                          <circle 
                            cx="50" cy="50" r="45" 
                            fill="none" stroke="#8B5CF6" 
                            strokeWidth="10" 
                            strokeDasharray="283"
                            strokeDashoffset="113"
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                          <span className="text-lg font-bold">60%</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-600">You're underutilizing available practice questions and case studies</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <div className="flex items-center mb-2">
                      <BrainCircuit className="h-5 w-5 text-green-500 mr-2" />
                      <h3 className="font-medium">Retention Rate</h3>
                    </div>
                    <div className="flex items-center">
                      <div className="w-16 h-16 relative">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle 
                            cx="50" cy="50" r="45" 
                            fill="none" stroke="#E5E7EB" 
                            strokeWidth="10" 
                          />
                          <circle 
                            cx="50" cy="50" r="45" 
                            fill="none" stroke="#10B981" 
                            strokeWidth="10" 
                            strokeDasharray="283"
                            strokeDashoffset="68"
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                          <span className="text-lg font-bold">76%</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-600">You retain information well when using active recall techniques</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="font-medium mb-2 text-gray-800">Areas for Improvement</h3>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <TimerOff className="h-4 w-4 text-amber-500 mt-1 mr-2" />
                      <p className="text-sm text-gray-700">Reduce time spent on passive reading by 30% and increase active practice</p>
                    </div>
                    <div className="flex items-start">
                      <PenTool className="h-4 w-4 text-amber-500 mt-1 mr-2" />
                      <p className="text-sm text-gray-700">Create more concept maps and visual notes for complex topics</p>
                    </div>
                    <div className="flex items-start">
                      <Bell className="h-4 w-4 text-amber-500 mt-1 mr-2" />
                      <p className="text-sm text-gray-700">Set up regular review sessions for previously covered material</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}