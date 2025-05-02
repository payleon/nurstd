import { useState, useEffect } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { Header } from "@/components/ui/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StudyStrategyPlanner } from "@/components/StudyStrategyPlanner";
import { 
  BookOpen, 
  CheckCircle2, 
  ClipboardList, 
  Clock, 
  Lightbulb, 
  BrainCircuit,
  FileText,
  BarChart2,
  Bookmark,
  Brain,
  Award,
  BookMarked,
  Calendar,
  Download,
  Library,
  Link2,
  ExternalLink,
  FileQuestion,
  GraduationCap
} from "lucide-react";

export default function StudyStrategies() {
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
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-[#13294B]">Study Strategies</h1>
            
            <Tabs defaultValue="personalized" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="personalized">Personalized Plan</TabsTrigger>
                <TabsTrigger value="general">General Strategies</TabsTrigger>
                <TabsTrigger value="time-management">Time Management</TabsTrigger>
                <TabsTrigger value="question-strategies">Question Strategies</TabsTrigger>
                <TabsTrigger value="study-resources">Study Resources</TabsTrigger>
                <TabsTrigger value="analytics">Study Analytics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personalized">
                <StudyStrategyPlanner />
              </TabsContent>
              
              <TabsContent value="general">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BrainCircuit className="mr-2 h-5 w-5 text-blue-500" />
                        Active Learning Techniques
                      </CardTitle>
                      <CardDescription>
                        Engage more deeply with the material using these techniques
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold">Self-testing</h3>
                        <p className="text-sm">Regularly quiz yourself on key concepts. Research shows this is one of the most effective ways to learn and retain information.</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold">Teaching Others</h3>
                        <p className="text-sm">Explain concepts to a study partner or even to an imaginary student. The "Feynman Technique" of teaching a concept simply helps identify gaps in your understanding.</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold">Concept Mapping</h3>
                        <p className="text-sm">Create visual connections between related concepts. This helps reinforce the relationships between different topics.</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold">Practice Questions</h3>
                        <p className="text-sm">Complete at least 50-100 practice questions daily, focusing on understanding the rationales for both correct and incorrect answers.</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
                        Content Mastery Strategies
                      </CardTitle>
                      <CardDescription>
                        Approaches to ensure thorough understanding of nursing concepts
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold">Prioritization Framework</h3>
                        <p className="text-sm">Master the ABCs (Airway, Breathing, Circulation) and Maslow's hierarchy to help with prioritization questions.</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold">Nursing Process</h3>
                        <p className="text-sm">Become comfortable with all steps of the nursing process: Assessment, Diagnosis, Planning, Implementation, and Evaluation.</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold">Lab Values</h3>
                        <p className="text-sm">Memorize critical lab values and understand their implications for patient care.</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold">Medications</h3>
                        <p className="text-sm">Focus on medication classes, common side effects, and nursing considerations rather than trying to memorize every drug.</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="question-strategies">
                <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileQuestion className="mr-2 h-5 w-5 text-blue-500" />
                      NCLEX Question Strategies
                    </CardTitle>
                    <CardDescription>
                      Master techniques for approaching different NCLEX question types
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="bg-white p-5 rounded-md border-2 border-black">
                        <h3 className="font-semibold text-lg mb-3">Universal Question Strategy</h3>
                        <ol className="space-y-3">
                          <li className="flex">
                            <span className="bg-blue-100 text-blue-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">1</span>
                            <div>
                              <p className="font-medium">Read the question twice</p>
                              <p className="text-sm text-gray-600">Ensure you understand what is being asked before looking at answer options.</p>
                            </div>
                          </li>
                          <li className="flex">
                            <span className="bg-blue-100 text-blue-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">2</span>
                            <div>
                              <p className="font-medium">Identify the question type</p>
                              <p className="text-sm text-gray-600">Determine if it's prioritization, delegation, communication, etc.</p>
                            </div>
                          </li>
                          <li className="flex">
                            <span className="bg-blue-100 text-blue-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">3</span>
                            <div>
                              <p className="font-medium">Look for keywords</p>
                              <p className="text-sm text-gray-600">Words like "initial," "first," "priority," "best," "most" are significant.</p>
                            </div>
                          </li>
                        </ol>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="study-resources">
                <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Library className="mr-2 h-5 w-5 text-blue-500" />
                      Recommended Study Resources
                    </CardTitle>
                    <CardDescription>
                      High-quality resources to complement your exam preparation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-md border-2 border-black">
                          <div className="flex items-center mb-3">
                            <BookMarked className="h-5 w-5 text-purple-500 mr-2" />
                            <h3 className="font-semibold">Core Content Review</h3>
                          </div>
                          <p className="text-sm">Comprehensive review books and materials for NCLEX preparation</p>
                        </div>
                        
                        <div className="bg-white p-4 rounded-md border-2 border-black">
                          <div className="flex items-center mb-3">
                            <GraduationCap className="h-5 w-5 text-amber-500 mr-2" />
                            <h3 className="font-semibold">Question Banks</h3>
                          </div>
                          <p className="text-sm">Practice with thousands of NCLEX-style questions</p>
                        </div>
                        
                        <div className="bg-white p-4 rounded-md border-2 border-black">
                          <div className="flex items-center mb-3">
                            <ExternalLink className="h-5 w-5 text-green-500 mr-2" />
                            <h3 className="font-semibold">Free Resources</h3>
                          </div>
                          <p className="text-sm">Accessible study materials and practice questions</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="analytics">
                <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart2 className="mr-2 h-5 w-5 text-blue-500" />
                      Your Study Analytics
                    </CardTitle>
                    <CardDescription>
                      Track your study progress and identify areas for improvement
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-md border-2 border-black">
                          <h3 className="font-semibold text-center mb-1">Total Questions</h3>
                          <p className="text-3xl font-bold text-center text-blue-600">247</p>
                          <p className="text-xs text-center text-gray-500">Questions completed</p>
                        </div>
                        
                        <div className="bg-white p-4 rounded-md border-2 border-black">
                          <h3 className="font-semibold text-center mb-1">Accuracy</h3>
                          <p className="text-3xl font-bold text-center text-green-600">64%</p>
                          <p className="text-xs text-center text-gray-500">Correct answers</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="time-management">
                <p>Time management content here</p>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}