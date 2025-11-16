import React from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { trackPageView } from "@/utils/analytics";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, Camera, Users, ArrowRight, Calendar, Info, Star, Bike, Route, Shield, Trees, Coffee, Heart, Navigation, Zap, Building, Wrench, Car as Parking, Map as MapIcon, CheckCircle, AlertCircle, Sun, Moon, Thermometer, ShoppingBag, Castle, Landmark, Sunset } from "lucide-react";
import cyclingHero from "@/assets/exp-cycling.jpg";
import lithaiosRiver from "@/assets/lithaios-river-real.jpg";
import Map, { MapLocation } from "@/components/Map";













const CyclingCity: React.FC = () => {
  const { t } = useTranslation();

  React.useEffect(() => {
    trackPageView('cycling-city');
  }, []);

  // Define highlights with translations
  const highlights = [
    {
      title: t('cyclingCity.highlights.lithaios.title'),
      description: t('cyclingCity.highlights.lithaios.description'),
      icon: Bike,
      category: t('cyclingCity.highlights.lithaios.category'),
      duration: t('cyclingCity.highlights.lithaios.duration')
    },
    {
      title: t('cyclingCity.highlights.carFree.title'),
      description: t('cyclingCity.highlights.carFree.description'),
      icon: Shield,
      category: t('cyclingCity.highlights.carFree.category'),
      duration: t('cyclingCity.highlights.carFree.duration')
    },
    {
      title: t('cyclingCity.highlights.millPark.title'),
      description: t('cyclingCity.highlights.millPark.description'),
      icon: Trees,
      category: t('cyclingCity.highlights.millPark.category'),
      duration: t('cyclingCity.highlights.millPark.duration')
    },
    {
      title: t('cyclingCity.highlights.smartNetwork.title'),
      description: t('cyclingCity.highlights.smartNetwork.description'),
      icon: Navigation,
      category: t('cyclingCity.highlights.smartNetwork.category'),
      duration: t('cyclingCity.highlights.smartNetwork.duration')
    },
    {
      title: t('cyclingCity.highlights.cafes.title'),
      description: t('cyclingCity.highlights.cafes.description'),
      icon: Coffee,
      category: t('cyclingCity.highlights.cafes.category'),
      duration: t('cyclingCity.highlights.cafes.duration')
    },
    {
      title: t('cyclingCity.highlights.castle.title'),
      description: t('cyclingCity.highlights.castle.description'),
      icon: MapIcon,
      category: t('cyclingCity.highlights.castle.category'),
      duration: t('cyclingCity.highlights.castle.duration')
    }
  ];

  // Define cycling routes with translations
  const cyclingRoutes = [
    {
      name: t('cyclingCity.routes.riverside.name'),
      distance: t('cyclingCity.routes.riverside.distance'),
      difficulty: t('cyclingCity.routes.riverside.difficulty'),
      duration: t('cyclingCity.routes.riverside.duration'),
      elevation: t('cyclingCity.routes.riverside.elevation'),
      description: t('cyclingCity.routes.riverside.description'),
      highlights: [t('cyclingCity.routeHighlights.historicBridges'), t('cyclingCity.routeHighlights.riversideCafes'), t('cyclingCity.routeHighlights.shadedCanopy'), t('cyclingCity.routeHighlights.photoOpportunities')],
      startPoint: t('cyclingCity.routes.riverside.startPoint'),
      endPoint: t('cyclingCity.routes.riverside.endPoint'),
      surface: t('cyclingCity.routes.riverside.surface'),
      traffic: t('cyclingCity.routes.riverside.traffic')
    },
    {
      name: t('cyclingCity.routes.historic.name'),
      distance: t('cyclingCity.routes.historic.distance'),
      difficulty: t('cyclingCity.routes.historic.difficulty'),
      duration: t('cyclingCity.routes.historic.duration'),
      elevation: t('cyclingCity.routes.historic.elevation'),
      description: t('cyclingCity.routes.historic.description'),
      highlights: [t('cyclingCity.routeHighlights.centralSquare'), t('cyclingCity.routeHighlights.castleViewpoints'), t('cyclingCity.routeHighlights.oldTownArchitecture'), t('cyclingCity.routeHighlights.localMarkets')],
      startPoint: t('cyclingCity.routes.historic.startPoint'),
      endPoint: t('cyclingCity.routes.historic.endPoint'),
      surface: t('cyclingCity.routes.historic.surface'),
      traffic: t('cyclingCity.routes.historic.traffic')
    },
    {
      name: t('cyclingCity.routes.green.name'),
      distance: t('cyclingCity.routes.green.distance'),
      difficulty: t('cyclingCity.routes.green.difficulty'),
      duration: t('cyclingCity.routes.green.duration'),
      elevation: t('cyclingCity.routes.green.elevation'),
      description: t('cyclingCity.routes.green.description'),
      highlights: [t('cyclingCity.routeHighlights.millOfElvesPark'), t('cyclingCity.routeHighlights.botanicalGardens'), t('cyclingCity.routeHighlights.playgroundAreas'), t('cyclingCity.routeHighlights.picnicSpots')],
      startPoint: t('cyclingCity.routes.green.startPoint'),
      endPoint: t('cyclingCity.routes.green.endPoint'),
      surface: t('cyclingCity.routes.green.surface'),
      traffic: t('cyclingCity.routes.green.traffic')
    },
    {
      name: t('cyclingCity.routes.extended.name'),
      distance: t('cyclingCity.routes.extended.distance'),
      difficulty: t('cyclingCity.routes.extended.difficulty'),
      duration: t('cyclingCity.routes.extended.duration'),
      elevation: t('cyclingCity.routes.extended.elevation'),
      description: t('cyclingCity.routes.extended.description'),
      highlights: [t('cyclingCity.routeHighlights.extendedRiverViews'), t('cyclingCity.routeHighlights.suburbanNeighborhoods'), t('cyclingCity.routeHighlights.natureReserves'), t('cyclingCity.routeHighlights.localLife')],
      startPoint: t('cyclingCity.routes.extended.startPoint'),
      endPoint: t('cyclingCity.routes.extended.endPoint'),
      surface: t('cyclingCity.routes.extended.surface'),
      traffic: t('cyclingCity.routes.extended.traffic')
    },
    {
      name: t('cyclingCity.routes.sunset.name'),
      distance: t('cyclingCity.routes.sunset.distance'),
      difficulty: t('cyclingCity.routes.sunset.difficulty'),
      duration: t('cyclingCity.routes.sunset.duration'),
      elevation: t('cyclingCity.routes.sunset.elevation'),
      description: t('cyclingCity.routes.sunset.description'),
      highlights: [t('cyclingCity.routeHighlights.sunsetViewpoints'), t('cyclingCity.routeHighlights.castleFortifications'), t('cyclingCity.routeHighlights.eveningLight'), t('cyclingCity.routeHighlights.cityPanorama')],
      startPoint: t('cyclingCity.routes.sunset.startPoint'),
      endPoint: t('cyclingCity.routes.sunset.endPoint'),
      surface: t('cyclingCity.routes.sunset.surface'),
      traffic: t('cyclingCity.routes.sunset.traffic')
    },
    {
      name: t('cyclingCity.routes.morning.name'),
      distance: t('cyclingCity.routes.morning.distance'),
      difficulty: t('cyclingCity.routes.morning.difficulty'),
      duration: t('cyclingCity.routes.morning.duration'),
      elevation: t('cyclingCity.routes.morning.elevation'),
      description: t('cyclingCity.routes.morning.description'),
      highlights: [t('cyclingCity.routeHighlights.localMarkets'), t('cyclingCity.routeHighlights.traditionalBakeries'), t('cyclingCity.routeHighlights.coffeeRoasters'), t('cyclingCity.routeHighlights.artisanShops')],
      startPoint: t('cyclingCity.routes.morning.startPoint'),
      endPoint: t('cyclingCity.routes.morning.endPoint'),
      surface: t('cyclingCity.routes.morning.surface'),
      traffic: t('cyclingCity.routes.morning.traffic')
    }
  ];

  // Define cycling facilities with translations
  const cyclingFacilities = [
    {
      title: t('cyclingCity.facilities.smartBike.title'),
      description: t('cyclingCity.facilities.smartBike.description'),
      icon: Navigation,
      category: t('cyclingCity.facilities.smartBike.category'),
      details: [
        t('cyclingCity.facilities.smartBike.details.availability'),
        t('cyclingCity.facilities.smartBike.details.integration'),
        t('cyclingCity.facilities.smartBike.details.stations'),
        t('cyclingCity.facilities.smartBike.details.tracking')
      ]
    },
    {
      title: t('cyclingCity.facilities.infrastructure.title'),
      description: t('cyclingCity.facilities.infrastructure.description'),
      icon: Route,
      category: t('cyclingCity.facilities.infrastructure.category'),
      details: [
        t('cyclingCity.facilities.infrastructure.details.bikeLanes'),
        t('cyclingCity.facilities.infrastructure.details.separation'),
        t('cyclingCity.facilities.infrastructure.details.signals'),
        t('cyclingCity.facilities.infrastructure.details.signage')
      ]
    },
    {
      title: t('cyclingCity.facilities.rental.title'),
      description: t('cyclingCity.facilities.rental.description'),
      icon: Wrench,
      category: t('cyclingCity.facilities.rental.category'),
      details: [
        t('cyclingCity.facilities.rental.details.familyBikes'),
        t('cyclingCity.facilities.rental.details.repairs'),
        t('cyclingCity.facilities.rental.details.accessories'),
        t('cyclingCity.facilities.rental.details.equipment')
      ]
    },
    {
      title: t('cyclingCity.facilities.establishments.title'),
      description: t('cyclingCity.facilities.establishments.description'),
      icon: Coffee,
      category: t('cyclingCity.facilities.establishments.category'),
      details: [
        t('cyclingCity.facilities.establishments.details.parking'),
        t('cyclingCity.facilities.establishments.details.water'),
        t('cyclingCity.facilities.establishments.details.amenities'),
        t('cyclingCity.facilities.establishments.details.discounts')
      ]
    },
    {
      title: t('cyclingCity.facilities.safety.title'),
      description: t('cyclingCity.facilities.safety.description'),
      icon: Shield,
      category: t('cyclingCity.facilities.safety.category'),
      details: [
        t('cyclingCity.facilities.safety.details.lighting'),
        t('cyclingCity.facilities.safety.details.emergency'),
        t('cyclingCity.facilities.safety.details.patrols'),
        t('cyclingCity.facilities.safety.details.security')
      ]
    },
    {
      title: t('cyclingCity.facilities.navigation.title'),
      description: t('cyclingCity.facilities.navigation.description'),
      icon: MapIcon,
      category: t('cyclingCity.facilities.navigation.category'),
      details: [
        t('cyclingCity.facilities.navigation.details.maps'),
        t('cyclingCity.facilities.navigation.details.apps'),
        t('cyclingCity.facilities.navigation.details.kiosks'),
        t('cyclingCity.facilities.navigation.details.guides')
      ]
    }
  ];

  // Define local tips with translations
  const localTips = [
    {
      title: t('cyclingCity.planRide.morningCoffee.title'),
      description: t('cyclingCity.planRide.morningCoffee.description'),
      icon: Coffee,
      time: t('cyclingCity.planRide.morningCoffee.time')
    },
    {
      title: t('cyclingCity.planRide.marketDay.title'),
      description: t('cyclingCity.planRide.marketDay.description'),
      icon: ShoppingBag,
      time: t('cyclingCity.planRide.marketDay.time')
    },
    {
      title: t('cyclingCity.planRide.sunsetRide.title'),
      description: t('cyclingCity.planRide.sunsetRide.description'),
      icon: Sunset,
      time: t('cyclingCity.planRide.sunsetRide.time')
    },
    {
      title: t('cyclingCity.planRide.familyRoutes.title'),
      description: t('cyclingCity.planRide.familyRoutes.description'),
      icon: Users,
      time: t('cyclingCity.planRide.familyRoutes.time')
    }
  ];

  // Define practical information with translations
  const practicalInfo = [
    {
      title: t('cyclingCity.essential.bestTimes.title'),
      icon: Sun,
      content: [
        t('cyclingCity.essential.bestTimes.earlyMorning'),
        t('cyclingCity.essential.bestTimes.lateAfternoon'),
        t('cyclingCity.essential.bestTimes.evening')
      ]
    },
    {
      title: t('cyclingCity.essential.seasonal.title'),
      icon: Thermometer,
      content: [
        t('cyclingCity.essential.seasonal.spring'),
        t('cyclingCity.essential.seasonal.summer'),
        t('cyclingCity.essential.seasonal.autumn'),
        t('cyclingCity.essential.seasonal.winter')
      ]
    },
    {
      title: t('cyclingCity.essential.safety.title'),
      icon: Shield,
      content: [
        t('cyclingCity.essential.safety.helmet'),
        t('cyclingCity.essential.safety.lights'),
        t('cyclingCity.essential.safety.traffic'),
        t('cyclingCity.essential.safety.hydration')
      ]
    },
    {
      title: t('cyclingCity.essential.whatToBring.title'),
      icon: ShoppingBag,
      content: [
        t('cyclingCity.essential.whatToBring.clothing'),
        t('cyclingCity.essential.whatToBring.water'),
        t('cyclingCity.essential.whatToBring.phone'),
        t('cyclingCity.essential.whatToBring.backpack')
      ]
    }
  ];

  // Define map locations with translations
  const mapLocations: MapLocation[] = [
    {
      id: "central-square",
      name: t('cyclingCity.map.locations.centralSquare'),
      lat: 39.55510279080275,
      lng: 21.7667770805361,
      type: "district",
      description: "Main hub for cycling routes with bike sharing station and information kiosk"
    },
    {
      id: "lithaios-bridge",
      name: t('cyclingCity.map.locations.historicBridge'),
      lat: 39.55452389184736,
      lng: 21.76753482913978,
      type: "bridge",
      description: "19th-century stone bridge marking the start of the riverside cycling path"
    },
    {
      id: "castle-hill",
      name: t('cyclingCity.map.locations.castleOverlook'),
      lat: 39.55582947291847,
      lng: 21.76854739284729,
      type: "castle",
      description: "Panoramic viewpoint accessible via dedicated cycling path with bike parking"
    },
    {
      id: "mill-of-elves",
      name: t('cyclingCity.map.locations.millOfElves'),
      lat: 39.55354729184736,
      lng: 21.76502389184729,
      type: "district",
      description: "Trikala's most beloved park with dedicated family cycling circuits and playgrounds"
    },
    {
      id: "bike-rental-central",
      name: t('cyclingCity.map.locations.bikeStation'),
      lat: 39.55492389184736,
      lng: 21.76723482913978,
      type: "district",
      description: "Main bike rental hub with traditional and e-bikes, repair services"
    },
    {
      id: "riverside-cafes",
      name: t('cyclingCity.map.locations.cafeDistrict'),
      lat: 39.55412389184736,
      lng: 21.76823482913978,
      type: "district",
      description: "Cluster of cyclist-friendly cafés with bike parking and river views"
    },
    {
      id: "municipal-park",
      name: t('cyclingCity.map.locations.municipalPark'),
      lat: 39.55612389184736,
      lng: 21.76423482913978,
      type: "district",
      description: "Large green space with internal cycling paths and family amenities"
    },
    {
      id: "smart-bike-station",
      name: t('cyclingCity.map.locations.smartHub'),
      lat: 39.55562389184736,
      lng: 21.76773482913978,
      type: "district",
      description: "High-tech bike sharing station with GPS-enabled bikes and mobile app integration"
    },
    {
      id: "clock-tower",
      name: t('cyclingCity.map.locations.clockTower'),
      lat: 39.55542389184736,
      lng: 21.76743482913978,
      type: "tower",
      description: "Historic landmark and popular cycling route waypoint"
    },
    {
      id: "botanical-garden",
      name: t('cyclingCity.map.locations.botanicalGarden'),
      lat: 39.55682389184736,
      lng: 21.76573482913978,
      type: "district",
      description: "Peaceful cycling paths through curated gardens and native plant collections"
    }
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <style>{`
        .hover-scale {
          transition: transform 0.3s ease;
        }
        .hover-scale:hover {
          transform: scale(1.05);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      <SEO
        title="Cycling City Trikala | Greece's Premier Bike-Friendly Destination"
        description="Discover Trikala's revolutionary cycling infrastructure—15km of dedicated bike lanes, smart bike sharing, riverside paths, and car-free zones. Greece's cycling capital awaits."
        canonical="/about-trikala/cycling-city"
        keywords={[
          'Trikala cycling',
          'Greece bike lanes',
          'cycling capital Greece',
          'bike-friendly city',
          'smart bike sharing',
          'riverside cycling',
          'Lithaios river cycling',
          'bike tours Greece',
          'cycling infrastructure',
          'eco-friendly transport'
        ]}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "TouristTrip",
          "name": "Cycling City Trikala - Greece's Bike Capital",
          "description": "Explore Trikala's world-class cycling infrastructure with dedicated bike lanes, smart sharing systems, and scenic riverside routes through Greece's most bike-friendly city.",
          "touristType": "Active",
          "areaServed": "Trikala, Greece",
          "duration": "PT2H",
          "provider": {
            "@type": "Organization",
            "name": "Habitat Lobby",
            "url": "https://habitat-lobby.lovable.app"
          },
          "offers": {
            "@type": "Offer",
            "description": "Comprehensive cycling experience in Greece's most bike-friendly city"
          }
        }}
      />

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <img src={cyclingHero} alt="Cyclists enjoying the dedicated Lithaios riverside path in Trikala, Greece's cycling capital" className="absolute inset-0 w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/85 via-green-800/70 to-blue-900/80" />

        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/20 rounded-full blur-xl animate-float hidden lg:block" />
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-accent/30 rounded-full blur-xl animate-float hidden lg:block" style={{animationDelay: '1s'}} />

        <div className="container text-center relative z-10 max-w-5xl">
          <div className="space-y-8 animate-slide-up">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Badge variant="outline" className="border-white text-white bg-white/20 backdrop-blur-sm px-6 py-3 text-lg shadow-lg">
                <Bike className="h-5 w-5 mr-2" />
                {t('cyclingCity.hero.badge')}
              </Badge>
              <Badge variant="outline" className="border-white text-white bg-accent/30 backdrop-blur-sm px-6 py-3 text-lg shadow-lg">
                <Route className="h-5 w-5 mr-2" />
                {t('cyclingCity.stats.bikeLanes')}
              </Badge>
            </div>

            <div>
              <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl text-white mb-8 leading-tight font-bold drop-shadow-lg">
                <span className="block">{t('cyclingCity.hero.title')}</span>
              </h1>
              <p className="text-2xl md:text-4xl font-light leading-relaxed text-white/95 mb-6">
                {t('cyclingCity.hero.subtitle')}
              </p>
              <p className="text-lg md:text-xl text-white leading-relaxed font-light max-w-3xl mx-auto drop-shadow-lg">
                {t('cyclingCity.hero.description')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white font-medium px-10 py-4 text-lg hover-scale">
                <Link to="/apartments">{t('cyclingCity.hero.planVisit')}</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white bg-white/20 text-white hover:bg-white hover:text-primary font-medium px-10 py-4 text-lg backdrop-blur-sm hover-scale shadow-lg">
                <Link to="/contact">{t('cyclingCity.hero.exploreRoutes')}</Link>
              </Button>
            </div>

            <div className="pt-8">
              <div className="flex flex-wrap justify-center gap-6 text-sm text-white">
                <div className="flex items-center gap-2">
                  <Bike className="h-4 w-4" />
                  <span className="drop-shadow-md">{t('cyclingCity.stats.smartSharing')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Route className="h-4 w-4" />
                  <span className="drop-shadow-md">{t('cyclingCity.stats.dedicatedLanes')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Landmark className="h-4 w-4" />
                  <span className="drop-shadow-md">{t('cyclingCity.stats.historicBridges')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coffee className="h-4 w-4" />
                  <span className="drop-shadow-md">{t('cyclingCity.stats.cyclistCafes')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="container py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">{t('cyclingCity.intro.title')}</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8 max-w-4xl mx-auto">
              {t('cyclingCity.intro.description')}
            </p>
            <div className="grid md:grid-cols-4 gap-8 mt-16">
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Route className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-serif text-2xl mb-3 text-primary">15+ km</h3>
                <p className="text-gray-700 font-medium">{t('cyclingCity.stats.protectedLanes')}</p>
                <p className="text-sm text-gray-600 mt-2">{t('cyclingCity.stats.separatedTraffic')}</p>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Navigation className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-serif text-2xl mb-3 text-primary">{t('cyclingCity.stats.smartSystem')}</h3>
                <p className="text-gray-700 font-medium">{t('cyclingCity.stats.gpsSharing')}</p>
                <p className="text-sm text-gray-600 mt-2">{t('cyclingCity.stats.stationsCitywide')}</p>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-accent to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-serif text-2xl mb-3 text-primary">{t('cyclingCity.stats.carFree')}</h3>
                <p className="text-gray-700 font-medium">{t('cyclingCity.stats.historicCenter')}</p>
                <p className="text-sm text-gray-600 mt-2">{t('cyclingCity.stats.priorityZones')}</p>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-serif text-2xl mb-3 text-primary">{t('cyclingCity.stats.localCulture')}</h3>
                <p className="text-gray-700 font-medium">{t('cyclingCity.stats.bikeFirst')}</p>
                <p className="text-sm text-gray-600 mt-2">{t('cyclingCity.stats.communityEmbraced')}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="font-serif text-3xl md:text-4xl mb-6 text-primary">{t('cyclingCity.difference.title')}</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2 text-gray-800">{t('cyclingCity.difference.smartInfra.title')}</h4>
                      <p className="text-gray-600">{t('cyclingCity.difference.smartInfra.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2 text-gray-800">{t('cyclingCity.difference.historicBeauty.title')}</h4>
                      <p className="text-gray-600">{t('cyclingCity.difference.historicBeauty.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2 text-gray-800">{t('cyclingCity.difference.perfectTerrain.title')}</h4>
                      <p className="text-gray-600">{t('cyclingCity.difference.perfectTerrain.description')}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img src={lithaiosRiver} alt="Cyclists on the Lithaios riverside path" className="rounded-2xl shadow-2xl" loading="lazy" />
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl border">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">4.8★</div>
                    <div className="text-sm text-gray-700">{t('cyclingCity.difference.cyclistRating')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">{t('cyclingCity.highlights.title')}</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              {t('cyclingCity.highlights.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-accent/20 to-accent/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <highlight.icon className="h-7 w-7 text-accent" />
                    </div>
                    <Badge variant="outline" className="text-xs font-medium">{highlight.category}</Badge>
                  </div>
                  <CardTitle className="text-xl font-serif group-hover:text-accent transition-colors">
                    {highlight.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    {highlight.duration}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 leading-relaxed">
                    {highlight.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cycling Routes */}
      <section className="container py-16 md:py-20">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">{t('cyclingCity.routes.title')}</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            {t('cyclingCity.routes.description')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {cyclingRoutes.map((route, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-accent/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Bike className="h-8 w-8 text-accent" />
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-sm font-medium">{route.distance}</Badge>
                    <Badge variant={route.difficulty === 'Easy' ? 'default' : 'secondary'} className="text-sm">
                      {route.difficulty}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-2xl md:text-3xl font-serif group-hover:text-accent transition-colors mb-4">
                  {route.name}
                </CardTitle>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{route.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapIcon className="h-4 w-4" />
                    <span>{route.elevation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{route.startPoint}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>{route.traffic}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 leading-relaxed mb-6">
                  {route.description}
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-primary mb-3">{t('cyclingCity.common.routeHighlights')}</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {route.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm">
                          <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0"></div>
                          <span className="text-gray-600">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-primary">{t('cyclingCity.common.surface')}:</span>
                      <span className="text-gray-600 ml-2">{route.surface}</span>
                    </div>
                    <div>
                      <span className="font-medium text-primary">{t('cyclingCity.common.endPoint')}:</span>
                      <span className="text-gray-600 ml-2">{route.endPoint}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Route Planning Tips */}
        <div className="bg-gradient-to-r from-accent/5 to-blue-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="font-serif text-3xl md:text-4xl mb-4 text-primary">{t('cyclingCity.planRide.title')}</h3>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              {t('cyclingCity.planRide.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {localTips.map((tip, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                    <tip.icon className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="text-lg font-serif">{tip.title}</CardTitle>
                  <Badge variant="outline" className="w-fit text-xs">{tip.time}</Badge>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {tip.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cycling Facilities */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">{t('cyclingCity.facilities.title')}</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              {t('cyclingCity.facilities.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {cyclingFacilities.map((facility, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-accent/20 transition-colors">
                    <facility.icon className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-xl font-serif">{facility.title}</CardTitle>
                  <Badge variant="outline" className="w-fit mx-auto">{facility.category}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    {facility.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Practical Information */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl">
            <div className="text-center mb-12">
              <h3 className="font-serif text-4xl md:text-5xl mb-6 text-primary">{t('cyclingCity.essential.title')}</h3>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                {t('cyclingCity.essential.description')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {practicalInfo.map((info, index) => (
                <div key={index} className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                      <info.icon className="h-6 w-6 text-accent" />
                    </div>
                    <h4 className="font-serif text-2xl text-primary">{info.title}</h4>
                  </div>
                  <div className="space-y-4">
                    {info.content.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0 mt-2"></div>
                        <p className="text-gray-600 leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">{t('cyclingCity.map.title')}</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              {t('cyclingCity.map.description')}
            </p>
          </div>

          <Card className="border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="h-[500px]">
                <Map
                  locations={mapLocations}
                  center={[39.5551, 21.7669]}
                  zoom={14}
                  height="500px"
                />
              </div>
              <div className="p-6 bg-white border-t">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {mapLocations.map((location) => (
                    <div key={location.id} className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-gray-700">{location.name}</span>
                    </div>
                  ))}
                </div>
                <p className="text-center text-gray-600">
                  {t('cyclingCity.map.locations.summary')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 via-accent to-green-600 text-white py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 w-24 h-24 bg-white/20 rounded-full blur-xl animate-float hidden lg:block" />
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float hidden lg:block" style={{animationDelay: '1s'}} />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/15 rounded-full blur-xl animate-float hidden lg:block" style={{animationDelay: '2s'}} />

        <div className="container text-center relative z-10 max-w-5xl">
          <div className="space-y-10">
            <div>
              <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-8 leading-tight font-bold">
                <span className="block">{t('cyclingCity.cta.title')}</span>
              </h2>
              <p className="text-2xl md:text-3xl mb-6 opacity-95 font-light leading-relaxed">
                {t('cyclingCity.cta.subtitle')}
              </p>
              <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
                {t('cyclingCity.cta.description')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
              <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100 font-medium px-12 py-5 text-xl hover-scale shadow-lg">
                <Link to="/apartments">{t('cyclingCity.cta.bookBase')}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white bg-white/20 text-white hover:bg-white hover:text-primary font-medium px-12 py-5 text-xl backdrop-blur-sm hover-scale shadow-lg">
                <Link to="/contact">{t('cyclingCity.cta.getMaps')}</Link>
              </Button>
            </div>

            <div className="pt-10">
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 max-w-4xl mx-auto border border-white/30 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <Bike className="h-6 w-6 text-white" />
                  <h3 className="text-xl font-semibold text-white drop-shadow-lg">{t('cyclingCity.cta.benefits.title')}</h3>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-white">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-200" />
                    <span className="drop-shadow-sm">{t('cyclingCity.cta.benefits.bestRate')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-200" />
                    <span className="drop-shadow-sm">{t('cyclingCity.cta.benefits.freeMaps')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-200" />
                    <span className="drop-shadow-sm">{t('cyclingCity.cta.benefits.discounts')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-200" />
                    <span className="drop-shadow-sm">{t('cyclingCity.cta.benefits.guides')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-200" />
                    <span className="drop-shadow-sm">{t('cyclingCity.cta.benefits.storage')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-200" />
                    <span className="drop-shadow-sm">{t('cyclingCity.cta.benefits.repair')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-200" />
                    <span className="drop-shadow-sm">{t('cyclingCity.cta.benefits.weather')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-200" />
                    <span className="drop-shadow-sm">{t('cyclingCity.cta.benefits.cafes')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <p className="text-sm text-white/90 italic drop-shadow-md">
                "{t('cyclingCity.cta.testimonial')}"
              </p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
};

export default CyclingCity;
