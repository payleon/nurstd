import { useEffect } from 'react';

/**
 * FontLoader - A component that optimizes font loading
 * 
 * This component:
 * 1. Delays Google Fonts loading until after the page has rendered
 * 2. Uses the "swap" display strategy to show text immediately with fallback fonts
 * 3. Preconnects to font domains for faster resolution
 */
export function FontLoader() {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    // Add preconnect links
    const addPreconnect = () => {
      const links = [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' }
      ];

      links.forEach(linkData => {
        const link = document.createElement('link');
        link.rel = linkData.rel;
        link.href = linkData.href;
        if (linkData.crossOrigin) {
          link.crossOrigin = linkData.crossOrigin;
        }
        document.head.appendChild(link);
      });
    };

    // Load Google Fonts asynchronously
    const loadFonts = () => {
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
      link.rel = 'stylesheet';
      link.media = 'print';
      link.onload = function() {
        link.media = 'all';
      };
      document.head.appendChild(link);
    };

    // Add font-display: swap to ensure text is visible during font loading
    const addFontDisplaySwap = () => {
      const style = document.createElement('style');
      style.textContent = `
        @font-face {
          font-display: swap;
        }
      `;
      document.head.appendChild(style);
    };

    // Execute optimizations
    addPreconnect();
    
    if (document.readyState === 'complete') {
      loadFonts();
      addFontDisplaySwap();
    } else {
      window.addEventListener('load', () => {
        loadFonts();
        addFontDisplaySwap();
      });
    }
  }, []);

  // This component doesn't render anything
  return null;
}

export default FontLoader;