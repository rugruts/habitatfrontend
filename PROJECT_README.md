# Habitat Lobby - Enhanced UI/UX

A modern, responsive website for boutique apartment rentals in Trikala, Greece. Built with React, TypeScript, and Tailwind CSS with enhanced UI/UX features.

## ✨ Enhanced Features

### 🎨 Visual Design System
- **Modern Color Palette**: Earthy tones with vibrant accents
- **Advanced Gradients**: CSS custom properties for consistent styling
- **Enhanced Animations**: 8 custom keyframes with smooth transitions
- **Glass Effects**: Modern backdrop-blur styling
- **Elegant Shadows**: Multi-level shadow system

### 🧩 Component Library
- **Enhanced Button**: 9 variants including gradient, glass, and glow effects
- **Advanced Cards**: 4 variants with hover animations
- **Search Component**: Real-time search with clear functionality
- **Image Gallery**: Full-featured gallery with lightbox and thumbnails
- **Loading States**: Comprehensive skeleton screens and spinners
- **Error Boundaries**: Graceful error handling with recovery options

### 🎯 Interactive Features
- **Advanced Search**: Real-time apartment filtering and sorting
- **Visual Filters**: Amenity-based filtering with icons
- **Mobile Navigation**: Enhanced slide-out menu with animations
- **Breadcrumb Navigation**: Clear navigation hierarchy
- **Responsive Design**: Mobile-first with enhanced touch interactions

### ♿ Accessibility Features
- **Keyboard Navigation**: Full keyboard support with focus management
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Skip Links**: Quick navigation for assistive technologies
- **Focus Traps**: Proper modal and dialog focus management
- **Motion Preferences**: Respects user's reduced motion settings

### 🚀 Performance Optimizations
- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: Responsive images with lazy loading
- **Bundle Optimization**: Tree-shaking and minimal dependencies
- **Error Monitoring**: Comprehensive error tracking and recovery

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components (enhanced)
- **Routing**: React Router DOM
- **State Management**: React Query (TanStack Query)
- **Build Tool**: Vite
- **Accessibility**: Custom accessibility hooks and components
- **Performance**: Optimized with modern web standards

## 📚 Documentation

- **[Codebase Index](CODEBASE_INDEX.md)**: Complete project overview and architecture
- **[Component Guide](COMPONENT_GUIDE.md)**: Detailed component documentation and usage
- **[Performance Guide](PERFORMANCE_GUIDE.md)**: Performance optimization and accessibility best practices

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd habitat-lobby-trio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📜 Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build optimized production bundle
- `npm run build:dev` - Build development bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint with TypeScript support

## 📁 Enhanced Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Enhanced shadcn/ui components
│   │   ├── button.tsx  # 9 variants with animations
│   │   ├── card.tsx    # 4 variants with hover effects
│   │   ├── search.tsx  # Advanced search component
│   │   ├── image-gallery.tsx # Full-featured gallery
│   │   ├── loading.tsx # Comprehensive loading states
│   │   ├── error-boundary.tsx # Error handling
│   │   ├── accessibility.tsx # A11y helpers
│   │   └── breadcrumb-nav.tsx # Navigation breadcrumbs
│   ├── Header.tsx      # Enhanced navigation with mobile menu
│   ├── Footer.tsx      # Site footer
│   └── BookingBar.tsx  # Booking search component
├── pages/              # Route components with enhanced UX
├── data/               # Static data and TypeScript types
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── assets/             # Optimized images and static files
```

## 🎨 Design System

### Color Palette
- **Primary**: Deep green (#2D5A3D) - Nature-inspired brand color
- **Accent**: Vibrant gold (#E67E22) - Call-to-action color
- **Background**: Warm white (#FEFCF9) - Soft, welcoming base
- **Text**: Deep brown (#1F1611) - High contrast readability

### Typography
- **Display**: Playfair Display (serif) - Elegant headings
- **Body**: Inter (sans-serif) - Clean, readable text

### Animations
- **Entrance**: Fade, scale, slide, and bounce effects
- **Hover**: Scale, lift, and glow interactions
- **Loading**: Skeleton screens and spinners
- **Transitions**: Smooth 300ms easing

## 🧪 Testing & Quality

### Accessibility Testing
- Keyboard navigation testing
- Screen reader compatibility
- Color contrast validation (WCAG AA)
- Focus management verification

### Performance Testing
- Core Web Vitals monitoring
- Bundle size analysis
- Image optimization verification
- Loading performance testing

## 🚀 Deployment

### Build Optimization
```bash
# Production build with optimizations
npm run build

# Analyze bundle size
npx webpack-bundle-analyzer dist/assets/*.js
```

### Performance Targets
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)
- **Bundle Size**: < 200KB gzipped JavaScript

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the component patterns in the guides
4. Test accessibility and performance
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Enhanced UI/UX Version 2.0.0** - Modern, accessible, and performant web application
