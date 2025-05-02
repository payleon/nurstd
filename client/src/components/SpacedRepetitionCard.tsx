/**
 * SpacedRepetitionCard Component
 * 
 * A flashcard component optimized for spaced repetition learning that
 * shows the question, reveals the answer, and collects performance feedback.
 */

import { useState, useEffect } from 'react';
import { Question } from '@shared/schema';
import { FlashcardMetadata, scheduleNextReview } from '../utils/spacedRepetition';
import { saveFlashcard } from '../utils/flashcardStorage';
import { Button } from './ui/button';
import { MedicalSpinner } from './ui/medical-spinner';

interface SpacedRepetitionCardProps {
  question: Question;
  flashcardMetadata: FlashcardMetadata;
  onReviewed: (updatedMetadata: FlashcardMetadata) => void;
  onNext: () => void;
  showStats?: boolean;
}

export function SpacedRepetitionCard({
  question,
  flashcardMetadata,
  onReviewed,
  onNext,
  showStats = false,
}: SpacedRepetitionCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeToAnswer, setTimeToAnswer] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [responseRecorded, setResponseRecorded] = useState(false);
  
  // Reset timer when a new card is presented
  useEffect(() => {
    setFlipped(false);
    setStartTime(Date.now());
    setTimeToAnswer(null);
    setResponseRecorded(false);
  }, [question.id]);
  
  const handleFlip = () => {
    if (!flipped && startTime) {
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      setTimeToAnswer(elapsed);
    }
    setFlipped(!flipped);
  };
  
  // Record user's performance rating (0-5 scale)
  const recordPerformance = async (performanceRating: number) => {
    setLoading(true);
    
    try {
      // Update flashcard metadata with performance data
      const updatedMetadata = scheduleNextReview(
        flashcardMetadata, 
        performanceRating
      );
      
      // If we captured time to answer, add it to the most recent history entry
      if (timeToAnswer && updatedMetadata.history.length > 0) {
        const lastIndex = updatedMetadata.history.length - 1;
        updatedMetadata.history[lastIndex].timeToAnswer = timeToAnswer;
      }
      
      // Save updated metadata
      await saveFlashcard(updatedMetadata);
      
      // Notify parent component
      onReviewed(updatedMetadata);
      setResponseRecorded(true);
    } catch (error) {
      console.error('Error updating flashcard:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Format the question content based on question type
  const renderFrontContent = () => {
    switch (question.type) {
      case 'mc':
        return (
          <div>
            <p>{question.text}</p>
            {/* Don't show options on front of card */}
          </div>
        );
      case 'ordered':
        return (
          <div>
            <p>{question.text}</p>
            <p className="text-sm text-blue-600 mt-2">(Arrange in correct order)</p>
          </div>
        );
      case 'hotspot':
        return (
          <div>
            <p>{question.text}</p>
            {question.image && (
              <div className="mt-3 max-w-sm mx-auto">
                <img 
                  src={question.image} 
                  alt="Question visual" 
                  className="object-contain rounded-md"
                />
              </div>
            )}
          </div>
        );
      default:
        return <p>{question.text}</p>;
    }
  };
  
  // Format the answer content
  const renderBackContent = () => {
    switch (question.type) {
      case 'mc':
        return (
          <div>
            <p className="font-bold text-lg mb-2">Answer:</p>
            <div className="mb-3">
              {question.choices?.map(choice => (
                <div 
                  key={choice.id} 
                  className={`p-2 my-1 rounded-md ${choice.id === question.correctAnswer ? 'bg-green-100 border border-green-300' : ''}`}
                >
                  <span className={choice.id === question.correctAnswer ? 'font-bold' : ''}>
                    {choice.id}. {choice.text}
                  </span>
                </div>
              ))}
            </div>
            {question.rationale && (
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm font-semibold mb-1">Explanation:</p>
                <p className="text-sm">{question.rationale}</p>
              </div>
            )}
          </div>
        );
      case 'ordered':
        return (
          <div>
            <p className="font-bold text-lg mb-2">Correct Order:</p>
            <ol className="list-decimal pl-5">
              {question.correctOrder?.map((index) => (
                <li key={index} className="py-1">
                  {question.options?.[index]}
                </li>
              ))}
            </ol>
            {question.rationale && (
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm font-semibold mb-1">Explanation:</p>
                <p className="text-sm">{question.rationale}</p>
              </div>
            )}
          </div>
        );
      default:
        return (
          <div>
            <p className="font-bold text-lg mb-2">Answer:</p>
            <p>{question.answer || question.rationale}</p>
          </div>
        );
    }
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-0.5 bg-gradient-to-r from-blue-500 to-purple-600"></div>
      
      {/* Card content */}
      <div className="px-6 py-8">
        {/* Category Label */}
        <div className="flex justify-between items-center mb-4">
          <span className="px-3 py-1 inline-block bg-blue-100 text-blue-800 text-xs rounded-full">
            {question.category || 'Uncategorized'}
          </span>
          {showStats && (
            <span className="text-xs text-gray-500">
              Reviews: {flashcardMetadata.repetitions} | 
              Interval: {flashcardMetadata.interval} days
            </span>
          )}
        </div>
        
        {/* Card Title */}
        <h3 className="font-bold text-xl text-[#13294B] mb-4">{question.title}</h3>
        
        {/* Flashcard Side */}
        <div className="min-h-[12rem] flex items-center justify-center">
          <div className="w-full">
            {flipped ? renderBackContent() : renderFrontContent()}
          </div>
        </div>
        
        {/* Card Actions */}
        <div className="mt-6">
          {!flipped ? (
            <div className="flex justify-center">
              <Button
                onClick={handleFlip}
                className="bg-[#4B9CD3] hover:bg-[#13294B] text-white py-2 px-8 rounded-md transition-colors"
              >
                Show Answer
              </Button>
            </div>
          ) : !responseRecorded ? (
            <div className="space-y-4">
              <p className="text-center font-medium mb-2">How well did you know this?</p>
              {loading ? (
                <div className="flex justify-center py-4">
                  <MedicalSpinner type="cardiogram" size="sm" />
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    onClick={() => recordPerformance(1)}
                    className="bg-red-100 hover:bg-red-200 text-red-800 border border-red-300"
                  >
                    Didn't know
                  </Button>
                  <Button 
                    onClick={() => recordPerformance(3)}
                    className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border border-yellow-300"
                  >
                    Partially knew
                  </Button>
                  <Button 
                    onClick={() => recordPerformance(5)}
                    className="bg-green-100 hover:bg-green-200 text-green-800 border border-green-300"
                  >
                    Knew it!
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-center">
              <Button
                onClick={onNext}
                className="bg-[#4B9CD3] hover:bg-[#13294B] text-white py-2 px-8 rounded-md transition-colors"
              >
                Next Card
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
