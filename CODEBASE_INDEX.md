# Habitat Lobby - Codebase Index

## 📋 Project Overview
A modern React-based boutique apartment rental website for Trikala, Greece. Built with TypeScript, Tailwind CSS, and shadcn/ui components.

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router DOM
- **State Management**: React Query (TanStack Query)
- **Build Tool**: Vite
- **Package Manager**: npm

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components + custom enhancements
│   ├── Header.tsx      # Main navigation header
│   ├── Footer.tsx      # Site footer
│   └── BookingBar.tsx  # Booking search component
├── pages/              # Route components
├── data/               # Static data and types
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── assets/             # Images and static files
```

## 🎨 Design System

### Color Palette
- **Primary**: Deep green (160 40% 25%) - Nature-inspired brand color
- **Accent**: Vibrant gold/orange (35 90% 55%) - Call-to-action color
- **Background**: Warm white/beige (40 33% 98%) - Soft, welcoming base
- **Text**: Deep brown (24 20% 12%) - High contrast readability

### Typography
- **Display Font**: Playfair Display (serif) - Elegant headings
- **Body Font**: Inter (sans-serif) - Clean, readable text

### Enhanced Features
- **Gradients**: CSS custom properties for consistent gradient usage
- **Animations**: Custom keyframes for smooth interactions
- **Glass Effects**: Modern backdrop-blur styling
- **Shadows**: Elegant shadow system with multiple levels

## 🧩 Component Library

### Core UI Components (`src/components/ui/`)

#### Enhanced Components
- **Button**: 9 variants including gradient, glass, and glow effects
- **Card**: 4 variants with hover animations and glass effects
- **SearchInput**: Advanced search with clear functionality
- **ImageGallery**: Full-featured gallery with lightbox and thumbnails
- **Loading**: Comprehensive loading states (spinner, cards, grids, pages)
- **BreadcrumbNav**: Accessible navigation breadcrumbs

#### Standard shadcn/ui Components
- Form controls (Input, Select, Checkbox, etc.)
- Layout (Dialog, Sheet, Tabs, etc.)
- Feedback (Toast, Alert, etc.)
- Data display (Table, Badge, etc.)

### Custom Components
- **Header**: Enhanced navigation with mobile menu and CTAs
- **Footer**: Site information and links
- **BookingBar**: Apartment search functionality

## 📄 Pages

### Main Routes
- **Index** (`/`): Hero section with booking, featured apartments, experiences
- **Apartments** (`/apartments`): Searchable apartment listings with filters
- **Apartment** (`/apartments/:slug`): Detailed apartment view with gallery
- **Experiences** (`/experiences`): Local activities and attractions
- **About** (`/about`): Information about Trikala
- **Contact** (`/contact`): Contact information and form
- **Blog** (`/blog`): Content and stories
- **Policies** (`/policies`): Terms and policies

### Enhanced Features
- **Search & Filter**: Real-time apartment filtering by name and amenities
- **Sorting**: Price and rating-based sorting options
- **Responsive Design**: Mobile-first approach with enhanced mobile navigation
- **Animations**: Staggered loading animations and smooth transitions

## 🎯 Interactive Features

### Search & Discovery
- **Real-time Search**: Instant filtering of apartments
- **Advanced Sorting**: Multiple sorting criteria
- **Visual Filters**: Amenity-based filtering with icons

### Media & Gallery
- **Image Gallery**: Lightbox with navigation and thumbnails
- **Responsive Images**: Optimized loading and display
- **Hover Effects**: Smooth image scaling and overlays

### Navigation & UX
- **Breadcrumbs**: Clear navigation hierarchy
- **Mobile Menu**: Slide-out navigation with smooth animations
- **Loading States**: Skeleton screens and spinners
- **Error Handling**: Graceful error states and fallbacks

## 🎨 Styling System

### Utility Classes
```css
.hover-scale         # Scale on hover with shadow
.hover-lift          # Lift effect with enhanced shadow
.animate-enter       # Fade + scale entrance animation
.animate-slide-up    # Slide up entrance
.animate-bounce-in   # Bounce entrance effect
.gradient-primary    # Primary brand gradient
.gradient-accent     # Accent gradient
.glass-effect        # Backdrop blur glass effect
.text-gradient       # Gradient text effect
```

### Animation System
- **Keyframes**: 8 custom animations (fade, scale, slide, bounce, float, pulse-glow)
- **Timing**: Consistent easing and duration
- **Performance**: GPU-accelerated transforms

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### Mobile Enhancements
- **Touch-friendly**: Larger tap targets and spacing
- **Swipe Navigation**: Carousel and gallery support
- **Sticky Elements**: Fixed booking CTAs and navigation
- **Optimized Images**: Responsive image loading

## 🔧 Development

### Key Scripts
```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint checking
```

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting (via ESLint)
- **Component Props**: Proper TypeScript interfaces

## 📊 Performance

### Optimizations
- **Code Splitting**: Route-based splitting
- **Image Optimization**: Lazy loading and responsive images
- **Bundle Size**: Tree-shaking and minimal dependencies
- **Caching**: Proper cache headers and strategies

### Accessibility
- **ARIA Labels**: Proper semantic markup
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Accessible component design
- **Color Contrast**: WCAG compliant color ratios

## 🚀 Deployment

### Build Configuration
- **Vite**: Modern build tool with HMR
- **Environment**: Production optimizations enabled
- **Assets**: Optimized and compressed
- **SEO**: Meta tags and structured data

### Browser Support
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile**: iOS Safari, Chrome Mobile
- **Features**: ES2020+ with polyfills as needed

---

*Last Updated: 2025-08-08*
*Version: 2.0.0 - Enhanced UI/UX*
