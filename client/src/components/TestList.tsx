import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTests } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Test } from "@shared/schema";
import { FileText, FileCheck, Clock, Calendar, BarChart, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useStudyProgress } from "@/hooks/useStudyProgress";

interface TestListProps {
  onSelectTest: (test: Test) => void;
}

export function TestList({ onSelectTest }: TestListProps) {
  const { data: tests, isLoading, error } = useQuery<Test[]>({
    queryKey: ['/api/tests'],
  });
  
  // Use our study progress hook for personalization
  const { 
    studyAreas, 
    recommendations, 
    updateConfidenceLevel, 
    completeRecommendation 
  } = useStudyProgress();

  // Mobile dropdown state
  const [selectedTest, setSelectedTest] = useState("");

  const handleMobileSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const testPath = e.target.value;
    if (testPath && tests) {
      const selectedTest = tests.find((test: Test) => test.path === testPath);
      if (selectedTest) {
        onSelectTest(selectedTest);
      }
    }
  };

  const handleSelectTest = (test: Test) => {
    onSelectTest(test);
  };

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-red-500">
            Error loading tests: {error instanceof Error ? error.message : "Unknown error"}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      {/* Welcome Card - Moved to the top */}
      <div className="neuro-card mb-6 bg-[#4B9CD3] text-white overflow-hidden neuro-noise">
        <div className="p-6">
          <h2 className="text-3xl font-bold mb-3 uppercase tracking-tight">Welcome to NURS'TD NCLEX Prep</h2>
          <p className="mb-4 text-lg">Your comprehensive nursing exam preparation platform. Use the dashboard to track your progress or take a practice exam to get started.</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
            {/* Practice Exams Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <button 
                  className="neuro-button-primary min-h-[44px] flex-1 text-md flex items-center justify-center gap-2"
                  aria-label="View Available Practice Exams"
                >
                  <FileText className="h-5 w-5" />
                  Practice Exams
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl p-0 bg-white overflow-hidden border-2 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
                <DialogHeader className="bg-[#13294B] text-white py-3 px-6 flex items-center justify-between">
                  <DialogTitle className="text-xl font-bold uppercase">Available Practice Exams</DialogTitle>
                  <DialogTrigger asChild>
                    <button 
                      className="text-white hover:text-gray-200 cursor-pointer"
                      aria-label="Close"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </DialogTrigger>
                </DialogHeader>
                <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                  <DialogDescription className="mb-4 text-gray-600">
                    Select from our available practice exams to begin your NCLEX preparation journey.
                  </DialogDescription>
                  {isLoading ? (
                    // Loading skeleton
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3 border-b-2 border-gray-200">
                          <Skeleton className="h-5 w-48" />
                          <div className="flex items-center space-x-4">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-24" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {tests?.length === 0 ? (
                        <div className="text-center py-6 text-gray-500 font-bold">
                          No tests available. Add test files to the published/ directory.
                        </div>
                      ) : (
                        tests?.map((test) => (
                          <div key={test.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border-2 border-black bg-white hover:bg-gray-50 will-change-transform rounded-md">
                            <div className="flex items-center mb-3 md:mb-0">
                              <div className="bg-[#4B9CD3] text-white p-2 border-2 border-black mr-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] will-change-transform">
                                <FileText className="h-6 w-6" />
                              </div>
                              <div>
                                <div className="font-bold text-[#13294B] text-lg">{test.title}</div>
                                <div className="font-medium flex items-center mt-1">
                                  <span className="inline-block bg-[#13294B] text-white text-xs px-2 py-1 mr-2 border border-black will-change-transform">
                                    {test.questionCount || 75} QUESTIONS
                                  </span>
                                  <span className="inline-block bg-[#13294B] text-white text-xs px-2 py-1 border border-black will-change-transform">
                                    {test.timeLimit || 2} {test.timeLimit === 1 ? 'HOUR' : 'HOURS'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 ml-12 md:ml-0">
                              <div className="hidden md:flex items-center justify-center border-2 border-black px-3 py-1 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] will-change-transform">
                                <span className="text-sm font-bold">NOT ATTEMPTED</span>
                              </div>
                              <DialogTrigger asChild>
                                <button 
                                  className="neuro-button-primary min-h-[44px] min-w-[100px]"
                                  onClick={() => handleSelectTest(test)}
                                  aria-label={`Take ${test.title} Exam`}
                                >
                                  Take Exam
                                </button>
                              </DialogTrigger>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            
            {/* Recent Activity Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <button 
                  className="neuro-button-primary min-h-[44px] flex-1 text-md flex items-center justify-center gap-2"
                  aria-label="View Recent Activity"
                >
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl p-0 bg-white overflow-hidden border-2 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
                <DialogHeader className="bg-[#13294B] text-white py-3 px-6 flex items-center justify-between">
                  <DialogTitle className="text-xl font-bold uppercase">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Recent Activity
                    </div>
                  </DialogTitle>
                  <DialogTrigger asChild>
                    <button 
                      className="text-white hover:text-gray-200 cursor-pointer"
                      aria-label="Close"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </DialogTrigger>
                </DialogHeader>
                <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                  <DialogDescription className="mb-4 text-gray-600">
                    Track your progress and review your recent test attempts.
                  </DialogDescription>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-2 border-black">
                      <thead>
                        <tr className="border-b-2 border-black bg-gray-100">
                          <th className="text-left py-3 px-4 font-bold uppercase text-[#13294B]">Test Name</th>
                          <th className="text-left py-3 px-4 font-bold uppercase text-[#13294B]">Score</th>
                          <th className="text-left py-3 px-4 font-bold uppercase text-[#13294B]">Date</th>
                          <th className="text-left py-3 px-4 font-bold uppercase text-[#13294B]">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Empty state for recent tests */}
                        <tr>
                          <td colSpan={4} className="text-center py-6 border-b-2 border-black">
                            <div className="flex flex-col items-center">
                              <Calendar className="h-12 w-12 mb-3" />
                              <span className="font-bold">No recent test attempts</span>
                              <span className="text-sm mt-1">Your completed exams will appear here</span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            {/* Study Tips Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <button 
                  className="neuro-button-primary min-h-[44px] flex-1 text-md flex items-center justify-center gap-2"
                  aria-label="View NCLEX Study Tips"
                >
                  <BarChart className="h-5 w-5" />
                  Study Tips
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl p-0 bg-white overflow-hidden border-2 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
                <DialogHeader className="bg-[#13294B] text-white py-3 px-6 flex items-center justify-between">
                  <DialogTitle className="text-xl font-bold uppercase">
                    <div className="flex items-center">
                      <BarChart className="h-5 w-5 mr-2" />
                      NCLEX Study Tips
                    </div>
                  </DialogTitle>
                  <DialogTrigger asChild>
                    <button 
                      className="text-white hover:text-gray-200 cursor-pointer"
                      aria-label="Close"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </DialogTrigger>
                </DialogHeader>
                <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                  <DialogDescription className="mb-4 text-gray-600">
                    Evidence-based study techniques to help you succeed on your NCLEX exam.
                  </DialogDescription>
                  
                  {/* Tab-based study tips system */}
                  <div className="mb-5">
                    <div className="bg-[#13294B] text-white p-2 border-2 border-black mb-4">
                      <h2 className="text-lg font-bold">NCLEX Success Formula</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                      <div 
                        className={`border-2 border-black p-4 bg-white hover:bg-gray-50 transition-all cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${Object.values(studyAreas).some(area => area.confidenceLevel === 1) ? 'border-l-4 border-l-amber-500' : ''}`}
                        onClick={() => window.open('https://www.ncsbn.org/nclex-application-and-registration.htm', '_blank')}
                      >
                        <div className="flex items-center mb-2">
                          <div className="bg-[#4B9CD3] text-white p-1 rounded-full w-8 h-8 flex items-center justify-center mr-2 border border-black">
                            <span className="font-bold">1</span>
                          </div>
                          <h3 className="font-bold text-[#13294B] text-lg">Content Mastery</h3>
                        </div>
                        <p className="text-gray-700">Focus on understanding nursing concepts rather than memorizing facts. Use our practice quizzes to identify knowledge gaps.</p>
                        <div className="mt-2 flex justify-between items-center">
                          <div className="text-[#4B9CD3] font-medium">Interactive Focus: NCLEX Test Plan ↗</div>
                          {Object.values(studyAreas).some(area => area.confidenceLevel === 1) && (
                            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded border border-amber-300">Recommended for you</span>
                          )}
                        </div>
                      </div>
                      
                      <div 
                        className={`border-2 border-black p-4 bg-white hover:bg-gray-50 transition-all cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${studyAreas['prioritization']?.confidenceLevel === 1 ? 'border-l-4 border-l-amber-500' : ''}`}
                        onClick={() => window.open('https://www.ncsbn.org/nclex-preparation-materials.htm', '_blank')}
                      >
                        <div className="flex items-center mb-2">
                          <div className="bg-[#4B9CD3] text-white p-1 rounded-full w-8 h-8 flex items-center justify-center mr-2 border border-black">
                            <span className="font-bold">2</span>
                          </div>
                          <h3 className="font-bold text-[#13294B] text-lg">Critical Thinking</h3>
                        </div>
                        <p className="text-gray-700">Practice answering NCLEX-style questions that test your ability to analyze situations and apply nursing knowledge.</p>
                        <div className="mt-2 flex justify-between items-center">
                          <div className="text-[#4B9CD3] font-medium">Interactive Focus: Practice Questions ↗</div>
                          {studyAreas['prioritization']?.confidenceLevel === 1 && (
                            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded border border-amber-300">Focus area for you</span>
                          )}
                        </div>
                      </div>
                      
                      <div 
                        className="border-2 border-black p-4 bg-white hover:bg-gray-50 transition-all cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                        onClick={() => window.location.href = '/study-strategies'}
                      >
                        <div className="flex items-center mb-2">
                          <div className="bg-[#4B9CD3] text-white p-1 rounded-full w-8 h-8 flex items-center justify-center mr-2 border border-black">
                            <span className="font-bold">3</span>
                          </div>
                          <h3 className="font-bold text-[#13294B] text-lg">Time Management</h3>
                        </div>
                        <p className="text-gray-700">Create a structured study schedule using our Study Strategy Planner. Practice with timed quizzes to build test-taking stamina.</p>
                        <div className="mt-2 flex justify-between">
                          <div className="text-[#4B9CD3] font-medium">Use our Study Timer tool →</div>
                          <div className="flex gap-1">
                            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">1-2 min/question</span>
                          </div>
                        </div>
                      </div>
                      
                      <div 
                        className={`border-2 border-black p-4 bg-white hover:bg-gray-50 transition-all cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${studyAreas['pharmacology']?.confidenceLevel === 1 ? 'border-l-4 border-l-amber-500' : ''}`}
                      >
                        <div className="flex items-center mb-2">
                          <div className="bg-[#4B9CD3] text-white p-1 rounded-full w-8 h-8 flex items-center justify-center mr-2 border border-black">
                            <span className="font-bold">4</span>
                          </div>
                          <h3 className="font-bold text-[#13294B] text-lg">Test Strategy</h3>
                        </div>
                        <p className="text-gray-700">Learn and practice NCLEX-specific strategies like priority-setting, delegation, and eliminating incorrect options.</p>
                        <div className="mt-2 flex justify-between items-center">
                          <div className="text-[#4B9CD3] font-medium">Practice with our Games →</div>
                          {studyAreas['pharmacology']?.confidenceLevel === 1 ? (
                            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded border border-amber-300">Recommended for you</span>
                          ) : (
                            <span className="bg-[#13294B] text-white text-xs px-2 py-1 rounded">High Value</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-[#F9F9F9] border-2 border-black p-4 mb-4">
                      <h3 className="font-bold text-[#13294B] mb-2 text-lg">Evidence-Based Study Methods</h3>
                      <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li><span className="font-bold">Spaced Repetition:</span> Study material at increasing intervals to improve long-term retention.</li>
                        <li><span className="font-bold">Active Recall:</span> Test yourself frequently rather than passive re-reading.</li>
                        <li><span className="font-bold">Interleaved Practice:</span> Mix different subjects and question types in each study session.</li>
                        <li><span className="font-bold">Dual Coding:</span> Combine text-based learning with visual aids like diagrams or charts.</li>
                      </ul>
                    </div>
                    
                    {/* Mini Self-Assessment */}
                    <div className="border-2 border-black">
                      <div className="bg-[#13294B] text-white p-2">
                        <h3 className="font-bold text-lg">Quick Study Readiness Assessment</h3>
                      </div>
                      <div className="p-4 bg-white">
                        <p className="mb-4">Rate your confidence in these key NCLEX areas to get personalized study recommendations:</p>
                        
                        <div className="space-y-4 mb-6">
                          <div>
                            <label className="font-medium text-[#13294B] block mb-1">Prioritization & Delegation</label>
                            <div className="flex justify-between gap-1">
                              <button 
                                className={`${studyAreas['prioritization']?.confidenceLevel === 1 ? 'bg-[#4B9CD3] text-white' : 'bg-[#F8F8F8]'} hover:bg-[#4B9CD3] hover:text-white border border-black px-3 py-1 text-sm flex-1 transition-colors`}
                                onClick={() => updateConfidenceLevel('prioritization', 1)}
                              >
                                Low
                              </button>
                              <button 
                                className={`${studyAreas['prioritization']?.confidenceLevel === 2 ? 'bg-[#4B9CD3] text-white' : 'bg-[#F8F8F8]'} hover:bg-[#4B9CD3] hover:text-white border border-black px-3 py-1 text-sm flex-1 transition-colors`}
                                onClick={() => updateConfidenceLevel('prioritization', 2)}
                              >
                                Medium
                              </button>
                              <button 
                                className={`${studyAreas['prioritization']?.confidenceLevel === 3 ? 'bg-[#4B9CD3] text-white' : 'bg-[#F8F8F8]'} hover:bg-[#4B9CD3] hover:text-white border border-black px-3 py-1 text-sm flex-1 transition-colors`}
                                onClick={() => updateConfidenceLevel('prioritization', 3)}
                              >
                                High
                              </button>
                            </div>
                          </div>
                          
                          <div>
                            <label className="font-medium text-[#13294B] block mb-1">Pharmacology Knowledge</label>
                            <div className="flex justify-between gap-1">
                              <button 
                                className={`${studyAreas['pharmacology']?.confidenceLevel === 1 ? 'bg-[#4B9CD3] text-white' : 'bg-[#F8F8F8]'} hover:bg-[#4B9CD3] hover:text-white border border-black px-3 py-1 text-sm flex-1 transition-colors`}
                                onClick={() => updateConfidenceLevel('pharmacology', 1)}
                              >
                                Low
                              </button>
                              <button 
                                className={`${studyAreas['pharmacology']?.confidenceLevel === 2 ? 'bg-[#4B9CD3] text-white' : 'bg-[#F8F8F8]'} hover:bg-[#4B9CD3] hover:text-white border border-black px-3 py-1 text-sm flex-1 transition-colors`}
                                onClick={() => updateConfidenceLevel('pharmacology', 2)}
                              >
                                Medium
                              </button>
                              <button 
                                className={`${studyAreas['pharmacology']?.confidenceLevel === 3 ? 'bg-[#4B9CD3] text-white' : 'bg-[#F8F8F8]'} hover:bg-[#4B9CD3] hover:text-white border border-black px-3 py-1 text-sm flex-1 transition-colors`}
                                onClick={() => updateConfidenceLevel('pharmacology', 3)}
                              >
                                High
                              </button>
                            </div>
                          </div>
                          
                          <div>
                            <label className="font-medium text-[#13294B] block mb-1">Maternal-Newborn Nursing</label>
                            <div className="flex justify-between gap-1">
                              <button 
                                className={`${studyAreas['maternal-newborn']?.confidenceLevel === 1 ? 'bg-[#4B9CD3] text-white' : 'bg-[#F8F8F8]'} hover:bg-[#4B9CD3] hover:text-white border border-black px-3 py-1 text-sm flex-1 transition-colors`}
                                onClick={() => updateConfidenceLevel('maternal-newborn', 1)}
                              >
                                Low
                              </button>
                              <button 
                                className={`${studyAreas['maternal-newborn']?.confidenceLevel === 2 ? 'bg-[#4B9CD3] text-white' : 'bg-[#F8F8F8]'} hover:bg-[#4B9CD3] hover:text-white border border-black px-3 py-1 text-sm flex-1 transition-colors`}
                                onClick={() => updateConfidenceLevel('maternal-newborn', 2)}
                              >
                                Medium
                              </button>
                              <button 
                                className={`${studyAreas['maternal-newborn']?.confidenceLevel === 3 ? 'bg-[#4B9CD3] text-white' : 'bg-[#F8F8F8]'} hover:bg-[#4B9CD3] hover:text-white border border-black px-3 py-1 text-sm flex-1 transition-colors`}
                                onClick={() => updateConfidenceLevel('maternal-newborn', 3)}
                              >
                                High
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Personalized Recommendations */}
                        {recommendations.length > 0 && (
                          <div className="border-2 border-black p-4 mb-4">
                            <h4 className="font-bold text-[#13294B] mb-2">Your Personalized Recommendations</h4>
                            <ul className="space-y-3">
                              {recommendations.map((rec, index) => (
                                <li key={index} className="flex items-start">
                                  <div className={`flex-shrink-0 mt-1 mr-2 ${rec.completed ? 'text-green-600' : rec.priority === 3 ? 'text-amber-600' : 'text-blue-600'}`}>
                                    {rec.completed ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                                  </div>
                                  <div className="flex-grow">
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium">{rec.title}</span>
                                      {!rec.completed && (
                                        <button 
                                          className="text-xs border border-gray-300 bg-gray-50 px-2 py-1 rounded hover:bg-gray-100"
                                          onClick={() => completeRecommendation(index)}
                                        >
                                          Mark done
                                        </button>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-600">{rec.description}</p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className="flex justify-center">
                          <Link href="/study-strategies">
                            <button className="neuro-button-primary min-h-[44px] min-w-[200px]">
                              View Detailed Study Plan
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quick Sample Questions */}
                    <div className="border-2 border-black mt-4">
                      <div className="bg-[#13294B] text-white p-2">
                        <h3 className="font-bold text-lg">NCLEX Question Types</h3>
                      </div>
                      <div className="p-4 bg-white">
                        <p className="mb-4">Familiarize yourself with the different types of questions you'll encounter:</p>
                        
                        <div className="space-y-6">
                          {/* Sample Multiple Choice */}
                          <div className="border border-black p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="bg-[#4B9CD3] text-white py-1 px-2 text-xs font-bold rounded">
                                MULTIPLE CHOICE
                              </div>
                              <span className="text-sm text-gray-600">Most common format</span>
                            </div>
                            <p className="font-medium mb-3 text-[#13294B]">A nurse is caring for a client with hyperkalemia. Which intervention should the nurse implement first?</p>
                            <div className="space-y-2 ml-1">
                              <div className="flex items-center gap-2">
                                <input type="radio" id="mc1" name="mc-sample" className="w-4 h-4" />
                                <label htmlFor="mc1" className="text-sm">Administer calcium gluconate</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input type="radio" id="mc2" name="mc-sample" className="w-4 h-4" />
                                <label htmlFor="mc2" className="text-sm">Prepare for dialysis</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input type="radio" id="mc3" name="mc-sample" className="w-4 h-4" />
                                <label htmlFor="mc3" className="text-sm">Administer furosemide</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input type="radio" id="mc4" name="mc-sample" className="w-4 h-4" />
                                <label htmlFor="mc4" className="text-sm">Obtain an ECG</label>
                              </div>
                            </div>
                          </div>
                          
                          {/* Sample SATA */}
                          <div className="border border-black p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="bg-[#4B9CD3] text-white py-1 px-2 text-xs font-bold rounded">
                                SELECT ALL THAT APPLY
                              </div>
                              <span className="text-sm text-gray-600">Select multiple correct options</span>
                            </div>
                            <p className="font-medium mb-3 text-[#13294B]">Which findings would a nurse expect to observe in a client with left-sided heart failure? Select all that apply.</p>
                            <div className="space-y-2 ml-1">
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="sata1" className="w-4 h-4" />
                                <label htmlFor="sata1" className="text-sm">Pulmonary edema</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="sata2" className="w-4 h-4" />
                                <label htmlFor="sata2" className="text-sm">Jugular venous distention</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="sata3" className="w-4 h-4" />
                                <label htmlFor="sata3" className="text-sm">Crackles in lung bases</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="sata4" className="w-4 h-4" />
                                <label htmlFor="sata4" className="text-sm">Dependent edema</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="sata5" className="w-4 h-4" />
                                <label htmlFor="sata5" className="text-sm">Dyspnea on exertion</label>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-center text-gray-600 flex gap-3 items-center justify-center">
                            <span>See more question formats in</span>
                            <Link href="/exams-and-studies">
                              <button className="neuro-button-secondary min-h-[36px] text-sm">
                                Practice Exams
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Link href="/study-strategies">
                      <button 
                        className="neuro-button-primary min-h-[44px] min-w-[220px]"
                        aria-label="View Detailed Study Resources and Strategies"
                      >
                        View Detailed Study Resources
                      </button>
                    </Link>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            {/* Direct link to Study Strategy Planner */}
            <Link href="/study-strategies">
              <button 
                className="neuro-button-primary min-h-[44px] flex-1 text-md flex items-center justify-center gap-2"
                aria-label="Access Study Strategy Planner"
              >
                <Calendar className="h-5 w-5" />
                Strategy Planner
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}