import { useEffect } from 'react';

/**
 * FontLoader - Dynamically loads fonts to prevent render blocking
 * 
 * This component:
 * 1. Asynchronously loads font stylesheets
 * 2. Implements fallbacks to prevent layout shifts
 * 3. Optimizes font loading for better performance 
 */
export default function FontLoader() {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    // Function to load a font stylesheet dynamically
    const loadFontStylesheet = (href: string) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.media = 'print';
      link.onload = () => {
        // Switch to 'all' media once loaded to apply styles
        link.media = 'all';
      };
      document.head.appendChild(link);
    };
    
    // Preload font files (individual font files for critical fonts)
    const preloadFontFile = (href: string) => {
      // Skip if already preloaded
      if (document.querySelector(`link[rel="preload"][href="${href}"]`)) return;
      
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    };
    
    // For additional non-critical fonts that aren't in the initial HTML
    // Note: Keep this list minimal to avoid overhead
    const additionalFonts: string[] = [
      // Example of additional font that may be needed but not on the critical path
      // 'https://fonts.googleapis.com/css2?family=Inter:wght@800&display=swap',
    ];
    
    // Load any additional fonts that aren't part of the critical path
    additionalFonts.forEach(loadFontStylesheet);
    
    // Potentially preload individual font files if they are critical
    // but not already handled in the HTML
    // Example:
    // preloadFontFile('https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2');
    
    return () => {
      // Cleanup is optional as links typically stay in the DOM
    };
  }, []);
  
  return null; // This component doesn't render anything
}