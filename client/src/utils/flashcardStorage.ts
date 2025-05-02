/**
 * Flashcard Storage Service
 * 
 * Handles persistence of flashcard data and review history to localStorage,
 * allowing the spaced repetition system to work across sessions.
 */

import { FlashcardMetadata, createFlashcard } from './spacedRepetition';
import { Question } from '@shared/schema';

// Storage keys
const FLASHCARDS_STORAGE_KEY = 'nursing-app-flashcards';
const FLASHCARD_STATS_KEY = 'nursing-app-flashcard-stats';

/**
 * Get all saved flashcards from localStorage
 */
export function getSavedFlashcards(): FlashcardMetadata[] {
  try {
    const flashcardsJson = localStorage.getItem(FLASHCARDS_STORAGE_KEY);
    if (!flashcardsJson) return [];
    
    const parsed = JSON.parse(flashcardsJson);
    
    // Convert date strings back to Date objects
    return parsed.map((card: any) => ({
      ...card,
      createdAt: card.createdAt ? new Date(card.createdAt) : new Date(),
      lastReviewedAt: card.lastReviewedAt ? new Date(card.lastReviewedAt) : undefined,
      nextReviewAt: card.nextReviewAt ? new Date(card.nextReviewAt) : undefined,
      history: card.history ? card.history.map((h: any) => ({
        ...h,
        reviewedAt: new Date(h.reviewedAt),
      })) : [],
    }));
  } catch (error) {
    console.error('Error retrieving flashcards from storage:', error);
    return [];
  }
}

/**
 * Save flashcards to localStorage
 */
export function saveFlashcards(flashcards: FlashcardMetadata[]): void {
  try {
    localStorage.setItem(FLASHCARDS_STORAGE_KEY, JSON.stringify(flashcards));
  } catch (error) {
    console.error('Error saving flashcards to storage:', error);
  }
}

/**
 * Add a new flashcard or update an existing one
 */
export function saveFlashcard(flashcard: FlashcardMetadata): void {
  const flashcards = getSavedFlashcards();
  const existingIndex = flashcards.findIndex(card => card.id === flashcard.id);
  
  if (existingIndex >= 0) {
    flashcards[existingIndex] = flashcard;
  } else {
    flashcards.push(flashcard);
  }
  
  saveFlashcards(flashcards);
}

/**
 * Delete a flashcard by ID
 */
export function deleteFlashcard(flashcardId: string): void {
  const flashcards = getSavedFlashcards().filter(card => card.id !== flashcardId);
  saveFlashcards(flashcards);
}

/**
 * Convert a question to a flashcard
 */
export function questionToFlashcard(question: Question): FlashcardMetadata {
  // Determine category from question properties
  const category = question.category || 'Uncategorized';
  
  // Determine difficulty based on question complexity
  let difficulty: 'easy' | 'medium' | 'hard' = 'medium';
  if (question.difficulty) {
    difficulty = question.difficulty as 'easy' | 'medium' | 'hard';
  } else if (question.type === 'hotspot' || question.type === 'ordered') {
    // More complex question types are typically harder
    difficulty = 'hard';
  }
  
  // Extract tags from the question if they exist
  const tags = question.tags || [];
  
  // Create the flashcard metadata
  return createFlashcard(
    question.id,
    category,
    difficulty,
    tags
  );
}

/**
 * Get flashcard statistics from localStorage
 */
export function getFlashcardStats() {
  try {
    const statsJson = localStorage.getItem(FLASHCARD_STATS_KEY);
    if (!statsJson) return {
      lastStudyDate: null,
      studyStreak: 0,
      totalReviewed: 0,
      studyDates: [],
    };
    
    const stats = JSON.parse(statsJson);
    return {
      ...stats,
      lastStudyDate: stats.lastStudyDate ? new Date(stats.lastStudyDate) : null,
      studyDates: stats.studyDates ? stats.studyDates.map((d: string) => new Date(d)) : [],
    };
  } catch (error) {
    console.error('Error retrieving flashcard stats from storage:', error);
    return {
      lastStudyDate: null,
      studyStreak: 0,
      totalReviewed: 0,
      studyDates: [],
    };
  }
}

/**
 * Update flashcard statistics after a study session
 * 
 * @param reviewedCount Number of flashcards reviewed in this session
 */
export function updateFlashcardStats(reviewedCount: number): void {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day for comparison
    
    const stats = getFlashcardStats();
    const lastStudyDate = stats.lastStudyDate;
    let studyStreak = stats.studyStreak;
    
    // Check if we need to update the streak
    if (lastStudyDate) {
      const normalizedLastDate = new Date(lastStudyDate);
      normalizedLastDate.setHours(0, 0, 0, 0);
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      // If last study date was yesterday, increase streak
      if (normalizedLastDate.getTime() === yesterday.getTime()) {
        studyStreak += 1;
      }
      // If it's today already, keep streak (but don't double count)
      else if (normalizedLastDate.getTime() === today.getTime()) {
        // Don't change streak but update count
      }
      // If more than a day passed, reset streak
      else {
        studyStreak = 1; // Start a new streak
      }
    } else {
      // First time studying
      studyStreak = 1;
    }
    
    // Update study dates array (keep only last 30 days for performance)
    const studyDates = [...stats.studyDates || [], today.toISOString()];
    if (studyDates.length > 30) {
      studyDates.shift(); // Remove oldest date
    }
    
    // Save updated stats
    const updatedStats = {
      lastStudyDate: today.toISOString(),
      studyStreak,
      totalReviewed: (stats.totalReviewed || 0) + reviewedCount,
      studyDates,
    };
    
    localStorage.setItem(FLASHCARD_STATS_KEY, JSON.stringify(updatedStats));
  } catch (error) {
    console.error('Error updating flashcard stats:', error);
  }
}
