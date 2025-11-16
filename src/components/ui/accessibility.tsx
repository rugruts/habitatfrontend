import * as React from "react"
import { cn } from "@/lib/utils"
import { useHighContrast, useReducedMotion, useKeyboardNavigation } from "@/hooks/useAccessibility"

// Skip to main content link for keyboard navigation
interface SkipLinkProps {
  href?: string
  children?: React.ReactNode
}

const SkipLink: React.FC<SkipLinkProps> = ({ 
  href = "#main-content", 
  children = "Skip to main content" 
}) => {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg transition-all"
    >
      {children}
    </a>
  )
}

// Screen reader only text
interface ScreenReaderOnlyProps {
  children: React.ReactNode
  className?: string
}

const ScreenReaderOnly: React.FC<ScreenReaderOnlyProps> = ({ children, className }) => {
  return (
    <span className={cn("sr-only", className)}>
      {children}
    </span>
  )
}

// Focus trap for modals and dialogs
interface FocusTrapProps {
  children: React.ReactNode
  enabled?: boolean
}

const FocusTrap: React.FC<FocusTrapProps> = ({ children, enabled = true }) => {
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!enabled || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus()
          e.preventDefault()
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  }, [enabled])

  return (
    <div ref={containerRef}>
      {children}
    </div>
  )
}

// Announce changes to screen readers
interface LiveRegionProps {
  children: React.ReactNode
  politeness?: "polite" | "assertive" | "off"
  atomic?: boolean
  className?: string
}

const LiveRegion: React.FC<LiveRegionProps> = ({ 
  children, 
  politeness = "polite", 
  atomic = false,
  className 
}) => {
  return (
    <div
      aria-live={politeness}
      aria-atomic={atomic}
      className={cn("sr-only", className)}
    >
      {children}
    </div>
  )
}

export {
  SkipLink,
  ScreenReaderOnly,
  FocusTrap,
  LiveRegion
}
