import React, { useState } from 'react';
import { LearningProgressSparkle } from './LearningProgressSparkle';
import { Button } from './ui/button';
import { Zap, TrendingUp, Award } from 'lucide-react';

interface LearningAchievementsSectionProps {
  currentStreak?: number; // Days in a row with activity
  totalQuestions?: number; // Total questions answered
  correctPercentage?: number; // Percentage of correct answers
  badgesEarned?: number; // Number of badges earned
  improvementRate?: number; // Percentage improvement from last week
  className?: string;
}

export function LearningAchievementsSection({
  currentStreak = 3,
  totalQuestions = 152,
  correctPercentage = 68,
  badgesEarned = 5,
  improvementRate = 12,
  className = ''
}: LearningAchievementsSectionProps) {
  const [demoTriggered, setDemoTriggered] = useState(false);
  
  // Trigger a demo animation for all cards
  const triggerSparkleDemo = () => {
    setDemoTriggered(false); // Reset first to allow re-triggering
    setTimeout(() => setDemoTriggered(true), 100);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#13294B]">Learning Achievements</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={triggerSparkleDemo}
          className="flex items-center"
        >
          <Zap className="mr-2 h-4 w-4" />
          Demo Sparkle Effects
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Streak Achievement */}
        <LearningProgressSparkle
          achievementType="streak"
          value={currentStreak}
          title="Current Study Streak"
          description="You've been studying consistently! Keep it up to build your knowledge."
          color="amber"
          animated={demoTriggered}
        />

        {/* Score Achievement */}
        <LearningProgressSparkle
          achievementType="score"
          value={correctPercentage}
          title="Test Performance"
          description={`You've correctly answered ${correctPercentage}% of questions across all tests.`}
          color="green"
          animated={demoTriggered}
        />

        {/* Badge Achievement */}
        <LearningProgressSparkle
          achievementType="badge"
          value={badgesEarned}
          title="Badges Earned"
          description="You're collecting badges for your achievements in different topics."
          color="purple"
          animated={demoTriggered}
        />

        {/* Improvement Achievement */}
        <LearningProgressSparkle
          achievementType="improvement"
          value={improvementRate}
          title="Weekly Improvement"
          description={`Your performance has improved by ${improvementRate}% compared to last week.`}
          color="blue"
          animated={demoTriggered}
        />

        {/* Total Questions Milestone */}
        <LearningProgressSparkle
          achievementType="milestone"
          value={totalQuestions}
          title="Questions Answered"
          description="The more questions you practice, the better prepared you'll be for the exam."
          color="pink"
          animated={demoTriggered}
        />
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 flex items-start">
        <div className="bg-indigo-100 rounded-full p-2 text-indigo-600 mr-3">
          <Award className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-medium text-indigo-800">Achievement Insights</h3>
          <p className="text-sm text-indigo-700 mt-1">
            Consistent practice is key to success in the NCLEX exam. Your achievements show your progress
            and identify areas where you're excelling or need more focus.
          </p>
        </div>
      </div>
    </div>
  );
}