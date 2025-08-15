import React from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { trackPageView } from "@/components/GoogleAnalytics";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, Camera, Users, ArrowRight, Calendar, Info, Star, Bike, Route, Shield, Trees, Coffee, Heart, Navigation, Zap, Building, Wrench, Parking, Map as MapIcon, CheckCircle, AlertCircle, Sun, Moon, Thermometer, ShoppingBag, Castle, Landmark } from "lucide-react";
import cyclingHero from "@/assets/exp-cycling.jpg";
import lithaiosRiver from "@/assets/lithaios-river-real.jpg";
import Footer from "@/components/Footer";
import Map, { MapLocation } from "@/components/Map";

const highlights = [
  {
    title: "Lithaios Riverside Cycling Path",
    description: "The crown jewel of Trikala's cycling network—a dedicated path along the river with stone bridges and café stops.",
    icon: Bike,
    category: "Main Routes",
    duration: "20-30 min"
  },
  {
    title: "Car-Free City Center",
    description: "Pedestrian and cyclist priority zones throughout the historic center, making exploration safe and enjoyable.",
    icon: Shield,
    category: "Infrastructure",
    duration: "15-45 min"
  },
  {
    title: "Mill of Elves Park Circuit",
    description: "Family-friendly cycling paths through Trikala's most beloved park with playgrounds and green spaces.",
    icon: Trees,
    category: "Family Routes",
    duration: "30-45 min"
  },
  {
    title: "Smart City Bike Network",
    description: "GPS-tracked bike sharing system with stations throughout the city—Greece's most advanced cycling infrastructure.",
    icon: Navigation,
    category: "Technology",
    duration: "On-demand"
  },
  {
    title: "Bike-Friendly Cafés & Stops",
    description: "Riverside terraces and local spots with dedicated bike parking and cyclist amenities.",
    icon: Coffee,
    category: "Amenities",
    duration: "30-60 min"
  },
  {
    title: "Castle Hill Cycling Access",
    description: "Gentle slopes and dedicated paths leading to panoramic views from Trikala's historic castle.",
    icon: MapIcon,
    category: "Scenic Routes",
    duration: "25-35 min"
  }
];

const cyclingRoutes = [
  {
    name: "Lithaios Riverside Classic",
    distance: "3.2 km",
    difficulty: "Easy",
    duration: "15-20 min",
    elevation: "Flat",
    description: "The signature Trikala cycling experience—follow the dedicated riverside path with stone bridges, shaded sections, and café stops. Perfect for all ages and skill levels.",
    highlights: ["Historic stone bridges", "Riverside cafés", "Shaded tree canopy", "Photo opportunities"],
    startPoint: "Central Square",
    endPoint: "Municipal Park",
    surface: "Paved cycle path",
    traffic: "Car-free"
  },
  {
    name: "Historic Center Discovery",
    distance: "2.8 km",
    difficulty: "Easy",
    duration: "12-18 min",
    elevation: "Gentle hills",
    description: "Explore Trikala's pedestrian-friendly center, from the main square through the old town to the castle hill. Discover hidden courtyards and local life.",
    highlights: ["Central Square", "Castle viewpoints", "Old town architecture", "Local markets"],
    startPoint: "Clock Tower",
    endPoint: "Castle Hill",
    surface: "Mixed paved/cobblestone",
    traffic: "Pedestrian priority"
  },
  {
    name: "Green Spaces Circuit",
    distance: "4.5 km",
    difficulty: "Easy",
    duration: "20-30 min",
    elevation: "Flat with gentle slopes",
    description: "Connect all of Trikala's parks and green spaces in one scenic route. Includes the famous Mill of Elves area and botanical gardens.",
    highlights: ["Mill of Elves Park", "Botanical gardens", "Playground areas", "Picnic spots"],
    startPoint: "Municipal Park",
    endPoint: "Mill of Elves",
    surface: "Paved paths",
    traffic: "Park roads only"
  },
  {
    name: "Extended Riverside Adventure",
    distance: "8.2 km",
    difficulty: "Moderate",
    duration: "35-50 min",
    elevation: "Mostly flat",
    description: "For more experienced cyclists—extend beyond the city center following the Lithaios to quieter suburban areas and nature spots.",
    highlights: ["Extended river views", "Suburban neighborhoods", "Nature reserves", "Local life"],
    startPoint: "Central Square",
    endPoint: "Suburban Parks",
    surface: "Mixed paved/gravel",
    traffic: "Low traffic roads"
  },
  {
    name: "Sunset Castle Loop",
    distance: "5.1 km",
    difficulty: "Moderate",
    duration: "25-35 min",
    elevation: "Rolling hills",
    description: "Evening route combining riverside paths with gentle climbs to the castle for sunset views. Best enjoyed in late afternoon.",
    highlights: ["Sunset viewpoints", "Castle fortifications", "Evening light", "City panorama"],
    startPoint: "Riverside Café District",
    endPoint: "Castle Overlook",
    surface: "Paved with some gravel",
    traffic: "Mixed pedestrian/cycle"
  },
  {
    name: "Morning Market & Coffee Tour",
    distance: "3.8 km",
    difficulty: "Easy",
    duration: "30-45 min",
    elevation: "Flat",
    description: "Perfect morning route connecting the best local markets, bakeries, and coffee spots. Includes stops for fresh pastries and local products.",
    highlights: ["Local markets", "Traditional bakeries", "Coffee roasters", "Artisan shops"],
    startPoint: "Central Market",
    endPoint: "Riverside Cafés",
    surface: "Paved streets",
    traffic: "Early morning quiet"
  }
];

const cyclingFacilities = [
  {
    title: "Smart Bike Sharing Network",
    description: "GPS-enabled bikes available 24/7 at 15+ stations throughout the city. App-based rental with real-time availability.",
    icon: Navigation,
    category: "Technology",
    details: ["24/7 availability", "Mobile app integration", "15+ stations", "GPS tracking"]
  },
  {
    title: "Dedicated Cycling Infrastructure",
    description: "Over 15km of protected bike lanes, separated from traffic with clear signage and priority signals.",
    icon: Route,
    category: "Infrastructure",
    details: ["15+ km of bike lanes", "Traffic separation", "Priority signals", "Clear signage"]
  },
  {
    title: "Bike Rental & Services",
    description: "Traditional bike shops offering rentals, repairs, and accessories. Family bikes, e-bikes, and touring equipment available.",
    icon: Wrench,
    category: "Services",
    details: ["Multiple rental shops", "E-bike options", "Family bikes", "Repair services"]
  },
  {
    title: "Cyclist-Friendly Establishments",
    description: "Cafés, restaurants, and shops with secure bike parking, water stations, and cyclist amenities.",
    icon: Coffee,
    category: "Amenities",
    details: ["Secure bike parking", "Water refill stations", "Cyclist discounts", "Bike-friendly terraces"]
  },
  {
    title: "Safety & Security",
    description: "Well-lit paths, emergency call points, and regular police patrols ensure safe cycling day and night.",
    icon: Shield,
    category: "Safety",
    details: ["LED path lighting", "Emergency call points", "Police patrols", "CCTV coverage"]
  },
  {
    title: "Information & Navigation",
    description: "Digital maps, route planning apps, and information kiosks help cyclists navigate efficiently.",
    icon: MapIcon,
    category: "Navigation",
    details: ["Digital route maps", "Mobile apps", "Information kiosks", "Multilingual signage"]
  }
];

const practicalInfo = [
  {
    title: "Best Times to Cycle",
    icon: Sun,
    content: [
      "Early morning (7-9 AM): Cool temperatures, quiet paths, perfect for photography",
      "Late afternoon (5-7 PM): Golden hour lighting, lively café atmosphere",
      "Evening (7-9 PM): Sunset rides to castle hill, romantic riverside cycling"
    ]
  },
  {
    title: "Seasonal Considerations",
    icon: Thermometer,
    content: [
      "Spring (Mar-May): Ideal weather, blooming trees along paths, 15-25°C",
      "Summer (Jun-Aug): Early morning or evening rides recommended, 25-35°C",
      "Autumn (Sep-Nov): Perfect cycling weather, beautiful foliage, 15-25°C",
      "Winter (Dec-Feb): Mild temperatures, fewer crowds, 5-15°C"
    ]
  },
  {
    title: "Safety Guidelines",
    icon: AlertCircle,
    content: [
      "Always wear a helmet (available at rental stations)",
      "Use bike lights during evening rides",
      "Follow traffic signals and respect pedestrian areas",
      "Stay hydrated and carry water, especially in summer"
    ]
  },
  {
    title: "What to Bring",
    icon: CheckCircle,
    content: [
      "Comfortable clothing and closed-toe shoes",
      "Water bottle (refill stations available)",
      "Phone for navigation and emergency contact",
      "Small backpack for purchases and personal items"
    ]
  }
];

const localTips = [
  {
    title: "Morning Coffee Ritual",
    description: "Start your ride at 8 AM from Central Square, cycle to Riverside Café District for traditional Greek coffee and fresh pastries.",
    icon: Coffee,
    time: "8:00-9:30 AM"
  },
  {
    title: "Market Day Cycling",
    description: "Tuesday and Friday mornings, cycle through the local market areas. Vendors are cyclist-friendly and offer fresh seasonal produce.",
    icon: ShoppingBag,
    time: "9:00-11:00 AM"
  },
  {
    title: "Sunset Castle Ride",
    description: "The most popular evening activity—cycle to castle hill 30 minutes before sunset for spectacular views and photos.",
    icon: Camera,
    time: "1 hour before sunset"
  },
  {
    title: "Family-Friendly Routes",
    description: "Mill of Elves Park circuit is perfect for families. Playground stops, ice cream vendors, and safe, flat paths.",
    icon: Users,
    time: "Anytime"
  }
];

const mapLocations: MapLocation[] = [
  {
    id: "central-square",
    name: "Central Square (Plateia Polytechniou)",
    lat: 39.555102790802754,
    lng: 21.766777080536097,
    type: "district",
    description: "Main hub for cycling routes with bike sharing station and information kiosk"
  },
  {
    id: "lithaios-bridge",
    name: "Historic Lithaios Bridge",
    lat: 39.554523891847362,
    lng: 21.767534829139785,
    type: "bridge",
    description: "19th-century stone bridge marking the start of the riverside cycling path"
  },
  {
    id: "castle-hill",
    name: "Byzantine Castle Overlook",
    lat: 39.55582947291847,
    lng: 21.768547392847291,
    type: "castle",
    description: "Panoramic viewpoint accessible via dedicated cycling path with bike parking"
  },
  {
    id: "mill-of-elves",
    name: "Mill of Elves Park (Mylos ton Xotikon)",
    lat: 39.553547291847362,
    lng: 21.765023891847291,
    type: "district",
    description: "Trikala's most beloved park with dedicated family cycling circuits and playgrounds"
  },
  {
    id: "bike-rental-central",
    name: "Central Bike Station",
    lat: 39.554923891847362,
    lng: 21.767234829139785,
    type: "district",
    description: "Main bike rental hub with traditional and e-bikes, repair services"
  },
  {
    id: "riverside-cafes",
    name: "Riverside Café District",
    lat: 39.554123891847362,
    lng: 21.768234829139785,
    type: "district",
    description: "Cluster of cyclist-friendly cafés with bike parking and river views"
  },
  {
    id: "municipal-park",
    name: "Municipal Park",
    lat: 39.556123891847362,
    lng: 21.764234829139785,
    type: "district",
    description: "Large green space with internal cycling paths and family amenities"
  },
  {
    id: "smart-bike-station",
    name: "Smart Bike Sharing Hub",
    lat: 39.555623891847362,
    lng: 21.767734829139785,
    type: "district",
    description: "High-tech bike sharing station with GPS-enabled bikes and mobile app integration"
  },
  {
    id: "clock-tower",
    name: "Ottoman Clock Tower",
    lat: 39.555423891847362,
    lng: 21.767434829139785,
    type: "tower",
    description: "Historic landmark and popular cycling route waypoint"
  },
  {
    id: "botanical-garden",
    name: "Botanical Garden Entrance",
    lat: 39.556823891847362,
    lng: 21.765734829139785,
    type: "district",
    description: "Peaceful cycling paths through curated gardens and native plant collections"
  }
];

const CyclingCity: React.FC = () => {
  React.useEffect(() => {
    trackPageView('cycling-city');
  }, []);

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
                Greece's Cycling Capital
              </Badge>
              <Badge variant="outline" className="border-white text-white bg-accent/30 backdrop-blur-sm px-6 py-3 text-lg shadow-lg">
                <Route className="h-5 w-5 mr-2" />
                15+ km Bike Lanes
              </Badge>
            </div>

            <div>
              <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl text-white mb-8 leading-tight font-bold drop-shadow-lg">
                <span className="block">Cycling</span>
                <span className="block bg-gradient-to-r from-accent to-green-400 bg-clip-text text-transparent">
                  Paradise
                </span>
              </h1>
              <p className="text-2xl md:text-4xl font-light leading-relaxed text-white/95 mb-6">
                Riverside paths, smart bike sharing, and Europe's most bike-friendly city center
              </p>
              <p className="text-lg md:text-xl text-white leading-relaxed font-light max-w-3xl mx-auto drop-shadow-lg">
                Experience Trikala's revolutionary cycling infrastructure—where ancient stone bridges meet cutting-edge bike technology,
                and every street prioritizes two wheels over four.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white font-medium px-10 py-4 text-lg hover-scale">
                <Link to="/apartments">Stay in the Bike Capital</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white bg-white/20 text-white hover:bg-white hover:text-primary font-medium px-10 py-4 text-lg backdrop-blur-sm hover-scale shadow-lg">
                <Link to="/contact">Get Route Maps</Link>
              </Button>
            </div>

            <div className="pt-8">
              <div className="flex flex-wrap justify-center gap-6 text-sm text-white">
                <div className="flex items-center gap-2">
                  <Bike className="h-4 w-4" />
                  <span className="drop-shadow-md">Smart bike sharing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Route className="h-4 w-4" />
                  <span className="drop-shadow-md">Dedicated lanes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Landmark className="h-4 w-4" />
                  <span className="drop-shadow-md">Historic bridges</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coffee className="h-4 w-4" />
                  <span className="drop-shadow-md">Cyclist cafés</span>
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
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">Greece's Cycling Revolution</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8 max-w-4xl mx-auto">
              Trikala didn't just embrace cycling—it revolutionized urban mobility in Greece. As the country's first smart city,
              it created a cycling paradise that combines ancient charm with cutting-edge technology.
            </p>
            <div className="grid md:grid-cols-4 gap-8 mt-16">
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Route className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-serif text-2xl mb-3 text-primary">15+ km</h3>
                <p className="text-gray-700 font-medium">Protected Bike Lanes</p>
                <p className="text-sm text-gray-600 mt-2">Separated from traffic</p>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Navigation className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-serif text-2xl mb-3 text-primary">Smart System</h3>
                <p className="text-gray-700 font-medium">GPS Bike Sharing</p>
                <p className="text-sm text-gray-600 mt-2">15+ stations citywide</p>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-accent to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-serif text-2xl mb-3 text-primary">Car-Free</h3>
                <p className="text-gray-700 font-medium">Historic Center</p>
                <p className="text-sm text-gray-600 mt-2">Cyclist priority zones</p>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-serif text-2xl mb-3 text-primary">Local Culture</h3>
                <p className="text-gray-700 font-medium">Bike-First Lifestyle</p>
                <p className="text-sm text-gray-600 mt-2">Community embraced</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="font-serif text-3xl md:text-4xl mb-6 text-primary">The Trikala Difference</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2 text-gray-800">Smart Infrastructure</h4>
                      <p className="text-gray-600">GPS-enabled bike sharing, real-time availability, and mobile app integration make cycling effortless.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2 text-gray-800">Historic Beauty</h4>
                      <p className="text-gray-600">Cycle across 19th-century stone bridges and through medieval streets—history at every turn.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2 text-gray-800">Perfect Terrain</h4>
                      <p className="text-gray-600">Mostly flat with gentle hills, ideal for all fitness levels and ages. Family-friendly throughout.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img src={lithaiosRiver} alt="Cyclists on the Lithaios riverside path" className="rounded-2xl shadow-2xl" loading="lazy" />
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl border">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">4.8★</div>
                    <div className="text-sm text-gray-700">Cyclist Rating</div>
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
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">Cycling Highlights</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              From riverside paths to smart technology, discover what makes Trikala the ultimate cycling destination in Greece.
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
          <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">Signature Cycling Routes</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Six carefully designed routes that showcase Trikala's cycling paradise—from family-friendly riverside paths
            to scenic castle climbs and morning market tours.
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
                    <h4 className="font-semibold text-primary mb-3">Route Highlights</h4>
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
                      <span className="font-medium text-primary">Surface:</span>
                      <span className="text-gray-600 ml-2">{route.surface}</span>
                    </div>
                    <div>
                      <span className="font-medium text-primary">End Point:</span>
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
            <h3 className="font-serif text-3xl md:text-4xl mb-4 text-primary">Plan Your Perfect Ride</h3>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Local insights and practical tips to make the most of your cycling adventure in Trikala.
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
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">Cyclist-Friendly Facilities</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Trikala's commitment to cycling extends beyond just bike lanes—discover the comprehensive infrastructure that makes cycling here so enjoyable.
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
              <h3 className="font-serif text-4xl md:text-5xl mb-6 text-primary">Essential Cycling Information</h3>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Everything you need to know for a perfect cycling experience in Trikala.
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
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">Cycling Map</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Key cycling locations and starting points for your Trikala bike adventure.
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
                  All cycling routes and facilities within easy reach of Habitat Lobby.
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
                <span className="block">Your Cycling</span>
                <span className="block bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Adventure Awaits
                </span>
              </h2>
              <p className="text-2xl md:text-3xl mb-6 opacity-95 font-light leading-relaxed">
                Stay at Habitat Lobby—in the heart of Greece's cycling capital
              </p>
              <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
                Book directly with us for exclusive cycling perks: complimentary route maps, bike rental discounts,
                insider tips from local cyclists, and prime location just steps from the main cycling network.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
              <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100 font-medium px-12 py-5 text-xl hover-scale shadow-lg">
                <Link to="/apartments">Book Your Cycling Base</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white bg-white/20 text-white hover:bg-white hover:text-primary font-medium px-12 py-5 text-xl backdrop-blur-sm hover-scale shadow-lg">
                <Link to="/contact">Get Route Maps & Tips</Link>
              </Button>
            </div>

            <div className="pt-10">
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 max-w-4xl mx-auto border border-white/30 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <Bike className="h-6 w-6 text-white" />
                  <h3 className="text-xl font-semibold text-white drop-shadow-lg">Exclusive Cycling Package Benefits</h3>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-white">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-200" />
                    <span className="drop-shadow-sm">Best rate guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-200" />
                    <span className="drop-shadow-sm">Free route maps</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-200" />
                    <span className="drop-shadow-sm">Bike rental discounts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-200" />
                    <span className="drop-shadow-sm">Local cycling guides</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-200" />
                    <span className="drop-shadow-sm">Secure bike storage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-200" />
                    <span className="drop-shadow-sm">Repair kit access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-200" />
                    <span className="drop-shadow-sm">Weather updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-200" />
                    <span className="drop-shadow-sm">Café recommendations</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <p className="text-sm text-white/90 italic drop-shadow-md">
                "The best cycling experience in Greece starts at your doorstep when you stay with Habitat Lobby"
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default CyclingCity;
