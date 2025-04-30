import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { StudyBreakMinigame } from './StudyBreakMinigame';
import { Coffee, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface StudyBreakButtonProps {
  variant?: 'icon' | 'full' | 'small';
  className?: string;
  placement?: 'sidebar' | 'float' | 'inline';
}

export function StudyBreakButton({ 
  variant = 'full',
  className = '',
  placement = 'inline'
}: StudyBreakButtonProps) {
  const [isMinigameOpen, setIsMinigameOpen] = useState(false);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [showScoreNotification, setShowScoreNotification] = useState(false);

  const handleOpenMinigame = () => {
    setIsMinigameOpen(true);
  };

  const handleCloseMinigame = () => {
    setIsMinigameOpen(false);
  };

  const handleGameComplete = (score: number) => {
    setLastScore(score);
    setShowScoreNotification(true);
    
    // Hide the notification after 5 seconds
    setTimeout(() => {
      setShowScoreNotification(false);
    }, 5000);
  };

  // Button styles based on placement and variant
  const buttonStyles = cn(
    'relative',
    {
      'fixed bottom-6 right-6 z-50 shadow-lg rounded-full p-4': placement === 'float',
      'w-full': placement === 'sidebar',
      'inline-flex': placement === 'inline',
    },
    className
  );

  return (
    <>
      {variant === 'icon' ? (
        <Button 
          onClick={handleOpenMinigame} 
          className={cn(buttonStyles, 'aspect-square p-2')}
          aria-label="Take a study break"
        >
          <Coffee className="h-5 w-5" />
        </Button>
      ) : variant === 'small' ? (
        <Button 
          onClick={handleOpenMinigame} 
          className={cn(buttonStyles, 'px-3 py-1 text-sm')}
          size="sm"
        >
          <Coffee className="h-4 w-4 mr-1" />
          Break
        </Button>
      ) : (
        <Button 
          onClick={handleOpenMinigame} 
          className={buttonStyles}
        >
          <Coffee className="h-5 w-5 mr-2" />
          Study Break
        </Button>
      )}

      {/* Score notification */}
      <AnimatePresence>
        {showScoreNotification && lastScore !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-20 right-6 bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded-md shadow-md z-50 flex items-center"
          >
            <Brain className="h-5 w-5 mr-2" />
            <span>You earned {lastScore} points!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <StudyBreakMinigame 
        isOpen={isMinigameOpen} 
        onClose={handleCloseMinigame} 
        onComplete={handleGameComplete}
      />
    </>
  );
}