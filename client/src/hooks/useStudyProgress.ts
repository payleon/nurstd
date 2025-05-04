import { useState, useEffect } from 'react';

// Define confidence levels
export type ConfidenceLevel = 1 | 2 | 3; // 1 = Low, 2 = Medium, 3 = High

// Define study area structure
export interface StudyArea {
  confidenceLevel: ConfidenceLevel;
  strengthScore: number; // 0-100
  lastUpdated: Date;
  recentActivity: {
    correct: number;
    incorrect: number;
    totalAnswered: number;
  };
}

// Default study areas to track
const DEFAULT_STUDY_AREAS: Record<string, StudyArea> = {
  'fundamentals': {
    confidenceLevel: 2,
    strengthScore: 65,
    lastUpdated: new Date(),
    recentActivity: {
      correct: 0,
      incorrect: 0,
      totalAnswered: 0
    }
  },
  'pharmacology': {
    confidenceLevel: 2,
    strengthScore: 60,
    lastUpdated: new Date(),
    recentActivity: {
      correct: 0,
      incorrect: 0,
      totalAnswered: 0
    }
  },
  'med-surg': {
    confidenceLevel: 2,
    strengthScore: 70,
    lastUpdated: new Date(),
    recentActivity: {
      correct: 0,
      incorrect: 0,
      totalAnswered: 0
    }
  },
  'pediatrics': {
    confidenceLevel: 2,
    strengthScore: 60,
    lastUpdated: new Date(),
    recentActivity: {
      correct: 0,
      incorrect: 0,
      totalAnswered: 0
    }
  },
  'obstetrics': {
    confidenceLevel: 2,
    strengthScore: 55,
    lastUpdated: new Date(),
    recentActivity: {
      correct: 0,
      incorrect: 0,
      totalAnswered: 0
    }
  },
  'psychiatric': {
    confidenceLevel: 2,
    strengthScore: 65,
    lastUpdated: new Date(),
    recentActivity: {
      correct: 0,
      incorrect: 0,
      totalAnswered: 0
    }
  },
  'prioritization': {
    confidenceLevel: 2,
    strengthScore: 60,
    lastUpdated: new Date(),
    recentActivity: {
      correct: 0,
      incorrect: 0,
      totalAnswered: 0
    }
  },
  'leadership': {
    confidenceLevel: 2,
    strengthScore: 50,
    lastUpdated: new Date(),
    recentActivity: {
      correct: 0,
      incorrect: 0,
      totalAnswered: 0
    }
  }
};

export function useStudyProgress() {
  const [studyAreas, setStudyAreas] = useState<Record<string, StudyArea>>(DEFAULT_STUDY_AREAS);

  // Load study progress from localStorage on initial render
  useEffect(() => {
    const storedProgress = localStorage.getItem('studyProgress');
    if (storedProgress) {
      try {
        const parsedProgress = JSON.parse(storedProgress);
        
        // Convert string dates back to Date objects
        Object.values(parsedProgress).forEach((area: StudyArea) => {
          area.lastUpdated = new Date(area.lastUpdated);
        });
        
        setStudyAreas(parsedProgress);
      } catch (error) {
        console.error('Error parsing stored study progress:', error);
      }
    }
  }, []);

  // Update a specific study area's confidence level
  const updateConfidence = (area: string, confidenceLevel: ConfidenceLevel) => {
    if (!studyAreas[area]) return;
    
    setStudyAreas(prev => {
      const updated = {
        ...prev,
        [area]: {
          ...prev[area],
          confidenceLevel,
          lastUpdated: new Date()
        }
      };
      
      // Save to localStorage
      localStorage.setItem('studyProgress', JSON.stringify(updated));
      
      return updated;
    });
  };

  // Update a study area based on question results
  const updateStudyAreaProgress = (
    area: string, 
    correct: boolean, 
    totalQuestions: number = 1
  ) => {
    if (!studyAreas[area]) return;
    
    setStudyAreas(prev => {
      // Calculate new recent activity stats
      const recentActivity = {
        correct: prev[area].recentActivity.correct + (correct ? 1 : 0),
        incorrect: prev[area].recentActivity.incorrect + (correct ? 0 : 1),
        totalAnswered: prev[area].recentActivity.totalAnswered + 1
      };
      
      // Adjust strength score based on performance
      // Correct answers increase score, incorrect answers decrease it
      const scoreAdjustment = correct ? (5 / totalQuestions) : (-3 / totalQuestions);
      let newStrengthScore = prev[area].strengthScore + scoreAdjustment;
      
      // Keep score within bounds
      newStrengthScore = Math.max(0, Math.min(100, newStrengthScore));
      
      // Determine confidence level based on strength score
      let confidenceLevel = prev[area].confidenceLevel;
      
      // Only update confidence if there's significant activity (5+ questions)
      if (recentActivity.totalAnswered >= 5) {
        if (newStrengthScore < 40) {
          confidenceLevel = 1;
        } else if (newStrengthScore > 75) {
          confidenceLevel = 3;
        } else {
          confidenceLevel = 2;
        }
      }
      
      const updated = {
        ...prev,
        [area]: {
          ...prev[area],
          strengthScore: newStrengthScore,
          confidenceLevel,
          lastUpdated: new Date(),
          recentActivity
        }
      };
      
      // Save to localStorage
      localStorage.setItem('studyProgress', JSON.stringify(updated));
      
      return updated;
    });
  };

  // Identify weak areas that need focus
  const getWeakAreas = (): string[] => {
    return Object.entries(studyAreas)
      .filter(([_, area]) => area.confidenceLevel === 1)
      .map(([name]) => name);
  };

  // Identify strong areas
  const getStrongAreas = (): string[] => {
    return Object.entries(studyAreas)
      .filter(([_, area]) => area.confidenceLevel === 3)
      .map(([name]) => name);
  };

  // Reset recent activity for all areas
  const resetRecentActivity = () => {
    setStudyAreas(prev => {
      const updated = { ...prev };
      
      Object.keys(updated).forEach(area => {
        updated[area] = {
          ...updated[area],
          recentActivity: {
            correct: 0,
            incorrect: 0,
            totalAnswered: 0
          },
          lastUpdated: new Date()
        };
      });
      
      // Save to localStorage
      localStorage.setItem('studyProgress', JSON.stringify(updated));
      
      return updated;
    });
  };

  return {
    studyAreas,
    updateConfidence,
    updateStudyAreaProgress,
    getWeakAreas,
    getStrongAreas,
    resetRecentActivity
  };
}