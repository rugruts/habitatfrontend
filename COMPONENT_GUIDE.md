# Component Guide - Habitat Lobby

## 🎨 Enhanced UI Components

### Button Component
**Location**: `src/components/ui/button.tsx`

Enhanced with 9 variants and improved animations:

```tsx
// Basic usage
<Button variant="default">Click me</Button>

// Enhanced variants
<Button variant="hero">Book Now</Button>        // Gradient with glow
<Button variant="gradient">Primary Action</Button> // Primary gradient
<Button variant="glass">Glass Effect</Button>   // Backdrop blur
<Button variant="glow">Glowing Button</Button>  // Glow on hover

// Sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
```

### Card Component
**Location**: `src/components/ui/card.tsx`

Enhanced with 4 variants and hover effects:

```tsx
// Variants
<Card variant="default">Standard card</Card>
<Card variant="elevated">Elevated with hover lift</Card>
<Card variant="glass">Glass effect card</Card>
<Card variant="gradient">Gradient background</Card>

// Usage with content
<Card variant="elevated" className="hover-lift">
  <CardContent>
    <h3>Card Title</h3>
    <p>Card content...</p>
  </CardContent>
</Card>
```

### SearchInput Component
**Location**: `src/components/ui/search.tsx`

Advanced search input with clear functionality:

```tsx
const [searchTerm, setSearchTerm] = useState("")

<SearchInput
  placeholder="Search apartments..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  onClear={() => setSearchTerm("")}
  showClearButton={true}
  containerClassName="w-full"
/>
```

### ImageGallery Component
**Location**: `src/components/ui/image-gallery.tsx`

Full-featured image gallery with lightbox:

```tsx
const images = ["/image1.jpg", "/image2.jpg", "/image3.jpg"]

<ImageGallery
  images={images}
  alt="Apartment gallery"
  aspectRatio="video" // "square" | "video" | "auto"
  className="mb-6"
/>
```

Features:
- Lightbox modal with navigation
- Thumbnail navigation
- Keyboard support
- Touch/swipe support
- Image counter
- Zoom on hover

### Loading Components
**Location**: `src/components/ui/loading.tsx`

Comprehensive loading states:

```tsx
// Spinner
<LoadingSpinner size="md" />

// Card skeleton
<LoadingCard />

// Grid of loading cards
<LoadingGrid count={6} />

// Full page loading
<LoadingPage title="Loading apartments..." />
```

### BreadcrumbNav Component
**Location**: `src/components/ui/breadcrumb-nav.tsx`

Accessible navigation breadcrumbs:

```tsx
const breadcrumbItems = [
  { label: "Apartments", href: "/apartments" },
  { label: "River Loft", current: true }
]

<BreadcrumbNav items={breadcrumbItems} />
```

## 🎯 Custom Components

### Header Component
**Location**: `src/components/Header.tsx`

Enhanced navigation with mobile menu:

Features:
- Responsive design (desktop/mobile)
- Slide-out mobile menu
- Active state indicators
- CTA buttons
- Smooth animations

```tsx
// Automatically included in App.tsx
// No props needed - self-contained
```

### BookingBar Component
**Location**: `src/components/BookingBar.tsx`

Apartment search functionality:

```tsx
// Standard usage
<BookingBar />

// Compact version
<BookingBar compact={true} />

// With custom styling
<BookingBar className="custom-styles" />
```

Features:
- Date selection
- Guest count selection
- Responsive layout
- Form validation

## 🎨 Styling System

### Utility Classes

#### Hover Effects
```css
.hover-scale    /* Scale + shadow on hover */
.hover-lift     /* Lift + enhanced shadow */
```

#### Animations
```css
.animate-enter      /* Fade + scale entrance */
.animate-fade-in    /* Simple fade in */
.animate-slide-up   /* Slide up from bottom */
.animate-bounce-in  /* Bounce entrance */
.animate-float      /* Floating animation */
```

#### Gradients
```css
.gradient-primary   /* Primary brand gradient */
.gradient-accent    /* Accent gradient */
.gradient-hero      /* Hero section gradient */
.gradient-card      /* Card background gradient */
.text-gradient      /* Gradient text effect */
```

#### Effects
```css
.glass-effect       /* Backdrop blur glass */
.shadow-elegant     /* Elegant shadow */
.shadow-glow        /* Glowing shadow */
```

### Animation Examples

```tsx
// Staggered animations
{items.map((item, index) => (
  <Card 
    key={item.id}
    className="animate-fade-in hover-lift"
    style={{animationDelay: `${index * 100}ms`}}
  >
    {/* Content */}
  </Card>
))}

// Entrance animations
<div className="animate-slide-up">
  <h1>Animated heading</h1>
</div>

// Hover effects
<Button className="hover-scale">
  Interactive button
</Button>
```

## 📱 Responsive Patterns

### Mobile-First Approach
```tsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Responsive text
<h1 className="text-2xl md:text-4xl lg:text-6xl">

// Responsive spacing
<section className="py-8 md:py-12 lg:py-16">

// Responsive visibility
<div className="hidden lg:block">Desktop only</div>
<div className="lg:hidden">Mobile/tablet only</div>
```

### Breakpoint Usage
- **Mobile**: Base styles, single column layouts
- **md (768px+)**: Tablet adjustments, 2-column grids
- **lg (1024px+)**: Desktop features, 3+ column grids

## 🎯 Best Practices

### Component Usage
1. **Always use TypeScript interfaces** for props
2. **Implement proper error boundaries** for complex components
3. **Use semantic HTML** for accessibility
4. **Include ARIA labels** where needed
5. **Optimize images** with proper alt text

### Performance
1. **Lazy load images** with `loading="lazy"`
2. **Use React.memo** for expensive components
3. **Implement proper key props** in lists
4. **Avoid inline styles** - use CSS classes

### Accessibility
1. **Keyboard navigation** support
2. **Screen reader** compatibility
3. **Color contrast** compliance
4. **Focus management** in modals/dialogs

### Code Organization
1. **Group related components** in folders
2. **Export from index files** for clean imports
3. **Use consistent naming** conventions
4. **Document complex logic** with comments

---

*Component Guide v2.0.0*
*Enhanced UI/UX Implementation*
