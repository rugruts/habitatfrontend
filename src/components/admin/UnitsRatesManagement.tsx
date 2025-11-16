import React, { useState, useEffect } from 'react';
import { supabaseHelpers } from '@/lib/supabase';
import { pricingService, RateRule, BlackoutDate, CreateRateRuleData, CreateBlackoutDateData } from '@/services/PricingService';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Home,
  DollarSign,
  Calendar,
  Settings,
  Plus,
  Edit,
  Trash2,
  Upload,
  Download,
  Eye,
  EyeOff,
  Wifi,
  Car,
  Coffee,
  Tv,
  Wind,
  Users,
  Bed,
  Bath,
  Copy
} from 'lucide-react';
import { centsToEUR } from '@/lib/api';
import { PropertyEditor } from './PropertyEditor';

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
  active: boolean; // Note: database uses 'active', not 'is_active'
  created_at: string;
  city: string;
  country: string;
  address: string;
  // New content sections
  about_space?: string;
  the_space?: string;
  location_neighborhood?: string;
  house_rules?: string;
}

// Database property interface for raw Supabase data
interface RawPropertyData {
  id: string;
  name: string;
  description?: string;
  max_guests?: number;
  bedrooms?: number;
  bathrooms?: number;
  size_sqm?: number;
  base_price?: number;
  cleaning_fee?: number;
  security_deposit?: number;
  min_nights?: number;
  max_nights?: number;
  check_in_time?: string;
  check_out_time?: string;
  amenities?: unknown;
  images?: unknown;
  active?: boolean;
  city?: string;
  country?: string;
  address?: string;
  about_space?: string;
  the_space?: string;
  location_neighborhood?: string;
  house_rules?: string;
  created_at?: string;
}

// Property data for saving
interface PropertySaveData {
  name: string;
  description?: string;
  detailed_description?: string;
  city?: string;
  country?: string;
  address?: string;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  base_price: number;
  currency?: string;
  amenities?: string[];
  images?: string[];
  active?: boolean;
  is_active?: boolean;
  property_type?: string;
  latitude?: number;
  longitude?: number;
  nearby_facilities?: unknown[];
  size_sqm?: number;
  cleaning_fee?: number;
}

// Using imported interfaces from PricingService

interface PropertyLocation {
  address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

interface NearbyPlace {
  id: string;
  name: string;
  type: string;
  distance: string;
  walkingTime: string;
}

interface VisualPropertyData {
  name: string;
  slug: string;
  description: string;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  size_sqm: number;
  base_price: number;
  cleaning_fee: number;
  security_deposit: number;
  min_nights: number;
  max_nights: number;
  check_in_time: string;
  check_out_time: string;
  amenities: string[];
  images: string[];
  is_active: boolean;
  location: PropertyLocation;
  floor_level: string;
  nearby_places: NearbyPlace[];
  // New editable sections
  about_space: string;
  the_space: string;
  location_neighborhood: string;
  house_rules: string;
}

// Helper functions to parse data from different formats
const parseAmenities = (amenities: unknown): string[] => {
  if (!amenities) return [];
  if (Array.isArray(amenities)) return amenities;
  if (typeof amenities === 'string') {
    try {
      // Try to parse as JSON first
      return JSON.parse(amenities);
    } catch {
      // If JSON parsing fails, treat as comma-separated string
      return amenities.split(',').map(item => item.trim()).filter(Boolean);
    }
  }
  return [];
};

const parseImages = (images: unknown): string[] => {
  if (!images) return [];
  if (Array.isArray(images)) return images;
  if (typeof images === 'string') {
    try {
      // Try to parse as JSON first
      return JSON.parse(images);
    } catch {
      // If JSON parsing fails, treat as comma-separated string
      return images.split(',').map(item => item.trim()).filter(Boolean);
    }
  }
  return [];
};

const UnitsRatesManagement: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [rateRules, setRateRules] = useState<RateRule[]>([]);
  const [blackoutDates, setBlackoutDates] = useState<BlackoutDate[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [activeTab, setActiveTab] = useState('properties');
  const [showPropertyEditor, setShowPropertyEditor] = useState(false);
  const [showRateDialog, setShowRateDialog] = useState(false);
  const [showBlackoutDialog, setShowBlackoutDialog] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [editingRateRule, setEditingRateRule] = useState<RateRule | null>(null);
  const [loading, setLoading] = useState(true);



  const [rateForm, setRateForm] = useState({
    property_id: '',
    name: '',
    start_date: '',
    end_date: '',
    price_modifier: 0,
    modifier_type: 'percentage' as 'percentage' | 'fixed_amount' | 'absolute_price',
    min_nights: undefined as number | undefined,
    is_active: true
  });

  const [blackoutForm, setBlackoutForm] = useState({
    property_id: '',
    start_date: '',
    end_date: '',
    reason: '',
    is_active: true
  });

  const availableAmenities = [
    { id: 'wifi', label: 'WiFi', icon: Wifi },
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'kitchen', label: 'Kitchen', icon: Coffee },
    { id: 'tv', label: 'TV', icon: Tv },
    { id: 'ac', label: 'Air Conditioning', icon: Wind },
    { id: 'balcony', label: 'Balcony', icon: Eye },
    { id: 'washing_machine', label: 'Washing Machine', icon: Settings },
    { id: 'dishwasher', label: 'Dishwasher', icon: Settings }
  ];

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching properties from Supabase...');

      // Fetch real properties from Supabase
      const propertiesData = await supabaseHelpers.getAllProperties();
      console.log('Fetched properties:', propertiesData);

      // Transform the data to match our Property interface
      const transformedProperties: Property[] = propertiesData.map((prop: RawPropertyData) => ({
        id: prop.id,
        name: prop.name,
        slug: prop.name.toLowerCase().replace(/\s+/g, '-'), // Generate slug from name
        description: prop.description || '',
        max_guests: prop.max_guests || 2,
        bedrooms: prop.bedrooms || 1,
        bathrooms: prop.bathrooms || 1,
        size_sqm: prop.size_sqm || 65, // Default size, will be added to DB later
        base_price: prop.base_price || 9500,
        cleaning_fee: prop.cleaning_fee || 2500, // Default, will be added to DB later
        security_deposit: prop.security_deposit || 10000, // Default, will be added to DB later
        min_nights: prop.min_nights || 2, // Default, will be added to DB later
        max_nights: prop.max_nights || 30, // Default, will be added to DB later
        check_in_time: prop.check_in_time || '15:00', // Default, will be added to DB later
        check_out_time: prop.check_out_time || '11:00', // Default, will be added to DB later
        amenities: parseAmenities(prop.amenities),
        images: parseImages(prop.images),
        active: prop.active !== false,
        city: prop.city || 'Trikala',
        country: prop.country || 'Greece',
        address: prop.address || '',
        // New content sections
        about_space: prop.about_space || '',
        the_space: prop.the_space || '',
        location_neighborhood: prop.location_neighborhood || '',
        house_rules: prop.house_rules || '',
        created_at: prop.created_at || new Date().toISOString()
      }));

      setProperties(transformedProperties);
      if (transformedProperties.length > 0) {
        setSelectedProperty(transformedProperties[0]);
      }

      // Fetch rate rules and blackout dates
      const [rateRulesData, blackoutDatesData] = await Promise.all([
        pricingService.getAllRateRules(),
        pricingService.getAllBlackoutDates()
      ]);

      console.log('📊 Fetched rate rules:', rateRulesData);
      console.log('🚫 Fetched blackout dates:', blackoutDatesData);

      setRateRules(rateRulesData);
      setBlackoutDates(blackoutDatesData);

    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback to empty array on error
      setProperties([]);
      setRateRules([]);
      setBlackoutDates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add useEffect after function definition
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setShowPropertyEditor(true);
  };

  const handleCreateProperty = () => {
    setEditingProperty(null);
    setShowPropertyEditor(true);
  };

  const handleSaveProperty = async (propertyData: PropertySaveData) => {
    try {
              // Transform the data to match the expected format - include all fields
        const transformedData = {
          name: propertyData.name,
          description: propertyData.description,
          detailed_description: propertyData.detailed_description || '',
          city: propertyData.city || 'Trikala',
          country: propertyData.country || 'Greece',
          address: propertyData.address || `${propertyData.name}, ${propertyData.city || 'Trikala'}, ${propertyData.country || 'Greece'}`,
          max_guests: propertyData.max_guests,
          bedrooms: propertyData.bedrooms,
          bathrooms: propertyData.bathrooms,
          base_price: propertyData.base_price,
          currency: propertyData.currency || 'EUR',
          amenities: propertyData.amenities || [],
          images: propertyData.images || [],
          active: propertyData.is_active || propertyData.active,
          property_type: propertyData.property_type || 'apartment',
          latitude: propertyData.latitude || 39.54835087201064,
          longitude: propertyData.longitude || 21.762722799554123,
          nearby_facilities: propertyData.nearby_facilities || [],
          size_sqm: propertyData.size_sqm,
          cleaning_fee: propertyData.cleaning_fee
        };

      if (editingProperty) {
        // Update existing property
        console.log('Updating property:', editingProperty.id, transformedData);
        console.log('Editing property object:', editingProperty);
        const updatedProperty = await supabaseHelpers.updateProperty(editingProperty.id, transformedData);
        console.log('✅ Property updated successfully:', updatedProperty);
      } else {
        // Create new property
        console.log('Creating property:', transformedData);
        const newProperty = await supabaseHelpers.createProperty(transformedData);
        console.log('✅ Property created successfully:', newProperty);
      }

      await fetchData(); // Refresh the list
      console.log('✅ Admin property list refreshed');
    } catch (error) {
      console.error('Error saving property:', error);
      throw error; // Re-throw so the visual editor can handle it
    }
  };

  const handleDeleteProperty = async (property: Property) => {
    if (!confirm(`Are you sure you want to delete "${property.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      console.log('Deleting property:', property.id);

      // Call Supabase to delete the property
      const { error } = await supabaseHelpers.deleteProperty(property.id);

      if (error) {
        throw error;
      }

      console.log('Property deleted successfully');
      await fetchData(); // Refresh the list
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete property. Please try again.');
    }
  };

  // Rate Rule Handlers
  const handleCreateRateRule = () => {
    setEditingRateRule(null);
    setRateForm({
      property_id: '',
      name: '',
      start_date: '',
      end_date: '',
      price_modifier: 0,
      modifier_type: 'percentage' as 'percentage' | 'fixed_amount' | 'absolute_price',
      min_nights: undefined,
      is_active: true
    });
    setShowRateDialog(true);
  };

  const handleEditRateRule = (rule: RateRule) => {
    setEditingRateRule(rule);
    setRateForm({
      property_id: rule.property_id,
      name: rule.name,
      start_date: rule.start_date || '',
      end_date: rule.end_date || '',
      price_modifier: rule.price_modifier,
      modifier_type: rule.modifier_type,
      min_nights: rule.min_nights,
      is_active: rule.is_active
    });
    setShowRateDialog(true);
  };

  const handleDuplicateRateRule = (rule: RateRule) => {
    // Set up form with duplicated data but clear the ID and name
    setEditingRateRule(null); // This is a new rule, not editing existing
    setRateForm({
      property_id: rule.property_id,
      name: `${rule.name} (Copy)`,
      start_date: rule.start_date || '',
      end_date: rule.end_date || '',
      price_modifier: rule.price_modifier,
      modifier_type: rule.modifier_type,
      min_nights: rule.min_nights,
      is_active: rule.is_active
    });
    setShowRateDialog(true);
  };

  const handleSaveRateRule = async () => {
    try {
      // Helper function to convert empty strings to null for dates
      const sanitizeDate = (date: string) => date.trim() === '' ? null : date;

      if (editingRateRule) {
        // Update existing rule
        const updateData: Partial<CreateRateRuleData> = {
          name: rateForm.name,
          property_id: rateForm.property_id,
          price_modifier: rateForm.price_modifier,
          modifier_type: rateForm.modifier_type,
          start_date: sanitizeDate(rateForm.start_date),
          end_date: sanitizeDate(rateForm.end_date),
          min_nights: rateForm.min_nights,
          is_active: rateForm.is_active
        };

        await pricingService.updateRateRule(editingRateRule.id, updateData);
        console.log('✅ Rate rule updated successfully');
      } else {
        // Create new rule
        const ruleData: CreateRateRuleData = {
          name: rateForm.name,
          property_id: rateForm.property_id,
          rule_type: 'seasonal', // Default type
          price_modifier: rateForm.price_modifier,
          modifier_type: rateForm.modifier_type,
          start_date: sanitizeDate(rateForm.start_date),
          end_date: sanitizeDate(rateForm.end_date),
          min_nights: rateForm.min_nights,
          is_active: rateForm.is_active
        };

        await pricingService.createRateRule(ruleData);
        console.log('✅ Rate rule created successfully');
      }

      setShowRateDialog(false);
      setEditingRateRule(null);
      setRateForm({
        property_id: '',
        name: '',
        start_date: '',
        end_date: '',
        price_modifier: 0,
        modifier_type: 'percentage' as 'percentage' | 'fixed_amount' | 'absolute_price',
        min_nights: undefined,
        is_active: true
      });
      await fetchData();
    } catch (error) {
      console.error('❌ Error saving rate rule:', error);
    }
  };

  const handleDeleteRateRule = async (ruleId: string) => {
    try {
      if (confirm('Are you sure you want to delete this rate rule?')) {
        await pricingService.deleteRateRule(ruleId);
        console.log('✅ Rate rule deleted successfully');
        await fetchData();
      }
    } catch (error) {
      console.error('❌ Error deleting rate rule:', error);
    }
  };

  // Blackout Date Handlers
  const handleSaveBlackoutDate = async () => {
    try {
      const blackoutData: CreateBlackoutDateData = {
        property_id: blackoutForm.property_id,
        start_date: blackoutForm.start_date,
        end_date: blackoutForm.end_date,
        reason: blackoutForm.reason,
        is_active: blackoutForm.is_active
      };

      await pricingService.createBlackoutDate(blackoutData);
      console.log('✅ Blackout date created successfully');

      setShowBlackoutDialog(false);
      setBlackoutForm({
        property_id: '',
        start_date: '',
        end_date: '',
        reason: '',
        is_active: true
      });
      await fetchData();
    } catch (error) {
      console.error('❌ Error creating blackout date:', error);
    }
  };

  const handleDeleteBlackoutDate = async (blackoutId: string) => {
    try {
      if (confirm('Are you sure you want to delete this blackout date?')) {
        await pricingService.deleteBlackoutDate(blackoutId);
        console.log('✅ Blackout date deleted successfully');
        await fetchData();
      }
    } catch (error) {
      console.error('❌ Error deleting blackout date:', error);
    }
  };

  const calculatePrice = (basePrice: number, rateRules: RateRule[], date: string) => {
    let finalPrice = basePrice;
    
    rateRules.forEach(rule => {
      if (rule.is_active && date >= rule.start_date && date <= rule.end_date) {
        if (rule.modifier_type === 'percentage') {
          finalPrice = finalPrice * (1 + rule.price_modifier / 100);
        } else {
          finalPrice = finalPrice + rule.price_modifier;
        }
      }
    });
    
    return Math.round(finalPrice);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Units & Rates Management</h2>
          <p className="text-gray-600">Manage properties, pricing, and availability</p>
        </div>
        <Button onClick={handleCreateProperty}>
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="properties" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Properties
          </TabsTrigger>
          <TabsTrigger value="rates" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Rate Rules
          </TabsTrigger>
          <TabsTrigger value="blackouts" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Blackout Dates
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Price Calendar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Card key={property.id} className={`${!property.active ? 'opacity-60' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{property.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      {property.active ? (
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => handleEditProperty(property)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProperty(property)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Property Image Preview */}
                    {property.images && property.images.length > 0 && (
                      <div className="relative h-32 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={property.images[0]}
                          alt={property.name}
                          className="w-full h-full object-cover"
                        />
                        {property.images.length > 1 && (
                          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            +{property.images.length - 1} more
                          </div>
                        )}
                      </div>
                    )}

                    <p className="text-sm text-gray-600 line-clamp-2">{property.description}</p>

                    {/* Property Stats */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span className="text-gray-500">Max Guests:</span>
                        <span className="font-medium">{property.max_guests}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-green-500" />
                        <span className="text-gray-500">Size:</span>
                        <span className="font-medium">{property.size_sqm || 'N/A'}m²</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bed className="h-4 w-4 text-purple-500" />
                        <span className="text-gray-500">Bedrooms:</span>
                        <span className="font-medium">{property.bedrooms}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bath className="h-4 w-4 text-cyan-500" />
                        <span className="text-gray-500">Bathrooms:</span>
                        <span className="font-medium">{property.bathrooms}</span>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="pt-3 border-t bg-gray-50 -mx-6 px-6 py-3 rounded-b-lg">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Base Price:</span>
                          <p className="font-semibold text-lg text-green-600">{centsToEUR(property.base_price)}/night</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Stay Duration:</span>
                          <p className="font-medium">{property.min_nights || 1}-{property.max_nights || 30} nights</p>
                        </div>
                      </div>

                      {property.cleaning_fee && (
                        <div className="text-xs text-gray-500 mt-2">
                          <div>Cleaning Fee: {centsToEUR(property.cleaning_fee)}</div>
                        </div>
                      )}
                    </div>


                    {/* Amenities */}
                    <div className="flex flex-wrap gap-1">
                      {property.amenities.slice(0, 3).map((amenityId) => {
                        const amenity = availableAmenities.find(a => a.id === amenityId);
                        return amenity ? (
                          <Badge key={amenityId} variant="outline" className="text-xs">
                            {amenity.label}
                          </Badge>
                        ) : null;
                      })}
                      {property.amenities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{property.amenities.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rates" className="space-y-6">
          {/* Rate Rules Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Rate Rules</p>
                    <p className="text-2xl font-bold">{rateRules.filter(r => r.is_active).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Seasonal Rules</p>
                    <p className="text-2xl font-bold">{rateRules.filter(r => r.rule_type === 'seasonal').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Settings className="h-8 w-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Special Offers</p>
                    <p className="text-2xl font-bold">{rateRules.filter(r => r.rule_type === 'custom').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rate Rules Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Rate Rules Management</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Configure pricing rules that automatically adjust your base rates</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCreateRateRule}>
                    <Plus className="h-4 w-4 mr-2" />
                    Quick Rule
                  </Button>
                  <Button onClick={handleCreateRateRule}>
                    <Plus className="h-4 w-4 mr-2" />
                    Advanced Rule
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {rateRules.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <DollarSign className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No rate rules configured</h3>
                  <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                    Set up pricing rules to automatically adjust rates for seasons, weekends, holidays, or special offers.
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button onClick={handleCreateRateRule}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Rule
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Rate Rules Table */}
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold">Rule Name</TableHead>
                          <TableHead className="font-semibold">Property</TableHead>
                          <TableHead className="font-semibold">Type</TableHead>
                          <TableHead className="font-semibold">Period</TableHead>
                          <TableHead className="font-semibold">Price Effect</TableHead>
                          <TableHead className="font-semibold">Status</TableHead>
                          <TableHead className="font-semibold text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rateRules.map((rule) => {
                          const property = properties.find(p => p.id === rule.property_id);
                          const basePrice = property?.base_price || 0; // Use 0 as fallback, not 9500
                          const calculatedPrice = rule.modifier_type === 'percentage'
                            ? basePrice * (1 + rule.price_modifier / 100)
                            : rule.modifier_type === 'fixed_amount'
                            ? basePrice + (rule.price_modifier * 100) // Convert euros to cents
                            : rule.price_modifier * 100; // absolute_price
                          
                          return (
                            <TableRow key={rule.id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{rule.name}</p>
                                  {rule.description && (
                                    <p className="text-sm text-gray-500">{rule.description}</p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Home className="h-4 w-4 text-gray-400 mr-2" />
                                  <span className="text-sm">{property?.name || 'All Properties'}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="capitalize">
                                  {rule.rule_type.replace('_', ' ')}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  {rule.start_date && rule.end_date ? (
                                    <div>
                                      <div>{new Date(rule.start_date).toLocaleDateString()}</div>
                                      <div className="text-gray-500">to {new Date(rule.end_date).toLocaleDateString()}</div>
                                    </div>
                                  ) : rule.days_of_week ? (
                                    <div>
                                      {rule.days_of_week.map(day => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]).join(', ')}
                                    </div>
                                  ) : (
                                    <span className="text-gray-400">Always active</span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <div className="flex items-center gap-2">
                                    {rule.modifier_type === 'percentage' ? (
                                      <>
                                        <span className={`font-medium ${rule.price_modifier >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                          {rule.price_modifier >= 0 ? '+' : ''}{rule.price_modifier}%
                                        </span>
                                        <span className="text-gray-400">→</span>
                                        <span className="font-medium">{centsToEUR(Math.round(calculatedPrice))}</span>
                                      </>
                                    ) : rule.modifier_type === 'fixed_amount' ? (
                                      <>
                                        <span className={`font-medium ${rule.price_modifier >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                          {rule.price_modifier >= 0 ? '+' : ''}€{rule.price_modifier}
                                        </span>
                                        <span className="text-gray-400">→</span>
                                        <span className="font-medium">{centsToEUR(Math.round(calculatedPrice))}</span>
                                      </>
                                    ) : (
                                      <span className="font-medium text-blue-600">€{rule.price_modifier}</span>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Base: {property ? centsToEUR(basePrice) : 'N/A - Select Property'}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col gap-1">
                                  <Badge variant={rule.is_active ? 'default' : 'secondary'} className="w-fit">
                                    {rule.is_active ? 'Active' : 'Inactive'}
                                  </Badge>
                                  {rule.priority > 0 && (
                                    <span className="text-xs text-gray-500">Priority: {rule.priority}</span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditRateRule(rule)}
                                    title="Edit rule"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDuplicateRateRule(rule)}
                                    title="Duplicate rule"
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      pricingService.toggleRateRuleStatus(rule.id, !rule.is_active);
                                      fetchData();
                                    }}
                                    title={rule.is_active ? 'Disable rule' : 'Enable rule'}
                                  >
                                    {rule.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteRateRule(rule.id)}
                                    className="text-red-600 hover:text-red-800"
                                    title="Delete rule"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blackouts" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Blackout Dates</CardTitle>
                <Button onClick={() => setShowBlackoutDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Blackout Period
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {blackoutDates.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No blackout dates configured</p>
                  <p className="text-sm">Block dates for maintenance, personal use, or other reasons</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {blackoutDates.map((blackout) => (
                    <div key={blackout.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{blackout.reason}</h3>
                          <p className="text-sm text-gray-600">
                            {blackout.start_date} to {blackout.end_date}
                          </p>
                          {blackout.description && (
                            <p className="text-sm text-gray-500 mt-1">{blackout.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={blackout.is_active ? 'destructive' : 'secondary'}>
                            {blackout.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBlackoutDate(blackout.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Price Calendar Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Eye className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Price calendar will show here</p>
                <p className="text-sm">View how your pricing rules affect daily rates</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Property Editor */}
      <PropertyEditor
        isOpen={showPropertyEditor}
        onClose={() => {
          setShowPropertyEditor(false);
          setEditingProperty(null);
        }}
        property={editingProperty ? {
          ...editingProperty,
          detailed_description: editingProperty.about_space || '',
          is_active: editingProperty.active,
          currency: 'EUR',
          property_type: 'apartment',
          latitude: 39.54835087201064,
          longitude: 21.762722799554123,
          nearby_facilities: []
        } : null}
        onSave={handleSaveProperty}
      />

      {/* Rate Rule Dialog */}
      <Dialog open={showRateDialog} onOpenChange={setShowRateDialog}>
        <DialogContent className="max-w-2xl" aria-describedby="rate-dialog-description">
          <DialogHeader>
            <DialogTitle>{editingRateRule ? 'Edit Rate Rule' : 'Create Rate Rule'}</DialogTitle>
          </DialogHeader>
          <div id="rate-dialog-description" className="sr-only">
            Configure pricing rules that automatically adjust your base rates for specific periods or conditions.
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rule-name">Rule Name *</Label>
                <Input
                  id="rule-name"
                  value={rateForm.name}
                  onChange={(e) => setRateForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Summer High Season"
                />
              </div>
              <div>
                <Label htmlFor="property-select">Property *</Label>
                <Select
                  value={rateForm.property_id}
                  onValueChange={(value) => setRateForm(prev => ({ ...prev, property_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Properties</SelectItem>
                    {properties.map(property => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={rateForm.start_date}
                  onChange={(e) => setRateForm(prev => ({ ...prev, start_date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={rateForm.end_date}
                  onChange={(e) => setRateForm(prev => ({ ...prev, end_date: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="modifier-type">Price Adjustment Type</Label>
                <Select
                  value={rateForm.modifier_type}
                  onValueChange={(value: 'percentage' | 'fixed_amount' | 'absolute_price') =>
                    setRateForm(prev => ({ ...prev, modifier_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (+/-)</SelectItem>
                    <SelectItem value="fixed_amount">Fixed Amount (€)</SelectItem>
                    <SelectItem value="absolute_price">Set Absolute Price (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price-modifier">
                  {rateForm.modifier_type === 'percentage' ? 'Percentage Change' :
                   rateForm.modifier_type === 'fixed_amount' ? 'Amount to Add/Subtract (€)' :
                   'Absolute Price (€)'}
                </Label>
                <Input
                  id="price-modifier"
                  type="number"
                  step={rateForm.modifier_type === 'percentage' ? '1' : '0.01'}
                  value={rateForm.price_modifier}
                  onChange={(e) => setRateForm(prev => ({ ...prev, price_modifier: parseFloat(e.target.value) || 0 }))}
                  placeholder={rateForm.modifier_type === 'percentage' ? 'e.g., 25' : 'e.g., 15.00'}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {rateForm.modifier_type === 'percentage' && 'Use positive numbers to increase price, negative to decrease'}
                  {rateForm.modifier_type === 'fixed_amount' && 'Use positive numbers to add to base price, negative to subtract'}
                  {rateForm.modifier_type === 'absolute_price' && 'Set the exact price per night'}
                </div>
              </div>
            </div>

            {rateForm.property_id && rateForm.property_id !== 'all' && rateForm.price_modifier !== 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Price Preview</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Base Price:</span>
                    {(() => {
                      const selectedProp = properties.find(p => p.id === rateForm.property_id);
                      return (
                        <p className="font-semibold">
                          {selectedProp ? centsToEUR(selectedProp.base_price) : 'N/A'}/night
                        </p>
                      );
                    })()}
                  </div>
                  <div>
                    <span className="text-gray-600">New Price:</span>
                    {(() => {
                      const selectedProp = properties.find(p => p.id === rateForm.property_id);
                      if (!selectedProp) return <p className="font-semibold text-blue-700">Select Property</p>;
                      
                      return (
                        <p className="font-semibold text-blue-700">
                          {rateForm.modifier_type === 'percentage'
                            ? centsToEUR(Math.round(selectedProp.base_price * (1 + rateForm.price_modifier / 100)))
                            : rateForm.modifier_type === 'fixed_amount'
                            ? centsToEUR(Math.round(selectedProp.base_price + (rateForm.price_modifier * 100)))
                            : `€${rateForm.price_modifier}`
                          }/night
                        </p>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="min-nights">Minimum Nights (Optional)</Label>
                <Input
                  id="min-nights"
                  type="number"
                  min="1"
                  value={rateForm.min_nights || ''}
                  onChange={(e) => setRateForm(prev => ({ ...prev, min_nights: e.target.value ? parseInt(e.target.value) : undefined }))}
                  placeholder="Leave empty for no minimum"
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="is-active"
                  checked={rateForm.is_active}
                  onCheckedChange={(checked) => setRateForm(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is-active">Active Rule</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowRateDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveRateRule}
                disabled={!rateForm.name || !rateForm.property_id || rateForm.price_modifier === 0}
              >
                {editingRateRule ? 'Update Rate Rule' : 'Create Rate Rule'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Blackout Date Dialog */}
      <Dialog open={showBlackoutDialog} onOpenChange={setShowBlackoutDialog}>
        <DialogContent className="max-w-lg" aria-describedby="blackout-dialog-description">
          <DialogHeader>
            <DialogTitle>Add Blackout Period</DialogTitle>
          </DialogHeader>
          <div id="blackout-dialog-description" className="sr-only">
            Block specific date ranges to prevent bookings for maintenance, personal use, or other reasons.
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="blackout-property">Property *</Label>
              <Select
                value={blackoutForm.property_id}
                onValueChange={(value) => setBlackoutForm(prev => ({ ...prev, property_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  {properties.map(property => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="blackout-start">Start Date *</Label>
                <Input
                  id="blackout-start"
                  type="date"
                  value={blackoutForm.start_date}
                  onChange={(e) => setBlackoutForm(prev => ({ ...prev, start_date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="blackout-end">End Date *</Label>
                <Input
                  id="blackout-end"
                  type="date"
                  value={blackoutForm.end_date}
                  onChange={(e) => setBlackoutForm(prev => ({ ...prev, end_date: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="blackout-reason">Reason *</Label>
              <Input
                id="blackout-reason"
                value={blackoutForm.reason}
                onChange={(e) => setBlackoutForm(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="e.g., Maintenance, Personal use, Renovation"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="blackout-active"
                checked={blackoutForm.is_active}
                onCheckedChange={(checked) => setBlackoutForm(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="blackout-active">Active Blackout</Label>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowBlackoutDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveBlackoutDate}
                disabled={!blackoutForm.property_id || !blackoutForm.start_date || !blackoutForm.end_date || !blackoutForm.reason}
              >
                Create Blackout Period
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UnitsRatesManagement;
