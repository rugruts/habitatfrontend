import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary, PageErrorFallback } from "@/components/ui/error-boundary";
import { SkipLink } from "@/components/ui/accessibility";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminProtectedRoute from "@/components/admin/ProtectedRoute";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Apartment from "./pages/Apartment";
import ApartmentDetail from "./pages/ApartmentDetail";
import RiverLoft from "./pages/RiverLoft";
import TestApartment from "./pages/TestApartment";
import Apartment1 from "./pages/GardenSuite";
import Checkout from "./pages/CheckoutEnhanced";
import BookingConfirmation from "./pages/BookingConfirmation";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminLogin from "./pages/admin/Login";
import Header from "./components/Header";
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


const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary fallback={PageErrorFallback}>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Elements stripe={stripePromise}>
            <AuthProvider>
              <AdminAuthProvider>
                <Toaster />
                <Sonner />
              <BrowserRouter future={{ v7_relativeSplatPath: true }}>
                <GoogleAnalytics trackingId={import.meta.env.VITE_GOOGLE_ANALYTICS_ID || 'G-XXXXXXXXXX'} />
                <SkipLink />
                <Header />
                <main id="main-content" className="focus:outline-none" tabIndex={-1}>
                  <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/apartments" element={<Apartments />} />
                  <Route path="/apartments/river-loft" element={<RiverLoft />} />
                  <Route path="/apartments/test-apartment" element={<TestApartment />} />
                  <Route path="/apartments/apartment-1" element={<Apartment1 />} />
                  <Route path="/apartments/:id" element={<ApartmentDetail />} />
                  <Route path="/apartment/:slug" element={<Apartment />} />
                  <Route path="/check-availability/:id" element={<CheckAvailability />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/about-trikala" element={<AboutTrikala />} />
                  <Route path="/about-trikala/cycling-city" element={<CyclingCity />} />
                  <Route path="/about-trikala/history-culture" element={<HistoryCulture />} />
                  <Route path="/about-trikala/nature-day-trips" element={<NatureDayTrips />} />
                  <Route path="/about-trikala/local-life" element={<LocalLife />} />

                  <Route path="/contact" element={<Contact />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/policies" element={<Policies />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmation />} />
                  <Route path="/view-booking/:bookingId" element={<ViewBooking />} />

                  {/* Admin Routes - Protected */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route
                    path="/admin"
                    element={
                      <AdminProtectedRoute>
                        <AdminDashboard />
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
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </BrowserRouter>
              </AdminAuthProvider>
            </AuthProvider>
          </Elements>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
