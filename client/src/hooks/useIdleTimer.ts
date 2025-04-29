import { useState, useEffect, useCallback } from 'react';

interface IdleTimerOptions {
  timeout?: number; // Time in milliseconds before considered idle
  events?: string[]; // Events to listen for to reset idle timer
  onIdle?: () => void; // Callback when user becomes idle
  onActive?: () => void; // Callback when user becomes active again
  debounce?: number; // Debounce time in milliseconds
}

export function useIdleTimer({
  timeout = 90000, // Default: 90 seconds
  events = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll', 'click'],
  onIdle = () => {},
  onActive = () => {},
  debounce = 500, // Default debounce of 500ms
}: IdleTimerOptions = {}) {
  const [isIdle, setIsIdle] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // Track last activity time
  const handleActivity = useCallback(() => {
    setLastActivity(Date.now());
    
    if (isIdle) {
      setIsIdle(false);
      onActive();
    }
    
    // Reset the idle timer
    if (timer) {
      clearTimeout(timer);
    }
    
    setTimer(
      setTimeout(() => {
        setIsIdle(true);
        onIdle();
      }, timeout)
    );
  }, [isIdle, onActive, onIdle, timer, timeout]);

  // Debounced event handler
  const debouncedActivity = useCallback(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    setDebounceTimer(
      setTimeout(() => {
        handleActivity();
      }, debounce)
    );
  }, [debounce, debounceTimer, handleActivity]);

  useEffect(() => {
    // Initialize the timer
    const initialTimer = setTimeout(() => {
      setIsIdle(true);
      onIdle();
    }, timeout);
    
    setTimer(initialTimer);

    // Add event listeners for user activity
    events.forEach(event => {
      window.addEventListener(event, debouncedActivity);
    });

    // Clean up timers and event listeners on unmount
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      
      events.forEach(event => {
        window.removeEventListener(event, debouncedActivity);
      });
    };
  }, [debouncedActivity, events, onIdle, timeout, timer, debounceTimer]);

  // Manual reset of the idle timer
  const reset = useCallback(() => {
    handleActivity();
  }, [handleActivity]);

  return {
    isIdle,
    lastActivity,
    reset,
    getElapsedTime: () => Date.now() - lastActivity,
    getRemainingTime: () => Math.max(0, timeout - (Date.now() - lastActivity)),
  };
}