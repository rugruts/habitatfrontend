import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to console for development
    if (process.env.NODE_ENV === 'development') {
      console.group('Error Boundary Details');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleGoBack = () => {
    window.history.back();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">
                Something went wrong
              </CardTitle>
              <p className="text-gray-600 text-sm">
                We encountered an unexpected error. Please try again.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-xs bg-gray-100 p-3 rounded">
                  <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                    Error Details (Development)
                  </summary>
                  <pre className="text-red-600 whitespace-pre-wrap">
                    {this.state.error.toString()}
                  </pre>
                  {this.state.errorInfo && (
                    <pre className="text-gray-600 whitespace-pre-wrap mt-2">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </details>
              )}
              
              <div className="flex flex-col gap-2">
                <Button onClick={this.handleRetry} className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button onClick={this.handleGoBack} variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
                <Button onClick={this.handleGoHome} variant="outline" className="w-full">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Export the class component directly as ErrorBoundary
export const ErrorBoundary: React.FC<Props> = ({ children, ...props }) => {
  return (
    <ErrorBoundaryClass {...props}>
      {children}
    </ErrorBoundaryClass>
  );
};



// Component for displaying error messages
interface ErrorMessageProps {
  error: Error | string;
  title?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  error, 
  title = "An error occurred",
  onRetry,
  className 
}) => {
  const errorMessage = typeof error === 'string' ? error : error.message;
  
  return (
    <div className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className || ''}`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-medium text-red-900 mb-1">{title}</h3>
          <p className="text-sm text-red-700 mb-3">{errorMessage}</p>
          {onRetry && (
            <Button onClick={onRetry} size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
              <RefreshCw className="h-3 w-3 mr-1" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
