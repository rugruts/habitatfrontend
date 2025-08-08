import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import BookingBar from "@/components/BookingBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Wifi, Snowflake, Utensils, Landmark, Building2 } from "lucide-react";
import heroImg from "@/assets/hero-trikala.jpg";
import expCycling from "@/assets/exp-cycling.jpg";
import expCastle from "@/assets/exp-castle.jpg";
import expCafe from "@/assets/exp-cafe.jpg";
import expMeteora from "@/assets/exp-meteora.jpg";
import expPertouli from "@/assets/exp-pertouli.jpg";
import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import avatar3 from "@/assets/avatar-3.jpg";
import { apartments } from "@/data/apartments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const amenityIcon = (key: string) => {
  switch (key) {
    case "wifi":
      return <Wifi className="h-4 w-4" />;
    case "ac":
      return <Snowflake className="h-4 w-4" />;
    case "kitchen":
      return <Utensils className="h-4 w-4" />;
    case "elevator":
      return <Building2 className="h-4 w-4" />;
    case "balcony":
      return <Landmark className="h-4 w-4" />;
    default:
      return null;
  }
};

const reviews = [
  {
    name: "Elena",
    avatar: avatar1,
    rating: 5,
    quote:
      "Gorgeous apartment and the best location for exploring Trikala by bike. Book direct—super smooth!",
  },
  {
    name: "Marcus",
    avatar: avatar2,
    rating: 5,
    quote:
      "Warm daylight, great coffee nearby, and a really restful sleep. Felt like a boutique hotel.",
  },
  {
    name: "Despina",
    avatar: avatar3,
    rating: 4,
    quote:
      "Loved the river walks and the interiors. Perfect base for Meteora and Pertouli day trips.",
  },
];

const experiences = [
  { title: "Cycling City", img: expCycling, text: "Riverside paths, stone bridges, and bike‑first culture." },
  { title: "History & Culture", img: expCastle, text: "Castle views, museums, and old‑town charm." },
  { title: "Riverside Cafes", img: expCafe, text: "Sunlit terraces, local flavors, and slow mornings." },
  { title: "Meteora Day Trip", img: expMeteora, text: "Iconic monasteries an hour away." },
  { title: "Pertouli Forest", img: expPertouli, text: "Alpine meadows and pine trails nearby." },
];

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Habitat Lobby — Boutique Apartments in Trikala</title>
        <meta name="description" content="Discover Trikala and book premium apartments at Habitat Lobby. Magazine-inspired design, direct booking, and a curated local guide." />
        <link rel="canonical" href="https://habitat-lobby.lovable.app/" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Habitat Lobby',
          url: 'https://habitat-lobby.lovable.app',
          sameAs: ['https://instagram.com'],
        })}</script>
      </Helmet>

      {/* Hero */}
      <section className="relative h-[80vh] md:h-[92vh] w-full overflow-hidden">
        <img
          src={heroImg}
          alt="Cinematic view over Trikala river with bridges and cyclists"
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/30 to-background" />
        <div className="relative z-10 h-full container flex flex-col justify-end pb-8 md:pb-14">
          <div className="max-w-3xl animate-enter">
            <h1 className="font-display text-4xl md:text-6xl leading-tight font-semibold">
              Discover Trikala — Stay with Habitat Lobby
            </h1>
            <p className="mt-3 md:mt-4 text-base md:text-lg text-muted-foreground max-w-2xl">
              A boutique short‑term rental brand in Greece’s cycling city. Book direct for the best rates and local tips.
            </p>
          </div>
          <div className="mt-5 md:mt-8 max-w-4xl animate-enter">
            <BookingBar />
          </div>
        </div>
        {/* Mobile sticky CTA */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
          <div className="container py-3">
            <Button asChild variant="hero" className="w-full">
              <Link to="#apartments">Book Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Trikala */}
      <section className="container py-12 md:py-16">
        <h2 className="font-display text-3xl md:text-4xl mb-6 md:mb-8">About Trikala</h2>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {[
            { img: expCycling, title: "Cycling City", text: "Ride along the Lithaios river and across stone bridges to car‑free squares." },
            { img: expCastle, title: "History & Culture", text: "Explore the Byzantine castle, museums, and the charming old town." },
            { img: expMeteora, title: "Nature & Day Trips", text: "From riverside walks to Meteora and Pertouli—nature at your doorstep." },
          ].map((b) => (
            <Card key={b.title} className="overflow-hidden animate-fade-in">
              <img src={b.img} alt={b.title} className="h-48 w-full object-cover" loading="lazy" />
              <CardContent className="pt-4">
                <h3 className="font-display text-xl md:text-2xl">{b.title}</h3>
                <p className="text-muted-foreground mt-2">{b.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Experience the City */}
      <section className="relative py-16 md:py-24">
        <img src={expCafe} alt="Riverside cafes in Trikala" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/60 to-background" />
        <div className="container relative z-10">
          <div className="max-w-3xl animate-enter">
            <h2 className="font-display text-3xl md:text-5xl">Experience the City</h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Slow mornings. Fresh coffee by the river. Bicycles, bridges, and golden hour light across the castle hill. Make Trikala your story.
            </p>
            <Button asChild variant="hero" className="mt-6 hover-scale">
              <Link to="#apartments">See Our Apartments</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Apartments */}
      <section id="apartments" className="container py-12 md:py-16">
        <div className="flex items-end justify-between mb-6 md:mb-8">
          <h2 className="font-display text-3xl md:text-4xl">Featured Apartments</h2>
          <Link to="#" className="story-link text-sm">Why book direct?</Link>
        </div>
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {apartments.map((apt) => (
            <Card key={apt.slug} className="overflow-hidden animate-fade-in">
              <img src={apt.images[0]} alt={`${apt.name} interior`} className="h-64 w-full object-cover" loading="lazy" />
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-2xl">{apt.name}</h3>
                    <p className="text-muted-foreground text-sm">{apt.short}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">from</p>
                    <p className="font-semibold">€{apt.pricePerNight}/night</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4 text-muted-foreground">
                  {apt.amenities.slice(0, 3).map((a) => (
                    <div key={a} className="flex items-center gap-1 text-sm">
                      {amenityIcon(a)} <span className="capitalize">{a}</span>
                    </div>
                  ))}
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

      {/* Mini Guide Carousel */}
      <section className="container py-12 md:py-16">
        <h2 className="font-display text-3xl md:text-4xl mb-6 md:mb-8">Mini Guide</h2>
        <Carousel className="relative">
          <CarouselContent>
            {experiences.map((ex) => (
              <CarouselItem key={ex.title} className="md:basis-1/2 lg:basis-1/3">
                <Card className="overflow-hidden">
                  <img src={ex.img} alt={ex.title} className="h-56 w-full object-cover" loading="lazy" />
                  <CardContent className="pt-4">
                    <h3 className="font-display text-xl">{ex.title}</h3>
                    <p className="text-muted-foreground mt-1">{ex.text}</p>
                    <Button asChild variant="outline" className="mt-3 hover-scale">
                      <Link to="#apartments">Stay Here</Link>
                    </Button>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      {/* Reviews */}
      <section className="container py-12 md:py-16">
        <h2 className="font-display text-3xl md:text-4xl mb-6 md:mb-8">Guest Reviews</h2>
        <Carousel>
          <CarouselContent>
            {reviews.map((r, idx) => (
              <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/3">
                <Card className="p-6">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={r.avatar} alt={r.name} />
                      <AvatarFallback>{r.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{r.name}</p>
                      <div className="flex gap-0.5" aria-label={`${r.rating} out of 5 stars`}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg key={i} className={`h-4 w-4 ${i < r.rating ? 'text-accent' : 'text-muted-foreground'}`} viewBox="0 0 24 24" fill={i < r.rating ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-muted-foreground">“{r.quote}”</p>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container py-8 md:py-12 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display text-2xl">Habitat Lobby</h3>
            <p className="text-muted-foreground mt-2">Boutique apartments in Trikala, Greece. Book direct for the best experience and personal tips.</p>
          </div>
          <div>
            <h4 className="font-medium">Contact</h4>
            <p className="text-muted-foreground mt-2">hello@habitatlobby.com<br/>+30 210 000 0000</p>
          </div>
          <div>
            <h4 className="font-medium">Follow</h4>
            <p className="text-muted-foreground mt-2">Instagram · Facebook</p>
            <p className="text-xs text-muted-foreground mt-4">© {new Date().getFullYear()} Habitat Lobby. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
