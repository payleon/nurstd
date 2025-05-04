import { useState, useEffect } from 'react';

interface StudyArea {
  name: string;
  confidenceLevel: number; // 1-3 scale
  questionsAttempted: number;
  questionsCorrect: number;
  recommendedFocus: boolean;
}

interface StudyRecommendation {
  type: 'content' | 'strategy' | 'resource';
  title: string;
  description: string;
  priority: 1 | 2 | 3; // 1-3 with 3 being highest
  completed: boolean;
}

interface StudyProgressState {
  studyAreas: Record<string, StudyArea>;
  recommendations: StudyRecommendation[];
  lastActivity: string;
}

// Default study areas to track
const DEFAULT_STUDY_AREAS = {
  'med-surg': {
    name: 'Medical-Surgical Nursing',
    confidenceLevel: 2,
    questionsAttempted: 0,
    questionsCorrect: 0,
    recommendedFocus: false
  },
  'pharmacology': {
    name: 'Pharmacology',
    confidenceLevel: 1,
    questionsAttempted: 0,
    questionsCorrect: 0,
    recommendedFocus: true
  },
  'prioritization': {
    name: 'Prioritization & Delegation',
    confidenceLevel: 2,
    questionsAttempted: 0,
    questionsCorrect: 0,
    recommendedFocus: false
  },
  'mental-health': {
    name: 'Mental Health Nursing',
    confidenceLevel: 2,
    questionsAttempted: 0,
    questionsCorrect: 0,
    recommendedFocus: false
  },
  'maternal-newborn': {
    name: 'Maternal-Newborn Nursing',
    confidenceLevel: 1,
    questionsAttempted: 0,
    questionsCorrect: 0,
    recommendedFocus: true
  },
  'pediatrics': {
    name: 'Pediatric Nursing',
    confidenceLevel: 2,
    questionsAttempted: 0,
    questionsCorrect: 0,
    recommendedFocus: false
  }
};

// Default initial recommendations
const DEFAULT_RECOMMENDATIONS: StudyRecommendation[] = [
  {
    type: 'content',
    title: 'Focus on Pharmacology',
    description: 'Practice medication calculations and drug classifications.',
    priority: 3,
    completed: false
  },
  {
    type: 'strategy',
    title: 'Use ADPIE Framework',
    description: 'Apply the nursing process to all practice questions.',
    priority: 2,
    completed: false
  },
  {
    type: 'resource',
    title: 'Review Maternal-Newborn Concepts',
    description: 'Study the maternal-newborn nursing content areas.',
    priority: 3,
    completed: false
  }
];

export function useStudyProgress() {
  const [studyProgress, setStudyProgress] = useState<StudyProgressState>(() => {
    // Try to load from localStorage
    const savedProgress = localStorage.getItem('nclexStudyProgress');
    if (savedProgress) {
      try {
        return JSON.parse(savedProgress);
      } catch (e) {
        console.error('Error parsing saved study progress', e);
      }
    }
    
    // Return default state if no saved progress
    return {
      studyAreas: DEFAULT_STUDY_AREAS,
      recommendations: DEFAULT_RECOMMENDATIONS,
      lastActivity: new Date().toISOString()
    };
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('nclexStudyProgress', JSON.stringify(studyProgress));
  }, [studyProgress]);

  // Update a study area's confidence level
  const updateConfidenceLevel = (areaKey: string, level: number) => {
    if (level < 1 || level > 3) {
      console.error('Confidence level must be between 1 and 3');
      return;
    }

    setStudyProgress(prev => {
      // If area doesn't exist, add it
      if (!prev.studyAreas[areaKey]) {
        return {
          ...prev,
          studyAreas: {
            ...prev.studyAreas,
            [areaKey]: {
              name: areaKey,
              confidenceLevel: level,
              questionsAttempted: 0,
              questionsCorrect: 0,
              recommendedFocus: false
            }
          },
          lastActivity: new Date().toISOString()
        };
      }

      // Update existing area
      return {
        ...prev,
        studyAreas: {
          ...prev.studyAreas,
          [areaKey]: {
            ...prev.studyAreas[areaKey],
            confidenceLevel: level
          }
        },
        lastActivity: new Date().toISOString()
      };
    });

    // Generate new recommendations based on confidence updates
    updateRecommendations(areaKey, level);
  };

  // Record question attempts and correct answers
  const recordQuestionResult = (areaKey: string, isCorrect: boolean) => {
    setStudyProgress(prev => {
      if (!prev.studyAreas[areaKey]) {
        return {
          ...prev,
          studyAreas: {
            ...prev.studyAreas,
            [areaKey]: {
              name: areaKey,
              confidenceLevel: 2,
              questionsAttempted: 1,
              questionsCorrect: isCorrect ? 1 : 0,
              recommendedFocus: false
            }
          },
          lastActivity: new Date().toISOString()
        };
      }

      const area = prev.studyAreas[areaKey];
      return {
        ...prev,
        studyAreas: {
          ...prev.studyAreas,
          [areaKey]: {
            ...area,
            questionsAttempted: area.questionsAttempted + 1,
            questionsCorrect: area.questionsCorrect + (isCorrect ? 1 : 0)
          }
        },
        lastActivity: new Date().toISOString()
      };
    });
  };

  // Mark a recommendation as completed
  const completeRecommendation = (index: number) => {
    setStudyProgress(prev => {
      const newRecommendations = [...prev.recommendations];
      if (newRecommendations[index]) {
        newRecommendations[index] = {
          ...newRecommendations[index],
          completed: true
        };
      }
      return {
        ...prev,
        recommendations: newRecommendations,
        lastActivity: new Date().toISOString()
      };
    });
  };

  // Generate new recommendations based on user's study progress
  const updateRecommendations = (areaKey: string, confidenceLevel: number) => {
    setStudyProgress(prev => {
      // Create recommendations based on low confidence areas
      const newRecommendations = [...prev.recommendations];
      
      // If confidence is low (1), add a recommendation if one doesn't already exist
      if (confidenceLevel === 1) {
        const existingRecommendation = newRecommendations.find(
          r => r.title.includes(prev.studyAreas[areaKey]?.name || areaKey)
        );
        
        if (!existingRecommendation) {
          newRecommendations.push({
            type: 'content',
            title: `Focus on ${prev.studyAreas[areaKey]?.name || areaKey}`,
            description: `Prioritize studying ${prev.studyAreas[areaKey]?.name || areaKey} concepts and practice questions.`,
            priority: 3,
            completed: false
          });
        }
      }
      
      return {
        ...prev,
        recommendations: newRecommendations,
        studyAreas: {
          ...prev.studyAreas,
          [areaKey]: {
            ...prev.studyAreas[areaKey],
            recommendedFocus: confidenceLevel === 1
          }
        }
      };
    });
  };

  // Reset all study progress
  const resetProgress = () => {
    setStudyProgress({
      studyAreas: DEFAULT_STUDY_AREAS,
      recommendations: DEFAULT_RECOMMENDATIONS,
      lastActivity: new Date().toISOString()
    });
  };

  return {
    studyAreas: studyProgress.studyAreas,
    recommendations: studyProgress.recommendations,
    lastActivity: studyProgress.lastActivity,
    updateConfidenceLevel,
    recordQuestionResult,
    completeRecommendation,
    resetProgress
  };
}