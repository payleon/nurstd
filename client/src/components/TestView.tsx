import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock, Flag, PanelLeftClose, HelpCircle, Save } from "lucide-react";
import { Test } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { fetchTestContent } from "@/lib/api";

interface TestViewProps {
  test: Test;
  onBack: () => void;
}

export function TestView({ test, onBack }: TestViewProps) {
  const { data: testContent, isLoading, error } = useQuery<string>({
    queryKey: [`/api/tests/${test.id}/content`],
    queryFn: async ({ queryKey }) => {
      const response = await fetch(queryKey[0] as string);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.text();
    }
  });
  
  const [iframeHeight, setIframeHeight] = useState(600);
  const [timer, setTimer] = useState("02:00:00");
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(75);

  // Adjust iframe height based on content
  useEffect(() => {
    const adjustHeight = () => {
      const iframe = document.getElementById('test-iframe') as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
        try {
          const height = iframe.contentWindow.document.body.scrollHeight;
          setIframeHeight(height + 50); // Add some padding
        } catch (e) {
          console.error("Could not access iframe content:", e);
        }
      }
    };

    // Try to adjust height once content is loaded
    const iframe = document.getElementById('test-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.onload = adjustHeight;
    }

    // Adjust height periodically for dynamic content
    const interval = setInterval(adjustHeight, 1000);
    return () => clearInterval(interval);
  }, [testContent]);

  // Mock decreasing timer for demo purposes
  useEffect(() => {
    const interval = setInterval(() => {
      const [hours, minutes, seconds] = timer.split(':').map(Number);
      let newSeconds = seconds - 1;
      let newMinutes = minutes;
      let newHours = hours;
      
      if (newSeconds < 0) {
        newSeconds = 59;
        newMinutes -= 1;
      }
      
      if (newMinutes < 0) {
        newMinutes = 59;
        newHours -= 1;
      }
      
      if (newHours < 0) {
        clearInterval(interval);
        return;
      }
      
      setTimer(
        `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}:${newSeconds.toString().padStart(2, '0')}`
      );
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timer]);

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Button onClick={onBack} className="mb-4 flex items-center" variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tests
          </Button>
          <div className="text-red-500">
            Error loading test content: {error instanceof Error ? error.message : "Unknown error"}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Professional Exam Header */}
      <div className="bg-white rounded-t-lg border-2 border-gray-200 shadow-lg mb-6 overflow-hidden">
        <div className="bg-[#13294B] text-white py-3 px-6 flex flex-col md:flex-row md:justify-between md:items-center border-b-2 border-[#4B9CD3]">
          <div className="flex items-center mb-3 md:mb-0">
            <button 
              onClick={onBack}
              className="bg-[#4B9CD3] hover:bg-[#3d7eaa] text-white py-2 px-4 rounded-md mr-4 flex items-center transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="font-medium">Exit Exam</span>
            </button>
            <h2 className="font-bold text-xl">{test.title}</h2>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center bg-[#4B9CD3] py-2 px-4 rounded-md">
              <Clock className="h-5 w-5 mr-2" />
              <span className="font-mono font-bold">{timer}</span>
            </div>
            <div className="font-medium">
              Question {questionNumber} of {totalQuestions}
            </div>
          </div>
        </div>

        {/* Exam Navigation Bar */}
        <div className="bg-gray-50 py-2 px-6 flex flex-wrap justify-between items-center border-b border-gray-200">
          <div className="flex items-center flex-wrap gap-2">
            <button className="text-[#13294B] py-1.5 px-3 flex items-center rounded hover:bg-gray-100 transition-colors">
              <PanelLeftClose className="h-4 w-4 mr-2" />
              <span className="font-medium">Question List</span>
            </button>
            <button className="text-[#13294B] py-1.5 px-3 flex items-center rounded hover:bg-gray-100 transition-colors">
              <Flag className="h-4 w-4 mr-2" />
              <span className="font-medium">Flag Question</span>
            </button>
          </div>
          <div className="flex items-center flex-wrap gap-2">
            <button className="text-[#13294B] py-1.5 px-3 flex items-center rounded hover:bg-gray-100 transition-colors">
              <HelpCircle className="h-4 w-4 mr-2" />
              <span className="font-medium">Help</span>
            </button>
            <button className="text-[#13294B] py-1.5 px-3 flex items-center rounded hover:bg-gray-100 transition-colors">
              <Save className="h-4 w-4 mr-2" />
              <span className="font-medium">Save Progress</span>
            </button>
          </div>
        </div>

        {/* Exam Content - Clean and Professional */}
        <div className="bg-white p-6 border-b border-gray-200">
          {isLoading ? (
            <div>
              <Skeleton className="h-8 w-1/2 mb-4" />
              <Skeleton className="h-96 w-full" />
            </div>
          ) : (
            <div className="w-full">
              <iframe
                id="test-iframe"
                title={test.title}
                srcDoc={testContent || ''}
                className="w-full border-0 rounded bg-white"
                style={{ height: `${iframeHeight}px`, minHeight: '500px' }}
                sandbox="allow-same-origin allow-scripts"
              />
            </div>
          )}
        </div>

        {/* Question Navigation - Professional Style */}
        <div className="bg-gray-50 p-4 flex justify-between items-center rounded-b-lg">
          <button 
            className={`bg-[#13294B] text-white py-2 px-6 rounded-md flex items-center transition-colors ${
              questionNumber === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#0A1E3A]'
            }`}
            disabled={questionNumber === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </button>
          <div className="text-sm text-gray-500 font-medium hidden md:block">
            Complete all questions to submit
          </div>
          <button 
            className={`bg-[#4B9CD3] text-white py-2 px-6 rounded-md transition-colors ${
              questionNumber === totalQuestions ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#3d7eaa]'
            }`}
            disabled={questionNumber === totalQuestions}
          >
            Next
          </button>
        </div>
      </div>

      {/* Additional information and controls */}
      <div className="flex gap-4 mb-6">
        <div className="bg-white rounded-lg border-2 border-gray-200 p-4 flex-1 text-sm">
          <p className="text-gray-700">
            <span className="font-medium">Note:</span> Read each question carefully before selecting an answer. 
            You can flag questions to review later, and your progress is automatically saved.
          </p>
        </div>
        
        <div className="bg-[#13294B] text-white rounded-lg border-2 border-gray-200 p-4 flex items-center">
          <button className="bg-[#4B9CD3] hover:bg-[#3d7eaa] px-4 py-2 rounded font-medium transition-colors">
            Submit Exam
          </button>
        </div>
      </div>
    </div>
  );
}
