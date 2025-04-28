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

interface TestListProps {
  onSelectTest: (test: Test) => void;
}

export function TestList({ onSelectTest }: TestListProps) {
  const { data: tests, isLoading, error } = useQuery({
    queryKey: ['/api/tests'],
  });

  // Mobile dropdown state
  const [selectedTest, setSelectedTest] = useState("");

  const handleMobileSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const testPath = e.target.value;
    if (testPath) {
      const selectedTest = tests?.find(test => test.path === testPath);
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
      {/* Mobile dropdown for test selection */}
      <div className="mb-4 lg:hidden">
        <label htmlFor="testSelect" className="block text-sm font-medium mb-1">
          Select a Test:
        </label>
        <select
          id="testSelect"
          className="w-full p-2 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          value={selectedTest}
          onChange={handleMobileSelect}
        >
          <option value="">Select a test to begin</option>
          {tests?.map((test) => (
            <option key={test.id} value={test.path}>
              {test.title}
            </option>
          ))}
        </select>
      </div>

      {/* Readiness Assessment Tests Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Readiness Assessment Tests</CardTitle>
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
                  <div key={test.id} className="flex items-center justify-between p-3 border-b border-gray-100">
                    <div className="font-medium">{test.title}</div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">Not Attempted</span>
                      <Button 
                        className="bg-primary text-white rounded-full hover:bg-primary/90"
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

      {/* Recent Tests Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Recent Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Test ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Score</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Time</th>
                </tr>
              </thead>
              <tbody>
                {/* Empty state for recent tests */}
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-500">
                    No recent test attempts
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Case Studies Section */}
      <Card>
        <CardHeader>
          <CardTitle>Case Studies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Avg Score</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-primary">Mental Health</td>
                  <td className="py-3 px-4">N/A</td>
                  <td className="py-3 px-4">
                    <Button className="bg-primary text-white rounded-full hover:bg-primary/90" size="sm">
                      Take Tests
                    </Button>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-primary">Critical Care</td>
                  <td className="py-3 px-4">N/A</td>
                  <td className="py-3 px-4">
                    <Button className="bg-primary text-white rounded-full hover:bg-primary/90" size="sm">
                      Take Tests
                    </Button>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-primary">Adult Health</td>
                  <td className="py-3 px-4">N/A</td>
                  <td className="py-3 px-4">
                    <Button className="bg-primary text-white rounded-full hover:bg-primary/90" size="sm">
                      Take Tests
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-primary">Pediatrics</td>
                  <td className="py-3 px-4">N/A</td>
                  <td className="py-3 px-4">
                    <Button className="bg-primary text-white rounded-full hover:bg-primary/90" size="sm">
                      Take Tests
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-center">
            <Button variant="outline" className="bg-blue-100 text-primary hover:bg-blue-200">
              View All Tests
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
