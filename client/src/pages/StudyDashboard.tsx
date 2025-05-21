import React, { useState } from 'react';
import { Link } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen,
  Brain,
  BarChart2,
  Clock,
  Award,
  FileText,
  CalendarDays,
  TrendingUp,
  Target,
  Layers,
  Book,
  Bookmark,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Header } from '@/components/ui/header';
import { Sidebar } from '@/components/ui/sidebar';
import { EnhancedTestCard } from '@/components/exam/EnhancedTestCard';
import { StudyRecommendations } from '@/components/exam/StudyRecommendations';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

export default function StudyDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Mock data - this would come from the API in a real application
  const recentExams = [
    { id: 1, title: "Advanced NCLEX Practice", score: 76, date: "2025-05-18T14:30:00", questionCount: 85, timeSpent: 72 },
    { id: 2, title: "Pediatric Nursing", score: 65, date: "2025-05-15T09:15:00", questionCount: 45, timeSpent: 38 },
    { id: 3, title: "Cardiac & Emergency", score: 82, date: "2025-05-10T16:00:00", questionCount: 60, timeSpent: 55 },
  ];
  
  const weakAreas = [
    { category: "Pharmacology", score: 62, questionCount: 48 },
    { category: "Mental Health", score: 68, questionCount: 25 },
    { category: "Pediatrics", score: 65, questionCount: 42 },
    { category: "Critical Care", score: 71, questionCount: 35 },
  ];
  
  const strongAreas = [
    { category: "Fundamentals", score: 88, questionCount: 65 },
    { category: "Maternity", score: 82, questionCount: 40 },
    { category: "Medical-Surgical", score: 79, questionCount: 120 },
  ];
  
  const categoryPerformance = [
    { name: "Fundamentals", score: 88 },
    { name: "Med-Surg", score: 79 },
    { name: "Maternity", score: 82 },
    { name: "Pediatrics", score: 65 },
    { name: "Mental Health", score: 68 },
    { name: "Pharmacology", score: 62 },
    { name: "Critical Care", score: 71 },
  ];
  
  const progressData = [
    { date: "May 1", score: 58 },
    { date: "May 5", score: 62 },
    { date: "May 10", score: 67 },
    { date: "May 15", score: 65 },
    { date: "May 18", score: 76 },
  ];
  
  const questionTypeData = [
    { name: "Multiple Choice", value: 65 },
    { name: "SATA", value: 18 },
    { name: "Prioritization", value: 10 },
    { name: "Exhibit/Chart", value: 5 },
    { name: "Hotspot", value: 2 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Format time (minutes to hours and minutes)
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };
  
  // Calculate overall progress
  const averageScore = Math.round(recentExams.reduce((sum, exam) => sum + exam.score, 0) / recentExams.length);
  const totalQuestionsAnswered = recentExams.reduce((sum, exam) => sum + exam.questionCount, 0);
  const totalStudyTime = recentExams.reduce((sum, exam) => sum + exam.timeSpent, 0);
  
  // Time until mock NCLEX exam
  const daysUntilExam = 42; // This would be calculated based on user's scheduled exam
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium">{label}</p>
          <p className="text-[#0088FE]">{`Score: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-[#13294B]">Study Dashboard</h1>
              <p className="text-gray-600 mt-1">Track your progress and get personalized study recommendations</p>
            </div>
            
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="bg-white shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Average Score</p>
                      <p className="text-2xl font-bold text-[#13294B]">{averageScore}%</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <BarChart2 className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <Progress value={averageScore} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">Target: 75%+</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Questions Answered</p>
                      <p className="text-2xl font-bold text-[#13294B]">{totalQuestionsAnswered}</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <FileText className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <Progress value={Math.min((totalQuestionsAnswered / 2000) * 100, 100)} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">Goal: 2,000 questions</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Total Study Time</p>
                      <p className="text-2xl font-bold text-[#13294B]">{formatTime(totalStudyTime)}</p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <Progress value={Math.min((totalStudyTime / 3000) * 100, 100)} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">Goal: 50 hours</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Days Until NCLEX</p>
                      <p className="text-2xl font-bold text-[#13294B]">{daysUntilExam}</p>
                    </div>
                    <div className="bg-amber-100 p-3 rounded-full">
                      <CalendarDays className="h-6 w-6 text-amber-600" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <Progress value={Math.min((60 - daysUntilExam) / 60 * 100, 100)} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">
                      {daysUntilExam <= 7 
                        ? 'Final preparation phase!' 
                        : daysUntilExam <= 30 
                          ? 'Focus on weak areas' 
                          : 'Build your knowledge base'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Performance Charts */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="progress" className="bg-white rounded-lg border shadow-sm">
                  <div className="p-4 border-b">
                    <h2 className="text-xl font-bold text-[#13294B]">Performance Analysis</h2>
                    <p className="text-gray-500 text-sm">Analyze your progress and identify areas for improvement</p>
                    
                    <TabsList className="mt-4 bg-gray-100 p-1">
                      <TabsTrigger value="progress" className="text-sm">Progress Trend</TabsTrigger>
                      <TabsTrigger value="categories" className="text-sm">Categories</TabsTrigger>
                      <TabsTrigger value="question-types" className="text-sm">Question Types</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="progress" className="p-4">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={progressData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="score" fill="#4B9CD3" />
                          <Legend />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-600">
                        {progressData[progressData.length - 1].score > progressData[0].score 
                          ? 'Your scores are trending upward. Keep up the good work!' 
                          : 'Your scores have been fluctuating. Focus on reviewing your weak areas.'}
                      </p>
                      <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700">
                        View Detailed Analytics
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="categories" className="p-4">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={categoryPerformance}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          layout="vertical"
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" domain={[0, 100]} />
                          <YAxis dataKey="name" type="category" width={100} />
                          <Tooltip />
                          <Bar dataKey="score" fill="#4B9CD3" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-600">
                        Your strongest areas are Fundamentals and Maternity. 
                        Focus on improving Pharmacology and Pediatrics.
                      </p>
                      <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700">
                        Create Targeted Study Plan
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="question-types" className="p-4">
                    <div className="h-80 flex justify-center">
                      <ResponsiveContainer width="80%" height="100%">
                        <PieChart>
                          <Pie
                            data={questionTypeData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {questionTypeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-600">
                        You've primarily practiced with multiple-choice questions. 
                        Try to increase your exposure to Select All That Apply (SATA) 
                        and Prioritization questions.
                      </p>
                      <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700">
                        Practice Question Variety
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
                
                {/* Recent Exams */}
                <Card className="mt-6 bg-white shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold text-[#13294B]">Recent Exams</CardTitle>
                        <CardDescription>Your most recent exam attempts and performance</CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentExams.map((exam, index) => (
                        <div key={index} className="flex items-center justify-between border-b pb-4">
                          <div className="flex items-center">
                            <div className={`w-2 h-10 rounded-full mr-3 ${exam.score >= 75 ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                            <div>
                              <h4 className="font-bold text-gray-800">{exam.title}</h4>
                              <div className="flex text-xs text-gray-500 mt-1 space-x-3">
                                <span>{formatDate(exam.date)}</span>
                                <span>•</span>
                                <span>{exam.questionCount} questions</span>
                                <span>•</span>
                                <span>{formatTime(exam.timeSpent)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="text-right mr-4">
                              <span className={`text-lg font-bold ${exam.score >= 75 ? 'text-green-600' : 'text-amber-600'}`}>
                                {exam.score}%
                              </span>
                              <div className="text-xs text-gray-500">
                                {exam.score >= 75 ? 'Passing' : 'Needs improvement'}
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-blue-600 h-8 px-2">
                              Review
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-center">
                    <Button className="bg-[#13294B] hover:bg-[#0A1E3A]">
                      Start New Exam
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Recommended Exams */}
                <div className="mt-6">
                  <h2 className="text-xl font-bold text-[#13294B] mb-4">Recommended Exams</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <EnhancedTestCard 
                      test={{
                        id: 11,
                        title: "Advanced NCLEX Practice",
                        path: "published/advanced_nclex_questions.json",
                        description: "Practice with advanced NCLEX questions including prioritization scenarios, chart interpretation, and hotspot questions. Designed to simulate the latest NCLEX exam format.",
                        questionCount: 7,
                        timeLimit: 20,
                        category: "Mixed"
                      }}
                      isRecommended={true}
                    />
                    
                    <EnhancedTestCard 
                      test={{
                        id: 8,
                        title: "Pharmacology Mastery",
                        path: "published/pharmacology_questions.json",
                        description: "Focused practice on medication administration, drug classes, side effects, and dosage calculations to strengthen your weakest area.",
                        questionCount: 40,
                        timeLimit: 60,
                        category: "Pharmacology"
                      }}
                      isRecommended={true}
                    />
                  </div>
                </div>
              </div>
              
              {/* Right Column - Study Recommendations */}
              <div className="lg:col-span-1">
                <StudyRecommendations 
                  weakAreas={weakAreas}
                  examHistory={recentExams.map(exam => ({
                    examId: exam.id,
                    examTitle: exam.title,
                    score: exam.score,
                    date: exam.date
                  }))}
                  timeUntilExam={daysUntilExam}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}