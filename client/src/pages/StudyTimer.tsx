import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Sidebar } from "@/components/ui/sidebar";
import { Header } from "@/components/ui/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudyTimer as StudyTimerComponent } from "@/components/StudyTimer";
import { StudyTimerOverlay } from "@/components/StudyTimerOverlay";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlarmClock, 
  BookOpen, 
  Clock, 
  Focus, 
  Loader2, 
  Zap, 
  History, 
  Calendar, 
  FileText, 
  CalendarDays, 
  BarChart4,
  Award,
  PenLine,
  Check,
  Trophy,
  Lightbulb
} from "lucide-react";

// Study session history type
interface StudySession {
  id: string;
  date: string;
  duration: number;
  focusArea: string;
  notes: string;
}

// Break suggestion type
interface BreakSuggestion {
  duration: number;
  activity: string;
  icon: string;
}

export default function StudyTimer() {
  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPlannerOverlay, setShowPlannerOverlay] = useState(false);
  const [activeTab, setActiveTab] = useState("timer");
  
  // Session state
  const [currentSessionNotes, setCurrentSessionNotes] = useState("");
  const [sessionHistory, setSessionHistory] = useState<StudySession[]>([]);
  const [totalStudyMinutes, setTotalStudyMinutes] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  
  // Progress state
  const [weeklyGoal, setWeeklyGoal] = useState(300); // 5 hours per week
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  
  // Break suggestions
  const breakSuggestions: BreakSuggestion[] = [
    { duration: 5, activity: "Take a short walk", icon: "🚶" },
    { duration: 5, activity: "Do some stretching exercises", icon: "🧘" },
    { duration: 5, activity: "Get a glass of water", icon: "🥤" },
    { duration: 5, activity: "Look at something 20 feet away for 20 seconds", icon: "👁️" },
    { duration: 15, activity: "Take a short meditation break", icon: "🧠" },
    { duration: 15, activity: "Prepare a healthy snack", icon: "🍎" },
    { duration: 15, activity: "Do a quick chore to clear your mind", icon: "🧹" },
    { duration: 30, activity: "Take a power nap", icon: "😴" },
    { duration: 30, activity: "Go for a short workout", icon: "🏃" },
    { duration: 30, activity: "Take a proper meal break", icon: "🍽️" }
  ];
  
  // Load saved data on component mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('studySessionHistory');
    if (savedSessions) {
      setSessionHistory(JSON.parse(savedSessions));
    }
    
    const savedTotalMinutes = localStorage.getItem('totalStudyMinutes');
    if (savedTotalMinutes) {
      setTotalStudyMinutes(parseInt(savedTotalMinutes, 10));
    }
    
    const savedTotalSessions = localStorage.getItem('totalStudySessions');
    if (savedTotalSessions) {
      setTotalSessions(parseInt(savedTotalSessions, 10));
    }
    
    const savedStreak = localStorage.getItem('studyStreak');
    if (savedStreak) {
      setCurrentStreak(parseInt(savedStreak, 10));
    }
    
    // Calculate weekly progress
    calculateWeeklyProgress();
  }, []);
  
  // Save session data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('studySessionHistory', JSON.stringify(sessionHistory));
  }, [sessionHistory]);
  
  useEffect(() => {
    localStorage.setItem('totalStudyMinutes', totalStudyMinutes.toString());
  }, [totalStudyMinutes]);
  
  useEffect(() => {
    localStorage.setItem('totalStudySessions', totalSessions.toString());
  }, [totalSessions]);
  
  useEffect(() => {
    localStorage.setItem('studyStreak', currentStreak.toString());
  }, [currentStreak]);
  
  // Calculate weekly study progress
  const calculateWeeklyProgress = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Set to Sunday
    startOfWeek.setHours(0, 0, 0, 0);
    
    // Filter sessions from this week and sum durations
    const thisWeekSessions = sessionHistory.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= startOfWeek;
    });
    
    const weeklyMinutes = thisWeekSessions.reduce((sum, session) => sum + session.duration, 0);
    setWeeklyProgress(weeklyMinutes);
  };
  
  // Handler for when a focus session is completed
  const handleFocusComplete = (minutes: number) => {
    // Generate a new session entry
    const newSession: StudySession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      duration: minutes,
      focusArea: "General", // This would ideally come from the timer component
      notes: currentSessionNotes
    };
    
    // Update session history
    setSessionHistory(prev => [newSession, ...prev]);
    
    // Update total stats
    setTotalStudyMinutes(prev => prev + minutes);
    setTotalSessions(prev => prev + 1);
    
    // Check for streak update
    updateStreak();
    
    // Recalculate weekly progress
    calculateWeeklyProgress();
    
    // Clear current session notes
    setCurrentSessionNotes("");
  };
  
  // Update study streak
  const updateStreak = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    
    // Check if there was a session yesterday
    if (sessionHistory.length > 0) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const yesterdaySessions = sessionHistory.filter(session => {
        const sessionDate = new Date(session.date);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === yesterday.getTime();
      });
      
      // Check for sessions today
      const todaySessions = sessionHistory.filter(session => {
        const sessionDate = new Date(session.date);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === today.getTime();
      });
      
      // If there was a session yesterday, increment streak
      // Otherwise, reset to 1 if there's a session today
      if (yesterdaySessions.length > 0) {
        setCurrentStreak(prev => prev + 1);
      } else if (todaySessions.length === 1 && todaySessions[0].id === sessionHistory[0].id) {
        // This is the first session today, start/reset streak
        setCurrentStreak(1);
      }
    } else {
      // First session ever
      setCurrentStreak(1);
    }
  };
  
  // Get formatted date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Sidebar toggle
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Get random break suggestions based on duration
  const getBreakSuggestions = (duration: number): BreakSuggestion[] => {
    const filteredSuggestions = breakSuggestions.filter(
      suggestion => suggestion.duration === duration
    );
    
    // Shuffle and take 2 suggestions
    return [...filteredSuggestions]
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
  };
  
  return (
    <div className="bg-[#f0f2f5] font-sans text-[#333333] min-h-screen neuro-noise">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Planner Overlay */}
      <StudyTimerOverlay 
        isOpen={showPlannerOverlay} 
        onClose={() => setShowPlannerOverlay(false)} 
      />
      
      <div className="flex h-screen pt-16">
        <main className="flex-1 p-4 md:p-6 lg:pl-72 overflow-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header with dashboard stats */}
            <div className="bg-gradient-to-r from-[#13294B]/95 to-[#4B9CD3]/95 rounded-xl p-5 shadow-md mb-2">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="text-white">
                  <h1 className="text-3xl font-bold mb-2">Focus Timer Dashboard</h1>
                  <p className="text-blue-100 max-w-2xl">
                    Track your study progress, maintain your streak, and earn achievements through consistent learning.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white/20 shadow-sm transition-all duration-300"
                    onClick={() => setShowPlannerOverlay(true)}
                  >
                    <AlarmClock className="mr-2 h-4 w-4" />
                    Plan Session
                  </Button>
                  <Button
                    className="bg-white text-[#13294B] hover:bg-blue-100 shadow-sm transition-all duration-300"
                    onClick={() => setShowPlannerOverlay(true)}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Quick Start
                  </Button>
                </div>
              </div>
              
              {/* Dashboard Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center">
                  <div className="text-white mb-1 opacity-90 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-xs font-medium">TOTAL TIME</span>
                  </div>
                  <p className="text-white text-2xl font-bold">
                    {Math.floor(totalStudyMinutes / 60)}h {totalStudyMinutes % 60}m
                  </p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center">
                  <div className="text-white mb-1 opacity-90 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="text-xs font-medium">SESSIONS</span>
                  </div>
                  <p className="text-white text-2xl font-bold">{totalSessions}</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center">
                  <div className="text-white mb-1 opacity-90 flex items-center">
                    <Zap className="h-4 w-4 mr-1" />
                    <span className="text-xs font-medium">STREAK</span>
                  </div>
                  <p className="text-white text-2xl font-bold">{currentStreak} days</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center">
                  <div className="text-white mb-1 opacity-90 flex items-center">
                    <Trophy className="h-4 w-4 mr-1" />
                    <span className="text-xs font-medium">XP POINTS</span>
                  </div>
                  <p className="text-white text-2xl font-bold">
                    {Math.floor(totalStudyMinutes * 0.5) + (totalSessions * 10) + (currentStreak * 5)}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Weekly Goal Progress */}
            <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center text-lg">
                  <BarChart4 className="mr-2 h-5 w-5 text-blue-600" />
                  Weekly Study Goal
                </h3>
                <div className="flex items-center text-sm mt-1 sm:mt-0 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                  <span className="text-blue-700 font-semibold">{weeklyProgress}</span>
                  <span className="mx-1 text-gray-500">/</span>
                  <span className="text-gray-700">{weeklyGoal} minutes</span>
                </div>
              </div>
              
              <div className="relative pt-2">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-100">
                      Progress
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-blue-600">
                      {Math.round((weeklyProgress / weeklyGoal) * 100)}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full shadow-inner transition-all duration-500 relative" 
                    style={{ width: `${Math.min(100, (weeklyProgress / weeklyGoal) * 100)}%` }}
                  >
                    {weeklyProgress >= weeklyGoal && (
                      <span className="absolute -right-1 -top-1 flex h-5 w-5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-blue-500 items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </span>
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between text-xs text-gray-600 px-1">
                  <div className="flex flex-col items-center">
                    <span className="font-semibold">Mon</span>
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1"></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-semibold">Tue</span>
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1"></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-semibold">Wed</span>
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1"></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-semibold">Thu</span>
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1"></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-semibold">Fri</span>
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1"></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-semibold">Sat</span>
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1"></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-semibold">Sun</span>
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1"></div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mt-4 flex items-center">
                  {weeklyProgress >= weeklyGoal 
                    ? (
                      <span className="flex items-center text-green-600">
                        <Check className="h-4 w-4 mr-1" />
                        Weekly goal achieved! Great job maintaining your study momentum.
                      </span>
                    ) 
                    : (
                      <span>
                        <span className="font-medium text-blue-600">{weeklyGoal - weeklyProgress} minutes</span> remaining to reach your weekly goal
                      </span>
                    )
                  }
                </p>
              </div>
            </div>
            
            <Tabs 
              defaultValue="timer" 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="w-full"
            >
              <div className="border-b border-gray-200 mb-6">
                <TabsList className="bg-transparent w-full justify-start mb-0 gap-2">
                  <TabsTrigger 
                    value="timer" 
                    className="flex items-center data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none pb-3 px-4"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Timer
                  </TabsTrigger>
                  <TabsTrigger 
                    value="notes" 
                    className="flex items-center data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none pb-3 px-4"
                  >
                    <PenLine className="mr-2 h-4 w-4" />
                    Session Notes
                  </TabsTrigger>
                  <TabsTrigger 
                    value="history" 
                    className="flex items-center data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none pb-3 px-4"
                  >
                    <History className="mr-2 h-4 w-4" />
                    History
                  </TabsTrigger>
                  <TabsTrigger 
                    value="achievements" 
                    className="flex items-center data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none pb-3 px-4"
                  >
                    <Award className="mr-2 h-4 w-4" />
                    Achievements
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="timer" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <StudyTimerComponent 
                      onFocusComplete={handleFocusComplete}
                      onFocusStart={() => {
                        console.log("Study session started");
                      }}
                    />
                  </div>
                  
                  <div className="space-y-6">
                    {/* Break Suggestions Card */}
                    <Card className="neuro-shadow border-2 border-[#13294B]">
                      <CardHeader className="bg-[#13294B] text-white pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Zap className="w-5 h-5" /> Break Suggestions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-600 mb-2">5-Minute Break Ideas:</h3>
                            <ul className="space-y-2">
                              {getBreakSuggestions(5).map((suggestion, idx) => (
                                <li key={idx} className="flex items-start p-2 bg-blue-50 rounded-lg">
                                  <span className="text-xl mr-2">{suggestion.icon}</span>
                                  <span className="text-sm">{suggestion.activity}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-gray-600 mb-2">15-Minute Break Ideas:</h3>
                            <ul className="space-y-2">
                              {getBreakSuggestions(15).map((suggestion, idx) => (
                                <li key={idx} className="flex items-start p-2 bg-green-50 rounded-lg">
                                  <span className="text-xl mr-2">{suggestion.icon}</span>
                                  <span className="text-sm">{suggestion.activity}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Study Techniques Card */}
                    <Card className="neuro-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-blue-600" /> Study Techniques
                        </CardTitle>
                        <CardDescription>
                          Research-backed methods for effective learning
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="bg-blue-50 rounded-lg p-3">
                            <h3 className="font-medium text-blue-800 mb-1">Pomodoro Technique</h3>
                            <p className="text-sm text-gray-700">
                              Study for 25 minutes, then take a 5-minute break. After 4 sessions, take a longer 15-30 minute break.
                            </p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-3">
                            <h3 className="font-medium text-green-800 mb-1">Active Recall</h3>
                            <p className="text-sm text-gray-700">
                              Test yourself on material instead of passively reading. Create practice questions to enhance retention.
                            </p>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-3">
                            <h3 className="font-medium text-purple-800 mb-1">Spaced Repetition</h3>
                            <p className="text-sm text-gray-700">
                              Review material at increasing intervals to strengthen memory retention over time.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="notes" className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200/50">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
                        <PenLine className="mr-2 h-5 w-5 text-blue-600" />
                        Session Notes
                      </h2>
                      <p className="text-sm text-gray-600">
                        Record key insights during your study session. Notes are saved with your session history.
                      </p>
                    </div>
                    
                    <div className="flex items-center bg-amber-50 px-3 py-2 rounded-lg border border-amber-100 text-sm text-amber-800">
                      <Lightbulb className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0" />
                      <span>Writing detailed notes earns you the <span className="font-medium">Note Taker</span> achievement!</span>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50/50 rounded-lg p-4 mb-5 border border-blue-100/80">
                    <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Note-Taking Tips
                    </h3>
                    <ul className="space-y-1.5 text-sm text-blue-700">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 w-5 h-5 text-blue-500 mr-1">•</div>
                        <p>Summarize key concepts in your own words to improve retention</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 w-5 h-5 text-blue-500 mr-1">•</div>
                        <p>Use the Cornell note-taking method: questions on left, notes on right</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 w-5 h-5 text-blue-500 mr-1">•</div>
                        <p>Create mnemonics for complex information you need to memorize</p>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
                    <div className="flex items-center border-b border-gray-200 bg-gray-50 px-4 py-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-600 font-medium">Session Notes</span>
                    </div>
                    <Textarea
                      placeholder="# Study Session Notes
• Topic: 
• Key concepts:
• Questions to review:
• Summary:"
                      className="min-h-[300px] bg-white border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-y"
                      value={currentSessionNotes}
                      onChange={(e) => setCurrentSessionNotes(e.target.value)}
                    />
                    <div className="border-t border-gray-200 bg-gray-50 px-4 py-2 text-xs text-gray-500 flex justify-between">
                      <span>{currentSessionNotes.length} characters</span>
                      <span>Notes are saved when timer completes</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200/50">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
                        <History className="mr-2 h-5 w-5 text-blue-600" />
                        Study Session History
                      </h2>
                      <p className="text-sm text-gray-600">
                        Track your progress over time and review past study sessions.
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-md relative overflow-hidden">
                      <div className="z-10 relative">
                        <p className="text-xs text-blue-100 uppercase tracking-wider font-medium">Total Sessions</p>
                        <p className="text-3xl font-bold mt-1">{totalSessions}</p>
                        <p className="text-xs mt-1 text-blue-100">
                          {totalSessions === 0 
                            ? "Start your first session today" 
                            : `${sessionHistory.filter(s => s.duration >= 30).length} sessions over 30 min`}
                        </p>
                      </div>
                      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-400/30 rounded-full"></div>
                      <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-blue-400/30 rounded-full"></div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-md relative overflow-hidden">
                      <div className="z-10 relative">
                        <p className="text-xs text-green-100 uppercase tracking-wider font-medium">Total Study Time</p>
                        <p className="text-3xl font-bold mt-1">{Math.floor(totalStudyMinutes / 60)}h {totalStudyMinutes % 60}m</p>
                        <p className="text-xs mt-1 text-green-100">
                          {totalStudyMinutes === 0 
                            ? "No time logged yet" 
                            : `Avg ${Math.floor((totalStudyMinutes / Math.max(1, totalSessions)))} min per session`}
                        </p>
                      </div>
                      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-green-400/30 rounded-full"></div>
                      <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-green-400/30 rounded-full"></div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-4 text-white shadow-md relative overflow-hidden">
                      <div className="z-10 relative">
                        <p className="text-xs text-amber-100 uppercase tracking-wider font-medium">Current Streak</p>
                        <p className="text-3xl font-bold mt-1">{currentStreak} days</p>
                        <p className="text-xs mt-1 text-amber-100">
                          {currentStreak === 0 
                            ? "Study today to start a streak" 
                            : currentStreak === 1 
                              ? "First day of your streak!"
                              : `Keep it going! Study today`}
                        </p>
                      </div>
                      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-amber-400/30 rounded-full"></div>
                      <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-amber-400/30 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Activity Heatmap Placeholder */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <CalendarDays className="h-4 w-4 mr-2 text-blue-600" />
                      Activity Overview
                    </h3>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: 7 }).map((_, dayIndex) => (
                          <div key={dayIndex} className="flex flex-col items-center">
                            <span className="text-xs font-medium text-gray-600 mb-2">
                              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][dayIndex]}
                            </span>
                            <div className="space-y-2">
                              {Array.from({ length: 4 }).map((_, weekIndex) => {
                                const hasSession = sessionHistory.some(session => {
                                  const date = new Date(session.date);
                                  return date.getDay() === (dayIndex + 1) % 7 && 
                                         Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)) < 28;
                                });
                                const intensity = hasSession 
                                  ? Math.random() > 0.7 ? 'bg-blue-500' : 'bg-blue-300'
                                  : 'bg-gray-200';
                                return (
                                  <div 
                                    key={weekIndex} 
                                    className={`w-6 h-6 rounded-sm ${intensity} transition-colors duration-200`}
                                    title={`${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][dayIndex]} Week ${weekIndex + 1}`}
                                  ></div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end mt-3 items-center text-xs text-gray-500">
                        <div className="flex items-center">
                          <span>Less</span>
                          <div className="flex mx-1.5 space-x-1">
                            <div className="w-3 h-3 bg-gray-200 rounded-sm"></div>
                            <div className="w-3 h-3 bg-blue-200 rounded-sm"></div>
                            <div className="w-3 h-3 bg-blue-300 rounded-sm"></div>
                            <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
                            <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                          </div>
                          <span>More</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-blue-600" />
                      Recent Sessions
                    </h3>
                  </div>
                  
                  {sessionHistory.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                      <CalendarDays className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <h3 className="text-gray-500 font-medium mb-1">No sessions yet</h3>
                      <p className="text-gray-400 text-sm">Complete a study session to see your history here</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                      {sessionHistory.map((session) => (
                        <div 
                          key={session.id} 
                          className="border border-gray-200 hover:border-blue-200 rounded-lg p-4 hover:bg-blue-50/30 transition-all duration-200"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                                <Clock className="h-5 w-5" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{session.focusArea} Study</h4>
                                <p className="text-xs text-gray-500">{formatDate(session.date)}</p>
                              </div>
                            </div>
                            <div className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-1 rounded-lg flex items-center">
                              <Clock className="w-3.5 h-3.5 mr-1" />
                              {session.duration} min
                            </div>
                          </div>
                          
                          {session.notes && session.notes.trim() !== '' && (
                            <div className="mt-3 text-sm bg-white p-3 rounded-lg border border-gray-100 hover:border-blue-100 transition-all">
                              <div className="flex items-center mb-2">
                                <FileText className="h-4 w-4 text-blue-600 mr-2" />
                                <h4 className="font-medium text-gray-900 text-sm">Session Notes</h4>
                              </div>
                              <p className="text-gray-700 whitespace-pre-line text-sm">
                                {session.notes.length > 150 
                                  ? `${session.notes.substring(0, 150)}...` 
                                  : session.notes}
                              </p>
                              {session.notes.length > 150 && (
                                <button className="text-xs text-blue-600 hover:text-blue-800 mt-1 font-medium flex items-center">
                                  View Full Notes
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="achievements" className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <Award className="mr-2 h-5 w-5 text-yellow-500" />
                      Study Achievements
                    </h2>
                    
                    <div className="mt-2 sm:mt-0 flex items-center bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                      <Trophy className="h-4 w-4 text-blue-500 mr-2" />
                      <div>
                        <span className="text-sm font-medium text-blue-800">Total XP: </span>
                        <span className="text-sm font-bold text-blue-900">
                          {Math.floor(totalStudyMinutes * 0.5) + (totalSessions * 10) + (currentStreak * 5)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Achievement Progress Summary */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-100">
                    <h3 className="font-medium text-blue-800 mb-3">Achievement Progress</h3>
                    <div className="flex flex-wrap gap-2">
                      <div className="bg-white rounded-full px-3 py-1 text-sm font-medium border border-blue-200 flex items-center">
                        <span className="text-blue-700 mr-1">{
                          [
                            totalSessions >= 1 ? 1 : 0,
                            totalSessions >= 10 ? 1 : 0, 
                            totalSessions >= 25 ? 1 : 0,
                            totalSessions >= 50 ? 1 : 0,
                            totalStudyMinutes >= 1000 ? 1 : 0,
                            totalStudyMinutes >= 3000 ? 1 : 0,
                            currentStreak >= 3 ? 1 : 0,
                            currentStreak >= 7 ? 1 : 0,
                            currentStreak >= 14 ? 1 : 0,
                            weeklyProgress >= weeklyGoal ? 1 : 0,
                            sessionHistory.some(s => s.notes && s.notes.length > 50) ? 1 : 0,
                            sessionHistory.filter(s => s.duration >= 60).length >= 1 ? 1 : 0
                          ].reduce((a, b) => a + b, 0)
                        }</span>
                        <span className="text-gray-500">/ 12 Unlocked</span>
                      </div>
                      <div className="bg-white rounded-full px-3 py-1 text-sm font-medium border border-purple-200 flex items-center">
                        <span className="text-purple-700 mr-1">{Math.floor((totalStudyMinutes / 60) * 10) / 10}</span>
                        <span className="text-gray-500">Hours Studied</span>
                      </div>
                      <div className="bg-white rounded-full px-3 py-1 text-sm font-medium border border-green-200 flex items-center">
                        <span className="text-green-700 mr-1">{totalSessions}</span>
                        <span className="text-gray-500">Sessions</span>
                      </div>
                      <div className="bg-white rounded-full px-3 py-1 text-sm font-medium border border-amber-200 flex items-center">
                        <span className="text-amber-700 mr-1">{currentStreak}</span>
                        <span className="text-gray-500">Day Streak</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* CATEGORY: GETTING STARTED */}
                    <div className="md:col-span-3">
                      <h3 className="font-semibold text-gray-800 mb-3 pb-2 border-b flex items-center">
                        <Zap className="w-4 h-4 mr-2 text-amber-500" /> 
                        Getting Started
                      </h3>
                    </div>
                    
                    {/* Early Bird */}
                    <div className={`border rounded-lg p-4 relative overflow-hidden ${totalSessions >= 1 ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200 opacity-70'}`}>
                      {totalSessions >= 1 && (
                        <div className="absolute top-0 right-0">
                          <div className="bg-yellow-400 text-white text-xs font-bold px-2 py-1 transform rotate-12 translate-x-2 -translate-y-1 shadow-sm">
                            UNLOCKED
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <div className={`text-2xl ${totalSessions >= 1 ? '' : 'grayscale opacity-70'}`}>🌅</div>
                        <div>
                          <h3 className="font-medium text-gray-900">Early Bird</h3>
                          <p className="text-sm text-gray-600">Complete your first study session</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full transition-all duration-700" 
                            style={{ width: `${Math.min(100, (totalSessions / 1) * 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-500">
                            {totalSessions >= 1 ? '+10 XP' : '0/1 sessions'}
                          </p>
                          <p className="text-xs font-medium text-yellow-600">
                            {totalSessions >= 1 ? 'Completed!' : `${Math.round((totalSessions / 1) * 100)}%`}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Note Taker */}
                    <div className={`border rounded-lg p-4 relative overflow-hidden ${
                      sessionHistory.some(s => s.notes && s.notes.length > 50) 
                        ? 'bg-emerald-50 border-emerald-200' 
                        : 'bg-gray-50 border-gray-200 opacity-70'
                    }`}>
                      {sessionHistory.some(s => s.notes && s.notes.length > 50) && (
                        <div className="absolute top-0 right-0">
                          <div className="bg-emerald-400 text-white text-xs font-bold px-2 py-1 transform rotate-12 translate-x-2 -translate-y-1 shadow-sm">
                            UNLOCKED
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <div className={`text-2xl ${
                          sessionHistory.some(s => s.notes && s.notes.length > 50) ? '' : 'grayscale opacity-70'
                        }`}>📝</div>
                        <div>
                          <h3 className="font-medium text-gray-900">Note Taker</h3>
                          <p className="text-sm text-gray-600">Take detailed notes during a study session</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-emerald-500 h-2 rounded-full transition-all duration-700" 
                            style={{ 
                              width: sessionHistory.some(s => s.notes && s.notes.length > 50) ? '100%' : '0%' 
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-500">
                            {sessionHistory.some(s => s.notes && s.notes.length > 50) ? '+15 XP' : 'Add session notes'}
                          </p>
                          <p className="text-xs font-medium text-emerald-600">
                            {sessionHistory.some(s => s.notes && s.notes.length > 50) ? 'Completed!' : 'Incomplete'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Goal Setter */}
                    <div className={`border rounded-lg p-4 relative overflow-hidden ${
                      weeklyProgress >= weeklyGoal 
                        ? 'bg-sky-50 border-sky-200' 
                        : 'bg-gray-50 border-gray-200 opacity-70'
                    }`}>
                      {weeklyProgress >= weeklyGoal && (
                        <div className="absolute top-0 right-0">
                          <div className="bg-sky-400 text-white text-xs font-bold px-2 py-1 transform rotate-12 translate-x-2 -translate-y-1 shadow-sm">
                            UNLOCKED
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <div className={`text-2xl ${weeklyProgress >= weeklyGoal ? '' : 'grayscale opacity-70'}`}>🎯</div>
                        <div>
                          <h3 className="font-medium text-gray-900">Goal Setter</h3>
                          <p className="text-sm text-gray-600">Complete your weekly study goal</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-sky-500 h-2 rounded-full transition-all duration-700" 
                            style={{ width: `${Math.min(100, (weeklyProgress / weeklyGoal) * 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-500">
                            {weeklyProgress >= weeklyGoal ? '+20 XP' : `${weeklyProgress}/${weeklyGoal} min`}
                          </p>
                          <p className="text-xs font-medium text-sky-600">
                            {weeklyProgress >= weeklyGoal 
                              ? 'Completed!' 
                              : `${Math.round((weeklyProgress / weeklyGoal) * 100)}%`}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* CATEGORY: SESSION MILESTONES */}
                    <div className="md:col-span-3 mt-2">
                      <h3 className="font-semibold text-gray-800 mb-3 pb-2 border-b flex items-center">
                        <Award className="w-4 h-4 mr-2 text-blue-500" /> 
                        Session Milestones
                      </h3>
                    </div>
                    
                    {/* Focused Learner */}
                    <div className={`border rounded-lg p-4 relative overflow-hidden ${
                      totalSessions >= 10 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 opacity-70'
                    }`}>
                      {totalSessions >= 10 && (
                        <div className="absolute top-0 right-0">
                          <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 transform rotate-12 translate-x-2 -translate-y-1 shadow-sm">
                            UNLOCKED
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <div className={`text-2xl ${totalSessions >= 10 ? '' : 'grayscale opacity-70'}`}>🧠</div>
                        <div>
                          <h3 className="font-medium text-gray-900">Focused Learner</h3>
                          <p className="text-sm text-gray-600">Complete 10 study sessions</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-700" 
                            style={{ width: `${Math.min(100, (totalSessions / 10) * 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-500">
                            {totalSessions >= 10 ? '+25 XP' : `${totalSessions}/10 sessions`}
                          </p>
                          <p className="text-xs font-medium text-green-600">
                            {totalSessions >= 10 
                              ? 'Completed!' 
                              : `${Math.round((totalSessions / 10) * 100)}%`}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Study Champion */}
                    <div className={`border rounded-lg p-4 relative overflow-hidden ${
                      totalSessions >= 25 ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50 border-gray-200 opacity-70'
                    }`}>
                      {totalSessions >= 25 && (
                        <div className="absolute top-0 right-0">
                          <div className="bg-indigo-500 text-white text-xs font-bold px-2 py-1 transform rotate-12 translate-x-2 -translate-y-1 shadow-sm">
                            UNLOCKED
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <div className={`text-2xl ${totalSessions >= 25 ? '' : 'grayscale opacity-70'}`}>🏆</div>
                        <div>
                          <h3 className="font-medium text-gray-900">Study Champion</h3>
                          <p className="text-sm text-gray-600">Complete 25 study sessions</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-500 h-2 rounded-full transition-all duration-700" 
                            style={{ width: `${Math.min(100, (totalSessions / 25) * 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-500">
                            {totalSessions >= 25 ? '+50 XP' : `${totalSessions}/25 sessions`}
                          </p>
                          <p className="text-xs font-medium text-indigo-600">
                            {totalSessions >= 25 
                              ? 'Completed!' 
                              : `${Math.round((totalSessions / 25) * 100)}%`}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Study Master */}
                    <div className={`border rounded-lg p-4 relative overflow-hidden ${
                      totalSessions >= 50 ? 'bg-violet-50 border-violet-200' : 'bg-gray-50 border-gray-200 opacity-70'
                    }`}>
                      {totalSessions >= 50 && (
                        <div className="absolute top-0 right-0">
                          <div className="bg-violet-500 text-white text-xs font-bold px-2 py-1 transform rotate-12 translate-x-2 -translate-y-1 shadow-sm">
                            UNLOCKED
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <div className={`text-2xl ${totalSessions >= 50 ? '' : 'grayscale opacity-70'}`}>🎓</div>
                        <div>
                          <h3 className="font-medium text-gray-900">Study Master</h3>
                          <p className="text-sm text-gray-600">Complete 50 study sessions</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-violet-500 h-2 rounded-full transition-all duration-700" 
                            style={{ width: `${Math.min(100, (totalSessions / 50) * 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-500">
                            {totalSessions >= 50 ? '+100 XP' : `${totalSessions}/50 sessions`}
                          </p>
                          <p className="text-xs font-medium text-violet-600">
                            {totalSessions >= 50 
                              ? 'Completed!' 
                              : `${Math.round((totalSessions / 50) * 100)}%`}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* CATEGORY: TIME INVESTMENT */}
                    <div className="md:col-span-3 mt-2">
                      <h3 className="font-semibold text-gray-800 mb-3 pb-2 border-b flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-blue-500" /> 
                        Time Investment
                      </h3>
                    </div>
                    
                    {/* Hour Power */}
                    <div className={`border rounded-lg p-4 relative overflow-hidden ${
                      sessionHistory.filter(s => s.duration >= 60).length >= 1 ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200 opacity-70'
                    }`}>
                      {sessionHistory.filter(s => s.duration >= 60).length >= 1 && (
                        <div className="absolute top-0 right-0">
                          <div className="bg-amber-500 text-white text-xs font-bold px-2 py-1 transform rotate-12 translate-x-2 -translate-y-1 shadow-sm">
                            UNLOCKED
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <div className={`text-2xl ${
                          sessionHistory.filter(s => s.duration >= 60).length >= 1 ? '' : 'grayscale opacity-70'
                        }`}>⏰</div>
                        <div>
                          <h3 className="font-medium text-gray-900">Hour Power</h3>
                          <p className="text-sm text-gray-600">Complete a 60+ minute session</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-amber-500 h-2 rounded-full transition-all duration-700" 
                            style={{ 
                              width: sessionHistory.filter(s => s.duration >= 60).length >= 1 ? '100%' : '0%' 
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-500">
                            {sessionHistory.filter(s => s.duration >= 60).length >= 1 
                              ? '+30 XP' 
                              : 'Complete 60 min session'}
                          </p>
                          <p className="text-xs font-medium text-amber-600">
                            {sessionHistory.filter(s => s.duration >= 60).length >= 1 
                              ? 'Completed!' 
                              : 'Incomplete'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Marathon Runner */}
                    <div className={`border rounded-lg p-4 relative overflow-hidden ${
                      totalStudyMinutes >= 1000 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200 opacity-70'
                    }`}>
                      {totalStudyMinutes >= 1000 && (
                        <div className="absolute top-0 right-0">
                          <div className="bg-blue-500 text-white text-xs font-bold px-2 py-1 transform rotate-12 translate-x-2 -translate-y-1 shadow-sm">
                            UNLOCKED
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <div className={`text-2xl ${totalStudyMinutes >= 1000 ? '' : 'grayscale opacity-70'}`}>⏱️</div>
                        <div>
                          <h3 className="font-medium text-gray-900">Marathon Runner</h3>
                          <p className="text-sm text-gray-600">Study for 1000 minutes total</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-700" 
                            style={{ width: `${Math.min(100, (totalStudyMinutes / 1000) * 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-500">
                            {totalStudyMinutes >= 1000 ? '+75 XP' : `${totalStudyMinutes}/1000 minutes`}
                          </p>
                          <p className="text-xs font-medium text-blue-600">
                            {totalStudyMinutes >= 1000 
                              ? 'Completed!' 
                              : `${Math.round((totalStudyMinutes / 1000) * 100)}%`}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Study Olympian */}
                    <div className={`border rounded-lg p-4 relative overflow-hidden ${
                      totalStudyMinutes >= 3000 ? 'bg-cyan-50 border-cyan-200' : 'bg-gray-50 border-gray-200 opacity-70'
                    }`}>
                      {totalStudyMinutes >= 3000 && (
                        <div className="absolute top-0 right-0">
                          <div className="bg-cyan-500 text-white text-xs font-bold px-2 py-1 transform rotate-12 translate-x-2 -translate-y-1 shadow-sm">
                            UNLOCKED
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <div className={`text-2xl ${totalStudyMinutes >= 3000 ? '' : 'grayscale opacity-70'}`}>🏊</div>
                        <div>
                          <h3 className="font-medium text-gray-900">Study Olympian</h3>
                          <p className="text-sm text-gray-600">Study for 3000 minutes total (50 hours)</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-cyan-500 h-2 rounded-full transition-all duration-700" 
                            style={{ width: `${Math.min(100, (totalStudyMinutes / 3000) * 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-500">
                            {totalStudyMinutes >= 3000 ? '+200 XP' : `${totalStudyMinutes}/3000 minutes`}
                          </p>
                          <p className="text-xs font-medium text-cyan-600">
                            {totalStudyMinutes >= 3000 
                              ? 'Completed!' 
                              : `${Math.round((totalStudyMinutes / 3000) * 100)}%`}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* CATEGORY: CONSISTENCY */}
                    <div className="md:col-span-3 mt-2">
                      <h3 className="font-semibold text-gray-800 mb-3 pb-2 border-b flex items-center">
                        <CalendarDays className="w-4 h-4 mr-2 text-purple-500" /> 
                        Consistency Streaks
                      </h3>
                    </div>
                    
                    {/* Habit Builder */}
                    <div className={`border rounded-lg p-4 relative overflow-hidden ${
                      currentStreak >= 3 ? 'bg-rose-50 border-rose-200' : 'bg-gray-50 border-gray-200 opacity-70'
                    }`}>
                      {currentStreak >= 3 && (
                        <div className="absolute top-0 right-0">
                          <div className="bg-rose-500 text-white text-xs font-bold px-2 py-1 transform rotate-12 translate-x-2 -translate-y-1 shadow-sm">
                            UNLOCKED
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <div className={`text-2xl ${currentStreak >= 3 ? '' : 'grayscale opacity-70'}`}>🔥</div>
                        <div>
                          <h3 className="font-medium text-gray-900">Habit Builder</h3>
                          <p className="text-sm text-gray-600">Maintain a 3-day study streak</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-rose-500 h-2 rounded-full transition-all duration-700" 
                            style={{ width: `${Math.min(100, (currentStreak / 3) * 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-500">
                            {currentStreak >= 3 ? '+20 XP' : `${currentStreak}/3 days`}
                          </p>
                          <p className="text-xs font-medium text-rose-600">
                            {currentStreak >= 3 
                              ? 'Completed!' 
                              : `${Math.round((currentStreak / 3) * 100)}%`}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Consistency King */}
                    <div className={`border rounded-lg p-4 relative overflow-hidden ${
                      currentStreak >= 7 ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200 opacity-70'
                    }`}>
                      {currentStreak >= 7 && (
                        <div className="absolute top-0 right-0">
                          <div className="bg-purple-500 text-white text-xs font-bold px-2 py-1 transform rotate-12 translate-x-2 -translate-y-1 shadow-sm">
                            UNLOCKED
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <div className={`text-2xl ${currentStreak >= 7 ? '' : 'grayscale opacity-70'}`}>👑</div>
                        <div>
                          <h3 className="font-medium text-gray-900">Consistency King</h3>
                          <p className="text-sm text-gray-600">Maintain a 7-day study streak</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full transition-all duration-700" 
                            style={{ width: `${Math.min(100, (currentStreak / 7) * 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-500">
                            {currentStreak >= 7 ? '+50 XP' : `${currentStreak}/7 days`}
                          </p>
                          <p className="text-xs font-medium text-purple-600">
                            {currentStreak >= 7 
                              ? 'Completed!' 
                              : `${Math.round((currentStreak / 7) * 100)}%`}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Study Legend */}
                    <div className={`border rounded-lg p-4 relative overflow-hidden ${
                      currentStreak >= 14 ? 'bg-fuchsia-50 border-fuchsia-200' : 'bg-gray-50 border-gray-200 opacity-70'
                    }`}>
                      {currentStreak >= 14 && (
                        <div className="absolute top-0 right-0">
                          <div className="bg-fuchsia-500 text-white text-xs font-bold px-2 py-1 transform rotate-12 translate-x-2 -translate-y-1 shadow-sm">
                            UNLOCKED
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <div className={`text-2xl ${currentStreak >= 14 ? '' : 'grayscale opacity-70'}`}>⭐</div>
                        <div>
                          <h3 className="font-medium text-gray-900">Study Legend</h3>
                          <p className="text-sm text-gray-600">Maintain a 14-day study streak</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-fuchsia-500 h-2 rounded-full transition-all duration-700" 
                            style={{ width: `${Math.min(100, (currentStreak / 14) * 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-500">
                            {currentStreak >= 14 ? '+100 XP' : `${currentStreak}/14 days`}
                          </p>
                          <p className="text-xs font-medium text-fuchsia-600">
                            {currentStreak >= 14 
                              ? 'Completed!' 
                              : `${Math.round((currentStreak / 14) * 100)}%`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Achievement Tips */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Tips to Earn More Achievements
                    </h3>
                    <ul className="space-y-2 text-sm text-blue-700">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 w-5 h-5 text-blue-500 mr-1">•</div>
                        <p>Complete at least one study session every day to build your streak</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 w-5 h-5 text-blue-500 mr-1">•</div>
                        <p>Take detailed notes during your sessions to unlock the Note Taker achievement</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 w-5 h-5 text-blue-500 mr-1">•</div>
                        <p>Try longer focused sessions (60+ minutes) for Hour Power achievement</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 w-5 h-5 text-blue-500 mr-1">•</div>
                        <p>Meet your weekly study goal to earn Goal Setter achievement and XP</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}