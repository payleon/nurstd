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
import { FileText, FileCheck, Clock, Calendar, BarChart } from "lucide-react";

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
      {/* Welcome Card */}
      <Card className="mb-6 bg-gradient-to-r from-[#13294B] to-[#4B9CD3] text-white">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-2">Welcome to Naxlex NCLEX Prep</h2>
          <p className="mb-4">Your comprehensive nursing exam preparation platform. Choose from our available practice exams below to begin.</p>
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center bg-white bg-opacity-20 p-3 rounded-lg">
              <FileText className="h-5 w-5 mr-2" />
              <span>4 Practice Tests</span>
            </div>
            <div className="flex items-center bg-white bg-opacity-20 p-3 rounded-lg">
              <Clock className="h-5 w-5 mr-2" />
              <span>Unlimited Time</span>
            </div>
            <div className="flex items-center bg-white bg-opacity-20 p-3 rounded-lg">
              <BarChart className="h-5 w-5 mr-2" />
              <span>Detailed Analysis</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile dropdown for test selection */}
      <div className="mb-4 lg:hidden">
        <label htmlFor="testSelect" className="block text-sm font-medium mb-1">
          Select a Practice Exam:
        </label>
        <select
          id="testSelect"
          className="w-full p-2 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-[#4B9CD3] focus:border-[#4B9CD3]"
          value={selectedTest}
          onChange={handleMobileSelect}
        >
          <option value="">Select an exam to begin</option>
          {tests?.map((test) => (
            <option key={test.id} value={test.path}>
              {test.title}
            </option>
          ))}
        </select>
      </div>

      {/* Practice Exams Section */}
      <Card className="mb-6 border-t-4 border-[#4B9CD3]">
        <CardHeader className="bg-gray-50">
          <CardTitle className="flex items-center text-[#13294B]">
            <FileCheck className="h-5 w-5 mr-2 text-[#4B9CD3]" />
            Available Practice Exams
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            // Loading skeleton
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 border-b border-gray-100">
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
                <div className="text-center py-4 text-gray-500">
                  No tests available. Add HTML files to the published/ directory to see them here.
                </div>
              ) : (
                tests?.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                      <div className="bg-[#4B9CD3] text-white p-2 rounded-full mr-4">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium text-[#13294B]">{test.title}</div>
                        <div className="text-sm text-gray-500">75 questions • 2 hours</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500 hidden md:inline">Not Attempted</span>
                      <Button 
                        className="bg-[#4B9CD3] text-white hover:bg-[#3d7eaa]"
                        size="sm"
                        onClick={() => handleSelectTest(test)}
                      >
                        Take Exam
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity Section */}
      <Card className="mb-6 border-t-4 border-[#4B9CD3]">
        <CardHeader className="bg-gray-50">
          <CardTitle className="flex items-center text-[#13294B]">
            <Clock className="h-5 w-5 mr-2 text-[#4B9CD3]" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Test Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Score</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {/* Empty state for recent tests */}
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    <div className="flex flex-col items-center">
                      <Calendar className="h-10 w-10 text-gray-300 mb-2" />
                      <span>No recent test attempts</span>
                      <span className="text-sm text-gray-400 mt-1">Your completed exams will appear here</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Study Tips */}
      <Card className="border-t-4 border-[#4B9CD3]">
        <CardHeader className="bg-gray-50">
          <CardTitle className="flex items-center text-[#13294B]">
            <BarChart className="h-5 w-5 mr-2 text-[#4B9CD3]" />
            NCLEX Study Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-gray-100">
            <div className="py-3">
              <h3 className="font-medium text-[#13294B] mb-1">Practice Regularly</h3>
              <p className="text-sm text-gray-600">Consistent practice with NCLEX-style questions improves critical thinking skills and test familiarity.</p>
            </div>
            <div className="py-3">
              <h3 className="font-medium text-[#13294B] mb-1">Review Test Rationales</h3>
              <p className="text-sm text-gray-600">Always read explanations for both correct and incorrect answers to deepen understanding.</p>
            </div>
            <div className="py-3">
              <h3 className="font-medium text-[#13294B] mb-1">Identify Knowledge Gaps</h3>
              <p className="text-sm text-gray-600">Focus your study time on areas where you consistently struggle.</p>
            </div>
            <div className="py-3">
              <h3 className="font-medium text-[#13294B] mb-1">Simulate Test Environment</h3>
              <p className="text-sm text-gray-600">Take full-length practice tests under timed conditions to build stamina and reduce anxiety.</p>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <Button className="bg-[#4B9CD3] text-white hover:bg-[#3d7eaa]">
              View Study Resources
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
