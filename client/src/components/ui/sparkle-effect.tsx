import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type SparkleColors = 'blue' | 'green' | 'amber' | 'purple' | 'pink';

interface SparkleProps {
  x: number;
  y: number;
  color: SparkleColors;
  size?: number;
}

interface SparkleEffectProps {
  color?: SparkleColors;
  intensity?: 'low' | 'medium' | 'high';
  size?: 'sm' | 'md' | 'lg';
  duration?: number;
  elementRef: React.RefObject<HTMLElement>;
  trigger?: boolean; // If true, it will trigger the effect
}

// Individual sparkle component
const Sparkle = ({ x, y, color, size = 10 }: SparkleProps) => {
  const getColor = (color: SparkleColors) => {
    switch (color) {
      case 'blue': return ['#4B9CD3', '#13294B'];
      case 'green': return ['#4ade80', '#15803d'];
      case 'amber': return ['#fbbf24', '#b45309'];
      case 'purple': return ['#a855f7', '#6b21a8'];
      case 'pink': return ['#ec4899', '#9d174d'];
      default: return ['#4B9CD3', '#13294B'];
    }
  };

  const [primaryColor, secondaryColor] = getColor(color);

  return (
    <motion.svg
      key={`${x}-${y}`}
      style={{ 
        position: 'absolute', 
        left: x, 
        top: y,
        width: size,
        height: size,
        overflow: 'visible',
        strokeWidth: 0,
      }}
      initial={{ scale: 0, rotate: Math.random() * 360 }}
      animate={{ 
        scale: [0, 1, 0.8],
        rotate: [0, Math.random() * 360],
        opacity: [0, 1, 0],
      }}
      transition={{ 
        duration: 0.6 + Math.random() * 0.5, 
        ease: "easeOut" 
      }}
      exit={{ opacity: 0, scale: 0 }}
      viewBox="0 0 160 160"
    >
      <path
        d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
        fill={primaryColor}
      />
      <path
        d="M80 24C80 24 82.868 53.1502 94.5707 64.8529C106.273 76.5556 136 80 136 80C136 80 106.273 83.4444 94.5707 95.1471C82.868 106.85 80 136 80 136C80 136 77.132 106.85 65.4293 95.1471C53.7266 83.4444 24 80 24 80C24 80 53.7266 76.5556 65.4293 64.8529C77.132 53.1502 80 24 80 24Z"
        fill={secondaryColor}
      />
    </motion.svg>
  );
};

export function SparkleEffect({ 
  color = 'blue', 
  intensity = 'medium', 
  size = 'md', 
  duration = 1000, 
  elementRef,
  trigger = false
}: SparkleEffectProps) {
  const [sparkles, setSparkles] = useState<SparkleProps[]>([]);
  const [isActive, setIsActive] = useState(false);

  // Convert size string to actual pixel value
  const getSizeInPixels = (sizeStr: 'sm' | 'md' | 'lg') => {
    switch (sizeStr) {
      case 'sm': return 12;
      case 'md': return 16;
      case 'lg': return 20;
      default: return 16;
    }
  };

  // Get number of sparkles based on intensity
  const getSparkleCount = (intensityStr: 'low' | 'medium' | 'high') => {
    switch (intensityStr) {
      case 'low': return 8;
      case 'medium': return 15;
      case 'high': return 25;
      default: return 15;
    }
  };

  const sparkleSize = getSizeInPixels(size);
  const sparkleCount = getSparkleCount(intensity);

  const generateSparkles = () => {
    if (!elementRef.current) return [];

    const rect = elementRef.current.getBoundingClientRect();
    const sparkles: SparkleProps[] = [];

    // Create sparkles evenly around the perimeter of the element
    const perimeter = 2 * (rect.width + rect.height);
    const stepSize = perimeter / sparkleCount;

    for (let i = 0; i < sparkleCount; i++) {
      const step = stepSize * i;
      let x, y;

      // Top edge
      if (step < rect.width) {
        x = step;
        y = 0;
      }
      // Right edge
      else if (step < rect.width + rect.height) {
        x = rect.width;
        y = step - rect.width;
      }
      // Bottom edge
      else if (step < 2 * rect.width + rect.height) {
        x = rect.width - (step - (rect.width + rect.height));
        y = rect.height;
      }
      // Left edge
      else {
        x = 0;
        y = rect.height - (step - (2 * rect.width + rect.height));
      }

      // Add some randomness to the positions
      x += (Math.random() - 0.5) * 20;
      y += (Math.random() - 0.5) * 20;

      sparkles.push({
        x,
        y,
        color,
        size: sparkleSize * (0.8 + Math.random() * 0.4), // Slight size variation
      });
    }

    return sparkles;
  };

  const triggerSparkles = () => {
    setSparkles(generateSparkles());
    setIsActive(true);
    
    // Clear sparkles after the specified duration
    setTimeout(() => {
      setIsActive(false);
    }, duration);
  };

  // Effect to trigger sparkles when the 'trigger' prop changes to true
  useEffect(() => {
    if (trigger) {
      triggerSparkles();
    }
  }, [trigger]);

  return (
    <AnimatePresence>
      {isActive && sparkles.map((sparkleProps, index) => (
        <Sparkle key={`sparkle-${index}`} {...sparkleProps} />
      ))}
    </AnimatePresence>
  );
}