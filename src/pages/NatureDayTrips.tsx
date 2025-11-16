import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, Camera, Users, ArrowRight, Calendar, Info, Star, Trees, Mountain, Waves, Car, Sun, Snowflake, Shield } from "lucide-react";
import lithaiosRiver from "@/assets/lithaios-river-real.jpg";
import meteoraReal from "@/assets/meteora-real.jpg";
import Map, { MapLocation } from "@/components/Map";

const highlights = [
  {
    title: "Lithaios River Paths",
    description: "Ideal for walking, cycling, or sitting with a coffee along leafy riverside trails.",
    icon: Waves,
    category: "Urban Nature",
    duration: "30-60 min"
  },
  {
    title: "Botanical Garden",
    description: "Seasonal blooms, shaded benches, and calm views in the heart of the city.",
    icon: Trees,
    category: "Urban Nature", 
    duration: "45 min"
  },
  {
    title: "Municipal Park",
    description: "Playgrounds, open lawns, and picnic spots perfect for families.",
    icon: Trees,
    category: "Urban Nature",
    duration: "1-2 hours"
  },
  {
    title: "Meteora UNESCO Site",
    description: "Rock towers with monasteries perched in the sky, world-renowned scenery.",
    icon: Mountain,
    category: "Day Trip",
    duration: "Full day"
  },
  {
    title: "Lake Plastiras",
    description: "Mountain reservoir perfect for boating, cycling, and lakeside tavernas.",
    icon: Waves,
    category: "Day Trip",
    duration: "Full day"
  },
  {
    title: "Pertouli Meadows",
    description: "Alpine scenery with horse riding in summer, ski center in winter.",
    icon: Mountain,
    category: "Day Trip",
    duration: "Half/Full day"
  }
];

const itinerary = [
  { time: "09:00", activity: "Riverside walk in Trikala, coffee by the bridge." },
  { time: "10:30", activity: "Drive to Meteora, visit two monasteries." },
  { time: "13:00", activity: "Traditional taverna lunch in Kastraki village." },
  { time: "15:00", activity: "Short hike or scenic drive around Meteora's back roads." },
  { time: "17:30", activity: "Return to Trikala for dinner and evening river walk." }
];

const dayTrips = [
  {
    name: "Lake Plastiras",
    distance: "1h30 drive",
    description: "Mountain reservoir with boating, cycling, and lakeside tavernas",
    activities: ["Boating", "Cycling", "Dining", "Photography"]
  },
  {
    name: "Pertouli Meadows", 
    distance: "40 min drive",
    description: "Alpine scenery, horse riding in summer, ski center in winter",
    activities: ["Horse Riding", "Skiing", "Hiking", "Mountain Views"]
  },
  {
    name: "Elati Village",
    distance: "35 min drive", 
    description: "Traditional mountain village with cozy cafés and panoramic views",
    activities: ["Village Tour", "Cafés", "Photography", "Shopping"]
  },
  {
    name: "Aspropotamos Valley",
    distance: "1h15 drive",
    description: "Rivers, stone bridges, and pure mountain air",
    activities: ["River Walks", "Stone Bridges", "Nature Photography", "Fresh Air"]
  }
];

const mapLocations: MapLocation[] = [
  {
    id: "lithaios-river",
    name: "Lithaios River Paths",
    description: "Scenic riverside walking and cycling paths through the city center",
    lat: 39.5540,
    lng: 21.7680,
    type: "district",
    openingHours: "Always accessible",
    entryFee: "Free"
  },
  {
    id: "botanical-garden",
    name: "Botanical Garden",
    description: "Beautiful garden with seasonal blooms and peaceful walking paths",
    lat: 39.5560,
    lng: 21.7690,
    type: "district",
    openingHours: "Daily 8:00-20:00",
    entryFee: "Free"
  },
  {
    id: "meteora",
    name: "Meteora UNESCO Site",
    description: "World-famous rock formations with ancient monasteries",
    lat: 39.7217,
    lng: 21.6306,
    type: "castle",
    openingHours: "Daily 9:00-17:00",
    entryFee: "€3 per monastery"
  },
  {
    id: "lake-plastiras",
    name: "Lake Plastiras",
    description: "Artificial mountain lake perfect for outdoor activities",
    lat: 39.2167,
    lng: 21.7500,
    type: "district",
    openingHours: "Always accessible",
    entryFee: "Free"
  },
  {
    id: "pertouli",
    name: "Pertouli Meadows",
    description: "Alpine meadows and ski resort in the Pindus mountains",
    lat: 39.5333,
    lng: 21.3167,
    type: "district",
    openingHours: "Always accessible",
    entryFee: "Activity dependent"
  },
  {
    id: "elati",
    name: "Elati Village",
    description: "Traditional mountain village with stunning panoramic views",
    lat: 39.4833,
    lng: 21.3500,
    type: "district",
    openingHours: "Always accessible",
    entryFee: "Free"
  }
];

const NatureDayTrips: React.FC = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Nature & Day Trips from Trikala | Habitat Lobby</title>
        <meta name="description" content="Discover riverside walks, lush parks, and world-famous Meteora just an hour away. Plan your escape with Habitat Lobby." />
        <link rel="canonical" href="https://habitat-lobby.lovable.app/about-trikala/nature-day-trips" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TouristTrip",
            "name": "Nature & Day Trips from Trikala",
            "description": "Explore riverside paths, lush parks, and Meteora's UNESCO landscapes just an hour from Trikala.",
            "touristType": "Nature",
            "areaServed": "Trikala, Greece",
            "provider": {
              "@type": "LodgingBusiness",
              "name": "Habitat Lobby"
            },
            "offers": {
              "@type": "Offer",
              "availability": "https://schema.org/InStock",
              "url": "https://habitat-lobby.lovable.app/about-trikala/nature-day-trips"
            }
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={lithaiosRiver}
            alt="Lithaios River and nature around Trikala"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70"></div>
        </div>
        <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-6">
          <div className="space-y-6">
            <Badge variant="outline" className="border-white/30 text-white bg-white/10 backdrop-blur-sm">
              Nature & Adventure Guide
            </Badge>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-6 leading-tight">
              Nature & Day Trips
            </h1>
            <div className="space-y-4 max-w-3xl mx-auto">
              <p className="text-2xl md:text-3xl font-light leading-relaxed">
                From riverbanks to rock pinnacles
              </p>
              <p className="text-lg md:text-xl opacity-90 leading-relaxed font-light">
                Stroll along leafy paths in the heart of the city or set out for world-class landscapes a short drive away.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white font-medium px-8 py-3">
              <Link to="/apartments">See Nearby Apartments</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/50 text-white hover:bg-white hover:text-black font-medium px-8 py-3 backdrop-blur-sm">
              <a href="#map">Plan Your Trip</a>
            </Button>
          </div>
        </div>
      </section>

      <div className="container py-16 space-y-24">
        {/* Riverside & Urban Nature Section */}
        <section className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">Riverside & Urban Nature</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Even in the center of Trikala, nature is close. Discover green spaces and peaceful paths within walking distance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {highlights.filter(h => h.category === "Urban Nature").map((highlight, index) => {
              const IconComponent = highlight.icon;
              return (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <IconComponent className="h-6 w-6 text-green-600" />
                      </div>
                      <Badge variant="outline" className="text-xs">{highlight.duration}</Badge>
                    </div>
                    <CardTitle className="text-xl font-serif group-hover:text-green-600 transition-colors">
                      {highlight.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {highlight.description}
                    </p>
                    <Button variant="outline" size="sm" asChild className="w-full group-hover:bg-green-600 group-hover:text-white transition-colors">
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

        {/* Meteora Section */}
        <section className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">Meteora UNESCO World Heritage Site</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Less than an hour from Trikala, Meteora's rock towers rise dramatically from the plain.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Mountain className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Monasteries perched in the sky</h3>
                    <p className="text-muted-foreground">Visit one or more of the six active monasteries, each offering unique architecture and breathtaking views.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Trees className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Hiking trails</h3>
                    <p className="text-muted-foreground">Connect monasteries and viewpoints through forested paths with varying difficulty levels.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Sun className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Sunset view points</h3>
                    <p className="text-muted-foreground">World-renowned golden-hour scenery that attracts photographers from around the globe.</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
                <div className="flex items-center gap-3 mb-3">
                  <Info className="h-5 w-5 text-amber-600" />
                  <h4 className="font-semibold text-amber-800">Travel Tip</h4>
                </div>
                <p className="text-amber-700">Join an early morning or late-afternoon tour to avoid the busiest hours and experience the best lighting for photography.</p>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={meteoraReal}
                  alt="Meteora monasteries perched on dramatic rock formations"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Day Trip Ideas Section */}
        <section className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">Day Trip Ideas</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore stunning natural landscapes and charming mountain villages within easy reach of Trikala.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {dayTrips.map((trip, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Car className="h-6 w-6 text-blue-600" />
                    </div>
                    <Badge variant="outline" className="text-xs">{trip.distance}</Badge>
                  </div>
                  <CardTitle className="text-2xl font-serif group-hover:text-blue-600 transition-colors">
                    {trip.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {trip.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {trip.activities.map((activity, actIndex) => (
                      <Badge key={actIndex} variant="secondary" className="text-xs">
                        {activity}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" asChild className="w-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <a href="#map" className="flex items-center justify-center gap-2">
                      <MapPin className="h-4 w-4" />
                      View on Map
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Suggested Itinerary Section */}
        <section className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-2xl overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl font-serif">One Day in Nature</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-6">
                {itinerary.map((item, index) => (
                  <div key={index} className="relative">
                    {index < itinerary.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-8 bg-green-200"></div>
                    )}
                    <div className="flex items-start gap-6 p-6 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-green-600 text-lg">{item.time}</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{item.activity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-green-100 rounded-xl">
                <div className="text-center">
                  <h4 className="font-semibold text-green-800 mb-2">Book Your Stay with Easy Access to Nature</h4>
                  <p className="text-green-700 mb-4">Start your nature adventures from the comfort of Habitat Lobby</p>
                  <Button asChild className="bg-green-600 hover:bg-green-700">
                    <Link to="/apartments">Check Availability</Link>
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
              Everything you need to know for your nature adventures around Trikala.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Car className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Transport</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Car rental is most flexible; local buses run to Meteora and nearby towns.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <Sun className="h-6 w-6 text-amber-600" />
                </div>
                <CardTitle className="text-xl">Best Time</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Spring for wildflowers, autumn for golden foliage, winter for snow in the mountains.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Camera className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">What to Pack</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Comfortable shoes, water bottle, sunhat (summer), light jacket (spring/autumn).</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Quick answers to help you plan your nature adventures.
            </p>
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Can I visit Meteora without a car?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Yes—frequent buses and guided tours depart from Trikala and Kalambaka.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Is there an entrance fee for the monasteries?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Yes, each monastery has a small fee; dress modestly (shoulders/knees covered).</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Are there nature activities for kids?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Yes—parks, riverside paths, and gentle hikes are all family-friendly.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Map Section */}
        <section id="map" className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">Nature & Adventure Map</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From city strolls to mountain escapes—all within easy reach of Habitat Lobby.
            </p>
          </div>

          <Card className="border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="h-[500px]">
                <Map
                  locations={mapLocations}
                  center={[39.5551, 21.7669]}
                  zoom={10}
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
                  From city strolls to mountain escapes—within easy reach of Habitat Lobby.
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
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-2xl font-serif group-hover:text-blue-600 transition-colors">
                  Experiences
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Curated activities and local experiences to make the most of your stay in Trikala.
                </p>
                <Button asChild variant="outline" className="w-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Link to="/experiences" className="flex items-center justify-center gap-2">
                    View Experiences
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      {/* Enhanced CTA Section */}
      <section className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container text-center relative z-10 max-w-4xl">
          <div className="space-y-8">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight">
              Breathe the fresh air, sleep in comfort
            </h2>
            <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto leading-relaxed">
              Return from your adventures to a warm, stylish apartment in Trikala's center.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100 font-medium px-8 py-3">
                <Link to="/apartments">View Apartments</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/50 text-white hover:bg-white hover:text-green-600 font-medium px-8 py-3 backdrop-blur-sm">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
};

export default NatureDayTrips;
