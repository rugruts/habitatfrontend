import React from 'react';

// Hook for functional components to handle errors
export const useErrorHandler = () => {
  const handleError = React.useCallback((error: Error, context?: string) => {
    console.error(`Error in ${context || 'component'}:`, error);
    
    // In a real app, you might want to send this to an error reporting service
    // like Sentry, LogRocket, etc.
    
    if (process.env.NODE_ENV === 'development') {
      console.group('Error Context');
      console.error('Error:', error);
      console.error('Context:', context);
      console.error('Stack:', error.stack);
      console.groupEnd();
    }
  }, []);

  return { handleError };
};


