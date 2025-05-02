import { useEffect } from 'react';
import FontLoader from './FontLoader';
import ScriptLoader from './ScriptLoader';
import StyleLoader from './StyleLoader';
import InlineCriticalCSS from './InlineCriticalCSS';

/**
 * PerformanceOptimizer - A component that combines all performance optimizations
 * 
 * This component:
 * 1. Loads all performance optimizers
 * 2. Implements additional optimizations like image lazy loading
 * 3. Performs runtime performance optimizations
 */
export function PerformanceOptimizer() {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    // Add native lazy loading to all images
    const addLazyLoadingToImages = () => {
      const images = document.querySelectorAll('img:not([loading])');
      images.forEach(img => {
        img.setAttribute('loading', 'lazy');
        // Also add decoding attribute for better performance
        img.setAttribute('decoding', 'async');
      });
    };

    // Add preload for critical images
    const preloadCriticalImages = () => {
      // Find hero/logo images that are visible above the fold
      const criticalImages = document.querySelectorAll('img[data-critical="true"]');
      
      criticalImages.forEach(img => {
        const src = img.getAttribute('src');
        if (!src) return;
        
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    };

    // Register Performance Observer to monitor LCP
    const monitorLCP = () => {
      try {
        // Only available in modern browsers
        if ('PerformanceObserver' in window) {
          // Create a performance observer
          const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            
            // Log LCP for debugging
            console.debug('[Performance] LCP:', lastEntry.startTime);
            
            // After LCP is done, we can load non-critical resources
            if (lastEntry.startTime) {
              lcpObserver.disconnect();
            }
          });
          
          // Start observing LCP
          lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        }
      } catch (e) {
        // Fail silently
        console.debug('[Performance] LCP monitoring not supported');
      }
    };

    // Execute runtime optimizations
    if (document.readyState === 'complete') {
      addLazyLoadingToImages();
      preloadCriticalImages();
      monitorLCP();
    } else {
      window.addEventListener('load', () => {
        addLazyLoadingToImages();
        preloadCriticalImages();
        monitorLCP();
      });
    }

    // Clean up
    return () => {
      window.removeEventListener('load', addLazyLoadingToImages);
    };
  }, []);

  return (
    <>
      <InlineCriticalCSS />
      <FontLoader />
      <ScriptLoader />
      <StyleLoader />
    </>
  );
}

export default PerformanceOptimizer;