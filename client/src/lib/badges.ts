// Badge definitions
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'achievement' | 'progress' | 'specialty';
  condition: (stats: UserStats) => boolean;
  level?: 'bronze' | 'silver' | 'gold';
}

// User statistics tracked for badge achievements
export interface UserStats {
  questionsAnswered: number;
  questionsCorrect: number;
  questionsIncorrect: number;
  streakDays: number;
  testsCompleted: number;
  specialtyQuestionsCompleted: Record<string, number>;
  perfectScores: number;
  flaggedQuestions: number;
  timeSpent: number; // in minutes
}

// Define all available badges
export const badges: Badge[] = [
  // Achievement Badges
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Answered your first question',
    icon: '🏁',
    category: 'achievement',
    level: 'bronze',
    condition: (stats) => stats.questionsAnswered >= 1
  },
  {
    id: 'getting_started',
    name: 'Getting Started',
    description: 'Answered 10 questions',
    icon: '🔄',
    category: 'achievement',
    level: 'bronze',
    condition: (stats) => stats.questionsAnswered >= 10
  },
  {
    id: 'consistent_learner',
    name: 'Consistent Learner',
    description: 'Maintained a 3-day study streak',
    icon: '🔥',
    category: 'achievement',
    level: 'silver',
    condition: (stats) => stats.streakDays >= 3
  },
  {
    id: 'dedicated_student',
    name: 'Dedicated Student',
    description: 'Maintained a 7-day study streak',
    icon: '🔥',
    category: 'achievement',
    level: 'gold',
    condition: (stats) => stats.streakDays >= 7
  },
  {
    id: 'test_taker',
    name: 'Test Taker',
    description: 'Completed your first practice test',
    icon: '📝',
    category: 'achievement',
    level: 'bronze',
    condition: (stats) => stats.testsCompleted >= 1
  },
  {
    id: 'test_master',
    name: 'Test Master',
    description: 'Completed 5 practice tests',
    icon: '📚',
    category: 'achievement',
    level: 'silver',
    condition: (stats) => stats.testsCompleted >= 5
  },
  {
    id: 'perfect_score',
    name: 'Perfect Score',
    description: 'Achieved a perfect score on a practice test',
    icon: '🌟',
    category: 'achievement',
    level: 'gold',
    condition: (stats) => stats.perfectScores >= 1
  },
  
  // Progress Badges
  {
    id: 'nursing_novice',
    name: 'Nursing Novice',
    description: 'Answered 25 questions correctly',
    icon: '👶',
    category: 'progress',
    level: 'bronze',
    condition: (stats) => stats.questionsCorrect >= 25
  },
  {
    id: 'nursing_student',
    name: 'Nursing Student',
    description: 'Answered 50 questions correctly',
    icon: '👩‍⚕️',
    category: 'progress',
    level: 'silver',
    condition: (stats) => stats.questionsCorrect >= 50
  },
  {
    id: 'nursing_graduate',
    name: 'Nursing Graduate',
    description: 'Answered 100 questions correctly',
    icon: '🎓',
    category: 'progress',
    level: 'gold',
    condition: (stats) => stats.questionsCorrect >= 100
  },
  {
    id: 'quick_study',
    name: 'Quick Study',
    description: 'Answered 10 questions in less than 10 minutes',
    icon: '⚡',
    category: 'progress',
    level: 'silver',
    condition: (stats) => stats.questionsAnswered >= 10 && stats.timeSpent <= 10
  },
  {
    id: 'careful_reviewer',
    name: 'Careful Reviewer',
    description: 'Flagged 5 questions for review',
    icon: '🔍',
    category: 'progress',
    level: 'bronze',
    condition: (stats) => stats.flaggedQuestions >= 5
  },
  
  // Specialty Badges
  {
    id: 'maternity_explorer',
    name: 'Maternity Explorer',
    description: 'Completed 10 Maternity nursing questions',
    icon: '👶',
    category: 'specialty',
    level: 'bronze',
    condition: (stats) => (stats.specialtyQuestionsCompleted['Maternity'] || 0) >= 10
  },
  {
    id: 'maternity_specialist',
    name: 'Maternity Specialist',
    description: 'Completed 25 Maternity nursing questions',
    icon: '👶',
    category: 'specialty',
    level: 'silver',
    condition: (stats) => (stats.specialtyQuestionsCompleted['Maternity'] || 0) >= 25
  },
  {
    id: 'mental_health_explorer',
    name: 'Mental Health Explorer',
    description: 'Completed 10 Mental Health nursing questions',
    icon: '🧠',
    category: 'specialty',
    level: 'bronze',
    condition: (stats) => (stats.specialtyQuestionsCompleted['Mental Health'] || 0) >= 10
  },
  {
    id: 'mental_health_specialist',
    name: 'Mental Health Specialist',
    description: 'Completed 25 Mental Health nursing questions',
    icon: '🧠',
    category: 'specialty',
    level: 'silver',
    condition: (stats) => (stats.specialtyQuestionsCompleted['Mental Health'] || 0) >= 25
  },
  {
    id: 'medical_surgical_explorer',
    name: 'Medical-Surgical Explorer',
    description: 'Completed 10 Medical-Surgical nursing questions',
    icon: '🏥',
    category: 'specialty',
    level: 'bronze',
    condition: (stats) => (stats.specialtyQuestionsCompleted['Medical-Surgical'] || 0) >= 10
  },
  {
    id: 'fundamentals_explorer',
    name: 'Fundamentals Explorer',
    description: 'Completed 10 Fundamentals of Nursing questions',
    icon: '📋',
    category: 'specialty',
    level: 'bronze',
    condition: (stats) => (stats.specialtyQuestionsCompleted['Fundamentals'] || 0) >= 10
  },
  {
    id: 'pharmacology_explorer',
    name: 'Pharmacology Explorer',
    description: 'Completed 10 Pharmacology questions',
    icon: '💊',
    category: 'specialty',
    level: 'bronze',
    condition: (stats) => (stats.specialtyQuestionsCompleted['Pharmacology'] || 0) >= 10
  },
  {
    id: 'pediatric_explorer',
    name: 'Pediatric Explorer',
    description: 'Completed 10 Pediatric nursing questions',
    icon: '👧',
    category: 'specialty',
    level: 'bronze',
    condition: (stats) => (stats.specialtyQuestionsCompleted['Pediatric'] || 0) >= 10
  }
];

// Default empty user stats
export const defaultUserStats: UserStats = {
  questionsAnswered: 0,
  questionsCorrect: 0,
  questionsIncorrect: 0,
  streakDays: 0,
  testsCompleted: 0,
  specialtyQuestionsCompleted: {},
  perfectScores: 0,
  flaggedQuestions: 0,
  timeSpent: 0
};

// Function to get unlocked badges based on user stats
export function getUnlockedBadges(stats: UserStats): Badge[] {
  return badges.filter(badge => badge.condition(stats));
}

// Function to get progress towards a specific badge
export function getBadgeProgress(badge: Badge, stats: UserStats): number {
  // Custom progress calculations based on badge type
  switch (badge.id) {
    case 'first_steps':
      return Math.min(stats.questionsAnswered / 1, 1) * 100;
    case 'getting_started':
      return Math.min(stats.questionsAnswered / 10, 1) * 100;
    case 'consistent_learner':
      return Math.min(stats.streakDays / 3, 1) * 100;
    case 'dedicated_student':
      return Math.min(stats.streakDays / 7, 1) * 100;
    case 'nursing_novice':
      return Math.min(stats.questionsCorrect / 25, 1) * 100;
    case 'nursing_student':
      return Math.min(stats.questionsCorrect / 50, 1) * 100;
    case 'nursing_graduate':
      return Math.min(stats.questionsCorrect / 100, 1) * 100;
    case 'maternity_explorer':
      return Math.min((stats.specialtyQuestionsCompleted['Maternity'] || 0) / 10, 1) * 100;
    case 'maternity_specialist':
      return Math.min((stats.specialtyQuestionsCompleted['Maternity'] || 0) / 25, 1) * 100;
    case 'mental_health_explorer':
      return Math.min((stats.specialtyQuestionsCompleted['Mental Health'] || 0) / 10, 1) * 100;
    case 'mental_health_specialist':
      return Math.min((stats.specialtyQuestionsCompleted['Mental Health'] || 0) / 25, 1) * 100;
    case 'medical_surgical_explorer':
      return Math.min((stats.specialtyQuestionsCompleted['Medical-Surgical'] || 0) / 10, 1) * 100;
    case 'fundamentals_explorer':
      return Math.min((stats.specialtyQuestionsCompleted['Fundamentals'] || 0) / 10, 1) * 100;
    case 'pharmacology_explorer':
      return Math.min((stats.specialtyQuestionsCompleted['Pharmacology'] || 0) / 10, 1) * 100;
    case 'pediatric_explorer':
      return Math.min((stats.specialtyQuestionsCompleted['Pediatric'] || 0) / 10, 1) * 100;
    default:
      // Default to binary unlocked/locked (0% or 100%)
      return badge.condition(stats) ? 100 : 0;
  }
}

// Helper function to update stats after answering a question
export function updateStatsAfterQuestion(stats: UserStats, question: any, isCorrect: boolean, timeSpent: number, flagged: boolean): UserStats {
  const specialty = question.title;
  const updatedStats = { 
    ...stats,
    questionsAnswered: stats.questionsAnswered + 1,
    timeSpent: stats.timeSpent + (timeSpent / 60), // Convert seconds to minutes
    specialtyQuestionsCompleted: {
      ...stats.specialtyQuestionsCompleted,
      [specialty]: (stats.specialtyQuestionsCompleted[specialty] || 0) + 1
    }
  };
  
  if (isCorrect) {
    updatedStats.questionsCorrect = stats.questionsCorrect + 1;
  } else {
    updatedStats.questionsIncorrect = stats.questionsIncorrect + 1;
  }
  
  if (flagged) {
    updatedStats.flaggedQuestions = stats.flaggedQuestions + 1;
  }
  
  return updatedStats;
}

// Function to check for newly unlocked badges
export function getNewlyUnlockedBadges(oldStats: UserStats, newStats: UserStats): Badge[] {
  const previousUnlocked = getUnlockedBadges(oldStats).map(badge => badge.id);
  const currentUnlocked = getUnlockedBadges(newStats);
  
  return currentUnlocked.filter(badge => !previousUnlocked.includes(badge.id));
}