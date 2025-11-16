import React from 'react';

// High contrast mode detection
export const useHighContrast = () => {
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
export const useReducedMotion = () => {
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
export const useKeyboardNavigation = (
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



