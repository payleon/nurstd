import React from 'react';

/**
 * InlineCriticalCSS - Component to inline critical CSS styles
 * 
 * This component adds critical above-the-fold CSS styles directly
 * into the document head to eliminate render-blocking resources
 * and improve First Contentful Paint (FCP).
 */
const InlineCriticalCSS: React.FC = () => {
  // These styles will be inlined in the head to prevent layout shifts and flashing
  const criticalStyles = `
    /* Critical Navigation Styles */
    header, .main-navigation {
      display: flex;
      width: 100%;
    }
    
    /* Critical Layout Styles */
    .main-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
    }
    
    /* Critical Typography Styles */
    body {
      margin: 0;
      padding: 0;
    }
    
    /* Performance animations - avoid layout shifts */
    @media (prefers-reduced-motion: no-preference) {
      .fade-in {
        animation-name: fade-in;
        animation-fill-mode: both;
        animation-duration: 0.3s;
      }
      
      @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    }
    
    /* Prevent Content Layout Shifts */
    .card, .question-card, .quiz-container {
      min-height: 150px;
      aspect-ratio: 16 / 9;
    }
    
    /* Critical UI component styles */
    .btn-primary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
    }
    
    /* Skeleton placeholder styles */
    .skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: skeleton-loading 1.5s infinite;
    }
    
    @keyframes skeleton-loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;

  React.useEffect(() => {
    // Only insert in browser environment
    if (typeof document === 'undefined') return;
    
    // Check if style already exists to avoid duplicates
    const id = 'critical-css';
    if (document.getElementById(id)) return;
    
    // Create and insert the style element
    const styleElement = document.createElement('style');
    styleElement.id = id;
    styleElement.innerHTML = criticalStyles;
    
    // Insert at the beginning of head for highest priority
    const head = document.head;
    head.insertBefore(styleElement, head.firstChild);
    
    // Cleanup on unmount
    return () => {
      const styleElement = document.getElementById(id);
      if (styleElement) styleElement.remove();
    };
  }, []);
  
  return null; // This component doesn't render anything visually
};

export default InlineCriticalCSS;