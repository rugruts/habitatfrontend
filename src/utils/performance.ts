// Performance monitoring utilities

interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint?: number;
  firstInputDelay?: number;
  cumulativeLayoutShift?: number;
}

// Performance observer for Core Web Vitals
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  constructor() {
    this.initializeObservers();
    this.trackBasicMetrics();
  }

  private initializeObservers() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.largestContentfulPaint = lastEntry.startTime;
          this.reportMetric('lcp', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn('LCP observer not supported', e);
      }

      // First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            const fid = entry.processingStart - entry.startTime;
            this.metrics.firstInputDelay = fid;
            this.reportMetric('fid', fid);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (e) {
        console.warn('FID observer not supported', e);
      }

      // Cumulative Layout Shift (CLS)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: PerformanceEntry & { hadRecentInput?: boolean; value?: number }) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          this.metrics.cumulativeLayoutShift = clsValue;
          this.reportMetric('cls', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (e) {
        console.warn('CLS observer not supported', e);
      }
    }
  }

  private trackBasicMetrics() {
    // Wait for page load
    if (document.readyState === 'loading') {
      window.addEventListener('load', () => this.calculateBasicMetrics());
    } else {
      this.calculateBasicMetrics();
    }
  }

  private calculateBasicMetrics() {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');

    if (navigation) {
      this.metrics.loadTime = navigation.loadEventEnd - navigation.fetchStart;
      this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
    }

    paint.forEach((entry) => {
      if (entry.name === 'first-paint') {
        this.metrics.firstPaint = entry.startTime;
      } else if (entry.name === 'first-contentful-paint') {
        this.metrics.firstContentfulPaint = entry.startTime;
      }
    });

    this.reportBasicMetrics();
  }

  private reportMetric(name: string, value: number) {
    // Report to analytics
    if (window.gtag) {
      window.gtag('event', 'web_vital', {
        custom_parameter_vital_name: name,
        custom_parameter_vital_value: Math.round(value),
      });
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`${name.toUpperCase()}: ${Math.round(value)}ms`);
    }
  }

  private reportBasicMetrics() {
    Object.entries(this.metrics).forEach(([key, value]) => {
      if (value !== undefined) {
        this.reportMetric(key, value);
      }
    });
  }

  // Get current metrics
  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  // Measure custom performance
  measureFunction<T>(name: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    
    this.reportMetric(`custom_${name}`, duration);
    return result;
  }

  // Measure async function
  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;
    
    this.reportMetric(`custom_${name}`, duration);
    return result;
  }

  // Clean up observers
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Initialize performance monitoring
export const performanceMonitor = PerformanceMonitor.getInstance();

// React hook for performance monitoring
export const usePerformanceMonitor = () => {
  const monitor = PerformanceMonitor.getInstance();
  
  return {
    getMetrics: () => monitor.getMetrics(),
    measureFunction: <T>(name: string, fn: () => T) => monitor.measureFunction(name, fn),
    measureAsync: <T>(name: string, fn: () => Promise<T>) => monitor.measureAsync(name, fn)
  };
};

// Bundle size monitoring
export const logBundleInfo = () => {
  if (process.env.NODE_ENV === 'development') {
    // Log chunk sizes
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    console.group('Bundle Information');
    scripts.forEach((script: HTMLScriptElement) => {
      if (script.src.includes(window.location.origin)) {
        console.log('Script:', script.src.split('/').pop());
      }
    });
    console.groupEnd();
  }
};

// Resource loading monitoring
export const monitorResourceLoading = () => {
  if ('PerformanceObserver' in window) {
    const resourceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const resource = entry as PerformanceResourceTiming;
        
        // Log slow resources in development
        if (process.env.NODE_ENV === 'development' && resource.duration > 1000) {
          console.warn(`Slow resource: ${resource.name} (${Math.round(resource.duration)}ms)`);
        }
        
        // Track resource loading in analytics
        if (window.gtag && resource.duration > 2000) {
          window.gtag('event', 'slow_resource', {
            resource_name: resource.name.split('/').pop(),
            duration: Math.round(resource.duration),
          });
        }
      });
    });
    
    resourceObserver.observe({ entryTypes: ['resource'] });
  }
};
