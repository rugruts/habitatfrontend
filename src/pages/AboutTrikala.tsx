import React from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { trackPageView } from "@/components/GoogleAnalytics";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, Mountain, Coffee, Camera, ArrowRight, Bike } from "lucide-react";
import expCastle from "@/assets/exp-castle.jpg";
import expMeteora from "@/assets/exp-meteora.jpg";
import expCafe from "@/assets/exp-cafe.jpg";
import expCycling from "@/assets/exp-cycling.jpg";
import heroTrikala from "@/assets/hero-trikala.jpg";
import Footer from "@/components/Footer";

const trikalaHighlights = [
  {
    img: expCycling,
    title: "Cycling City",
    text: "Greece's cycling capital with 15+ km of bike lanes and smart sharing.",
    link: "/about-trikala/cycling-city",
    icon: Bike
  },
  {
    img: expCastle,
    title: "History & Culture",
    text: "Byzantine castle views, museums, and old‑town charm.",
    link: "/about-trikala/history-culture",
    icon: Camera
  },
  {
    img: expMeteora,
    title: "Nature & Day Trips",
    text: "Riverside walks and iconic Meteora an hour away.",
    link: "/about-trikala/nature-day-trips",
    icon: Mountain
  },
  {
    img: expCafe,
    title: "Local Life",
    text: "Cafés, markets, and the rhythm of everyday Trikala.",
    link: "/about-trikala/local-life",
    icon: Coffee
  },
];

const quickFacts = [
  { icon: Users, label: "Population", value: "81,355" },
  { icon: MapPin, label: "Region", value: "Thessaly, Central Greece" },
  { icon: Clock, label: "Founded", value: "3rd century BC" },
  { icon: Mountain, label: "Elevation", value: "115m above sea level" },
];

const AboutTrikala: React.FC = () => {
  React.useEffect(() => {
    trackPageView('about-trikala');
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SEO
        title="About Trikala – Discover Central Greece's Hidden Gem"
        description="Discover Trikala, Greece - a charming city in Thessaly with rich history, stunning nature, and authentic Greek culture. Your perfect base for exploring central Greece."
        canonical="/about-trikala"
        keywords={[
          'Trikala Greece',
          'Central Greece',
          'Thessaly',
          'Greek city',
          'Meteora gateway',
          'cycling capital Greece',
          'smart city Greece',
          'authentic Greece',
          'Greek culture',
          'Byzantine castle'
        ]}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Place",
          "name": "Trikala",
          "description": "A charming city in Thessaly with rich history, stunning nature, and authentic Greek culture",
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 39.5551,
            "longitude": 21.7665
          },
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Trikala",
            "addressRegion": "Thessaly",
            "addressCountry": "GR"
          }
        }}
      />

      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroTrikala})` }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 container text-center text-white">
          <Badge className="bg-accent text-white mb-4">Central Greece</Badge>
          <h1 className="font-serif text-4xl md:text-6xl mb-6">
            Discover Trikala
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Where ancient history meets modern charm in the heart of Thessaly
          </p>
        </div>
      </section>

      {/* Quick Facts */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {quickFacts.map((fact, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <fact.icon className="h-8 w-8 text-accent mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-1">{fact.value}</h3>
                  <p className="text-gray-600 text-sm">{fact.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl mb-6">A City of Stories</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Trikala is one of Greece's most livable cities, perfectly balancing its rich 2,300-year history with modern innovation. 
              Nestled in the fertile plains of Thessaly, it serves as the ideal gateway to both ancient wonders and natural beauty.
            </p>
            <p className="text-gray-600 leading-relaxed">
              From the Byzantine fortress overlooking the city to the tranquil Lithaios River flowing through its heart, 
              Trikala offers visitors an authentic Greek experience away from the crowds, where every corner tells a story 
              and every local has a warm welcome.
            </p>
          </div>
        </div>
      </section>

      {/* What Makes Trikala Special */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-12">What Makes Trikala Special</h2>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="font-serif text-2xl mb-4">Gateway to Meteora</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Just 60 minutes from the world-famous Meteora monasteries, Trikala offers the perfect base for exploring 
                these UNESCO World Heritage sites while enjoying the comfort and authenticity of a real Greek city.
              </p>
              
              <h3 className="font-serif text-2xl mb-4">Smart City Innovation</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Trikala is Greece's first smart city, seamlessly blending cutting-edge technology with traditional charm. 
                Free WiFi throughout the center, smart traffic systems, and digital services make it surprisingly modern.
              </p>

              <h3 className="font-serif text-2xl mb-4">Authentic Greek Life</h3>
              <p className="text-gray-600 leading-relaxed">
                Experience genuine Greek hospitality in a city where tourism hasn't changed the local character. 
                Enjoy traditional kafeneia, family-run tavernas, and the unhurried pace of authentic Greek life.
              </p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Perfect Location</h4>
                      <p className="text-sm text-gray-600">Central Greece hub</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Equidistant from Athens, Thessaloniki, and major attractions like Meteora and Mount Olympus.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Coffee className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Vibrant Culture</h4>
                      <p className="text-sm text-gray-600">Year-round events</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    From the famous Mill of Elves Christmas park to summer festivals and cultural events.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Mountain className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Natural Beauty</h4>
                      <p className="text-sm text-gray-600">Rivers & mountains</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Lithaios River, nearby Pindus mountains, and easy access to Greece's natural wonders.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Trikala */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-12">Explore Trikala</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {trikalaHighlights.map((highlight) => (
              <Link
                key={highlight.title}
                to={highlight.link}
                className="group block"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="relative">
                    <img 
                      src={highlight.img} 
                      alt={highlight.title} 
                      className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      loading="lazy" 
                    />
                    <div className="absolute top-4 left-4">
                      <div className="w-10 h-10 bg-white/90 rounded-lg flex items-center justify-center">
                        <highlight.icon className="h-5 w-5 text-accent" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-serif text-xl mb-2 group-hover:text-accent transition-colors">
                      {highlight.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{highlight.text}</p>
                    <div className="flex items-center text-accent text-sm font-medium">
                      Learn more <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>


        </div>
      </section>

      <Footer />
    </main>
  );
};

export default AboutTrikala;
