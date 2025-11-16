import React from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import UserAvailabilityCalendar from "@/components/UserAvailabilityCalendar";
import {
  ArrowLeft, MapPin, Users, Wifi, Coffee, Bath, Bed, Home, Star, CheckCircle, ChefHat, Building2, Snowflake,
  Tv, AirVent, TrendingUp, Trees, Waves, Sparkles, Utensils, Car, Calendar, Award, Camera, Heart,
  Clock, Euro, Shield, Zap, CheckCircle2
} from "lucide-react";
import { supabaseHelpers } from "@/lib/supabase";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

// Review interface matching ReviewData from supabase
interface Review {
  id: string;
  property_id: string;
  guest_name: string;
  overall_rating: number;
  review_text: string;
  status: 'pending' | 'approved' | 'rejected' | 'hidden';
  created_at: string;
}

// Property interface matching Supabase structure
interface Property {
  id: string;
  name: string;
  description: string;
  city: string;
  country: string;
  address: string;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  base_price: number; // in cents
  currency: string;
  amenities: string[];
  images: string[];
  active: boolean;
  size_sqm?: number;
  min_nights?: number;
  max_nights?: number;
  check_in_time?: string;
  check_out_time?: string;
  created_at: string;
}

// Amenity icons mapping - matching ApartmentDetail.tsx exactly
const amenityIcons = {
  // Essentials
  wifi: Wifi,
  kitchen: ChefHat,
  tv: Tv,
  ac: AirVent,
  airconditioning: AirVent,
  heating: TrendingUp,
  
  // Comfort  
  parking: Car,
  balcony: MapPin,
  garden: Trees,
  terrace: MapPin,
  pool: Waves,
  gym: TrendingUp,
  
  // Services
  cleaning_service: Sparkles,
  washing_machine: Waves,
  dishwasher: Utensils,
  breakfast: Coffee,
  concierge: Users,
  
  // Accessibility
  wheelchair_accessible: Users,
  elevator: Home,
  ground_floor: Home,
  wide_doorways: Home,
  
  // Legacy/other
  coffee: Coffee,
};

const amenityLabels = {
  // Essentials
  wifi: 'WiFi',
  kitchen: 'Kitchen',
  tv: 'TV',
  ac: 'Air Conditioning',
  airconditioning: 'Air Conditioning',
  heating: 'Heating',
  
  // Comfort
  parking: 'Free Parking',
  balcony: 'Balcony',
  garden: 'Garden',
  terrace: 'Terrace',
  pool: 'Pool',
  gym: 'Gym',
  
  // Services
  cleaning_service: 'Cleaning Service',
  washing_machine: 'Washing Machine',
  dishwasher: 'Dishwasher',
  breakfast: 'Breakfast',
  concierge: 'Concierge',
  
  // Accessibility
  wheelchair_accessible: 'Wheelchair Accessible',
  elevator: 'Elevator',
  ground_floor: 'Ground Floor',
  wide_doorways: 'Wide Doorways',
  
  // Legacy
  coffee: 'Coffee Machine',
};

const CheckAvailability: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State for property data
  const [property, setProperty] = React.useState<Property | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [reviewStats, setReviewStats] = React.useState({ rating: 0, count: 0 });

  // Fetch property data from Supabase
  React.useEffect(() => {
    const fetchProperty = async () => {
      if (!id) {
        setError("Property ID not provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const properties = await supabaseHelpers.getAllProperties();
        const foundProperty = properties?.find(p => p.id === id);

        if (!foundProperty) {
          setError("Property not found");
          setLoading(false);
          return;
        }

        // Transform property data
        const transformedProperty: Property = {
          ...foundProperty,
          amenities: typeof foundProperty.amenities === 'string'
            ? JSON.parse(foundProperty.amenities || '[]')
            : foundProperty.amenities || [],
          images: typeof foundProperty.images === 'string'
            ? JSON.parse(foundProperty.images || '[]')
            : foundProperty.images || []
        };

        console.log('Loaded property for availability check:', transformedProperty);
        setProperty(transformedProperty);

        // Fetch reviews for this property directly from database
        try {
          const reviewsData = await supabaseHelpers.getAllReviews();
          
          if (reviewsData && Array.isArray(reviewsData)) {
            // Filter reviews for this specific property
            const propertyReviews = reviewsData.filter(review =>
              review.property_id === foundProperty.id && review.status === 'approved'
            );
            
            console.log('Property reviews found:', propertyReviews.length);
            console.log('All reviews data:', reviewsData.map(r => ({ id: r.id, property_id: r.property_id, status: r.status })));
            
            if (propertyReviews.length > 0) {
              const avgRating = propertyReviews.reduce((sum, review) => sum + review.overall_rating, 0) / propertyReviews.length;
              setReviewStats({
                rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
                count: propertyReviews.length
              });
              console.log('Review stats set:', { rating: Math.round(avgRating * 10) / 10, count: propertyReviews.length });
            } else {
              // No approved reviews for this property - don't show review section
              setReviewStats({ rating: 0, count: 0 });
              console.log('No approved reviews found for this property');
            }
          } else {
            // Error fetching reviews - don't show review section
            setReviewStats({ rating: 0, count: 0 });
            console.log('No review data returned');
          }
        } catch (reviewError) {
          console.error('Error fetching reviews:', reviewError);
          // Error - don't show review section
          setReviewStats({ rating: 0, count: 0 });
        }
      } catch (error) {
        console.error('Error fetching property:', error);
        setError('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="container py-20">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading property details...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error || !property) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="container py-20">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">{error || "Property not found"}</h1>
              <Button onClick={() => navigate("/apartments")}>
                View All Properties
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Calculate display values
  const pricePerNightEuros = Math.round(property.base_price / 100);
  const location = `${property.city}, ${property.country}`;
  const { rating, count: reviewCount } = reviewStats;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <Helmet>
        <title>Book {property.name} - Habitat Lobby Trikala</title>
        <meta name="description" content={`Book your stay at ${property.name} in ${location}. ${property.description}`} />
      </Helmet>

      {/* Enhanced Hero Section - Keeping Brand Identity */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative z-10 container py-12 md:py-20">
          {/* Clean Navigation */}
          <div className="flex items-center justify-between mb-12 md:mb-16">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/10 group"
            >
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              Back to Properties
            </Button>
          </div>
          
          {/* Centered Content */}
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Premium Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              <Badge className="bg-yellow-400/20 text-yellow-300 border-yellow-400/30 text-sm px-4 py-2">
                <Award className="h-4 w-4 mr-2" />
                Premium Property
              </Badge>
              <Badge className="bg-green-400/20 text-green-300 border-green-400/30 text-sm px-4 py-2">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Instant Book
              </Badge>
            </div>
            
            {/* Property Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                {property.name}
              </span>
            </h1>
            
            {/* Location & Rating */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-300" />
                <span className="text-lg text-blue-100">{location}</span>
              </div>
              {reviewCount > 0 && (
                <>
                  <div className="w-px h-6 bg-white/20"></div>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg text-blue-100">{rating} · {reviewCount} reviews</span>
                  </div>
                </>
              )}
            </div>
            
            {/* Property Description */}
            <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-12 max-w-3xl mx-auto">
              {property.description}
            </p>
            
            {/* Property Quick Info - Improved Layout */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/20">
                <Users className="h-6 w-6 md:h-8 md:w-8 text-blue-300 mx-auto mb-3" />
                <div className="text-sm text-blue-200 mb-1">Guests</div>
                <div className="font-semibold text-white text-lg">Up to {property.max_guests}</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/20">
                <Bed className="h-6 w-6 md:h-8 md:w-8 text-blue-300 mx-auto mb-3" />
                <div className="text-sm text-blue-200 mb-1">Bedrooms</div>
                <div className="font-semibold text-white text-lg">{property.bedrooms}</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/20">
                <Bath className="h-6 w-6 md:h-8 md:w-8 text-blue-300 mx-auto mb-3" />
                <div className="text-sm text-blue-200 mb-1">Bathrooms</div>
                <div className="font-semibold text-white text-lg">{property.bathrooms}</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/20">
                <Home className="h-6 w-6 md:h-8 md:w-8 text-blue-300 mx-auto mb-3" />
                <div className="text-sm text-blue-200 mb-1">Size</div>
                <div className="font-semibold text-white text-lg">{property.size_sqm || 65}m²</div>
              </div>
            </div>
            
            {/* Centered Price Banner */}
            <div className="flex items-center justify-center">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl px-8 py-6 md:px-12 md:py-8 shadow-2xl border border-blue-500/50">
                <div className="text-center">
                  <div className="text-3xl md:text-5xl font-bold mb-2">
                    €{pricePerNightEuros}
                  </div>
                  <div className="text-blue-100 text-lg md:text-xl">per night</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Booking Section */}
      <section className="py-12 md:py-20 relative">
        <div className="container">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full px-4 py-2 md:px-6 md:py-3 mb-6">
              <Calendar className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
              <span className="text-blue-800 font-semibold text-sm md:text-base">Select Your Dates</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
              Plan Your Perfect
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Trikala Experience
              </span>
            </h2>
            <p className="text-base md:text-xl text-gray-600 max-w-2xl md:max-w-3xl mx-auto leading-relaxed">
              Choose your ideal dates and let us create an unforgettable stay near the magnificent Meteora monasteries.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8" data-calendar-section>
            {/* Enhanced Calendar Section */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                  <CardTitle className="text-xl md:text-2xl text-gray-900 flex items-center gap-2 md:gap-3">
                    <Calendar className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                    Choose Your Dates
                  </CardTitle>
                  <p className="text-sm md:text-base text-gray-600">Select check-in and check-out dates to see availability and pricing</p>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <UserAvailabilityCalendar
                    unitSlug={id!}
                    maxGuests={property.max_guests}
                    onDatesSelected={(checkIn, checkOut, nights) => {
                      console.log('Dates selected:', { checkIn, checkOut, nights });
                    }}
                  />
                </CardContent>
              </Card>
            </div>
            
            {/* Modern Amenities Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* What's Included */}
              <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 border-b">
                  <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl text-gray-900">
                    <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-emerald-600" />
                    What's Included
                  </CardTitle>
                  <p className="text-xs md:text-sm text-gray-600">Premium amenities for your comfort</p>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <div className="space-y-2 md:space-y-3">
                    {(() => {
                      // Only show amenities that are officially defined in the admin editor
                      const validAmenities = Object.keys(amenityIcons);
                      const seenLabels = new Set<string>();
                      const uniqueAmenities: string[] = [];
                      
                      property.amenities.forEach((amenity) => {
                        // Only process amenities that are in our official list
                        if (validAmenities.includes(amenity)) {
                          const label = amenityLabels[amenity as keyof typeof amenityLabels];
                          const normalizedLabel = label.toLowerCase().replace(/[\s-_]/g, '');
                          
                          if (!seenLabels.has(normalizedLabel)) {
                            seenLabels.add(normalizedLabel);
                            uniqueAmenities.push(amenity);
                          }
                        }
                      });
                      
                      return uniqueAmenities.map((amenity) => {
                        const Icon = amenityIcons[amenity as keyof typeof amenityIcons];
                        const label = amenityLabels[amenity as keyof typeof amenityLabels];
                        
                        return (
                          <div key={amenity} className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gradient-to-r from-blue-50/50 to-emerald-50/50 rounded-lg md:rounded-xl border border-emerald-100/50 hover:shadow-md transition-all duration-300 group">
                            <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                              <Icon className="h-4 w-4 md:h-5 md:w-5 text-white" />
                            </div>
                            <span className="text-xs md:text-sm font-semibold text-gray-800">{label}</span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                  
                  {/* Guest Highlights */}
                  <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-700 mb-3">
                      <Zap className="h-3 w-3 md:h-4 md:w-4 text-yellow-500" />
                      <span className="font-semibold">Guest Favorites</span>
                    </div>
                    <div className="space-y-2 md:space-y-3">
                      <div className="flex items-center gap-2 md:gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-emerald-500" />
                        <span className="text-xs md:text-sm text-gray-700">Self check-in available</span>
                      </div>
                      <div className="flex items-center gap-2 md:gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <Shield className="h-3 w-3 md:h-4 md:w-4 text-blue-500" />
                        <span className="text-xs md:text-sm text-gray-700">Professional cleaning</span>
                      </div>
                      <div className="flex items-center gap-2 md:gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <Clock className="h-3 w-3 md:h-4 md:w-4 text-purple-500" />
                        <span className="text-xs md:text-sm text-gray-700">24/7 guest support</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Booking Summary Card */}
              <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
                    <Euro className="h-5 w-5 text-blue-600" />
                    Booking Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Property</span>
                      <span className="font-medium">{property.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Location</span>
                      <span className="font-medium">{location}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Guests</span>
                      <span className="font-medium">{property.max_guests} guests</span>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between text-base font-semibold">
                        <span>Price per night</span>
                        <span>€{pricePerNightEuros}</span>
                      </div>
                    </div>
                    <div className="bg-blue-100/50 rounded-lg p-3 text-center">
                      <p className="text-xs text-blue-800">
                        Final pricing will be calculated after date selection
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trust & Security Section */}
              <Card className="shadow-xl border-0 bg-gradient-to-br from-emerald-50 to-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
                    <Shield className="h-5 w-5 text-emerald-600" />
                    Safe & Secure
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm font-medium text-gray-800">Verified Property</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-800">Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
                      <Clock className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-gray-800">24/7 Support</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-gray-800">Guest Guarantee</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Guest Reviews Section */}
      {reviewCount > 0 && (
        <section className="py-12 md:py-16 bg-white">
          <div className="container">
            <div className="text-center mb-10 md:mb-12">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                What Our <span className="text-blue-600">Guests Say</span>
              </h3>
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-6 w-6 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-2xl font-bold text-gray-900 ml-2">{rating}</span>
                <span className="text-gray-600 text-lg">({reviewCount} reviews)</span>
              </div>
              
              {/* Review Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-green-50">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">Excellent Rating</h4>
                    <p className="text-sm text-gray-600">Consistently high ratings from our satisfied guests</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">Happy Guests</h4>
                    <p className="text-sm text-gray-600">{reviewCount} verified reviews from real guests</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">Top Rated</h4>
                    <p className="text-sm text-gray-600">Ranked among the best properties in Trikala</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-blue-50/80 to-indigo-50/80">
        <div className="container">
          <div className="text-center mb-10 md:mb-12">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Guests <span className="text-blue-600">Love</span> This Property
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience premium comfort with world-class amenities and unmatched hospitality
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Prime Location</h4>
                <p className="text-sm text-gray-600">Minutes from Meteora monasteries and city center attractions</p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Spotless Clean</h4>
                <p className="text-sm text-gray-600">Professional cleaning service ensuring pristine conditions</p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Instant Booking</h4>
                <p className="text-sm text-gray-600">Immediate confirmation with flexible check-in options</p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Top Rated</h4>
                <p className="text-sm text-gray-600">Consistently high guest ratings and glowing reviews</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
              Ready to Book Your Stay?
            </h3>
            <p className="text-lg md:text-xl text-blue-100 mb-6 md:mb-8">
              Join thousands of satisfied guests who have experienced the magic of Trikala and Meteora
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => document.querySelector('[data-calendar-section]')?.scrollIntoView({ behavior: 'smooth' })}
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Check Availability Now
              </Button>
              <div className="flex items-center gap-2 text-blue-200">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Free cancellation available</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
};

export default CheckAvailability;
