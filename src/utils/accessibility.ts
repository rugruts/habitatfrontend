// Accessibility utilities

// Focus management
export class FocusManager {
  private static focusStack: HTMLElement[] = [];

  // Trap focus within an element
  static trapFocus(element: HTMLElement) {
    const focusableElements = this.getFocusableElements(element);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    element.addEventListener('keydown', handleKeyDown);
    firstElement.focus();

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }

  // Get all focusable elements within a container
  static getFocusableElements(container: HTMLElement): HTMLElement[] {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    return Array.from(container.querySelectorAll(focusableSelectors))
      .filter(element => {
        return element instanceof HTMLElement && 
               this.isElementVisible(element) && 
               !element.hasAttribute('aria-hidden');
      }) as HTMLElement[];
  }

  // Check if element is visible
  static isElementVisible(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           element.offsetParent !== null;
  }

  // Save and restore focus
  static saveFocus() {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement) {
      this.focusStack.push(activeElement);
    }
  }

  static restoreFocus() {
    const element = this.focusStack.pop();
    if (element && this.isElementVisible(element)) {
      element.focus();
    }
  }
}

// ARIA announcements
export class AriaAnnouncer {
  private static instance: AriaAnnouncer;
  private announceElement: HTMLElement;

  static getInstance(): AriaAnnouncer {
    if (!AriaAnnouncer.instance) {
      AriaAnnouncer.instance = new AriaAnnouncer();
    }
    return AriaAnnouncer.instance;
  }

  constructor() {
    this.announceElement = this.createAnnounceElement();
  }

  private createAnnounceElement(): HTMLElement {
    const element = document.createElement('div');
    element.setAttribute('aria-live', 'polite');
    element.setAttribute('aria-atomic', 'true');
    element.style.position = 'absolute';
    element.style.left = '-10000px';
    element.style.width = '1px';
    element.style.height = '1px';
    element.style.overflow = 'hidden';
    document.body.appendChild(element);
    return element;
  }

  announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    this.announceElement.setAttribute('aria-live', priority);
    this.announceElement.textContent = message;
    
    // Clear after announcement
    setTimeout(() => {
      this.announceElement.textContent = '';
    }, 1000);
  }
}

// Keyboard navigation helpers
export const KeyboardNavigation = {
  // Handle arrow key navigation for lists
  handleArrowKeys: (
    event: KeyboardEvent, 
    items: HTMLElement[], 
    currentIndex: number,
    onChange: (newIndex: number) => void
  ) => {
    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'ArrowUp':
        event.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = items.length - 1;
        break;
      default:
        return;
    }

    onChange(newIndex);
    items[newIndex]?.focus();
  },

  // Handle escape key
  handleEscape: (event: KeyboardEvent, callback: () => void) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      callback();
    }
  },

  // Handle enter/space activation
  handleActivation: (event: KeyboardEvent, callback: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  }
};

// Color contrast helpers
export const ColorContrast = {
  // Calculate contrast ratio between two colors
  getContrastRatio: (color1: string, color2: string): number => {
    const luminance1 = ColorContrast.getLuminance(color1);
    const luminance2 = ColorContrast.getLuminance(color2);
    
    const brighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);
    
    return (brighter + 0.05) / (darker + 0.05);
  },

  // Get relative luminance of a color
  getLuminance: (color: string): number => {
    const rgb = ColorContrast.hexToRgb(color);
    if (!rgb) return 0;

    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  },

  // Convert hex to RGB
  hexToRgb: (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },

  // Check if contrast meets WCAG standards
  meetsWCAG: (color1: string, color2: string, level: 'AA' | 'AAA' = 'AA'): boolean => {
    const ratio = ColorContrast.getContrastRatio(color1, color2);
    return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
  }
};

// Screen reader detection
export const ScreenReaderDetection = {
  // Detect if screen reader is likely active
  isScreenReaderActive: (): boolean => {
    // Check for common screen reader indicators
    return !!(
      navigator.userAgent.includes('NVDA') ||
      navigator.userAgent.includes('JAWS') ||
      navigator.userAgent.includes('VoiceOver') ||
      window.speechSynthesis ||
      ('speechSynthesis' in window)
    );
  }
};

// Reduced motion detection
export const MotionPreferences = {
  // Check if user prefers reduced motion
  prefersReducedMotion: (): boolean => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Apply motion preferences to element
  applyMotionPreferences: (element: HTMLElement) => {
    if (MotionPreferences.prefersReducedMotion()) {
      element.style.transition = 'none';
      element.style.animation = 'none';
    }
  }
};

// High contrast detection
export const ContrastPreferences = {
  // Check if user prefers high contrast
  prefersHighContrast: (): boolean => {
    return window.matchMedia('(prefers-contrast: high)').matches;
  }
};

// Initialize accessibility features
export const initializeAccessibility = () => {
  // Set up global keyboard navigation
  document.addEventListener('keydown', (e) => {
    // Skip to main content with Alt+S
    if (e.altKey && e.key === 's') {
      e.preventDefault();
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.focus();
        AriaAnnouncer.getInstance().announce('Skipped to main content');
      }
    }
  });

  // Announce page changes for SPAs
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(() => {
        const title = document.title;
        AriaAnnouncer.getInstance().announce(`Page changed to ${title}`);
      }, 100);
    }
  }).observe(document, { subtree: true, childList: true });

  // Apply motion preferences
  if (MotionPreferences.prefersReducedMotion()) {
    document.documentElement.style.setProperty('--animation-duration', '0s');
    document.documentElement.style.setProperty('--transition-duration', '0s');
  }
};


