import { useEffect } from 'react';

interface ScriptInfo {
  src: string;
  async?: boolean;
  defer?: boolean;
  type?: string;
  integrity?: string;
  crossOrigin?: string;
  importance?: 'high' | 'low' | 'auto';
}

/**
 * ScriptLoader - Optimized script loading to prevent render blocking
 * 
 * This component:
 * 1. Loads scripts with appropriate timing (after critical content is loaded)
 * 2. Prioritizes scripts based on importance
 * 3. Supports various script loading strategies (async, defer, module)
 */
export default function ScriptLoader() {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    // Wait for the main content to load before adding non-critical scripts
    const loadScripts = () => {
      // Define scripts that need to be loaded but aren't critical for initial page load
      // These will be loaded after the main content has rendered
      const deferredScripts: ScriptInfo[] = [
        // Example: Third-party analytics
        // { src: 'https://www.google-analytics.com/analytics.js', async: true, importance: 'low' },
        
        // Example: Social media widgets
        // { src: 'https://platform.twitter.com/widgets.js', async: true, defer: true, importance: 'low' },
        
        // Example: Chat widgets
        // { src: 'https://static.zdassets.com/ekr/snippet.js', async: true, defer: true, importance: 'low' },
      ];

      // Load each script with the specified attributes
      deferredScripts.forEach(scriptInfo => {
        if (document.querySelector(`script[src="${scriptInfo.src}"]`)) return;
        
        const script = document.createElement('script');
        script.src = scriptInfo.src;
        
        if (scriptInfo.async) script.async = true;
        if (scriptInfo.defer) script.defer = true;
        if (scriptInfo.type) script.type = scriptInfo.type;
        if (scriptInfo.integrity) script.integrity = scriptInfo.integrity;
        if (scriptInfo.crossOrigin) script.crossOrigin = scriptInfo.crossOrigin;
        
        // Set the fetchpriority attribute if supported and specified
        if (scriptInfo.importance && 'importance' in document.createElement('script')) {
          (script as any).importance = scriptInfo.importance;
        }
        
        document.body.appendChild(script);
      });
    };
    
    // Try to delay script loading until after important content is displayed
    if (document.readyState === 'complete') {
      // If the page is already loaded, add scripts immediately
      loadScripts();
    } else {
      // Otherwise wait for the load event
      window.addEventListener('load', () => {
        // Further delay non-critical scripts 
        setTimeout(loadScripts, 2000); // 2 second delay to ensure critical interactions are not disturbed
      });
    }
    
    return () => {
      window.removeEventListener('load', loadScripts);
    };
  }, []);
  
  return null; // This component doesn't render anything
}