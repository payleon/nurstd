import { useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { Header } from "@/components/ui/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StudyStrategyPlanner } from "@/components/StudyStrategyPlanner";
import { 
  BookOpen, 
  CheckCircle2, 
  ClipboardList, 
  Clock, 
  Lightbulb, 
  BrainCircuit,
  FileText
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
                
                <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="mr-2 h-5 w-5 text-green-500" />
                      Study Material Organization
                    </CardTitle>
                    <CardDescription>
                      Effectively organize your study materials for maximum efficiency
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-md border-2 border-black">
                        <h3 className="font-semibold mb-2 flex items-center">
                          <ClipboardList className="mr-2 h-4 w-4 text-blue-500" />
                          Content Review
                        </h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start">
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Create concise, organized notes for each content area</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Use color-coding to highlight key information</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Divide material into manageable sections</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-white p-4 rounded-md border-2 border-black">
                        <h3 className="font-semibold mb-2 flex items-center">
                          <FileText className="mr-2 h-4 w-4 text-purple-500" />
                          Practice Questions
                        </h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start">
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Keep a log of questions you miss</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Categorize questions by content area and question type</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Create a library of rationales for missed questions</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-white p-4 rounded-md border-2 border-black">
                        <h3 className="font-semibold mb-2 flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-red-500" />
                          Daily Review System
                        </h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start">
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Create a spaced repetition system for key concepts</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Review difficult material more frequently</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Implement a 5-minute daily review of past material</span>
                          </li>
                        </ul>
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
                      Effective Time Management Strategies
                    </CardTitle>
                    <CardDescription>
                      Maximize your study efficiency with these proven techniques
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="bg-white p-4 rounded-md border-2 border-black">
                          <h3 className="font-semibold mb-2">Pomodoro Technique</h3>
                          <p className="text-sm mb-3">Break study sessions into focused 25-minute intervals with 5-minute breaks.</p>
                          <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                            <p className="text-sm font-medium text-blue-800">How to implement:</p>
                            <ol className="text-sm text-blue-800 list-decimal pl-5 space-y-1 mt-1">
                              <li>Set a timer for 25 minutes</li>
                              <li>Work with complete focus until the timer rings</li>
                              <li>Take a 5-minute break</li>
                              <li>After 4 pomodoros, take a longer 15-30 minute break</li>
                            </ol>
                          </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-md border-2 border-black">
                          <h3 className="font-semibold mb-2">Time Blocking</h3>
                          <p className="text-sm mb-3">Allocate specific blocks of time to different subjects or tasks.</p>
                          <div className="bg-green-50 p-3 rounded-md border border-green-200">
                            <p className="text-sm font-medium text-green-800">Sample Daily Schedule:</p>
                            <ul className="text-sm text-green-800 space-y-1 mt-1">
                              <li><strong>8:00-10:00 AM:</strong> Medical-Surgical content review</li>
                              <li><strong>10:15-11:15 AM:</strong> 50 practice questions</li>
                              <li><strong>1:00-2:30 PM:</strong> Pharmacology review</li>
                              <li><strong>3:00-4:00 PM:</strong> Question review and rationales</li>
                              <li><strong>7:00-8:00 PM:</strong> Weak area focused review</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-white p-4 rounded-md border-2 border-black">
                          <h3 className="font-semibold mb-2">Spaced Repetition</h3>
                          <p className="text-sm mb-3">Review material at increasing intervals to improve long-term retention.</p>
                          <div className="bg-purple-50 p-3 rounded-md border border-purple-200">
                            <p className="text-sm font-medium text-purple-800">Optimal Review Schedule:</p>
                            <ul className="text-sm text-purple-800 space-y-1 mt-1">
                              <li><strong>First review:</strong> Same day as learning</li>
                              <li><strong>Second review:</strong> 1 day after learning</li>
                              <li><strong>Third review:</strong> 3 days after learning</li>
                              <li><strong>Fourth review:</strong> 7 days after learning</li>
                              <li><strong>Fifth review:</strong> 14 days after learning</li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-md border-2 border-black">
                          <h3 className="font-semibold mb-2">Pareto Principle (80/20 Rule)</h3>
                          <p className="text-sm mb-3">Focus on the 20% of content that will yield 80% of results.</p>
                          <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                            <p className="text-sm font-medium text-yellow-800">High-Yield NCLEX Topics:</p>
                            <ul className="text-sm text-yellow-800 space-y-1 mt-1">
                              <li>Prioritization and delegation</li>
                              <li>Safety and infection control</li>
                              <li>Pharmacology (especially medication safety)</li>
                              <li>Common lab values and their implications</li>
                              <li>Mental health concepts and therapeutic communication</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <CardHeader>
                    <CardTitle>Productivity Tools & Techniques</CardTitle>
                    <CardDescription>
                      Maintain focus and eliminate distractions during study sessions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-md border-2 border-black">
                        <h3 className="font-semibold mb-2">Distraction Management</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start">
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Use website blockers during study sessions</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Put phone in "Do Not Disturb" mode</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Create a dedicated study environment</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-white p-4 rounded-md border-2 border-black">
                        <h3 className="font-semibold mb-2">Physical Wellbeing</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start">
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Prioritize 7-8 hours of sleep</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Exercise 20-30 minutes daily</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Stay hydrated and eat brain-healthy foods</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-white p-4 rounded-md border-2 border-black">
                        <h3 className="font-semibold mb-2">Task Management</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start">
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Create a weekly study plan with specific goals</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Use a task management app to track progress</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Schedule regular progress reviews</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="question-strategies">
                <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
                  <CardHeader>
                    <CardTitle>NCLEX Question Strategies</CardTitle>
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
                              <p className="text-sm text-gray-600">Determine if it's a priority, safety, communication, or implementation question.</p>
                            </div>
                          </li>
                          <li className="flex">
                            <span className="bg-blue-100 text-blue-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">3</span>
                            <div>
                              <p className="font-medium">Look for keywords</p>
                              <p className="text-sm text-gray-600">Words like "first," "best," "priority," "most important" guide your focus.</p>
                            </div>
                          </li>
                          <li className="flex">
                            <span className="bg-blue-100 text-blue-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">4</span>
                            <div>
                              <p className="font-medium">Apply nursing frameworks</p>
                              <p className="text-sm text-gray-600">Use ABCs, Maslow's hierarchy, or nursing process to guide decision-making.</p>
                            </div>
                          </li>
                          <li className="flex">
                            <span className="bg-blue-100 text-blue-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">5</span>
                            <div>
                              <p className="font-medium">Eliminate obviously wrong answers</p>
                              <p className="text-sm text-gray-600">Remove answers that are unsafe, incorrect, or irrelevant to narrow your choices.</p>
                            </div>
                          </li>
                        </ol>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-md border-2 border-black">
                          <h3 className="font-semibold mb-3">Select All That Apply (SATA) Questions</h3>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start">
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Evaluate each option independently as true or false</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Don't assume a specific number of answers are correct</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Look for contradictory options that can't both be true</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Confirm each selected answer meets the criteria in the question</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-white p-4 rounded-md border-2 border-black">
                          <h3 className="font-semibold mb-3">Prioritization Questions</h3>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start">
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Apply ABCs: Airway, Breathing, Circulation first</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Address safety concerns and acute issues before chronic ones</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Use Maslow's hierarchy: physiological needs before psychosocial</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Consider which patient is at most immediate risk</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-white p-4 rounded-md border-2 border-black">
                          <h3 className="font-semibold mb-3">Delegation Questions</h3>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start">
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>RN assessment and evaluation cannot be delegated</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Consider scope of practice for each team member</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Unstable patients should be cared for by the RN</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Routine, stable, and predictable tasks can be delegated</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-white p-4 rounded-md border-2 border-black">
                          <h3 className="font-semibold mb-3">Therapeutic Communication Questions</h3>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start">
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Choose options that encourage patient expression</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Avoid responses that block communication (why questions, false reassurance)</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Look for answers that address feelings, not just facts</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Therapeutic communication should be patient-centered</span>
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