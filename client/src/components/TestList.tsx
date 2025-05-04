import { useState } from "react";
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
import { FileText, FileCheck, Clock, Calendar, BarChart, X } from "lucide-react";
import { Link } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TestListProps {
  onSelectTest: (test: Test) => void;
}

export function TestList({ onSelectTest }: TestListProps) {
  const { data: tests, isLoading, error } = useQuery<Test[]>({
    queryKey: ['/api/tests'],
  });

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
                    Expert advice to help you succeed on your NCLEX exam preparation.
                  </DialogDescription>
                  
                  <div className="divide-y-2 divide-black">
                    <div className="py-4">
                      <h3 className="font-bold text-[#13294B] mb-2 text-lg">Practice Regularly</h3>
                      <p>Consistent practice with NCLEX-style questions improves critical thinking skills and test familiarity.</p>
                    </div>
                    <div className="py-4">
                      <h3 className="font-bold text-[#13294B] mb-2 text-lg">Review Test Rationales</h3>
                      <p>Always read explanations for both correct and incorrect answers to deepen understanding.</p>
                    </div>
                    <div className="py-4">
                      <h3 className="font-bold text-[#13294B] mb-2 text-lg">Identify Knowledge Gaps</h3>
                      <p>Focus your study time on areas where you consistently struggle.</p>
                    </div>
                    <div className="py-4">
                      <h3 className="font-bold text-[#13294B] mb-2 text-lg">Simulate Test Environment</h3>
                      <p>Take full-length practice tests under timed conditions to build stamina and reduce anxiety.</p>
                    </div>
                    <div className="py-4">
                      <h3 className="font-bold text-[#13294B] mb-2 text-lg">Use Active Learning</h3>
                      <p>Take notes, create flashcards, and teach concepts to others to reinforce your understanding.</p>
                    </div>
                    <div className="py-4">
                      <h3 className="font-bold text-[#13294B] mb-2 text-lg">Manage Test Anxiety</h3>
                      <p>Practice relaxation techniques and positive visualization to reduce stress during exams.</p>
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