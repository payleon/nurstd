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
    <div>
      {/* Exam Header */}
      <div className="bg-[#13294B] text-white p-4 rounded-t-lg mb-1 flex justify-between items-center">
        <div className="flex items-center">
          <Button 
            onClick={onBack}
            className="bg-[#4B9CD3] text-white flex items-center hover:bg-[#3d7eaa] mr-4"
            size="sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Exit Exam
          </Button>
          <h2 className="font-semibold text-lg">{test.title}</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span className="font-mono">{timer}</span>
          </div>
          <div>
            Question {questionNumber} of {totalQuestions}
          </div>
        </div>
      </div>

      {/* Exam Navigation */}
      <div className="bg-[#4B9CD3] text-white p-2 rounded-b-lg mb-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost"
            className="text-white hover:bg-[#3d7eaa] py-1 h-8" 
            size="sm"
          >
            <PanelLeftClose className="h-4 w-4 mr-1" />
            <span className="text-sm">Question List</span>
          </Button>
          <Button 
            variant="ghost"
            className="text-white hover:bg-[#3d7eaa] py-1 h-8" 
            size="sm"
          >
            <Flag className="h-4 w-4 mr-1" />
            <span className="text-sm">Flag Question</span>
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost"
            className="text-white hover:bg-[#3d7eaa] py-1 h-8" 
            size="sm"
          >
            <HelpCircle className="h-4 w-4 mr-1" />
            <span className="text-sm">Help</span>
          </Button>
          <Button 
            variant="ghost"
            className="text-white hover:bg-[#3d7eaa] py-1 h-8" 
            size="sm"
          >
            <Save className="h-4 w-4 mr-1" />
            <span className="text-sm">Save Progress</span>
          </Button>
        </div>
      </div>

      {/* Exam Content */}
      <Card className="border overflow-hidden shadow-md">
        <CardContent className="p-0 overflow-hidden">
          {isLoading ? (
            <div className="p-6">
              <Skeleton className="h-8 w-1/2 mb-4" />
              <Skeleton className="h-96 w-full" />
            </div>
          ) : (
            <div className="w-full">
              <iframe
                id="test-iframe"
                title={test.title}
                srcDoc={testContent || ''}
                className="w-full border-0"
                style={{ height: `${iframeHeight}px` }}
                sandbox="allow-same-origin allow-scripts"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Question Navigation */}
      <div className="mt-4 flex justify-between">
        <Button 
          className="bg-[#13294B] text-white hover:bg-[#0A1E3A]"
          disabled={questionNumber === 1}
        >
          Previous Question
        </Button>
        <Button 
          className="bg-[#4B9CD3] text-white hover:bg-[#3d7eaa]"
          disabled={questionNumber === totalQuestions}
        >
          Next Question
        </Button>
      </div>
    </div>
  );
}
