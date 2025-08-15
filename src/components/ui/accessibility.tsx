import * as React from "react"
import { cn } from "@/lib/utils"

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

// High contrast mode detection
const useHighContrast = () => {
  const [isHighContrast, setIsHighContrast] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)')
    setIsHighContrast(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return isHighContrast
}

// Reduced motion detection
const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

// Keyboard navigation helper
const useKeyboardNavigation = (
  onEnter?: () => void,
  onEscape?: () => void,
  onArrowKeys?: (direction: 'up' | 'down' | 'left' | 'right') => void
) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Enter':
          onEnter?.()
          break
        case 'Escape':
          onEscape?.()
          break
        case 'ArrowUp':
          onArrowKeys?.('up')
          e.preventDefault()
          break
        case 'ArrowDown':
          onArrowKeys?.('down')
          e.preventDefault()
          break
        case 'ArrowLeft':
          onArrowKeys?.('left')
          e.preventDefault()
          break
        case 'ArrowRight':
          onArrowKeys?.('right')
          e.preventDefault()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onEnter, onEscape, onArrowKeys])
}

export {
  SkipLink,
  ScreenReaderOnly,
  FocusTrap,
  LiveRegion,
  useHighContrast,
  useReducedMotion,
  useKeyboardNavigation
}
