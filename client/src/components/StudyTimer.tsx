import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  PlayCircle, 
  PauseCircle, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  Trophy, 
  ZapOff,
  AlarmClock
} from "lucide-react";
import { useBadges } from "@/contexts/BadgeContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Timer presets in minutes
const TIMER_PRESETS = [
  { value: "5", label: "5 minutes" },
  { value: "15", label: "15 minutes" },
  { value: "25", label: "25 minutes (Pomodoro)" },
  { value: "30", label: "30 minutes" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "1 hour" },
  { value: "90", label: "1.5 hours" },
  { value: "120", label: "2 hours" },
  { value: "custom", label: "Custom" }
];

// Focus session badge thresholds
const FOCUS_BADGES = {
  bronze: 5, // 5 completed sessions
  silver: 15, // 15 completed sessions
  gold: 30 // 30 completed sessions
};

interface StudyTimerProps {
  onFocusComplete?: (minutesStudied: number) => void;
  onFocusStart?: (duration?: number, focusArea?: string, energy?: number, recommendations?: string[]) => void;
  initialDuration?: number;
  initialFocusArea?: string;
  recommendations?: string[];
}

export function StudyTimer({ 
  onFocusComplete, 
  onFocusStart,
  initialDuration, 
  initialFocusArea,
  recommendations = []
}: StudyTimerProps) {
  // Timer state
  const [timerDuration, setTimerDuration] = useState(25); // Default to 25 minutes (Pomodoro)
  const [timeRemaining, setTimeRemaining] = useState(timerDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [totalTimeStudied, setTotalTimeStudied] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState("25");
  const [customTime, setCustomTime] = useState(25);
  
  // Focus mode settings
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [focusModeEnabled, setFocusModeEnabled] = useState(false);
  const [distractionBlocking, setDistractionBlocking] = useState(false);
  
  // Streak system
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [lastSessionDate, setLastSessionDate] = useState<Date | null>(null);
  
  // refs
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const { toast } = useToast();
  const { updateAfterTestCompleted } = useBadges();
  
  // Load saved data from localStorage on component mount and apply initial values
  useEffect(() => {
    // Set initial duration if provided
    if (initialDuration) {
      setTimerDuration(initialDuration);
      setTimeRemaining(initialDuration * 60);
      // Find matching preset or set to custom
      const matchingPreset = TIMER_PRESETS.find(preset => preset.value === initialDuration.toString());
      if (matchingPreset) {
        setSelectedPreset(matchingPreset.value);
      } else {
        setSelectedPreset("custom");
        setCustomTime(initialDuration);
      }
    }
    
    // Set focus area if provided
    if (initialFocusArea) {
      console.log("Setting initial focus area:", initialFocusArea);
    }
    
    // Load saved user data
    const savedData = localStorage.getItem('studyTimerData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setSessionsCompleted(data.sessionsCompleted || 0);
      setTotalTimeStudied(data.totalTimeStudied || 0);
      setCurrentStreak(data.currentStreak || 0);
      setBestStreak(data.bestStreak || 0);
      if (data.lastSessionDate) {
        setLastSessionDate(new Date(data.lastSessionDate));
      }
    }
    
    // Initialize audio
    audioRef.current = new Audio('/notification.mp3');
  }, [initialDuration, initialFocusArea]);
  
  // Save data to localStorage whenever relevant state changes
  useEffect(() => {
    const dataToSave = {
      sessionsCompleted,
      totalTimeStudied,
      currentStreak,
      bestStreak,
      lastSessionDate: lastSessionDate?.toISOString(),
    };
    localStorage.setItem('studyTimerData', JSON.stringify(dataToSave));
  }, [sessionsCompleted, totalTimeStudied, currentStreak, bestStreak, lastSessionDate]);
  
  // Timer countdown logic
  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = window.setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current!);
            completeSession();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, isPaused]);
  
  // Handle timer preset selection
  const handlePresetChange = (value: string) => {
    setSelectedPreset(value);
    
    if (value === "custom") {
      // Don't change the timer yet - wait for custom input
      return;
    }
    
    const minutes = parseInt(value, 10);
    setTimerDuration(minutes);
    setTimeRemaining(minutes * 60);
    resetTimer();
  };
  
  // Handle custom time input
  const handleCustomTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0 && value <= 240) { // Limit to 4 hours max
      setCustomTime(value);
      
      if (selectedPreset === "custom") {
        setTimerDuration(value);
        setTimeRemaining(value * 60);
      }
    }
  };
  
  // Apply custom time
  const applyCustomTime = () => {
    setTimerDuration(customTime);
    setTimeRemaining(customTime * 60);
    resetTimer();
  };
  
  // Start timer
  const startTimer = () => {
    if (focusModeEnabled) {
      enableFocusMode();
    }
    
    setIsActive(true);
    setIsPaused(false);
    
    if (onFocusStart) {
      onFocusStart(timerDuration, initialFocusArea, undefined, recommendations);
    }
    
    toast({
      title: "Study Session Started",
      description: `Your ${timerDuration}-minute focus session has begun. Stay focused!`,
    });
  };
  
  // Pause timer
  const pauseTimer = () => {
    setIsPaused(true);
  };
  
  // Resume timer
  const resumeTimer = () => {
    setIsPaused(false);
  };
  
  // Reset timer
  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeRemaining(timerDuration * 60);
    
    if (focusModeEnabled && distractionBlocking) {
      disableFocusMode();
    }
  };
  
  // Complete a session
  const completeSession = () => {
    // Sound notification disabled for now
    if (soundEnabled) {
      console.log("Session completed - notification would play here");
    }
    
    // Update statistics
    setSessionsCompleted(prev => prev + 1);
    setTotalTimeStudied(prev => prev + timerDuration);
    
    // Update streak
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    
    const lastDay = lastSessionDate ? new Date(lastSessionDate) : null;
    if (lastDay) {
      lastDay.setHours(0, 0, 0, 0); // Normalize to start of day
      
      const dayDiff = Math.floor((today.getTime() - lastDay.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        // Consecutive day, increase streak
        const newStreak = currentStreak + 1;
        setCurrentStreak(newStreak);
        if (newStreak > bestStreak) {
          setBestStreak(newStreak);
        }
      } else if (dayDiff > 1) {
        // Streak broken
        setCurrentStreak(1);
      }
    } else {
      // First session ever
      setCurrentStreak(1);
      setBestStreak(1);
    }
    
    setLastSessionDate(today);
    
    // Disable focus mode if active
    if (focusModeEnabled && distractionBlocking) {
      disableFocusMode();
    }
    
    // Reset timer state
    setIsActive(false);
    setIsPaused(false);
    setTimeRemaining(timerDuration * 60);
    
    // Callback
    if (onFocusComplete) {
      onFocusComplete(timerDuration);
    }
    
    // Show completion toast
    toast({
      title: "Session Complete! 🎉",
      description: `Great job! You've completed a ${timerDuration}-minute study session.`,
    });
    
    // Update badges (using the test completed method as a proxy)
    updateAfterTestCompleted(1, 1, true);
  };
  
  // Enable focus mode
  const enableFocusMode = () => {
    // This would ideally integrate with browser APIs to:
    // 1. Request fullscreen mode
    // 2. Block notifications (if possible)
    // 3. Apply other focus-enhancing features
    
    if (document.documentElement.requestFullscreen && distractionBlocking) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error("Error attempting to enable full-screen mode:", err);
      });
    }
  };
  
  // Disable focus mode
  const disableFocusMode = () => {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(err => {
        console.error("Error attempting to exit full-screen mode:", err);
      });
    }
  };
  
  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage
  const progressPercentage = (1 - timeRemaining / (timerDuration * 60)) * 100;
  
  return (
    <Card className="w-full neuro-shadow">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg border-b pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
            <Clock className="w-5 h-5" /> Study Timer
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 pb-4">
        <div className="flex flex-col space-y-4">
          {/* Timer Display */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-5xl font-bold text-blue-900 font-mono">
              {formatTime(timeRemaining)}
            </div>
            <Progress value={progressPercentage} className="h-2 mt-4" />
          </div>
          
          {/* Timer Controls */}
          <div className="flex justify-center space-x-2 mt-2">
            {!isActive ? (
              <Button 
                variant="default" 
                onClick={startTimer}
                className="bg-blue-600 hover:bg-blue-700 flex items-center"
              >
                <PlayCircle className="mr-2 h-5 w-5" /> Start
              </Button>
            ) : isPaused ? (
              <Button 
                variant="default" 
                onClick={resumeTimer}
                className="bg-green-600 hover:bg-green-700 flex items-center"
              >
                <PlayCircle className="mr-2 h-5 w-5" /> Resume
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={pauseTimer}
                className="border-yellow-500 text-yellow-700 hover:bg-yellow-50 flex items-center"
              >
                <PauseCircle className="mr-2 h-5 w-5" /> Pause
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={resetTimer}
              className="border-red-300 text-red-600 hover:bg-red-50 flex items-center"
            >
              <RefreshCw className="mr-2 h-5 w-5" /> Reset
            </Button>
          </div>
          
          {/* Timer Settings */}
          <div className="mt-4 grid grid-cols-1 gap-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="timer-preset">Timer Duration</Label>
              <Select
                value={selectedPreset}
                onValueChange={handlePresetChange}
              >
                <SelectTrigger id="timer-preset">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {TIMER_PRESETS.map((preset) => (
                    <SelectItem key={preset.value} value={preset.value}>
                      {preset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedPreset === "custom" && (
                <div className="flex mt-2 items-center space-x-2">
                  <input
                    type="number"
                    className="w-20 px-2 py-1 border border-gray-300 rounded-md"
                    value={customTime}
                    min={1}
                    max={240}
                    onChange={handleCustomTimeChange}
                  />
                  <span className="text-sm text-gray-600">minutes</span>
                  <Button size="sm" onClick={applyCustomTime}>Apply</Button>
                </div>
              )}
            </div>
            
            {/* Focus Mode Setting */}
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="font-medium">Focus Mode</span>
                <span className="text-sm text-gray-600">Minimize distractions</span>
              </div>
              <Switch 
                checked={focusModeEnabled} 
                onCheckedChange={setFocusModeEnabled} 
                id="focus-mode"
              />
            </div>
            
            {focusModeEnabled && (
              <div className="flex justify-between items-center pl-4 border-l-2 border-blue-200">
                <div className="flex flex-col">
                  <span className="font-medium">Fullscreen Mode</span>
                  <span className="text-sm text-gray-600">Block distractions</span>
                </div>
                <Switch 
                  checked={distractionBlocking} 
                  onCheckedChange={setDistractionBlocking} 
                  id="distraction-blocking"
                />
              </div>
            )}
          </div>
          
          {/* Recommendations Section - only shown when there are recommendations */}
          {recommendations && recommendations.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-blue-600" /> Study Recommendations
              </h3>
              <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                {recommendations.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="ml-2 text-sm text-gray-800">{item}</p>
                  </div>
                ))}
                {isActive && !isPaused && (
                  <div className="flex items-start pt-2">
                    <AlarmClock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="ml-2 text-sm text-blue-800 font-medium">
                      Focus on these items during your current session
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Stats Section */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Trophy className="w-4 h-4 mr-2 text-yellow-500" /> Your Study Stats
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-xs text-blue-800 uppercase">Sessions</div>
                <div className="text-2xl font-bold text-blue-900">{sessionsCompleted}</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-xs text-green-800 uppercase">Hours</div>
                <div className="text-2xl font-bold text-green-900">
                  {(totalTimeStudied / 60).toFixed(1)}
                </div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-xs text-purple-800 uppercase">Streak</div>
                <div className="text-2xl font-bold text-purple-900">{currentStreak} days</div>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg">
                <div className="text-xs text-amber-800 uppercase">Best</div>
                <div className="text-2xl font-bold text-amber-900">{bestStreak} days</div>
              </div>
            </div>
          </div>
          
          {/* Focus Badge Progress */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-blue-500" /> Focus Badge Progress
            </h3>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Bronze Focus Badge</span>
                  <span className="text-sm font-medium">
                    {Math.min(sessionsCompleted, FOCUS_BADGES.bronze)}/{FOCUS_BADGES.bronze} sessions
                  </span>
                </div>
                <Progress 
                  value={(Math.min(sessionsCompleted, FOCUS_BADGES.bronze) / FOCUS_BADGES.bronze) * 100} 
                  className="h-2"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Silver Focus Badge</span>
                  <span className="text-sm font-medium">
                    {Math.min(sessionsCompleted, FOCUS_BADGES.silver)}/{FOCUS_BADGES.silver} sessions
                  </span>
                </div>
                <Progress 
                  value={(Math.min(sessionsCompleted, FOCUS_BADGES.silver) / FOCUS_BADGES.silver) * 100} 
                  className="h-2"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Gold Focus Badge</span>
                  <span className="text-sm font-medium">
                    {Math.min(sessionsCompleted, FOCUS_BADGES.gold)}/{FOCUS_BADGES.gold} sessions
                  </span>
                </div>
                <Progress 
                  value={(Math.min(sessionsCompleted, FOCUS_BADGES.gold) / FOCUS_BADGES.gold) * 100} 
                  className="h-2"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}