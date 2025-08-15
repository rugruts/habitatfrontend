import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ImageGallery } from "@/components/ui/image-gallery";
import { BookingWidget } from "@/components/BookingWidget";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { StickyMobileCTA } from "@/components/ui/sticky-mobile-cta";
import {
  Wifi,
  Snowflake,
  ChefHat,
  MapPin,
  Star,
  Users,
  Bed,
  Bath,
  ArrowLeft,
  Calendar,
  Clock,
  Shield,
  Check,
  Coffee,
  Bike,
  Camera,
  Phone,
  Mail,
  Car,
  Utensils,
  Wind,
  Tv,
  Waves,
  Home,
  AirVent,
  X
} from "lucide-react";
import Footer from "@/components/Footer";
import { supabaseHelpers } from "@/lib/supabase";

// Property interface - matches admin editor
interface Property {
  id: string;
  name: string;
  slug?: string;
  description: string;
  city: string;
  country: string;
  address: string;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  size_sqm?: number;
  base_price: number; // in cents
  cleaning_fee?: number; // in cents
  security_deposit?: number; // in cents
  min_nights?: number;
  max_nights?: number;
  check_in_time?: string;
  check_out_time?: string;
  currency: string;
  amenities: string[];
  images: string[];
  active: boolean;
  created_at: string;
  // New editable sections
  about_space?: string;
  the_space?: string;
  location_neighborhood?: string;
  house_rules?: string;
}

// Amenity icons mapping
const amenityIcons = {
  wifi: Wifi,
  ac: Snowflake,
  kitchen: ChefHat,
  elevator: Home,
  balcony: MapPin,
  parking: Car,
  coffee: Coffee,
  tv: Tv,
  garden: Waves,
  airconditioning: AirVent,
};

const ApartmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

        console.log('Loaded property:', transformedProperty);
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
              <p className="text-gray-600">Loading apartment details...</p>
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
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Apartment Not Found</h1>
            <p className="text-gray-600 mb-6">{error || "The apartment you're looking for doesn't exist."}</p>
            <div className="flex gap-4 justify-center">
              <Button asChild variant="outline">
                <Link to="/apartments">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Apartments
                </Link>
              </Button>
              <Button asChild>
                <Link to="/">Go Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Apartments", href: "/apartments" },
    { label: property.name, href: `/apartments/${property.id}` }
  ];

  // Default images if none provided
  const propertyImages = property.images.length > 0 
    ? property.images 
    : [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800'
      ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>{property.name} – Habitat Lobby</title>
        <meta name="description" content={property.description} />
        <link rel="canonical" href={`https://habitat-lobby.lovable.app/apartments/${property.id}`} />
      </Helmet>

      {/* Breadcrumb Navigation */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-4">
          <BreadcrumbNav items={breadcrumbItems} />
        </div>
      </div>

      {/* Back Button */}
      <div className="container pt-6">
        <Button variant="ghost" asChild className="mb-6 hover-scale">
          <Link to="/apartments">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Apartments
          </Link>
        </Button>
      </div>

      <div className="container pb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="space-y-4 animate-slide-up">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{property.address}, {property.city}, {property.country}</span>
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl font-bold">
                {property.name}
              </h1>
              
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-current text-yellow-500" />
                  <span className="font-medium">4.9</span>
                  <span className="text-muted-foreground">(47 reviews)</span>
                </div>
                <Badge variant="secondary">
                  <Users className="h-3 w-3 mr-1" />
                  Up to {property.max_guests} guests
                </Badge>
                <Badge variant="secondary">
                  <Bed className="h-3 w-3 mr-1" />
                  {property.bedrooms} bedroom{property.bedrooms !== 1 ? 's' : ''}
                </Badge>
                <Badge variant="secondary">
                  <Bath className="h-3 w-3 mr-1" />
                  {property.bathrooms} bathroom{property.bathrooms !== 1 ? 's' : ''}
                </Badge>
                {property.size_sqm && (
                  <Badge variant="secondary">
                    <Home className="h-3 w-3 mr-1" />
                    {property.size_sqm} m²
                  </Badge>
                )}
              </div>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Image Gallery */}
            <div className="animate-fade-in">
              <ImageGallery
                images={propertyImages}
                alt={`${property.name} interior`}
                className="rounded-xl overflow-hidden"
              />
            </div>

            {/* Property Details */}
            <Card className="animate-bounce-in">
              <CardContent className="p-6">
                <h2 className="font-display text-2xl font-semibold mb-6">Property Details</h2>

                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Bed className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{property.bedrooms} Bedroom{property.bedrooms !== 1 ? 's' : ''}</p>
                      <p className="text-sm text-muted-foreground">Comfortable sleeping</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Bath className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{property.bathrooms} Bathroom{property.bathrooms !== 1 ? 's' : ''}</p>
                      <p className="text-sm text-muted-foreground">Full amenities</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Up to {property.max_guests} Guests</p>
                      <p className="text-sm text-muted-foreground">Maximum capacity</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Amenities */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Amenities</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {property.amenities.map((amenity) => {
                      const Icon = amenityIcons[amenity as keyof typeof amenityIcons] || Check;
                      return (
                        <div key={amenity} className="flex items-center gap-3">
                          <Icon className="h-4 w-4 text-primary" />
                          <span className="capitalize">{amenity.replace('_', ' ')}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About This Space */}
            <Card className="animate-bounce-in">
              <CardContent className="p-6">
                <h2 className="font-display text-2xl font-semibold mb-6">About This Space</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {property.description}
                  </p>
                  {property.about_space && (
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {property.about_space}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* The Space */}
            <Card className="animate-bounce-in">
              <CardContent className="p-6">
                <h2 className="font-display text-2xl font-semibold mb-6">The Space</h2>
                {property.the_space ? (
                  <div className="prose prose-gray max-w-none">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {property.the_space}
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Home className="h-5 w-5 text-primary" />
                        Living Areas
                      </h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          Comfortable seating for {property.max_guests} guests
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          {property.bedrooms} bedroom{property.bedrooms !== 1 ? 's' : ''}
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          {property.bathrooms} bathroom{property.bathrooms !== 1 ? 's' : ''}
                        </li>
                        {property.size_sqm && (
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-600" />
                            {property.size_sqm} m² living space
                          </li>
                        )}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <ChefHat className="h-5 w-5 text-primary" />
                        Amenities
                      </h3>
                      <ul className="space-y-2 text-muted-foreground">
                        {property.amenities.slice(0, 4).map((amenity, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-600" />
                            {amenity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location & Neighborhood */}
            <Card className="animate-bounce-in">
              <CardContent className="p-6">
                <h2 className="font-display text-2xl font-semibold mb-6">Location & Neighborhood</h2>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span className="font-medium">{property.address}</span>
                  </div>
                  {property.location_neighborhood ? (
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {property.location_neighborhood}
                    </p>
                  ) : (
                    <p className="text-muted-foreground leading-relaxed">
                      Located in {property.city}, {property.country}. This area offers convenient access
                      to local attractions, restaurants, and amenities.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* House Rules */}
            <Card className="animate-bounce-in">
              <CardContent className="p-6">
                <h2 className="font-display text-2xl font-semibold mb-6">House Rules</h2>
                {property.house_rules ? (
                  <div className="prose prose-gray max-w-none">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {property.house_rules}
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        Check-in & Check-out
                      </h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>Check-in: {property.check_in_time || '15:00'}</li>
                        <li>Check-out: {property.check_out_time || '11:00'}</li>
                        <li>Self check-in with keybox</li>
                        <li>Late check-in available upon request</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        During Your Stay
                      </h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>Maximum {property.max_guests} guests</li>
                        <li>No smoking inside the apartment</li>
                        <li>Quiet hours: 10:00 PM - 8:00 AM</li>
                        {(property.min_nights || property.max_nights) && (
                          <li>Stay duration: {property.min_nights || 1}-{property.max_nights || 30} nights</li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card className="animate-bounce-in">
              <CardContent className="p-6">
                <h2 className="font-display text-2xl font-semibold mb-4">Pricing</h2>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold">€{Math.round(property.base_price / 100)}</span>
                  <span className="text-muted-foreground">per night</span>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <p>Base rate for up to {property.max_guests} guests</p>
                  {property.cleaning_fee && (
                    <div className="flex justify-between">
                      <span>Cleaning fee:</span>
                      <span>€{Math.round(property.cleaning_fee / 100)}</span>
                    </div>
                  )}
                  {property.security_deposit && (
                    <div className="flex justify-between">
                      <span>Security deposit:</span>
                      <span>€{Math.round(property.security_deposit / 100)}</span>
                    </div>
                  )}
                  {(property.min_nights || property.max_nights) && (
                    <div className="flex justify-between">
                      <span>Stay duration:</span>
                      <span>
                        {property.min_nights || 1}-{property.max_nights || 30} nights
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button asChild className="flex-1">
                    <Link to={`/check-availability/${property.id}`}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Check Availability
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/contact">
                      <Phone className="h-4 w-4 mr-2" />
                      Contact Us
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Host */}
            <Card className="animate-bounce-in">
              <CardContent className="p-6">
                <h2 className="font-display text-2xl font-semibold mb-6">Contact Your Host</h2>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    HL
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">Habitat Lobby Team</h3>
                    <p className="text-muted-foreground mb-3">
                      Your dedicated hosts in Trikala, committed to making your stay exceptional.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/contact">
                          <Mail className="h-4 w-4 mr-2" />
                          Send Message
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href="tel:+302431025562">
                          <Phone className="h-4 w-4 mr-2" />
                          Call Us
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Response Time</h4>
                  <p className="text-sm text-muted-foreground">
                    We typically respond within 1 hour during business hours (9 AM - 9 PM Greek time).
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Cancellation Policy */}
            <Card className="animate-bounce-in">
              <CardContent className="p-6">
                <h2 className="font-display text-2xl font-semibold mb-6">Cancellation Policy</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Free cancellation for 48 hours</p>
                      <p className="text-sm text-muted-foreground">
                        Cancel up to 48 hours before check-in for a full refund.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Clock className="h-3 w-3 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium">Partial refund before 24 hours</p>
                      <p className="text-sm text-muted-foreground">
                        50% refund for cancellations between 24-48 hours before check-in.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X className="h-3 w-3 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">No refund within 24 hours</p>
                      <p className="text-sm text-muted-foreground">
                        No refund for cancellations within 24 hours of check-in.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/policies">
                      View Full Cancellation Policy
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              <BookingWidget
                unitSlug={property.id}
              />

              {/* Quick Contact Card */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Need Help?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Have questions about this property? We're here to help!
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link to="/contact">
                        <Mail className="h-4 w-4 mr-2" />
                        Send Message
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href="tel:+302431025562">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Now
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile CTA */}
      <StickyMobileCTA
        href={`/check-availability/${property.id}`}
      >
        Check Availability - €{Math.round(property.base_price / 100)}/night
      </StickyMobileCTA>

      <Footer />
    </main>
  );
};

export default ApartmentDetail;
