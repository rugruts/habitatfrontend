import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Plus,
  Edit,
  Trash2,
  Home,
  Euro,
  Calendar as CalendarIcon,
  Ban,
  Settings,
  Save,
  X,
  MapPin,
  Users,
  Bed,
  Bath,
  Wifi,
  Car,
  Coffee,
  Tv,
  AirVent,
  ChefHat,
  Upload,
  Image as ImageIcon,
  Eye,
  Trash
} from 'lucide-react';
import { supabaseHelpers } from '@/lib/supabase';

interface Property {
  id: string;
  name: string;
  description: string;
  city: string;
  country: string;
  address: string;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  base_price: number; // in cents
  currency: string;
  amenities: string[];
  images: string[]; // Array of image URLs
  active: boolean;
  created_at: string;
}

interface RateRule {
  id: string;
  property_id: string;
  name: string;
  rule_type: 'seasonal' | 'weekly' | 'monthly' | 'occupancy' | 'advance_booking';
  start_date?: string;
  end_date?: string;
  days_of_week?: number[]; // 0-6 (Sunday-Saturday)
  min_nights?: number;
  max_nights?: number;
  min_advance_days?: number;
  max_advance_days?: number;
  price_adjustment_type: 'percentage' | 'fixed_amount';
  price_adjustment: number;
  active: boolean;
  priority: number;
}

interface BlackoutDate {
  id: string;
  property_id: string;
  start_date: string;
  end_date: string;
  reason: string;
  created_at: string;
}

interface PriceCalendarDay {
  date: string;
  base_price: number;
  final_price: number;
  is_available: boolean;
  is_blackout: boolean;
  applied_rules: string[];
}

const PropertyRateManagement: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [rateRules, setRateRules] = useState<RateRule[]>([]);
  const [blackoutDates, setBlackoutDates] = useState<BlackoutDate[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [activeTab, setActiveTab] = useState('properties');
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [showPropertyDialog, setShowPropertyDialog] = useState(false);
  const [showRateRuleDialog, setShowRateRuleDialog] = useState(false);
  const [showBlackoutDialog, setShowBlackoutDialog] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [editingRateRule, setEditingRateRule] = useState<RateRule | null>(null);

  // Form states
  const [propertyForm, setPropertyForm] = useState({
    name: '',
    description: '',
    city: 'Trikala',
    country: 'Greece',
    address: '',
    max_guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    base_price: 9500, // €95 in cents
    currency: 'EUR',
    amenities: [] as string[],
    images: [] as string[],
    active: true
  });

  // Image upload states
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  const [rateRuleForm, setRateRuleForm] = useState({
    name: '',
    rule_type: 'seasonal' as const,
    start_date: '',
    end_date: '',
    days_of_week: [] as number[],
    min_nights: 1,
    max_nights: 30,
    min_advance_days: 0,
    max_advance_days: 365,
    price_adjustment_type: 'percentage' as const,
    price_adjustment: 0,
    active: true,
    priority: 1
  });

  const [blackoutForm, setBlackoutForm] = useState({
    start_date: '',
    end_date: '',
    reason: ''
  });

  // Available amenities
  const availableAmenities = [
    { id: 'wifi', label: 'WiFi', icon: Wifi },
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'kitchen', label: 'Kitchen', icon: ChefHat },
    { id: 'coffee', label: 'Coffee Machine', icon: Coffee },
    { id: 'tv', label: 'TV', icon: Tv },
    { id: 'ac', label: 'Air Conditioning', icon: AirVent },
    { id: 'balcony', label: 'Balcony', icon: Home },
    { id: 'garden', label: 'Garden', icon: Home }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [propertiesData, rateRulesData, blackoutDatesData] = await Promise.all([
        supabaseHelpers.getAllProperties(),
        supabaseHelpers.getRateRules(),
        supabaseHelpers.getBlackoutDates()
      ]);

      // Transform properties data to handle amenities properly
      const transformedProperties = (propertiesData || []).map(property => ({
        ...property,
        amenities: typeof property.amenities === 'string'
          ? JSON.parse(property.amenities || '[]')
          : property.amenities || []
      }));

      console.log('Fetched properties for PropertyRateManagement:', transformedProperties);
      setProperties(transformedProperties);
      setRateRules(rateRulesData || []);
      setBlackoutDates(blackoutDatesData || []);

      if (transformedProperties && transformedProperties.length > 0 && !selectedProperty) {
        setSelectedProperty(transformedProperties[0]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProperty = () => {
    setEditingProperty(null);
    setPropertyForm({
      name: '',
      description: '',
      city: 'Trikala',
      country: 'Greece',
      address: '',
      max_guests: 2,
      bedrooms: 1,
      bathrooms: 1,
      base_price: 9500,
      currency: 'EUR',
      amenities: [],
      images: [],
      active: true
    });
    setImageFiles([]);
    setImagePreviewUrls([]);
    setShowPropertyDialog(true);
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setPropertyForm({
      name: property.name,
      description: property.description,
      city: property.city,
      country: property.country,
      address: property.address,
      max_guests: property.max_guests,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      base_price: property.base_price,
      currency: property.currency,
      amenities: property.amenities || [],
      images: property.images || [],
      active: property.active
    });
    setImageFiles([]);
    setImagePreviewUrls(property.images || []);
    setShowPropertyDialog(true);
  };

  const handleSaveProperty = async () => {
    try {
      setUploadingImages(true);

      // Upload new images if any
      let uploadedImageUrls: string[] = [];
      if (imageFiles.length > 0) {
        uploadedImageUrls = await uploadImagesToSupabase(imageFiles);
      }

      // Combine existing images with newly uploaded ones
      const allImages = [...propertyForm.images, ...uploadedImageUrls];

      const propertyData = {
        ...propertyForm,
        amenities: JSON.stringify(propertyForm.amenities),
        images: JSON.stringify(allImages)
      };

      if (editingProperty) {
        await supabaseHelpers.updateProperty(editingProperty.id, propertyData);
      } else {
        await supabaseHelpers.createProperty(propertyData);
      }

      setShowPropertyDialog(false);
      setImageFiles([]);
      setImagePreviewUrls([]);
      await fetchData();
    } catch (error) {
      console.error('Error saving property:', error);
      alert('Error saving property. Please try again.');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property? This will also delete all associated bookings and rate rules.')) {
      return;
    }

    try {
      await supabaseHelpers.deleteProperty(propertyId);
      await fetchData();
      if (selectedProperty?.id === propertyId) {
        setSelectedProperty(properties.length > 1 ? properties[0] : null);
      }
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const toggleAmenity = (amenityId: string) => {
    setPropertyForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(a => a !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validate file types
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      alert('Some files were skipped. Please upload only images under 5MB.');
    }

    // Create preview URLs
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));

    setImageFiles(prev => [...prev, ...validFiles]);
    setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    // Revoke object URL to prevent memory leaks
    if (imagePreviewUrls[index] && imagePreviewUrls[index].startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrls[index]);
    }

    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));

    // Also remove from form if it's an existing image
    if (index < propertyForm.images.length) {
      setPropertyForm(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
  };

  const uploadImagesToSupabase = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      try {
        // Create a unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        // In a real implementation, you would upload to Supabase Storage
        // For now, we'll simulate the upload and use placeholder URLs
        const mockUrl = `https://placeholder.com/800x600/${fileName}`;
        uploadedUrls.push(mockUrl);

        // TODO: Implement real Supabase Storage upload
        // const { data, error } = await supabase.storage
        //   .from('property-images')
        //   .upload(fileName, file);

      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    return uploadedUrls;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading properties and rates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Properties & Rates</h2>
          <p className="text-gray-600">Manage your properties, pricing rules, and availability</p>
        </div>
        <Button onClick={handleCreateProperty} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="properties" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Properties
          </TabsTrigger>
          <TabsTrigger value="rates" className="flex items-center gap-2">
            <Euro className="h-4 w-4" />
            Rate Rules
          </TabsTrigger>
          <TabsTrigger value="blackouts" className="flex items-center gap-2">
            <Ban className="h-4 w-4" />
            Blackout Dates
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Price Calendar
          </TabsTrigger>
        </TabsList>

        {/* Properties Tab */}
        <TabsContent value="properties" className="space-y-6">
          <div className="grid gap-6">
            {properties.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Home className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Properties Yet</h3>
                  <p className="text-gray-600 text-center mb-4">
                    Create your first property to start managing rates and availability
                  </p>
                  <Button onClick={handleCreateProperty} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Property
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {properties.map((property) => (
                  <Card key={property.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-semibold">{property.name}</h3>
                            <Badge variant={property.active ? "default" : "secondary"}>
                              {property.active ? "Active" : "Inactive"}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span>{property.address}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Users className="h-4 w-4" />
                              <span>{property.max_guests} guests</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Euro className="h-4 w-4" />
                              <span>€{(property.base_price / 100).toFixed(0)}/night</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-1 text-gray-600">
                              <Bed className="h-4 w-4" />
                              <span>{property.bedrooms} bed</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <Bath className="h-4 w-4" />
                              <span>{property.bathrooms} bath</span>
                            </div>
                          </div>

                          {property.amenities && property.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {property.amenities.slice(0, 4).map((amenity) => {
                                const amenityInfo = availableAmenities.find(a => a.id === amenity);
                                return amenityInfo ? (
                                  <Badge key={amenity} variant="outline" className="text-xs">
                                    <amenityInfo.icon className="h-3 w-3 mr-1" />
                                    {amenityInfo.label}
                                  </Badge>
                                ) : null;
                              })}
                              {property.amenities.length > 4 && (
                                <Badge variant="outline" className="text-xs">
                                  +{property.amenities.length - 4} more
                                </Badge>
                              )}
                            </div>
                          )}

                          <p className="text-gray-600 text-sm line-clamp-2">{property.description}</p>

                          {/* Image Gallery Preview */}
                          {property.images && property.images.length > 0 && (
                            <div className="mt-4">
                              <div className="flex gap-2 overflow-x-auto">
                                {property.images.slice(0, 4).map((image, index) => (
                                  <div key={index} className="flex-shrink-0">
                                    <img
                                      src={image}
                                      alt={`${property.name} - Image ${index + 1}`}
                                      className="w-16 h-16 object-cover rounded-lg border"
                                    />
                                  </div>
                                ))}
                                {property.images.length > 4 && (
                                  <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg border flex items-center justify-center">
                                    <span className="text-xs text-gray-600">+{property.images.length - 4}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditProperty(property)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProperty(property.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Rate Rules Tab - Will be implemented next */}
        <TabsContent value="rates" className="space-y-6">
          <div className="text-center py-12">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Rate Rules</h3>
            <p className="text-gray-600">Coming next...</p>
          </div>
        </TabsContent>

        {/* Blackout Dates Tab - Will be implemented next */}
        <TabsContent value="blackouts" className="space-y-6">
          <div className="text-center py-12">
            <Ban className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Blackout Dates</h3>
            <p className="text-gray-600">Coming next...</p>
          </div>
        </TabsContent>

        {/* Price Calendar Tab - Will be implemented next */}
        <TabsContent value="calendar" className="space-y-6">
          <div className="text-center py-12">
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Price Calendar</h3>
            <p className="text-gray-600">Coming next...</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Property Create/Edit Dialog */}
      <Dialog open={showPropertyDialog} onOpenChange={setShowPropertyDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProperty ? 'Edit Property' : 'Create New Property'}
            </DialogTitle>
            <DialogDescription>
              {editingProperty ? 'Update property details and settings' : 'Add a new property to your portfolio'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Basic Information</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Property Name *</Label>
                  <Input
                    id="name"
                    value={propertyForm.name}
                    onChange={(e) => setPropertyForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., River Loft Apartment"
                  />
                </div>

                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={propertyForm.city}
                    onChange={(e) => setPropertyForm(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Trikala"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Full Address *</Label>
                <Input
                  id="address"
                  value={propertyForm.address}
                  onChange={(e) => setPropertyForm(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="e.g., Alexandrias 69, Trikala 42100, Greece"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={propertyForm.description}
                  onChange={(e) => setPropertyForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your property..."
                  rows={3}
                />
              </div>
            </div>

            <Separator />

            {/* Property Details */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Property Details</h4>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="max_guests">Max Guests *</Label>
                  <Input
                    id="max_guests"
                    type="number"
                    min="1"
                    max="20"
                    value={propertyForm.max_guests}
                    onChange={(e) => setPropertyForm(prev => ({ ...prev, max_guests: parseInt(e.target.value) || 1 }))}
                  />
                </div>

                <div>
                  <Label htmlFor="bedrooms">Bedrooms *</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    min="0"
                    max="10"
                    value={propertyForm.bedrooms}
                    onChange={(e) => setPropertyForm(prev => ({ ...prev, bedrooms: parseInt(e.target.value) || 0 }))}
                  />
                </div>

                <div>
                  <Label htmlFor="bathrooms">Bathrooms *</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    value={propertyForm.bathrooms}
                    onChange={(e) => setPropertyForm(prev => ({ ...prev, bathrooms: parseFloat(e.target.value) || 0 }))}
                  />
                </div>

                <div>
                  <Label htmlFor="base_price">Base Price (€/night) *</Label>
                  <Input
                    id="base_price"
                    type="number"
                    min="10"
                    max="1000"
                    value={propertyForm.base_price / 100}
                    onChange={(e) => setPropertyForm(prev => ({ ...prev, base_price: (parseFloat(e.target.value) || 0) * 100 }))}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Amenities */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Amenities</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {availableAmenities.map((amenity) => (
                  <div
                    key={amenity.id}
                    className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                      propertyForm.amenities.includes(amenity.id)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleAmenity(amenity.id)}
                  >
                    <amenity.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{amenity.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Image Upload */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Property Images</h4>

              {/* Image Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">
                    Click to upload images or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB each
                  </p>
                </label>
              </div>

              {/* Image Preview Grid */}
              {imagePreviewUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0"
                            onClick={() => window.open(url, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 w-8 p-0"
                            onClick={() => removeImage(index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {index === 0 && (
                        <Badge className="absolute top-1 left-1 text-xs">
                          Main
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {imagePreviewUrls.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No images uploaded yet</p>
                  <p className="text-xs">Add some photos to showcase your property</p>
                </div>
              )}
            </div>

            <Separator />

            {/* Status */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="active">Property Status</Label>
                <p className="text-sm text-gray-600">
                  {propertyForm.active ? 'Property is active and available for booking' : 'Property is inactive and hidden from guests'}
                </p>
              </div>
              <Switch
                id="active"
                checked={propertyForm.active}
                onCheckedChange={(checked) => setPropertyForm(prev => ({ ...prev, active: checked }))}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowPropertyDialog(false)}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSaveProperty}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!propertyForm.name || !propertyForm.address || !propertyForm.city || uploadingImages}
              >
                {uploadingImages ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading Images...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {editingProperty ? 'Update Property' : 'Create Property'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertyRateManagement;
