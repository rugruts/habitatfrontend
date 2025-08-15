import React from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { trackPageView, trackApartmentView } from "@/components/GoogleAnalytics";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Wifi, Snowflake, ChefHat, Building2, MapPin, Bed, Bath, Users } from "lucide-react";
import Footer from "@/components/Footer";
import { supabaseHelpers } from "@/lib/supabase";

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
  base_price: number; // in cents
  currency: string;
  amenities: string[]; // parsed from JSON
  images: string[]; // parsed from JSON
  active: boolean;
  created_at: string;
}

const amenityIcons = {
  wifi: Wifi,
  ac: Snowflake,
  kitchen: ChefHat,
  elevator: Building2,
  balcony: MapPin,
  parking: Building2,
  coffee: ChefHat,
  tv: Building2,
  garden: MapPin,
};

const Apartments: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortBy, setSortBy] = React.useState("name");
  const [properties, setProperties] = React.useState<Property[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch properties from database
  React.useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const propertiesData = await supabaseHelpers.getAllProperties();

        // Transform properties data to handle JSON fields
        const transformedProperties = (propertiesData || [])
          .filter(property => property.active) // Only show active properties
          .map(property => ({
            ...property,
            amenities: typeof property.amenities === 'string'
              ? JSON.parse(property.amenities || '[]')
              : property.amenities || [],
            images: typeof property.images === 'string'
              ? JSON.parse(property.images || '[]')
              : property.images || []
          }));

        console.log('Fetched properties for Apartments page:', transformedProperties);
        setProperties(transformedProperties);
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

  const filteredApartments = React.useMemo(() => {
    const filtered = properties.filter(property =>
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (sortBy) {
      case "price-low":
        return [...filtered].sort((a, b) => a.base_price - b.base_price);
      case "price-high":
        return [...filtered].sort((a, b) => b.base_price - a.base_price);
      case "guests":
        return [...filtered].sort((a, b) => b.max_guests - a.max_guests);
      default:
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [properties, searchTerm, sortBy]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SEO
        title="Apartments in Trikala – Habitat Lobby"
        description="Explore Habitat Lobby's boutique apartments in Trikala, Greece. Book direct for best rates and curated local tips."
        canonical="/apartments"
        keywords={[
          'Trikala apartments',
          'Greece accommodation',
          'boutique apartments',
          'Habitat Lobby apartments',
          'Trikala hotels',
          'Central Greece accommodation',
          'book apartments Trikala',
          'Thessaly accommodation',
          'cycling accommodation'
        ]}
      />

      <section className="container py-10 md:py-14">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-6xl font-bold animate-slide-up">
            Our <span className="text-gradient">Apartments</span>
          </h1>
          <p className="text-muted-foreground mt-4 max-w-3xl mx-auto text-lg animate-fade-in">
            Premium, design-led stays in the heart of Trikala. Thoughtful amenities and a calm, warm aesthetic.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading apartments...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        {!loading && !error && (
          <>
            <div className="flex flex-col md:flex-row gap-4 mb-8 animate-bounce-in">
              <div className="flex-1">
                <SearchInput
                  placeholder="Search apartments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClear={() => setSearchTerm("")}
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="guests">Max Guests</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredApartments.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 mb-4">No apartments found matching your search.</p>
                <Button onClick={() => setSearchTerm("")} variant="outline">
                  Clear Search
                </Button>
              </div>
            ) : (
              filteredApartments.map((property, index) => (
                <Card key={property.id} variant="elevated" className="overflow-hidden hover-lift group" style={{animationDelay: `${index * 100}ms`}}>
                  <div className="relative overflow-hidden">
                    <img
                      src={property.images[0] || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'}
                      alt={`${property.name} interior`}
                      className="h-64 w-full object-cover bg-accent/5 transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                        <Users className="h-3 w-3 mr-1" />
                        {property.max_guests} guests
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h2 className="font-display text-xl font-semibold mb-1">{property.name}</h2>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {property.description.length > 100
                            ? `${property.description.substring(0, 100)}...`
                            : property.description}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-xs text-muted-foreground">from</p>
                        <p className="font-bold text-lg">€{Math.round(property.base_price / 100)}</p>
                        <p className="text-xs text-muted-foreground">/night</p>
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        <span>{property.bedrooms} bed</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        <span>{property.bathrooms} bath</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{property.max_guests} guests</span>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {property.amenities.slice(0, 4).map((amenity) => {
                        const Icon = amenityIcons[amenity as keyof typeof amenityIcons] || MapPin;
                        return (
                          <Badge key={amenity} variant="outline" className="text-xs">
                            <Icon className="h-3 w-3 mr-1" />
                            {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                          </Badge>
                        );
                      })}
                      {property.amenities.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{property.amenities.length - 4} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button asChild variant="hero" className="flex-1 hover-scale">
                        <Link
                          to={`/check-availability/${property.id}`}
                          onClick={() => trackApartmentView(property.name)}
                        >
                          Check Availability
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="flex-1 hover-scale">
                        <Link
                          to={`/apartments/${property.id}`}
                          onClick={() => trackApartmentView(property.name)}
                        >
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
};

export default Apartments;
