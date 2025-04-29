import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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

export function MicrolearningProvider({
  children,
  idleTimeout = 120000, // 2 minutes by default
  maxTipsPerSession = 5, // Show max 5 tips per session by default
}: MicrolearningProviderProps) {
  const [isShowingTip, setIsShowingTip] = useState(false);
  const [isIdleTimerEnabled, setIdleTimerEnabled] = useState(true);
  const [sessionTipCount, setSessionTipCount] = useState(0);
  const initialized = useRef(false);
  
  // Check local storage for user preference on idle tips - only on first mount
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      const storedPreference = localStorage.getItem('microlearning_tips_enabled');
      if (storedPreference !== null) {
        setIdleTimerEnabled(storedPreference === 'true');
      }
    }
  }, []);

  // Save preference when it changes, but prevent effects on first render
  useEffect(() => {
    if (initialized.current) {
      localStorage.setItem('microlearning_tips_enabled', isIdleTimerEnabled.toString());
    }
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

  // Setup idle timer with memoized callback
  const idleCallback = useRef(() => {
    if (isIdleTimerEnabled && !isShowingTip) {
      showTip();
    }
  }).current;

  useIdleTimer({
    timeout: idleTimeout,
    onIdle: idleCallback,
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

export function useMicrolearning(): MicrolearningContextType {
  const context = useContext(MicrolearningContext);
  if (context === undefined) {
    throw new Error('useMicrolearning must be used within a MicrolearningProvider');
  }
  return context;
}