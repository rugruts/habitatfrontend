import React from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { trackPageView } from "@/components/GoogleAnalytics";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, MapPin, Coffee, Mail } from "lucide-react";
import expCastle from "@/assets/exp-castle.jpg";
import expMeteora from "@/assets/exp-meteora.jpg";
import expCafe from "@/assets/exp-cafe.jpg";
import Footer from "@/components/Footer";
import ViberIcon from "@/components/ui/viber-icon";

const blocks = [
  {
    img: expCastle,
    title: "History & Culture",
    text: "Byzantine castle views, museums, and old‑town charm.",
    link: "/about-trikala/history-culture"
  },
  {
    img: expMeteora,
    title: "Nature & Day Trips",
    text: "Riverside walks and iconic Meteora an hour away.",
    link: "/about-trikala/nature-day-trips"
  },
  {
    img: expCafe,
    title: "Local Life",
    text: "Cafés, markets, and the rhythm of everyday Trikala.",
    link: "/about-trikala/local-life"
  },
];

const About: React.FC = () => {
  React.useEffect(() => {
    trackPageView('about-habitat-lobby');
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SEO
        title="About Habitat Lobby – Boutique Apartments in Trikala, Greece"
        description="Discover Habitat Lobby, a collection of boutique apartments in Trikala, Greece. Experience authentic local hospitality with modern comfort in the heart of Central Greece."
        canonical="/about"
        keywords={[
          'Habitat Lobby',
          'boutique apartments Trikala',
          'Greece accommodation',
          'authentic hospitality',
          'Central Greece hotels',
          'Trikala apartments',
          'local experiences Greece',
          'modern comfort Greece',
          'Thessaly accommodation'
        ]}
      />

      {/* Hero Section - About Habitat Lobby */}
      <section className="bg-gradient-to-br from-primary to-primary/90 text-white py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-accent text-white mb-4">Boutique Hospitality</Badge>
              <h1 className="font-serif text-4xl md:text-5xl mb-6">
                About Habitat Lobby
              </h1>
              <p className="text-xl text-white/90 leading-relaxed mb-6">
                Habitat Lobby is a collection of thoughtfully designed boutique apartments in the heart of Trikala, Greece. We combine modern comfort with authentic local experiences to create unforgettable stays.
              </p>
              <p className="text-white/80 leading-relaxed mb-8">
                "We believe travel should be about authentic connections and discovering places through local eyes. Our locally-curated experiences, insider recommendations, and personalized service help you discover the real Trikala."
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  variant="accent"
                  onClick={() => window.open('viber://chat?number=stefanos_habitat', '_blank')}
                  className="flex items-center gap-2"
                >
                  <ViberIcon className="h-4 w-4" />
                  Chat with Us
                </Button>
                <Button
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-primary"
                  onClick={() => window.open('mailto:info@habitatlobby.com', '_blank')}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Us
                </Button>
              </div>
            </div>

            <div className="relative">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <div className="aspect-square bg-white/20 rounded-lg mb-4 flex items-center justify-center">
                    <Heart className="h-12 w-12 text-white/60" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Our Promise</h3>
                  <p className="text-white/80 text-sm mb-4">Authentic experiences in Central Greece</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-accent" />
                      <span>Located in Trikala's heart</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-accent" />
                      <span>Passionate about hospitality</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Coffee className="h-4 w-4 text-accent" />
                      <span>Local culture & experiences</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-accent" />
                      <span>5-star guest satisfaction</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Habitat Lobby Story */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl mb-6">The Habitat Lobby Story</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              What started as a dream to share Trikala's authentic charm has grown into a carefully curated collection of apartments, each designed to offer guests a genuine taste of local life.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <Card>
                <CardContent className="pt-6 text-center">
                  <Heart className="h-8 w-8 text-accent mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Personal Touch</h3>
                  <p className="text-gray-600 text-sm">Every detail is thoughtfully chosen, from local artwork to welcome treats made by local families.</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <MapPin className="h-8 w-8 text-accent mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Prime Locations</h3>
                  <p className="text-gray-600 text-sm">Each apartment is strategically located to give you the best of Trikala within walking distance.</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <Coffee className="h-8 w-8 text-accent mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Local Insights</h3>
                  <p className="text-gray-600 text-sm">Get insider recommendations for the best cafes, restaurants, and hidden gems only locals know about.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Discover Trikala */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-12">Discover Trikala with Us</h2>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {blocks.map((b) => (
              <Link
                key={b.title}
                to={b.link}
                className="rounded-lg overflow-hidden border animate-fade-in hover:shadow-lg transition-shadow duration-300 group block bg-white"
              >
                <img src={b.img} alt={b.title} className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                <div className="p-6">
                  <h3 className="font-serif text-xl md:text-2xl group-hover:text-accent transition-colors mb-2">{b.title}</h3>
                  <p className="text-gray-600">{b.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default About;
