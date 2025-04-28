import React from "react";
import { UserStats } from "@/lib/badges";
import { AlertCircle, Award, BookOpen, Brain, CheckCircle, Heart } from "lucide-react";

// Define different mascot evolution stages
export type MascotEvolutionStage = 'novice' | 'intermediate' | 'advanced' | 'expert' | 'master';

export interface MascotConfig {
  stage: MascotEvolutionStage;
  name: string;
  color: string;
  description: string;
  icon: React.ReactNode;
  minQuestionsCompleted: number;
  minCorrectPercentage: number;
}

// Define the mascot configurations for different evolution stages
export const mascotConfigurations: MascotConfig[] = [
  {
    stage: 'novice',
    name: 'Florence',
    color: '#4B9CD3',
    description: 'Your nursing journey begins! Florence is eager to help you learn the basics.',
    icon: <BookOpen size={40} />,
    minQuestionsCompleted: 0,
    minCorrectPercentage: 0
  },
  {
    stage: 'intermediate',
    name: 'Galen',
    color: '#6B7FD7',
    description: 'You\'re making progress! Galen has more knowledge to share as you advance.',
    icon: <Brain size={40} />,
    minQuestionsCompleted: 30,
    minCorrectPercentage: 60
  },
  {
    stage: 'advanced',
    name: 'Hippocrates',
    color: '#8A5FDB',
    description: 'Your skills are developing well! Hippocrates brings advanced wisdom to your studies.',
    icon: <Heart size={40} />,
    minQuestionsCompleted: 100,
    minCorrectPercentage: 70
  },
  {
    stage: 'expert',
    name: 'Osler',
    color: '#AA3EC5',
    description: 'You\'re on your way to expertise! Osler is impressed with your knowledge.',
    icon: <CheckCircle size={40} />,
    minQuestionsCompleted: 200,
    minCorrectPercentage: 80
  },
  {
    stage: 'master',
    name: 'Nightingale',
    color: '#D61C98',
    description: 'You\'ve mastered nursing knowledge! Nightingale represents the pinnacle of nursing excellence.',
    icon: <Award size={40} />,
    minQuestionsCompleted: 300,
    minCorrectPercentage: 85
  }
];

interface StudyMascotProps {
  userStats: UserStats;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  className?: string;
}

export function StudyMascot({ 
  userStats, 
  size = 'md', 
  showDetails = false,
  className = ""
}: StudyMascotProps) {
  // Calculate correct answer percentage
  const correctPercentage = userStats.questionsCorrect > 0 
    ? Math.round((userStats.questionsCorrect / userStats.questionsAnswered) * 100) 
    : 0;
  
  // Determine the current mascot stage based on user stats
  const currentMascot = mascotConfigurations.reduce((highest, current) => {
    if (userStats.questionsAnswered >= current.minQuestionsCompleted && 
        correctPercentage >= current.minCorrectPercentage && 
        current.minQuestionsCompleted >= highest.minQuestionsCompleted) {
      return current;
    }
    return highest;
  }, mascotConfigurations[0]);
  
  // Calculate progress to next level (if not at max level)
  const nextMascot = mascotConfigurations.find(mascot => 
    (userStats.questionsAnswered < mascot.minQuestionsCompleted || 
     correctPercentage < mascot.minCorrectPercentage) && 
    mascot.stage !== currentMascot.stage
  );
  
  // Determine size classes
  const sizeClasses = {
    sm: 'w-12 h-12 text-xl',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-24 h-24 text-3xl'
  };
  
  // If this is the top level mascot
  const isMaxLevel = currentMascot.stage === 'master';
  
  return (
    <div className={`flex ${showDetails ? 'flex-col items-center' : 'items-center'} ${className}`}>
      <div 
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center`}
        style={{ backgroundColor: `${currentMascot.color}20`, color: currentMascot.color, border: `2px solid ${currentMascot.color}` }}
      >
        {React.cloneElement(currentMascot.icon as React.ReactElement, { 
          className: "animate-pulse", 
          size: size === 'sm' ? 24 : size === 'md' ? 32 : 48 
        })}
      </div>
      
      {showDetails && (
        <div className={`mt-3 text-center ${size === 'sm' ? 'max-w-[150px]' : size === 'md' ? 'max-w-[200px]' : 'max-w-[250px]'}`}>
          <h3 className="font-bold text-[#13294B]">{currentMascot.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{currentMascot.description}</p>
          
          {!isMaxLevel && nextMascot && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-1">Progress to {nextMascot.name}</p>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full"
                  style={{ 
                    width: `${Math.min(100, Math.max(0, (userStats.questionsAnswered / nextMascot.minQuestionsCompleted) * 100))}%`,
                    backgroundColor: nextMascot.color 
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>{userStats.questionsAnswered}/{nextMascot.minQuestionsCompleted} questions</span>
                <span>{correctPercentage}%/{nextMascot.minCorrectPercentage}% correct</span>
              </div>
            </div>
          )}
          
          {isMaxLevel && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md flex items-center justify-center text-green-600">
              <Award className="mr-2 h-4 w-4" />
              <span className="text-xs font-medium">Master Level Achieved!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}