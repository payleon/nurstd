import React from "react";
import { Badge } from "@/lib/badges";
import { 
  Award, 
  CheckCircle, 
  BookOpen, 
  Brain, 
  Heart, 
  Star, 
  AlertTriangle, 
  Clock, 
  Flame,
  Medal,
  Zap,
  Target,
  Trophy
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface BadgeIconProps {
  badge: Badge;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  unlocked?: boolean;
}

export function BadgeIcon({ 
  badge, 
  size = 'md', 
  showTooltip = true,
  unlocked = true
}: BadgeIconProps) {
  // Map badge icons based on badge.icon string
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      "award": <Award />,
      "check": <CheckCircle />,
      "book": <BookOpen />,
      "brain": <Brain />,
      "heart": <Heart />,
      "star": <Star />,
      "alert": <AlertTriangle />,
      "clock": <Clock />,
      "flame": <Flame />,
      "medal": <Medal />,
      "zap": <Zap />,
      "target": <Target />,
      "trophy": <Trophy />
    };
    
    return iconMap[iconName] || <Award />;
  };
  
  // Level colors
  const getLevelColor = (level?: 'bronze' | 'silver' | 'gold') => {
    if (!level) return '#4B9CD3'; // Default blue
    
    const colorMap = {
      'bronze': '#CD7F32',
      'silver': '#C0C0C0',
      'gold': '#FFD700'
    };
    
    return colorMap[level];
  };
  
  // Size classes for the badge
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-16 h-16 text-base',
    lg: 'w-20 h-20 text-lg'
  };
  
  const badgeContent = (
    <div 
      className={cn(
        `${sizeClasses[size]} rounded-full flex items-center justify-center border-2`,
        unlocked ? 'opacity-100' : 'opacity-50'
      )}
      style={{ 
        backgroundColor: `${unlocked ? getLevelColor(badge.level) + '30' : '#e5e5e5'}`, 
        color: unlocked ? getLevelColor(badge.level) : '#a0a0a0',
        borderColor: unlocked ? getLevelColor(badge.level) : '#d0d0d0'
      }}
    >
      {React.cloneElement(getIconComponent(badge.icon) as React.ReactElement, {
        size: size === 'sm' ? 20 : size === 'md' ? 28 : 36,
        className: unlocked ? "animate-pulse" : ""
      })}
    </div>
  );
  
  if (!showTooltip) {
    return badgeContent;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badgeContent}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="text-center">
            <h3 className="font-bold">{badge.name}</h3>
            <p className="text-sm text-gray-600">{badge.description}</p>
            {badge.level && (
              <p className="text-xs mt-1 capitalize" style={{ color: getLevelColor(badge.level) }}>
                {badge.level} Level
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}