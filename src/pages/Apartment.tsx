import React, { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { apartments } from "@/data/apartments";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wifi, 
  Snowflake, 
  Utensils, 
  Building2, 
  MapPin, 
  Star, 
  ArrowLeft,
  Calendar,
  Users,
  Clock,
  Heart,
  Share2,
  Phone,
  Mail,
  Car,
  Bike,
  Coffee,
  Castle,
  Mountain,
  Trees,
  UtensilsCrossed,
  Bed,
  Bath,
  Tv,
  WashingMachine,
  Wifi as WifiIcon,
  Snowflake as AcIcon,
  Utensils as KitchenIcon,
  Building2 as ElevatorIcon,
  MapPin as BalconyIcon,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2
} from "lucide-react";
import { EmbeddedAvailabilityWidget } from "@/components/EmbeddedAvailabilityWidget";
import { format, addDays, differenceInDays } from 'date-fns';
import { DateRange } from 'react-day-picker';

const amenityLabel: Record<string, { label: string; icon: React.ReactNode; description: string }> = {
  wifi: { 
    label: "Free Wi-Fi", 
    icon: <WifiIcon className="h-5 w-5" />,
    description: "High-speed internet throughout the apartment"
  },
  ac: { 
    label: "Air Conditioning", 
    icon: <AcIcon className="h-5 w-5" />,
    description: "Climate control for your comfort"
  },
  kitchen: { 
    label: "Full Kitchen", 
    icon: <KitchenIcon className="h-5 w-5" />,
    description: "Equipped kitchen with all essentials"
  },
  elevator: { 
    label: "Elevator Access", 
    icon: <ElevatorIcon className="h-5 w-5" />,
    description: "Easy access to all floors"
  },
  balcony: { 
    label: "Private Balcony", 
    icon: <BalconyIcon className="h-5 w-5" />,
    description: "Outdoor space with city views"
  },
};

const attractionIcons: Record<string, React.ReactNode> = {
  nature: <Trees className="h-4 w-4" />,
  culture: <Castle className="h-4 w-4" />,
  dining: <UtensilsCrossed className="h-4 w-4" />,
  unesco: <Mountain className="h-4 w-4" />,
  recreation: <Bike className="h-4 w-4" />,
};

const ApartmentPage: React.FC = () => {
  const { slug } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(2);

  // Redirect to specific apartment pages if they exist
  if (slug === "river-loft") {
    return <Navigate to="/apartments/river-loft" replace />;
  }

  if (slug === "garden-suite" || slug === "apartment-1") {
    return <Navigate to="/apartments/apartment-1" replace />;
  }

  const apt = apartments.find((a) => a.slug === slug);

  if (!apt) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-display text-4xl mb-4">Apartment not found</h1>
        <p className="text-muted-foreground mb-6">The apartment you're looking for doesn't exist.</p>
        <Button asChild variant="hero" className="hover-scale">
          <Link to="/apartments">
            <ArrowLeft className="h-4 w-4 mr-2" />
            View All Apartments
          </Link>
        </Button>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % apt.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + apt.images.length) % apt.images.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <Helmet>
        <title>{`${apt.name} — Habitat Lobby, Trikala`}</title>
        <meta name="description" content={`${apt.short} Book direct at Habitat Lobby in Trikala, Greece.`} />
        <link rel="canonical" href={`https://habitat-lobby.lovable.app/apartments/${apt.slug}`} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LodgingBusiness',
          name: apt.name,
          address: { '@type': 'PostalAddress', addressLocality: 'Trikala', addressCountry: 'GR' },
          aggregateRating: { '@type': 'AggregateRating', ratingValue: apt.rating, reviewCount: 24 },
          priceRange: `€${apt.pricePerNight}+`
        })}</script>
      </Helmet>

      {/* Hero Section with Image Gallery */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {/* Main Image */}
        <div className="relative h-full w-full">
          <img 
            src={apt.images[currentImageIndex]} 
            alt={`${apt.name} - Photo ${currentImageIndex + 1}`}
            className="h-full w-full object-cover transition-all duration-700 ease-in-out"
            loading="eager"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/30 transition-all"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/30 transition-all"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm">
            {currentImageIndex + 1} / {apt.images.length}
          </div>

          {/* Expand Button */}
          <button
            onClick={() => setIsImageModalOpen(true)}
            className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-3 text-white hover:bg-black/70 transition-all"
          >
            <Maximize2 className="h-5 w-5" />
          </button>
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="text-white">
                <h1 className="font-display text-4xl md:text-6xl font-bold mb-2">
                  {apt.name}
                </h1>
                <div className="flex items-center gap-4 text-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span>{apt.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{apt.rating.toFixed(1)}</span>
                    <span className="text-white/80">(24 reviews)</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30">
                  <Heart className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="sm" className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-8 md:py-12 pb-32 lg:pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="text-center p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
                <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">4</div>
                <div className="text-sm text-muted-foreground">Guests</div>
              </Card>
              <Card className="text-center p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
                <Bed className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">2</div>
                <div className="text-sm text-muted-foreground">Bedrooms</div>
              </Card>
              <Card className="text-center p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
                <Bath className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">1</div>
                <div className="text-sm text-muted-foreground">Bathroom</div>
              </Card>
              <Card className="text-center p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
                <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">2</div>
                <div className="text-sm text-muted-foreground">Min Stay</div>
              </Card>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">About this place</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {apt.description}
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground mt-4">
                  Wander the riverside, sip coffee in the sun, and return to a space layered with linen, oak, and deep‑green calm. A home designed for slow mornings and golden hours.
                </p>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">What this place offers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {apt.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-3 p-3 rounded-lg border bg-card/50">
                      <div className="text-primary">
                        {amenityLabel[amenity]?.icon}
                      </div>
                      <div>
                        <div className="font-medium">{amenityLabel[amenity]?.label}</div>
                        <div className="text-sm text-muted-foreground">{amenityLabel[amenity]?.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Nearby Attractions */}
            {apt.nearbyAttractions && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Nearby attractions</CardTitle>
                  <p className="text-muted-foreground">Everything within walking distance</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {apt.nearbyAttractions.map((attraction, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg border bg-card/50">
                        <div className="text-primary">
                          {attractionIcons[attraction.type]}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{attraction.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {attraction.distance} • {attraction.time}
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {attraction.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Guest reviews</CardTitle>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{apt.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground">(24 reviews)</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border bg-card/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        M
                      </div>
                      <div>
                        <div className="font-medium">Maria K.</div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      "Warm, elegant, and perfectly located. We loved cycling everywhere and the apartment was spotless. The balcony view was incredible!"
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg border bg-card/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        A
                      </div>
                      <div>
                        <div className="font-medium">Alex P.</div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      "Perfect base for exploring Trikala and Meteora. The apartment had everything we needed and the location was ideal."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-6" data-availability-widget>
              <EmbeddedAvailabilityWidget 
                propertyId={apt.slug}
                maxGuests={4}
                basePrice={apt.pricePerNight}
                className="shadow-xl border-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full">
            <img 
              src={apt.images[currentImageIndex]} 
              alt={`${apt.name} - Photo ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-3 text-white hover:bg-black/70 transition-all"
            >
              <XCircle className="h-6 w-6" />
            </button>
            
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm rounded-full p-3 text-white hover:bg-black/70 transition-all"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm rounded-full p-3 text-white hover:bg-black/70 transition-all"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 text-white">
              {currentImageIndex + 1} / {apt.images.length}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky Booking Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-t shadow-lg">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-2xl font-bold text-primary">€{apt.pricePerNight}</div>
              <div className="text-sm text-muted-foreground">per night</div>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{apt.rating.toFixed(1)}</span>
            </div>
          </div>
          <Button 
            onClick={() => {
              const widget = document.querySelector('[data-availability-widget]');
              widget?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
          >
            <Calendar className="h-5 w-5 mr-2" />
            Check Availability
          </Button>
        </div>
      </div>

    </div>
  );
};

export default ApartmentPage;
