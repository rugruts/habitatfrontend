import React from "react";
import { Helmet } from "react-helmet-async";
import { apartments } from "@/data/apartments";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

const Apartments: React.FC = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Apartments in Trikala – Habitat Lobby</title>
        <meta name="description" content="Explore Habitat Lobby's boutique apartments in Trikala, Greece. Book direct for best rates and curated local tips." />
        <link rel="canonical" href="https://habitat-lobby.lovable.app/apartments" />
      </Helmet>

      <section className="container py-10 md:py-14">
        <h1 className="font-display text-3xl md:text-5xl">Our Apartments</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">Premium, design-led stays in the heart of Trikala. Thoughtful amenities and a calm, warm aesthetic.</p>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mt-8">
          {apartments.map((apt) => (
            <Card key={apt.slug} className="overflow-hidden animate-fade-in">
              <img src={apt.images[0]} alt={`${apt.name} interior`} className="h-64 w-full object-cover" loading="lazy" />
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-2xl">{apt.name}</h2>
                    <p className="text-muted-foreground text-sm">{apt.short}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">from</p>
                    <p className="font-semibold">€{apt.pricePerNight}/night</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <Button asChild variant="accent" className="hover-scale">
                    <Link to={`/apartments/${apt.slug}`}>Book Now</Link>
                  </Button>
                  <Button asChild variant="outline" className="hover-scale">
                    <Link to={`/apartments/${apt.slug}`}>View Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Apartments;
