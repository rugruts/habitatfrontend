import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, Camera, Users, ArrowRight, Calendar, Info, Star, Shield, Building, Home, Music, ShoppingBag, Landmark, Coffee, Trees, HelpCircle } from "lucide-react";
import expCastle from "@/assets/exp-castle.jpg";
import Map, { MapLocation } from "@/components/Map";
import { useTranslation } from "@/hooks/useTranslation";





const HistoryCulture: React.FC = () => {
  const { t } = useTranslation();

  // Define highlights with translations
  const highlights = [
    {
      title: t('historyCulture.highlights.castle.title'),
      description: t('historyCulture.highlights.castle.description'),
      icon: Shield,
      category: t('historyCulture.highlights.castle.category'),
      duration: t('historyCulture.highlights.castle.duration')
    },
    {
      title: t('historyCulture.highlights.clockTower.title'),
      description: t('historyCulture.highlights.clockTower.description'),
      icon: Clock,
      category: t('historyCulture.highlights.clockTower.category'),
      duration: t('historyCulture.highlights.clockTower.duration')
    },
    {
      title: t('historyCulture.highlights.oldTown.title'),
      description: t('historyCulture.highlights.oldTown.description'),
      icon: Home,
      category: t('historyCulture.highlights.oldTown.category'),
      duration: t('historyCulture.highlights.oldTown.duration')
    },
    {
      title: t('historyCulture.highlights.bridge.title'),
      description: t('historyCulture.highlights.bridge.description'),
      icon: Landmark,
      category: t('historyCulture.highlights.bridge.category'),
      duration: t('historyCulture.highlights.bridge.duration')
    },
    {
      title: t('historyCulture.highlights.museum.title'),
      description: t('historyCulture.highlights.museum.description'),
      icon: Music,
      category: t('historyCulture.highlights.museum.category'),
      duration: t('historyCulture.highlights.museum.duration')
    },
    {
      title: t('historyCulture.highlights.market.title'),
      description: t('historyCulture.highlights.market.description'),
      icon: ShoppingBag,
      category: t('historyCulture.highlights.market.category'),
      duration: t('historyCulture.highlights.market.duration')
    }
  ];

  // Define itinerary with translations
  const itinerary = [
    { time: "10:00", activity: t('historyCulture.itinerary.morning1') },
    { time: "11:00", activity: t('historyCulture.itinerary.morning2') },
    { time: "12:30", activity: t('historyCulture.itinerary.midday') },
    { time: "14:00", activity: t('historyCulture.itinerary.lunch') },
    { time: "16:00", activity: t('historyCulture.itinerary.afternoon') }
  ];

  // Define map locations with translations
  const mapLocations: MapLocation[] = [
    {
      id: "byzantine-castle",
      name: t('historyCulture.map.locations.byzantineCastle'),
      description: t('historyCulture.map.locations.byzantineCastleDesc'),
      lat: 39.559102790802754,
      lng: 21.762777080536097,
      type: "castle",
      openingHours: "Daily 8:00-20:00 (Summer), 8:00-17:00 (Winter)",
      entryFee: "Free"
    },
    {
      id: "clock-tower",
      name: t('historyCulture.map.locations.clockTower'),
      description: t('historyCulture.map.locations.clockTowerDesc'),
      lat: 39.55824947509666,
      lng: 21.76297011307814,
      type: "tower",
      openingHours: "External viewing only",
      entryFee: "Free"
    },
    {
      id: "varousi-district",
      name: t('historyCulture.map.locations.varousDistrict'),
      description: t('historyCulture.map.locations.varousDistrictDesc'),
      lat: 39.55919412926667,
      lng: 21.76505951937856,
      type: "district",
      openingHours: "Always accessible",
      entryFee: "Free"
    },
    {
      id: "lithaios-bridge",
      name: t('historyCulture.map.locations.lithaioBridge'),
      description: t('historyCulture.map.locations.lithaioBridgeDesc'),
      lat: 39.55724947509666,
      lng: 21.76397011307814,
      type: "bridge",
      openingHours: "Always accessible",
      entryFee: "Free"
    },
    {
      id: "tsitsanis-museum",
      name: t('historyCulture.map.locations.tsitsanisMuseum'),
      description: t('historyCulture.map.locations.tsitsanisMuseumDesc'),
      lat: 39.55624947509666,
      lng: 21.76197011307814,
      type: "museum",
      openingHours: "Tue-Sun 9:00-15:00",
      entryFee: "€3"
    },
    {
      id: "mill-of-elves",
      name: t('historyCulture.map.locations.millOfElves'),
      description: t('historyCulture.map.locations.millOfElvesDesc'),
      lat: 39.55424947509666,
      lng: 21.75997011307814,
      type: "district",
      openingHours: "Always accessible (Christmas park Dec-Jan)",
      entryFee: "Free (Christmas park entry fee applies)"
    }
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>{t('historyCulture.title')}</title>
        <meta name="description" content={t('historyCulture.description')} />
        <link rel="canonical" href="https://habitat-lobby.lovable.app/about-trikala/history-culture" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TouristTrip",
            "name": "History & Culture of Trikala",
            "description": "Self-guided walk through Trikala's castle, clock tower, old town and riverside bridges.",
            "touristType": "Cultural",
            "areaServed": "Trikala, Greece",
            "provider": {
              "@type": "LodgingBusiness",
              "name": "Habitat Lobby"
            },
            "offers": {
              "@type": "Offer",
              "availability": "https://schema.org/InStock",
              "url": "https://habitat-lobby.lovable.app/about-trikala/history-culture"
            }
          })}
        </script>
      </Helmet>

      {/* Enhanced Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${expCastle})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70"></div>
        </div>
        <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-6">
          <div className="space-y-6">
            <Badge variant="outline" className="border-white/30 text-white bg-white/10 backdrop-blur-sm">
              {t('historyCulture.hero.badge')}
            </Badge>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-6 leading-tight">
              {t('historyCulture.hero.title')}
            </h1>
            <div className="space-y-4 max-w-3xl mx-auto">
              <p className="text-2xl md:text-3xl font-light leading-relaxed">
                {t('historyCulture.hero.subtitle')}
              </p>
              <p className="text-lg md:text-xl opacity-90 leading-relaxed font-light">
                {t('historyCulture.hero.description')}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white font-medium px-8 py-3">
              <Link to="/apartments">{t('historyCulture.hero.planVisit')}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/50 text-white hover:bg-white hover:text-black font-medium px-8 py-3 backdrop-blur-sm">
              <a href="#map">{t('historyCulture.hero.exploreHistory')}</a>
            </Button>
          </div>
        </div>
      </section>

      <div className="container py-16 space-y-24">
        {/* Deep Historical Timeline */}
        <section className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">{t('historyCulture.timeline.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('historyCulture.timeline.description')}
            </p>
          </div>

          {/* Ancient Period */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <Badge className="bg-amber-100 text-amber-800 mb-4">{t('historyCulture.eras.ancient')}</Badge>
              <h3 className="font-serif text-3xl md:text-4xl mb-4">{t('historyCulture.timeline.ancient.title')}</h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('historyCulture.timeline.ancient.description')}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Card className="border-l-4 border-l-amber-500">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-xl mb-3">{t('historyCulture.ancient.healing.title')}</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {t('historyCulture.ancient.healing.description')}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-xl mb-3">{t('historyCulture.ancient.strategic.title')}</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {t('historyCulture.ancient.strategic.description')}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-xl mb-3">{t('historyCulture.ancient.archaeological.title')}</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {t('historyCulture.ancient.archaeological.description')}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="bg-amber-50 border-amber-200">
                  <CardHeader>
                    <CardTitle className="text-2xl font-serif text-amber-800">{t('historyCulture.stories.asclepius.title')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-amber-700 leading-relaxed mb-4">
                      {t('historyCulture.stories.asclepius.description1')}
                    </p>
                    <p className="text-amber-700 leading-relaxed">
                      {t('historyCulture.stories.asclepius.description2')}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-lg mb-3 text-amber-800">{t('historyCulture.ancient.didYouKnow.title')}</h4>
                    <ul className="space-y-2 text-amber-700">
                      <li>• {t('historyCulture.ancient.didYouKnow.fact1')}</li>
                      <li>• {t('historyCulture.ancient.didYouKnow.fact2')}</li>
                      <li>• {t('historyCulture.ancient.didYouKnow.fact3')}</li>
                      <li>• {t('historyCulture.ancient.didYouKnow.fact4')}</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Byzantine Period */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <Badge className="bg-purple-100 text-purple-800 mb-4">{t('historyCulture.eras.medieval')}</Badge>
              <h3 className="font-serif text-3xl md:text-4xl mb-4">{t('historyCulture.timeline.byzantine.title')}</h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('historyCulture.timeline.byzantine.description')}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Card className="bg-purple-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="text-2xl font-serif text-purple-800">{t('historyCulture.stories.fortress.title')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-700 leading-relaxed mb-4">
                      {t('historyCulture.stories.fortress.description1')}
                    </p>
                    <p className="text-purple-700 leading-relaxed">
                      {t('historyCulture.stories.fortress.description2')}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-xl mb-3">{t('historyCulture.byzantine.religious.title')}</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {t('historyCulture.byzantine.religious.description')}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-xl mb-3">{t('historyCulture.byzantine.trade.title')}</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {t('historyCulture.byzantine.trade.description')}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-xl mb-3">{t('historyCulture.byzantine.legacy.title')}</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {t('historyCulture.byzantine.legacy.description')}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Ottoman Period */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <Badge className="bg-emerald-100 text-emerald-800 mb-4">{t('historyCulture.eras.ottoman')}</Badge>
              <h3 className="font-serif text-3xl md:text-4xl mb-4">{t('historyCulture.timeline.ottoman.title')}</h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('historyCulture.timeline.ottoman.description')}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Card className="border-l-4 border-l-emerald-500">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-xl mb-3">{t('historyCulture.ottoman.administrative.title')}</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {t('historyCulture.ottoman.administrative.description')}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-emerald-500">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-xl mb-3">{t('historyCulture.ottoman.architectural.title')}</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {t('historyCulture.ottoman.architectural.description')}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-emerald-500">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-xl mb-3">{t('historyCulture.ottoman.synthesis.title')}</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {t('historyCulture.ottoman.synthesis.description')}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="bg-emerald-50 border-emerald-200">
                  <CardHeader>
                    <CardTitle className="text-2xl font-serif text-emerald-800">{t('historyCulture.stories.clockTower.title')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-emerald-700 leading-relaxed mb-4">
                      {t('historyCulture.stories.clockTower.description1')}
                    </p>
                    <p className="text-emerald-700 leading-relaxed">
                      {t('historyCulture.stories.clockTower.description2')}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-lg mb-3 text-emerald-800">{t('historyCulture.ottoman.heritage.title')}</h4>
                    <ul className="space-y-2 text-emerald-700">
                      <li>• {t('historyCulture.ottoman.heritage.neighborhood1')}</li>
                      <li>• {t('historyCulture.ottoman.heritage.neighborhood2')}</li>
                      <li>• {t('historyCulture.ottoman.heritage.neighborhood3')}</li>
                      <li>• {t('historyCulture.ottoman.heritage.neighborhood4')}</li>
                      <li>• {t('historyCulture.ottoman.heritage.neighborhood5')}</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Modern Period */}
          <div className="mb-12">
            <div className="text-center mb-12">
              <Badge className="bg-blue-100 text-blue-800 mb-4">{t('historyCulture.eras.modern')}</Badge>
              <h3 className="font-serif text-3xl md:text-4xl mb-4">{t('historyCulture.timeline.modern.title')}</h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('historyCulture.timeline.modern.description')}
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-xl mb-3">{t('historyCulture.modern.liberation.title')}</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('historyCulture.modern.liberation.description')}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-xl mb-3">{t('historyCulture.modern.reconstruction.title')}</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('historyCulture.modern.reconstruction.description')}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-xl mb-3">{t('historyCulture.modern.smartCity.title')}</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('historyCulture.modern.smartCity.description')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Archaeological Discoveries */}
        <section className="max-w-7xl mx-auto mb-24">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">{t('historyCulture.archaeologicalTreasures.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('historyCulture.archaeologicalTreasures.description')}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div className="space-y-8">
              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif text-amber-800">{t('historyCulture.discoveries.asclepieion.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-amber-700 leading-relaxed mb-4">
                    {t('historyCulture.discoveries.asclepieion.description')}
                  </p>
                  <div className="bg-white/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-amber-800">{t('historyCulture.discoveries.asclepieion.keyTitle')}</h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• {t('historyCulture.discoveries.asclepieion.discovery1')}</li>
                      <li>• {t('historyCulture.discoveries.asclepieion.discovery2')}</li>
                      <li>• {t('historyCulture.discoveries.asclepieion.discovery3')}</li>
                      <li>• {t('historyCulture.discoveries.asclepieion.discovery4')}</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif text-purple-800">{t('historyCulture.discoveries.byzantine.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-700 leading-relaxed mb-4">
                    {t('historyCulture.discoveries.byzantine.description')}
                  </p>
                  <div className="bg-white/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-purple-800">{t('historyCulture.discoveries.byzantine.notableTitle')}</h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• {t('historyCulture.discoveries.byzantine.find1')}</li>
                      <li>• {t('historyCulture.discoveries.byzantine.find2')}</li>
                      <li>• {t('historyCulture.discoveries.byzantine.find3')}</li>
                      <li>• {t('historyCulture.discoveries.byzantine.find4')}</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif text-emerald-800">{t('historyCulture.discoveries.ottoman.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-emerald-700 leading-relaxed mb-4">
                    {t('historyCulture.discoveries.ottoman.description')}
                  </p>
                  <div className="bg-white/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-emerald-800">{t('historyCulture.discoveries.ottoman.featuresTitle')}</h4>
                    <ul className="text-sm text-emerald-700 space-y-1">
                      <li>• {t('historyCulture.discoveries.ottoman.feature1')}</li>
                      <li>• {t('historyCulture.discoveries.ottoman.feature2')}</li>
                      <li>• {t('historyCulture.discoveries.ottoman.feature3')}</li>
                      <li>• {t('historyCulture.discoveries.ottoman.feature4')}</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif text-blue-800">{t('historyCulture.discoveries.modern.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-700 leading-relaxed mb-4">
                    {t('historyCulture.discoveries.modern.description')}
                  </p>
                  <div className="bg-white/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-blue-800">{t('historyCulture.discoveries.modern.methodsTitle')}</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• {t('historyCulture.discoveries.modern.method1')}</li>
                      <li>• {t('historyCulture.discoveries.modern.method2')}</li>
                      <li>• {t('historyCulture.discoveries.modern.method3')}</li>
                      <li>• {t('historyCulture.discoveries.modern.method4')}</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="font-serif text-2xl mb-4 text-primary">{t('historyCulture.archaeology.title')}</h3>
              <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl mx-auto">
                {t('historyCulture.archaeology.description')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="outline" className="text-sm">{t('historyCulture.archaeology.asclepieion')}</Badge>
                <Badge variant="outline" className="text-sm">{t('historyCulture.archaeology.castle')}</Badge>
                <Badge variant="outline" className="text-sm">{t('historyCulture.archaeology.selfGuided')}</Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Must-see Highlights */}
        <section className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">{t('historyCulture.highlights.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('historyCulture.highlights.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => {
              const IconComponent = highlight.icon;
              return (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                          <IconComponent className="h-6 w-6 text-accent" />
                        </div>
                        <Badge variant="secondary" className="text-xs font-medium">
                          {highlight.category}
                        </Badge>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {highlight.duration}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-serif leading-tight group-hover:text-accent transition-colors">
                      {highlight.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {highlight.description}
                    </p>
                    <Button variant="outline" size="sm" asChild className="w-full group-hover:bg-accent group-hover:text-white transition-colors">
                      <a href="#map" className="flex items-center justify-center gap-2">
                        <MapPin className="h-4 w-4" />
                        View on Map
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Half-day Itinerary */}
        <section className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">{t('historyCulture.itinerary.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('historyCulture.itinerary.subtitle')}
            </p>
          </div>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50">
            <CardHeader className="text-center pb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Calendar className="h-6 w-6 text-accent" />
                <Badge variant="secondary" className="text-sm font-medium">{t('historyCulture.itinerary.badge')}</Badge>
              </div>
              <CardTitle className="text-2xl font-serif">{t('historyCulture.itinerary.cardTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-6">
                {itinerary.map((item, index) => (
                  <div key={index} className="relative">
                    {index < itinerary.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-8 bg-accent/20"></div>
                    )}
                    <div className="flex items-start gap-6 p-6 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-semibold">
                          {item.time}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-lg leading-relaxed text-gray-700">{item.activity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-8" />

              <div className="text-center space-y-4">
                <p className="text-muted-foreground">Ready to explore Trikala's cultural treasures?</p>
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 px-8">
                  <Link to="/apartments">Book Your Stay Near the Sights</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Cultural Traditions & Their Origins */}
        <section className="max-w-7xl mx-auto mb-24">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">{t('historyCulture.livingTraditions.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('historyCulture.livingTraditions.description')}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div className="space-y-8">
              <Card className="border-l-4 border-l-amber-500">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                      <Music className="h-5 w-5 text-amber-600" />
                    </div>
                    <Badge variant="outline" className="text-xs">{t('historyCulture.traditions.music.badge')}</Badge>
                  </div>
                  <CardTitle className="text-xl font-serif">{t('historyCulture.traditions.music.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {t('historyCulture.traditions.music.description')}
                  </p>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2 text-amber-800">{t('historyCulture.traditions.music.modernTitle')}</h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• {t('historyCulture.traditions.music.expression1')}</li>
                      <li>• {t('historyCulture.traditions.music.expression2')}</li>
                      <li>• {t('historyCulture.traditions.music.expression3')}</li>
                      <li>• Street musicians in historic squares</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <Badge variant="outline" className="text-xs">{t('historyCulture.traditions.festivals.badge')}</Badge>
                  </div>
                  <CardTitle className="text-xl font-serif">{t('historyCulture.traditions.festivals.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {t('historyCulture.traditions.festivals.detailedDescription')}
                  </p>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2 text-purple-800">{t('historyCulture.traditions.festivals.majorCelebrationsTitle')}</h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• {t('historyCulture.traditions.festivals.millOfElves')}</li>
                      <li>• {t('historyCulture.traditions.festivals.easterWeek')}</li>
                      <li>• {t('historyCulture.traditions.festivals.saintNicholas')}</li>
                      <li>• {t('historyCulture.traditions.festivals.summerFestivals')}</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="border-l-4 border-l-emerald-500">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Coffee className="h-5 w-5 text-emerald-600" />
                    </div>
                    <Badge variant="outline" className="text-xs">{t('historyCulture.traditions.coffee.badge')}</Badge>
                  </div>
                  <CardTitle className="text-xl font-serif">{t('historyCulture.traditions.coffee.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {t('historyCulture.traditions.coffee.detailedDescription')}
                  </p>
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2 text-emerald-800">{t('historyCulture.traditions.coffee.coffeeTraditonsTitle')}</h4>
                    <ul className="text-sm text-emerald-700 space-y-1">
                      <li>• {t('historyCulture.traditions.coffee.greekCoffee')}</li>
                      <li>• {t('historyCulture.traditions.coffee.newspaperReading')}</li>
                      <li>• {t('historyCulture.traditions.coffee.backgammon')}</li>
                      <li>• {t('historyCulture.traditions.coffee.politicalDiscussions')}</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <ShoppingBag className="h-5 w-5 text-blue-600" />
                    </div>
                    <Badge variant="outline" className="text-xs">{t('historyCulture.traditions.crafts.badge')}</Badge>
                  </div>
                  <CardTitle className="text-xl font-serif">{t('historyCulture.traditions.crafts.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {t('historyCulture.traditions.crafts.detailedDescription')}
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2 text-blue-800">{t('historyCulture.traditions.crafts.traditionalCraftsTitle')}</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• {t('historyCulture.traditions.crafts.ceramics')}</li>
                      <li>• {t('historyCulture.traditions.crafts.textiles')}</li>
                      <li>• {t('historyCulture.traditions.crafts.metalwork')}</li>
                      <li>• {t('historyCulture.traditions.crafts.woodwork')}</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="font-serif text-2xl mb-4 text-primary">{t('historyCulture.experience.title')}</h3>
                <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  {t('historyCulture.experience.description')}
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Coffee className="h-6 w-6 text-accent" />
                  </div>
                  <h4 className="font-semibold mb-2">{t('historyCulture.experienceActivities.morning.title')}</h4>
                  <p className="text-sm text-muted-foreground">{t('historyCulture.experienceActivities.morning.description')}</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Music className="h-6 w-6 text-accent" />
                  </div>
                  <h4 className="font-semibold mb-2">{t('historyCulture.experienceActivities.evening.title')}</h4>
                  <p className="text-sm text-muted-foreground">{t('historyCulture.experienceActivities.evening.description')}</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ShoppingBag className="h-6 w-6 text-accent" />
                  </div>
                  <h4 className="font-semibold mb-2">{t('historyCulture.experienceActivities.workshops.title')}</h4>
                  <p className="text-sm text-muted-foreground">{t('historyCulture.experienceActivities.workshops.description')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Culture Now */}
        <section className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">{t('historyCulture.contemporary.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('historyCulture.contemporary.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Music className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-2xl font-serif">{t('historyCulture.venues.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {t('historyCulture.venues.description')}
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Building className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-2xl font-serif">{t('historyCulture.smart.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {t('historyCulture.smart.description')}
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Users className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-2xl font-serif">{t('historyCulture.community.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {t('historyCulture.community.description')}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Practical Tips */}
        <section className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">{t('historyCulture.tips.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('historyCulture.tips.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-xl font-serif">{t('historyCulture.tips.timing.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {t('historyCulture.tips.timing.description')}
                </p>
                <Badge variant="outline" className="text-xs">
                  {t('historyCulture.tips.timing.badge')}
                </Badge>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-xl font-serif">{t('historyCulture.tips.clothing.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {t('historyCulture.tips.clothing.description')}
                </p>
                <Badge variant="outline" className="text-xs">
                  {t('historyCulture.tips.clothing.badge')}
                </Badge>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Camera className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-xl font-serif">{t('historyCulture.tips.photography.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {t('historyCulture.tips.photography.description')}
                </p>
                <Badge variant="outline" className="text-xs">
                  {t('historyCulture.tips.photography.badge')}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* More Questions Section */}
        <section className="max-w-4xl mx-auto">
          <Card className="border-2 border-primary/20 bg-primary/5 text-center">
            <CardContent className="p-8">
              <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">More Questions About Your Stay?</h3>
              <p className="text-muted-foreground mb-6">
                Visit our comprehensive FAQ page for answers to questions about booking, 
                check-in, amenities, and all your travel needs in Trikala.
              </p>
              <Button asChild size="lg">
                <Link to="/faq">
                  View All FAQs
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Map Section */}
        <section id="map" className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">{t('historyCulture.map.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('historyCulture.map.description')}
            </p>
          </div>

          <Card className="border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="h-[500px]">
                <Map
                  locations={mapLocations}
                  center={[39.55500912069906, 21.7678820839955]}
                  zoom={14}
                  height="500px"
                />
              </div>
              <div className="p-6 bg-white border-t">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {mapLocations.map((location) => (
                    <div key={location.id} className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-muted-foreground">{location.name}</span>
                    </div>
                  ))}
                </div>
                <p className="text-center text-muted-foreground">
                  {t('historyCulture.map.walkingNote')}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Related Pages Section */}
        <section className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl mb-4 text-primary">{t('historyCulture.relatedPages.title')}</h2>
            <p className="text-lg text-muted-foreground">
              {t('historyCulture.relatedPages.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Trees className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-serif group-hover:text-green-600 transition-colors">
                  {t('historyCulture.relatedPages.nature.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {t('historyCulture.relatedPages.nature.description')}
                </p>
                <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <Link to="/about-trikala/nature-day-trips" className="flex items-center justify-center gap-2">
                    {t('historyCulture.relatedPages.nature.button')}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Coffee className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-2xl font-serif group-hover:text-blue-600 transition-colors">
                  {t('historyCulture.relatedPages.localLife.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {t('historyCulture.relatedPages.localLife.description')}
                </p>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <Link to="/about-trikala/local-life" className="flex items-center justify-center gap-2">
                    {t('historyCulture.relatedPages.localLife.button')}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-2xl font-serif group-hover:text-purple-600 transition-colors">
                  {t('historyCulture.relatedPages.experiences.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {t('historyCulture.relatedPages.experiences.description')}
                </p>
                <Button asChild variant="outline" className="w-full group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Link to="/experiences" className="flex items-center justify-center gap-2">
                    {t('historyCulture.relatedPages.experiences.button')}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      {/* Enhanced CTA Section */}
      <section className="bg-gradient-to-r from-primary via-accent to-primary text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container text-center relative z-10 max-w-4xl">
          <div className="space-y-8">
            <div>
              <h2 className="font-serif text-4xl md:text-6xl mb-6 leading-tight">
                {t('historyCulture.cta.title')}
              </h2>
              <p className="text-xl md:text-2xl mb-4 opacity-95 font-light">
                {t('historyCulture.cta.subtitle')}
              </p>
              <p className="text-lg opacity-90 max-w-2xl mx-auto leading-relaxed">
                {t('historyCulture.cta.description')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
              <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100 font-medium px-8 py-4 text-lg">
                <Link to="/apartments">{t('historyCulture.cta.button1')}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/50 text-white hover:bg-white hover:text-primary font-medium px-8 py-4 text-lg backdrop-blur-sm">
                <Link to="/contact">{t('historyCulture.cta.button2')}</Link>
              </Button>
            </div>

            <div className="pt-8">
              <p className="text-sm opacity-75">
                Direct booking benefits: Best rates • Local insights • Personalized service • Cultural itineraries
              </p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
};

export default HistoryCulture;
