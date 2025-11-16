// Bundle optimization utilities

// Lazy load images with intersection observer
export const createLazyImage = (src: string, alt: string, className?: string) => {
  const img = document.createElement('img');
  img.alt = alt;
  img.className = className || '';
  img.loading = 'lazy';
  
  // Add placeholder while loading
  img.style.backgroundColor = '#f3f4f6';
  img.style.minHeight = '200px';
  
  // Intersection observer for lazy loading
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        img.src = src;
        img.onload = () => {
          img.style.backgroundColor = 'transparent';
        };
        observer.unobserve(img);
      }
    });
  });
  
  observer.observe(img);
  return img;
};

// Preload critical resources
export const preloadCriticalResources = () => {
  const criticalResources = [
    // Only preload resources that actually exist
    // { href: '/fonts/inter.woff2', as: 'font', type: 'font/woff2' },
    // { href: '/images/hero-bg.webp', as: 'image' },
  ];

  criticalResources.forEach(({ href, as, type }) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    if (as === 'font') link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Polyfill for requestIdleCallback
const requestIdleCallbackPolyfill = (callback: () => void) => {
  if ('requestIdleCallback' in window) {
    return requestIdleCallback(callback);
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    return setTimeout(callback, 1);
  }
};

// Prefetch routes likely to be visited
export const prefetchRoutes = (routes: string[]) => {
  requestIdleCallbackPolyfill(() => {
    routes.forEach((route) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });
  });
};

// Dynamic import with retry logic
export const dynamicImportWithRetry = async <T>(
  importFn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> => {
  try {
    return await importFn();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return dynamicImportWithRetry(importFn, retries - 1, delay * 2);
    }
    throw error;
  }
};

// Service Worker registration for caching
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      
      // Update on reload
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available
              if (confirm('New version available. Reload to update?')) {
                window.location.reload();
              }
            }
          });
        }
      });
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// Memory usage monitoring
export const monitorMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as Performance & { memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
    const used = Math.round(memory.usedJSHeapSize / 1024 / 1024);
    const total = Math.round(memory.totalJSHeapSize / 1024 / 1024);
    const limit = Math.round(memory.jsHeapSizeLimit / 1024 / 1024);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Memory: ${used}MB / ${total}MB (limit: ${limit}MB)`);
    }
    
    // Alert if memory usage is high
    if (used / limit > 0.8) {
      console.warn('High memory usage detected');
    }
    
    return { used, total, limit };
  }
  return null;
};

// Resource hints for better loading
export const addResourceHints = () => {
  // DNS prefetch for external domains
  const domains = [
    '//fonts.googleapis.com',
    '//www.google-analytics.com',
    '//js.stripe.com'
  ];
  
  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });
  
  // Preconnect to critical domains
  const criticalDomains = [
    '//fonts.gstatic.com'
  ];
  
  criticalDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Image optimization
export const optimizeImages = () => {
  // Convert images to WebP if supported
  const supportsWebP = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').startsWith('data:image/webp');
  };

  if (supportsWebP()) {
    // Replace image sources with WebP versions
    const images = document.querySelectorAll('img[data-src]');
    images.forEach((img: HTMLImageElement) => {
      const src = img.dataset.src;
      if (src && !src.includes('.webp')) {
        img.dataset.src = src.replace(/\.(jpg|jpeg|png)$/, '.webp');
      }
    });
  }
};

// Critical CSS inlining
export const inlineCriticalCSS = (css: string) => {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.insertBefore(style, document.head.firstChild);
};

// Initialize optimizations
export const initializeBundleOptimizations = () => {
  // Add resource hints
  addResourceHints();
  
  // Preload critical resources
  preloadCriticalResources();
  
  // Register service worker
  registerServiceWorker();
  
  // Monitor memory usage in development
  if (process.env.NODE_ENV === 'development') {
    setInterval(monitorMemoryUsage, 10000);
  }
  
  // Optimize images
  optimizeImages();
  
  // Prefetch likely routes
  requestIdleCallbackPolyfill(() => {
    prefetchRoutes(['/apartments', '/about', '/contact']);
  });
};
