import * as React from "react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-6 w-6", 
      lg: "h-8 w-8"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "animate-spin rounded-full border-2 border-current border-t-transparent",
          sizeClasses[size],
          className
        )}
        {...props}
      />
    )
  }
)
LoadingSpinner.displayName = "LoadingSpinner"

interface LoadingCardProps {
  className?: string
}

const LoadingCard: React.FC<LoadingCardProps> = ({ className }) => {
  return (
    <div className={cn("space-y-3", className)}>
      <Skeleton className="h-48 w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  )
}

interface LoadingGridProps {
  count?: number
  className?: string
}

const LoadingGrid: React.FC<LoadingGridProps> = ({ count = 6, className }) => {
  return (
    <div className={cn("grid md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  )
}

interface LoadingPageProps {
  title?: string
  subtitle?: string
  className?: string
}

const LoadingPage: React.FC<LoadingPageProps> = ({ 
  title = "Loading...", 
  subtitle,
  className 
}) => {
  return (
    <div className={cn("container py-10 md:py-14", className)}>
      <div className="space-y-2 mb-8">
        <Skeleton className="h-8 w-64" />
        {subtitle && <Skeleton className="h-4 w-96" />}
      </div>
      <LoadingGrid />
    </div>
  )
}

export { LoadingSpinner, LoadingCard, LoadingGrid, LoadingPage }
