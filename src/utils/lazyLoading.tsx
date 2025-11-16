import React from 'react';
import { LazyRoute } from '@/components/LazyRoute';
import { LoadingState } from '@/components/ui/loading';

// Higher-order component for lazy loading
export const withLazyLoading = <P extends object>(
  Component: React.ComponentType<P>,
  loadingMessage = "Loading..."
) => {
  return React.forwardRef<unknown, P>((props, ref) => (
    <LazyRoute fallback={<LoadingState message={loadingMessage} />}>
      <Component {...props} ref={ref} />
    </LazyRoute>
  ));
};
