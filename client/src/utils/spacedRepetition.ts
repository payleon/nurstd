/**
 * Spaced Repetition System for Nursing Education Flashcards
 * 
 * This implements a modified SuperMemo-2 algorithm for optimal flashcard scheduling
 * based on the learner's performance and recall capability.
 */

export type FlashcardDifficulty = 'easy' | 'medium' | 'hard';

export interface FlashcardReviewHistory {
  id: string;
  reviewedAt: Date;
  performance: number; // 0-5 scale where 0 is complete failure and 5 is perfect recall
  timeToAnswer: number; // Time in seconds it took to answer
}

export interface FlashcardMetadata {
  id: string;
  questionId: number; // Reference to the main question database
  createdAt: Date;
  lastReviewedAt?: Date;
  nextReviewAt?: Date;
  easinessFactor: number; // SM-2 algorithm parameter, starts at 2.5
  interval: number; // Current interval in days
  repetitions: number; // Number of times reviewed
  history: FlashcardReviewHistory[];
  category: string;
  subcategory?: string;
  difficulty: FlashcardDifficulty;
  tags: string[];
}

/**
 * Calculate the next review date based on SM-2 algorithm
 * 
 * @param metadata Current flashcard metadata
 * @param performance User's performance rating (0-5)
 * @returns Updated flashcard metadata
 */
export function scheduleNextReview(metadata: FlashcardMetadata, performance: number): FlashcardMetadata {
  // Clone the metadata to avoid mutating the original
  const updated = { ...metadata };
  const now = new Date();
  
  // Add review history
  const reviewHistory: FlashcardReviewHistory = {
    id: `review-${Date.now()}`,
    reviewedAt: now,
    performance,
    timeToAnswer: 0, // This would be populated from the UI
  };
  
  updated.history = [...(updated.history || []), reviewHistory];
  updated.lastReviewedAt = now;
  
  // If performance is less than 3, reset repetitions to 0 (failed recall)
  if (performance < 3) {
    updated.repetitions = 0;
    // Schedule for review sooner based on difficulty
    const daysDelay = performance === 0 ? 0 : performance === 1 ? 1 : 2;
    updated.nextReviewAt = new Date(now.getTime() + daysDelay * 24 * 60 * 60 * 1000);
    // Slightly decrease the easiness factor
    updated.easinessFactor = Math.max(1.3, updated.easinessFactor - 0.2);
    return updated;
  }
  
  // Update easiness factor using SM-2 formula
  const newEF = updated.easinessFactor + (0.1 - (5 - performance) * (0.08 + (5 - performance) * 0.02));
  updated.easinessFactor = Math.max(1.3, newEF); // EF shouldn't go below 1.3
  
  // Increment repetitions
  updated.repetitions += 1;
  
  // Calculate new interval
  let newInterval: number;
  if (updated.repetitions === 1) {
    newInterval = 1; // First successful review: 1 day
  } else if (updated.repetitions === 2) {
    newInterval = 6; // Second successful review: 6 days
  } else {
    // Subsequent reviews: previous interval * EF
    newInterval = Math.round(updated.interval * updated.easinessFactor);
  }
  
  // Adjust interval based on card difficulty
  if (updated.difficulty === 'hard') {
    newInterval = Math.max(1, Math.floor(newInterval * 0.8));
  } else if (updated.difficulty === 'easy') {
    newInterval = Math.ceil(newInterval * 1.2);
  }
  
  updated.interval = newInterval;
  updated.nextReviewAt = new Date(now.getTime() + newInterval * 24 * 60 * 60 * 1000);
  
  return updated;
}

/**
 * Get due flashcards that should be reviewed now
 * 
 * @param flashcards Array of all flashcards
 * @returns Array of flashcards that are due for review
 */
export function getDueFlashcards(flashcards: FlashcardMetadata[]): FlashcardMetadata[] {
  const now = new Date();
  return flashcards.filter(card => {
    // Include cards that have never been reviewed
    if (!card.nextReviewAt) return true;
    // Include cards that are due for review
    return card.nextReviewAt <= now;
  });
}

/**
 * Create a new flashcard with default metadata
 * 
 * @param questionId ID of the question
 * @param category Category of the flashcard
 * @param difficulty Difficulty level
 * @param tags Optional tags
 * @returns New flashcard metadata
 */
export function createFlashcard(
  questionId: number, 
  category: string,
  difficulty: FlashcardDifficulty = 'medium',
  tags: string[] = []
): FlashcardMetadata {
  return {
    id: `card-${Date.now()}-${questionId}`,
    questionId,
    createdAt: new Date(),
    easinessFactor: 2.5, // Default easiness factor
    interval: 0,
    repetitions: 0,
    history: [],
    category,
    difficulty,
    tags,
  };
}

/**
 * Calculate the learning progress for a set of flashcards
 * 
 * @param flashcards Array of flashcards to analyze
 * @returns Object with progress statistics
 */
export function calculateLearningProgress(flashcards: FlashcardMetadata[]) {
  const totalCards = flashcards.length;
  if (totalCards === 0) {
    return {
      masteryPercentage: 0,
      reviewedCount: 0,
      masteredCount: 0,
      dueCount: 0,
      averageEasinessFactor: 2.5,
    };
  }
  
  // Calculate statistics
  const reviewedCards = flashcards.filter(card => card.repetitions > 0);
  const reviewedCount = reviewedCards.length;
  
  // Consider a card "mastered" if it has been reviewed at least 3 times
  // and has an interval of at least 14 days
  const masteredCards = flashcards.filter(
    card => card.repetitions >= 3 && card.interval >= 14
  );
  const masteredCount = masteredCards.length;
  
  const dueCards = getDueFlashcards(flashcards);
  const dueCount = dueCards.length;
  
  // Calculate average easiness factor for reviewed cards
  const totalEF = reviewedCards.reduce(
    (sum, card) => sum + card.easinessFactor,
    0
  );
  const averageEasinessFactor = reviewedCount > 0 
    ? totalEF / reviewedCount 
    : 2.5;
  
  // Calculate overall mastery percentage
  const masteryPercentage = Math.round((masteredCount / totalCards) * 100);
  
  return {
    masteryPercentage,
    reviewedCount,
    masteredCount,
    dueCount,
    averageEasinessFactor,
  };
}
