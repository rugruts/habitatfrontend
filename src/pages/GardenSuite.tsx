import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ImageGallery } from "@/components/ui/image-gallery";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { StickyMobileCTA } from "@/components/ui/sticky-mobile-cta";

import {
  Wifi,
  Snowflake,
  ChefHat,
  Building2,
  Star,
  Users,
  Bed,
  Bath,
  ArrowLeft,
  Calendar,
  Clock,
  Shield,
  Check,
  TreePine,
  Utensils,
  Phone,
  Mail,
  Wind,
  Tv,
  Sofa,
  Coffee,
  Leaf,
  Sun,
  MapPin
} from "lucide-react";
import BookingBar from "@/components/BookingBar";
import { BookingWidget } from "@/components/BookingWidget";
import Footer from "@/components/Footer";
import { realAttractions } from "@/data/apartments";

// Import apartment 1 photos
import apt1Photo1 from "@/assets/appartment 1/PHOTO-2025-03-23-13-13-42.jpg";
import apt1Photo2 from "@/assets/appartment 1/PHOTO-2025-03-23-13-17-19.jpg";
import apt1Photo3 from "@/assets/appartment 1/PHOTO-2025-03-23-13-17-41.jpg";
import apt1Photo4 from "@/assets/appartment 1/PHOTO-2025-03-23-13-17-57.jpg";
import apt1Photo5 from "@/assets/appartment 1/PHOTO-2025-03-23-13-18-06.jpg";
import apt1Photo6 from "@/assets/appartment 1/PHOTO-2025-03-23-13-18-14.jpg";
import apt1Photo7 from "@/assets/appartment 1/PHOTO-2025-03-23-13-18-21.jpg";
import apt1Photo8 from "@/assets/appartment 1/PHOTO-2025-03-23-13-18-29.jpg";
import apt1Photo9 from "@/assets/appartment 1/PHOTO-2025-03-23-13-18-38.jpg";
import apt1Photo10 from "@/assets/appartment 1/PHOTO-2025-03-23-13-18-46.jpg";
import apt1Photo11 from "@/assets/appartment 1/PHOTO-2025-03-23-13-19-08.jpg";

const Apartment1: React.FC = () => {
  const apartment = {
    slug: "apartment-1",
    name: "Apartment 1 – 1-Bedroom Apartment with Views",
    location: "Trikala Center, Greece",
    rating: 4.8,
    reviewCount: 32,
    short: "Bright, stylish retreat with balcony and sweeping views of the garden, mountains, city, and nearby landmarks — right in the heart of Trikala.",
    description: "Step into your private city sanctuary. Apartment 1 offers 50 m² of thoughtfully designed comfort, combining modern amenities with a warm, welcoming atmosphere. Featuring a private entrance, a spacious living room with a sofa bed, a separate bedroom with a large double bed, and a modern bathroom with a walk-in shower, it's the ideal base for couples, friends, or small families.",
    longDescription: "A fully equipped kitchen makes home cooking a pleasure — with stovetop, oven, microwave, refrigerator, coffee machine, electric kettle, and all essential cookware. You'll also find a washing machine for longer stays. Enjoy your morning coffee or evening wine on the private balcony or terrace while taking in views of the garden, the old city, the mountains, and notable local landmarks. Whether you're exploring Meteora, cycling along the Lithaios River, or discovering Trikala's hidden corners, you'll love coming back to this peaceful retreat.",
    pricePerNight: 95,
    maxGuests: 4,
    bedrooms: 1,
    bathrooms: 1,
    size: "50 m²",
    checkIn: "15:00",
    checkOut: "11:00",
    minStay: 2,
    images: [
      apt1Photo11, // PHOTO-2025-03-23-13-19-08 - Main hero image
      apt1Photo1,
      apt1Photo2,
      apt1Photo3,
      apt1Photo4,
      apt1Photo5,
      apt1Photo6,
      apt1Photo7,
      apt1Photo8,
      apt1Photo9,
      apt1Photo10
    ],
    amenities: {
      essential: [
        { icon: Wifi, name: "Free high-speed Wi-Fi", description: "Reliable for work & streaming" },
        { icon: Wind, name: "Air conditioning & individual temperature control", description: "Climate comfort year-round" },
        { icon: Tv, name: "Flat-screen Smart TV", description: "Entertainment system" },
        { icon: Bed, name: "Premium organic cotton linens & plush towels", description: "Luxury comfort" },
        { icon: Bath, name: "Complimentary toiletries", description: "Essential bathroom amenities" },
        { icon: Snowflake, name: "Private bathroom with walk-in shower & hairdryer", description: "Modern bathroom facilities" },
        { icon: Building2, name: "Washing machine", description: "Convenience for longer stays" }
      ],
      kitchen: [
        { icon: ChefHat, name: "Refrigerator", description: "Full-size refrigerator" },
        { icon: ChefHat, name: "Stovetop", description: "Electric cooking surface" },
        { icon: ChefHat, name: "Oven", description: "Built-in oven" },
        { icon: ChefHat, name: "Microwave", description: "Microwave oven" },
        { icon: Coffee, name: "Coffee machine", description: "Coffee maker" },
        { icon: Coffee, name: "Electric kettle", description: "Hot water kettle" },
        { icon: Utensils, name: "Dining table", description: "Dining area" },
        { icon: Utensils, name: "Cookware & kitchenware", description: "Complete cooking utensils" }
      ],
      bathroom: [
        { icon: Bath, name: "Toiletries", description: "Complimentary toiletries" },
        { icon: Bath, name: "Towels / bed linen", description: "Fresh linens provided" },
        { icon: Wind, name: "Hairdryer", description: "Hair styling tool" },
        { icon: Bath, name: "Toilet paper", description: "Essential supplies" }
      ],
      outdoor: [
        { icon: TreePine, name: "Balcony", description: "Private outdoor space" },
        { icon: Sun, name: "Terrace", description: "Additional outdoor area" },
        { icon: TreePine, name: "Garden, mountain, city & landmark views", description: "Sweeping panoramic views" }
      ]
    },
    highlights: [
      "Private entrance for complete privacy",
      "Balcony & terrace with garden, mountain, city, and landmark views",
      "Large windows filling the space with natural light all day",
      "Walking distance to all major Trikala attractions",
      "Fully equipped kitchen with modern appliances",
      "Washing machine for convenience on longer stays",
      "Individually controlled air-conditioning and heating"
    ],
    nearbyAttractions: realAttractions,
    policies: {
      cancellation: "Free cancellation up to 48 hours before arrival",
      smoking: "No smoking inside the property",
      pets: "Small pets welcome upon prior approval",
      parties: "No parties or events allowed"
    }
  };

  const breadcrumbItems = [
    { label: "Apartments", href: "/apartments" },
    { label: "Apartment 1 – 1-Bedroom with Views", current: true }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>{apartment.name} - Boutique Apartment in Trikala | Habitat Lobby</title>
        <meta name="description" content={`${apartment.description} Book direct for best rates and local tips.`} />
        <link rel="canonical" href={`https://habitat-lobby.lovable.app/apartments/${apartment.slug}`} />
      </Helmet>

      {/* Navigation Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/apartments">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Apartments
                </Link>
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <BreadcrumbNav items={breadcrumbItems} />
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="font-semibold">{apartment.rating}</span>
              <span>({apartment.reviewCount} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-12">

        {/* Hero Section */}
        <section className="space-y-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Property Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="font-serif text-4xl md:text-5xl text-primary mb-4">{apartment.name}</h1>
                <p className="text-xl text-muted-foreground leading-relaxed mb-6">{apartment.short}</p>

                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-accent text-accent" />
                    <span className="font-semibold text-lg">{apartment.rating}</span>
                    <span className="text-muted-foreground">({apartment.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{apartment.location}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-accent/5 rounded-lg">
                    <Users className="h-6 w-6 mx-auto mb-2 text-accent" />
                    <div className="font-semibold">{apartment.maxGuests}</div>
                    <div className="text-sm text-muted-foreground">Guests</div>
                  </div>
                  <div className="text-center p-4 bg-accent/5 rounded-lg">
                    <Bed className="h-6 w-6 mx-auto mb-2 text-accent" />
                    <div className="font-semibold">{apartment.bedrooms}</div>
                    <div className="text-sm text-muted-foreground">Bedroom</div>
                  </div>
                  <div className="text-center p-4 bg-accent/5 rounded-lg">
                    <Bath className="h-6 w-6 mx-auto mb-2 text-accent" />
                    <div className="font-semibold">{apartment.bathrooms}</div>
                    <div className="text-sm text-muted-foreground">Bathroom</div>
                  </div>
                  <div className="text-center p-4 bg-accent/5 rounded-lg">
                    <TreePine className="h-6 w-6 mx-auto mb-2 text-accent" />
                    <div className="font-semibold">{apartment.size}</div>
                    <div className="text-sm text-muted-foreground">Size</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Widget (interactive) */}
            <div className="lg:col-span-1">
              <BookingWidget unitSlug="apartment-1" />
            </div>
          </div>
        </section>

        {/* Image Gallery */}
        <section>
          <ImageGallery
            images={apartment.images}
            alt={apartment.name}
            aspectRatio="video"
            className="rounded-xl overflow-hidden"
          />
        </section>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Primary Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <section className="space-y-6">
              <div>
                <h2 className="font-serif text-3xl text-primary mb-4">About This Space</h2>
                <p className="text-lg leading-relaxed text-foreground mb-6">
                  {apartment.description}
                </p>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {apartment.longDescription}
                </p>
              </div>
            </section>

            {/* Highlights */}
            <section className="space-y-6">
              <h2 className="font-serif text-3xl text-primary mb-6">What Makes This Special</h2>
              <div className="grid gap-4">
                {apartment.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-4 p-6 bg-white border border-accent/10 rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0 w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-foreground font-medium leading-relaxed">{highlight}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Amenities */}
            <section className="space-y-8">
              <h2 className="font-serif text-3xl text-primary mb-6">Amenities & Features</h2>

              {/* Essential Amenities */}
              <div>
                <h3 className="font-semibold text-lg mb-4 text-foreground">Essential</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {apartment.amenities.essential.map((amenity, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-accent/5 rounded-lg">
                      <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <amenity.icon className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{amenity.name}</h4>
                        <p className="text-sm text-muted-foreground">{amenity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kitchen Amenities */}
              <div>
                <h3 className="font-semibold text-lg mb-4 text-foreground">Kitchen</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {apartment.amenities.kitchen.map((amenity, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-accent/5 rounded-lg">
                      <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <amenity.icon className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{amenity.name}</h4>
                        <p className="text-sm text-muted-foreground">{amenity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bathroom Amenities */}
              <div>
                <h3 className="font-semibold text-lg mb-4 text-foreground">Bathroom</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {apartment.amenities.bathroom.map((amenity, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-accent/5 rounded-lg">
                      <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <amenity.icon className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{amenity.name}</h4>
                        <p className="text-sm text-muted-foreground">{amenity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Outdoor Amenities */}
              <div>
                <h3 className="font-semibold text-lg mb-4 text-foreground">Outdoor</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {apartment.amenities.outdoor.map((amenity, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-accent/5 rounded-lg">
                      <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <amenity.icon className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{amenity.name}</h4>
                        <p className="text-sm text-muted-foreground">{amenity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Property Details */}
            <Card className="border-accent/20 shadow-sm">
              <CardContent className="p-6 space-y-6">
                <h3 className="font-serif text-xl text-primary">Property Details</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-accent/10">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium">Minimum stay</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{apartment.minStay} nights</span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-accent/10">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium">Check-in</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{apartment.checkIn}</span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-accent/10">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium">Check-out</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{apartment.checkOut}</span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-accent/10">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium">Check-in type</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Self check-in</span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium">Capacity</span>
                    </div>
                    <span className="text-sm text-muted-foreground">up to 4 guests (1 double bed + 1 sofa bed)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location & Attractions */}
            <Card className="border-accent/20 shadow-sm">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-serif text-xl text-primary mb-4">Location</h3>

                  {/* Simple embedded map */}
                  <div className="mb-6">
                    <iframe
                      src="https://www.openstreetmap.org/export/embed.html?bbox=21.755%2C39.543%2C21.770%2C39.553&layer=mapnik&marker=39.548363017220765%2C21.76272641054368"
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Property Location"
                      className="w-full rounded-lg"
                    />
                  </div>

                  {/* Nearby Attractions */}
                  <div>
                    <h4 className="font-medium text-lg text-primary mb-4">Nearby Attractions</h4>
                    <div className="space-y-4">
                      {apartment.nearbyAttractions.map((attraction, index) => (
                        <div key={index} className="flex items-center justify-between py-3 border-b border-accent/10 last:border-0">
                          <div>
                            <div className="font-medium text-sm text-foreground">{attraction.name}</div>
                            <div className="text-xs text-muted-foreground capitalize">{attraction.type}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-accent">{attraction.distance}</div>
                            <div className="text-xs text-muted-foreground">{attraction.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>


              </CardContent>
            </Card>

            {/* Perfect For */}
            <Card className="border-accent/20 shadow-sm bg-accent/5">
              <CardContent className="p-6 space-y-6">
                <h3 className="font-serif text-xl text-primary">Perfect For</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Leaf className="h-5 w-5 text-accent mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">Romantic Getaways</h4>
                      <p className="text-xs text-muted-foreground">Intimate space with garden views</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Coffee className="h-5 w-5 text-accent mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">Slow Travel</h4>
                      <p className="text-xs text-muted-foreground">Peaceful retreat for relaxation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Sun className="h-5 w-5 text-accent mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">Morning People</h4>
                      <p className="text-xs text-muted-foreground">Beautiful natural light all day</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Host */}
            <Card className="border-accent/20 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-serif text-xl text-primary">Contact Host</h3>
                <p className="text-sm text-muted-foreground">
                  Have questions? Our local team is here to help make your stay perfect.
                </p>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Host
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Policies */}
        <section className="bg-accent/5 rounded-xl p-8 space-y-6">
          <h2 className="font-serif text-2xl text-primary">House Rules & Policies</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-accent mt-1 flex-shrink-0" />
                <span className="text-sm">{apartment.policies.cancellation}</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-accent mt-1 flex-shrink-0" />
                <span className="text-sm">{apartment.policies.pets}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-accent mt-1 flex-shrink-0" />
                <span className="text-sm">{apartment.policies.smoking}</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-accent mt-1 flex-shrink-0" />
                <span className="text-sm">{apartment.policies.parties}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Final Booking CTA */}
        <section className="relative bg-gradient-to-br from-primary via-primary to-primary/90 text-white rounded-3xl p-8 md:p-12 text-center space-y-8 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full -translate-y-8"></div>
          </div>

          <div className="relative z-10">
            <h2 className="font-serif text-4xl md:text-5xl mb-4 leading-tight">Ready to Experience Apartment 1?</h2>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed font-light">
              Enjoy modern comfort with stunning views in the heart of Trikala. Book direct for the best rates and personalized local recommendations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto mt-8">
              <Button asChild variant="accent" size="lg" className="flex-1 h-14 text-lg font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300">
                <Link to="/check-availability/apartment-1">
                  Check Availability - €{apartment.pricePerNight}/night
                </Link>
              </Button>
              <Button asChild size="lg" className="flex-1 h-14 text-lg bg-white text-primary border-2 border-white hover:bg-white/90 hover:text-primary font-semibold transition-all duration-300 shadow-lg">
                <Link to="#amenities">
                  View Details
                </Link>
              </Button>
            </div>

            {/* Enhanced Trust Badges */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <Shield className="h-5 w-5 text-green-300" />
                <span className="text-sm font-medium">Free cancellation up to 48h</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <Check className="h-5 w-5 text-green-300" />
                <span className="text-sm font-medium">Best rate guarantee</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <Clock className="h-5 w-5 text-green-300" />
                <span className="text-sm font-medium">Instant confirmation</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />

      {/* Enhanced Mobile CTA */}
      <StickyMobileCTA href="#booking">
        Reserve Apartment 1 - €{apartment.pricePerNight}/night
      </StickyMobileCTA>
    </div>
  );
};

export default Apartment1;
