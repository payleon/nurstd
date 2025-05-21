import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Check, 
  X, 
  ThumbsUp, 
  Brain,
  BookOpen,
  Clock,
  Star 
} from "lucide-react";
import { 
  Flashcard, 
  NURSING_FLASHCARDS, 
  calculateNextReviewDate 
} from "@/data/flashcards";
import { Badge } from "@/components/ui/badge";

interface FlashcardReviewProps {
  initialCards?: Flashcard[];
  onComplete?: (results: { 
    totalReviewed: number; 
    easyCount: number; 
    mediumCount: number; 
    hardCount: number; 
    reviewedCards: Flashcard[] 
  }) => void;
  maxCards?: number;
  categoryFilter?: string;
  difficultyFilter?: 'easy' | 'medium' | 'hard' | 'all';
}

export function FlashcardReview({
  initialCards = NURSING_FLASHCARDS,
  onComplete,
  maxCards = 20,
  categoryFilter = 'all',
  difficultyFilter = 'all'
}: FlashcardReviewProps) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCards, setReviewedCards] = useState<Flashcard[]>([]);
  const [easyCount, setEasyCount] = useState(0);
  const [mediumCount, setMediumCount] = useState(0);
  const [hardCount, setHardCount] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  
  // Initialize the cards for review
  useEffect(() => {
    let filteredCards = [...initialCards];
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      filteredCards = filteredCards.filter(card => card.category === categoryFilter);
    }
    
    // Apply difficulty filter
    if (difficultyFilter !== 'all') {
      filteredCards = filteredCards.filter(card => card.difficulty === difficultyFilter);
    }
    
    // Sort by repetition level & due date
    filteredCards.sort((a, b) => {
      // Prioritize cards with lower repetition levels
      if (a.repetitionLevel !== b.repetitionLevel) {
        return a.repetitionLevel - b.repetitionLevel;
      }
      
      // If the repetition level is the same, prioritize by next review date
      const aDate = a.nextReviewDate ? new Date(a.nextReviewDate) : new Date(0);
      const bDate = b.nextReviewDate ? new Date(b.nextReviewDate) : new Date(0);
      return aDate.getTime() - bDate.getTime();
    });
    
    // Limit to maximum number of cards
    filteredCards = filteredCards.slice(0, maxCards);
    
    // Shuffle to make review more varied
    filteredCards = shuffleArray(filteredCards);
    
    setCards(filteredCards);
  }, [initialCards, categoryFilter, difficultyFilter, maxCards]);
  
  // Shuffle array function
  const shuffleArray = (array: any[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  // Current card or null if review complete
  const currentCard = cards.length > 0 && currentCardIndex < cards.length 
    ? cards[currentCardIndex] 
    : null;
  
  // Flip the card
  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };
  
  // Navigate to previous card if available
  const goToPrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };
  
  // Navigate to next card if available
  const goToNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };
  
  // Handle user rating of card difficulty
  const rateCard = (rating: 'easy' | 'medium' | 'hard') => {
    if (!currentCard) return;
    
    // Update repetition level based on rating
    let newRepetitionLevel = currentCard.repetitionLevel;
    
    switch (rating) {
      case 'easy':
        // Knew it well - increase level (max 5)
        newRepetitionLevel = Math.min(currentCard.repetitionLevel + 1, 5);
        setEasyCount(prev => prev + 1);
        break;
      case 'medium':
        // Hesitated but knew it - keep same level or slight increase if low
        if (currentCard.repetitionLevel < 2) {
          newRepetitionLevel = currentCard.repetitionLevel + 1;
        }
        setMediumCount(prev => prev + 1);
        break;
      case 'hard':
        // Didn't know it - reset to level 0
        newRepetitionLevel = 0;
        setHardCount(prev => prev + 1);
        break;
    }
    
    // Update the card with new repetition level and next review date
    const updatedCard: Flashcard = {
      ...currentCard,
      repetitionLevel: newRepetitionLevel,
      lastReviewed: new Date(),
      nextReviewDate: calculateNextReviewDate(newRepetitionLevel)
    };
    
    // Save the updated card
    setReviewedCards([...reviewedCards, updatedCard]);
    
    // Go to next card or end session
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    } else {
      setSessionComplete(true);
      
      // Call onComplete callback with results
      if (onComplete) {
        onComplete({
          totalReviewed: reviewedCards.length + 1, // +1 for current card
          easyCount: easyCount + (rating === 'easy' ? 1 : 0),
          mediumCount: mediumCount + (rating === 'medium' ? 1 : 0),
          hardCount: hardCount + (rating === 'hard' ? 1 : 0),
          reviewedCards: [...reviewedCards, updatedCard]
        });
      }
    }
  };
  
  // Restart the session
  const restartSession = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setReviewedCards([]);
    setEasyCount(0);
    setMediumCount(0);
    setHardCount(0);
    setSessionComplete(false);
  };
  
  // Change category filter
  const changeCategory = (category: string) => {
    // This would be implemented in a parent component
    console.log("Change category to:", category);
  };
  
  if (sessionComplete) {
    return (
      <div className="flex flex-col items-center justify-center p-4 max-w-xl mx-auto">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg shadow-md w-full">
          <h2 className="text-2xl font-bold text-center mb-6 text-blue-800">
            Review Session Complete!
          </h2>
          
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span>Total Cards Reviewed</span>
              <span className="font-bold">{reviewedCards.length}</span>
            </div>
            <Progress value={100} className="h-2 mb-6" />
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-100 p-3 rounded-lg text-center">
                <ThumbsUp className="h-5 w-5 text-green-600 mx-auto mb-1" />
                <div className="text-sm text-gray-600">Easy</div>
                <div className="font-bold text-xl">{easyCount}</div>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg text-center">
                <Brain className="h-5 w-5 text-yellow-600 mx-auto mb-1" />
                <div className="text-sm text-gray-600">Medium</div>
                <div className="font-bold text-xl">{mediumCount}</div>
              </div>
              <div className="bg-red-100 p-3 rounded-lg text-center">
                <RotateCcw className="h-5 w-5 text-red-600 mx-auto mb-1" />
                <div className="text-sm text-gray-600">Hard</div>
                <div className="font-bold text-xl">{hardCount}</div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={restartSession} className="flex items-center">
              <RotateCcw className="h-4 w-4 mr-2" />
              Review Again
            </Button>
            <Button variant="outline" className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              Change Category
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  if (!currentCard) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-medium mb-4">No Flashcards Available</h2>
          <p className="text-gray-600 mb-4">
            There are no flashcards available for review with the current filters.
          </p>
          <Button onClick={() => changeCategory('all')}>
            View All Categories
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="mb-6 w-full max-w-xl">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Quick Review</h2>
          <div className="text-sm text-gray-600">
            {currentCardIndex + 1} of {cards.length}
          </div>
        </div>
        
        <Progress 
          value={(currentCardIndex / cards.length) * 100} 
          className="h-2"
        />
      </div>
      
      <div className="w-full max-w-xl perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCardIndex + (isFlipped ? "-flipped" : "")}
            initial={{ opacity: 0, rotateY: isFlipped ? -180 : 0 }}
            animate={{ opacity: 1, rotateY: isFlipped ? -180 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full preserve-3d"
          >
            <Card 
              className={`w-full h-72 shadow-lg cursor-pointer relative ${
                isFlipped ? "rotate-y-180" : ""
              } transform-style-3d transition-transform duration-500`}
              onClick={flipCard}
            >
              {/* Front side (Question) */}
              <div className={`absolute w-full h-full backface-hidden ${
                isFlipped ? "hidden" : "block"
              }`}>
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {currentCard.category}
                    </Badge>
                    <Badge className={
                      currentCard.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                      currentCard.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }>
                      {currentCard.difficulty}
                    </Badge>
                  </div>
                  
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-lg text-center">{currentCard.question}</p>
                  </div>
                  
                  <div className="text-center text-sm text-gray-500 mt-4">
                    Tap to reveal answer
                  </div>
                </CardContent>
              </div>
              
              {/* Back side (Answer) */}
              <div className={`absolute w-full h-full backface-hidden rotate-y-180 ${
                isFlipped ? "block" : "hidden"
              }`}>
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Answer
                    </Badge>
                  </div>
                  
                  <div className="flex-1 flex items-center justify-center overflow-auto">
                    <p className="text-center">{currentCard.answer}</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                      onClick={() => rateCard('hard')}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Hard
                    </Button>
                    <Button 
                      variant="outline" 
                      className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-200"
                      onClick={() => rateCard('medium')}
                    >
                      <Brain className="h-4 w-4 mr-1" />
                      Medium
                    </Button>
                    <Button 
                      variant="outline" 
                      className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                      onClick={() => rateCard('easy')}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Easy
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="flex justify-between w-full max-w-xl mt-4">
        <Button 
          variant="outline" 
          onClick={goToPrevCard}
          disabled={currentCardIndex === 0}
          className="flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        
        <div className="flex gap-1">
          {currentCard.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-gray-100">
              {tag}
            </Badge>
          ))}
          {currentCard.tags.length > 3 && (
            <Badge variant="outline" className="bg-gray-100">
              +{currentCard.tags.length - 3}
            </Badge>
          )}
        </div>
        
        <Button 
          variant="outline" 
          onClick={goToNextCard}
          disabled={currentCardIndex === cards.length - 1}
          className="flex items-center"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}