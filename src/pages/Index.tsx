import React from "react";
import { Link } from "react-router-dom";
import SEO, { createOrganizationSchema, createLocalBusinessSchema } from "@/components/SEO";
import { trackPageView, trackApartmentView } from "@/components/GoogleAnalytics";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Wifi, Snowflake, Utensils, Landmark, Building2, Bike, Castle, Coffee, Mountain, Trees } from "lucide-react";
import heroImg from "@/assets/hero-trikala.jpg";
import expCycling from "@/assets/exp-cycling.jpg";
import expCastle from "@/assets/exp-castle.jpg";
import expCafe from "@/assets/exp-cafe.jpg";
import expMeteora from "@/assets/exp-meteora.jpg";
import expPertouli from "@/assets/exp-pertouli.jpg";
import trikalaHome from "@/assets/trikala_home.jpg";
import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import avatar3 from "@/assets/avatar-3.jpg";
import { supabaseHelpers } from "@/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StickyMobileCTA } from "@/components/ui/sticky-mobile-cta";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Footer from "@/components/Footer";

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
  amenities: string[];
  images: string[];
  active: boolean;
  created_at: string;
}
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

const experienceIcon = (title: string) => {
  switch (title) {
    case "Cycling City":
      return <Bike className="h-5 w-5" />;
    case "History & Culture":
      return <Castle className="h-5 w-5" />;
    case "Riverside Cafes":
      return <Coffee className="h-5 w-5" />;
    case "Meteora Day Trip":
      return <Mountain className="h-5 w-5" />;
    case "Pertouli Forest":
      return <Trees className="h-5 w-5" />;
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
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [properties, setProperties] = React.useState<Property[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Trigger fade-in animation after component mounts
    const timer = setTimeout(() => setIsLoaded(true), 100);
    trackPageView('homepage');
    return () => clearTimeout(timer);
  }, []);

  // Fetch properties from Supabase
  React.useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const propertiesData = await supabaseHelpers.getAllProperties();

        // Transform properties data to handle JSON fields and take only first 2 for featured
        const transformedProperties = (propertiesData || [])
          .filter(property => property.active) // Only show active properties
          .slice(0, 2) // Take only first 2 for featured section
          .map(property => ({
            ...property,
            amenities: typeof property.amenities === 'string'
              ? JSON.parse(property.amenities || '[]')
              : property.amenities || [],
            images: typeof property.images === 'string'
              ? JSON.parse(property.images || '[]')
              : property.images || []
          }));

        setProperties(transformedProperties);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className={`min-h-screen bg-background text-foreground transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <SEO
        title="Habitat Lobby — Boutique Apartments in Trikala, Greece"
        description="Discover Trikala's cycling capital and book premium boutique apartments at Habitat Lobby. Experience authentic Greek hospitality with modern comfort in Central Greece."
        canonical="/"
        keywords={[
          'Trikala apartments',
          'Greece boutique accommodation',
          'cycling city Greece',
          'Meteora base',
          'Thessaly hotels',
          'authentic Greek experience',
          'Central Greece accommodation',
          'bike-friendly hotels',
          'Trikala city center'
        ]}
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            createOrganizationSchema(),
            createLocalBusinessSchema()
          ]
        }}
      />

      {/* Hero (parallax) */}
      <section className="relative h-[80vh] md:h-[92vh] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-fixed bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImg})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/40 to-black/80" />

        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-accent/30 rounded-full blur-xl animate-float hidden lg:block" />
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-primary/30 rounded-full blur-xl animate-float hidden lg:block" style={{animationDelay: '1s'}} />
        <div className="relative z-10 h-full container flex flex-col justify-center items-center text-center">
          <div className="max-w-6xl animate-slide-up">
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl xl:text-9xl leading-tight font-bold text-white drop-shadow-lg">
              <span className="block">Discover Trikala</span>
              <span className="block bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent mt-2">
                Stay with Habitat Lobby
              </span>
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed animate-fade-in font-light">
              A boutique short‑term rental brand in Greece’s cycling city. Book direct for the best rates and local tips.
            </p>
          </div>
          {/* Trust Badge */}
          <div className="flex items-center justify-center gap-2 mt-10 md:mt-12 text-white/80 animate-fade-in" style={{animationDelay: '0.5s'}}>
            <div className="flex items-center gap-1">
              <span className="text-accent text-lg">⭐</span>
              <span className="text-sm font-medium">5-star rated on</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="font-semibold">Airbnb</span>
              <span className="text-white/60">•</span>
              <span className="font-semibold">Booking.com</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Trikala */}
      <section className="container py-12 md:py-16">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">About Trikala</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-light mb-4">
            A city of bicycles, history, and riverside charm — let us show you Trikala.
          </p>
          <p className="text-base md:text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Nestled between the mountains and the river, Trikala invites you to slow down, explore on two wheels,
            and enjoy life the local way. Here, ancient stones meet modern comfort, and every corner tells a story
            waiting to be discovered.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {[
            { img: expCycling, title: "Cycling City", text: "Ride along the Lithaios river and across stone bridges to car‑free squares.", link: "/about-trikala/cycling-city" },
            { img: expCastle, title: "History & Culture", text: "Explore the Byzantine castle, museums, and the charming old town.", link: "/about-trikala/history-culture" },
            { img: expMeteora, title: "Nature & Day Trips", text: "From riverside walks to Meteora and Pertouli—nature at your doorstep.", link: "/about-trikala/nature-day-trips" },
          ].map((b, index) => (
            <Link
              key={b.title}
              to={b.link}
              className="block"
              onClick={() => trackApartmentView(b.title)}
            >
              <Card
                className="overflow-hidden animate-fade-in hover-lift group cursor-pointer"
                style={{animationDelay: `${index * 200}ms`}}
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={b.img}
                    alt={b.title}
                    className="h-52 w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardContent className="pt-6">
                  <h3 className="font-serif text-xl md:text-2xl text-primary mb-2">{b.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{b.text}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Experience the City */}
      <section className="relative py-20 md:py-28">
        <img src={trikalaHome} alt="Trikala evening lights with cycling paths and local life" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-black/70" />
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto animate-enter text-center">
            <h2 className="font-serif text-4xl md:text-6xl text-white mb-6">Experience the City</h2>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-light">
              Slow mornings. Fresh coffee by the river. Bicycles, bridges, and golden hour light across the castle hill. Make Trikala your story.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 md:mt-10">
              <Button asChild variant="accent" size="lg" className="hover-scale bg-accent hover:bg-accent/90">
                <Link to="/apartments">See Our Apartments</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="hover-scale border-white text-white hover:bg-white hover:text-primary">
                <Link to="/experiences">Plan Your Stay</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Apartments */}
      <section id="apartments" className="container py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl text-primary mb-4">Featured Apartments</h2>
          <div className="flex items-center justify-center gap-2 text-accent font-medium">
            <span className="text-sm">💡</span>
            <span>Why Book Direct? Best rates + local insider tips</span>
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading featured apartments...</p>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 md:gap-10">
            {properties.map((property, index) => {
              const pricePerNightEuros = Math.round(property.base_price / 100);
              const firstImage = property.images.length > 0 ? property.images[0] : "/api/placeholder/800/600";

              return (
                <Card
                  key={property.id}
                  className="overflow-hidden animate-fade-in hover-lift group border-2 border-accent/20 hover:border-accent/40 transition-all duration-300"
                  style={{animationDelay: `${index * 200}ms`}}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={firstImage}
                      alt={`${property.name} interior`}
                      className="h-80 w-full object-cover bg-accent/5 transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <span className="text-white font-semibold bg-accent px-6 py-3 rounded-lg shadow-lg">
                          View Gallery
                        </span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="pt-6 bg-accent/5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-serif text-2xl text-primary mb-1">{property.name}</h3>
                        <p className="text-muted-foreground text-sm mb-2">{property.description.substring(0, 80)}...</p>
                        {/* Bullet benefit */}
                        <p className="text-sm text-accent font-medium">
                          • {property.max_guests} guests • {property.bedrooms} bedroom{property.bedrooms > 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-xs text-muted-foreground">from</p>
                        <p className="font-bold text-lg text-primary">€{pricePerNightEuros}</p>
                        <p className="text-xs text-muted-foreground">/night</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4 text-muted-foreground">
                      {property.amenities.slice(0, 3).map((amenity) => (
                        <div key={amenity} className="flex items-center gap-1 text-sm">
                          {amenityIcon(amenity)} <span className="capitalize">{amenity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex gap-3">
                      <Button asChild variant="accent" className="hover-scale flex-1 bg-accent hover:bg-accent/90">
                        <Link to={`/check-availability/${property.id}`}>Check Availability</Link>
                      </Button>
                      <Button asChild variant="outline" className="hover-scale flex-1 border-primary text-primary hover:bg-primary hover:text-white">
                        <Link to={`/apartments/${property.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Mini Guide Carousel */}
      <section className="container py-12 md:py-16">
        <h2 className="font-serif text-4xl md:text-5xl text-primary text-center mb-12">Mini Guide</h2>
        <Carousel className="relative">
          <CarouselContent>
            {experiences.map((ex, index) => (
              <CarouselItem key={ex.title} className="md:basis-1/2 lg:basis-1/3">
                <Card className="overflow-hidden hover-lift group">
                  <div className="relative">
                    <img src={ex.img} alt={ex.title} className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                    {/* Icon Badge */}
                    <div className="absolute top-4 left-4 bg-accent text-white p-2 rounded-full shadow-lg">
                      {experienceIcon(ex.title)}
                    </div>
                  </div>
                  <CardContent className="pt-6">
                    <h3 className="font-serif text-xl text-primary mb-2">{ex.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">{ex.text}</p>
                    <Button asChild variant="accent" className="hover-scale bg-accent hover:bg-accent/90">
                      <Link to="#apartments">Stay Here</Link>
                    </Button>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Enhanced Carousel Arrows */}
          <CarouselPrevious className="bg-white/90 border-2 border-primary/20 hover:bg-primary hover:text-white shadow-lg -left-6" />
          <CarouselNext className="bg-white/90 border-2 border-primary/20 hover:bg-primary hover:text-white shadow-lg -right-6" />
        </Carousel>
      </section>

      {/* Reviews */}
      <section className="py-16 md:py-20 bg-accent/10">
        <div className="container">
          <h2 className="font-serif text-4xl md:text-5xl text-primary text-center mb-12">Guest Reviews</h2>
          <Carousel>
            <CarouselContent>
            {reviews.map((r, idx) => (
              <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/3">
                <Card className="p-6 bg-white border-accent/20 hover-lift">
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
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Sticky Mobile CTA */}
      <StickyMobileCTA href="/apartments">
        📍 Book Your Trikala Stay
      </StickyMobileCTA>
    </div>
  );
};

export default Index;
