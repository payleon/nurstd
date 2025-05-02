import { useEffect } from 'react';

/**
 * ScriptLoader - A component that optimizes script loading
 * 
 * This component:
 * 1. Defers non-critical JavaScript until after the page has rendered
 * 2. Allows for dynamic loading of scripts when needed
 */
export function ScriptLoader() {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    let loadTime = 0;
    const startTime = performance.now();

    // Track user interaction
    let userHasInteracted = false;

    const trackInteraction = () => {
      userHasInteracted = true;
      // Clean up listeners once interaction is detected
      removeInteractionListeners();
    };

    const addInteractionListeners = () => {
      document.addEventListener('click', trackInteraction);
      document.addEventListener('keydown', trackInteraction);
      document.addEventListener('scroll', trackInteraction, { passive: true });
      document.addEventListener('mousemove', trackInteraction);
      document.addEventListener('touchstart', trackInteraction, { passive: true });
    };

    const removeInteractionListeners = () => {
      document.removeEventListener('click', trackInteraction);
      document.removeEventListener('keydown', trackInteraction);
      document.removeEventListener('scroll', trackInteraction);
      document.removeEventListener('mousemove', trackInteraction);
      document.removeEventListener('touchstart', trackInteraction);
    };

    addInteractionListeners();

    // Function to load deferred scripts
    const loadDeferredScripts = () => {
      // Clean up event listener after loading deferred scripts
      window.removeEventListener('load', loadOnLoadCallback);
      
      // Measure page load time
      loadTime = performance.now() - startTime;

      // Load non-critical scripts only after user interaction or when idle
      if (userHasInteracted || loadTime > 3000) {
        // Load scripts immediately after interaction
        loadNonCriticalScripts();
      } else {
        // Otherwise use requestIdleCallback
        if ('requestIdleCallback' in window) {
          // @ts-ignore - TypeScript might not have requestIdleCallback defined
          window.requestIdleCallback(loadNonCriticalScripts, { timeout: 3000 });
        } else {
          // Fallback for browsers that don't support requestIdleCallback
          setTimeout(loadNonCriticalScripts, 3000);
        }
      }
    };

    // Load non-critical scripts
    const loadNonCriticalScripts = () => {
      removeInteractionListeners();
      // Your non-critical script loading logic would go here
      // Analytics, feedback widgets, rich UI enhancements, etc.
    };

    const loadOnLoadCallback = () => loadDeferredScripts();

    if (document.readyState === 'complete') {
      loadDeferredScripts();
    } else {
      window.addEventListener('load', loadOnLoadCallback);
    }

    return () => {
      removeInteractionListeners();
      window.removeEventListener('load', loadOnLoadCallback);
    };
  }, []);

  return null;
}

export default ScriptLoader;