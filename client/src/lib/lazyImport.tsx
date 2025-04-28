import React, { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Create a lazily-loaded component with a loading fallback
 * @param importFn - Dynamic import function
 * @param name - Optional component name to extract from the imported module
 * @returns Lazy component with loading indicator
 */
export function lazyImport<
  T extends React.ComponentType<any>,
  I extends { [K2 in K]: T },
  K extends keyof I
>(importFn: () => Promise<I>, name: K): I {
  const LazyComponent = lazy(() => 
    importFn().then(module => ({ default: module[name] }))
  );

  const ComponentWithLoading = (props: React.ComponentProps<T>) => (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center p-4 min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      }
    >
      <LazyComponent {...props} />
    </Suspense>
  );

  return {
    [name]: ComponentWithLoading
  } as I;
}

/**
 * Create a lazily-loaded page component with a full-page loading indicator
 * Compatible with wouter's Route component
 * @param importFn - Dynamic import function for the page component
 * @returns Lazy page component with loading indicator
 */
export function lazyPage<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
): T {
  const LazyPage = lazy(importFn);

  const PageWithLoading = (props: React.ComponentProps<T>) => (
    <Suspense 
      fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-white">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-500" />
            <p className="mt-4 text-lg font-medium text-gray-600">Loading page...</p>
          </div>
        </div>
      }
    >
      <LazyPage {...props} />
    </Suspense>
  );

  return PageWithLoading as T;
}