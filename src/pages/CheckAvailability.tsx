import React from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserAvailabilityCalendar from "@/components/UserAvailabilityCalendar";
import { ArrowLeft, MapPin, Users, Wifi, Coffee, Bath, Bed, Home, Star, CheckCircle, ChefHat, Building2, Snowflake } from "lucide-react";
import Footer from "@/components/Footer";
import { supabaseHelpers } from "@/lib/supabase";

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

// Amenity icon mapping with proper icons
const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  wifi: Wifi,
  ac: Snowflake,
  kitchen: ChefHat,
  elevator: Building2,
  balcony: Home,
  parking: Building2,
  coffee: Coffee,
  tv: Building2,
  garden: MapPin,
};

// Amenity display names
const amenityLabels: Record<string, string> = {
  wifi: "Free WiFi",
  ac: "Air Conditioning",
  kitchen: "Full Kitchen",
  elevator: "Elevator Access",
  balcony: "Private Balcony",
  parking: "Free Parking",
  coffee: "Coffee Machine",
  tv: "Smart TV",
  garden: "Garden Access",
};

const CheckAvailability: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State for property data
  const [property, setProperty] = React.useState<Property | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

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
  const rating = 4.8; // Default rating - could be calculated from reviews later
  const reviews = 24; // Default review count - could be fetched from database later

  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>Check Availability - {property.name} | Habitat Lobby</title>
        <meta name="description" content={`Check availability and book ${property.name} in ${location}. ${property.description}`} />
      </Helmet>

      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-primary/90 text-white py-12">
        <div className="container">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <h1 className="font-serif text-4xl md:text-5xl mb-4">
                Check Availability
              </h1>
              <h2 className="text-2xl md:text-3xl font-light mb-4">
                {property.name}
              </h2>
              <p className="text-xl opacity-90 mb-6">
                {property.description}
              </p>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Up to {property.max_guests} guests</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bed className="h-4 w-4" />
                  <span>{property.bedrooms} bedroom{property.bedrooms > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-4 w-4" />
                  <span>{property.bathrooms} bathroom{property.bathrooms > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{property.size_sqm || 65}m²</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">
                      €{pricePerNightEuros}
                    </div>
                    <div className="text-white/80">per night</div>
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <div className="flex text-yellow-400">
                        {"★".repeat(Math.floor(rating))}
                      </div>
                      <span className="text-sm">
                        {rating} ({reviews} reviews)
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Availability Calendar */}
            <div className="lg:col-span-2">
              <UserAvailabilityCalendar
                unitSlug={id!}
                maxGuests={property.max_guests}
                onDatesSelected={(checkIn, checkOut, nights) => {
                  console.log('Dates selected:', { checkIn, checkOut, nights });
                }}
              />
            </div>

            {/* Amenities & Features */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="shadow-lg border-0 sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    What's Included
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {property.amenities.map((amenity) => {
                      const Icon = amenityIcons[amenity] || Coffee;
                      const label = amenityLabels[amenity] || amenity;
                      return (
                        <div key={amenity} className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100 hover:shadow-sm transition-shadow">
                          <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <Icon className="h-4 w-4 text-accent" />
                          </div>
                          <span className="text-sm font-medium text-gray-800">{label}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">Guest Favorites</span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Self check-in</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Great location</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Sparkling clean</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default CheckAvailability;
