import React, { useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { Header } from "@/components/ui/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StudyTimer as StudyTimerComponent } from "@/components/StudyTimer";
import { AlarmClock, BookOpen, Clock, Focus, Loader2, Zap } from "lucide-react";

export default function StudyTimer() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="bg-[#f0f2f5] font-sans text-[#333333] min-h-screen neuro-noise">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex h-screen pt-16">
        <main className="flex-1 p-4 md:p-6 lg:pl-72 overflow-auto">
          <div className="max-w-6xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-[#13294B] mb-2">Focus Timer</h1>
              <p className="text-gray-600 mb-6">
                Improve your study efficiency with our gamified timer. Track your progress, earn badges, and stay focused.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <StudyTimerComponent 
                  onFocusComplete={(minutes) => {
                    console.log(`Completed ${minutes} minutes of focused study`);
                  }}
                  onFocusStart={() => {
                    console.log("Study session started");
                  }}
                />
              </div>
              
              <div className="space-y-6">
                <Card className="neuro-shadow border-2 border-[#13294B]">
                  <CardHeader className="bg-[#13294B] text-white pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Zap className="w-5 h-5" /> Focus Mode Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-sm">1</span>
                        </div>
                        <p className="text-sm">Improved concentration by eliminating digital distractions</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-sm">2</span>
                        </div>
                        <p className="text-sm">Enhanced knowledge retention through focused study periods</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-sm">3</span>
                        </div>
                        <p className="text-sm">Better time management with structured study sessions</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-sm">4</span>
                        </div>
                        <p className="text-sm">Reduced study fatigue by incorporating regular breaks</p>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
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
          </div>
        </main>
      </div>
    </div>
  );
}