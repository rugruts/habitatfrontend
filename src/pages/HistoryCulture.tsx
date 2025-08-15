import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, Camera, Users, ArrowRight, Calendar, Info, Star, Shield, Building, Home, Music, ShoppingBag, Landmark, Coffee, Trees } from "lucide-react";
import expCastle from "@/assets/exp-castle.jpg";
import Footer from "@/components/Footer";
import Map, { MapLocation } from "@/components/Map";

const highlights = [
  {
    title: "Byzantine Castle & Fortifications",
    description: "Stone walls, shady paths, and a panoramic lookout—best at golden hour.",
    icon: Shield,
    category: "Historical",
    duration: "45 min"
  },
  {
    title: "Ottoman Clock Tower",
    description: "A city symbol; stand beneath it to hear the quarter‑hour chimes.",
    icon: Clock,
    category: "Architecture",
    duration: "15 min"
  },
  {
    title: "Old Town Laderas & Varousi",
    description: "Narrow lanes, painted houses, and courtyards—perfect for an evening stroll.",
    icon: Home,
    category: "Neighborhoods",
    duration: "60 min"
  },
  {
    title: "Trikalon Bridge & Riverside Walks",
    description: "Historic stone bridges linking the center with leafy paths along the Lithaios.",
    icon: Landmark,
    category: "Landmarks",
    duration: "30 min"
  },
  {
    title: "Tsitsanis Museum / Cultural Spot",
    description: "A tribute to composer Vassilis Tsitsanis; exhibitions and music heritage.",
    icon: Music,
    category: "Culture",
    duration: "45 min"
  },
  {
    title: "Local Market & Artisan Shops",
    description: "Seasonal produce, herbs, and small workshops—great for authentic souvenirs.",
    icon: ShoppingBag,
    category: "Shopping",
    duration: "30 min"
  }
];

const itinerary = [
  { time: "10:00", activity: "Coffee by the river → walk to Old Town." },
  { time: "11:00", activity: "Climb to the Byzantine Castle (photo stop at the tower)." },
  { time: "12:30", activity: "Browse the market streets; taste local pies." },
  { time: "14:00", activity: "Lunch at a traditional taverna; try spetsofai or hilopites." },
  { time: "16:00", activity: "Optional: visit a museum/gallery or relax by the river." }
];

const mapLocations: MapLocation[] = [
  {
    id: "byzantine-castle",
    name: "Byzantine Castle (Kastro)",
    description: "6th-century Byzantine fortress built by Emperor Justinian I, offering panoramic views over Trikala and the Thessalian plain",
    lat: 39.559102790802754,
    lng: 21.762777080536097,
    type: "castle",
    openingHours: "Daily 8:00-20:00 (Summer), 8:00-17:00 (Winter)",
    entryFee: "Free"
  },
  {
    id: "clock-tower",
    name: "Ottoman Clock Tower (Roloi)",
    description: "Iconic 1936 clock tower in the city center, built on the site of a former Ottoman minaret",
    lat: 39.55824947509666,
    lng: 21.76297011307814,
    type: "tower",
    openingHours: "External viewing only",
    entryFee: "Free"
  },
  {
    id: "varousi-district",
    name: "Varousi Old Town",
    description: "Historic Ottoman-era neighborhood with traditional architecture, narrow cobblestone streets, and preserved houses",
    lat: 39.55919412926667,
    lng: 21.76505951937856,
    type: "district",
    openingHours: "Always accessible",
    entryFee: "Free"
  },
  {
    id: "lithaios-bridge",
    name: "Lithaios River Bridge",
    description: "Historic stone bridge over the Lithaios River, part of the scenic riverside walking path",
    lat: 39.55543617935153,
    lng: 21.767761570925458,
    type: "bridge",
    openingHours: "Always accessible",
    entryFee: "Free"
  },
  {
    id: "tsitsanis-museum",
    name: "Vassilis Tsitsanis Museum",
    description: "Dedicated to the famous rebetiko composer born in Trikala, featuring his life and musical legacy",
    lat: 39.55099735843994,
    lng: 21.770118543820864,
    type: "museum",
    openingHours: "Tue-Sun 10:00-14:00, 18:00-21:00",
    entryFee: "€3"
  },
  {
    id: "central-square",
    name: "Central Square (Plateia Riga Fereou)",
    description: "Main town square surrounded by cafés, shops, and the Municipal Theater, heart of Trikala's social life",
    lat: 39.55500912069906,
    lng: 21.7678820839955,
    type: "square",
    openingHours: "Always accessible",
    entryFee: "Free"
  },
  {
    id: "municipal-theater",
    name: "Municipal Theater of Trikala",
    description: "Historic theater building hosting cultural performances, concerts, and local events",
    lat: 39.546270169344986,
    lng: 21.758822730744264,
    type: "theater",
    openingHours: "Performance schedule varies",
    entryFee: "Ticket prices vary"
  },
  {
    id: "asclepieion-site",
    name: "Ancient Asclepieion Site",
    description: "Archaeological site of the ancient healing sanctuary dedicated to Asclepius, birthplace of medical science",
    lat: 39.55658207750388,
    lng: 21.764800738897296,
    type: "archaeological",
    openingHours: "Daily 8:00-15:00",
    entryFee: "€2"
  },
  {
    id: "mill-of-elves",
    name: "Mill of Elves Park",
    description: "Famous Christmas theme park location, also a beautiful riverside park year-round",
    lat: 39.546254698476204,
    lng: 21.758652864742487,
    type: "park",
    openingHours: "Always accessible (Christmas park Dec-Jan)",
    entryFee: "Free (Christmas park entry fee applies)"
  }
];

const HistoryCulture: React.FC = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>History & Culture of Trikala | Habitat Lobby</title>
        <meta name="description" content="Explore Trikala's history—Byzantine castle, Ottoman clock tower, stone bridges, museums, and local traditions. Plan your stay with Habitat Lobby." />
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
              Cultural Heritage Guide
            </Badge>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-6 leading-tight">
              History & Culture
            </h1>
            <div className="space-y-4 max-w-3xl mx-auto">
              <p className="text-2xl md:text-3xl font-light leading-relaxed">
                Stories written in stone
              </p>
              <p className="text-lg md:text-xl opacity-90 leading-relaxed font-light">
                From Byzantine walls to riverside bridges and living traditions, Trikala's past is woven into everyday life.
                Discover centuries of history through cobblestone streets, ancient fortifications, and cultural landmarks.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white font-medium px-8 py-3">
              <Link to="/apartments">See Apartments</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/50 text-white hover:bg-white hover:text-black font-medium px-8 py-3 backdrop-blur-sm">
              <a href="#map">Map of Sights</a>
            </Button>
          </div>
        </div>
      </section>

      <div className="container py-16 space-y-24">
        {/* Deep Historical Timeline */}
        <section className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">2,300 Years of History</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              From ancient Trikka to modern Trikala, discover how this strategic location in Thessaly has been continuously inhabited,
              witnessing the rise and fall of empires while preserving its unique cultural identity.
            </p>
          </div>

          {/* Ancient Period */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <Badge className="bg-amber-100 text-amber-800 mb-4">Ancient Era</Badge>
              <h3 className="font-serif text-3xl md:text-4xl mb-4">Ancient Trikka (3rd century BC - 4th century AD)</h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The birthplace of Asclepius, god of medicine, and a sacred healing center of the ancient world.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Card className="border-l-4 border-l-amber-500">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-xl mb-3">Sacred Healing Center</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Ancient Trikka was renowned throughout the Greek world as the birthplace of Asclepius, the god of medicine.
                      Pilgrims traveled from across the Mediterranean to seek healing at the sacred Asclepieion, making Trikka
                      one of the most important medical centers of antiquity.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-xl mb-3">Strategic Location</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Positioned at the crossroads of ancient trade routes, Trikka controlled access between northern and southern Greece.
                      The fertile Thessalian plains provided abundant resources, while the nearby mountains offered natural protection.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-xl mb-3">Archaeological Evidence</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Excavations have revealed ancient walls, pottery, and inscriptions dating to the Hellenistic period.
                      The discovery of medical instruments and votive offerings confirms the city's reputation as a healing sanctuary.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="bg-amber-50 border-amber-200">
                  <CardHeader>
                    <CardTitle className="text-2xl font-serif text-amber-800">The Asclepius Legend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-amber-700 leading-relaxed mb-4">
                      According to ancient sources, Asclepius was born in Trikka to Apollo and the mortal princess Coronis.
                      Raised by the centaur Chiron, he became the greatest healer of the ancient world.
                    </p>
                    <p className="text-amber-700 leading-relaxed">
                      The Asclepieion of Trikka was considered the original and most sacred of all healing temples,
                      predating even the famous sanctuary at Epidaurus.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-lg mb-3 text-amber-800">Did You Know?</h4>
                    <ul className="space-y-2 text-amber-700">
                      <li>• Homer mentions Trikka in the Iliad as sending ships to Troy</li>
                      <li>• The city minted its own coins featuring Asclepius</li>
                      <li>• Ancient medical texts reference "Trikkaean healing methods"</li>
                      <li>• The modern medical symbol (Rod of Asclepius) originates here</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Byzantine Period */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <Badge className="bg-purple-100 text-purple-800 mb-4">Medieval Era</Badge>
              <h3 className="font-serif text-3xl md:text-4xl mb-4">Byzantine Trikala (4th - 15th century)</h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A fortified stronghold defending the empire's northern borders and a center of Orthodox Christianity.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Card className="bg-purple-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="text-2xl font-serif text-purple-800">The Great Fortress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-700 leading-relaxed mb-4">
                      The imposing castle that dominates Trikala's skyline was built in the 6th century AD on the site
                      of the ancient acropolis. Emperor Justinian I ordered its construction as part of his massive
                      fortification program to defend the empire's Balkan frontiers.
                    </p>
                    <p className="text-purple-700 leading-relaxed">
                      The fortress withstood numerous sieges by Bulgars, Serbs, and later Ottoman forces,
                      serving as the administrative center of the Byzantine theme of Hellas.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-xl mb-3">Religious Center</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Byzantine Trikala was home to numerous churches and monasteries. The city served as a bishopric,
                      with its religious influence extending throughout Thessaly. Many Byzantine churches still stand today,
                      hidden within the old town's narrow streets.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-xl mb-3">Trade & Crafts</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      The city flourished as a center of silk production and metalworking. Byzantine craftsmen created
                      exquisite religious artifacts, jewelry, and textiles that were traded throughout the empire and beyond.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-xl mb-3">Cultural Legacy</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Byzantine architectural elements are still visible throughout Trikala. The characteristic red brick
                      and stone construction, arched windows, and decorative patterns influenced local building styles for centuries.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Ottoman Period */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <Badge className="bg-emerald-100 text-emerald-800 mb-4">Ottoman Era</Badge>
              <h3 className="font-serif text-3xl md:text-4xl mb-4">Ottoman Trikala (1393 - 1881)</h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Nearly five centuries of Ottoman rule that transformed the city's architecture, culture, and daily life.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Card className="border-l-4 border-l-emerald-500">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-xl mb-3">Administrative Capital</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Trikala became the seat of a major Ottoman sanjak (administrative district), governing much of Thessaly.
                      The city's strategic importance grew as it controlled key routes between Constantinople and the empire's
                      western territories.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-emerald-500">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-xl mb-3">Architectural Transformation</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      The Ottomans introduced new architectural styles: mosques with distinctive minarets, public baths (hammams),
                      covered markets (bezestans), and the iconic clock tower that still marks the city center. Traditional houses
                      with wooden upper floors and stone foundations became the standard.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-emerald-500">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-xl mb-3">Cultural Synthesis</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Despite religious differences, a unique cultural synthesis emerged. Greek Orthodox communities maintained
                      their traditions while adopting Ottoman customs in dress, cuisine, and social practices. This period
                      created the distinctive character that defines Trikala today.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="bg-emerald-50 border-emerald-200">
                  <CardHeader>
                    <CardTitle className="text-2xl font-serif text-emerald-800">The Clock Tower Story</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-emerald-700 leading-relaxed mb-4">
                      Built in 1936 during the late Ottoman period, the clock tower replaced an earlier minaret.
                      Its construction marked Trikala's modernization efforts, bringing European timekeeping to a traditional society.
                    </p>
                    <p className="text-emerald-700 leading-relaxed">
                      The tower's chimes regulated daily life: calling merchants to market, announcing prayer times,
                      and marking the rhythm of urban existence. Today, it remains the city's most recognizable landmark.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-lg mb-3 text-emerald-800">Ottoman Heritage Today</h4>
                    <ul className="space-y-2 text-emerald-700">
                      <li>• Traditional neighborhoods (Varousi, Manavika)</li>
                      <li>• Stone bridges over the Lithaios River</li>
                      <li>• Covered market areas and artisan quarters</li>
                      <li>• Culinary traditions and coffee culture</li>
                      <li>• Urban layout and street patterns</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Modern Period */}
          <div className="mb-12">
            <div className="text-center mb-12">
              <Badge className="bg-blue-100 text-blue-800 mb-4">Modern Era</Badge>
              <h3 className="font-serif text-3xl md:text-4xl mb-4">Modern Trikala (1881 - Present)</h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From liberation to smart city: Trikala's transformation into a model of innovation while preserving its heritage.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-xl mb-3">Liberation & Growth (1881-1940)</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    After liberation from Ottoman rule, Trikala experienced rapid modernization. New schools, hospitals,
                    and public buildings were constructed. The arrival of the railway in 1886 connected the city to Athens
                    and Thessaloniki, spurring economic growth.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-xl mb-3">Reconstruction Era (1940-1980)</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    After the devastation of WWII and the Greek Civil War, Trikala rebuilt itself as a modern provincial capital.
                    Urban planning preserved the historic center while expanding with contemporary neighborhoods.
                    The university brought new energy and intellectual life.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-xl mb-3">Smart City Pioneer (1980-Present)</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Trikala became Greece's first smart city, implementing innovative technologies while respecting its heritage.
                    Digital services, sustainable transport, and cultural preservation create a unique model of urban development
                    that attracts visitors from around the world.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Archaeological Discoveries */}
        <section className="max-w-7xl mx-auto mb-24">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">Archaeological Treasures</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Recent excavations continue to reveal Trikala's ancient secrets, confirming its importance as a sacred healing center
              and strategic crossroads of the ancient world.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div className="space-y-8">
              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif text-amber-800">The Ancient Asclepieion</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-amber-700 leading-relaxed mb-4">
                    Ongoing excavations near the castle hill have uncovered remains of the ancient Asclepieion,
                    including foundation stones, ritual pools, and medical instruments. These findings confirm ancient
                    sources that described Trikka as the birthplace of medical science.
                  </p>
                  <div className="bg-white/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-amber-800">Key Discoveries:</h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• Bronze surgical instruments (3rd century BC)</li>
                      <li>• Votive offerings depicting healed body parts</li>
                      <li>• Inscribed tablets with healing prayers</li>
                      <li>• Sacred spring and purification basins</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif text-purple-800">Byzantine Artifacts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-700 leading-relaxed mb-4">
                    The castle excavations have revealed a rich collection of Byzantine artifacts, including religious icons,
                    imperial seals, and everyday objects that illuminate life in medieval Trikala.
                  </p>
                  <div className="bg-white/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-purple-800">Notable Finds:</h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• 12th-century religious frescoes</li>
                      <li>• Imperial coins and administrative seals</li>
                      <li>• Ceramic workshops and kilns</li>
                      <li>• Defensive wall construction phases</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif text-emerald-800">Ottoman Urban Planning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-emerald-700 leading-relaxed mb-4">
                    Archaeological surveys of the old town reveal the sophisticated Ottoman urban planning that created
                    Trikala's distinctive neighborhoods. Water systems, market areas, and residential quarters show
                    remarkable preservation.
                  </p>
                  <div className="bg-white/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-emerald-800">Urban Features:</h4>
                    <ul className="text-sm text-emerald-700 space-y-1">
                      <li>• Original stone-paved streets</li>
                      <li>• Traditional house foundations</li>
                      <li>• Public fountain systems</li>
                      <li>• Market and workshop areas</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif text-blue-800">Modern Archaeological Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-700 leading-relaxed mb-4">
                    Trikala's archaeological program uses cutting-edge technology including ground-penetrating radar,
                    3D modeling, and digital reconstruction to uncover and preserve its heritage without damaging existing structures.
                  </p>
                  <div className="bg-white/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-blue-800">Current Projects:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Digital mapping of underground structures</li>
                      <li>• Virtual reality historical reconstructions</li>
                      <li>• Conservation of Byzantine frescoes</li>
                      <li>• Public archaeology education programs</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="font-serif text-2xl mb-4 text-primary">Explore Archaeological Sites</h3>
              <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl mx-auto">
                Visit the actual archaeological sites around Trikala where these discoveries were made. The Ancient Asclepieion site
                near the castle and ongoing excavations throughout the old town offer glimpses into 2,300 years of continuous history.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="outline" className="text-sm">Asclepieion Site: Daily 8:00-15:00</Badge>
                <Badge variant="outline" className="text-sm">Castle Area: Free Access</Badge>
                <Badge variant="outline" className="text-sm">Self-guided exploration</Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Must-see Highlights */}
        <section className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">Essential Cultural Sites</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Six carefully curated destinations that showcase Trikala's rich heritage. Each site offers a unique window
              into the city's layered history and vibrant cultural identity.
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
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">Perfect Half-Day Journey</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A carefully crafted route through Trikala's cultural highlights, designed to maximize your experience
              while allowing time to savor each moment.
            </p>
          </div>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50">
            <CardHeader className="text-center pb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Calendar className="h-6 w-6 text-accent" />
                <Badge variant="secondary" className="text-sm font-medium">6-Hour Cultural Tour</Badge>
              </div>
              <CardTitle className="text-2xl font-serif">Your Cultural Adventure</CardTitle>
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
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">Living Traditions</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Discover how ancient customs, Byzantine rituals, and Ottoman practices have evolved into the vibrant
              cultural traditions that define modern Trikala's character and daily life.
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
                    <Badge variant="outline" className="text-xs">Ancient Origins</Badge>
                  </div>
                  <CardTitle className="text-xl font-serif">Healing Music Tradition</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    The tradition of therapeutic music in Trikala dates back to the ancient Asclepieion, where music was used
                    as part of healing rituals. Today, this legacy lives on in the city's vibrant music scene and the annual
                    Tsitsanis Festival celebrating the famous rebetiko composer born here.
                  </p>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2 text-amber-800">Modern Expressions:</h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• Annual Vassilis Tsitsanis Festival (July)</li>
                      <li>• Traditional music workshops</li>
                      <li>• Therapeutic music programs in hospitals</li>
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
                    <Badge variant="outline" className="text-xs">Byzantine Heritage</Badge>
                  </div>
                  <CardTitle className="text-xl font-serif">Religious Festivals</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Byzantine religious traditions continue to shape Trikala's calendar. The Feast of Saint Nicholas (December 6)
                    and Easter celebrations maintain centuries-old customs, while the famous "Mill of Elves" Christmas park
                    blends ancient winter solstice traditions with modern family entertainment.
                  </p>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2 text-purple-800">Major Celebrations:</h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• Mill of Elves (December-January)</li>
                      <li>• Easter processions through old town</li>
                      <li>• Feast of Saint Nicholas</li>
                      <li>• Traditional blessing of waters (Epiphany)</li>
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
                    <Badge variant="outline" className="text-xs">Ottoman Legacy</Badge>
                  </div>
                  <CardTitle className="text-xl font-serif">Coffee Culture</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    The Ottoman introduction of coffee created a social institution that remains central to Trikala life.
                    Traditional kafeneia (coffee houses) serve as community centers where locals gather to discuss politics,
                    play backgammon, and maintain social bonds across generations.
                  </p>
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2 text-emerald-800">Coffee Traditions:</h4>
                    <ul className="text-sm text-emerald-700 space-y-1">
                      <li>• Traditional Greek coffee preparation</li>
                      <li>• Kafeneio social gatherings</li>
                      <li>• Riverside café terraces</li>
                      <li>• Coffee fortune telling (tasseography)</li>
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
                    <Badge variant="outline" className="text-xs">Multicultural Synthesis</Badge>
                  </div>
                  <CardTitle className="text-xl font-serif">Artisan Crafts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Trikala's craft traditions blend influences from all historical periods. Local artisans create pottery
                    using Byzantine techniques, metalwork reflecting Ottoman styles, and textiles incorporating ancient Greek patterns.
                    These crafts are sold in workshops throughout the old town.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2 text-blue-800">Traditional Crafts:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Hand-thrown ceramics and pottery</li>
                      <li>• Traditional metalwork and jewelry</li>
                      <li>• Woven textiles and embroidery</li>
                      <li>• Woodcarving and furniture making</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="font-serif text-2xl mb-4 text-primary">Experience Living History</h3>
                <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  Join locals in their daily traditions. Visit a traditional kafeneio, attend a religious festival,
                  or learn from master craftsmen who maintain skills passed down through generations.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Coffee className="h-6 w-6 text-accent" />
                  </div>
                  <h4 className="font-semibold mb-2">Morning Coffee Ritual</h4>
                  <p className="text-sm text-muted-foreground">Start your day like a local at a traditional kafeneio</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Music className="h-6 w-6 text-accent" />
                  </div>
                  <h4 className="font-semibold mb-2">Evening Entertainment</h4>
                  <p className="text-sm text-muted-foreground">Enjoy traditional music in historic courtyards</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ShoppingBag className="h-6 w-6 text-accent" />
                  </div>
                  <h4 className="font-semibold mb-2">Artisan Workshops</h4>
                  <p className="text-sm text-muted-foreground">Watch master craftsmen at work in their studios</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Culture Now */}
        <section className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">Contemporary Cultural Scene</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Modern Trikala honors its heritage while embracing innovation. Discover how the city's cultural institutions
              and creative community continue to write new chapters in its long story.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Music className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-2xl font-serif">Cultural Venues</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  The Municipal Theater, Cultural Center, and outdoor amphitheaters host year-round performances.
                  From classical concerts in Byzantine courtyards to contemporary art exhibitions, Trikala's cultural
                  calendar offers something for every taste.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Building className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-2xl font-serif">Smart Heritage</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  As Greece's first smart city, Trikala uses technology to enhance cultural experiences.
                  QR codes at historical sites provide multilingual information, while virtual reality tours
                  bring ancient Trikka to life for modern visitors.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Users className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-2xl font-serif">Community Spirit</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Local cultural associations, volunteer groups, and neighborhood committees maintain Trikala's
                  strong sense of community. Festivals, markets, and celebrations bring residents together,
                  preserving the social bonds that have sustained the city for millennia.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Practical Tips */}
        <section className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">Essential Travel Tips</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Make the most of your cultural exploration with these insider recommendations for timing,
              preparation, and capturing memories.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-xl font-serif">Best Time to Visit</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Spring through autumn offers ideal weather for exploring. December brings magical holiday events
                  and festive atmosphere to the historic sites.
                </p>
                <Badge variant="outline" className="text-xs">
                  Peak Season: May-September
                </Badge>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-xl font-serif">What to Wear</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Comfortable walking shoes are essential for cobblestone streets and castle paths.
                  Layers work best for changing temperatures throughout the day.
                </p>
                <Badge variant="outline" className="text-xs">
                  Comfortable & Practical
                </Badge>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Camera className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-xl font-serif">Photography Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Golden hour from the castle offers stunning panoramic shots. Early morning riverside light
                  creates beautiful reflections and soft shadows.
                </p>
                <Badge variant="outline" className="text-xs">
                  Best Light: Dawn & Dusk
                </Badge>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">Common Questions</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know for a seamless cultural exploration of Trikala.
            </p>
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Info className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-3">Is everything walkable?</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Absolutely. All major cultural highlights are within a comfortable walking radius from the city center.
                      The compact layout makes it easy to explore multiple sites in a single day without transportation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Clock className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-3">How much time should I plan?</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      One full day allows you to experience all the core cultural sites at a relaxed pace.
                      If you're planning to visit nearby Meteora, consider adding an additional day to your itinerary.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-3">Are guided tours available?</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Yes, we can connect you with trusted local guides who offer personalized tours and insider knowledge.
                      Contact us for recommendations and custom route planning based on your interests.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Map Section */}
        <section id="map" className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">Interactive Cultural Map</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Navigate Trikala's cultural landscape with our detailed map featuring all major historical sites,
              museums, and points of interest.
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
                  All cultural highlights are within a pleasant 15-minute walk from Habitat Lobby.
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

          <div className="grid md:grid-cols-3 gap-8">
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
                <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <Link to="/about-trikala/nature-day-trips" className="flex items-center justify-center gap-2">
                    Explore Nature
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
                  Local Life
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Experience the cafés, markets, and friendly pace of everyday life in Trikala.
                </p>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <Link to="/about-trikala/local-life" className="flex items-center justify-center gap-2">
                    Discover Local Life
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
                  Experiences
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Curated activities and local experiences to make the most of your stay in Trikala.
                </p>
                <Button asChild variant="outline" className="w-full group-hover:bg-purple-600 group-hover:text-white transition-colors">
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
      <section className="bg-gradient-to-r from-primary via-accent to-primary text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container text-center relative z-10 max-w-4xl">
          <div className="space-y-8">
            <div>
              <h2 className="font-serif text-4xl md:text-6xl mb-6 leading-tight">
                Stay Close to Trikala's Cultural Heart
              </h2>
              <p className="text-xl md:text-2xl mb-4 opacity-95 font-light">
                Experience history at your doorstep
              </p>
              <p className="text-lg opacity-90 max-w-2xl mx-auto leading-relaxed">
                Book directly with Habitat Lobby for the best rates, personalized recommendations,
                and insider access to Trikala's hidden cultural gems.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
              <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100 font-medium px-8 py-4 text-lg">
                <Link to="/apartments">Explore Our Apartments</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/50 text-white hover:bg-white hover:text-primary font-medium px-8 py-4 text-lg backdrop-blur-sm">
                <Link to="/contact">Get Cultural Recommendations</Link>
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

      <Footer />
    </main>
  );
};

export default HistoryCulture;
