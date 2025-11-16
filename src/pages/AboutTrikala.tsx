import React from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { trackPageView } from "@/utils/analytics";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, Mountain, Coffee, Camera, ArrowRight, Bike } from "lucide-react";
import expCastle from "@/assets/exp-castle.jpg";
import expMeteora from "@/assets/exp-meteora.jpg";
import expCafe from "@/assets/exp-cafe.jpg";
import expCycling from "@/assets/exp-cycling.jpg";
import heroTrikala from "@/assets/hero-trikala.jpg";
import { useTranslation } from "@/hooks/useTranslation";



const AboutTrikala: React.FC = () => {
  const { t } = useTranslation();

  React.useEffect(() => {
    trackPageView('about-trikala');
  }, []);

  // Define quick facts with translations
  const quickFacts = [
    { icon: Users, label: t('aboutTrikala.facts.population.label'), value: t('aboutTrikala.facts.population.value') },
    { icon: MapPin, label: t('aboutTrikala.facts.region.label'), value: t('aboutTrikala.facts.region.value') },
    { icon: Clock, label: t('aboutTrikala.facts.founded.label'), value: t('aboutTrikala.facts.founded.value') },
    { icon: Mountain, label: t('aboutTrikala.facts.elevation.label'), value: t('aboutTrikala.facts.elevation.value') },
  ];

  // Define highlights with translations
  const trikalaHighlights = [
    {
      img: expCycling,
      title: t('aboutTrikala.highlights.cycling.title'),
      text: t('aboutTrikala.highlights.cycling.description'),
      link: "/about-trikala/cycling-city",
      icon: Bike
    },
    {
      img: expCastle,
      title: t('aboutTrikala.highlights.history.title'),
      text: t('aboutTrikala.highlights.history.description'),
      link: "/about-trikala/history-culture",
      icon: Camera
    },
    {
      img: expMeteora,
      title: t('aboutTrikala.highlights.nature.title'),
      text: t('aboutTrikala.highlights.nature.description'),
      link: "/about-trikala/nature-day-trips",
      icon: Mountain
    },
    {
      img: expCafe,
      title: t('aboutTrikala.highlights.local.title'),
      text: t('aboutTrikala.highlights.local.description'),
      link: "/about-trikala/local-life",
      icon: Coffee
    },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SEO
        title={t('aboutTrikala.title')}
        description={t('aboutTrikala.description')}
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
          <Badge className="bg-accent text-white mb-4">{t('aboutTrikala.hero.badge')}</Badge>
          <h1 className="font-serif text-4xl md:text-6xl mb-6">
            {t('aboutTrikala.hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            {t('aboutTrikala.hero.subtitle')}
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
            <h2 className="font-serif text-3xl md:text-4xl mb-6">{t('aboutTrikala.stories.title')}</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              {t('aboutTrikala.stories.intro')}
            </p>
            <p className="text-gray-600 leading-relaxed">
              {t('aboutTrikala.stories.description')}
            </p>
          </div>
        </div>
      </section>

      {/* What Makes Trikala Special */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-12">{t('aboutTrikala.special.title')}</h2>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="font-serif text-2xl mb-4">{t('aboutTrikala.special.meteora.title')}</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {t('aboutTrikala.special.meteora.description')}
              </p>

              <h3 className="font-serif text-2xl mb-4">{t('aboutTrikala.special.smartCity.title')}</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {t('aboutTrikala.special.smartCity.description')}
              </p>

              <h3 className="font-serif text-2xl mb-4">{t('aboutTrikala.special.authentic.title')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('aboutTrikala.special.authentic.description')}
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
                      <h4 className="font-semibold">{t('aboutTrikala.features.location.title')}</h4>
                      <p className="text-sm text-gray-600">{t('aboutTrikala.features.location.subtitle')}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {t('aboutTrikala.features.location.description')}
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
                      <h4 className="font-semibold">{t('aboutTrikala.features.culture.title')}</h4>
                      <p className="text-sm text-gray-600">{t('aboutTrikala.features.culture.subtitle')}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {t('aboutTrikala.features.culture.description')}
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
                      <h4 className="font-semibold">{t('aboutTrikala.features.nature.title')}</h4>
                      <p className="text-sm text-gray-600">{t('aboutTrikala.features.nature.subtitle')}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {t('aboutTrikala.features.nature.description')}
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
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-12">{t('aboutTrikala.explore.title')}</h2>

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
                      {t('aboutTrikala.explore.learnMore')} <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>


        </div>
      </section>

    </main>
  );
};

export default AboutTrikala;
