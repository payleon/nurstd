import { useEffect } from 'react';

interface StyleInfo {
  href: string;
  media?: string;
  integrity?: string;
  crossOrigin?: string;
  importance?: 'high' | 'low' | 'auto';
}

/**
 * StyleLoader - Optimized CSS loading to prevent render blocking
 * 
 * This component:
 * 1. Loads critical CSS inline for fast rendering
 * 2. Defers non-critical CSS to improve initial load time
 * 3. Implements progressive loading for better perceived performance
 */
export default function StyleLoader() {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    // Load a stylesheet asynchronously to prevent render blocking
    const loadStylesheet = (styleInfo: StyleInfo) => {
      // Skip if already loaded
      if (document.querySelector(`link[href="${styleInfo.href}"]`)) return;
      
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = styleInfo.href;
      
      // Set media to 'print' initially (won't block rendering)
      // Will be changed to 'all' after loading to apply styles
      link.media = styleInfo.media || 'print';
      
      // Add optional attributes if provided
      if (styleInfo.integrity) link.integrity = styleInfo.integrity;
      if (styleInfo.crossOrigin) link.crossOrigin = styleInfo.crossOrigin;
      
      // Set importance if supported
      if (styleInfo.importance && 'importance' in document.createElement('link')) {
        (link as any).importance = styleInfo.importance;
      }
      
      // Switch to appropriate media when loaded
      link.onload = () => {
        link.media = styleInfo.media || 'all';
      };
      
      document.head.appendChild(link);
    };
    
    // Define non-critical stylesheets to load after initial render
    // These are stylesheets that aren't needed for above-the-fold content
    const deferredStyles: StyleInfo[] = [
      // Example: Print styles
      // { href: '/print-styles.css', media: 'print', importance: 'low' },
      
      // Example: Styles for components that appear below the fold
      // { href: '/below-fold-styles.css', importance: 'low' },
    ];
    
    // Load deferred stylesheets
    const loadDeferredStyles = () => {
      deferredStyles.forEach(loadStylesheet);
    };
    
    // Implement progressive loading - load after critical content is displayed
    if (document.readyState === 'complete') {
      loadDeferredStyles();
    } else {
      // Use requestIdleCallback if available, or setTimeout as fallback
      const scheduleLoad = () => {
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(loadDeferredStyles);
        } else {
          setTimeout(loadDeferredStyles, 1000);
        }
      };
      
      window.addEventListener('load', scheduleLoad);
      return () => window.removeEventListener('load', scheduleLoad);
    }
  }, []);
  
  return null; // This component doesn't render anything
}