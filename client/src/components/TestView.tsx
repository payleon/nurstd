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
    <div>
      {/* Exam Header - NeurobrutalBox Style */}
      <div className="neuro-card mb-0 border-b-0 overflow-hidden">
        <div className="bg-[#13294B] text-white p-4 neuro-header flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={onBack}
              className="neuro-button-primary mr-4 py-1 px-3 flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="font-bold">EXIT EXAM</span>
            </button>
            <h2 className="font-bold text-xl uppercase">{test.title}</h2>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center bg-[#4B9CD3] py-1 px-3 border-2 border-black">
              <Clock className="h-4 w-4 mr-2" />
              <span className="font-mono font-bold">{timer}</span>
            </div>
            <div className="font-bold uppercase">
              Question {questionNumber} of {totalQuestions}
            </div>
          </div>
        </div>

        {/* Exam Navigation */}
        <div className="bg-[#4B9CD3] text-white p-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button className="border-2 border-black bg-[#13294B] text-white py-1 px-3 flex items-center hover:bg-[#0e2038] transition-colors">
              <PanelLeftClose className="h-4 w-4 mr-2" />
              <span className="font-bold">QUESTION LIST</span>
            </button>
            <button className="border-2 border-black bg-[#13294B] text-white py-1 px-3 flex items-center hover:bg-[#0e2038] transition-colors">
              <Flag className="h-4 w-4 mr-2" />
              <span className="font-bold">FLAG</span>
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <button className="border-2 border-black bg-[#13294B] text-white py-1 px-3 flex items-center hover:bg-[#0e2038] transition-colors">
              <HelpCircle className="h-4 w-4 mr-2" />
              <span className="font-bold">HELP</span>
            </button>
            <button className="border-2 border-black bg-[#13294B] text-white py-1 px-3 flex items-center hover:bg-[#0e2038] transition-colors">
              <Save className="h-4 w-4 mr-2" />
              <span className="font-bold">SAVE</span>
            </button>
          </div>
        </div>
      </div>

      {/* Exam Content */}
      <div className="neuro-card mt-0 pt-0 border-t-0 mb-6 overflow-hidden">
        <div className="bg-white p-0">
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
        </div>
      </div>

      {/* Question Navigation */}
      <div className="mt-4 flex justify-between">
        <button 
          className={`neuro-button-secondary ${questionNumber === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={questionNumber === 1}
        >
          Previous Question
        </button>
        <button 
          className={`neuro-button-primary ${questionNumber === totalQuestions ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={questionNumber === totalQuestions}
        >
          Next Question
        </button>
      </div>
    </div>
  );
}
