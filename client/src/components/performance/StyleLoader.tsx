import { useEffect } from 'react';

/**
 * StyleLoader - A component that optimizes stylesheet loading
 * 
 * This component:
 * 1. Loads critical CSS inline
 * 2. Defers non-critical CSS until after the page has rendered
 * 3. Adds progressive enhancement for modern CSS features
 */
export function StyleLoader() {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    // Critical CSS that should be loaded immediately for above-the-fold content
    const criticalCss = `
      /* Critical base styles */
      body { 
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        background-color: #f0f2f5;
        margin: 0;
        padding: 0;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      /* Prevent layout shift */
      main {
        min-height: 100vh;
      }
      /* Base text styling */
      h1, h2, h3, h4, h5, h6 {
        margin-top: 0;
      }
    `;

    // Inject critical CSS
    const injectCriticalCss = () => {
      const style = document.createElement('style');
      style.textContent = criticalCss;
      document.head.appendChild(style);
    };

    // Progressive enhancement for modern browsers
    const addModernCssFeatures = () => {
      const style = document.createElement('style');
      style.textContent = `
        @supports (font-size-adjust: 1) {
          body {
            font-size-adjust: 0.5;
          }
        }
        
        @supports (font-variation-settings: normal) {
          body {
            font-variation-settings: "wght" 400;
          }
          strong, b, h1, h2, h3, h4, h5, h6 {
            font-variation-settings: "wght" 700;
          }
        }
      `;
      document.head.appendChild(style);
    };

    // Add priority hints to critical resources
    const addResourceHints = () => {
      // Find all stylesheets
      const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
      
      // Add importance attribute to the main stylesheet
      stylesheets.forEach(link => {
        if (link.href.includes('index') || link.href.includes('main')) {
          // @ts-ignore - TypeScript might not have importance defined
          link.importance = 'high';
        } else {
          // @ts-ignore - TypeScript might not have importance defined
          link.importance = 'low';
        }
      });
    };

    // Execute optimizations
    injectCriticalCss();
    
    if (document.readyState === 'complete') {
      addModernCssFeatures();
      addResourceHints();
    } else {
      window.addEventListener('load', () => {
        addModernCssFeatures();
        addResourceHints();
      });
    }
  }, []);

  return null;
}

export default StyleLoader;