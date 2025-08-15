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
  Bath
} from 'lucide-react';
import { centsToEUR } from '@/lib/api';
import { VisualPropertyEditor } from './VisualPropertyEditor';

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
const parseAmenities = (amenities: any): string[] => {
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

const parseImages = (images: any): string[] => {
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
  const [showVisualEditor, setShowVisualEditor] = useState(false);
  const [showRateDialog, setShowRateDialog] = useState(false);
  const [showBlackoutDialog, setShowBlackoutDialog] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);



  const [rateForm, setRateForm] = useState({
    property_id: '',
    name: '',
    start_date: '',
    end_date: '',
    price_modifier: 0,
    modifier_type: 'percentage' as const,
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Fetching properties from Supabase...');

      // Fetch real properties from Supabase
      const propertiesData = await supabaseHelpers.getAllProperties();
      console.log('Fetched properties:', propertiesData);

      // Transform the data to match our Property interface
      const transformedProperties: Property[] = propertiesData.map((prop: any) => ({
        id: prop.id,
        name: prop.name,
        slug: prop.name.toLowerCase().replace(/\s+/g, '-'), // Generate slug from name
        description: prop.description || '',
        max_guests: prop.max_guests || 2,
        bedrooms: prop.bedrooms || 1,
        bathrooms: prop.bathrooms || 1,
        size_sqm: 65, // Default size, will be added to DB later
        base_price: prop.base_price || 9500,
        cleaning_fee: 2500, // Default, will be added to DB later
        security_deposit: 10000, // Default, will be added to DB later
        min_nights: 2, // Default, will be added to DB later
        max_nights: 30, // Default, will be added to DB later
        check_in_time: '15:00', // Default, will be added to DB later
        check_out_time: '11:00', // Default, will be added to DB later
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
  };



  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setShowVisualEditor(true);
  };

  const handleCreateProperty = () => {
    setEditingProperty(null);
    setShowVisualEditor(true);
  };

  const handleSaveProperty = async (propertyData: VisualPropertyData) => {
    try {
      // Transform the data to match the expected format
      const transformedData = {
        name: propertyData.name,
        description: propertyData.description,
        city: propertyData.location?.city || 'Trikala', // Use location data or default
        country: propertyData.location?.country || 'Greece', // Use location data or default
        address: propertyData.location?.address || `${propertyData.name}, ${propertyData.location?.city || 'Trikala'}, ${propertyData.location?.country || 'Greece'}`, // Use actual address
        max_guests: propertyData.max_guests,
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        base_price: propertyData.base_price,
        currency: 'EUR', // Default currency
        amenities: propertyData.amenities || [], // Send as array directly
        images: propertyData.images || [], // Send as array directly
        active: propertyData.is_active,
        // New fields
        slug: propertyData.slug || propertyData.name.toLowerCase().replace(/\s+/g, '-'),
        size_sqm: propertyData.size_sqm || 50,
        cleaning_fee: propertyData.cleaning_fee || 0,
        security_deposit: propertyData.security_deposit || 0,
        min_nights: propertyData.min_nights || 2,
        max_nights: propertyData.max_nights || 30,
        check_in_time: propertyData.check_in_time || '15:00',
        check_out_time: propertyData.check_out_time || '11:00',
        about_space: propertyData.about_space || '',
        the_space: propertyData.the_space || '',
        location_neighborhood: propertyData.location_neighborhood || '',
        house_rules: propertyData.house_rules || ''
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
  const handleSaveRateRule = async () => {
    try {
      const ruleData: CreateRateRuleData = {
        name: rateForm.name,
        property_id: rateForm.property_id,
        rule_type: 'seasonal', // Default type
        price_modifier: rateForm.price_modifier,
        modifier_type: rateForm.modifier_type,
        start_date: rateForm.start_date,
        end_date: rateForm.end_date,
        min_nights: rateForm.min_nights,
        is_active: rateForm.is_active
      };

      await pricingService.createRateRule(ruleData);
      console.log('✅ Rate rule created successfully');

      setShowRateDialog(false);
      setRateForm({
        property_id: '',
        name: '',
        start_date: '',
        end_date: '',
        price_modifier: 0,
        modifier_type: 'percentage',
        min_nights: undefined,
        is_active: true
      });
      await fetchData();
    } catch (error) {
      console.error('❌ Error creating rate rule:', error);
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

                      {(property.cleaning_fee || property.security_deposit) && (
                        <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 mt-2">
                          {property.cleaning_fee && (
                            <div>Cleaning: {centsToEUR(property.cleaning_fee)}</div>
                          )}
                          {property.security_deposit && (
                            <div>Deposit: {centsToEUR(property.security_deposit)}</div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Content Status */}
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center gap-1 text-xs">
                        <div className={`w-2 h-2 rounded-full ${property.about_space ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                        <span className="text-gray-500">About</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <div className={`w-2 h-2 rounded-full ${property.the_space ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="text-gray-500">Space</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <div className={`w-2 h-2 rounded-full ${property.location_neighborhood ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
                        <span className="text-gray-500">Location</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <div className={`w-2 h-2 rounded-full ${property.house_rules ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                        <span className="text-gray-500">Rules</span>
                      </div>
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
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Rate Rules</CardTitle>
                <Button onClick={() => setShowRateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rate Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {rateRules.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No rate rules configured yet</p>
                  <p className="text-sm">Add seasonal pricing, weekend rates, or special offers</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rateRules.map((rule) => (
                    <div key={rule.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{rule.name}</h3>
                          <p className="text-sm text-gray-600">
                            {rule.start_date} to {rule.end_date}
                          </p>
                          <p className="text-sm text-gray-600">
                            {rule.modifier_type === 'percentage' ? `${rule.price_modifier}%` : `€${rule.price_modifier}`} {rule.modifier_type === 'percentage' ? 'increase' : 'fixed amount'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={rule.is_active ? 'default' : 'secondary'}>
                            {rule.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRateRule(rule.id)}
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

      {/* Visual Property Editor */}
      <VisualPropertyEditor
        isOpen={showVisualEditor}
        onClose={() => {
          setShowVisualEditor(false);
          setEditingProperty(null);
        }}
        property={editingProperty}
        onSave={handleSaveProperty}
      />
    </div>
  );
};

export default UnitsRatesManagement;
