import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock, Flag, PanelLeftClose, HelpCircle, BookOpen, Lightbulb } from "lucide-react";
import { Test, Question, QuestionsResponse } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { fetchTestContent } from "@/lib/api";
import { FlashcardReview } from "./FlashcardReview";
import { QuestionTestView } from "./QuestionTestView";
import { toast } from "@/hooks/use-toast";

interface TestViewProps {
  test: Test;
  onBack: () => void;
}

export function TestView({ test, onBack }: TestViewProps) {
  const { data: testContent, isLoading, error } = useQuery<string | QuestionsResponse>({
    queryKey: [`/api/tests/${test.id}/content`],
    queryFn: async () => {
      const response = await fetchTestContent(test.id);
      return response;
    }
  });
  
  const [iframeHeight, setIframeHeight] = useState(600);
  const [timer, setTimer] = useState("02:00:00");
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(75);
  const [showReviewMode, setShowReviewMode] = useState(false);

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
      {/* Professional Exam Header - Top Bar */}
      <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
        <div className="bg-[#13294B] text-white py-3 px-6 flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="flex items-center mb-3 md:mb-0">
            <h2 className="font-bold text-xl">NCLEX Exam: {test.title}</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-[#0A1E3A] py-2 px-4 rounded-md border border-[#4B9CD3]">
              <Clock className="h-5 w-5 mr-2 text-[#4B9CD3]" />
              <span className="font-mono font-bold">{timer}</span>
            </div>
            <button 
              onClick={onBack}
              className="bg-[#4B9CD3] hover:bg-[#3d7eaa] text-white py-2 px-4 rounded-md flex items-center transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="font-medium">Exit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Exam Content Container */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Left side: Question number & tools */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h3 className="font-bold text-[#13294B] text-lg border-b pb-2 mb-3">Question Navigator</h3>
            
            {/* Question number indicator */}
            <div className="bg-[#f3f4f6] p-3 rounded-md mb-3 text-center">
              <span className="block text-sm text-gray-500 mb-1">Question</span>
              <span className="text-3xl font-bold text-[#13294B]">{questionNumber}</span>
              <span className="block text-sm text-gray-500 mt-1">of {totalQuestions}</span>
            </div>
            
            {/* Action buttons */}
            <div className="space-y-2">
              <button className="w-full text-[#13294B] py-2 px-3 flex items-center justify-between rounded border border-gray-200 hover:bg-gray-50 transition-colors">
                <span className="font-medium">Flag Question</span>
                <Flag className="h-4 w-4" />
              </button>
              <button className="w-full text-[#13294B] py-2 px-3 flex items-center justify-between rounded border border-gray-200 hover:bg-gray-50 transition-colors">
                <span className="font-medium">Question List</span>
                <PanelLeftClose className="h-4 w-4" />
              </button>
              <button 
                className="w-full text-[#13294B] py-2 px-3 flex items-center justify-between rounded border border-gray-200 hover:bg-gray-50 transition-colors"
                onClick={() => setShowReviewMode(true)}
              >
                <span className="font-medium">Quick Review Mode</span>
                <BookOpen className="h-4 w-4" />
              </button>
              <button className="w-full text-[#13294B] py-2 px-3 flex items-center justify-between rounded border border-gray-200 hover:bg-gray-50 transition-colors">
                <span className="font-medium">Get Help</span>
                <HelpCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Submit exam button */}
          <div className="bg-[#13294B] text-white rounded-lg shadow-md p-4 text-center hidden md:block">
            <p className="mb-3 text-sm">When you've completed all questions:</p>
            <button className="w-full bg-[#4B9CD3] hover:bg-[#3d7eaa] py-2 px-4 rounded-md font-medium transition-colors">
              Submit Exam
            </button>
          </div>
        </div>
        
        {/* Right side: Exam Content */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Exam Content */}
            <div className="p-6 border-b border-gray-200">
              {isLoading ? (
                <div>
                  <Skeleton className="h-8 w-1/2 mb-4" />
                  <Skeleton className="h-96 w-full" />
                </div>
              ) : (
                <>
                {/* If the content is JSON with questions */}
                {testContent && typeof testContent === 'object' && 'questions' in testContent ? (
                  // We have a questions object, render the QuestionTestView
                  <div className="w-full">
                    <QuestionTestView 
                      test={test as Test & { questionsData: QuestionsResponse }} 
                      onBack={onBack} 
                    />
                  </div>
                ) : (
                  // Otherwise, render the iframe with HTML content
                  <div className="w-full">
                    <iframe
                      id="test-iframe"
                      title={test.title}
                      srcDoc={typeof testContent === 'string' ? testContent : ''}
                      className="w-full border-0 rounded bg-white"
                      style={{ height: `${iframeHeight}px`, minHeight: '500px' }}
                      sandbox="allow-same-origin allow-scripts"
                    />
                  </div>
                )}
                </>
              )}
            </div>
            
            {/* Question Navigation - Professional Style */}
            <div className="bg-gray-50 p-4 flex justify-between items-center">
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
                Question {questionNumber} of {totalQuestions}
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
          
          {/* Mobile submit button */}
          <div className="mt-4 md:hidden">
            <button className="w-full bg-[#4B9CD3] hover:bg-[#3d7eaa] py-3 px-4 rounded-md font-medium text-white transition-colors">
              Submit Exam
            </button>
          </div>
        </div>
      </div>
      
      {/* Exam Instructions - Desktop Footer */}
      <div className="bg-white rounded-lg shadow-md p-4 mt-4 text-sm border-l-4 border-[#4B9CD3] hidden md:block">
        <p className="text-gray-700">
          <span className="font-medium">Instructions:</span> Read each question carefully before selecting an answer. 
          You can flag questions to review later, and your progress is automatically saved.
          Use the navigation buttons or question list to move between questions.
        </p>
      </div>
      
      {/* Quick Review Mode */}
      {showReviewMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 bg-[#13294B] text-white flex justify-between items-center">
              <h2 className="text-xl font-bold">Quick Review Mode</h2>
              <div className="space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/20"
                  onClick={() => setShowReviewMode(false)}
                >
                  Close
                </Button>
              </div>
            </div>
            
            <div className="p-6 flex-grow overflow-y-auto">
              <div className="mb-6 text-center">
                <Lightbulb className="h-16 w-16 text-amber-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Welcome to Quick Review Mode</h3>
                <p className="text-gray-600">
                  The Quick Review feature allows you to study material in a flashcard format. 
                  It's perfect for quick review sessions before an exam.
                </p>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <h4 className="font-medium text-lg mb-3 text-[#13294B]">How to use Quick Review Mode:</h4>
                <ul className="text-left space-y-3 text-gray-700 max-w-lg mx-auto">
                  <li className="flex items-start">
                    <div className="bg-[#13294B] text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">1</div>
                    <p>Start a practice test to generate flashcards from actual NCLEX questions</p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-[#13294B] text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">2</div>
                    <p>Use arrow keys to navigate between cards or click the buttons</p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-[#13294B] text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">3</div>
                    <p>Click on a card or press spacebar to flip between question and answer</p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-[#13294B] text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">4</div>
                    <p>Study rationales to understand the reasoning behind answers</p>
                  </li>
                </ul>
              </div>
              
              <div className="mt-6 text-center">
                <Button
                  onClick={() => {
                    setShowReviewMode(false);
                    toast({
                      title: "Start a Practice Test",
                      description: "To use Quick Review mode with real NCLEX questions, start a practice test and answer questions to generate flashcards.",
                      variant: "default",
                    });
                  }}
                  className="bg-[#4B9CD3] hover:bg-[#3d7eaa] text-white"
                >
                  Got it!
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
