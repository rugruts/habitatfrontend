import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Star, 
  MapPin, 
  Users, 
  Bed, 
  Bath, 
  Wifi, 
  Car, 
  Coffee,
  Bike,
  Mountain,
  Castle,
  Heart,
  Calendar,
  ArrowRight,
  Sparkles,
  Award,
  Shield,
  Clock,
  CheckCircle,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Building2,
  Phone,
  Mail,
  ExternalLink
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { supabaseHelpers } from '@/lib/supabase';
import TrikalaSlideshow from '@/components/TrikalaSlideshow';

// Import experience images
import expCycling from "@/assets/exp-cycling.jpg";
import expCastle from "@/assets/exp-castle.jpg";
import expCafe from "@/assets/exp-cafe.jpg";
import expMeteora from "@/assets/exp-meteora.jpg";
import expPertouli from "@/assets/exp-pertouli.jpg";

// Property interface
interface Property {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_per_night: number;
  currency: string;
  rating: number;
  review_count: number;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  amenities: string[];
}

// Review interface
interface HomepageReview {
  id: string;
  guest_name: string;
  guest_avatar_url?: string;
  overall_rating: number;
  review_text: string;
  property_name: string;
  created_at: string;
  is_verified: boolean;
}

const Index: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [reviews, setReviews] = useState<HomepageReview[]>([]);

  useEffect(() => {
    fetchProperties();
    fetchHomepageReviews();
  }, []);

  // Enhanced experiences with better descriptions
  const experiences = [
    {
      title: t('experience.cycling.title'),
      text: t('experience.cycling.text'),
      img: expCycling,
      icon: Bike,
      link: "/about-trikala/cycling-city"
    },
    {
      title: t('experience.history.title'),
      text: t('experience.history.text'),
      img: expCastle,
      icon: Castle,
      link: "/about-trikala/history-culture"
    },
    {
      title: t('about.localLife'),
      text: t('about.localLifeDesc'),
      img: expCafe,
      icon: Coffee,
      link: "/about-trikala/local-life"
    },
    {
      title: t('about.natureDayTrips'),
      text: t('about.natureDayTripsDesc'),
      img: expMeteora,
      icon: Mountain,
      link: "/about-trikala/nature-day-trips"
    },
    {
      title: t('experience.pertouli.title'),
      text: t('experience.pertouli.text'),
      img: expPertouli,
      icon: Mountain,
      link: "/pertouli-guide"
    }
  ];

  // Enhanced mini guide with better content
  const miniGuide = [
    {
      title: t('experience.cafes.title'),
      description: t('experience.cafes.text'),
      icon: Coffee,
      link: "/about-trikala/local-life",
      badge: t('about.localCulture')
    },
    {
      title: t('about.natureDayTrips'),
      description: t('about.natureDayTripsDesc'),
      icon: MapPin,
      link: "/about-trikala/nature-day-trips",
      badge: t('experience.meteora.title')
    },
    {
      title: t('experience.cycling.title'),
      description: t('experience.cycling.text'),
      icon: Bike,
      link: "/about-trikala/cycling-city",
      badge: t('pages.experiences.cyclingCapital')
    }
  ];

  // Enhanced trust indicators
  const trustIndicators = [
    {
      icon: Shield,
      title: t('trust.securePayment'),
      description: t('trust.instantConfirmation')
    },
    {
      icon: Award,
      title: t('about.fiveStarSatisfaction'),
      description: t('trust.bestRateGuarantee')
    },
    {
      icon: Clock,
      title: t('trust.localHostSupport'),
      description: t('pages.contact.getInTouchDesc')
    }
  ];

  // Enhanced hero stats
  const heroStats = [
    { value: "4.9", label: t('reviews.rating'), icon: Star },
    { value: "500+", label: t('pages.home.guests'), icon: Heart },
    { value: "24/7", label: t('footer.contact'), icon: Clock }
  ];

  const fetchProperties = async () => {
    try {
      const result = await supabaseHelpers.getAllProperties();
      setProperties(result || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHomepageReviews = async () => {
    try {
      const reviewsData = await supabaseHelpers.getHomepageReviews(6);
      setReviews(reviewsData.map((review: { id: string; guest_name: string; guest_avatar_url?: string; overall_rating: number; review_text: string; properties?: { name: string }; created_at: string; is_verified: boolean }) => ({
        id: review.id,
        guest_name: review.guest_name,
        guest_avatar_url: review.guest_avatar_url,
        overall_rating: review.overall_rating,
        review_text: review.review_text,
        property_name: review.properties?.name || t('footer.ourApartments'),
        created_at: review.created_at,
        is_verified: review.is_verified
      })));
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const experienceIcon = (icon: React.ComponentType<{ className?: string }>) => {
    const IconComponent = icon;
    return <IconComponent className="w-6 h-6" />;
  };

  if (loading) {
    return (
      <div className="mobile-loading-overlay">
        <div className="mobile-loading-spinner" />
        <p className="mt-4 text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="bg-background">
      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Background Image with Fallback */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-trikala.jpg"
            alt={t('footer.trikalaGreece')}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />
        </div>

        {/* Enhanced Hero Content */}
        <div className="mobile-hero-content mobile-animate-fade-in-up">
          {/* Premium Badge */}
          <div className="flex justify-center mb-6">
            <Badge className="mobile-badge-accent px-4 py-2 text-sm font-semibold border-0">
              <Award className="w-4 h-4 mr-2" />
              {t('pages.home.subtitle')}
            </Badge>
          </div>

          {/* Main Headline */}
          <h1 className="mobile-text-hero mobile-text-glow mb-6">
            {t('hero.discover')}
          </h1>

          {/* Enhanced Description */}
          <p className="mobile-text-body text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
            {t('hero.subtitle')}
          </p>

          {/* Enhanced Hero Stats */}
          <div className="grid grid-cols-3 gap-6 mb-8 max-w-2xl mx-auto">
            {heroStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={stat.label}
                  className="text-center mobile-animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl mx-auto mb-3">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-white/80 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              size="lg" 
              className="mobile-button-large mobile-button-accent mobile-transform-hover mobile-focus-ring"
              asChild
            >
              <Link to="/apartments">
                <Calendar className="w-5 h-5 mr-2" />
                {t('hero.bookNow')}
                <Sparkles className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="mobile-button-large mobile-button-outline mobile-transform-hover mobile-focus-ring bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              asChild
            >
              <Link to="/about-trikala">
                <MapPin className="w-5 h-5 mr-2" />
                {t('hero.exploreApartments')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Enhanced Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-white/80">
            {trustIndicators.map((indicator, index) => {
              const Icon = indicator.icon;
              return (
                <div 
                  key={indicator.title}
                  className="flex items-center space-x-2 mobile-animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Icon className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">{indicator.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Enhanced About Trikala Section */}
      <section className="mobile-section-content">
        <div className="mobile-container">
          <div className="text-center mb-12">
            <Badge className="mobile-badge-primary mb-4">
              <MapPin className="w-4 h-4 mr-2" />
              {t('aboutTrikala.hero.badge')}
            </Badge>
            <h2 className="mobile-text-title mb-4">
              {t('aboutTrikala.hero.title')}
            </h2>
            <p className="mobile-text-body text-muted-foreground max-w-3xl mx-auto">
              {t('aboutTrikala.hero.subtitle')}
            </p>
          </div>

          {/* Enhanced Slideshow */}
          <div className="mobile-animate-scale-in">
            <TrikalaSlideshow 
              items={experiences} 
              autoPlay={true} 
              interval={6000} 
            />
          </div>
        </div>
      </section>

      {/* Enhanced Experience the City Section */}
      <section className="mobile-section-content bg-muted/30">
        <div className="mobile-container">
          <div className="text-center mb-12">
            <h2 className="mobile-text-title mb-4">
              {t('experienceCity.title')}
            </h2>
            <p className="mobile-text-body text-muted-foreground max-w-3xl mx-auto">
              {t('experienceCity.subtitle')}
            </p>
          </div>

          <div className="mobile-grid-responsive">
            {/* Enhanced See Our Apartments Card */}
            <Card className="mobile-card-elevated mobile-card-interactive mobile-animate-fade-in-up">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="mobile-text-subtitle">{t('home.seeOurApartments')}</CardTitle>
                <CardDescription className="mobile-text-body">
                  {t('pages.home.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  variant="outline" 
                  className="mobile-button-outline mobile-transform-hover mobile-focus-ring"
                  asChild
                >
                  <Link to="/apartments">
                    {t('hero.exploreApartments')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Enhanced Plan Your Stay Card */}
            <Card className="mobile-card-elevated mobile-card-interactive mobile-animate-fade-in-up">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="mobile-text-subtitle">{t('home.planYourStay')}</CardTitle>
                <CardDescription className="mobile-text-body">
                  {t('about.localInsightsDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  variant="outline" 
                  className="mobile-button-outline mobile-transform-hover mobile-focus-ring"
                  asChild
                >
                  <Link to="/about-trikala">
                    {t('cta.learnMore')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Featured Apartments Section */}
      <section className="mobile-section-content">
        <div className="mobile-container">
          <div className="text-center mb-12">
            <h2 className="mobile-text-title mb-4">
              {t('featured.title')}
            </h2>
            <p className="mobile-text-body text-muted-foreground max-w-3xl mx-auto">
              {t('featured.subtitle')}
            </p>
          </div>

          <div className="mobile-grid-responsive">
            {properties.slice(0, 3).map((property, index) => (
              <Card 
                key={property.id} 
                className="mobile-card-elevated mobile-card-interactive mobile-animate-fade-in-up overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={property.images[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"}
                    alt={property.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="mobile-badge-accent">
                      {property.currency} {property.price_per_night}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white text-sm font-semibold">{property.rating}</span>
                  </div>
                </div>
                
                <CardHeader className="pb-4">
                  <CardTitle className="mobile-text-subtitle">{property.name}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{property.max_guests}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Bed className="w-4 h-4" />
                      <span>{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Bath className="w-4 h-4" />
                      <span>{property.bathrooms}</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <Button 
                    className="w-full mobile-button-primary mobile-transform-hover mobile-focus-ring"
                    asChild
                  >
                    <Link to={`/apartments/${property.id}`}>
                      {t('featured.viewDetails')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              className="mobile-button-outline mobile-transform-hover mobile-focus-ring"
              asChild
            >
              <Link to="/apartments">
                {t('featured.viewAll')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Mini Guide Carousel Section */}
      <section className="mobile-section-content bg-muted/30">
        <div className="mobile-container">
          <div className="text-center mb-12">
            <h2 className="mobile-text-title mb-4">
              {t('guide.title')}
            </h2>
            <p className="mobile-text-body text-muted-foreground max-w-3xl mx-auto">
              {t('about.localInsightsDesc')}
            </p>
          </div>

          <div className="mobile-grid-responsive">
            {miniGuide.map((guide, index) => {
              const Icon = guide.icon;
              return (
                <Card 
                  key={guide.title} 
                  className="mobile-card-elevated mobile-card-interactive mobile-animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="mobile-text-subtitle">{guide.title}</CardTitle>
                    <CardDescription className="mobile-text-body">
                      {guide.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button 
                      variant="outline" 
                      className="mobile-button-outline mobile-transform-hover mobile-focus-ring"
                      asChild
                    >
                      <Link to={guide.link}>
                        {guide.badge}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Reviews Section */}
      <section className="mobile-section-content">
        <div className="mobile-container">
          <div className="text-center mb-12">
            <h2 className="mobile-text-title mb-4">
              {t('reviews.title')}
            </h2>
            <p className="mobile-text-body text-muted-foreground max-w-3xl mx-auto">
              {t('pages.home.description')}
            </p>
          </div>

          <div className="mobile-grid-responsive">
            {reviews.slice(0, 3).map((review, index) => (
              <Card 
                key={review.id} 
                className="mobile-card-elevated mobile-animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                      {review.guest_avatar_url ? (
                        <img 
                          src={review.guest_avatar_url} 
                          alt={review.guest_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-semibold text-lg">
                          {review.guest_name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-foreground">{review.guest_name}</span>
                        {review.is_verified && (
                          <Badge variant="secondary" className="text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {t('ui.confirm')}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < review.overall_rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">{review.property_name}</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="mobile-text-body text-muted-foreground italic">
                    "{review.review_text}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              className="mobile-button-outline mobile-transform-hover mobile-focus-ring"
              asChild
            >
              <Link to="/reviews">
                {t('reviews.showMore')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="mobile-section-content bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="mobile-container text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="mobile-text-title mb-4">
              {t('cta.readyToBook')}
            </h2>
            <p className="mobile-text-body text-muted-foreground mb-8">
              {t('cta.experienceBest')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="mobile-button-large mobile-button-accent mobile-transform-hover mobile-focus-ring"
                asChild
              >
                <Link to="/apartments">
                  <Calendar className="w-5 h-5 mr-2" />
                  {t('booking.title')}
                  <Sparkles className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="mobile-button-large mobile-button-outline mobile-transform-hover mobile-focus-ring"
                asChild
              >
                <Link to="/contact">
                  <Phone className="w-5 h-5 mr-2" />
                  {t('footer.contact')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
