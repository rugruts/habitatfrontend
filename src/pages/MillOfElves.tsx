import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Calendar, Camera, Thermometer, Car, Sparkles, Navigation, ParkingCircle, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import Mill of Elves images
import mill1 from '@/assets/mill1.jpg'; // Hero image
import mill2 from '@/assets/mill2.jpg'; // Workshop
import mill3 from '@/assets/mill3.jpg'; // Santa's house
import mill4 from '@/assets/mill4.jpeg'; // Magic train
import mill5 from '@/assets/mill5.jpg'; // Lights show
import mill6 from '@/assets/mill6.jpg'; // Playground
import mill7 from '@/assets/mill7.jpg'; // Night view
import mill8 from '@/assets/mill8.jpg'; // Family photo
import mill9 from '@/assets/mill9.jpg'; // Gallery image 1
import mill10 from '@/assets/mill10.jpg'; // Gallery image 2
import mill11 from '@/assets/mill11.jpg'; // Gallery image 3
import mill12 from '@/assets/mill12.jpg'; // Gallery image 4

const MillOfElves: React.FC = () => {
  const { t } = useTranslation();

  const attractions = [
    {
      title: t('millOfElves.attractions.workshop'),
      description: t('millOfElves.attractions.workshopDesc'),
      image: mill2, // Workshop image
      icon: '🧝‍♂️'
    },
    {
      title: t('millOfElves.attractions.santaHouse'),
      description: t('millOfElves.attractions.santaHouseDesc'),
      image: mill3, // Santa's house image
      icon: '🎅'
    },
    {
      title: t('millOfElves.attractions.magicTrain'),
      description: t('millOfElves.attractions.magicTrainDesc'),
      image: mill4, // Magic train image
      icon: '🚂'
    },
    {
      title: t('millOfElves.attractions.playground'),
      description: t('millOfElves.attractions.playgroundDesc'),
      image: mill6, // Playground image
      icon: '🎠'
    },
    {
      title: t('millOfElves.attractions.lightShow'),
      description: t('millOfElves.attractions.lightShowDesc'),
      image: mill5, // Light show image
      icon: '✨'
    }
  ];

  const practicalInfo = [
    {
      icon: <Calendar className="h-5 w-5" />,
      title: t('millOfElves.practical.when'),
      description: t('millOfElves.practical.whenDesc')
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: t('millOfElves.practical.where'),
      description: t('millOfElves.practical.whereDesc')
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: t('millOfElves.practical.hours'),
      description: t('millOfElves.practical.hoursDesc')
    },
    {
      icon: <Badge className="h-5 w-5" />,
      title: t('millOfElves.practical.admission'),
      description: t('millOfElves.practical.admissionDesc')
    }
  ];

  const tips = [
    {
      icon: <Clock className="h-5 w-5" />,
      title: t('millOfElves.tips.timing'),
      description: t('millOfElves.tips.timingDesc')
    },
    {
      icon: <Thermometer className="h-5 w-5" />,
      title: t('millOfElves.tips.weather'),
      description: t('millOfElves.tips.weatherDesc')
    },
    {
      icon: <Car className="h-5 w-5" />,
      title: t('millOfElves.tips.parking'),
      description: t('millOfElves.tips.parkingDesc')
    },
    {
      icon: <Camera className="h-5 w-5" />,
      title: t('millOfElves.tips.photos'),
      description: t('millOfElves.tips.photosDesc')
    }
  ];

  return (
    <>
      <SEO 
        title={t('millOfElves.title')}
        description={t('millOfElves.description')}
      />

      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${mill1})` }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 container text-center text-white">
          <Badge className="bg-accent text-white mb-4 flex items-center gap-2 w-fit mx-auto">
            <Sparkles className="h-4 w-4" />
            {t('millOfElves.hero.badge')}
          </Badge>
          <h1 className="font-serif text-4xl md:text-6xl mb-6">
            {t('millOfElves.title')}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
            {t('millOfElves.subtitle')}
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
            <Link to="/check-availability">{t('millOfElves.hero.planVisit')}</Link>
          </Button>
        </div>
      </section>

      {/* Introduction */}
      <section className="container py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-primary mb-6 text-center">
            {t('millOfElves.whatIs.title')}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-center mb-12">
            {t('millOfElves.description')}
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {t('millOfElves.whatIs.content')}
              </p>
              <h3 className="font-serif text-2xl text-primary mb-4">
                {t('millOfElves.history.title')}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('millOfElves.history.content')}
              </p>
            </div>
            <div className="relative">
              <img
                src={mill7}
                alt={t('millOfElves.gallery.nightView')}
                className="rounded-lg shadow-lg w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Proximity to Habitat Lobby */}
      <section className="bg-primary/5 py-16 md:py-20">
        <div className="container">
          <h2 className="font-serif text-3xl md:text-4xl text-primary text-center mb-12">
            {t('millOfElves.proximity.title')}
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-accent text-white p-3 rounded-full">
                  <Navigation className="h-6 w-6" />
                </div>
              </div>
              <h3 className="font-semibold text-primary mb-2">{t('millOfElves.proximity.walkingTime')}</h3>
              <p className="text-muted-foreground">{t('millOfElves.proximity.walkingDesc')}</p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-accent text-white p-3 rounded-full">
                  <ParkingCircle className="h-6 w-6" />
                </div>
              </div>
              <h3 className="font-semibold text-primary mb-2">{t('millOfElves.proximity.parking')}</h3>
              <p className="text-muted-foreground">{t('millOfElves.proximity.parkingDesc')}</p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-accent text-white p-3 rounded-full">
                  <Home className="h-6 w-6" />
                </div>
              </div>
              <h3 className="font-semibold text-primary mb-2">{t('millOfElves.proximity.convenience')}</h3>
              <p className="text-muted-foreground">{t('millOfElves.proximity.convenienceDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Attractions */}
      <section className="bg-accent/5 py-16 md:py-20">
        <div className="container">
          <h2 className="font-serif text-3xl md:text-4xl text-primary text-center mb-12">
            {t('millOfElves.attractions.title')}
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {attractions.map((attraction, index) => (
              <Card key={index} className="overflow-hidden hover-lift group">
                <div className="relative">
                  <img 
                    src={attraction.image} 
                    alt={attraction.title}
                    className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-white text-2xl p-2 rounded-full shadow-lg">
                    {attraction.icon}
                  </div>
                </div>
                <CardContent className="pt-6">
                  <h3 className="font-serif text-xl text-primary mb-3">{attraction.title}</h3>
                  <p className="text-muted-foreground">{attraction.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="container py-16 md:py-20">
        <h2 className="font-serif text-3xl md:text-4xl text-primary text-center mb-12">
          {t('millOfElves.gallery.title')}
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <img
              src={mill8}
              alt={t('millOfElves.gallery.families')}
              className="rounded-lg shadow-lg w-full h-80 object-cover hover-lift"
            />
          </div>
          <div>
            <img
              src={mill9}
              alt={t('millOfElves.gallery.lights')}
              className="rounded-lg shadow-lg w-full h-80 object-cover hover-lift"
            />
          </div>
          <div>
            <img
              src={mill10}
              alt={t('millOfElves.gallery.attractions')}
              className="rounded-lg shadow-lg w-full h-60 object-cover hover-lift"
            />
          </div>
          <div className="lg:col-span-2">
            <img
              src={mill11}
              alt={t('millOfElves.gallery.atmosphere')}
              className="rounded-lg shadow-lg w-full h-60 object-cover hover-lift"
            />
          </div>
          <div className="lg:col-span-3">
            <img
              src={mill12}
              alt={t('millOfElves.gallery.panoramic')}
              className="rounded-lg shadow-lg w-full h-48 object-cover hover-lift"
            />
          </div>
        </div>
      </section>

      {/* Practical Information */}
      <section className="bg-primary/5 py-16 md:py-20">
        <div className="container">
          <h2 className="font-serif text-3xl md:text-4xl text-primary text-center mb-12">
            {t('millOfElves.practical.title')}
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {practicalInfo.map((info, index) => (
              <Card key={index} className="text-center p-6">
                <div className="flex justify-center mb-4 text-accent">
                  {info.icon}
                </div>
                <h3 className="font-semibold text-primary mb-2">{info.title}</h3>
                <p className="text-sm text-muted-foreground">{info.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Visiting Tips */}
      <section className="container py-16 md:py-20">
        <h2 className="font-serif text-3xl md:text-4xl text-primary text-center mb-12">
          {t('millOfElves.tips.title')}
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {tips.map((tip, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0 text-accent mt-1">
                {tip.icon}
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-2">{tip.title}</h3>
                <p className="text-muted-foreground">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-accent text-white py-16 md:py-20">
        <div className="container text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-6">
            {t('millOfElves.cta.title')}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {t('millOfElves.cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/check-availability">{t('millOfElves.cta.checkAvailability')}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-accent bg-transparent">
              <Link to="/apartments">{t('millOfElves.cta.viewApartments')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default MillOfElves;
