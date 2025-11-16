import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { LocationPicker } from './LocationPicker';
import {
  MapPin,
  Users,
  Bed,
  Bath,
  Maximize,
  Clock,
  Euro,
  Wifi,
  Wind,
  ChefHat,
  Waves,
  Tv,
  Utensils,
  Car,
  Coffee,
  Home,
  AirVent,
  X,
  Save,
  Eye,
  EyeOff,
  ExternalLink,
  Shield,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Check,
  FileText,
  Building,
  Trees,
  AlertTriangle,
  Volume2,
  Sparkles as CleanIcon,
  Zap,
  Bus,
  Landmark,
  Bike,
  Camera,
  Phone,
  Mail,
  Castle,
  Mountain,
  Star,
  TrendingUp,
  UtensilsCrossed,
  Navigation,
  // Additional icons for better rule representation
  Minus,
  AlertCircle,
  Info,
  HelpCircle,
  Lock,
  Unlock,
  Key,
  Gift,
  Package,
  Settings,
  Wrench,
  UserCheck,
  Activity
} from 'lucide-react';

interface Property {
  id: string;
  name: string;
  slug: string;
  description: string;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  size_sqm: number;
  base_price: number; // in cents
  cleaning_fee: number; // in cents
  security_deposit: number; // in cents
  min_nights: number;
  max_nights: number;
  check_in_time: string;
  check_out_time: string;
  amenities: string[];
  images: string[];
  is_active: boolean;
  created_at: string;
  // Additional properties from database
  active?: boolean;
  address?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  rules?: Array<{
    id: string;
    icon: string;
    title: string;
    description: string;
  }>;
  about_space?: string;
  location_neighborhood?: string;
}

interface VisualPropertyEditorProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  onSave: (propertyData: Partial<Property> & { base_price: number; cleaning_fee: number; security_deposit: number }) => Promise<void>;
}

interface PropertyLocation {
  address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

interface HouseRule {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface NearbyPlace {
  id: string;
  name: string;
  type: string;
  distance: string;
  walkingTime: string;
  latitude?: number;
  longitude?: number;
  icon: string;
}

// Amenity icons mapping (same as apartment page)
const amenityIcons = {
  wifi: Wifi,
  ac: Wind,
  kitchen: ChefHat,
  elevator: Home,
  balcony: MapPin,
  parking: Car,
  coffee: Coffee,
  tv: Tv,
  garden: Waves,
  airconditioning: AirVent,
};

const amenityLabels = {
  wifi: 'Wi-Fi',
  ac: 'Air Conditioning',
  kitchen: 'Full Kitchen',
  elevator: 'Elevator Access',
  balcony: 'Private Balcony',
  parking: 'Parking Space',
  coffee: 'Coffee Machine',
  tv: 'Smart TV',
  garden: 'Garden Access',
  airconditioning: 'Climate Control',
};

// Nearby attractions icons for map display - essential attractions only
const nearbyAttractionIcons = {
  // Food & Drink
  restaurant: Utensils,
  cafe: Coffee,
  bar: Building,
  bakery: ChefHat,
  butcher: ChefHat,
  
  // Shopping & Services
  supermarket: Building,
  pharmacy: Building,
  bank: Building,
  atm: Building,
  post_office: Mail,
  bookshop: Building,
  electronics: Building,
  clothing: Building,
  shoes: Package,
  jewelry: Building,
  hardware_store: Wrench,
  furniture_store: Building,
  
  // Transport
  bus_stop: Bus,
  train_station: Building,
  airport: Building,
  taxi: Car,
  parking: Car,
  gas_station: Zap,
  car_rental: Car,
  bike_rental: Bike,
  
  // Emergency & Public Services
  hospital: Building,
  police: Shield,
  fire_station: AlertTriangle,
  
  // Education & Culture
  school: Building,
  university: Building,
  library: Building,
  museum: Building,
  theater: Building,
  cinema: Building,
  art_gallery: Building,
  
  // Entertainment & Recreation
  shopping_mall: Building,
  market: Building,
  gym: Building,
  park: Trees,
  beach: Waves,
  mountain: Mountain,
  swimming_pool: Waves,
  tennis_court: Building,
  golf_course: Building,
  ski_resort: Mountain,
  amusement_park: Star,
  zoo: Building,
  aquarium: Building,
  botanical_garden: Trees,
  
  // Religious & Historical
  church: Building,
  mosque: Building,
  temple: Building,
  castle: Castle,
  palace: Building,
  fortress: Shield,
  monument: Landmark,
  statue: Building,
  cemetery: Building,
  
  // Tourism & Information
  tourist_info: Info,
  tourist_attraction: Landmark,
  historical_site: Castle,
  viewpoint: Eye,
  tour_office: MapPin,
  
  // Accommodation
  hotel: Bed,
  hostel: Users,
  spa: Building,
  
  // Health & Wellness
  optician: Eye,
  dentist: Building,
  vet: Building,
  pet_shop: Building,
  
  // Nature & Outdoors
  garden_center: Trees,
  hiking_trail: Mountain,
  camping: Building,
  picnic_area: Trees,
  playground: Building,
  marina: Building,
  fishing_spot: Building,
  
  // Sports & Activities
  sports_center: Building,
  stadium: Building,
  race_track: Car,
  
  // Landmarks & Architecture
  clock_tower: Clock,
  bell_tower: Building,
  lighthouse: Building,
  windmill: Wind,
  tower: Building,
  bridge: Building,
  fountain: Building,
  
  // Utilities & Infrastructure
  power_plant: Zap,
  water_tower: Building,
  antenna: Building,
  satellite: Building,
  observatory: Eye,
  planetarium: Star,
  
  // Entertainment & Media
  concert_hall: Building,
  opera_house: Building,
  music_store: Building,
  radio_station: Building,
  tv_station: Tv,
  newspaper: FileText,
  magazine: FileText,
  photo_studio: Camera,
  
  // Business & Professional
  law_office: Building,
  accounting_firm: Building,
  insurance_office: Shield,
  real_estate: Home,
  travel_agency: Building,
  
  // Automotive & Transport
  car_dealer: Car,
  motorcycle_dealer: Bike,
  auto_repair: Wrench,
  car_wash: Building,
  electric_charging: Zap,
  bike_shop: Bike,
  
  // Recreation & Hobbies
  surf_shop: Waves,
  ski_shop: Mountain,
  climbing_shop: Mountain,
  camping_shop: Building,
  fishing_shop: Building,
  
  // Entertainment & Gaming
  bowling: Building,
  billiards: Building,
  chess_club: Building,
  internet_cafe: Building,
  gaming_center: Building,
  karaoke: Building,
  nightclub: Building,
  casino: Building,
  
  // Shopping & Markets
  antique_shop: Clock,
  vintage_shop: Clock,
  thrift_shop: Package,
  outlet_mall: Building,
  farmers_market: Trees,
  flea_market: Package,
  
  // Events & Festivals
  food_festival: Utensils,
  wine_festival: Building,
  beer_festival: Building,
  music_festival: Building,
  film_festival: Building,
  comedy_club: Building,
  magic_show: Star,
  circus: Star,
  
  // Health & Wellness Services
  massage_parlor: Building,
  yoga_studio: Building,
  pilates_studio: Building,
  meditation_center: Building,
  martial_arts: Shield,
  
  // Community & Social Services
  cultural_center: Building,
  community_center: Users,
  senior_center: Users,
  youth_center: Users,
  soup_kitchen: Utensils,
  food_bank: Package,
  clothing_bank: Package,
  
  // Medical & Healthcare
  medical_clinic: Building,
  dental_clinic: Building,
  eye_clinic: Eye,
  mental_health_clinic: Building,
  rehabilitation_center: Building,
  nursing_home: Users,
  hospice: Building,
  
  // Memorial & Funeral
  funeral_home: Building,
  crematorium: Building,
  memorial_garden: Trees,
  columbarium: Building,
  mausoleum: Building,
  tomb: Building,
  grave: Building,
  headstone: Building,
  plaque: FileText,
  memorial_bench: Building,
  memorial_tree: Trees,
  memorial_fountain: Building,
  memorial_clock: Clock,
  memorial_bell: Building,
  memorial_lamp: Building,
  memorial_flag: Building,
  memorial_wreath: Building,
  memorial_candle: Building,
  memorial_incense: Building,
  memorial_offering: Gift,
  memorial_prayer: Building,
  memorial_service: Users,
  memorial_ceremony: Users,
  memorial_celebration: Users,
  memorial_remembrance: Building,
  memorial_honor: Shield,
  memorial_respect: Building,
  memorial_love: Building,
  memorial_gratitude: Building,
  memorial_peace: Building,
  memorial_hope: Building,
  memorial_faith: Building,
  memorial_courage: Building,
  memorial_strength: Shield,
  memorial_wisdom: Building,
  memorial_knowledge: Building,
  memorial_learning: Building,
  memorial_education: Building,
  memorial_teaching: Building,
  memorial_mentoring: Users,
  memorial_guidance: Building,
  memorial_support: Building,
  memorial_help: Building,
  memorial_care: Building,
  memorial_comfort: Building,
  memorial_healing: Building,
  memorial_recovery: Building,
  memorial_renewal: Building,
  memorial_growth: Building,
  memorial_change: Building,
  memorial_transformation: Building,
  memorial_evolution: Building,
  memorial_progress: Building,
  memorial_advancement: Building,
  memorial_improvement: Building,
  memorial_development: Building,
  memorial_innovation: Building,
  memorial_creativity: Building,
  memorial_imagination: Building,
  memorial_inspiration: Star,
  memorial_motivation: Building,
  memorial_encouragement: Building,
  memorial_empowerment: Shield,
  memorial_confidence: Building,
  memorial_self_esteem: Building,
  memorial_pride: Building,
  memorial_achievement: Building,
  memorial_success: Building,
  memorial_victory: Building,
  memorial_triumph: Building,
  memorial_conquest: Shield,
  memorial_overcoming: Building,
  memorial_perseverance: Building,
  memorial_determination: Building,
  memorial_resilience: Building,
  memorial_endurance: Building,
  memorial_persistence: Building,
  memorial_tenacity: Building,
  memorial_grit: Building,
  memorial_fortitude: Building,
  memorial_bravery: Building,
  memorial_heroism: Building,
  memorial_valor: Building,
  memorial_gallantry: Building,
  memorial_nobility: Building,
  memorial_elegance: Building,
  memorial_beauty: Building,
  memorial_harmony: Building,
  memorial_balance: Building,
  memorial_equilibrium: Building,
  memorial_stability: Building,
  memorial_grounding: Building,
  memorial_centering: Building,
  memorial_focus: Building,
  memorial_clarity: Eye,
  memorial_awareness: Building,
  memorial_consciousness: Building,
  memorial_mindfulness: Building,
  memorial_presence: Building,
  memorial_attention: Building,
  memorial_observation: Building,
  memorial_notice: Building,
  memorial_recognition: Building,
  memorial_acknowledgment: Check,
  memorial_appreciation: Building,
  memorial_thanks: Building,
  memorial_blessing: Building,
  memorial_favor: Building,
  memorial_goodwill: Building,
  memorial_kindness: Building,
  memorial_compassion: Building,
  memorial_empathy: Building,
  memorial_sympathy: Building,
  memorial_understanding: Building,
  memorial_tolerance: Building,
  memorial_acceptance: Building,
  memorial_inclusion: Users,
  memorial_diversity: Users,
  memorial_equality: Building,
  memorial_justice: Building,
  memorial_fairness: Building,
  memorial_impartiality: Building,
  memorial_objectivity: Building,
  memorial_neutrality: Building,
  memorial_unbiased: Building,
  memorial_unprejudiced: Building,
  memorial_open_minded: Building,
  memorial_broad_minded: Building,
  memorial_liberal: Building,
  memorial_progressive: Building,
  memorial_forward_thinking: Building,
  memorial_visionary: Building,
  memorial_futuristic: Building,
  memorial_modern: Building,
  memorial_contemporary: Building,
  memorial_current: Building,
  memorial_timely: Building,
  memorial_relevant: Building,
  memorial_pertinent: Building,
  memorial_applicable: Building,
  memorial_suitable: Building,
  memorial_appropriate: Building,
  memorial_fitting: Building,
  memorial_proper: Building,
  memorial_correct: Building,
  memorial_right: Building,
  memorial_good: Building,
  memorial_positive: Building,
  memorial_constructive: Building,
  memorial_helpful: Building,
  memorial_beneficial: Building,
  memorial_valuable: Building,
  memorial_precious: Building,
  memorial_treasure: Building,
  memorial_jewel: Building,
  memorial_pearl: Building,
  memorial_diamond: Building,
  memorial_ruby: Building,
  memorial_emerald: Building,
  memorial_sapphire: Building,
  memorial_opal: Building,
  memorial_amethyst: Building,
  memorial_topaz: Building,
  memorial_garnet: Building,
  memorial_aquamarine: Building,
  memorial_peridot: Building,
  memorial_citrine: Building,
  memorial_tanzanite: Building,
  memorial_turquoise: Building,
  memorial_lapis: Building,
  memorial_onyx: Building,
  memorial_jade: Building,
  memorial_agate: Building,
  memorial_quartz: Building,
  memorial_crystal: Building,
  memorial_obsidian: Building,
  memorial_granite: Building,
  memorial_marble: Building,
  memorial_slate: Building,
  memorial_sandstone: Building,
  memorial_limestone: Building,
  memorial_basalt: Building,
  memorial_gneiss: Building,
  memorial_schist: Building,
  memorial_phyllite: Building,
  memorial_shale: Building,
  memorial_clay: Building,
  memorial_silt: Building,
  memorial_sand: Building,
  memorial_gravel: Building,
  memorial_cobble: Building,
  memorial_boulder: Building,
  memorial_pebble: Building,
  memorial_stone: Building,
  memorial_rock: Building,
  memorial_mineral: Building,
  memorial_ore: Building,
  memorial_metal: Building,
  memorial_gold: Building,
  memorial_silver: Building,
  memorial_copper: Building,
  memorial_iron: Wrench,
  memorial_steel: Wrench,
  memorial_aluminum: Wrench,
  memorial_titanium: Wrench,
  memorial_platinum: Building,
  memorial_palladium: Building,
  memorial_rhodium: Building,
  memorial_iridium: Building,
  memorial_osmium: Building,
  memorial_ruthenium: Building,
  memorial_rhenium: Building,
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

// Rule icons for the rules section - more appropriate for rules and restrictions
const ruleIcons = {
  // Prohibitions and restrictions
  no_smoking: X,
  no_pets: Users,
  no_parties: Volume2,
  quiet_hours: Volume2,
  no_shoes: Home,
  no_children: Users,
  no_visitors: Users,
  no_cooking: UtensilsCrossed,
  no_laundry: Trash2,
  no_parking: Car,
  no_bikes: Bike,
  no_photos: Camera,
  no_phone: Phone,
  no_music: Volume2,
  no_tv: Tv,
  no_wifi: Wifi,
  no_kitchen: ChefHat,
  no_bathroom: Bath,
  no_bedroom: Bed,
  no_living: Home,
  no_balcony: MapPin,
  no_garden: Trees,
  no_pool: Waves,
  no_gym: Building,
  no_elevator: Home,
  no_stairs: Building,
  no_fire: AlertTriangle,
  no_water: Waves,
  no_electricity: Zap,
  no_trash: Trash2,
  no_recycling: Trash2,
  no_compost: Trees,
  
  // Requirements and permissions
  max_guests: Users,
  check_in_time: Clock,
  check_out_time: Clock,
  cleaning_required: CleanIcon,
  security_deposit: Shield,
  wifi_included: Wifi,
  parking_included: Car,
  elevator_available: Home,
  kitchen_available: ChefHat,
  tv_included: Tv,
  ac_included: Wind,
  balcony_available: MapPin,
  garden_available: Trees,
  coffee_provided: Coffee,
  bike_available: Bike,
  camera_allowed: Camera,
  phone_allowed: Phone,
  mail_service: Mail,
  utensils_provided: Utensils,
  pool_available: Waves,
  gym_available: Building,
  parking_available: Car,
  elevator_access: Home,
  stairs_access: Building,
  fire_safety: AlertTriangle,
  water_included: Waves,
  electricity_included: Zap,
  trash_service: Trash2,
  recycling_service: Trash2,
  compost_service: Trees,
  
  // General rule icons
  rules: FileText,
  policy: Shield,
  terms: FileText,
  conditions: AlertTriangle,
  restrictions: X,
  requirements: Check,
  guidelines: Info,
  instructions: HelpCircle,
  notice: AlertCircle,
  warning: AlertTriangle,
  important: Star,
  mandatory: Lock,
  optional: Unlock,
  allowed: Check,
  forbidden: X,
  required: Plus,
  prohibited: Minus,
  permitted: Eye,
  restricted: EyeOff,
  available: Key,
  included: Check,
  provided: Gift,
  supplied: Package,
  furnished: Home,
  equipped: Settings,
  maintained: Wrench,
  serviced: Wrench,
  managed: UserCheck,
  supervised: Eye,
  monitored: Activity
};

const ruleIconLabels = {
  no_smoking: 'No Smoking',
  no_pets: 'No Pets',
  no_parties: 'No Parties',
  quiet_hours: 'Quiet Hours',
  no_shoes: 'No Shoes',
  max_guests: 'Max Guests',
  check_in_time: 'Check-in Time',
  check_out_time: 'Check-out Time',
  cleaning: 'Cleaning',
  security: 'Security',
  wifi: 'Wi-Fi',
  parking: 'Parking',
  elevator: 'Elevator',
  kitchen: 'Kitchen',
  tv: 'TV',
  ac: 'Air Conditioning',
  balcony: 'Balcony',
  garden: 'Garden',
  coffee: 'Coffee',
  bike: 'Bike',
  camera: 'Camera',
  phone: 'Phone',
  mail: 'Mail',
  utensils: 'Utensils',
  waves: 'Waves',
  airvent: 'Air Vent',
  building: 'Building',
  castle: 'Castle',
  mountain: 'Mountain',
  bus: 'Bus',
  landmark: 'Landmark',
  alert: 'Alert',
  sparkles: 'Sparkles',
  zap: 'Zap',
  euro: 'Euro',
  maximize: 'Maximize',
  map_pin: 'Map Pin',
  star: 'Star',
  bed: 'Bed',
  bath: 'Bath',
  users: 'Users',
  trash: 'Trash',
  edit: 'Edit',
  check: 'Check',
  file_text: 'File Text',
  plus: 'Plus',
  x: 'X',
  save: 'Save',
  eye: 'Eye',
  eye_off: 'Eye Off',
  external_link: 'External Link',
  sparkles_clean: 'Clean',
  trending_up: 'Trending Up',
  utensils_crossed: 'Utensils Crossed',
  navigation: 'Navigation'
};

const availableAmenities = Object.keys(amenityIcons);

export const VisualPropertyEditor: React.FC<VisualPropertyEditorProps> = ({
  isOpen,
  onClose,
  property,
  onSave
}) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    max_guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    size_sqm: 50,
    base_price: 95, // €95 (in euros now)
    cleaning_fee: 30, // €30 (in euros now)
    security_deposit: 100, // €100 (in euros now)
    min_nights: 2,
    max_nights: 30,
    check_in_time: '15:00',
    check_out_time: '11:00',
    amenities: [] as string[],
    images: [] as string[],
    is_active: true,
            location: {
          address: '',
          city: '',
          country: '',
          latitude: 39.547836899640934,
          longitude: 21.762447453371244
        } as PropertyLocation,
        floor_level: '',
        nearby_places: [] as NearbyPlace[],
        // New editable sections
        about_space: '',
        location_neighborhood: '',
        // Rules section
        rules: [] as HouseRule[]
  });

  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [newRule, setNewRule] = useState<Omit<HouseRule, 'id'>>({
    icon: '',
    title: '',
    description: ''
  });
  
  // Nearby attractions state
  const [showAttractionIconSelector, setShowAttractionIconSelector] = useState(false);
  const [newAttraction, setNewAttraction] = useState<Omit<NearbyPlace, 'id'>>({
    name: '',
    type: '',
    distance: '',
    walkingTime: '',
    latitude: undefined,
    longitude: undefined,
    icon: ''
  });

  useEffect(() => {
    if (property) {
      console.log('Loading existing property data:', property);
      setFormData({
        name: property.name || '',
        slug: property.slug || property.name?.toLowerCase().replace(/\s+/g, '-') || '',
        description: property.description || '',
        max_guests: property.max_guests || 2,
        bedrooms: property.bedrooms || 1,
        bathrooms: property.bathrooms || 1,
        size_sqm: property.size_sqm || 50,
        base_price: property.base_price ? Math.round(property.base_price / 100) : 95, // Convert cents to euros
        cleaning_fee: property.cleaning_fee ? Math.round(property.cleaning_fee / 100) : 30, // Convert cents to euros
        security_deposit: property.security_deposit ? Math.round(property.security_deposit / 100) : 100, // Convert cents to euros
        min_nights: property.min_nights || 2,
        max_nights: property.max_nights || 30,
        check_in_time: property.check_in_time || '15:00',
        check_out_time: property.check_out_time || '11:00',
        amenities: property.amenities || [],
        images: property.images || [],
        is_active: property.active !== undefined ? property.active : true,
        location: {
          address: property.address || '',
          city: property.city || 'Trikala',
          country: property.country || 'Greece',
          latitude: property.latitude,
          longitude: property.longitude
        },
        floor_level: '', // Will be added to property interface
        nearby_places: [], // Will be added to property interface
        // New editable sections - load actual data from database
        about_space: property.about_space || '',
        location_neighborhood: property.location_neighborhood || '',
        // Rules section
        rules: property.rules || []
      });
              console.log('Form data loaded with existing values:', {
          about_space: property.about_space,
          location_neighborhood: property.location_neighborhood
        });
    } else {
      // Reset form for new property
      setFormData({
        name: '',
        slug: '',
        description: '',
        max_guests: 2,
        bedrooms: 1,
        bathrooms: 1,
        size_sqm: 50,
        base_price: 95, // €95 (in euros)
        cleaning_fee: 30, // €30 (in euros)
        security_deposit: 100, // €100 (in euros)
        min_nights: 2,
        max_nights: 30,
        check_in_time: '15:00',
        check_out_time: '11:00',
        amenities: [],
        images: [],
        is_active: true,
        location: {
          address: '',
          city: 'Trikala',
          country: 'Greece',
          latitude: undefined,
          longitude: undefined
        },
        floor_level: '',
        nearby_places: [],
        // New editable sections
        about_space: '',
        location_neighborhood: '',
        // Rules section
        rules: []
      });
    }
  }, [property]);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Convert euros to cents for backend compatibility
      const dataToSave = {
        ...formData,
        base_price: formData.base_price * 100, // Convert to cents
        cleaning_fee: formData.cleaning_fee * 100, // Convert to cents
        security_deposit: formData.security_deposit * 100, // Convert to cents
      };

      await onSave(dataToSave);
      onClose();
    } catch (error) {
      console.error('Error saving property:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageUpload = (urls: string[]) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...urls]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addRule = () => {
    if (!newRule.title || !newRule.description || !newRule.icon) return;
    
    const rule: HouseRule = {
      id: Date.now().toString(),
      ...newRule
    };
    
    setFormData(prev => ({
      ...prev,
      rules: [...prev.rules, rule]
    }));
    
    setNewRule({ icon: '', title: '', description: '' });
  };

  const removeRule = (id: string) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter(rule => rule.id !== id)
    }));
  };

  const addQuickRule = (icon: string, title: string, description: string) => {
    const rule: HouseRule = {
      id: Date.now().toString(),
      icon,
      title,
      description
    };
    
    setFormData(prev => ({
      ...prev,
      rules: [...prev.rules, rule]
    }));
  };

  // Nearby attractions functions
  const addAttraction = () => {
    if (!newAttraction.name || !newAttraction.type || !newAttraction.distance || !newAttraction.walkingTime || !newAttraction.icon) return;
    
    const attraction: NearbyPlace = {
      id: Date.now().toString(),
      ...newAttraction
    };
    
    setFormData(prev => ({
      ...prev,
      nearby_places: [...prev.nearby_places, attraction]
    }));
    
    setNewAttraction({ name: '', type: '', distance: '', walkingTime: '', latitude: undefined, longitude: undefined, icon: '' });
  };

  const removeAttraction = (id: string) => {
    setFormData(prev => ({
      ...prev,
      nearby_places: prev.nearby_places.filter(attraction => attraction.id !== id)
    }));
  };

  const addQuickAttraction = (type: string, icon: string) => {
    const attraction: NearbyPlace = {
      id: Date.now().toString(),
      name: '',
      type,
      distance: '',
      walkingTime: '',
      latitude: undefined,
      longitude: undefined,
      icon
    };
    
    setFormData(prev => ({
      ...prev,
      nearby_places: [...prev.nearby_places, attraction]
    }));
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-display">
                {property ? 'Edit Property' : 'Create New Property'}
              </DialogTitle>
              <DialogDescription>
                {property ? 'Update property details and settings' : 'Add a new property with preview functionality'}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center gap-2"
              >
                {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {previewMode ? 'Edit Mode' : 'Preview'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {previewMode ? (
            // Preview Mode - Apartment Page Style
            <div className="space-y-8 p-6">
              {/* Hero Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {[formData.location.address, formData.location.city, formData.location.country]
                      .filter(Boolean)
                      .join(', ') || 'Location not set'}
                  </span>
                  {formData.is_active ? (
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                  )}
                </div>
                
                <h1 className="font-display text-4xl font-bold">
                  {formData.name || 'Property Name'}
                </h1>

                {/* Property Stats */}
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{formData.max_guests} guests</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    <span>{formData.bedrooms} bedroom{formData.bedrooms > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    <span>{formData.bathrooms} bathroom{formData.bathrooms > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Maximize className="h-4 w-4" />
                    <span>{formData.size_sqm} m²</span>
                  </div>
                </div>
              </div>

              {/* Images Gallery */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`${formData.name} ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Description */}
              <div>
                <h2 className="font-display text-2xl font-semibold mb-4">About this place</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {formData.description || 'Property description will appear here...'}
                </p>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="font-display text-xl font-semibold mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {formData.amenities.map((amenity) => {
                    const IconComponent = amenityIcons[amenity as keyof typeof amenityIcons];
                    return (
                      <div key={amenity} className="flex items-center gap-2 p-3 rounded-lg border bg-card">
                        {IconComponent && <IconComponent className="h-4 w-4" />}
                        <span>{amenityLabels[amenity as keyof typeof amenityLabels] || amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pricing */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-display text-2xl font-semibold mb-4">Pricing</h2>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold">€{formData.base_price}</span>
                    <span className="text-muted-foreground">per night</span>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Cleaning fee:</span>
                      <span>€{formData.cleaning_fee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Security deposit:</span>
                      <span>€{formData.security_deposit}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Check-in/out times */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">Check-in</span>
                    </div>
                    <span className="text-lg">{formData.check_in_time}</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">Check-out</span>
                    </div>
                    <span className="text-lg">{formData.check_out_time}</span>
                  </CardContent>
                </Card>
              </div>

              {/* Content Sections Preview */}
              {formData.about_space && (
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <h2 className="font-display text-2xl font-semibold mb-4 flex items-center gap-2">
                      <Home className="h-6 w-6 text-blue-600" />
                      About This Space
                    </h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {formData.about_space}
                    </p>
                  </CardContent>
                </Card>
              )}



              {formData.location_neighborhood && (
                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="p-6">
                    <h2 className="font-display text-2xl font-semibold mb-4 flex items-center gap-2">
                      <MapPin className="h-6 w-6 text-purple-600" />
                      Location & Neighborhood
                    </h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {formData.location_neighborhood}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Rules Section */}
              {formData.rules.length > 0 && (
                <Card className="border-l-4 border-l-orange-500">
                  <CardContent className="p-6">
                    <h2 className="font-display text-2xl font-semibold mb-4 flex items-center gap-2">
                      <Shield className="h-6 w-6 text-orange-600" />
                      House Rules
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.rules.map((rule) => {
                        const IconComponent = ruleIcons[rule.icon as keyof typeof ruleIcons];
                        return (
                          <div key={rule.id} className="flex items-start gap-3 p-4 rounded-lg border bg-gray-50">
                            <div className="flex-shrink-0">
                              {IconComponent && <IconComponent className="h-5 w-5 text-primary" />}
                            </div>
                            <div>
                              <h3 className="font-medium text-sm">{rule.title}</h3>
                              <p className="text-sm text-muted-foreground">{rule.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}


            </div>
          ) : (
            // Edit Mode - Form Interface
            <div className="space-y-6 p-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Property Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Beautiful Apartment in City Center"
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="beautiful-apartment-city-center"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your property..."
                    rows={4}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active">Property is active and bookable</Label>
                </div>
              </div>

              <Separator />

              {/* Location */}
              <LocationPicker
                location={formData.location}
                onLocationChange={(location) => setFormData(prev => ({ ...prev, location }))}
              />

              <Separator />

              {/* Location Coordinates */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Map Coordinates</h3>
                <p className="text-sm text-muted-foreground">
                  Set the exact coordinates for the map pin. These coordinates will be used to show the property location on the map.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={formData.location.latitude || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        location: {
                          ...prev.location,
                          latitude: parseFloat(e.target.value) || undefined
                        }
                      }))}
                      placeholder="39.547836899640934"
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={formData.location.longitude || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        location: {
                          ...prev.location,
                          longitude: parseFloat(e.target.value) || undefined
                        }
                      }))}
                      placeholder="21.762447453371244"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      location: {
                        ...prev.location,
                        latitude: 39.547836899640934,
                        longitude: 21.762447453371244
                      }
                    }))}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Use Default (Trikala)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Open Google Maps to help find coordinates
                      window.open('https://www.google.com/maps', '_blank');
                    }}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Find Coordinates
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Property Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Property Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="max_guests">Max Guests</Label>
                    <Input
                      id="max_guests"
                      type="number"
                      value={formData.max_guests}
                      onChange={(e) => setFormData(prev => ({ ...prev, max_guests: parseInt(e.target.value) || 0 }))}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: parseInt(e.target.value) || 0 }))}
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: parseInt(e.target.value) || 0 }))}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="size_sqm">Size (m²)</Label>
                    <Input
                      id="size_sqm"
                      type="number"
                      value={formData.size_sqm}
                      onChange={(e) => setFormData(prev => ({ ...prev, size_sqm: parseInt(e.target.value) || 0 }))}
                      min="1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="floor_level">Floor Level</Label>
                    <Input
                      id="floor_level"
                      value={formData.floor_level}
                      onChange={(e) => setFormData(prev => ({ ...prev, floor_level: e.target.value }))}
                      placeholder="e.g., Ground Floor, 2nd Floor, Penthouse"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Pricing */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Pricing (in euros)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="base_price">Base Price per Night</Label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="base_price"
                        type="number"
                        value={formData.base_price}
                        onChange={(e) => setFormData(prev => ({ ...prev, base_price: parseInt(e.target.value) || 0 }))}
                        className="pl-10"
                        placeholder="95"
                        min="1"
                        step="1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cleaning_fee">Cleaning Fee</Label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="cleaning_fee"
                        type="number"
                        value={formData.cleaning_fee}
                        onChange={(e) => setFormData(prev => ({ ...prev, cleaning_fee: parseInt(e.target.value) || 0 }))}
                        className="pl-10"
                        placeholder="30"
                        min="0"
                        step="1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="security_deposit">Security Deposit</Label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="security_deposit"
                        type="number"
                        value={formData.security_deposit}
                        onChange={(e) => setFormData(prev => ({ ...prev, security_deposit: parseInt(e.target.value) || 0 }))}
                        className="pl-10"
                        placeholder="100"
                        min="0"
                        step="1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Booking Rules */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Booking Rules</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="min_nights">Minimum Nights</Label>
                    <Input
                      id="min_nights"
                      type="number"
                      value={formData.min_nights}
                      onChange={(e) => setFormData(prev => ({ ...prev, min_nights: parseInt(e.target.value) || 1 }))}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="max_nights">Maximum Nights</Label>
                    <Input
                      id="max_nights"
                      type="number"
                      value={formData.max_nights}
                      onChange={(e) => setFormData(prev => ({ ...prev, max_nights: parseInt(e.target.value) || 30 }))}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="check_in_time">Check-in Time</Label>
                    <Input
                      id="check_in_time"
                      type="time"
                      value={formData.check_in_time}
                      onChange={(e) => setFormData(prev => ({ ...prev, check_in_time: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="check_out_time">Check-out Time</Label>
                    <Input
                      id="check_out_time"
                      type="time"
                      value={formData.check_out_time}
                      onChange={(e) => setFormData(prev => ({ ...prev, check_out_time: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Amenities */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {availableAmenities.map((amenity) => {
                    const IconComponent = amenityIcons[amenity as keyof typeof amenityIcons];
                    const isSelected = formData.amenities.includes(amenity);
                    
                    return (
                      <Button
                        key={amenity}
                        variant={isSelected ? "default" : "outline"}
                        className="flex items-center gap-2 h-auto p-3 justify-start"
                        onClick={() => toggleAmenity(amenity)}
                      >
                        {IconComponent && <IconComponent className="h-4 w-4" />}
                        <span className="text-sm">{amenityLabels[amenity as keyof typeof amenityLabels] || amenity}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Rules Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">House Rules</h3>
                <p className="text-sm text-muted-foreground">
                  Add custom rules with icons. Each rule will be displayed with its selected icon on the property page.
                </p>
                
                {/* Add New Rule */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label htmlFor="rule_title">Rule Title</Label>
                      <Input
                        id="rule_title"
                        placeholder="e.g., No Smoking, Quiet Hours, Max Guests"
                        value={newRule.title}
                        onChange={(e) => setNewRule(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="rule_description">Description</Label>
                      <Input
                        id="rule_description"
                        placeholder="e.g., Smoking is not allowed anywhere on the property"
                        value={newRule.description}
                        onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Icon</Label>
                      <div className="relative">
                        <Button
                          variant="outline"
                          onClick={() => setShowIconSelector(!showIconSelector)}
                          className="w-12 h-10 p-0"
                        >
                          {newRule.icon ? (
                            React.createElement(ruleIcons[newRule.icon as keyof typeof ruleIcons], { className: "h-4 w-4" })
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </Button>
                        {showIconSelector && (
                          <div className="absolute top-full left-0 z-50 bg-white border rounded-lg shadow-lg p-2 max-h-48 overflow-y-auto w-64">
                            <div className="grid grid-cols-6 gap-1">
                              {Object.entries(ruleIcons).map(([key, IconComponent]) => (
                                <Button
                                  key={key}
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => {
                                    setNewRule(prev => ({ ...prev, icon: key }));
                                    setShowIconSelector(false);
                                  }}
                                  title={ruleIconLabels[key as keyof typeof ruleIconLabels]}
                                >
                                  <IconComponent className="h-3 w-3" />
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-end">
                      <Button
                        onClick={addRule}
                        disabled={!newRule.title || !newRule.description || !newRule.icon}
                        className="h-10"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Rule
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Existing Rules */}
                {formData.rules.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Current Rules</h4>
                    {formData.rules.map((rule, index) => {
                      const IconComponent = ruleIcons[rule.icon as keyof typeof ruleIcons];
                      return (
                        <div key={rule.id} className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                          <div className="flex items-center gap-2">
                            {IconComponent && <IconComponent className="h-4 w-4 text-primary" />}
                            <div>
                              <div className="font-medium">{rule.title}</div>
                              <div className="text-sm text-muted-foreground">{rule.description}</div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRule(rule.id)}
                            className="ml-auto text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Quick Add Common Rules */}
                <div className="border rounded-lg p-4 bg-blue-50">
                  <h4 className="font-medium mb-3">Quick Add Common Rules</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addQuickRule('no_smoking', 'No Smoking', 'Smoking is not allowed anywhere on the property')}
                      className="text-sm"
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      No Smoking
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addQuickRule('no_parties', 'No Parties', 'No parties or large gatherings allowed')}
                      className="text-sm"
                    >
                      <Volume2 className="h-3 w-3 mr-1" />
                      No Parties
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addQuickRule('quiet_hours', 'Quiet Hours', 'Quiet hours from 22:00 to 08:00')}
                      className="text-sm"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      Quiet Hours
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addQuickRule('max_guests', `Max ${formData.max_guests} Guests`, `Maximum ${formData.max_guests} guests allowed`)}
                      className="text-sm"
                    >
                      <Users className="h-3 w-3 mr-1" />
                      Max Guests
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Nearby Attractions Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Nearby Attractions</h3>
                <p className="text-sm text-muted-foreground">
                  Add nearby attractions that will be displayed on the map with their icons. These will help guests discover local amenities.
                </p>
                
                {/* Add New Attraction */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="attraction_name">Attraction Name</Label>
                      <Input
                        id="attraction_name"
                        placeholder="e.g., Central Park, Starbucks, Metro Station"
                        value={newAttraction.name}
                        onChange={(e) => setNewAttraction(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="attraction_type">Type</Label>
                      <Input
                        id="attraction_type"
                        placeholder="e.g., restaurant, park, bus_stop"
                        value={newAttraction.type}
                        onChange={(e) => setNewAttraction(prev => ({ ...prev, type: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="attraction_distance">Distance</Label>
                      <Input
                        id="attraction_distance"
                        placeholder="e.g., 200m, 0.5km"
                        value={newAttraction.distance}
                        onChange={(e) => setNewAttraction(prev => ({ ...prev, distance: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="attraction_walking_time">Walking Time</Label>
                      <Input
                        id="attraction_walking_time"
                        placeholder="e.g., 3 min, 10 min"
                        value={newAttraction.walkingTime}
                        onChange={(e) => setNewAttraction(prev => ({ ...prev, walkingTime: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="attraction_latitude">Latitude (optional)</Label>
                      <Input
                        id="attraction_latitude"
                        type="number"
                        step="any"
                        placeholder="e.g., 39.5478"
                        value={newAttraction.latitude || ''}
                        onChange={(e) => setNewAttraction(prev => ({ ...prev, latitude: e.target.value ? parseFloat(e.target.value) : undefined }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="attraction_longitude">Longitude (optional)</Label>
                      <Input
                        id="attraction_longitude"
                        type="number"
                        step="any"
                        placeholder="e.g., 21.7624"
                        value={newAttraction.longitude || ''}
                        onChange={(e) => setNewAttraction(prev => ({ ...prev, longitude: e.target.value ? parseFloat(e.target.value) : undefined }))}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4">
                    <div>
                      <Label>Icon</Label>
                      <div className="relative">
                        <Button
                          variant="outline"
                          onClick={() => setShowAttractionIconSelector(!showAttractionIconSelector)}
                          className="w-12 h-10 p-0"
                        >
                          {newAttraction.icon ? (
                            React.createElement(nearbyAttractionIcons[newAttraction.icon as keyof typeof nearbyAttractionIcons], { className: "h-4 w-4" })
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </Button>
                        {showAttractionIconSelector && (
                          <div className="absolute top-full left-0 z-50 bg-white border rounded-lg shadow-lg p-2 max-h-48 overflow-y-auto w-64">
                            <div className="grid grid-cols-6 gap-1">
                              {Object.entries(nearbyAttractionIcons).slice(0, 60).map(([key, IconComponent]) => (
                                <Button
                                  key={key}
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => {
                                    setNewAttraction(prev => ({ ...prev, icon: key }));
                                    setShowAttractionIconSelector(false);
                                  }}
                                  title={key}
                                >
                                  <IconComponent className="h-3 w-3" />
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-end">
                      <Button
                        onClick={addAttraction}
                        disabled={!newAttraction.name || !newAttraction.type || !newAttraction.distance || !newAttraction.walkingTime || !newAttraction.icon}
                        className="h-10"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Attraction
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Existing Attractions */}
                {formData.nearby_places.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Current Attractions</h4>
                    {formData.nearby_places.map((attraction) => {
                      const IconComponent = nearbyAttractionIcons[attraction.icon as keyof typeof nearbyAttractionIcons];
                      return (
                        <div key={attraction.id} className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                          <div className="flex items-center gap-2">
                            {IconComponent && <IconComponent className="h-4 w-4 text-primary" />}
                            <div>
                              <div className="font-medium">{attraction.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {attraction.type} • {attraction.distance} • {attraction.walkingTime}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttraction(attraction.id)}
                            className="ml-auto text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Quick Add Common Attractions */}
                <div className="border rounded-lg p-4 bg-blue-50">
                  <h4 className="font-medium mb-3">Quick Add Common Attractions</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addQuickAttraction('restaurant', 'restaurant')}
                      className="text-sm"
                    >
                      <Utensils className="h-3 w-3 mr-1" />
                      Restaurant
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addQuickAttraction('cafe', 'cafe')}
                      className="text-sm"
                    >
                      <Coffee className="h-3 w-3 mr-1" />
                      Cafe
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addQuickAttraction('supermarket', 'supermarket')}
                      className="text-sm"
                    >
                      <Building className="h-3 w-3 mr-1" />
                      Supermarket
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addQuickAttraction('bus_stop', 'bus_stop')}
                      className="text-sm"
                    >
                      <Bus className="h-3 w-3 mr-1" />
                      Bus Stop
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addQuickAttraction('park', 'park')}
                      className="text-sm"
                    >
                      <Trees className="h-3 w-3 mr-1" />
                      Park
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addQuickAttraction('pharmacy', 'pharmacy')}
                      className="text-sm"
                    >
                      <Building className="h-3 w-3 mr-1" />
                      Pharmacy
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Images */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Property Images</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <p className="text-gray-500">Image upload functionality has been simplified.</p>
                  <p className="text-sm text-gray-400">Images can be managed through the property form.</p>
                </div>
              </div>

              <Separator />

              {/* Content Sections */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">Property Content Builder</h3>
                  <Badge variant="secondary" className="text-xs">
                    Click to Build - No Coding Required
                  </Badge>
                </div>

                <div className="grid gap-6">
                  {/* About This Space */}
                  <Card className="border-2 border-dashed border-blue-200 hover:border-blue-300 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Home className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <Label className="text-base font-medium">About This Space</Label>
                            <p className="text-sm text-muted-foreground">Main description that appears first</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const templates = [
                              "This thoughtfully designed space captures the essence of modern living with stunning views and premium amenities.",
                              "Experience luxury and comfort in this beautifully appointed apartment featuring contemporary design and high-end finishes.",
                              "A perfect blend of style and functionality, this space offers everything you need for an unforgettable stay.",
                              "Discover your home away from home in this elegant space designed for comfort, convenience, and relaxation."
                            ];
                            const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
                            setFormData(prev => ({ ...prev, about_space: randomTemplate }));
                          }}
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Use Template
                        </Button>
                      </div>

                      {formData.about_space ? (
                        <div className="space-y-3">
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm">{formData.about_space}</p>
                          </div>
                          <div className="flex gap-2 mb-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setFormData(prev => ({ ...prev, about_space: '' }))}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Clear
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const current = formData.about_space;
                                const enhanced = current + " The space seamlessly blends comfort with style, featuring carefully curated furnishings and modern amenities.";
                                setFormData(prev => ({ ...prev, about_space: enhanced }));
                              }}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add More
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const editArea = document.getElementById('about_space_edit');
                                if (editArea) {
                                  editArea.style.display = editArea.style.display === 'none' ? 'block' : 'none';
                                }
                              }}
                              className="text-blue-600"
                            >
                              <Edit3 className="h-4 w-4 mr-2" />
                              Edit Text
                            </Button>
                          </div>
                          <div id="about_space_edit" style={{ display: 'none' }}>
                            <Textarea
                              value={formData.about_space}
                              onChange={(e) => setFormData(prev => ({ ...prev, about_space: e.target.value }))}
                              placeholder="Write your custom description here..."
                              rows={4}
                              className="resize-none"
                            />
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-muted-foreground">
                                {formData.about_space.length} characters
                              </span>
                              <Button
                                size="sm"
                                onClick={() => {
                                  document.getElementById('about_space_edit').style.display = 'none';
                                }}
                                className="text-xs"
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Done Editing
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 border-2 border-dashed border-blue-200 rounded-lg">
                          <Home className="h-12 w-12 text-blue-300 mx-auto mb-3" />
                          <p className="text-sm text-muted-foreground mb-3">Click "Use Template" to get started with professional content</p>
                          <Button
                            variant="outline"
                            onClick={() => {
                              const template = "This thoughtfully designed space captures the essence of modern living with stunning views and premium amenities.";
                              setFormData(prev => ({ ...prev, about_space: template }));
                            }}
                            className="text-blue-600 border-blue-600 hover:bg-blue-50"
                          >
                            <Zap className="h-4 w-4 mr-2" />
                            Quick Start
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>



                  {/* Location & Neighborhood */}
                  <Card className="border-2 border-dashed border-purple-200 hover:border-purple-300 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <MapPin className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <Label className="text-base font-medium">Location & Neighborhood</Label>
                            <p className="text-sm text-muted-foreground">Build location highlights with one click</p>
                          </div>
                        </div>
                      </div>

                      {formData.location_neighborhood ? (
                        <div className="space-y-3">
                          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <pre className="text-sm whitespace-pre-wrap font-sans">{formData.location_neighborhood}</pre>
                          </div>
                          <div className="grid grid-cols-4 gap-2 mb-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const attractions = [
                                  "• Historic city center - 5-minute walk",
                                  "• Local market - 3-minute walk",
                                  "• Traditional tavernas - 2-minute walk",
                                  "• Municipal park - 4-minute walk",
                                  "• Shopping district - 8-minute walk",
                                  "• Cultural museum - 6-minute walk"
                                ];
                                const randomAttraction = attractions[Math.floor(Math.random() * attractions.length)];
                                setFormData(prev => ({
                                  ...prev,
                                  location_neighborhood: prev.location_neighborhood + '\n' + randomAttraction
                                }));
                              }}
                              className="text-purple-600"
                            >
                              <Landmark className="h-4 w-4 mr-2" />
                              Add Attraction
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const transport = [
                                  "• Bus stop - 2-minute walk",
                                  "• Train station - 15-minute drive",
                                  "• Airport - 30-minute drive",
                                  "• Taxi stand - 1-minute walk",
                                  "• Metro station - 10-minute walk"
                                ];
                                const randomTransport = transport[Math.floor(Math.random() * transport.length)];
                                setFormData(prev => ({
                                  ...prev,
                                  location_neighborhood: prev.location_neighborhood + '\n' + randomTransport
                                }));
                              }}
                              className="text-purple-600"
                            >
                              <Bus className="h-4 w-4 mr-2" />
                              Add Transport
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const editArea = document.getElementById('location_edit');
                                if (editArea) {
                                  editArea.style.display = editArea.style.display === 'none' ? 'block' : 'none';
                                }
                              }}
                              className="text-purple-600"
                            >
                              <Edit3 className="h-4 w-4 mr-2" />
                              Write Custom
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setFormData(prev => ({ ...prev, location_neighborhood: '' }))}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Clear
                            </Button>
                          </div>
                          <div id="location_edit" style={{ display: 'none' }}>
                            <Textarea
                              value={formData.location_neighborhood}
                              onChange={(e) => setFormData(prev => ({ ...prev, location_neighborhood: e.target.value }))}
                              placeholder="Write your custom location description...&#10;&#10;Example:&#10;Located in the heart of the city, close to:&#10;• Restaurant name - 2-minute walk&#10;• Attraction name - 5-minute walk&#10;• Transport hub - 10-minute walk"
                              rows={7}
                              className="resize-none font-mono text-sm"
                            />
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3 inline mr-1" />
                                Include specific names and walking times for best results
                              </span>
                              <Button
                                size="sm"
                                onClick={() => {
                                  document.getElementById('location_edit').style.display = 'none';
                                }}
                                className="text-xs"
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Done Editing
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 border-2 border-dashed border-purple-200 rounded-lg">
                          <MapPin className="h-12 w-12 text-purple-300 mx-auto mb-3" />
                          <p className="text-sm text-muted-foreground mb-4">Choose what to highlight about your location</p>
                          <div className="grid grid-cols-2 gap-3">
                            <Button
                              variant="outline"
                              onClick={() => {
                                const cityContent = `Located in the vibrant heart of ${formData.location.city}, this property offers the perfect blend of urban convenience and local charm.\n\nNearby highlights:\n• City center - walking distance\n• Local restaurants - 3-minute walk\n• Public transportation - 5-minute walk\n• Shopping areas - 8-minute walk`;
                                setFormData(prev => ({ ...prev, location_neighborhood: cityContent }));
                              }}
                              className="text-purple-600 border-purple-600 hover:bg-purple-50"
                            >
                              <Building className="h-4 w-4 mr-2" />
                              City Center
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                const quietContent = `Enjoy the tranquility of this peaceful neighborhood while staying connected to ${formData.location.city}'s attractions.\n\nPerfect for:\n• Quiet relaxation away from crowds\n• Easy access to local amenities\n• Authentic local experience\n• Safe, family-friendly area`;
                                setFormData(prev => ({ ...prev, location_neighborhood: quietContent }));
                              }}
                              className="text-purple-600 border-purple-600 hover:bg-purple-50"
                            >
                              <Trees className="h-4 w-4 mr-2" />
                              Quiet Area
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>


                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex-shrink-0 border-t p-6">
          <div className="flex justify-between items-center">
            <div>
              {property && (
                <Button
                  variant="outline"
                  onClick={() => window.open(`/apartments/${property.id}`, '_blank')}
                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Live Property
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {loading ? 'Saving...' : (property ? 'Update Property' : 'Create Property')}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
