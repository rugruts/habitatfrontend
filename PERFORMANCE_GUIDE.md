# Performance & Accessibility Guide - Habitat Lobby

## 🚀 Performance Optimizations

### Code Splitting & Lazy Loading

#### Route-based Code Splitting
```tsx
// Lazy load pages for better initial bundle size
const Apartments = lazy(() => import('./pages/Apartments'))
const Experiences = lazy(() => import('./pages/Experiences'))

// Wrap in Suspense with loading fallback
<Suspense fallback={<LoadingPage />}>
  <Routes>
    <Route path="/apartments" element={<Apartments />} />
  </Routes>
</Suspense>
```

#### Component-based Lazy Loading
```tsx
// Lazy load heavy components
const ImageGallery = lazy(() => import('./components/ui/image-gallery'))

// Use with loading state
{showGallery && (
  <Suspense fallback={<LoadingCard />}>
    <ImageGallery images={images} />
  </Suspense>
)}
```

### Image Optimization

#### Responsive Images
```tsx
// Use responsive images with proper loading
<img
  src={image.src}
  alt={image.alt}
  loading="lazy"
  className="w-full h-auto"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

#### Image Preloading
```tsx
// Preload critical images
useEffect(() => {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.href = heroImage
  document.head.appendChild(link)
}, [])
```

### Memory Management

#### Cleanup Effects
```tsx
useEffect(() => {
  const timer = setInterval(() => {
    // Some interval logic
  }, 1000)

  // Always cleanup
  return () => clearInterval(timer)
}, [])
```

#### Event Listener Cleanup
```tsx
useEffect(() => {
  const handleScroll = () => {
    // Scroll logic
  }

  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
}, [])
```

### React Optimizations

#### Memoization
```tsx
// Memoize expensive calculations
const filteredApartments = useMemo(() => {
  return apartments.filter(apt => 
    apt.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
}, [apartments, searchTerm])

// Memoize components
const ApartmentCard = memo(({ apartment }) => {
  return <Card>{/* content */}</Card>
})
```

#### Callback Optimization
```tsx
// Memoize callbacks to prevent re-renders
const handleSearch = useCallback((term: string) => {
  setSearchTerm(term)
}, [])

const handleSort = useCallback((sortBy: string) => {
  setSortBy(sortBy)
}, [])
```

## ♿ Accessibility Features

### Keyboard Navigation

#### Focus Management
```tsx
// Manage focus in modals
useEffect(() => {
  if (isOpen) {
    const firstFocusable = modalRef.current?.querySelector('button, [href], input')
    firstFocusable?.focus()
  }
}, [isOpen])
```

#### Keyboard Event Handling
```tsx
// Handle keyboard navigation
const handleKeyDown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'Escape':
      closeModal()
      break
    case 'Enter':
    case ' ':
      if (e.target === triggerRef.current) {
        openModal()
        e.preventDefault()
      }
      break
  }
}
```

### Screen Reader Support

#### ARIA Labels
```tsx
// Proper ARIA labeling
<button
  aria-label="Close dialog"
  aria-expanded={isOpen}
  aria-controls="dialog-content"
  onClick={closeModal}
>
  <X className="h-4 w-4" />
</button>

// Live regions for dynamic content
<div aria-live="polite" aria-atomic="true">
  {searchResults.length} apartments found
</div>
```

#### Semantic HTML
```tsx
// Use semantic elements
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/apartments">Apartments</a></li>
  </ul>
</nav>

<main id="main-content">
  <h1>Page Title</h1>
  {/* Main content */}
</main>
```

### Visual Accessibility

#### Color Contrast
```css
/* Ensure WCAG AA compliance */
:root {
  --text-primary: hsl(24 20% 12%);     /* 4.5:1 contrast */
  --text-secondary: hsl(24 12% 45%);   /* 3:1 contrast */
  --background: hsl(40 33% 98%);
}
```

#### Focus Indicators
```css
/* Visible focus indicators */
.focus-visible:focus {
  outline: 2px solid hsl(var(--primary));
  outline-offset: 2px;
}

/* Skip link styling */
.skip-link:focus {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 50;
  padding: 0.5rem 1rem;
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border-radius: 0.375rem;
}
```

### Motion & Animation

#### Respect User Preferences
```tsx
// Check for reduced motion preference
const prefersReducedMotion = useReducedMotion()

// Conditionally apply animations
<div className={cn(
  "transition-transform",
  !prefersReducedMotion && "hover:scale-105"
)}>
```

```css
/* CSS approach */
@media (prefers-reduced-motion: reduce) {
  .animate-bounce-in {
    animation: none;
  }
  
  .hover-scale:hover {
    transform: none;
  }
}
```

## 📊 Performance Monitoring

### Core Web Vitals

#### Largest Contentful Paint (LCP)
- **Target**: < 2.5s
- **Optimization**: Preload hero images, optimize fonts
- **Implementation**: 
  ```tsx
  // Preload critical resources
  <link rel="preload" href="/hero-image.jpg" as="image" />
  <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="" />
  ```

#### First Input Delay (FID)
- **Target**: < 100ms
- **Optimization**: Code splitting, reduce JavaScript execution time
- **Implementation**: Use React.lazy() for non-critical components

#### Cumulative Layout Shift (CLS)
- **Target**: < 0.1
- **Optimization**: Set image dimensions, avoid dynamic content insertion
- **Implementation**:
  ```tsx
  // Always specify image dimensions
  <img 
    src={src} 
    alt={alt}
    width={400}
    height={300}
    className="w-full h-auto"
  />
  ```

### Bundle Analysis

#### Webpack Bundle Analyzer
```bash
# Analyze bundle size
npm run build
npx webpack-bundle-analyzer dist/assets/*.js
```

#### Performance Budget
- **JavaScript**: < 200KB gzipped
- **CSS**: < 50KB gzipped
- **Images**: WebP format, < 500KB per image
- **Fonts**: WOFF2 format, subset for used characters

## 🔧 Development Tools

### Performance Testing
```tsx
// Performance measurement hook
const usePerformance = (name: string) => {
  useEffect(() => {
    performance.mark(`${name}-start`)
    
    return () => {
      performance.mark(`${name}-end`)
      performance.measure(name, `${name}-start`, `${name}-end`)
    }
  }, [name])
}

// Usage
const ApartmentList = () => {
  usePerformance('apartment-list-render')
  // Component logic
}
```

### Accessibility Testing
```tsx
// Focus testing helper
const useFocusTest = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        console.log('Focus moved to:', document.activeElement)
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])
}
```

### Error Monitoring
```tsx
// Error tracking
const useErrorTracking = () => {
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      // Send to monitoring service
      console.error('Runtime error:', error)
    }
    
    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])
}
```

## 📈 Best Practices

### Performance
1. **Lazy load** non-critical components
2. **Optimize images** with proper formats and sizes
3. **Minimize bundle size** with tree shaking
4. **Use CDN** for static assets
5. **Implement caching** strategies

### Accessibility
1. **Test with keyboard only** navigation
2. **Use screen reader** testing tools
3. **Validate HTML** semantics
4. **Check color contrast** ratios
5. **Test with real users** with disabilities

### Monitoring
1. **Set up performance budgets**
2. **Monitor Core Web Vitals**
3. **Track accessibility metrics**
4. **Use automated testing**
5. **Regular performance audits**

---

*Performance & Accessibility Guide v2.0.0*
*Optimized for Modern Web Standards*
