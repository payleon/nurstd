import { lazy } from 'react';

/**
 * A utility function to lazy load components with improved error handling
 * 
 * @param importFn - Dynamic import function for the component to be lazy loaded
 */
export function lazyLoad(importFn: () => Promise<any>) {
  return lazy(() => 
    importFn().catch(error => {
      console.error('Error loading component:', error);
      
      // Return a simple error component
      return {
        default: () => null
      };
    })
  );
}