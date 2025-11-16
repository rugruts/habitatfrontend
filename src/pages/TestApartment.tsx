import React from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { BookingWidget } from "@/components/BookingWidget";
import {
  Star,
  MapPin,
  Users,
  Bed,
  Bath,
  Maximize,
  Clock,
  Wifi,
  Wind,
  ChefHat,
  Waves,
  Tv,
  Utensils,
  CheckCircle,
  CreditCard,
  Shield,
  TestTube
} from "lucide-react";
import BookingBar from "@/components/BookingBar";
import { realAttractions } from "@/data/apartments";

const TestApartment: React.FC = () => {
  const apartment = {
    slug: "test-apartment",
    name: "Test Apartment",
    location: "Trikala Center, Greece",
    rating: 5.0,
    reviewCount: 1,
    short: "Test apartment for payment verification - €1 per night!",
    description: "This is a test apartment specifically created for payment testing. Book for just €1 per night to verify the Stripe payment integration is working correctly.",
    longDescription: "Perfect for testing the complete booking flow from availability checking to payment processing. This apartment allows you to verify that payments are correctly processed through Stripe and bookings are properly stored in the database.",
    pricePerNight: 1,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    size: "45 m²",
    checkIn: "15:00",
    checkOut: "11:00",
    minStay: 1,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: {
      essential: [
        { icon: TestTube, name: "Test Environment", description: "Safe testing environment" },
        { icon: CreditCard, name: "Stripe Integration", description: "Real payment processing" },
        { icon: Shield, name: "Secure Booking", description: "Database integration" },
        { icon: Wifi, name: "High-Speed WiFi", description: "Fiber internet 100 Mbps" }
      ],
      comfort: [
        { icon: Wind, name: "Air Conditioning", description: "Individual room controls" },
        { icon: ChefHat, name: "Full Kitchen", description: "Basic appliances" },
        { icon: Tv, name: "Smart TV", description: "Basic entertainment" },
        { icon: Bath, name: "Bathroom", description: "Standard amenities" }
      ]
    },
    highlights: [
      "Only €1 per night - perfect for testing!",
      "Real Stripe payment processing",
      "Supabase database integration",
      "Complete booking flow verification",
      "Minimum 1 night stay for quick testing",
      "Instant booking confirmation"
    ],
    nearbyAttractions: realAttractions,
    policies: {
      cancellation: "Free cancellation up to 1 hour before check-in",
      smoking: "No smoking inside the property",
      pets: "Pets allowed",
      parties: "Testing parties welcome!"
    }
  };

  const breadcrumbItems = [
    { label: "Apartments", href: "/apartments" },
    { label: apartment.name, current: true }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{apartment.name} | Habitat Lobby - Test Booking</title>
        <meta name="description" content={apartment.description} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 h-[60vh] lg:h-[70vh]">
          <div className="relative overflow-hidden rounded-none lg:rounded-r-2xl">
            <img
              src={apartment.images[0]}
              alt={apartment.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <Badge className="absolute top-4 left-4 bg-green-600 hover:bg-green-700 text-white">
              <TestTube className="h-3 w-3 mr-1" />
              Test Mode - €1/night
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="relative overflow-hidden">
              <img
                src={apartment.images[1]}
                alt={`${apartment.name} - Interior`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="relative overflow-hidden rounded-tr-2xl">
              <img
                src={apartment.images[2]}
                alt={`${apartment.name} - Details`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="col-span-2 relative overflow-hidden rounded-br-2xl">
              <img
                src={apartment.images[0]}
                alt={`${apartment.name} - View`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-4 right-4">
                <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white">
                  View all photos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Breadcrumb */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/apartments">Apartments</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{apartment.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="font-serif text-3xl lg:text-4xl text-primary mb-2">
                    {apartment.name}
                  </h1>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{apartment.rating}</span>
                      <span>({apartment.reviewCount} review)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{apartment.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-accent" />
                  <span>{apartment.maxGuests} guests</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Bed className="h-4 w-4 text-accent" />
                  <span>{apartment.bedrooms} bedroom</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Bath className="h-4 w-4 text-accent" />
                  <span>{apartment.bathrooms} bathroom</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Maximize className="h-4 w-4 text-accent" />
                  <span>{apartment.size}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div className="space-y-4">
              <h2 className="font-serif text-2xl text-primary">About this place</h2>
              <p className="text-muted-foreground leading-relaxed">
                {apartment.description}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {apartment.longDescription}
              </p>
            </div>

            <Separator />

            {/* Amenities */}
            <div className="space-y-6">
              <h3 className="font-serif text-xl text-primary">What this place offers</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-4 text-accent">Testing Features</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {apartment.amenities.essential.map((amenity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <amenity.icon className="h-5 w-5 text-accent mt-0.5" />
                        <div>
                          <div className="font-medium">{amenity.name}</div>
                          <div className="text-sm text-muted-foreground">{amenity.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4 text-accent">Basic Amenities</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {apartment.amenities.comfort.map((amenity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <amenity.icon className="h-5 w-5 text-accent mt-0.5" />
                        <div>
                          <div className="font-medium">{amenity.name}</div>
                          <div className="text-sm text-muted-foreground">{amenity.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <BookingWidget unitSlug={apartment.slug} />
            </div>
          </div>
        </div>
      </div>

      <BookingBar />
    </div>
  );
};

export default TestApartment;
