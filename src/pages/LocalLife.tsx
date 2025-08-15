import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, Camera, Users, ArrowRight, Calendar, Info, Star, Coffee, ShoppingBag, Music, Heart, Utensils, Wine, Shield, Trees } from "lucide-react";
import localLifeHero from "@/assets/local-life-hero.jpg";
import marketStalls from "@/assets/market-stalls.jpg";
import Footer from "@/components/Footer";
import Map, { MapLocation } from "@/components/Map";

const highlights = [
  {
    title: "Riverside Terraces",
    description: "Watch the world go by with an espresso or freddo cappuccino along the Lithaios River.",
    icon: Coffee,
    category: "Cafés & Coffee",
    time: "All day"
  },
  {
    title: "Hidden Courtyards",
    description: "Quiet spots tucked away from the main streets, perfect for reading or conversation.",
    icon: Heart,
    category: "Cafés & Coffee", 
    time: "Morning/Afternoon"
  },
  {
    title: "Modern Cafés",
    description: "Specialty coffee meets minimal, chic interiors in Trikala's contemporary café scene.",
    icon: Coffee,
    category: "Cafés & Coffee",
    time: "All day"
  },
  {
    title: "Open-Air Market",
    description: "Weekly market with seasonal produce, local cheeses, honey, and handmade preserves.",
    icon: ShoppingBag,
    category: "Markets & Flavors",
    time: "Tue & Sat mornings"
  },
  {
    title: "Central Square",
    description: "The city's heart, surrounded by shops, cafés, and bakeries where locals gather.",
    icon: Users,
    category: "Squares & Social",
    time: "All day"
  },
  {
    title: "Evening Tavernas",
    description: "Grilled meats, meze, and live music create the perfect end to any day.",
    icon: Utensils,
    category: "Evening Life",
    time: "Evening"
  }
];

const itinerary = [
  { time: "08:30", activity: "Breakfast at a riverside café, fresh orange juice, and koulouri." },
  { time: "10:00", activity: "Browse the open-air market and pick up picnic supplies." },
  { time: "14:00", activity: "Stroll through the central shopping streets and squares." },
  { time: "19:30", activity: "Taverna dinner followed by a slow walk under the city lights." }
];

const localSpots = [
  {
    name: "Riverside Café Cluster",
    description: "Collection of cafés along the Lithaios River with outdoor seating",
    atmosphere: "Relaxed, scenic",
    bestTime: "Morning & Evening"
  },
  {
    name: "Central Market Area", 
    description: "Traditional market streets with local vendors and specialty shops",
    atmosphere: "Bustling, authentic",
    bestTime: "Tuesday & Saturday mornings"
  },
  {
    name: "Tsitsanis Square",
    description: "Cultural square honoring the famous composer, with cafés and music venues",
    atmosphere: "Cultural, musical",
    bestTime: "Evening"
  },
  {
    name: "Neighborhood Piazzas",
    description: "Small squares where locals gather for evening chats and children play",
    atmosphere: "Community-focused, family-friendly",
    bestTime: "Late afternoon & Evening"
  }
];

const mapLocations: MapLocation[] = [
  {
    id: "central-square",
    name: "Central Square",
    description: "The heart of Trikala with shops, cafés, and bakeries",
    lat: 39.5555,
    lng: 21.7670,
    type: "district",
    openingHours: "Always accessible",
    entryFee: "Free"
  },
  {
    id: "riverside-cafes",
    name: "Riverside Café Cluster",
    description: "Collection of cafés along the Lithaios River with scenic views",
    lat: 39.5545,
    lng: 21.7685,
    type: "district",
    openingHours: "Daily 7:00-24:00",
    entryFee: "Free"
  },
  {
    id: "open-air-market",
    name: "Open-Air Market",
    description: "Weekly market with local produce, crafts, and traditional foods",
    lat: 39.5550,
    lng: 21.7675,
    type: "market",
    openingHours: "Tue & Sat 7:00-14:00",
    entryFee: "Free"
  },
  {
    id: "tsitsanis-square",
    name: "Tsitsanis Square",
    description: "Cultural square dedicated to the famous Greek composer",
    lat: 39.5560,
    lng: 21.7665,
    type: "district",
    openingHours: "Always accessible",
    entryFee: "Free"
  }
];

const LocalLife: React.FC = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Local Life in Trikala | Cafés, Markets & Everyday Rhythm</title>
        <meta name="description" content="Discover the cafés, markets, and friendly pace of everyday life in Trikala. Live like a local during your stay with Habitat Lobby." />
        <link rel="canonical" href="https://habitat-lobby.lovable.app/about-trikala/local-life" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TouristTrip",
            "name": "Local Life in Trikala",
            "description": "Experience the cafés, markets, and friendly pace of everyday life in Trikala, Greece.",
            "touristType": "Cultural",
            "areaServed": "Trikala, Greece",
            "provider": {
              "@type": "LodgingBusiness",
              "name": "Habitat Lobby"
            },
            "offers": {
              "@type": "Offer",
              "availability": "https://schema.org/InStock",
              "url": "https://habitat-lobby.lovable.app/about-trikala/local-life"
            }
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={localLifeHero}
            alt="Local life and cafés in Trikala city center"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80"></div>
        </div>
        <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-6">
          <div className="space-y-6">
            <Badge variant="outline" className="border-white/30 text-white bg-white/10 backdrop-blur-sm">
              Local Life Guide
            </Badge>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-6 leading-tight">
              Local Life
            </h1>
            <div className="space-y-4 max-w-3xl mx-auto">
              <p className="text-2xl md:text-3xl font-light leading-relaxed">
                The soul of the city is in its streets
              </p>
              <p className="text-lg md:text-xl opacity-90 leading-relaxed font-light">
                Sip coffee by the river, browse the market stalls, and wander through lively squares where locals gather.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white font-medium px-8 py-3">
              <Link to="/apartments">Stay in the Heart of Trikala</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/50 text-white hover:bg-white hover:text-black font-medium px-8 py-3 backdrop-blur-sm">
              <Link to="/apartments">See Apartments</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container py-16 space-y-24">
        {/* Cafés & Coffee Culture Section */}
        <section className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">Cafés & Coffee Culture</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              In Trikala, coffee isn't just a drink — it's a ritual that brings people together throughout the day.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {highlights.filter(h => h.category === "Cafés & Coffee").map((highlight, index) => {
              const IconComponent = highlight.icon;
              return (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                        <IconComponent className="h-6 w-6 text-amber-600" />
                      </div>
                      <Badge variant="outline" className="text-xs">{highlight.time}</Badge>
                    </div>
                    <CardTitle className="text-xl font-serif group-hover:text-amber-600 transition-colors">
                      {highlight.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {highlight.description}
                    </p>
                    <Button variant="outline" size="sm" asChild className="w-full group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      <a href="#map" className="flex items-center justify-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Find on Map
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-12 bg-amber-50 p-6 rounded-xl border border-amber-200">
            <div className="flex items-center gap-3 mb-3">
              <Info className="h-5 w-5 text-amber-600" />
              <h4 className="font-semibold text-amber-800">Insider Tip</h4>
            </div>
            <p className="text-amber-700">Mornings are for coffee and catching up with friends; evenings are for people-watching with a glass of tsipouro.</p>
          </div>
        </section>

        {/* Markets & Local Flavors Section */}
        <section className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">Markets & Local Flavors</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The weekly open-air market is a feast for the senses, showcasing the best of Thessalian agriculture.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <ShoppingBag className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Seasonal produce straight from Thessalian farms</h3>
                    <p className="text-muted-foreground">Fresh fruits and vegetables that change with the seasons, picked at peak ripeness.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Wine className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Local cheeses, honey, and olive oil</h3>
                    <p className="text-muted-foreground">Artisanal products from local producers, including famous Thessalian cheeses and golden honey.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Heart className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Handmade preserves, herbs, and spices</h3>
                    <p className="text-muted-foreground">Traditional recipes passed down through generations, creating unique flavors you won't find elsewhere.</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <Star className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold text-green-800">Don't Miss</h4>
                </div>
                <p className="text-green-700">The spice stalls near the central market for unique blends and aromas that capture the essence of Greek cuisine.</p>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={marketStalls}
                  alt="Traditional market stalls in Trikala with fresh local produce"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Squares & Social Life Section */}
        <section className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">Squares & Social Life</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Life in Trikala flows through its squares, where community and culture come together naturally.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {localSpots.map((spot, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <Badge variant="outline" className="text-xs">{spot.bestTime}</Badge>
                  </div>
                  <CardTitle className="text-2xl font-serif group-hover:text-blue-600 transition-colors">
                    {spot.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {spot.description}
                  </p>
                  <div className="flex items-center gap-2 mb-6">
                    <Badge variant="secondary" className="text-xs">
                      {spot.atmosphere}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" asChild className="w-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <a href="#map" className="flex items-center justify-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Locate
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Evening in Trikala Section */}
        <section className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">Evening in Trikala</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              When the sun sets, the city glows with warm lights and the gentle buzz of evening social life.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {highlights.filter(h => h.category === "Evening Life").map((highlight, index) => {
              const IconComponent = highlight.icon;
              return (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                        <IconComponent className="h-6 w-6 text-orange-600" />
                      </div>
                      <Badge variant="outline" className="text-xs">{highlight.time}</Badge>
                    </div>
                    <CardTitle className="text-xl font-serif group-hover:text-orange-600 transition-colors">
                      {highlight.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground leading-relaxed">
                      {highlight.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <Music className="h-6 w-6 text-purple-600" />
                  </div>
                  <Badge variant="outline" className="text-xs">Evening</Badge>
                </div>
                <CardTitle className="text-xl font-serif group-hover:text-purple-600 transition-colors">
                  Live Music Nights
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground leading-relaxed">
                  From traditional folk to contemporary jazz, Trikala's venues come alive with music.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                    <Camera className="h-6 w-6 text-indigo-600" />
                  </div>
                  <Badge variant="outline" className="text-xs">Night</Badge>
                </div>
                <CardTitle className="text-xl font-serif group-hover:text-indigo-600 transition-colors">
                  Illuminated Bridges
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground leading-relaxed">
                  Late-night walks along the beautifully lit bridges create magical moments.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Suggested Itinerary Section */}
        <section className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl font-serif">A Day Like a Local</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-6">
                {itinerary.map((item, index) => (
                  <div key={index} className="relative">
                    {index < itinerary.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-8 bg-blue-200"></div>
                    )}
                    <div className="flex items-start gap-6 p-6 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-blue-600 text-lg">{item.time}</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{item.activity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-blue-100 rounded-xl">
                <div className="text-center">
                  <h4 className="font-semibold text-blue-800 mb-2">Book Your Stay & Live Like a Local</h4>
                  <p className="text-blue-700 mb-4">Experience authentic Trikala life from your comfortable base</p>
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link to="/apartments">View Apartments</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Practical Tips Section */}
        <section className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">Practical Tips</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Essential information to help you navigate local life like a true Trikala resident.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Market Days</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Every Tuesday and Saturday morning for the best selection of fresh local produce.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Wine className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Cash</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Useful for small vendors, though most cafés and restaurants accept cards.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Language</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">English is widely understood, but a friendly "Kalimera" goes a long way.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Common questions about experiencing local life in Trikala.
            </p>
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Can I shop at the local market without speaking Greek?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Yes — vendors are used to visitors and happy to help with gestures and basic English.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Are cafés laptop-friendly?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Many have Wi-Fi, but the culture leans towards socializing rather than working. Perfect for people-watching!</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Map Section */}
        <section id="map" className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">Local Life Map</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Where locals gather, shop, and unwind — all within walking distance of Habitat Lobby.
            </p>
          </div>

          <Card className="border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="h-[500px]">
                <Map
                  locations={mapLocations}
                  center={[39.5555, 21.7670]}
                  zoom={15}
                  height="500px"
                />
              </div>
              <div className="p-6 bg-white border-t">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {mapLocations.map((location) => (
                    <div key={location.id} className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-muted-foreground">{location.name}</span>
                    </div>
                  ))}
                </div>
                <p className="text-center text-muted-foreground">
                  Where locals gather, shop, and unwind — all within walking distance of Habitat Lobby.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Related Pages Section */}
        <section className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl mb-4 text-primary">Explore More of Trikala</h2>
            <p className="text-lg text-muted-foreground">
              Discover all that Trikala has to offer with our comprehensive guides.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-amber-600" />
                </div>
                <CardTitle className="text-2xl font-serif group-hover:text-amber-600 transition-colors">
                  History & Culture
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Explore Byzantine walls, Ottoman heritage, and living traditions through Trikala's historic streets.
                </p>
                <Button asChild className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                  <Link to="/about-trikala/history-culture" className="flex items-center justify-center gap-2">
                    Discover History
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Trees className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-serif group-hover:text-green-600 transition-colors">
                  Nature & Day Trips
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Discover riverside walks, lush parks, and world-famous Meteora just an hour away from Trikala.
                </p>
                <Button asChild variant="outline" className="w-full group-hover:bg-green-600 group-hover:text-white transition-colors">
                  <Link to="/about-trikala/nature-day-trips" className="flex items-center justify-center gap-2">
                    Explore Nature
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      {/* Enhanced CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container text-center relative z-10 max-w-4xl">
          <div className="space-y-8">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight">
              Experience the warm rhythm of Trikala life
            </h2>
            <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto leading-relaxed">
              Return from your outings to a stylish, comfortable apartment in the city center.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-medium px-8 py-3">
                <Link to="/apartments">View Apartments</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/50 text-white hover:bg-white hover:text-blue-600 font-medium px-8 py-3 backdrop-blur-sm">
                <Link to="/contact">Plan Your Stay</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default LocalLife;
