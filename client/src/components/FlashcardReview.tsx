import React, { useState, useEffect } from 'react';
import { Question } from '@shared/schema';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, RotateCcw, Info } from 'lucide-react';

interface FlashcardReviewProps {
  questions: Question[];
  onClose: () => void;
}

type FlashcardSide = 'front' | 'back';

export function FlashcardReview({ questions, onClose }: FlashcardReviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [side, setSide] = useState<FlashcardSide>('front');
  const [isFlipping, setIsFlipping] = useState(false);

  const currentQuestion = questions[currentIndex];
  
  const goToNext = () => {
    if (currentIndex < questions.length - 1) {
      setSide('front');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentIndex(prevIndex => prevIndex + 1);
        setIsFlipping(false);
      }, 150);
    }
  };
  
  const goToPrevious = () => {
    if (currentIndex > 0) {
      setSide('front');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentIndex(prevIndex => prevIndex - 1);
        setIsFlipping(false);
      }, 150);
    }
  };
  
  const flipCard = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setSide(currentSide => currentSide === 'front' ? 'back' : 'front');
      setIsFlipping(false);
    }, 150);
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
          goToNext();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case ' ': // Spacebar
          flipCard();
          e.preventDefault(); // Prevent page scroll
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, questions.length]); // Re-add event listener when dependencies change
  
  // Generate a concise summary from the question
  const generateFrontContent = (question: Question) => {
    // For multiple choice, the front is just the question text
    return question.text;
  };
  
  const generateBackContent = (question: Question) => {
    // For multiple choice, show the correct answer and rationale
    if (question.type === 'mc') {
      const correctChoiceId = question.correctAnswer;
      const correctChoice = question.choices?.find(choice => choice.id === correctChoiceId);
      
      return (
        <>
          <div className="font-bold mb-2">Answer: {correctChoiceId}. {correctChoice?.text}</div>
          <div>{question.rationale}</div>
        </>
      );
    } else if (question.type === 'sata') {
      const correctChoiceIds = question.correctAnswer as string[];
      const correctChoices = question.choices?.filter(choice => 
        correctChoiceIds.includes(choice.id)
      );
      
      return (
        <>
          <div className="font-bold mb-2">Answers:</div>
          <ul className="list-disc pl-5 mb-4">
            {correctChoices?.map(choice => (
              <li key={choice.id}>{choice.id}. {choice.text}</li>
            ))}
          </ul>
          <div>{question.rationale}</div>
        </>
      );
    }
    
    // Default case
    return (
      <div>{question.rationale}</div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 bg-[#13294B] text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">Quick Review Mode</h2>
          <div className="space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/20"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
        
        <div className="p-6 flex-grow overflow-y-auto">
          <div className="mb-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Card {currentIndex + 1} of {questions.length}
            </div>
            <div className="text-sm font-medium text-[#13294B]">
              {currentQuestion.title}
            </div>
          </div>
          
          {/* Flashcard */}
          <div 
            className={`border-2 border-black rounded-xl p-6 min-h-[300px] shadow-md bg-white 
                      flex flex-col justify-between cursor-pointer transition-all duration-150
                      ${isFlipping ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}
            onClick={flipCard}
          >
            <div className="flex-grow">
              {side === 'front' ? (
                <div className="text-xl font-medium">
                  {generateFrontContent(currentQuestion)}
                </div>
              ) : (
                <div className="text-base">
                  {generateBackContent(currentQuestion)}
                </div>
              )}
            </div>
            
            <div className="pt-4 text-center text-sm text-gray-500 mt-auto">
              Click to flip
            </div>
          </div>
          
          {/* Navigation Controls */}
          <div className="mt-6 flex justify-between items-center">
            <Button
              variant="outline"
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="w-[100px]"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSide('front')}
                disabled={side === 'front'}
              >
                Question
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSide('back')}
                disabled={side === 'back'}
              >
                Answer
              </Button>
            </div>
            
            <Button
              variant="outline"
              onClick={goToNext}
              disabled={currentIndex === questions.length - 1}
              className="w-[100px]"
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
        
        <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
          <div className="flex items-center text-gray-600">
            <Info className="h-4 w-4 mr-1" />
            <span className="text-sm">Tip: Use arrow keys to navigate cards and spacebar to flip</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCurrentIndex(0);
              setSide('front');
            }}
          >
            <RotateCcw className="h-3 w-3 mr-1" /> Restart
          </Button>
        </div>
      </div>
    </div>
  );
}