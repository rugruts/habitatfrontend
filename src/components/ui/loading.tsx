import React from 'react';
import { Loader2, Loader, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  variant = 'spinner',
  className 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const variants = {
    spinner: <Loader2 className={cn("animate-spin", sizeClasses[size])} />,
    dots: <Activity className={cn("animate-pulse", sizeClasses[size])} />,
    pulse: <Loader className={cn("animate-pulse", sizeClasses[size])} />
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      {variants[variant]}
    </div>
  );
};

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse';
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "Loading...",
  size = 'md',
  variant = 'spinner',
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8", className)}>
      <LoadingSpinner size={size} variant={variant} className="mb-4" />
      <p className="text-sm text-muted-foreground text-center">{message}</p>
    </div>
  );
};

interface SkeletonProps {
  className?: string;
  height?: string;
  width?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className,
  height = "h-4",
  width = "w-full"
}) => {
  return (
    <div 
      className={cn(
        "animate-pulse bg-gray-200 rounded",
        height,
        width,
        className
      )}
    />
  );
};

interface SkeletonCardProps {
  lines?: number;
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ 
  lines = 3,
  className 
}) => {
  return (
    <div className={cn("space-y-3 p-4", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          height={i === 0 ? "h-6" : "h-4"}
          width={i === lines - 1 ? "w-3/4" : "w-full"}
        />
      ))}
    </div>
  );
};

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  children: React.ReactNode;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isVisible,
  message = "Loading...",
  children,
  className 
}) => {
  if (!isVisible) return <>{children}</>;

  return (
    <div className="relative">
      {children}
      <div className={cn(
        "absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50",
        className
      )}>
        <LoadingState message={message} />
      </div>
    </div>
  );
};
