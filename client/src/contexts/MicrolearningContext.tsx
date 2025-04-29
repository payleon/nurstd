import React, { createContext, useContext, useState, useEffect } from 'react';
import { useIdleTimer } from '../hooks/useIdleTimer';
import { MicrolearningTipOverlay } from '../components/MicrolearningTip';

interface MicrolearningContextType {
  isShowingTip: boolean;
  showTip: () => void;
  hideTip: () => void;
  isIdleTimerEnabled: boolean;
  setIdleTimerEnabled: (enabled: boolean) => void;
}

const MicrolearningContext = createContext<MicrolearningContextType | undefined>(undefined);

interface MicrolearningProviderProps {
  children: React.ReactNode;
  idleTimeout?: number; // Time in ms before showing a tip (default: 2 minutes)
  maxTipsPerSession?: number; // Maximum number of tips to show per session
}

export const MicrolearningProvider: React.FC<MicrolearningProviderProps> = ({
  children,
  idleTimeout = 120000, // 2 minutes by default
  maxTipsPerSession = 5, // Show max 5 tips per session by default
}) => {
  const [isShowingTip, setIsShowingTip] = useState(false);
  const [isIdleTimerEnabled, setIdleTimerEnabled] = useState(true);
  const [sessionTipCount, setSessionTipCount] = useState(0);
  
  // Check local storage for user preference on idle tips
  useEffect(() => {
    const storedPreference = localStorage.getItem('microlearning_tips_enabled');
    if (storedPreference !== null) {
      setIdleTimerEnabled(storedPreference === 'true');
    }
  }, []);

  // Save preference when it changes
  useEffect(() => {
    localStorage.setItem('microlearning_tips_enabled', isIdleTimerEnabled.toString());
  }, [isIdleTimerEnabled]);

  const showTip = () => {
    if (sessionTipCount < maxTipsPerSession) {
      setIsShowingTip(true);
      setSessionTipCount(prev => prev + 1);
    }
  };

  const hideTip = () => {
    setIsShowingTip(false);
  };

  // Setup idle timer
  // Position check - don't show tips when cursor is near the sidebar
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isNearSidebar, setIsNearSidebar] = useState(false);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newPosition = { x: e.clientX, y: e.clientY };
      setMousePosition(newPosition);
      
      // Only update isNearSidebar when it actually changes to avoid re-renders
      const nearSidebar = newPosition.x < 250;
      if (nearSidebar !== isNearSidebar) {
        setIsNearSidebar(nearSidebar);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isNearSidebar]);
  
  useIdleTimer({
    timeout: idleTimeout,
    onIdle: () => {
      if (isIdleTimerEnabled && !isShowingTip && !isNearSidebar) {
        showTip();
      }
    },
    onActive: () => {
      // Optional: do something when user becomes active again
    },
  });

  const value = {
    isShowingTip,
    showTip,
    hideTip,
    isIdleTimerEnabled,
    setIdleTimerEnabled,
  };

  return (
    <MicrolearningContext.Provider value={value}>
      {children}
      {isShowingTip && <MicrolearningTipOverlay onClose={hideTip} />}
    </MicrolearningContext.Provider>
  );
};

export const useMicrolearning = (): MicrolearningContextType => {
  const context = useContext(MicrolearningContext);
  if (context === undefined) {
    throw new Error('useMicrolearning must be used within a MicrolearningProvider');
  }
  return context;
};