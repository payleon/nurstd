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

  // Track last activity time - memoized to prevent rerenders
  const handleActivity = useCallback(() => {
    const now = Date.now();
    setLastActivity(now);
    
    if (isIdle) {
      setIsIdle(false);
      onActive();
    }
    
    // Reset the idle timer
    if (timer) {
      clearTimeout(timer);
    }
    
    const newTimer = setTimeout(() => {
      setIsIdle(true);
      onIdle();
    }, timeout);
    
    setTimer(newTimer);
  }, [isIdle, onActive, onIdle, timeout]);

  // Debounced event handler with refs to avoid dependency issues
  const debouncedActivity = useCallback(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    const newDebounceTimer = setTimeout(() => {
      handleActivity();
    }, debounce);
    
    setDebounceTimer(newDebounceTimer);
  }, [debounce, handleActivity]);

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
    // Remove timer and debounceTimer from dependencies to prevent unnecessary re-renders
  }, [debouncedActivity, events, onIdle, timeout]);

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