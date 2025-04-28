import React from "react";
import { UserStats } from "@/lib/badges";
import { StudyMascot, mascotConfigurations } from "./StudyMascot";
import { Award, ChevronRight } from "lucide-react";

interface MascotEvolutionCardProps {
  userStats: UserStats;
  className?: string;
}

export function MascotEvolutionCard({ userStats, className = "" }: MascotEvolutionCardProps) {
  // Calculate correct answer percentage
  const correctPercentage = userStats.questionsCorrect > 0 
    ? Math.round((userStats.questionsCorrect / userStats.questionsAnswered) * 100) 
    : 0;
  
  // Find the current mascot stage
  const getCurrentMascotIndex = () => {
    let highestMatchIndex = 0;
    
    mascotConfigurations.forEach((mascot, index) => {
      if (userStats.questionsAnswered >= mascot.minQuestionsCompleted && 
          correctPercentage >= mascot.minCorrectPercentage && 
          mascot.minQuestionsCompleted >= mascotConfigurations[highestMatchIndex].minQuestionsCompleted) {
        highestMatchIndex = index;
      }
    });
    
    return highestMatchIndex;
  };
  
  const currentMascotIndex = getCurrentMascotIndex();
  
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="bg-[#13294B] text-white p-4">
        <h3 className="font-bold text-lg">Your Study Companion</h3>
        <p className="text-sm text-[#B8C5D9]">Evolves as you progress in your studies</p>
      </div>
      
      <div className="p-5">
        {/* Current Mascot Display */}
        <div className="flex justify-center mb-6">
          <StudyMascot userStats={userStats} size="lg" showDetails={true} />
        </div>
        
        {/* Evolution Timeline */}
        <div className="mt-8">
          <h4 className="font-medium text-[#13294B] mb-3">Evolution Path</h4>
          <div className="space-y-3">
            {mascotConfigurations.map((mascot, index) => {
              const isCurrentMascot = index === currentMascotIndex;
              const isUnlocked = index <= currentMascotIndex;
              const isNextTarget = index === currentMascotIndex + 1;
              
              return (
                <div 
                  key={mascot.stage}
                  className={`flex items-center p-3 rounded-md ${
                    isCurrentMascot 
                      ? `bg-[${mascot.color}15] border border-[${mascot.color}]` 
                      : isUnlocked 
                        ? 'bg-gray-50' 
                        : 'bg-gray-50 opacity-60'
                  }`}
                >
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      isUnlocked ? `bg-[${mascot.color}20]` : 'bg-gray-200'
                    }`}
                    style={{ 
                      color: isUnlocked ? mascot.color : '#667085',
                      border: isUnlocked ? `2px solid ${mascot.color}` : '2px solid #D0D5DD' 
                    }}
                  >
                    {React.cloneElement(mascot.icon as React.ReactElement, { 
                      size: 20,
                      className: isCurrentMascot ? "animate-pulse" : "" 
                    })}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h5 className="font-semibold text-[#13294B]">{mascot.name}</h5>
                      {isCurrentMascot && (
                        <span className="ml-2 text-xs bg-[#4B9CD3] text-white px-2 py-0.5 rounded-full">Current</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {isUnlocked 
                        ? `${mascot.stage.charAt(0).toUpperCase() + mascot.stage.slice(1)} level` 
                        : `Unlocks at ${mascot.minQuestionsCompleted} questions with ${mascot.minCorrectPercentage}% accuracy`
                      }
                    </p>
                  </div>
                  
                  {isUnlocked && (
                    <Award className="h-5 w-5 text-[#4B9CD3]" />
                  )}
                  
                  {isNextTarget && !isUnlocked && (
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}