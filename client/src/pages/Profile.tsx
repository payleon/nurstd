import React, { useState } from "react";
import { useBadges } from "@/contexts/BadgeContext";
import { MascotEvolutionCard } from "@/components/mascot/MascotEvolutionCard";
import { BadgeCollection } from "@/components/badges/BadgeCollection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Award, BookOpen, Clock, Medal, RotateCcw, User } from "lucide-react";
import { Link } from "wouter";
import { Header } from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";

export default function Profile() {
  const { userStats, unlockedBadges, resetProgress } = useBadges();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Calculate statistics
  const correctPercentage = userStats.questionsCorrect > 0 
    ? Math.round((userStats.questionsCorrect / userStats.questionsAnswered) * 100) 
    : 0;
  
  const avgTimePerQuestion = userStats.questionsAnswered > 0 
    ? Math.round((userStats.timeSpent / userStats.questionsAnswered) * 100) / 100 
    : 0;
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleResetProgress = () => {
    if (window.confirm("Are you sure you want to reset all progress? This will reset your badges, statistics, and mascot evolution.")) {
      resetProgress();
    }
  };
  
  return (
    <div className="bg-[#f0f2f5] font-sans text-[#333333] min-h-screen neuro-noise">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex min-h-screen pt-16">
        <main className="flex-1 p-4 md:p-6 lg:pl-72 overflow-auto w-full">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-[#13294B]">Your Profile</h1>
      
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left column - Study Stats */}
              <div>
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                  <div className="bg-[#13294B] text-white p-4">
                    <h3 className="font-bold text-lg">Study Statistics</h3>
                    <p className="text-sm text-[#B8C5D9]">Track your progress</p>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    <div className="flex items-center p-3 bg-[#F5F8FF] rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-[#E1EAFF] flex items-center justify-center mr-3 text-[#4B9CD3]">
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Questions Completed</p>
                        <p className="text-xl font-bold text-[#13294B]">{userStats.questionsAnswered}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-[#F5F8FF] rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-[#E1EAFF] flex items-center justify-center mr-3 text-[#4B9CD3]">
                        <Medal size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Correct Answers</p>
                        <p className="text-xl font-bold text-[#13294B]">{correctPercentage}%</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-[#F5F8FF] rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-[#E1EAFF] flex items-center justify-center mr-3 text-[#4B9CD3]">
                        <Clock size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Avg. Time per Question</p>
                        <p className="text-xl font-bold text-[#13294B]">{avgTimePerQuestion} min</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-[#F5F8FF] rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-[#E1EAFF] flex items-center justify-center mr-3 text-[#4B9CD3]">
                        <Award size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Badges Earned</p>
                        <p className="text-xl font-bold text-[#13294B]">{unlockedBadges.length}</p>
                      </div>
                    </div>
                    
                    <div className="pt-3">
                      <button 
                        onClick={handleResetProgress}
                        className="w-full flex items-center justify-center py-2 px-4 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors text-sm"
                      >
                        <RotateCcw size={16} className="mr-2" />
                        Reset Progress
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Middle column - Mascot */}
              <div>
                <MascotEvolutionCard userStats={userStats} />
              </div>
              
              {/* Right column - Badges */}
              <div>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="bg-[#13294B] text-white p-4">
                    <h3 className="font-bold text-lg">Your Achievements</h3>
                    <p className="text-sm text-[#B8C5D9]">Badges and awards you've earned</p>
                  </div>
                  
                  <div className="p-4">
                    <Tabs defaultValue="achievement">
                      <TabsList className="w-full mb-4">
                        <TabsTrigger value="achievement" className="flex-1">Achievements</TabsTrigger>
                        <TabsTrigger value="progress" className="flex-1">Progress</TabsTrigger>
                        <TabsTrigger value="specialty" className="flex-1">Specialty</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="achievement">
                        <BadgeCollection 
                          unlockedBadges={unlockedBadges} 
                          filterCategory="achievement" 
                          showLocked={true}
                        />
                      </TabsContent>
                      
                      <TabsContent value="progress">
                        <BadgeCollection 
                          unlockedBadges={unlockedBadges} 
                          filterCategory="progress" 
                          showLocked={true}
                        />
                      </TabsContent>
                      
                      <TabsContent value="specialty">
                        <BadgeCollection 
                          unlockedBadges={unlockedBadges} 
                          filterCategory="specialty" 
                          showLocked={true}
                        />
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}