/**
 * SpacedRepetitionDeck Component
 * 
 * A deck of flashcards managed using a spaced repetition algorithm,
 * allowing students to efficiently review nursing content.
 */

import { useState, useEffect } from 'react';
import { Question } from '@shared/schema';
import { 
  FlashcardMetadata, 
  getDueFlashcards, 
  calculateLearningProgress 
} from '../utils/spacedRepetition';
import { 
  getSavedFlashcards, 
  saveFlashcard, 
  updateFlashcardStats,
  questionToFlashcard 
} from '../utils/flashcardStorage';
import { fetchQuestions } from '../utils/api';
import { SpacedRepetitionCard } from './SpacedRepetitionCard';
import { Progress } from './ui/progress';
import { MedicalSpinner } from './ui/medical-spinner';
import { Button } from './ui/button';

interface SpacedRepetitionDeckProps {
  initialCategory?: string;
  limitCards?: number;
  onComplete?: () => void;
}

export function SpacedRepetitionDeck({
  initialCategory,
  limitCards = 10,
  onComplete
}: SpacedRepetitionDeckProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [allFlashcards, setAllFlashcards] = useState<FlashcardMetadata[]>([]);
  const [dueFlashcards, setDueFlashcards] = useState<FlashcardMetadata[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentMetadata, setCurrentMetadata] = useState<FlashcardMetadata | null>(null);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [learningProgress, setLearningProgress] = useState({
    masteryPercentage: 0,
    reviewedCount: 0,
    masteredCount: 0,
    dueCount: 0,
  });

  // Load questions and flashcards on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load questions from API
        const response = await fetchQuestions();
        let questions = response.questions || [];
        
        // Filter by category if specified
        if (initialCategory) {
          questions = questions.filter(
            q => q.category?.toLowerCase() === initialCategory.toLowerCase()
          );
        }
        
        setAllQuestions(questions);
        
        // Load flashcard metadata from storage
        let flashcards = getSavedFlashcards();
        
        // Filter by category if specified
        if (initialCategory) {
          flashcards = flashcards.filter(
            f => f.category.toLowerCase() === initialCategory.toLowerCase()
          );
        }
        
        // Get due flashcards using spaced repetition algorithm
        let due = getDueFlashcards(flashcards);
        
        // If we need more cards, create new ones from the question bank
        const existingQuestionIds = new Set(flashcards.map(f => f.questionId));
        const availableQuestions = questions.filter(q => !existingQuestionIds.has(q.id));
        
        // Only create new cards if we have fewer than the limit
        if (due.length < limitCards && availableQuestions.length > 0) {
          // Determine how many new cards to create (up to the limit)
          const newCardCount = Math.min(limitCards - due.length, availableQuestions.length);
          
          // Create new flashcards from questions
          const newQuestions = availableQuestions.slice(0, newCardCount);
          const newFlashcards = newQuestions.map(questionToFlashcard);
          
          // Add new flashcards to the collection
          flashcards = [...flashcards, ...newFlashcards];
          due = [...due, ...newFlashcards];
        }
        
        // Limit the number of flashcards for this study session
        due = due.slice(0, limitCards);
        
        // Update state
        setAllFlashcards(flashcards);
        setDueFlashcards(due);
        
        // Calculate learning progress
        const progress = calculateLearningProgress(flashcards);
        setLearningProgress(progress);
        
        // Set up the first card if available
        if (due.length > 0) {
          setCurrentMetadata(due[0]);
          const question = questions.find(q => q.id === due[0].questionId);
          if (question) {
            setCurrentQuestion(question);
          }
        }
      } catch (error) {
        console.error('Error loading flashcard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [initialCategory, limitCards]);
  
  // Handle flashcard review completion
  const handleReviewed = (updatedMetadata: FlashcardMetadata) => {
    // Update the flashcard in the collections
    const updatedAllFlashcards = allFlashcards.map(f => 
      f.id === updatedMetadata.id ? updatedMetadata : f
    );
    setAllFlashcards(updatedAllFlashcards);
    
    // Increment reviewed count
    setReviewedCount(prev => prev + 1);
    
    // Update progress percentage
    setProgress(Math.round(((activeIndex + 1) / dueFlashcards.length) * 100));
  };
  
  // Move to the next card
  const handleNext = () => {
    const nextIndex = activeIndex + 1;
    
    // Check if we've reached the end of the deck
    if (nextIndex >= dueFlashcards.length) {
      // Session complete
      setSessionCompleted(true);
      
      // Update study stats
      updateFlashcardStats(reviewedCount);
      
      // Recalculate learning progress
      const progress = calculateLearningProgress(allFlashcards);
      setLearningProgress(progress);
      
      if (onComplete) {
        onComplete();
      }
      return;
    }
    
    // Move to the next card
    setActiveIndex(nextIndex);
    setCurrentMetadata(dueFlashcards[nextIndex]);
    
    // Find the corresponding question
    const nextQuestionId = dueFlashcards[nextIndex].questionId;
    const question = allQuestions.find(q => q.id === nextQuestionId);
    if (question) {
      setCurrentQuestion(question);
    }
  };
  
  // Restart the session
  const handleRestartSession = async () => {
    try {
      setIsLoading(true);
      
      // Get fresh due cards
      const flashcards = getSavedFlashcards();
      let due = getDueFlashcards(flashcards);
      
      // Limit the number of flashcards for this study session
      due = due.slice(0, limitCards);
      
      // Reset state
      setDueFlashcards(due);
      setActiveIndex(0);
      setReviewedCount(0);
      setProgress(0);
      setSessionCompleted(false);
      
      // Set up the first card if available
      if (due.length > 0) {
        setCurrentMetadata(due[0]);
        const question = allQuestions.find(q => q.id === due[0].questionId);
        if (question) {
          setCurrentQuestion(question);
        }
      }
    } catch (error) {
      console.error('Error restarting session:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <MedicalSpinner type="nurse" size="lg" text="Preparing your personalized flashcards..." />
        <p className="text-gray-500 mt-4">
          Using spaced repetition to optimize your learning
        </p>
      </div>
    );
  }
  
  // No cards available
  if (dueFlashcards.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-[#13294B] mb-3">All caught up!</h3>
        <p className="text-gray-600 mb-6">
          You've reviewed all your due flashcards. Great job!
        </p>
        <Button 
          onClick={handleRestartSession}
          className="bg-[#4B9CD3] hover:bg-[#13294B] text-white"
        >
          Create New Flashcards
        </Button>
      </div>
    );
  }
  
  // Session completed
  if (sessionCompleted) {
    return (
      <div className="p-8 bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-[#13294B] mb-2">Session Complete!</h3>
          <p className="text-gray-600">
            You've reviewed {reviewedCount} cards. Here's your progress:
          </p>
        </div>
        
        <div className="space-y-6 max-w-md mx-auto">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Mastery Progress</span>
              <span>{learningProgress.masteryPercentage}%</span>
            </div>
            <Progress value={learningProgress.masteryPercentage} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Cards Mastered</p>
              <p className="text-2xl font-bold text-[#13294B]">
                {learningProgress.masteredCount}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Cards</p>
              <p className="text-2xl font-bold text-[#13294B]">
                {allFlashcards.length}
              </p>
            </div>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button 
              onClick={handleRestartSession}
              className="bg-[#4B9CD3] hover:bg-[#13294B] text-white"
            >
              Start Next Session
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Regular session view
  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="px-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Progress</span>
          <span>{activeIndex + 1} of {dueFlashcards.length}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      {/* Current Flashcard */}
      {currentQuestion && currentMetadata && (
        <SpacedRepetitionCard
          question={currentQuestion}
          flashcardMetadata={currentMetadata}
          onReviewed={handleReviewed}
          onNext={handleNext}
          showStats={true}
        />
      )}
    </div>
  );
}
