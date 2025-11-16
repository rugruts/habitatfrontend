import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { trackPageView, trackApartmentView } from "@/utils/analytics";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star, Wifi, Snowflake, ChefHat, Building2, MapPin,
  Users, Calendar, Euro, Clock, Award, CheckCircle2,
  ChevronLeft, ChevronRight, Mountain, Camera, Heart,
  AlertCircle, Bed, Bath, Quote, Tv, AirVent, TrendingUp, 
  Trees, Waves, Sparkles, Utensils, Coffee, Car, Home
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { realAttractions } from "@/data/apartments";
import { supabaseHelpers } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import "@/styles/apartments-animations.css";

// Property interface for database properties
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
  base_price: number;
  currency: string;
  amenities: string[];
  images: string[];
  active: boolean;
  created_at: string;
  rating?: number;
  reviews_count?: number;
  instant_book?: boolean;
  verified?: boolean;
  reviews?: ReviewData[];
}

// Review interface from the database
interface ReviewData {
  id: string;
  property_id: string;
  guest_name: string;
  guest_email: string;
  guest_avatar_url?: string;
  overall_rating: number;
  title?: string;
  review_text: string;
  stay_date: string;
  nights_stayed: number;
  guest_count: number;
  trip_type?: string;
  is_verified: boolean;
  is_featured: boolean;
  photos: string[];
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

const PropertyCard: React.FC<{
  property: Property;
  index: number;
  featured?: boolean;
}> = ({ property, index, featured = false }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };
  
  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const handlePropertyClick = () => {
    trackApartmentView(property.id);
  };

  return (
    <Card
      className={cn(
        "overflow-hidden group transition-all duration-500 hover:shadow-2xl animate-fade-in-up bg-white/95 backdrop-blur-lg border border-gray-100 shadow-lg",
        "hover:scale-[1.01] transform hover:-translate-y-2",
        "flex flex-col md:flex-row w-full max-w-full",
        "rounded-2xl"
      )}
      style={{
        animationDelay: `${index * 200}ms`,
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section - Expanded Gallery */}
      <div className={cn(
        "relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0",
        "md:w-1/2 h-[240px] md:h-[320px]"
      )}>
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-indigo-50 to-purple-100 animate-pulse" />
        )}
        
        <img
          src={property.images[currentImageIndex] || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'}
          alt={`${property.name} - Image ${currentImageIndex + 1}`}
          className={cn(
            "w-full h-full object-cover transition-all duration-1000",
            imageLoaded ? "opacity-100 group-hover:scale-110" : "opacity-0",
            isHovered ? "brightness-110 saturate-110" : "brightness-100 saturate-100"
          )}
          onLoad={() => setImageLoaded(true)}
        />
        

        
        {/* Image Navigation */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110 z-10"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-16 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110 z-10"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            

          </>
        )}
        
        {/* Reviews Badge */}
        <div className="absolute top-4 left-4">
          {property.reviews && property.reviews.length > 0 ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5 bg-yellow-400/95 backdrop-blur-sm rounded-full px-4 py-2.5 shadow-lg">
                <Star className="h-4 w-4 fill-yellow-900 text-yellow-900" />
                <span className="text-sm font-bold text-yellow-900">{property.rating.toFixed(1)}</span>
                <span className="text-xs text-yellow-800">({property.reviews_count})</span>
              </div>
              <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg max-w-[200px]">
                <p className="text-xs text-gray-700 italic leading-tight">
                  "{property.reviews[0].review_text.length > 60 
                    ? `${property.reviews[0].review_text.substring(0, 60)}...`
                    : property.reviews[0].review_text}"
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs font-medium text-gray-600">
                    {property.reviews[0].guest_name}
                  </span>
                  {property.reviews[0].is_verified && (
                    <CheckCircle2 className="h-2.5 w-2.5 text-green-500" />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-blue-500/95 backdrop-blur-sm rounded-full px-4 py-2.5 shadow-lg">
              <Sparkles className="h-4 w-4 text-white" />
              <span className="text-sm font-bold text-white">New</span>
            </div>
          )}
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-4 right-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl px-5 py-3 shadow-xl">
          <div className="text-right">
            <div className="text-2xl font-bold">
              €{Math.round(property.base_price / 100)}
            </div>
            <div className="text-sm opacity-90">per night</div>
          </div>
        </div>
      </div>

      {/* Content Section - Enhanced Horizontal Layout */}
      <CardContent className="p-5 md:p-6 flex-1 flex flex-col justify-between md:w-1/2 space-y-4">
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between items-start gap-3">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                {property.name}
              </h3>
            </div>
            
            <div className="flex items-center gap-2 text-gray-500">
              <MapPin className="h-3.5 w-3.5 text-blue-500" />
              <span className="text-sm font-medium">{property.city}, {property.country}</span>
            </div>
            
            <p className="text-gray-600 leading-relaxed text-sm">
              {property.description.length > 120
                ? `${property.description.substring(0, 120)}...`
                : property.description}
            </p>
          </div>

          {/* Property Details */}
          <div className="flex items-center gap-3 py-2 px-3 bg-gray-50/70 rounded-lg">
            <div className="flex items-center gap-1.5 text-gray-700">
              <Bed className="h-3.5 w-3.5 text-gray-500" />
              <span className="text-xs font-medium">{property.bedrooms}</span>
              <span className="text-xs text-gray-500">bed{property.bedrooms !== 1 ? 's' : ''}</span>
            </div>
            <div className="w-px h-3 bg-gray-300"></div>
            <div className="flex items-center gap-1.5 text-gray-700">
              <Bath className="h-3.5 w-3.5 text-gray-500" />
              <span className="text-xs font-medium">{property.bathrooms}</span>
              <span className="text-xs text-gray-500">bath{property.bathrooms !== 1 ? 's' : ''}</span>
            </div>
            <div className="w-px h-3 bg-gray-300"></div>
            <div className="flex items-center gap-1.5 text-gray-700">
              <Users className="h-3.5 w-3.5 text-gray-500" />
              <span className="text-xs font-medium">{property.max_guests}</span>
              <span className="text-xs text-gray-500">guest{property.max_guests !== 1 ? 's' : ''}</span>
            </div>
          </div>



          {/* Amenities - Matching ApartmentDetail Logic */}
          <div className="flex flex-wrap gap-1.5">
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
                  <div key={amenity} className="flex items-center gap-1.5 bg-blue-50/80 rounded-lg px-2 py-1 border border-blue-100">
                    <Icon className="h-3 w-3 text-blue-600" />
                    <span className="text-xs font-medium text-gray-700">{label}</span>
                  </div>
                );
              });
            })()}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            asChild
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 h-10 text-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg"
            onClick={handlePropertyClick}
          >
            <Link to={`/check-availability/${property.id}`}>
              <Calendar className="h-4 w-4 mr-1.5" />
              Book Now
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="flex-1 border border-gray-200 hover:border-blue-300 font-semibold py-2.5 h-10 text-sm hover:bg-blue-50 transition-all duration-300 rounded-lg whitespace-nowrap"
          >
            <Link to={`/apartments/${property.id}`}>
              Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const LocationHighlight: React.FC = () => (
  <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-12 mb-16 animate-fade-in overflow-hidden">
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute inset-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        opacity: 0.2
      }}></div>
    </div>
    
    <div className="relative z-10">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
          <MapPin className="h-4 w-4 text-white" />
          <span className="text-white font-medium text-sm">Prime Location</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          Heart of Historic
          <br />
          <span className="bg-gradient-to-r from-yellow-200 to-yellow-100 bg-clip-text text-transparent">
            Trikala
          </span>
        </h2>
        <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
          Discover the perfect harmony of ancient heritage and modern comfort. Stay minutes away from
          UNESCO World Heritage Meteora monasteries, traditional tavernas, and the enchanting Lithaios River.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {realAttractions.slice(0, 3).map((attraction, index) => (
          <div
            key={index}
            className="group bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-500 animate-fade-in-up border border-white/20"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                {attraction.name}
              </h3>
              <Badge
                variant="outline"
                className="text-xs border-blue-200 text-blue-700 bg-blue-50/80 group-hover:bg-blue-100 transition-colors"
              >
                {attraction.type}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span className="font-medium">{attraction.distance}</span>
              </div>
              <span className="text-blue-600 font-bold px-3 py-1 bg-blue-50 rounded-full text-sm group-hover:bg-blue-100 transition-colors">
                {attraction.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Apartments: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const propertiesData = await supabaseHelpers.getAllProperties();

        // Fetch reviews for each property
        const propertiesWithReviews = await Promise.all(
          (propertiesData || [])
            .filter(property => property.active)
            .map(async (property) => {
              try {
                // Get reviews and review stats for this property
                const [reviews, reviewStats] = await Promise.all([
                  supabaseHelpers.getPropertyReviews(property.id, 3),
                  supabaseHelpers.getPropertyReviewStats(property.id)
                ]);

                // Parse and deduplicate amenities
                const rawAmenities = typeof property.amenities === 'string'
                  ? JSON.parse(property.amenities || '[]')
                  : property.amenities || [];

                // Deduplicate amenities by normalizing them
                const uniqueAmenities = Array.from(new Set(
                  rawAmenities
                    .filter(Boolean) // Remove empty/null values
                    .map((amenity: string) => amenity.trim()) // Remove whitespace
                    .filter((amenity: string) => amenity.length > 0) // Remove empty strings
                ));

                return {
                  ...property,
                  amenities: uniqueAmenities,
                  images: typeof property.images === 'string'
                    ? JSON.parse(property.images || '[]')
                    : property.images || [],
                  // Use real review data
                  rating: reviewStats.averageRating || 0,
                  reviews_count: reviewStats.totalReviews || 0,
                  reviews: reviews || [],
                  verified: true,
                };
              } catch (reviewError) {
                console.error('Error fetching reviews for property:', property.id, reviewError);
                
                // Parse and deduplicate amenities for fallback too
                const rawAmenities = typeof property.amenities === 'string'
                  ? JSON.parse(property.amenities || '[]')
                  : property.amenities || [];

                const uniqueAmenities = Array.from(new Set(
                  rawAmenities
                    .filter(Boolean)
                    .map((amenity: string) => amenity.trim())
                    .filter((amenity: string) => amenity.length > 0)
                ));
                
                // Fallback to basic property data if reviews fail
                return {
                  ...property,
                  amenities: uniqueAmenities,
                  images: typeof property.images === 'string'
                    ? JSON.parse(property.images || '[]')
                    : property.images || [],
                  rating: 0,
                  reviews_count: 0,
                  reviews: [],
                  verified: true,
                };
              }
            })
        );

        setProperties(propertiesWithReviews);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setError('Failed to load properties. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
    trackPageView('apartments');
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <SEO 
          title="Our Apartments - Habitat Lobby Trikala"
          description="Discover our premium apartments in Trikala, Greece. Perfect location near UNESCO Meteora."
        />
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-16 bg-gray-200 rounded-lg w-96 mx-auto mb-6"></div>
            <div className="h-8 bg-gray-200 rounded-lg w-64 mx-auto mb-12"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="h-72 bg-gray-200 animate-shimmer"></div>
                  <div className="p-8 space-y-4">
                    <div className="h-8 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Properties</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // For boutique hotel, all properties are featured equally
  const featuredProperties = properties;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill-opacity='0.03'%3E%3Cpolygon fill='%23000' points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <SEO
        title="Our Apartments - Habitat Lobby Trikala"
        description="Discover our premium apartments in Trikala, Greece. Perfect location near UNESCO World Heritage Meteora monasteries and the historic city center."
        keywords={["Trikala apartments", "Meteora accommodation", "Greece vacation rental", "Lithaios river", "boutique hotel"]}
      />
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-100 to-indigo-100 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
            <Building2 className="h-5 w-5 text-blue-600" />
            <span className="text-blue-800 font-semibold text-sm">Premium Accommodation</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Discover Our
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Curated Spaces
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 max-w-5xl mx-auto leading-relaxed mb-10">
            Immerse yourself in the timeless beauty of Trikala through our thoughtfully designed apartments.
            Each residence offers a perfect blend of contemporary luxury and authentic Greek character,
            positioned strategically near the world-renowned Meteora monasteries.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="font-medium text-gray-700">UNESCO Meteora 15min</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="font-medium text-gray-700">Historic Center Location</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="font-medium text-gray-700">Lithaios River Views</span>
            </div>
          </div>
        </div>

        {/* Location Highlight */}
        <LocationHighlight />

        {properties.length === 0 ? (
          <div className="text-center py-20 bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl">
            <div className="text-8xl mb-6">🏛️</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Curating Your Perfect Stay</h3>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              We're thoughtfully preparing exceptional accommodations for your Trikala experience.
              Contact us for personalized recommendations.
            </p>
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 px-8">
              <Link to="/contact">
                <MapPin className="h-4 w-4 mr-2" />
                Contact Our Team
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Featured Properties Section */}
            <div className="mb-20">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-full px-4 py-2 mb-6">
                  <Award className="h-4 w-4 text-amber-600" />
                  <span className="text-amber-800 font-semibold text-sm">Curated Collection</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  Premium Trikala
                  <br />
                  <span className="text-blue-600">Residences</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  Every apartment in our portfolio represents the pinnacle of comfort and style. From intimate studios
                  to spacious family suites, each space tells its own story while maintaining our commitment to exceptional hospitality.
                </p>
              </div>
              
              <div className="flex flex-col gap-8 max-w-7xl mx-auto">
                {featuredProperties.map((property, index) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    index={index}
                    featured={true}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Enhanced Call to Action */}
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-12 md:p-16 text-center text-white animate-fade-in overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Star className="h-4 w-4 text-yellow-300" />
              <span className="text-white font-medium text-sm">5-Star Rated Experience</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Begin Your Trikala
              <br />
              <span className="bg-gradient-to-r from-yellow-200 to-yellow-100 bg-clip-text text-transparent">
                Adventure
              </span>
            </h2>
            <p className="text-xl md:text-2xl mb-10 text-blue-100 leading-relaxed max-w-3xl mx-auto">
              Join hundreds of satisfied guests who have discovered the perfect harmony of luxury,
              location, and authentic Greek hospitality in the heart of historic Trikala.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-10 py-4 h-14 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Link to="/check-availability">
                  <Calendar className="h-5 w-5 mr-3" />
                  Check Availability
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-blue-600 font-bold px-10 py-4 h-14 text-lg rounded-xl transition-all duration-300"
              >
                <Link to="/contact">
                  <MapPin className="h-5 w-5 mr-3" />
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Apartments;
