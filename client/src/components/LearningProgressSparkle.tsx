import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SparkleEffect } from './ui/sparkle-effect';
import { Award, TrendingUp, Lightbulb, Zap, Target, CheckSquare, BarChart } from 'lucide-react';

interface LearningProgressSparkleProps {
  achievementType: 'streak' | 'score' | 'badge' | 'milestone' | 'improvement';
  value: number;
  title: string;
  description: string;
  color?: 'blue' | 'green' | 'amber' | 'purple' | 'pink';
  animated?: boolean;
}

export function LearningProgressSparkle({
  achievementType,
  value,
  title,
  description,
  color = 'blue',
  animated = true
}: LearningProgressSparkleProps) {
  const [triggerSparkle, setTriggerSparkle] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Get appropriate icon based on achievement type
  const getIcon = () => {
    switch (achievementType) {
      case 'streak':
        return <Zap className="h-6 w-6" />;
      case 'score':
        return <BarChart className="h-6 w-6" />;
      case 'badge':
        return <Award className="h-6 w-6" />;
      case 'milestone':
        return <Target className="h-6 w-6" />;
      case 'improvement':
        return <TrendingUp className="h-6 w-6" />;
      default:
        return <Lightbulb className="h-6 w-6" />;
    }
  };

  // Get background color based on type
  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return {
          bg: 'bg-gradient-to-br from-green-100 to-green-50',
          iconBg: 'bg-green-100 text-green-600',
          valueBg: 'bg-green-600 text-white',
          border: 'border-green-200'
        };
      case 'amber':
        return {
          bg: 'bg-gradient-to-br from-amber-100 to-amber-50',
          iconBg: 'bg-amber-100 text-amber-600',
          valueBg: 'bg-amber-600 text-white',
          border: 'border-amber-200'
        };
      case 'purple':
        return {
          bg: 'bg-gradient-to-br from-purple-100 to-purple-50',
          iconBg: 'bg-purple-100 text-purple-600',
          valueBg: 'bg-purple-600 text-white',
          border: 'border-purple-200'
        };
      case 'pink':
        return {
          bg: 'bg-gradient-to-br from-pink-100 to-pink-50',
          iconBg: 'bg-pink-100 text-pink-600',
          valueBg: 'bg-pink-600 text-white',
          border: 'border-pink-200'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-blue-100 to-blue-50',
          iconBg: 'bg-blue-100 text-blue-600',
          valueBg: 'bg-blue-600 text-white',
          border: 'border-blue-200'
        };
    }
  };

  const colorClasses = getColorClasses();

  // Setup intersection observer to animate when visible
  useEffect(() => {
    if (animated && cardRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsVisible(true);
          }
        },
        { threshold: 0.5 }
      );

      observer.observe(cardRef.current);
      return () => observer.disconnect();
    }
    return () => {};
  }, [animated]);

  // Trigger sparkle effect when component becomes visible
  useEffect(() => {
    if (isVisible && animated) {
      setTriggerSparkle(true);
    }
  }, [isVisible, animated]);

  return (
    <div 
      ref={cardRef}
      className={`relative rounded-lg p-4 border ${colorClasses.border} ${colorClasses.bg} overflow-hidden`}
    >
      {/* Sparkle effect */}
      {animated && <SparkleEffect 
        elementRef={cardRef} 
        trigger={triggerSparkle} 
        color={color} 
        intensity="medium" 
        size="md" 
        duration={1500}
      />}

      <div className="flex items-start">
        <div className={`rounded-full ${colorClasses.iconBg} p-3 mr-4`}>
          {getIcon()}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-medium text-gray-800">{title}</h3>
            <motion.div 
              className={`rounded-full ${colorClasses.valueBg} h-8 w-8 flex items-center justify-center font-bold text-sm`}
              initial={animated ? { scale: 0 } : { scale: 1 }}
              animate={isVisible ? { scale: 1 } : {}}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {value}
            </motion.div>
          </div>
          
          <p className="text-sm text-gray-600">{description}</p>
          
          {achievementType === 'streak' && (
            <div className="mt-2 flex space-x-1">
              {Array.from({ length: Math.min(value, 7) }).map((_, i) => (
                <motion.div 
                  key={i}
                  className={`h-2 rounded-full flex-1 bg-${color}-400`}
                  initial={animated ? { scaleX: 0 } : { scaleX: 1 }}
                  animate={isVisible ? { scaleX: 1 } : {}}
                  transition={{ delay: 0.1 * i, duration: 0.3 }}
                />
              ))}
              {value > 7 && (
                <div className="text-xs text-gray-500 ml-1 self-center">+{value - 7}</div>
              )}
            </div>
          )}
          
          {achievementType === 'improvement' && (
            <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full bg-${color}-500`}
                initial={animated ? { width: 0 } : { width: `${Math.min(value, 100)}%` }}
                animate={isVisible ? { width: `${Math.min(value, 100)}%` } : {}}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          )}
          
          {achievementType === 'score' && (
            <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
              <span>0</span>
              <div className="h-1.5 flex-1 mx-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full bg-${color}-500`}
                  initial={animated ? { width: 0 } : { width: `${Math.min(value, 100)}%` }}
                  animate={isVisible ? { width: `${Math.min(value, 100)}%` } : {}}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <span>100</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}