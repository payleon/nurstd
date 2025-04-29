import React, { useState } from "react";
import { useBadges } from "@/contexts/BadgeContext";
import { LearningProgressChart } from "@/components/progress/LearningProgressChart";
import { Header } from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";
import { BadgeCollection } from "@/components/badges/BadgeCollection";
import { LearningAchievementsSection } from "@/components/LearningAchievementsSection";
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, BookOpen, Calendar, Clock, PercentIcon, Target } from "lucide-react";
import { motion } from "framer-motion";
import { UserStats } from "@/lib/badges";

// Define types for our chart data
interface ChartDataItem {
  name: string;
  value: number;
  color?: string;
}

// Helper function to get specialty data formatted for charts
function getSpecialtyData(stats: UserStats): ChartDataItem[] {
  return Object.entries(stats.specialtyQuestionsCompleted || {}).map(([name, count]) => ({
    name,
    value: count as number,
  }));
}

// Helper function to get performance data formatted for charts
function getPerformanceData(stats: UserStats): ChartDataItem[] {
  return [
    { name: "Correct", value: stats.questionsCorrect, color: "#4ade80" },
    { name: "Incorrect", value: stats.questionsIncorrect, color: "#f87171" },
  ];
}

// Custom tooltip component for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 shadow-md text-xs">
        <p className="font-bold">{`${label || payload[0].name}`}</p>
        <p>{`${payload[0].value} questions`}</p>
      </div>
    );
  }
  return null;
};

// Custom pie chart label
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
  
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function LearningProgress() {
  const { userStats, unlockedBadges } = useBadges();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Calculate statistics for display
  const correctPercentage = userStats.questionsCorrect > 0 
    ? Math.round((userStats.questionsCorrect / userStats.questionsAnswered) * 100) 
    : 0;
  
  const daysActive = userStats.streakDays;
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Format specialty data for charts
  const specialtyData = getSpecialtyData(userStats);
  const performanceData = getPerformanceData(userStats);
  
  // Generate fake weekly history data (in a real app, this would come from a database)
  const weeklyProgressData = [
    { day: "Mon", questions: 12 },
    { day: "Tue", questions: 19 },
    { day: "Wed", questions: 8 },
    { day: "Thu", questions: 15 },
    { day: "Fri", questions: 20 },
    { day: "Sat", questions: 25 },
    { day: "Sun", questions: 18 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#83a6ed'];
  
  return (
    <div className="bg-[#f0f2f5] font-sans text-[#333333] min-h-screen neuro-noise">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex min-h-screen pt-16">
        <main className="flex-1 p-4 md:p-6 lg:pl-72 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-[#13294B]">Learning Progress Dashboard</h1>
            </div>
            
            {/* Animated Learning Progress Chart */}
            <div className="mb-8">
              <LearningProgressChart userStats={userStats} />
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg p-4 shadow flex items-center"
              >
                <div className="rounded-full bg-blue-100 p-3 mr-4">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Questions Answered</p>
                  <p className="text-2xl font-bold">{userStats.questionsAnswered}</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-white rounded-lg p-4 shadow flex items-center"
              >
                <div className="rounded-full bg-green-100 p-3 mr-4">
                  <PercentIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Success Rate</p>
                  <p className="text-2xl font-bold">{correctPercentage}%</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-white rounded-lg p-4 shadow flex items-center"
              >
                <div className="rounded-full bg-purple-100 p-3 mr-4">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Days Active</p>
                  <p className="text-2xl font-bold">{daysActive}</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="bg-white rounded-lg p-4 shadow flex items-center"
              >
                <div className="rounded-full bg-orange-100 p-3 mr-4">
                  <Target className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Badges Earned</p>
                  <p className="text-2xl font-bold">{unlockedBadges.length}</p>
                </div>
              </motion.div>
            </div>
            
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Performance Distribution */}
              <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader className="pb-2">
                  <CardTitle>Performance Distribution</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={performanceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={renderCustomizedLabel}
                        >
                          {performanceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Specialty Breakdown */}
              <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader className="pb-2">
                  <CardTitle>Specialty Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={specialtyData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                      >
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={120} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="value" name="Questions Completed" radius={[0, 4, 4, 0]}>
                          {specialtyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Weekly Progress */}
              <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader className="pb-2">
                  <CardTitle>Weekly Progress</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={weeklyProgressData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="questions" name="Questions Completed" fill="#4B9CD3" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent Badges */}
              <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader className="pb-2">
                  <CardTitle>Recently Earned Badges</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-64 overflow-y-auto">
                    <BadgeCollection 
                      unlockedBadges={unlockedBadges.slice(0, 8)} 
                      showLocked={false}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Learning Achievements with Sparkle Effects */}
            <div className="mb-8">
              <LearningAchievementsSection 
                currentStreak={daysActive}
                totalQuestions={userStats.questionsAnswered}
                correctPercentage={correctPercentage}
                badgesEarned={unlockedBadges.length}
                improvementRate={12} // This would typically be calculated based on historical data
              />
            </div>
            
            {/* Learning Insights */}
            <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
              <CardHeader>
                <CardTitle>Learning Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="strengths">
                  <TabsList className="w-full mb-4">
                    <TabsTrigger value="strengths" className="flex-1">Your Strengths</TabsTrigger>
                    <TabsTrigger value="improvement" className="flex-1">Areas for Improvement</TabsTrigger>
                    <TabsTrigger value="suggestions" className="flex-1">Study Suggestions</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="strengths">
                    <div className="space-y-4">
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-start"
                      >
                        <div className="bg-green-100 p-2 rounded-full mr-3">
                          <Book className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-green-700">Consistent Learning Pattern</h3>
                          <p className="text-gray-600">You've maintained a study streak of {daysActive} days. Consistency is key to success!</p>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex items-start"
                      >
                        <div className="bg-green-100 p-2 rounded-full mr-3">
                          <Book className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-green-700">{specialtyData.length > 0 ? specialtyData[0].name : "No data yet"}</h3>
                          <p className="text-gray-600">Your strongest knowledge area with {specialtyData.length > 0 ? String(specialtyData[0].value) : "0"} questions completed.</p>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex items-start"
                      >
                        <div className="bg-green-100 p-2 rounded-full mr-3">
                          <Book className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-green-700">Overall Accuracy</h3>
                          <p className="text-gray-600">You're answering {correctPercentage}% of questions correctly, showing good understanding.</p>
                        </div>
                      </motion.div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="improvement">
                    <div className="space-y-4">
                      {correctPercentage < 75 && (
                        <div className="flex items-start">
                          <div className="bg-orange-100 p-2 rounded-full mr-3">
                            <Target className="h-5 w-5 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-orange-700">Answer Accuracy</h3>
                            <p className="text-gray-600">Try to increase your correct answer rate above 75% to improve mastery.</p>
                          </div>
                        </div>
                      )}
                      
                      {specialtyData.length < 3 && (
                        <div className="flex items-start">
                          <div className="bg-orange-100 p-2 rounded-full mr-3">
                            <Target className="h-5 w-5 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-orange-700">Subject Diversity</h3>
                            <p className="text-gray-600">Expand your knowledge by exploring more specialty areas in nursing.</p>
                          </div>
                        </div>
                      )}
                      
                      {userStats.questionsAnswered < 50 && (
                        <div className="flex items-start">
                          <div className="bg-orange-100 p-2 rounded-full mr-3">
                            <Target className="h-5 w-5 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-orange-700">Question Volume</h3>
                            <p className="text-gray-600">Aim to complete at least 50 questions for broader coverage of exam topics.</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Default message if no specific improvements needed */}
                      {(correctPercentage >= 75 && specialtyData.length >= 3 && userStats.questionsAnswered >= 50) && (
                        <div className="flex items-start">
                          <div className="bg-green-100 p-2 rounded-full mr-3">
                            <Target className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-green-700">Doing Great!</h3>
                            <p className="text-gray-600">You're on the right track. Continue to challenge yourself with more advanced questions.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="suggestions">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <Clock className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-blue-700">Spaced Repetition</h3>
                          <p className="text-gray-600">Review questions from your weak areas every 2-3 days to reinforce learning.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <Clock className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-blue-700">Content Diversity</h3>
                          <p className="text-gray-600">Mix up your study routine with different question types and subjects each day.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <Clock className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-blue-700">Test Simulations</h3>
                          <p className="text-gray-600">Take full practice tests weekly to build test-taking stamina and identify knowledge gaps.</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}