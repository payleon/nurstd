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
                          <li className="flex">
                            <span className="bg-blue-100 text-blue-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">4</span>
                            <div>
                              <p className="font-medium">Use nursing process</p>
                              <p className="text-sm text-gray-600">Consider which step of ADPIE (Assessment, Diagnosis, Planning, Implementation, Evaluation) is being tested.</p>
                            </div>
                          </li>
                          <li className="flex">
                            <span className="bg-blue-100 text-blue-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">5</span>
                            <div>
                              <p className="font-medium">Apply ABC priority</p>
                              <p className="text-sm text-gray-600">Remember Airway, Breathing, Circulation as the first priority in emergency situations.</p>
                            </div>
                          </li>
                        </ol>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-4 rounded-md border-2 border-black">
                          <h3 className="font-semibold text-blue-700 mb-3">SATA (Select All That Apply) Strategy</h3>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start">
                              <div className="bg-blue-100 text-blue-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">1</div>
                              <span>Consider each option independently as true or false</span>
                            </li>
                            <li className="flex items-start">
                              <div className="bg-blue-100 text-blue-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">2</div>
                              <span>Don't let the number of correct answers influence your choices</span>
                            </li>
                            <li className="flex items-start">
                              <div className="bg-blue-100 text-blue-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">3</div>
                              <span>Look for absolute words like "always," "never," "all" (often false)</span>
                            </li>
                            <li className="flex items-start">
                              <div className="bg-blue-100 text-blue-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">4</div>
                              <span>Select options that directly address the problem in the question</span>
                            </li>
                            <li className="flex items-start">
                              <div className="bg-blue-100 text-blue-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">5</div>
                              <span>Reread the question after selecting your answers to verify</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-white p-4 rounded-md border-2 border-black">
                          <h3 className="font-semibold text-purple-700 mb-3">Prioritization Question Strategy</h3>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start">
                              <div className="bg-purple-100 text-purple-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">1</div>
                              <span>Apply the ABC (Airway, Breathing, Circulation) principles first</span>
                            </li>
                            <li className="flex items-start">
                              <div className="bg-purple-100 text-purple-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">2</div>
                              <span>Use Maslow's hierarchy for non-emergency situations</span>
                            </li>
                            <li className="flex items-start">
                              <div className="bg-purple-100 text-purple-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">3</div>
                              <span>Assess for life-threatening conditions that need immediate attention</span>
                            </li>
                            <li className="flex items-start">
                              <div className="bg-purple-100 text-purple-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">4</div>
                              <span>Remember that safety issues are always high priority</span>
                            </li>
                            <li className="flex items-start">
                              <div className="bg-purple-100 text-purple-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">5</div>
                              <span>Consider time sensitivity (urgent vs. stable conditions)</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div className="bg-white p-4 rounded-md border-2 border-black">
                          <h3 className="font-semibold text-green-700 mb-3">Delegation Question Strategy</h3>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start">
                              <div className="bg-green-100 text-green-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">1</div>
                              <span>Know the scope of practice for each role (RN, LPN/LVN, UAP, etc.)</span>
                            </li>
                            <li className="flex items-start">
                              <div className="bg-green-100 text-green-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">2</div>
                              <span>Remember the "Five Rights of Delegation" (right task, person, communication, supervision, circumstances)</span>
                            </li>
                            <li className="flex items-start">
                              <div className="bg-green-100 text-green-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">3</div>
                              <span>RNs must perform assessments, evaluations, teaching, and complex procedures</span>
                            </li>
                            <li className="flex items-start">
                              <div className="bg-green-100 text-green-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">4</div>
                              <span>UAPs can perform basic care, ADLs, and routine vital signs</span>
                            </li>
                            <li className="flex items-start">
                              <div className="bg-green-100 text-green-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">5</div>
                              <span>LPN/LVNs can administer most medications but work under RN supervision</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-white p-4 rounded-md border-2 border-black">
                          <h3 className="font-semibold text-amber-700 mb-3">Exhibit/Chart Question Strategy</h3>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start">
                              <div className="bg-amber-100 text-amber-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">1</div>
                              <span>Read the question first before examining the exhibit</span>
                            </li>
                            <li className="flex items-start">
                              <div className="bg-amber-100 text-amber-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">2</div>
                              <span>Look for abnormal lab values or findings in the exhibit</span>
                            </li>
                            <li className="flex items-start">
                              <div className="bg-amber-100 text-amber-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">3</div>
                              <span>Compare values to normal ranges</span>
                            </li>
                            <li className="flex items-start">
                              <div className="bg-amber-100 text-amber-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">4</div>
                              <span>Focus only on relevant information for the specific question</span>
                            </li>
                            <li className="flex items-start">
                              <div className="bg-amber-100 text-amber-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">5</div>
                              <span>Note trends or changes in sequential values</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mt-6">
                        <h3 className="font-semibold text-blue-800 mb-2">Advanced Question Strategy Tips</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-blue-700">When Unsure Between Options:</h4>
                            <ul className="space-y-1 mt-1 text-sm text-blue-700">
                              <li className="flex items-start">
                                <CheckCircle2 className="mr-2 h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span>Choose assessment over implementation when in doubt</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle2 className="mr-2 h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span>Select the option that addresses the specific problem in the stem</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle2 className="mr-2 h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span>Focus on patient-centered rather than task-centered actions</span>
                              </li>
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-blue-700">Test-Taking Strategies:</h4>
                            <ul className="space-y-1 mt-1 text-sm text-blue-700">
                              <li className="flex items-start">
                                <CheckCircle2 className="mr-2 h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span>Eliminate obviously incorrect options first</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle2 className="mr-2 h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span>Look for "umbrella" options that include multiple correct actions</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle2 className="mr-2 h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span>Beware of distractors with partially correct information</span>
                              </li>
                            </ul>
                          </div>
                        </div>
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
                <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="mr-2 h-5 w-5 text-blue-500" />
                      NCLEX Exam Study Time Management
                    </CardTitle>
                    <CardDescription>
                      Strategies to optimize your study time and maintain a consistent schedule
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="bg-white p-5 rounded-md border-2 border-black">
                        <h3 className="font-semibold text-lg mb-3">Creating an Effective Study Schedule</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-blue-700 mb-2">Short-Term Planning</h4>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-start">
                                <div className="bg-blue-100 text-blue-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">1</div>
                                <div>
                                  <span className="font-medium">Daily Goals</span>
                                  <p className="text-gray-600">Set 3-5 achievable daily study goals (e.g., "Complete 75 practice questions" or "Master fluid and electrolytes content")</p>
                                </div>
                              </li>
                              <li className="flex items-start">
                                <div className="bg-blue-100 text-blue-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">2</div>
                                <div>
                                  <span className="font-medium">Pomodoro Technique</span>
                                  <p className="text-gray-600">Study in focused 25-minute intervals with 5-minute breaks; after 4 cycles, take a longer 15-30 minute break</p>
                                </div>
                              </li>
                              <li className="flex items-start">
                                <div className="bg-blue-100 text-blue-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">3</div>
                                <div>
                                  <span className="font-medium">Task Batching</span>
                                  <p className="text-gray-600">Group similar activities together (e.g., all content review in morning, practice questions in afternoon)</p>
                                </div>
                              </li>
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-green-700 mb-2">Long-Term Planning</h4>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-start">
                                <div className="bg-green-100 text-green-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">1</div>
                                <div>
                                  <span className="font-medium">12-Week Study Plan</span>
                                  <p className="text-gray-600">Create a comprehensive 8-12 week study plan with weekly content focus areas</p>
                                </div>
                              </li>
                              <li className="flex items-start">
                                <div className="bg-green-100 text-green-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">2</div>
                                <div>
                                  <span className="font-medium">Content Distribution</span>
                                  <p className="text-gray-600">Allocate more time to challenging topics and areas where you're weaker</p>
                                </div>
                              </li>
                              <li className="flex items-start">
                                <div className="bg-green-100 text-green-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">3</div>
                                <div>
                                  <span className="font-medium">Practice Test Schedule</span>
                                  <p className="text-gray-600">Plan full-length practice exams every 1-2 weeks to gauge progress</p>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-4 rounded-md border-2 border-black">
                          <h3 className="font-semibold text-purple-700 mb-3">Optimizing Study Sessions</h3>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start">
                              <CheckCircle2 className="mr-2 h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="font-medium">Prime Study Hours</span>
                                <p className="text-gray-600">Identify your peak cognitive times and schedule difficult content then</p>
                              </div>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="mr-2 h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="font-medium">Distraction Management</span>
                                <p className="text-gray-600">Use app blockers, silence notifications, and create a dedicated study environment</p>
                              </div>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="mr-2 h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="font-medium">Active Learning</span>
                                <p className="text-gray-600">Incorporate teaching, quizzing, and concept mapping rather than passive reading</p>
                              </div>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="mr-2 h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="font-medium">Spaced Repetition</span>
                                <p className="text-gray-600">Review content at increasing intervals to improve long-term retention</p>
                              </div>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-white p-4 rounded-md border-2 border-black">
                          <h3 className="font-semibold text-amber-700 mb-3">Preventing Burnout</h3>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start">
                              <CheckCircle2 className="mr-2 h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="font-medium">Scheduled Rest Days</span>
                                <p className="text-gray-600">Plan at least one full day off from studying each week</p>
                              </div>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="mr-2 h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="font-medium">Physical Activity</span>
                                <p className="text-gray-600">Incorporate 30+ minutes of exercise daily to maintain cognitive function</p>
                              </div>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="mr-2 h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="font-medium">Sleep Hygiene</span>
                                <p className="text-gray-600">Prioritize 7-8 hours of quality sleep; avoid studying right before bed</p>
                              </div>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="mr-2 h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="font-medium">Study Groups</span>
                                <p className="text-gray-600">Connect with peers for motivation and different perspectives</p>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="bg-white p-5 rounded-md border-2 border-black">
                        <h3 className="font-semibold text-lg mb-3">Sample NCLEX Study Schedule</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-gray-100 border-b border-gray-300">
                                <th className="p-2 text-left">Time</th>
                                <th className="p-2 text-left">Monday</th>
                                <th className="p-2 text-left">Tuesday</th>
                                <th className="p-2 text-left">Wednesday</th>
                                <th className="p-2 text-left">Thursday</th>
                                <th className="p-2 text-left">Friday</th>
                                <th className="p-2 text-left">Weekend</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-gray-200">
                                <td className="p-2 font-medium">Morning<br/>(8-11 AM)</td>
                                <td className="p-2">Content Review:<br/>Med-Surg</td>
                                <td className="p-2">Content Review:<br/>Pharmacology</td>
                                <td className="p-2">Content Review:<br/>Pediatrics</td>
                                <td className="p-2">Content Review:<br/>OB/GYN</td>
                                <td className="p-2">Content Review:<br/>Mental Health</td>
                                <td className="p-2">Full Practice Exam<br/>(Saturday)</td>
                              </tr>
                              <tr className="border-b border-gray-200">
                                <td className="p-2 font-medium">Break</td>
                                <td className="p-2 text-center" colSpan={6}>Lunch + 30 min exercise/relaxation</td>
                              </tr>
                              <tr className="border-b border-gray-200">
                                <td className="p-2 font-medium">Afternoon<br/>(1-4 PM)</td>
                                <td className="p-2">75 Practice Questions:<br/>Med-Surg</td>
                                <td className="p-2">75 Practice Questions:<br/>Pharmacology</td>
                                <td className="p-2">75 Practice Questions:<br/>Pediatrics</td>
                                <td className="p-2">75 Practice Questions:<br/>OB/GYN</td>
                                <td className="p-2">75 Practice Questions:<br/>Mental Health</td>
                                <td className="p-2">Review Exam + Remediation<br/>(Saturday PM)</td>
                              </tr>
                              <tr>
                                <td className="p-2 font-medium">Evening<br/>(6-8 PM)</td>
                                <td className="p-2">Review Question Rationales</td>
                                <td className="p-2">Review Question Rationales</td>
                                <td className="p-2">Review Question Rationales</td>
                                <td className="p-2">Review Question Rationales</td>
                                <td className="p-2">Review Weak Areas</td>
                                <td className="p-2">Day Off<br/>(Sunday)</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                        <h3 className="font-semibold text-blue-800 mb-2">Time Management Tips for Exam Day</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <ul className="space-y-1 text-sm text-blue-700">
                            <li className="flex items-start">
                              <CheckCircle2 className="mr-2 h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span>Pace yourself: aim for about 1-1.5 minutes per question</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="mr-2 h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span>Take scheduled breaks to maintain concentration</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="mr-2 h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span>Don't rush through "easy" questions - they deserve attention too</span>
                            </li>
                          </ul>
                          <ul className="space-y-1 text-sm text-blue-700">
                            <li className="flex items-start">
                              <CheckCircle2 className="mr-2 h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span>Practice with timed conditions regularly before the exam</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="mr-2 h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span>Build test-taking stamina through full-length practice exams</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="mr-2 h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span>If stuck on a question, flag it and return later</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}