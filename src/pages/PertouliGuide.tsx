import React from 'react';
import { Helmet } from 'react-helmet-async';
import pertouliHeader from '@/assets/petrouli2.jpg';
import elatiImage from '@/assets/elati.jpg';
import pertouliImage from '@/assets/petrouli.jpg';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Clock, 
  Car, 
  Mountain, 
  Trees, 
  Camera, 
  Thermometer,
  Calendar,
  Route,
  Star,
  ArrowLeft,
  ExternalLink,
  Snowflake,
  Sun,
  Leaf,
  CloudRain
} from 'lucide-react';
import { Link } from 'react-router-dom';

const PertouliGuide: React.FC = () => {
  const activities = [
    {
      title: "Hiking Trails",
      description: "Explore well-marked trails through pine forests and alpine meadows",
      difficulty: "Easy to Moderate",
      duration: "2-6 hours",
      season: "Spring to Autumn",
      icon: <Mountain className="h-6 w-6" />
    },
    {
      title: "Mountain Biking",
      description: "Scenic routes through forest paths and mountain terrain",
      difficulty: "Moderate to Hard",
      duration: "3-8 hours",
      season: "Spring to Autumn",
      icon: <Route className="h-6 w-6" />
    },
    {
      title: "Skiing & Snowboarding",
      description: "Winter sports at Pertouli Ski Center with modern facilities",
      difficulty: "All Levels",
      duration: "Full Day",
      season: "Winter",
      icon: <Snowflake className="h-6 w-6" />
    },
    {
      title: "Nature Photography",
      description: "Capture stunning landscapes, wildlife, and seasonal changes",
      difficulty: "Easy",
      duration: "Flexible",
      season: "Year Round",
      icon: <Camera className="h-6 w-6" />
    },
    {
      title: "Forest Walks",
      description: "Peaceful walks through ancient pine and fir forests",
      difficulty: "Easy",
      duration: "1-3 hours",
      season: "Year Round",
      icon: <Trees className="h-6 w-6" />
    }
  ];

  const practicalInfo = [
    {
      title: "Distance from Trikala",
      value: "45 km (28 miles)",
      icon: <Car className="h-5 w-5" />
    },
    {
      title: "Driving Time",
      value: "45-60 minutes",
      icon: <Clock className="h-5 w-5" />
    },
    {
      title: "Elevation",
      value: "1,150m above sea level",
      icon: <Mountain className="h-5 w-5" />
    },
    {
      title: "Best Months",
      value: "May - October",
      icon: <Calendar className="h-5 w-5" />
    }
  ];

  const seasonalGuide = [
    {
      season: "Spring (March-May)",
      description: "Wildflowers bloom, mild temperatures, perfect for hiking",
      temperature: "10-20°C",
      highlights: ["Blooming meadows", "Mild weather", "Clear trails"],
      icon: <Leaf className="h-6 w-6 text-green-500" />
    },
    {
      season: "Summer (June-August)",
      description: "Warm days, cool evenings, ideal for all outdoor activities",
      temperature: "15-25°C",
      highlights: ["Perfect hiking weather", "Long daylight hours", "Cool mountain air"],
      icon: <Sun className="h-6 w-6 text-yellow-500" />
    },
    {
      season: "Autumn (September-November)",
      description: "Stunning fall colors, crisp air, excellent photography",
      temperature: "5-18°C",
      highlights: ["Fall foliage", "Clear mountain views", "Comfortable temperatures"],
      icon: <Leaf className="h-6 w-6 text-orange-500" />
    },
    {
      season: "Winter (December-February)",
      description: "Snow-covered landscapes, skiing, winter sports",
      temperature: "-5 to 8°C",
      highlights: ["Skiing & snowboarding", "Winter landscapes", "Cozy mountain lodges"],
      icon: <Snowflake className="h-6 w-6 text-blue-500" />
    }
  ];

  const trails = [
    {
      name: "Pertouli Forest Trail",
      difficulty: "Easy",
      distance: "3 km",
      duration: "1.5 hours",
      description: "Gentle walk through dense pine forest with interpretive signs"
    },
    {
      name: "Alpine Meadow Circuit",
      difficulty: "Moderate",
      distance: "8 km",
      duration: "3-4 hours",
      description: "Loop trail through meadows with panoramic mountain views"
    },
    {
      name: "Summit Trail",
      difficulty: "Hard",
      distance: "12 km",
      duration: "5-6 hours",
      description: "Challenging hike to mountain peaks with spectacular vistas"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Elati & Pertouli Guide - Mountain Villages Near Meteora | Habitat Lobby</title>
        <meta name="description" content="Discover Elati & Pertouli villages - alpine escapes, hiking trails, skiing, traditional cuisine and mountain adventures near Meteora. Complete guide with seasonal tips and village information." />
        <meta name="keywords" content="Elati, Pertouli, mountain villages, Meteora, Trikala, Greece, alpine, hiking, skiing, traditional villages, Pindos" />
      </Helmet>

      <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        {/* Header */}
        <section className="relative py-20 bg-gradient-to-r from-green-600 to-emerald-700 text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${pertouliHeader})` }}
          ></div>
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
              <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6">
                Elati & Pertouli Guide
              </h1>
              <p className="text-xl md:text-2xl text-green-100 mb-8 leading-relaxed">
                Mountain villages, alpine meadows, and ancient forests - gateways to Pindos wilderness near Meteora
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Mountain className="h-4 w-4 mr-2" />
                  1,150m Elevation
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Car className="h-4 w-4 mr-2" />
                  45 min from Trikala
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Trees className="h-4 w-4 mr-2" />
                  Ancient Pine Forest
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Info */}
        <section className="py-16">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {practicalInfo.map((info, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-3">
                      <div className="p-3 bg-green-100 rounded-full text-green-600">
                        {info.icon}
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">{info.title}</h3>
                    <p className="text-sm text-gray-600">{info.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Activities */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Activities & Adventures
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From gentle forest walks to challenging mountain hikes, Pertouli offers outdoor activities for every level
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activities.map((activity, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-green-100 rounded-lg text-green-600">
                        {activity.icon}
                      </div>
                      <h3 className="font-semibold text-lg">{activity.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{activity.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Difficulty:</span>
                        <span className="font-medium">{activity.difficulty}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Duration:</span>
                        <span className="font-medium">{activity.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Best Season:</span>
                        <span className="font-medium">{activity.season}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Seasonal Guide */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Seasonal Guide
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Each season brings its own magic to Pertouli Forest
              </p>
            </div>



            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {seasonalGuide.map((season, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      {season.icon}
                      <h3 className="font-semibold text-xl">{season.season}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{season.description}</p>
                    <div className="flex items-center gap-2 mb-4">
                      <Thermometer className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">{season.temperature}</span>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-700">Highlights:</h4>
                      <ul className="space-y-1">
                        {season.highlights.map((highlight, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                            <Star className="h-3 w-3 text-green-500" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Trails */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Popular Hiking Trails
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Well-marked trails for every fitness level and time commitment
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {trails.map((trail, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-3">{trail.name}</h3>
                    <p className="text-gray-600 mb-4">{trail.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Difficulty:</span>
                        <Badge variant={trail.difficulty === 'Easy' ? 'secondary' : trail.difficulty === 'Moderate' ? 'default' : 'destructive'}>
                          {trail.difficulty}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Distance:</span>
                        <span className="font-medium">{trail.distance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Duration:</span>
                        <span className="font-medium">{trail.duration}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Villages Section */}
        <section className="py-16 bg-gradient-to-b from-green-50 to-blue-50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Elati & Pertouli Villages
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Mountain escapes near Meteora - gateways to the south Pindos wilderness
              </p>
            </div>

            {/* Introduction */}
            <div className="max-w-4xl mx-auto mb-16">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    Just an hour's scenic drive from Meteora lies a different kind of wonder — the lush forests,
                    rolling meadows, and alpine charm of Elati and Pertouli. These highland villages are gateways
                    to the south Pindos wilderness, perfect for year-round escapes, whether you seek snow,
                    wildflowers, or forested hiking trails.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Built on the slopes of Mt Koziakas, these picturesque villages remain among the oldest and
                    most beautiful mountain resorts in Greece, offering a variety of accommodation choices and
                    traditional taverns to suit all needs.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Why Visit */}
            <div className="mb-16">
              <h3 className="font-serif text-2xl font-bold text-center mb-8">Why Add Elati & Pertouli to Your Meteora Trip</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Car className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold mb-2">Easy Access</h4>
                    <p className="text-sm text-gray-600">Just 50-60 km from Kalabaka - perfect for day trips</p>
                  </CardContent>
                </Card>
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mountain className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold mb-2">Change of Pace</h4>
                    <p className="text-sm text-gray-600">Refreshing contrast to Meteora's rocky landscape</p>
                  </CardContent>
                </Card>
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Camera className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold mb-2">Photography</h4>
                    <p className="text-sm text-gray-600">Stunning landscapes and wildlife photography</p>
                  </CardContent>
                </Card>
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trees className="h-6 w-6 text-orange-600" />
                    </div>
                    <h4 className="font-semibold mb-2">Nature Escapes</h4>
                    <p className="text-sm text-gray-600">Perfect after monastery tours and city exploration</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Village Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Elati Village */}
              <Card className="border-0 shadow-lg overflow-hidden">
                <div className="h-48 relative">
                  <img
                    src={elatiImage}
                    alt="Elati Village"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30"></div>
                  <div className="absolute bottom-4 left-6 text-white">
                    <h3 className="font-serif text-2xl font-bold">Elati Village</h3>
                    <p className="text-green-100">950m altitude • 34km from Trikala</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    The largest mountainous village in the Trikala district and the most touristic.
                    Perched on Mt Koziakas slopes, Elati offers all the joys of a mountain holiday
                    with Alpine-quality landscapes and traditional cuisine.
                  </p>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Popular Activities:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <Route className="h-4 w-4 text-green-500" />
                        Hiking on well-marked trails
                      </li>
                      <li className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-green-500" />
                        Visiting Monastery of Agios Vissarionas
                      </li>
                      <li className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-green-500" />
                        Local game and mushroom cuisine
                      </li>
                      <li className="flex items-center gap-2">
                        <Snowflake className="h-4 w-4 text-green-500" />
                        Winter sports and romantic getaways
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Pertouli Village */}
              <Card className="border-0 shadow-lg overflow-hidden">
                <div className="h-48 relative">
                  <img
                    src={pertouliImage}
                    alt="Pertouli Village"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30"></div>
                  <div className="absolute bottom-4 left-6 text-white">
                    <h3 className="font-serif text-2xl font-bold">Pertouli Village</h3>
                    <p className="text-blue-100">1,090m altitude • 54km from Trikala</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Built amphitheater-style among thick woods and green fields. Once a farmers'
                    meeting point, now a premier winter destination with scenic stone houses,
                    ski resort, and excellent tourist infrastructure.
                  </p>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Unique Features:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <Mountain className="h-4 w-4 text-blue-500" />
                        Pertouli Fields with rich fauna & flora
                      </li>
                      <li className="flex items-center gap-2">
                        <Route className="h-4 w-4 text-blue-500" />
                        Access to Chatzipetros refuge (1,738m)
                      </li>
                      <li className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        Sarakatsanaioi annual meeting (May)
                      </li>
                      <li className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-blue-500" />
                        Horseback riding & ATV tours
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Nearby Villages */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Nearby Villages & Attractions
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover the rich traditions and Byzantine heritage of the surrounding area
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">Aspropotamos</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Where the river Acheloos springs, offering pristine natural beauty and
                    crystal-clear mountain waters.
                  </p>
                  <Badge variant="outline" className="text-xs">
                    <MapPin className="h-3 w-3 mr-1" />
                    Beyond Pertouli
                  </Badge>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">Doliana Village</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Home to the 18th-century Monastery of the Holy Cross, famous for
                    its unique architecture with 13 domes.
                  </p>
                  <Badge variant="outline" className="text-xs">
                    <Star className="h-3 w-3 mr-1" />
                    Historic Site
                  </Badge>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">Pyli Village</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Features the Byzantine church of Porta Panagia with famous mosaics
                    and a historic stone bridge from 1514.
                  </p>
                  <Badge variant="outline" className="text-xs">
                    <Star className="h-3 w-3 mr-1" />
                    Byzantine Monument
                  </Badge>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <Card className="max-w-2xl mx-auto border-0 bg-gradient-to-r from-amber-50 to-orange-50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">Traditional Villages to Explore</h3>
                  <p className="text-gray-700 mb-4">
                    The whole area is rich with gorgeous little villages, all steeped in traditions
                    and offering mouthwatering gastronomy.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Badge variant="secondary">Dessi</Badge>
                    <Badge variant="secondary">Pyrra</Badge>
                    <Badge variant="secondary">Doliana</Badge>
                    <Badge variant="secondary">Pyli</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Getting There */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Getting to Pertouli & Elati
                </h2>
                <p className="text-xl text-gray-600">
                  Easy access from Trikala with scenic mountain roads
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Car className="h-5 w-5" />
                      By Car
                    </h3>
                    <div className="space-y-3 text-sm">
                      <p><strong>Route to Elati:</strong> Trikala → Pyli → Elati (34 km)</p>
                      <p><strong>Route to Pertouli:</strong> Trikala → Pyli → Pertouli (54 km)</p>
                      <p><strong>Time:</strong> 45-60 minutes to Elati, 60-75 minutes to Pertouli</p>
                      <p><strong>Road Conditions:</strong> Well-maintained mountain roads with scenic views</p>
                      <p><strong>Parking:</strong> Free parking available in both villages and at trailheads</p>
                      <p><strong>Note:</strong> The stone bridge in Pyli (built 1514) was historically the only passage from Thessaly to South Pindos</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      What to Bring
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>• Comfortable hiking shoes</p>
                      <p>• Weather-appropriate clothing</p>
                      <p>• Water and snacks</p>
                      <p>• Camera for stunning views</p>
                      <p>• Map or GPS device</p>
                      <p>• First aid kit</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
          <div className="container text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Plan Your Mountain Adventure
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Stay at Habitat Lobby and explore the alpine beauty of Elati & Pertouli villages
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                <Link to="/#apartments">Book Your Stay</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <a href="https://maps.google.com/directions/trikala/elati" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Directions to Elati
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <a href="https://maps.google.com/directions/trikala/pertouli" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Directions to Pertouli
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default PertouliGuide;
