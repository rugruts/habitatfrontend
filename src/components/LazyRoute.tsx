import React, { Suspense } from 'react';
import { LoadingState } from '@/components/ui/loading';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface LazyRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

export const LazyRoute: React.FC<LazyRouteProps> = ({ 
  children, 
  fallback = <LoadingState message="Loading page..." size="lg" />,
  errorFallback 
}) => {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};
