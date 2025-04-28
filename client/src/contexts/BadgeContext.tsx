import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserStats, defaultUserStats, Badge, getUnlockedBadges, getNewlyUnlockedBadges, updateStatsAfterQuestion } from '@/lib/badges';
import { Question } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

interface BadgeContextType {
  userStats: UserStats;
  unlockedBadges: Badge[];
  updateAfterQuestionAnswered: (question: Question, isCorrect: boolean, timeSpent: number, flagged: boolean) => void;
  updateAfterTestCompleted: (correctCount: number, totalCount: number, isPerfectScore: boolean) => void;
  resetProgress: () => void;
}

const BadgeContext = createContext<BadgeContextType | null>(null);

// Local storage key
const USER_STATS_KEY = 'nursing-exam-app-user-stats';

export const BadgeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userStats, setUserStats] = useState<UserStats>(defaultUserStats);
  const [unlockedBadges, setUnlockedBadges] = useState<Badge[]>([]);
  const { toast } = useToast();

  // Load saved stats from localStorage on initial load
  useEffect(() => {
    const savedStats = localStorage.getItem(USER_STATS_KEY);
    if (savedStats) {
      try {
        const parsedStats = JSON.parse(savedStats);
        setUserStats(parsedStats);
        setUnlockedBadges(getUnlockedBadges(parsedStats));
      } catch (e) {
        console.error('Error parsing saved user stats:', e);
        setUserStats(defaultUserStats);
      }
    }
  }, []);

  // Save stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(USER_STATS_KEY, JSON.stringify(userStats));
  }, [userStats]);

  // Update streak days - check once per day with proper streak handling
  useEffect(() => {
    const lastVisitDate = localStorage.getItem('last-visit-date');
    const today = new Date();
    const todayString = today.toDateString();
    
    if (lastVisitDate) {
      const lastDate = new Date(lastVisitDate);
      
      // Calculate the difference in days
      const oneDayInMs = 24 * 60 * 60 * 1000;
      const diffTime = today.getTime() - lastDate.getTime();
      const diffDays = Math.round(diffTime / oneDayInMs);
      
      if (diffDays === 1) {
        // Consecutive day - increment streak
        setUserStats(prev => ({
          ...prev,
          streakDays: prev.streakDays + 1
        }));
      } else if (diffDays > 1) {
        // Streak broken - reset to 1
        setUserStats(prev => ({
          ...prev,
          streakDays: 1
        }));
      } else if (diffDays === 0) {
        // Same day visit - do nothing to the streak
      } else if (diffDays < 0) {
        // Clock was changed or timezone issue
        // Just use the current streak without changes
      }
    }
    
    localStorage.setItem('last-visit-date', todayString);
  }, []);

  const updateAfterQuestionAnswered = (question: Question, isCorrect: boolean, timeSpent: number, flagged: boolean) => {
    const oldStats = { ...userStats };
    const newStats = updateStatsAfterQuestion(oldStats, question, isCorrect, timeSpent, flagged);
    
    setUserStats(newStats);
    
    // Check for newly unlocked badges
    const newBadges = getNewlyUnlockedBadges(oldStats, newStats);
    setUnlockedBadges(getUnlockedBadges(newStats));
    
    // Show toast notification for new badges
    if (newBadges.length > 0) {
      newBadges.forEach(badge => {
        toast({
          title: `🎉 New Badge Unlocked!`,
          description: `${badge.icon} ${badge.name}: ${badge.description}`,
          duration: 5000
        });
      });
    }
  };

  const updateAfterTestCompleted = (correctCount: number, totalCount: number, isPerfectScore: boolean) => {
    const oldStats = { ...userStats };
    const newStats = {
      ...oldStats,
      testsCompleted: oldStats.testsCompleted + 1,
      questionsCorrect: oldStats.questionsCorrect + correctCount,
      questionsIncorrect: oldStats.questionsIncorrect + (totalCount - correctCount),
      questionsAnswered: oldStats.questionsAnswered + totalCount,
      perfectScores: isPerfectScore ? oldStats.perfectScores + 1 : oldStats.perfectScores
    };
    
    setUserStats(newStats);
    
    // Check for newly unlocked badges
    const newBadges = getNewlyUnlockedBadges(oldStats, newStats);
    setUnlockedBadges(getUnlockedBadges(newStats));
    
    // Show toast notification for new badges
    if (newBadges.length > 0) {
      newBadges.forEach(badge => {
        toast({
          title: `🎉 New Badge Unlocked!`,
          description: `${badge.icon} ${badge.name}: ${badge.description}`,
          duration: 5000
        });
      });
    }
  };

  const resetProgress = () => {
    setUserStats(defaultUserStats);
    setUnlockedBadges([]);
    localStorage.removeItem(USER_STATS_KEY);
    localStorage.removeItem('last-visit-date');
    
    toast({
      title: 'Progress Reset',
      description: 'All progress and badges have been reset.',
      duration: 3000
    });
  };

  return (
    <BadgeContext.Provider value={{
      userStats,
      unlockedBadges,
      updateAfterQuestionAnswered,
      updateAfterTestCompleted,
      resetProgress
    }}>
      {children}
    </BadgeContext.Provider>
  );
};

export const useBadges = () => {
  const context = useContext(BadgeContext);
  if (!context) {
    throw new Error('useBadges must be used within a BadgeProvider');
  }
  return context;
};