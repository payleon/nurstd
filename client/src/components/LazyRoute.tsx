import React, { Suspense } from 'react';
import { Route } from 'wouter';
import { Loader2 } from 'lucide-react';

interface LazyRouteProps {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  preload?: boolean; // We'll keep this for API compatibility even though we're not using it
}

export function LazyRoute({ path, component }: LazyRouteProps) {
  return (
    <Route path={path}>
      {(params) => (
        <Suspense
          fallback={
            <div 
              className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900"
              role="alert" 
              aria-busy="true" 
              aria-live="polite"
            >
              <div className="text-center">
                <Loader2 
                  className="mx-auto h-12 w-12 animate-spin text-blue-500" 
                  aria-hidden="true"
                />
                <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-300">
                  Loading page...
                </p>
              </div>
            </div>
          }
        >
          {React.createElement(component, params)}
        </Suspense>
      )}
    </Route>
  );
}