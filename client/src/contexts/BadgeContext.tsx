import React, { createContext, useContext, useState } from 'react';
import { Question } from '@shared/schema';

interface Badge {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  progress: number;
  maxProgress: number;
  category: string;
  icon: string;
}

interface BadgeContextType {
  badges: Badge[];
  earnedBadges: Badge[];
  updateAfterQuestionAnswered: (
    question: Question, 
    isCorrect: boolean, 
    timeSpentMinutes: number,
    isFlagged: boolean
  ) => void;
  updateAfterTestCompleted: (
    score: number, 
    totalQuestions: number, 
    category?: string
  ) => void;
}

const defaultBadges: Badge[] = [
  {
    id: 'first_correct',
    name: 'First Step',
    description: 'Answer your first question correctly',
    earned: false,
    progress: 0,
    maxProgress: 1,
    category: 'general',
    icon: 'award'
  },
  {
    id: 'streak_3',
    name: 'On Fire',
    description: 'Answer 3 questions correctly in a row',
    earned: false,
    progress: 0,
    maxProgress: 3,
    category: 'achievement',
    icon: 'flame'
  },
  {
    id: 'mastery_medical',
    name: 'Medical Expert',
    description: 'Get 80% or higher on a medical-surgical exam',
    earned: false,
    progress: 0,
    maxProgress: 1,
    category: 'specialty',
    icon: 'stethoscope'
  }
];

const BadgeContext = createContext<BadgeContextType | undefined>(undefined);

export function BadgeProvider({ children }: { children: React.ReactNode }) {
  const [badges, setBadges] = useState<Badge[]>(defaultBadges);
  
  // Get only earned badges
  const earnedBadges = badges.filter(badge => badge.earned);
  
  // Update badges after answering a question
  const updateAfterQuestionAnswered = (
    question: Question, 
    isCorrect: boolean, 
    timeSpentMinutes: number,
    isFlagged: boolean
  ) => {
    setBadges(prevBadges => {
      const newBadges = [...prevBadges];
      
      // First correct answer badge
      const firstCorrectBadge = newBadges.find(b => b.id === 'first_correct');
      if (firstCorrectBadge && !firstCorrectBadge.earned && isCorrect) {
        firstCorrectBadge.progress = 1;
        firstCorrectBadge.earned = true;
      }
      
      // Handle other badge progress updates based on the question and performance
      
      return newBadges;
    });
  };
  
  // Update badges after completing a test
  const updateAfterTestCompleted = (
    score: number, 
    totalQuestions: number, 
    category?: string
  ) => {
    const percentage = (score / totalQuestions) * 100;
    
    setBadges(prevBadges => {
      const newBadges = [...prevBadges];
      
      // Medical Expert badge
      if (category === 'Medical-Surgical' && percentage >= 80) {
        const medicalExpertBadge = newBadges.find(b => b.id === 'mastery_medical');
        if (medicalExpertBadge && !medicalExpertBadge.earned) {
          medicalExpertBadge.progress = 1;
          medicalExpertBadge.earned = true;
        }
      }
      
      // Handle other badge updates based on the completed test
      
      return newBadges;
    });
  };
  
  return (
    <BadgeContext.Provider value={{ 
      badges, 
      earnedBadges, 
      updateAfterQuestionAnswered, 
      updateAfterTestCompleted 
    }}>
      {children}
    </BadgeContext.Provider>
  );
}

export function useBadges() {
  const context = useContext(BadgeContext);
  if (context === undefined) {
    throw new Error('useBadges must be used within a BadgeProvider');
  }
  return context;
}