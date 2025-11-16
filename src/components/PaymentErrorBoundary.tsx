import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

interface Props {
  children: ReactNode;
  onRetry?: () => void;
  onGoBack?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class PaymentErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Payment Error Boundary caught an error:', error, errorInfo);
    
    // Log to monitoring service (e.g., Sentry, LogRocket)
    this.logError(error, errorInfo);

    this.setState({
      error,
      errorInfo
    });
  }

  private logError = (error: Error, errorInfo: ErrorInfo) => {
    // Enhanced logging for payment errors
    const errorDetails = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      errorInfo: {
        componentStack: errorInfo.componentStack
      },
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      context: 'payment_processing'
    };

    console.error('💳 Payment Error Details:', errorDetails);
    
    // Send to monitoring service
    // Example: Sentry.captureException(error, { extra: errorDetails });
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Card className="max-w-md mx-auto mt-8 border-red-200">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-red-800">Payment Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Something went wrong during payment processing. This might be a temporary issue.
              </AlertDescription>
            </Alert>
            
            <div className="text-sm text-gray-600">
              <p><strong>Error:</strong> {this.state.error?.message || 'Unknown error occurred'}</p>
              <p><strong>Time:</strong> {new Date().toLocaleString()}</p>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={this.handleRetry}
                className="flex-1"
                variant="outline"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              
              {this.props.onGoBack && (
                <Button 
                  onClick={this.props.onGoBack}
                  variant="outline"
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              )}
            </div>

            <div className="text-xs text-gray-500 text-center">
              If this problem persists, please contact support with the error details above.
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}


