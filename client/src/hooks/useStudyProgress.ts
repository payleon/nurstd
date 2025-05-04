import { useState, useEffect } from 'react';

interface StudyArea {
  name: string;
  confidenceLevel: number;
  questionsAttempted: number;
  questionsCorrect: number;
  recommendedFocus: boolean;
}

interface StudyProgress {
  studyAreas: Record<string, StudyArea>;
  lastActivity: string;
  updateConfidence: (area: string, level: number) => void;
  updateQuestionStats: (area: string, isCorrect: boolean) => void;
  toggleRecommendedFocus: (area: string) => void;
}

// Define study areas
const DEFAULT_AREAS = [
  'Med-Surg',
  'Pediatrics',
  'OB/Maternal',
  'Psychiatric',
  'Pharmacology',
  'Fundamentals',
  'Leadership'
];

// Get initial state from localStorage or use defaults
function getInitialState(): { 
  studyAreas: Record<string, StudyArea>, 
  lastActivity: string 
} {
  // Check if localStorage is available
  if (typeof window === 'undefined' || !window.localStorage) {
    return createDefaultState();
  }
  
  try {
    const stored = localStorage.getItem('nclexStudyProgress');
    
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
  }
  
  return createDefaultState();
}

// Create default state
function createDefaultState(): { 
  studyAreas: Record<string, StudyArea>, 
  lastActivity: string 
} {
  const studyAreas: Record<string, StudyArea> = {};
  
  DEFAULT_AREAS.forEach(area => {
    studyAreas[area] = {
      name: area,
      confidenceLevel: 2, // Medium confidence by default
      questionsAttempted: 0,
      questionsCorrect: 0,
      recommendedFocus: false
    };
  });
  
  return {
    studyAreas,
    lastActivity: new Date().toISOString()
  };
}

export function useStudyProgress(): StudyProgress {
  const [studyState, setStudyState] = useState<{
    studyAreas: Record<string, StudyArea>;
    lastActivity: string;
  }>(getInitialState);
  
  // Persist state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nclexStudyProgress', JSON.stringify(studyState));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [studyState]);
  
  // Update confidence level for a study area
  const updateConfidence = (area: string, level: number) => {
    setStudyState(prev => {
      // If area doesn't exist, create it
      if (!prev.studyAreas[area]) {
        prev.studyAreas[area] = {
          name: area,
          confidenceLevel: 2,
          questionsAttempted: 0,
          questionsCorrect: 0,
          recommendedFocus: false
        };
      }
      
      // Create a new object to trigger state update
      const newStudyAreas = {
        ...prev.studyAreas,
        [area]: {
          ...prev.studyAreas[area],
          confidenceLevel: level,
          // Automatically set as recommended focus if confidence is low
          recommendedFocus: level === 1 ? true : prev.studyAreas[area].recommendedFocus
        }
      };
      
      return {
        studyAreas: newStudyAreas,
        lastActivity: new Date().toISOString()
      };
    });
  };
  
  // Update question stats for a study area
  const updateQuestionStats = (area: string, isCorrect: boolean) => {
    setStudyState(prev => {
      // If area doesn't exist, create it
      if (!prev.studyAreas[area]) {
        prev.studyAreas[area] = {
          name: area,
          confidenceLevel: 2,
          questionsAttempted: 0,
          questionsCorrect: 0,
          recommendedFocus: false
        };
      }
      
      const currentArea = prev.studyAreas[area];
      const newQuestionStats = {
        questionsAttempted: currentArea.questionsAttempted + 1,
        questionsCorrect: isCorrect 
          ? currentArea.questionsCorrect + 1 
          : currentArea.questionsCorrect
      };
      
      // Calculate correct rate
      const correctRate = newQuestionStats.questionsCorrect / newQuestionStats.questionsAttempted;
      
      // Automatically update confidence based on performance
      let newConfidence = currentArea.confidenceLevel;
      if (newQuestionStats.questionsAttempted >= 10) {
        if (correctRate >= 0.8) {
          newConfidence = 3; // High confidence
        } else if (correctRate <= 0.5) {
          newConfidence = 1; // Low confidence
        } else {
          newConfidence = 2; // Medium confidence
        }
      }
      
      // Create a new object to trigger state update
      const newStudyAreas = {
        ...prev.studyAreas,
        [area]: {
          ...prev.studyAreas[area],
          ...newQuestionStats,
          confidenceLevel: newConfidence,
          // Automatically set as recommended focus if correct rate is low
          recommendedFocus: correctRate <= 0.5 ? true : prev.studyAreas[area].recommendedFocus
        }
      };
      
      return {
        studyAreas: newStudyAreas,
        lastActivity: new Date().toISOString()
      };
    });
  };
  
  // Toggle recommended focus for a study area
  const toggleRecommendedFocus = (area: string) => {
    setStudyState(prev => {
      if (!prev.studyAreas[area]) return prev;
      
      const newStudyAreas = {
        ...prev.studyAreas,
        [area]: {
          ...prev.studyAreas[area],
          recommendedFocus: !prev.studyAreas[area].recommendedFocus
        }
      };
      
      return {
        studyAreas: newStudyAreas,
        lastActivity: new Date().toISOString()
      };
    });
  };
  
  return {
    studyAreas: studyState.studyAreas,
    lastActivity: studyState.lastActivity,
    updateConfidence,
    updateQuestionStats,
    toggleRecommendedFocus
  };
}