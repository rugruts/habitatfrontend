import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { KeyboardNavigation } from '@/utils/accessibility';
import { cn } from '@/lib/utils';

interface AccessibleButtonProps extends ButtonProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  loading?: boolean;
  loadingText?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  tooltip?: string;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  className,
  loading = false,
  loadingText = "Loading...",
  iconLeft,
  iconRight,
  tooltip,
  onClick,
  onKeyDown,
  disabled,
  ...props
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    // Handle space and enter key activation
    KeyboardNavigation.handleActivation(event as unknown as KeyboardEvent, () => {
      if (onClick && !disabled && !loading) {
        onClick(event as unknown as React.MouseEvent<HTMLButtonElement>);
      }
    });

    // Call custom onKeyDown if provided
    if (onKeyDown) {
      onKeyDown(event);
    }
  };

  const isDisabled = disabled || loading;

  return (
    <Button
      {...props}
      className={cn(
        // Focus styles for better accessibility
        "focus-visible:ring-2 focus-visible:ring-offset-2",
        // Ensure adequate contrast in disabled state
        "disabled:opacity-60 disabled:cursor-not-allowed",
        className
      )}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      aria-live={loading ? "polite" : undefined}
      title={tooltip}
    >
      <span className="flex items-center justify-center gap-2">
        {loading ? (
          <>
            <div
              className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              aria-hidden="true"
            />
            <span>{loadingText}</span>
          </>
        ) : (
          <>
            {iconLeft && <span aria-hidden="true">{iconLeft}</span>}
            {children}
            {iconRight && <span aria-hidden="true">{iconRight}</span>}
          </>
        )}
      </span>
    </Button>
  );
};



