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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#13294B] mb-2">Focus Timer</h1>
                <p className="text-gray-600">
                  Improve your study efficiency with our gamified timer. Track your progress, earn badges, and stay focused.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-blue-500 text-blue-700 hover:bg-blue-50 shadow-sm"
                  onClick={() => setShowPlannerOverlay(true)}
                >
                  <AlarmClock className="mr-2 h-4 w-4" />
                  Plan Session
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 shadow-sm"
                  onClick={() => setShowPlannerOverlay(true)}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Quick Start
                </Button>
              </div>
            </div>
            
            {/* Weekly Goal Progress */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <h3 className="font-medium text-gray-900 flex items-center">
                  <BarChart4 className="mr-2 h-5 w-5 text-blue-600" />
                  Weekly Study Goal
                </h3>
                <div className="flex items-center text-sm mt-1 sm:mt-0">
                  <span className="text-blue-600 font-medium">{weeklyProgress} minutes</span>
                  <span className="mx-1 text-gray-500">of</span>
                  <span className="text-gray-700">{weeklyGoal} minutes</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (weeklyProgress / weeklyGoal) * 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {weeklyProgress >= weeklyGoal 
                  ? "Weekly goal achieved! 🎉" 
                  : `${weeklyGoal - weeklyProgress} minutes remaining this week`}
              </p>
            </div>
            
            <Tabs defaultValue="timer" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start mb-6">
                <TabsTrigger value="timer" className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Timer
                </TabsTrigger>
                <TabsTrigger value="notes" className="flex items-center">
                  <PenLine className="mr-2 h-4 w-4" />
                  Session Notes
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center">
                  <History className="mr-2 h-4 w-4" />
                  History
                </TabsTrigger>
                <TabsTrigger value="achievements" className="flex items-center">
                  <Award className="mr-2 h-4 w-4" />
                  Achievements
                </TabsTrigger>
              </TabsList>
              
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
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <PenLine className="mr-2 h-5 w-5 text-blue-600" />
                    Session Notes
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Take notes during your study session. These will be saved with your session history when you complete the timer.
                  </p>
                  <Textarea
                    placeholder="Write your study notes here..."
                    className="min-h-[200px] bg-white"
                    value={currentSessionNotes}
                    onChange={(e) => setCurrentSessionNotes(e.target.value)}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <History className="mr-2 h-5 w-5 text-blue-600" />
                    Study Session History
                  </h2>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-6">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Total Sessions</p>
                        <p className="text-2xl font-bold text-blue-600">{totalSessions}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Hours Studied</p>
                        <p className="text-2xl font-bold text-green-600">{(totalStudyMinutes / 60).toFixed(1)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Current Streak</p>
                        <p className="text-2xl font-bold text-orange-600">{currentStreak} days</p>
                      </div>
                    </div>
                  </div>
                  
                  {sessionHistory.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                      <CalendarDays className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <h3 className="text-gray-500 font-medium mb-1">No sessions yet</h3>
                      <p className="text-gray-400 text-sm">Complete a study session to see your history here</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                      {sessionHistory.map((session) => (
                        <div 
                          key={session.id} 
                          className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {session.focusArea}
                              </span>
                              <span className="text-sm text-gray-500">{formatDate(session.date)}</span>
                            </div>
                            <div className="mt-1 sm:mt-0">
                              <span className="text-sm font-medium text-gray-900">
                                {session.duration} minutes
                              </span>
                            </div>
                          </div>
                          {session.notes && (
                            <div className="mt-2 text-sm bg-gray-50 p-3 rounded border border-gray-100">
                              <h4 className="font-medium mb-1 text-gray-900">Session Notes:</h4>
                              <p className="text-gray-700 whitespace-pre-line">{session.notes}</p>
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