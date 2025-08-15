import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { apartments } from "@/data/apartments";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageGallery } from "@/components/ui/image-gallery";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { Wifi, Snowflake, Utensils, Building2, MapPin, Star, ArrowLeft } from "lucide-react";
import BookingBar from "@/components/BookingBar";
import Footer from "@/components/Footer";

const amenityLabel: Record<string, { label: string; icon: React.ReactNode }> = {
  wifi: { label: "Wi‑Fi", icon: <Wifi className="h-4 w-4" /> },
  ac: { label: "A/C", icon: <Snowflake className="h-4 w-4" /> },
  kitchen: { label: "Kitchen", icon: <Utensils className="h-4 w-4" /> },
  elevator: { label: "Elevator", icon: <Building2 className="h-4 w-4" /> },
  balcony: { label: "Balcony", icon: <MapPin className="h-4 w-4" /> },
};

const ApartmentPage: React.FC = () => {
  const { slug } = useParams();

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
            <ArrowLeft className="h-4 w-4" />
            View All Apartments
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
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

      {/* Hero gallery */}
      <section className="container py-6 md:py-10">
        <h1 className="font-display text-3xl md:text-5xl">{apt.name}</h1>
        <p className="text-muted-foreground mt-1 flex items-center gap-2"><MapPin className="h-4 w-4" /> {apt.location} • {apt.rating.toFixed(1)}★</p>
        <div className="mt-6">
          <Carousel>
            <CarouselContent>
              {apt.images.map((src, i) => (
                <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                  <img src={src} alt={`${apt.name} photo ${i + 1}`} className="h-64 md:h-72 w-full object-cover rounded-lg" loading="lazy" />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Content */}
      <section className="container grid md:grid-cols-3 gap-8 pb-16">
        <div className="md:col-span-2">
          <h2 className="font-display text-2xl">Your Story in Trikala</h2>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            {apt.description} Wander the riverside, sip coffee in the sun, and return to a space layered with linen, oak, and deep‑green calm. A home designed for slow mornings and golden hours.
          </p>

          <h3 className="font-display text-xl mt-8">Amenities</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
            {apt.amenities.map((a) => (
              <div key={a} className="flex items-center gap-2 p-3 rounded-lg border bg-card">
                {amenityLabel[a]?.icon}
                <span>{amenityLabel[a]?.label}</span>
              </div>
            ))}
          </div>

          <h3 className="font-display text-xl mt-8">Local Guide (walkable)</h3>
          <Card className="mt-3 overflow-hidden">
            <div className="grid sm:grid-cols-2">
              <div className="h-48 sm:h-64 bg-gradient-to-br from-secondary to-muted" />
              <CardContent className="p-4">
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>• Riverside promenade — 2 min</li>
                  <li>• Castle viewpoint — 15 min</li>
                  <li>• Cafe square — 5 min</li>
                  <li>• Bike rental — 3 min</li>
                </ul>
              </CardContent>
            </div>
          </Card>

          <h3 className="font-display text-xl mt-8">Guest Reviews</h3>
          <Card className="mt-3 p-4">
            <p className="text-muted-foreground">“Warm, elegant, and perfectly located. We loved cycling everywhere.”</p>
          </Card>
        </div>

        {/* Sticky booking box */}
        <div className="md:col-span-1">
          <div className="sticky top-6">
            <Card className="p-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-muted-foreground text-sm">from</span>
                  <div className="text-2xl font-semibold">€{apt.pricePerNight}</div>
                  <span className="text-muted-foreground text-sm">/night</span>
                </div>
                <div className="text-right">
                  <span className="text-sm">{apt.rating.toFixed(1)}★</span>
                </div>
              </div>
              <div className="mt-4">
                <BookingBar compact />
              </div>
              <Button asChild className="w-full mt-3" variant="hero">
                <Link to={`/check-availability/${apt.slug}`}>Check Availability</Link>
              </Button>
              <p className="text-xs text-muted-foreground mt-2">Secure payment. Best rate here.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Mobile sticky button */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-background/80 backdrop-blur border-t p-3">
        <Button asChild className="w-full" variant="hero">
          <Link to={`/check-availability/${apt.slug}`}>Check Availability</Link>
        </Button>
      </div>
    </div>
  );
};

export default ApartmentPage;
