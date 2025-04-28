import React, { useState } from 'react';
import { BadgeCollection } from '@/components/badges/BadgeCollection';
import { useBadges } from '@/contexts/BadgeContext';
import { Badge as BadgeType } from '@/lib/badges';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Trophy, Award, Medal, RotateCcw } from 'lucide-react';
import { Header } from '@/components/ui/header';
import { Sidebar } from '@/components/ui/sidebar';

export default function Achievements() {
  const { unlockedBadges, userStats, resetProgress } = useBadges();
  const [showLocked, setShowLocked] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all your progress? This action cannot be undone.')) {
      resetProgress();
    }
  };
  
  return (
    <div className="bg-[#f0f2f5] font-sans text-[#333333] min-h-screen neuro-noise">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex h-screen pt-16">
        <main className="flex-1 p-4 md:p-6 lg:pl-72 overflow-auto">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-[#13294B] mb-2">Your Achievements</h1>
                <p className="text-gray-600">
                  Track your progress and unlock badges as you master nursing content.
                </p>
              </div>
              
              <div className="mt-4 md:mt-0 flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="showLocked" 
                    checked={showLocked} 
                    onChange={() => setShowLocked(!showLocked)} 
                    className="rounded text-[#4B9CD3] focus:ring-[#4B9CD3]"
                  />
                  <label htmlFor="showLocked" className="text-sm text-gray-700">Show Locked Badges</label>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleResetProgress}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Progress
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="bg-[#13294B] text-white p-4">
                <h2 className="text-xl font-semibold">Your Stats</h2>
              </div>
              
              <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm">Questions Answered</p>
                  <p className="text-2xl font-bold text-[#13294B]">{userStats.questionsAnswered}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm">Correct Answers</p>
                  <p className="text-2xl font-bold text-green-600">{userStats.questionsCorrect}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm">Tests Completed</p>
                  <p className="text-2xl font-bold text-[#4B9CD3]">{userStats.testsCompleted}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm">Current Streak</p>
                  <p className="text-2xl font-bold text-amber-500">{userStats.streakDays} days</p>
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6 bg-gray-100">
                <TabsTrigger value="all" className="flex items-center">
                  <Award className="h-4 w-4 mr-2" />
                  All Badges
                </TabsTrigger>
                <TabsTrigger value="achievement" className="flex items-center">
                  <Trophy className="h-4 w-4 mr-2" />
                  Achievements
                </TabsTrigger>
                <TabsTrigger value="progress" className="flex items-center">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Progress
                </TabsTrigger>
                <TabsTrigger value="specialty" className="flex items-center">
                  <Medal className="h-4 w-4 mr-2" />
                  Specialties
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <BadgeCollection 
                  unlockedBadges={unlockedBadges} 
                  showLocked={showLocked} 
                  filterCategory="all" 
                />
              </TabsContent>
              
              <TabsContent value="achievement">
                <BadgeCollection 
                  unlockedBadges={unlockedBadges} 
                  showLocked={showLocked} 
                  filterCategory="achievement" 
                />
              </TabsContent>
              
              <TabsContent value="progress">
                <BadgeCollection 
                  unlockedBadges={unlockedBadges} 
                  showLocked={showLocked} 
                  filterCategory="progress" 
                />
              </TabsContent>
              
              <TabsContent value="specialty">
                <BadgeCollection 
                  unlockedBadges={unlockedBadges} 
                  showLocked={showLocked} 
                  filterCategory="specialty" 
                />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}