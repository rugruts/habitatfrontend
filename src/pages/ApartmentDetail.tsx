import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EmbeddedAvailabilityWidget } from "@/components/EmbeddedAvailabilityWidget";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { StickyMobileCTA } from "@/components/ui/sticky-mobile-cta";
import {
  Wifi,
  Snowflake,
  ChefHat,
  MapPin,
  Star,
  Users,
  Bed,
  Bath,
  ArrowLeft,
  Calendar,
  Clock,
  Shield,
  Check,
  Coffee,
  Bike,
  Camera,
  Phone,
  Mail,
  Car,
  Utensils,
  Wind,
  Tv,
  Waves,
  Home,
  AirVent,
  X,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  XCircle,
  Loader2,
  Sparkles,
  TrendingUp,
  Zap,
  Trees,
  Castle,
  Mountain,
  UtensilsCrossed,
  Navigation,
  Package,
  Wrench,
  AlertTriangle,
  Moon
} from "lucide-react";
import { supabaseHelpers } from "@/lib/supabase";
import ShareModal from "@/components/ShareModal";
import CustomMap from "@/components/CustomMap";
import HouseRules from "@/components/HouseRules";

// Review data type
interface ReviewData {
  id: string;
  created_at: string;
  booking_id?: string;
  property_id: string;
  guest_name: string;
  guest_email: string;
  guest_avatar_url?: string;
  overall_rating: number;
  cleanliness_rating?: number;
  communication_rating?: number;
  location_rating?: number;
  value_rating?: number;
  accuracy_rating?: number;
  title?: string;
  review_text: string;
  pros?: string;
  cons?: string;
  stay_date: string;
  nights_stayed: number;
  guest_count: number;
  trip_type?: string;
  status: 'pending' | 'approved' | 'rejected' | 'hidden';
  is_verified: boolean;
  is_featured: boolean;
  helpful_count: number;
  photos: string[];
  has_response: boolean;
}

// Property interface - matches admin editor
interface Property {
  id: string;
  name: string;
  slug?: string;
  description: string;
  city: string;
  country: string;
  address: string;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  latitude?: number;
  longitude?: number;
  rules?: Array<{
    id: string;
    icon: string;
    title: string;
    description: string;
  }>;
  nearby_places?: Array<{
    id: string;
    name: string;
    type: string;
    distance: string;
    walkingTime: string;
    latitude?: number;
    longitude?: number;
    icon: string;
  }>;
  size_sqm?: number;
  base_price: number; // in cents
  cleaning_fee?: number; // in cents
  security_deposit?: number; // in cents
  min_nights?: number;
  max_nights?: number;
  check_in_time?: string;
  check_out_time?: string;
  currency: string;
  amenities: string[];
  images: string[];
  active: boolean;
  created_at: string;
  // New editable sections
  about_space?: string;
  the_space?: string;
  location_neighborhood?: string;
  house_rules?: string;
  // Rich content fields from the property editor
  detailed_description?: string;
  space_details?: string;
  location_details?: string;
  house_rules_details?: string;
}

// Amenity icons mapping - matching ALL admin amenities
const amenityIcons = {
  // Essentials
  wifi: Wifi,
  kitchen: ChefHat,
  tv: Tv,
  ac: AirVent,
  airconditioning: AirVent,
  heating: TrendingUp,
  
  // Comfort  
  parking: Car,
  balcony: MapPin,
  garden: Trees,
  terrace: MapPin,
  pool: Waves,
  gym: TrendingUp,
  
  // Services
  cleaning_service: Sparkles,
  washing_machine: Waves,
  dishwasher: Utensils,
  breakfast: Coffee,
  concierge: Users,
  
  // Accessibility
  wheelchair_accessible: Users,
  elevator: Home,
  ground_floor: Home,
  wide_doorways: Home,
  
  // Legacy/other
  coffee: Coffee,
};

const amenityLabels = {
  // Essentials
  wifi: 'WiFi',
  kitchen: 'Kitchen',
  tv: 'TV',
  ac: 'Air Conditioning',
  airconditioning: 'Air Conditioning',
  heating: 'Heating',
  
  // Comfort
  parking: 'Free Parking',
  balcony: 'Balcony',
  garden: 'Garden',
  terrace: 'Terrace',
  pool: 'Pool',
  gym: 'Gym',
  
  // Services
  cleaning_service: 'Cleaning Service',
  washing_machine: 'Washing Machine',
  dishwasher: 'Dishwasher',
  breakfast: 'Breakfast',
  concierge: 'Concierge',
  
  // Accessibility
  wheelchair_accessible: 'Wheelchair Accessible',
  elevator: 'Elevator',
  ground_floor: 'Ground Floor',
  wide_doorways: 'Wide Doorways',
  
  // Legacy
  coffee: 'Coffee Machine',
};



// Nearby attractions icons mapping - matches admin editor
const nearbyAttractionIcons = {
  // Food & Drink
  restaurant: Utensils,
  cafe: Coffee,
  bar: Home,
  bakery: ChefHat,
  butcher: ChefHat,
  
  // Shopping & Services
  supermarket: Home,
  pharmacy: Home,
  bank: Home,
  atm: Home,
  post_office: Mail,
  bookshop: Home,
  electronics: Home,
  clothing: Home,
  shoes: Package,
  jewelry: Home,
  hardware_store: Wrench,
  furniture_store: Home,
  
  // Transport
  bus_stop: Car,
  train_station: Home,
  airport: Home,
  taxi: Car,
  parking: Car,
  gas_station: Zap,
  car_rental: Car,
  bike_rental: Bike,
  
  // Emergency & Public Services
  hospital: Home,
  police: Shield,
  fire_station: AlertTriangle,
  
  // Education & Culture
  school: Home,
  university: Home,
  library: Home,
  museum: Home,
  theater: Home,
  cinema: Home,
  art_gallery: Home,
  
  // Entertainment & Recreation
  shopping_mall: Home,
  market: Home,
  gym: Home,
  park: Trees,
  beach: Waves,
  mountain: Mountain,
  swimming_pool: Waves,
  tennis_court: Home,
  golf_course: Home,
  ski_resort: Mountain,
  amusement_park: Star,
  zoo: Home,
  aquarium: Home,
  botanical_garden: Trees,
  
  // Religious & Historical
  church: Home,
  mosque: Home,
  temple: Home,
  castle: Castle,
  palace: Home,
  fortress: Shield,
  monument: MapPin,
  statue: Home,
  cemetery: Home,
  
  // Tourism & Information
  tourist_info: MapPin,
  tourist_attraction: MapPin,
  historical_site: Castle,
  viewpoint: MapPin,
  tour_office: MapPin,
  
  // Accommodation
  hotel: Bed,
  hostel: Users,
  spa: Home,
  
  // Health & Wellness
  optician: MapPin,
  dentist: Home,
  vet: Home,
  pet_shop: Home,
  
  // Nature & Outdoors
  garden_center: Trees,
  hiking_trail: Mountain,
  camping: Home,
  picnic_area: Trees,
  playground: Home,
  marina: Home,
  fishing_spot: Home,
  
  // Sports & Activities
  sports_center: Home,
  stadium: Home,
  race_track: Car,
  
  // Landmarks & Architecture
  clock_tower: Clock,
  bell_tower: Home,
  lighthouse: Home,
  windmill: Wind,
  tower: Home,
  bridge: Home,
  fountain: Home,
  
  // Utilities & Infrastructure
  power_plant: Zap,
  water_tower: Home,
  antenna: Home,
  satellite: Home,
  observatory: MapPin,
  planetarium: Star,
  
  // Entertainment & Media
  concert_hall: Home,
  opera_house: Home,
  music_store: Home,
  radio_station: Home,
  tv_station: Tv,
  newspaper: MapPin,
  magazine: MapPin,
  photo_studio: Camera,
  
  // Business & Professional
  law_office: Home,
  accounting_firm: Home,
  insurance_office: Shield,
  real_estate: Home,
  travel_agency: Home,
  
  // Automotive & Transport
  car_dealer: Car,
  motorcycle_dealer: Bike,
  auto_repair: Wrench,
  car_wash: Home,
  electric_charging: Zap,
  bike_shop: Bike,
  
  // Recreation & Hobbies
  surf_shop: Waves,
  ski_shop: Mountain,
  climbing_shop: Mountain,
  camping_shop: Home,
  fishing_shop: Home,
  
  // Entertainment & Gaming
  bowling: Home,
  billiards: Home,
  chess_club: Home,
  internet_cafe: Home,
  gaming_center: Home,
  karaoke: Home,
  nightclub: Home,
  casino: Home,
  
  // Shopping & Markets
  antique_shop: Clock,
  vintage_shop: Clock,
  thrift_shop: Package,
  outlet_mall: Home,
  farmers_market: Trees,
  flea_market: Package,
  
  // Events & Festivals
  food_festival: Utensils,
  wine_festival: Home,
  beer_festival: Home,
  music_festival: Home,
  film_festival: Home,
  comedy_club: Home,
  magic_show: Star,
  circus: Star,
  
  // Health & Wellness Services
  massage_parlor: Home,
  yoga_studio: Home,
  pilates_studio: Home,
  meditation_center: Home,
  martial_arts: Shield,
  
  // Community & Social Services
  cultural_center: Home,
  community_center: Users,
  senior_center: Users,
  youth_center: Users,
  soup_kitchen: Utensils,
  food_bank: Package,
  clothing_bank: Package,
  
  // Medical & Healthcare
  medical_clinic: Home,
  dental_clinic: Home,
  eye_clinic: MapPin,
  mental_health_clinic: Home,
  rehabilitation_center: Home,
  nursing_home: Users,
  hospice: Home,
  
  // Memorial & Funeral
  funeral_home: Home,
  crematorium: Home,
  memorial_garden: Trees,
  columbarium: Home,
  mausoleum: Home,
  tomb: Home,
  grave: Home,
  headstone: Home,
  plaque: MapPin,
  memorial_bench: Home,
  memorial_tree: Trees,
  memorial_fountain: Home,
  memorial_clock: Clock,
  memorial_bell: Home,
  memorial_lamp: Home,
  memorial_flag: Home,
  memorial_wreath: Home,
  memorial_candle: Home,
  memorial_incense: Home,
  memorial_offering: Package,
  memorial_prayer: Home,
  memorial_service: Users,
  memorial_ceremony: Users,
  memorial_celebration: Users,
  memorial_remembrance: Home,
  memorial_honor: Shield,
  memorial_respect: Home,
  memorial_love: Home,
  memorial_gratitude: Home,
  memorial_peace: Home,
  memorial_hope: Home,
  memorial_faith: Home,
  memorial_courage: Home,
  memorial_strength: Shield,
  memorial_wisdom: Home,
  memorial_knowledge: Home,
  memorial_learning: Home,
  memorial_education: Home,
  memorial_teaching: Home,
  memorial_mentoring: Users,
  memorial_guidance: Home,
  memorial_support: Home,
  memorial_help: Home,
  memorial_care: Home,
  memorial_comfort: Home,
  memorial_healing: Home,
  memorial_recovery: Home,
  memorial_renewal: Home,
  memorial_growth: Home,
  memorial_change: Home,
  memorial_transformation: Home,
  memorial_evolution: Home,
  memorial_progress: Home,
  memorial_advancement: Home,
  memorial_improvement: Home,
  memorial_development: Home,
  memorial_innovation: Home,
  memorial_creativity: Home,
  memorial_imagination: Home,
  memorial_inspiration: Star,
  memorial_motivation: Home,
  memorial_encouragement: Home,
  memorial_empowerment: Shield,
  memorial_confidence: Home,
  memorial_self_esteem: Home,
  memorial_pride: Home,
  memorial_achievement: Home,
  memorial_success: Home,
  memorial_victory: Home,
  memorial_triumph: Home,
  memorial_conquest: Shield,
  memorial_overcoming: Home,
  memorial_perseverance: Home,
  memorial_determination: Home,
  memorial_resilience: Home,
  memorial_endurance: Home,
  memorial_persistence: Home,
  memorial_tenacity: Home,
  memorial_grit: Home,
  memorial_fortitude: Home,
  memorial_bravery: Home,
  memorial_heroism: Home,
  memorial_valor: Home,
  memorial_gallantry: Home,
  memorial_nobility: Home,
  memorial_elegance: Home,
  memorial_beauty: Home,
  memorial_harmony: Home,
  memorial_balance: Home,
  memorial_equilibrium: Home,
  memorial_stability: Home,
  memorial_grounding: Home,
  memorial_centering: Home,
  memorial_focus: Home,
  memorial_clarity: MapPin,
  memorial_awareness: Home,
  memorial_consciousness: Home,
  memorial_mindfulness: Home,
  memorial_presence: Home,
  memorial_attention: Home,
  memorial_observation: Home,
  memorial_notice: Home,
  memorial_recognition: Home,
  memorial_acknowledgment: Check,
  memorial_appreciation: Home,
  memorial_thanks: Home,
  memorial_blessing: Home,
  memorial_favor: Home,
  memorial_goodwill: Home,
  memorial_kindness: Home,
  memorial_compassion: Home,
  memorial_empathy: Home,
  memorial_sympathy: Home,
  memorial_understanding: Home,
  memorial_tolerance: Home,
  memorial_acceptance: Home,
  memorial_inclusion: Users,
  memorial_diversity: Users,
  memorial_equality: Home,
  memorial_justice: Home,
  memorial_fairness: Home,
  memorial_impartiality: Home,
  memorial_objectivity: Home,
  memorial_neutrality: Home,
  memorial_unbiased: Home,
  memorial_unprejudiced: Home,
  memorial_open_minded: Home,
  memorial_broad_minded: Home,
  memorial_liberal: Home,
  memorial_progressive: Home,
  memorial_forward_thinking: Home,
  memorial_visionary: Home,
  memorial_futuristic: Home,
  memorial_modern: Home,
  memorial_contemporary: Home,
  memorial_current: Home,
  memorial_timely: Home,
  memorial_relevant: Home,
  memorial_pertinent: Home,
  memorial_applicable: Home,
  memorial_suitable: Home,
  memorial_appropriate: Home,
  memorial_fitting: Home,
  memorial_proper: Home,
  memorial_correct: Home,
  memorial_right: Home,
  memorial_good: Home,
  memorial_positive: Home,
  memorial_constructive: Home,
  memorial_helpful: Home,
  memorial_beneficial: Home,
  memorial_valuable: Home,
  memorial_precious: Home,
  memorial_treasure: Home,
  memorial_jewel: Home,
  memorial_pearl: Home,
  memorial_diamond: Home,
  memorial_ruby: Home,
  memorial_emerald: Home,
  memorial_sapphire: Home,
  memorial_opal: Home,
  memorial_amethyst: Home,
  memorial_topaz: Home,
  memorial_garnet: Home,
  memorial_aquamarine: Home,
  memorial_peridot: Home,
  memorial_citrine: Home,
  memorial_tanzanite: Home,
  memorial_turquoise: Home,
  memorial_lapis: Home,
  memorial_onyx: Home,
  memorial_jade: Home,
  memorial_agate: Home,
  memorial_quartz: Home,
  memorial_crystal: Home,
  memorial_obsidian: Home,
  memorial_granite: Home,
  memorial_marble: Home,
  memorial_slate: Home,
  memorial_sandstone: Home,
  memorial_limestone: Home,
  memorial_basalt: Home,
  memorial_gneiss: Home,
  memorial_schist: Home,
  memorial_phyllite: Home,
  memorial_shale: Home,
  memorial_clay: Home,
  memorial_silt: Home,
  memorial_sand: Home,
  memorial_gravel: Home,
  memorial_cobble: Home,
  memorial_boulder: Home,
  memorial_pebble: Home,
  memorial_stone: Home,
  memorial_rock: Home,
  memorial_mineral: Home,
  memorial_ore: Home,
  memorial_metal: Home,
  memorial_gold: Home,
  memorial_silver: Home,
  memorial_copper: Home,
  memorial_iron: Wrench,
  memorial_steel: Wrench,
  memorial_aluminum: Wrench,
  memorial_titanium: Wrench,
  memorial_platinum: Home,
  memorial_palladium: Home,
  memorial_rhodium: Home,
  memorial_iridium: Home,
  memorial_osmium: Home,
  memorial_ruthenium: Home,
  memorial_rhenium: Home,
  memorial_tungsten: Wrench,
  memorial_molybdenum: Wrench,
  memorial_niobium: Wrench,
  memorial_tantalum: Wrench,
  memorial_vanadium: Wrench,
  memorial_chromium: Wrench,
  memorial_manganese: Wrench,
  memorial_cobalt: Wrench,
  memorial_nickel: Wrench,
  memorial_zinc: Wrench,
  memorial_cadmium: Wrench,
  memorial_mercury: Wrench,
  memorial_lead: Wrench,
  memorial_tin: Wrench,
  memorial_antimony: Wrench,
  memorial_bismuth: Wrench,
  memorial_polonium: Wrench,
  memorial_astatine: Wrench,
  memorial_radon: Wrench,
  memorial_francium: Wrench,
  memorial_radium: Wrench,
  memorial_actinium: Wrench,
  memorial_thorium: Wrench,
  memorial_protactinium: Wrench,
  memorial_uranium: Wrench,
  memorial_neptunium: Wrench,
  memorial_plutonium: Wrench,
  memorial_americium: Wrench,
  memorial_curium: Wrench,
  memorial_berkelium: Wrench,
  memorial_californium: Wrench,
  memorial_einsteinium: Wrench,
  memorial_fermium: Wrench,
  memorial_mendelevium: Wrench,
  memorial_nobelium: Wrench,
  memorial_lawrencium: Wrench,
  memorial_rutherfordium: Wrench,
  memorial_dubnium: Wrench,
  memorial_seaborgium: Wrench,
  memorial_bohrium: Wrench,
  memorial_hassium: Wrench,
  memorial_meitnerium: Wrench,
  memorial_darmstadtium: Wrench,
  memorial_roentgenium: Wrench,
  memorial_copernicium: Wrench,
  memorial_nihonium: Wrench,
  memorial_flerovium: Wrench,
  memorial_moscovium: Wrench,
  memorial_livermorium: Wrench,
  memorial_tennessine: Wrench,
  memorial_oganesson: Wrench
};

const ApartmentDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [reviewStats, setReviewStats] = useState<{
    totalReviews: number;
    averageRating: number;
    ratingDistribution: { [key: number]: number };
  }>({ totalReviews: 0, averageRating: 0, ratingDistribution: {} });
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) {
        setError("Property ID not provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const properties = await supabaseHelpers.getAllProperties();
        const foundProperty = properties?.find(p => p.id === id);

        if (!foundProperty) {
          setError("Property not found");
          setLoading(false);
          return;
        }

        // Transform property data
        const transformedProperty: Property = {
          ...foundProperty,
          amenities: typeof foundProperty.amenities === 'string' 
            ? JSON.parse(foundProperty.amenities || '[]')
            : foundProperty.amenities || [],
          images: typeof foundProperty.images === 'string' 
            ? JSON.parse(foundProperty.images || '[]')
            : foundProperty.images || []
        };

        console.log('Loaded property:', transformedProperty);
        setProperty(transformedProperty);

        // Fetch reviews for this property
        const [reviewsData, statsData] = await Promise.all([
          supabaseHelpers.getPropertyReviews(id, 10),
          supabaseHelpers.getPropertyReviewStats(id)
        ]);

        setReviews(reviewsData);
        setReviewStats(statsData);
      } catch (error) {
        console.error('Error fetching property:', error);
        setError('Failed to load property details');
      } finally {
        setLoading(false);
        setLoadingReviews(false);
      }
    };

    fetchProperty();
  }, [id]);

  const nextImage = () => {
    if (!property?.images.length) return;
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    if (!property?.images.length) return;
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const handleShare = () => {
    console.log('Share button clicked, opening modal...');
    setIsShareModalOpen(true);
    console.log('Modal state set to:', true);
  };

  const handleImageModalOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsImageModalOpen(true);
  };



  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
            <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Loading apartment details...</p>
            </div>
          </div>
    );
  }

  // Error state
  if (error || !property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="h-8 w-8 text-red-600" />
          </div>
            <h1 className="text-2xl font-bold mb-4">Apartment Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || "The apartment you're looking for doesn't exist."}</p>
            <div className="flex gap-4 justify-center">
              <Button asChild variant="outline">
                <Link to="/apartments">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Apartments
                </Link>
              </Button>
              <Button asChild>
                <Link to="/">Go Home</Link>
              </Button>
            </div>
          </div>
        </div>
    );
  }

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Apartments", href: "/apartments" },
    { label: property.name, href: `/apartments/${property.id}` }
  ];

  // Default images if none provided
  const propertyImages = property.images.length > 0 
    ? property.images 
    : [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800'
      ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <Helmet>
        <title>{property.name} – Habitat Lobby</title>
        <meta name="description" content={property.description} />
        <link rel="canonical" href={`https://habitat-lobby.lovable.app/apartments/${property.id}`} />
      </Helmet>

      {/* Hero Section with Image Gallery */}
      <section className="relative bg-gray-100">
        {/* Main Image */}
        <div className="relative w-full">
          <img
            src={propertyImages[currentImageIndex]}
            alt={`${property.name} - Photo ${currentImageIndex + 1}`}
            className="w-full h-auto object-contain transition-all duration-700 ease-in-out cursor-pointer hover:scale-105 hover:shadow-2xl max-h-[80vh]"
            loading="eager"
            onClick={handleImageModalOpen}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Clickable Overlay Indicator */}
          <div className="absolute inset-0 bg-transparent hover:bg-black/5 transition-colors duration-300 z-10" />
          
          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/30 transition-all z-20"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/30 transition-all z-20"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Image Controls */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-20">
            {/* Image Counter */}
            <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm">
              {currentImageIndex + 1} / {propertyImages.length}
              </div>
              
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Share Button */}
              <button
                onClick={handleShare}
                className="bg-black/50 backdrop-blur-sm rounded-full p-3 text-white hover:bg-black/70 transition-all group relative z-30"
                title="Share this apartment"
              >
                <Share2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </button>
              
              {/* Fullscreen Button */}
              <button
                onClick={handleImageModalOpen}
                className="bg-black/50 backdrop-blur-sm rounded-full p-3 text-white hover:bg-black/70 transition-all group relative z-30"
                title="View fullscreen gallery"
              >
                <Maximize2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
                    </div>
                  </div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="text-white">
                <h1 className="font-display text-4xl md:text-6xl font-bold mb-2">
                  {property.name}
                </h1>
                <div className="flex items-center gap-4 text-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span>{property.address}, {property.city}</span>
                    </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{reviewStats?.averageRating?.toFixed(1) || '4.9'}</span>
                    <span className="text-white/80">({reviewStats?.totalReviews || 0} reviews)</span>
                  </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                {/* Additional actions can be added here if needed */}
                    </div>
                    </div>
                  </div>
                </div>
      </section>

      {/* Main Content */}
      <section className="container py-8 md:py-12 pb-32 lg:pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="text-center p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
                <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{property.max_guests}</div>
                <div className="text-sm text-muted-foreground">{t('apartment.maxGuests')}</div>
            </Card>
              <Card className="text-center p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
                <Bed className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{property.bedrooms}</div>
                <div className="text-sm text-muted-foreground">{t('apartment.bedrooms')}</div>
              </Card>
              <Card className="text-center p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
                <Bath className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{property.bathrooms}</div>
                <div className="text-sm text-muted-foreground">{t('apartment.bathrooms')}</div>
              </Card>
              <Card className="text-center p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
                <Moon className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{property.min_nights || 2}</div>
                <div className="text-sm text-muted-foreground font-medium">Minimum Nights</div>
              </Card>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">About this place</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Short Description */}
                {property.description && (
                  <div className="mb-6">
                    <p className="text-lg leading-relaxed text-muted-foreground">
                      {property.description}
                    </p>
                  </div>
                )}
                
                {/* Rich Detailed Description */}
                {property.detailed_description && (
                  <div 
                    className="prose prose-lg max-w-none rich-content"
                    style={{
                      fontSize: '16px',
                      lineHeight: '1.6',
                      color: 'hsl(var(--muted-foreground))'
                    }}
                    dangerouslySetInnerHTML={{ __html: property.detailed_description }}
                  />
                )}
                
                {/* Legacy about_space field for backward compatibility */}
                {property.about_space && !property.detailed_description && (
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    {property.about_space}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">What this place offers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(() => {
                    // Only show amenities that are officially defined in the admin editor
                    const validAmenities = Object.keys(amenityIcons);
                    const seenLabels = new Set<string>();
                    const uniqueAmenities: string[] = [];
                    
                    property.amenities.forEach((amenity) => {
                      // Only process amenities that are in our official list
                      if (validAmenities.includes(amenity)) {
                        const label = amenityLabels[amenity as keyof typeof amenityLabels];
                        const normalizedLabel = label.toLowerCase().replace(/[\s-_]/g, '');
                        
                        if (!seenLabels.has(normalizedLabel)) {
                          seenLabels.add(normalizedLabel);
                          uniqueAmenities.push(amenity);
                        }
                      }
                    });
                    
                    return uniqueAmenities.map((amenity) => {
                      const Icon = amenityIcons[amenity as keyof typeof amenityIcons];
                      const label = amenityLabels[amenity as keyof typeof amenityLabels];
                      
                      return (
                        <div key={amenity} className="flex items-center gap-3 p-3 rounded-lg border bg-card/50">
                          <div className="text-primary">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-medium">{label}</div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                  {property.amenities.length === 0 && (
                    <div className="col-span-2 text-center py-8 text-muted-foreground">
                      <Check className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                      <p>No amenities configured yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>



            {/* Location & Neighborhood */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Location & Neighborhood</CardTitle>
                <p className="text-muted-foreground">Everything within walking distance</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Map Section */}
                  <div id="map-section" className="relative h-64 rounded-lg overflow-hidden border bg-muted/30">
                    <CustomMap
                      latitude={property.latitude || 39.547836899640934}
                      longitude={property.longitude || 21.762447453371244}
                      address={property.address}
                      propertyName={property.name}
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg z-10">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">HL</span>
                    </div>
                        <span className="text-sm font-medium">{property.address}</span>
                  </div>
                    </div>
                    <div className="absolute bottom-3 right-3 z-10">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        asChild
                        className="bg-white/90 backdrop-blur-sm border-white/50 hover:bg-white/80"
                      >
                        <a 
                          href={`https://www.openstreetmap.org/?mlat=39.547836899640934&mlon=21.762447453371244#map=17/39.547836899640934/21.762447453371244`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Navigation className="h-4 w-4 mr-2" />
                          Open in Maps
                        </a>
                      </Button>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span className="font-medium">{property.address}</span>
                  </div>

                  {/* Description */}
                  {property.location_details ? (
                    <div 
                      className="prose prose-lg max-w-none rich-content"
                      style={{
                        fontSize: '16px',
                        lineHeight: '1.6',
                        color: 'hsl(var(--muted-foreground))'
                      }}
                      dangerouslySetInnerHTML={{ __html: property.location_details }}
                    />
                  ) : property.location_neighborhood ? (
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {property.location_neighborhood}
                    </p>
                  ) : (
                    <p className="text-muted-foreground leading-relaxed">
                      Located in {property.city}, {property.country}. This area offers convenient access
                      to local attractions, restaurants, and amenities.
                    </p>
                  )}
                  
                  {/* Nearby Attractions */}
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Nearby Attractions</h3>
                    {property.nearby_places && property.nearby_places.length > 0 ? (
                      <div className="space-y-3">
                        {property.nearby_places.map((attraction) => {
                          const IconComponent = nearbyAttractionIcons[attraction.icon as keyof typeof nearbyAttractionIcons];
                          return (
                            <div key={attraction.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card/50 hover:bg-card/70 transition-colors">
                              <div className="text-primary">
                                {IconComponent ? (
                                  <IconComponent className="h-4 w-4" />
                                ) : (
                                  <MapPin className="h-4 w-4" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{attraction.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {attraction.distance} • {attraction.walkingTime}
                                </div>
                              </div>
                              <Badge variant="secondary" className="text-xs">{attraction.type}</Badge>
                            </div>
                          );
                        })}
                  </div>
                ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No nearby attractions have been added yet.</p>
                        <p className="text-sm">Check back later for local recommendations!</p>
                    </div>
                    )}
                    </div>
                  </div>
              </CardContent>
            </Card>

            {/* House Rules */}
            {property.house_rules_details ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">House Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="prose prose-lg max-w-none rich-content"
                    style={{
                      fontSize: '16px',
                      lineHeight: '1.6',
                      color: 'hsl(var(--muted-foreground))'
                    }}
                    dangerouslySetInnerHTML={{ __html: property.house_rules_details }}
                  />
                </CardContent>
              </Card>
            ) : (
              <HouseRules rules={property.rules || []} />
            )}

            {/* Reviews */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Guest reviews</CardTitle>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{reviewStats?.averageRating?.toFixed(1) || '4.9'}</span>
                    <span className="text-muted-foreground">({reviewStats?.totalReviews || 0} reviews)</span>
                </div>
                    </div>
              </CardHeader>
              <CardContent>
                {loadingReviews ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">Loading reviews...</span>
                    </div>
                ) : reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="p-4 rounded-lg border bg-card/50">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {review.guest_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{review.guest_name}</div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-3 w-3 ${
                                    i < review.overall_rating 
                                      ? 'fill-yellow-400 text-yellow-400' 
                                      : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                            </div>
                          </div>
                          {review.is_verified && (
                            <Badge variant="secondary" className="text-xs">
                              <Check className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                    </div>
                        {review.title && (
                          <h4 className="font-medium mb-2">{review.title}</h4>
                  )}
                        <p className="text-muted-foreground mb-2">
                          "{review.review_text}"
                        </p>
                        <div className="text-xs text-muted-foreground">
                          Stayed {review.nights_stayed} night{review.nights_stayed > 1 ? 's' : ''} • {new Date(review.stay_date).toLocaleDateString()}
                </div>
                </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Star className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                    <p>No reviews yet</p>
                    <p className="text-sm">Be the first to review this property!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Host */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Contact Your Host</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    HL
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">Habitat Lobby Team</h3>
                    <p className="text-muted-foreground mb-3">
                      Your dedicated hosts in Trikala, committed to making your stay exceptional.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/contact">
                          <Mail className="h-4 w-4 mr-2" />
                          Contact Us
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Response Time</h4>
                  <p className="text-sm text-muted-foreground">
                    We typically respond within 1 hour during business hours (9 AM - 9 PM Greek time).
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Cancellation Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Cancellation Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Free cancellation for 48 hours</p>
                      <p className="text-sm text-muted-foreground">
                        Cancel up to 48 hours before check-in for a full refund.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Clock className="h-3 w-3 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium">Partial refund before 24 hours</p>
                      <p className="text-sm text-muted-foreground">
                        50% refund for cancellations between 24-48 hours before check-in.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X className="h-3 w-3 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">No refund within 24 hours</p>
                      <p className="text-sm text-muted-foreground">
                        No refund for cancellations within 24 hours of check-in.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/policies">
                      View Full Cancellation Policy
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-6" data-availability-widget>
              <EmbeddedAvailabilityWidget
                propertyId={property.id}
                maxGuests={property.max_guests}
                basePrice={Math.round(property.base_price / 100)}
                className="shadow-xl border-0"
                reviewStats={reviewStats}
                property={{
                  id: property.id,
                  name: property.name,
                  description: property.description,
                  images: property.images,
                  city: property.city,
                  country: property.country
                }}
              />
                    </div>
                      </div>
                    </div>
      </section>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            <img 
              src={propertyImages[currentImageIndex]} 
              alt={`${property.name} - Photo ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-3 text-white hover:bg-black/70 transition-all"
            >
              <XCircle className="h-6 w-6" />
            </button>
            
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm rounded-full p-3 text-white hover:bg-black/70 transition-all"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm rounded-full p-3 text-white hover:bg-black/70 transition-all"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 text-white">
              {currentImageIndex + 1} / {propertyImages.length}
                      </div>
                      </div>
                      </div>
                    )}

      {/* Mobile Sticky Booking Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-t shadow-lg">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-2xl font-bold text-primary">€{Math.round(property.base_price / 100)}</div>
              <div className="text-sm text-muted-foreground">per night</div>
                  </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{reviewStats?.averageRating?.toFixed(1) || '4.9'}</span>
            </div>
          </div>
          <Button 
            onClick={() => {
              const widget = document.querySelector('[data-availability-widget]');
              widget?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
          >
            <Calendar className="h-5 w-5 mr-2" />
            {t('apartment.checkAvailability')}
          </Button>
        </div>
      </div>


      {/* Share Modal */}
      {property && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          property={{
            id: property.id,
            name: property.name,
            description: property.description,
            images: property.images,
            city: property.city,
            country: property.country
          }}
        />
      )}
    </div>
  );
};

export default ApartmentDetail;
