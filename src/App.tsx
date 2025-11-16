import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SkipLink } from "@/components/ui/accessibility";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminProtectedRoute from "@/components/admin/ProtectedRoute";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { Suspense, lazy, useEffect } from "react";
import { LazyRoute } from "./components/LazyRoute";
import { LoadingState } from "./components/ui/loading";
import { initializeAccessibility } from "./utils/accessibility";
import { performanceMonitor, logBundleInfo, monitorResourceLoading } from "./utils/performance";
import { initializeBundleOptimizations } from "./utils/bundleOptimization";
import { useScrollToTop } from "./hooks/useScrollToTop";

// Lazy load heavy components
const Index = lazy(() => import("./pages/Index"));
const ApartmentDetail = lazy(() => import("./pages/ApartmentDetail"));
const Checkout = lazy(() => import("./pages/CheckoutEnhanced"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));

// Regular imports for lightweight components
import NotFound from "./pages/NotFound";
import Apartment from "./pages/Apartment";
import RiverLoft from "./pages/RiverLoft";
import TestApartment from "./pages/TestApartment";
import Apartment1 from "./pages/GardenSuite";
import BookingConfirmation from "./pages/BookingConfirmation";
import AdminLogin from "./pages/admin/Login";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Apartments from "./pages/Apartments";
import About from "./pages/About";
import AboutTrikala from "./pages/AboutTrikala";

import Contact from "./pages/Contact";
import Policies from "./pages/Policies";
import Blog from "./pages/Blog";
import FAQ from "./pages/FAQ";
import HistoryCulture from "./pages/HistoryCulture";
import NatureDayTrips from "./pages/NatureDayTrips";
import LocalLife from "./pages/LocalLife";
import CyclingCity from "./pages/CyclingCity";
import CheckAvailability from "./pages/CheckAvailability";
import ViewBooking from "./pages/ViewBooking";
import EmailTest from "./pages/EmailTest";
import PropertyContentDemo from "./pages/admin/PropertyContentDemo";
import ReviewSubmission from "./pages/ReviewSubmission";
import Reviews from "./pages/Reviews";
import PertouliGuide from "./pages/PertouliGuide";
import MillOfElves from "./pages/MillOfElves";


const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Scroll to top on route changes
  useScrollToTop();

  return (
    <>
      <GoogleAnalytics trackingId={import.meta.env.VITE_GOOGLE_ANALYTICS_ID || 'G-XXXXXXXXXX'} />
      <SkipLink />
      {!isAdminRoute && <Header />}
      <main id="main-content" className="mobile-main-content focus:outline-none" tabIndex={-1}>
        <Routes>
        <Route path="/" element={
          <LazyRoute fallback={<LoadingState message="Loading home page..." />}>
            <Index />
          </LazyRoute>
        } />
        <Route path="/apartments" element={<Apartments />} />
        <Route path="/apartments/river-loft" element={<RiverLoft />} />
        <Route path="/apartments/test-apartment" element={<TestApartment />} />
        <Route path="/apartments/apartment-1" element={<Apartment1 />} />
        <Route path="/apartments/:id" element={
          <LazyRoute fallback={<LoadingState message="Loading apartment details..." />}>
            <ApartmentDetail />
          </LazyRoute>
        } />
        <Route path="/apartment/:slug" element={<Apartment />} />
        <Route path="/check-availability/:id" element={<CheckAvailability />} />
        <Route path="/about" element={<About />} />
        <Route path="/about-trikala" element={<AboutTrikala />} />
        <Route path="/about-trikala/cycling-city" element={<CyclingCity />} />
        <Route path="/about-trikala/history-culture" element={<HistoryCulture />} />
        <Route path="/about-trikala/nature-day-trips" element={<NatureDayTrips />} />
        <Route path="/about-trikala/local-life" element={<LocalLife />} />
        <Route path="/about-trikala/mill-of-elves" element={<MillOfElves />} />

        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/policies" element={<Policies />} />
        <Route path="/checkout" element={
          <LazyRoute fallback={<LoadingState message="Loading checkout..." />}>
            <Checkout />
          </LazyRoute>
        } />
        <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmation />} />
        <Route path="/view-booking/:bookingId" element={<ViewBooking />} />
        <Route path="/review/:bookingId" element={<ReviewSubmission />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/pertouli-guide" element={<PertouliGuide />} />

        {/* Admin Routes - Protected */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <LazyRoute fallback={<LoadingState message="Loading admin dashboard..." />}>
                <AdminDashboard />
              </LazyRoute>
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        <Route path="/blog" element={<Blog />} />
        <Route path="/email-test" element={<EmailTest />} />
        <Route path="/admin/property-content-demo" element={<PropertyContentDemo />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </>
  );
};

const App = () => {
  // Initialize accessibility and performance monitoring
  useEffect(() => {
    initializeAccessibility();
    initializeBundleOptimizations();
    logBundleInfo();
    monitorResourceLoading();
    
    // Cleanup performance monitor on unmount
    return () => {
      performanceMonitor.destroy();
    };
  }, []);

  return (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Elements stripe={stripePromise}>
            <AuthProvider>
              <AdminAuthProvider>
                <Toaster />
                <Sonner />
              <BrowserRouter future={{ v7_relativeSplatPath: true }}>
                <AppContent />
              </BrowserRouter>
              </AdminAuthProvider>
            </AuthProvider>
          </Elements>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  </ErrorBoundary>
  );
};

export default App;
