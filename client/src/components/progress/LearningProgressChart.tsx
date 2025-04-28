import React, { useState, useEffect } from 'react';
import { BadgeIcon } from '@/components/badges/BadgeIcon';
import { Badge, UserStats, getBadgeProgress, badges } from '@/lib/badges';
import { motion } from 'framer-motion';
import { ArrowRight, Target, Zap, CheckCircle2, BarChart, Brain } from 'lucide-react';

// Define learning progress milestones
const learningMilestones = [
  { 
    level: 1, 
    title: 'Beginner',
    icon: <Target className="h-6 w-6 text-blue-500" />,
    requirement: (stats: UserStats) => stats.questionsAnswered >= 1,
    description: 'Started your learning journey',
    colorClass: 'bg-blue-500'
  },
  { 
    level: 2, 
    title: 'Learner',
    icon: <Zap className="h-6 w-6 text-green-500" />,
    requirement: (stats: UserStats) => stats.questionsAnswered >= 10,
    description: 'Building fundamental knowledge',
    colorClass: 'bg-green-500'
  },
  { 
    level: 3, 
    title: 'Student',
    icon: <Brain className="h-6 w-6 text-purple-500" />,
    requirement: (stats: UserStats) => stats.questionsCorrect >= 25,
    description: 'Mastering core concepts',
    colorClass: 'bg-purple-500'
  },
  { 
    level: 4, 
    title: 'Scholar',
    icon: <BarChart className="h-6 w-6 text-orange-500" />,
    requirement: (stats: UserStats) => stats.questionsCorrect >= 50,
    description: 'Developing expertise',
    colorClass: 'bg-orange-500'
  },
  { 
    level: 5, 
    title: 'Master',
    icon: <CheckCircle2 className="h-6 w-6 text-red-500" />,
    requirement: (stats: UserStats) => stats.questionsCorrect >= 100,
    description: 'Expert-level knowledge',
    colorClass: 'bg-red-500'
  }
];

// Helper function to get the current milestone based on user stats
function getCurrentMilestone(stats: UserStats) {
  for (let i = learningMilestones.length - 1; i >= 0; i--) {
    if (learningMilestones[i].requirement(stats)) {
      return i;
    }
  }
  return -1; // No milestone reached yet
}

// Helper function to calculate progress to next milestone
function getProgressToNextMilestone(stats: UserStats, currentMilestoneIndex: number) {
  if (currentMilestoneIndex === learningMilestones.length - 1) {
    return 100; // Already at max milestone
  }
  
  if (currentMilestoneIndex === -1) {
    // Progress toward first milestone
    return Math.min((stats.questionsAnswered / 1) * 100, 99);
  }
  
  const nextMilestone = learningMilestones[currentMilestoneIndex + 1];
  
  // Calculate progress based on milestone type
  if (nextMilestone.title === 'Learner') {
    return Math.min((stats.questionsAnswered / 10) * 100, 99);
  } else if (nextMilestone.title === 'Student') {
    return Math.min((stats.questionsCorrect / 25) * 100, 99);
  } else if (nextMilestone.title === 'Scholar') {
    return Math.min((stats.questionsCorrect / 50) * 100, 99);
  } else if (nextMilestone.title === 'Master') {
    return Math.min((stats.questionsCorrect / 100) * 100, 99);
  }
  
  return 0;
}

interface LearningProgressChartProps {
  userStats: UserStats;
  className?: string;
}

export function LearningProgressChart({ userStats, className = "" }: LearningProgressChartProps) {
  const [currentMilestoneIndex, setCurrentMilestoneIndex] = useState(-1);
  const [nextMilestoneProgress, setNextMilestoneProgress] = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState<Badge[]>([]);
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  
  useEffect(() => {
    // Determine current milestone and progress
    const milestone = getCurrentMilestone(userStats);
    setCurrentMilestoneIndex(milestone);
    
    // Calculate progress to next milestone
    const progress = getProgressToNextMilestone(userStats, milestone);
    setNextMilestoneProgress(progress);
    
    // Get unlocked badges for skills display
    const unlocked = badges.filter(badge => badge.condition(userStats));
    setUnlockedBadges(unlocked);
  }, [userStats]);
  
  // Calculate specialty strengths
  const specialties = Object.entries(userStats.specialtyQuestionsCompleted || {}).map(([name, count]) => ({
    name,
    count,
    percentage: Math.min((count / 10) * 100, 100)
  })).sort((a, b) => b.count - a.count);
  
  // Animate progress bar filling
  const progressVariants = {
    initial: { width: 0 },
    animate: { width: `${nextMilestoneProgress}%`, transition: { duration: 1, ease: "easeOut" } }
  };
  
  // Animate milestone markers appearing
  const milestoneVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: (i: number) => ({ 
      scale: 1, 
      opacity: 1, 
      transition: { 
        delay: 0.2 + (i * 0.1), 
        duration: 0.4, 
        type: "spring", 
        stiffness: 200 
      } 
    })
  };
  
  // Animate skill bars filling
  const skillBarVariants = {
    initial: { width: 0 },
    animate: (percentage: number) => ({ 
      width: `${percentage}%`, 
      transition: { duration: 0.8, ease: "easeOut", delay: 0.5 } 
    })
  };
  
  // Currently active milestone
  const currentMilestone = currentMilestoneIndex >= 0 ? learningMilestones[currentMilestoneIndex] : null;
  
  // Next milestone to achieve
  const nextMilestone = currentMilestoneIndex < learningMilestones.length - 1 
    ? learningMilestones[currentMilestoneIndex + 1] 
    : null;
  
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="bg-[#13294B] text-white p-4">
        <h3 className="font-bold text-lg">Learning Progress Visualization</h3>
        <p className="text-sm text-[#B8C5D9]">Watch your knowledge grow</p>
      </div>
      
      <div className="p-4">
        {/* Current milestone display */}
        <div className="mb-6">
          {currentMilestone ? (
            <div className="flex items-center mb-2">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={`w-12 h-12 rounded-full ${currentMilestone.colorClass} flex items-center justify-center mr-3 text-white`}
              >
                {currentMilestone.icon}
              </motion.div>
              <div>
                <motion.h3 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="font-bold text-lg"
                >
                  {currentMilestone.title}
                </motion.h3>
                <motion.p 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-sm text-gray-500"
                >
                  {currentMilestone.description}
                </motion.p>
              </div>
            </div>
          ) : (
            <div className="flex items-center mb-2">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-3 text-gray-400">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Just Starting</h3>
                <p className="text-sm text-gray-500">Begin your learning journey</p>
              </div>
            </div>
          )}
          
          {/* Next milestone */}
          {nextMilestone && (
            <div className="flex items-center">
              <div className="ml-6 flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-500">Progress to {nextMilestone.title}</span>
                  <span className="text-xs font-medium text-gray-700">{Math.round(nextMilestoneProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <motion.div 
                    className={`h-2.5 rounded-full ${nextMilestone.colorClass}`}
                    variants={progressVariants}
                    initial="initial"
                    animate="animate"
                  />
                </div>
              </div>
              <div className="ml-3 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                <ArrowRight className="h-4 w-4" />
              </div>
              <div className="ml-3 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                {nextMilestone.icon}
              </div>
            </div>
          )}
        </div>
        
        {/* Milestone journey map */}
        <div className="mb-8 relative">
          <div className="w-full h-2 bg-gray-200 rounded-full absolute top-5"></div>
          <div className="flex justify-between relative">
            {learningMilestones.map((milestone, index) => {
              const isActive = index <= currentMilestoneIndex;
              const isPrevious = index < currentMilestoneIndex;
              
              return (
                <motion.div 
                  key={milestone.level}
                  className="flex flex-col items-center"
                  variants={milestoneVariants}
                  custom={index}
                  initial="initial"
                  animate="animate"
                >
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center z-10 
                      ${isActive ? milestone.colorClass : 'bg-gray-200'}
                      ${isPrevious ? 'opacity-70' : 'opacity-100'}
                      transition-all duration-300`}
                  >
                    <div className={`${isActive ? 'text-white' : 'text-gray-400'}`}>
                      {milestone.icon}
                    </div>
                  </div>
                  <span className={`text-xs mt-2 font-medium ${isActive ? 'text-gray-800' : 'text-gray-400'}`}>
                    {milestone.title}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
        
        {/* Learning skills section */}
        <div>
          <h4 className="font-bold mb-3">Your Specialty Skills</h4>
          
          {specialties.length > 0 ? (
            <div className="space-y-4">
              {specialties.map((specialty) => (
                <div 
                  key={specialty.name} 
                  className="relative"
                  onMouseEnter={() => setActiveSkill(specialty.name)}
                  onMouseLeave={() => setActiveSkill(null)}
                >
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{specialty.name}</span>
                    <span className="text-sm text-gray-500">{specialty.count} questions</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div 
                      className={`h-3 rounded-full ${activeSkill === specialty.name ? 'bg-[#4B9CD3]' : 'bg-[#7AB7E0]'}`}
                      variants={skillBarVariants}
                      custom={specialty.percentage}
                      initial="initial"
                      animate="animate"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>Complete questions in different specialties to see your skills grow!</p>
            </div>
          )}
          
          {/* Badge showcase */}
          {unlockedBadges.length > 0 && (
            <div className="mt-6">
              <h4 className="font-bold mb-3">Recent Achievements</h4>
              <div className="flex flex-wrap gap-2">
                {unlockedBadges.slice(0, 5).map((badge) => (
                  <motion.div
                    key={badge.id}
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <BadgeIcon badge={badge} size="sm" showTooltip={true} unlocked={true} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}