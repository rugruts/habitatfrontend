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
  Landmark
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
}

interface VisualPropertyEditorProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  onSave: (propertyData: any) => Promise<void>;
}

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
      latitude: undefined,
      longitude: undefined
    } as PropertyLocation,
    floor_level: '',
    nearby_places: [] as NearbyPlace[],
    // New editable sections
    about_space: '',
    the_space: '',
    location_neighborhood: '',
    house_rules: ''
  });

  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (property) {
      console.log('Loading existing property data:', property);
      setFormData({
        name: property.name || '',
        slug: (property as any).slug || property.name?.toLowerCase().replace(/\s+/g, '-') || '',
        description: property.description || '',
        max_guests: property.max_guests || 2,
        bedrooms: property.bedrooms || 1,
        bathrooms: property.bathrooms || 1,
        size_sqm: (property as any).size_sqm || 50,
        base_price: property.base_price ? Math.round(property.base_price / 100) : 95, // Convert cents to euros
        cleaning_fee: (property as any).cleaning_fee ? Math.round((property as any).cleaning_fee / 100) : 30, // Convert cents to euros
        security_deposit: (property as any).security_deposit ? Math.round((property as any).security_deposit / 100) : 100, // Convert cents to euros
        min_nights: (property as any).min_nights || 2,
        max_nights: (property as any).max_nights || 30,
        check_in_time: (property as any).check_in_time || '15:00',
        check_out_time: (property as any).check_out_time || '11:00',
        amenities: property.amenities || [],
        images: property.images || [],
        is_active: property.active !== undefined ? property.active : true,
        location: {
          address: property.address || '',
          city: property.city || 'Trikala',
          country: property.country || 'Greece',
          latitude: undefined,
          longitude: undefined
        },
        floor_level: '', // Will be added to property interface
        nearby_places: [], // Will be added to property interface
        // New editable sections - load actual data from database
        about_space: (property as any).about_space || '',
        the_space: (property as any).the_space || '',
        location_neighborhood: (property as any).location_neighborhood || '',
        house_rules: (property as any).house_rules || ''
      });
      console.log('Form data loaded with existing values:', {
        about_space: (property as any).about_space,
        the_space: (property as any).the_space,
        location_neighborhood: (property as any).location_neighborhood,
        house_rules: (property as any).house_rules
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
        the_space: '',
        location_neighborhood: '',
        house_rules: ''
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

              {formData.the_space && (
                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-6">
                    <h2 className="font-display text-2xl font-semibold mb-4 flex items-center gap-2">
                      <Maximize className="h-6 w-6 text-green-600" />
                      The Space
                    </h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {formData.the_space}
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

              {formData.house_rules && (
                <Card className="border-l-4 border-l-orange-500">
                  <CardContent className="p-6">
                    <h2 className="font-display text-2xl font-semibold mb-4 flex items-center gap-2">
                      <Shield className="h-6 w-6 text-orange-600" />
                      House Rules
                    </h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {formData.house_rules}
                    </p>
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

                  {/* The Space */}
                  <Card className="border-2 border-dashed border-green-200 hover:border-green-300 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <Maximize className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <Label className="text-base font-medium">The Space</Label>
                            <p className="text-sm text-muted-foreground">Build your space description with clicks</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const spaceItems = [
                              `• Open-plan living area with comfortable seating for ${formData.max_guests} guests`,
                              `• Fully equipped modern kitchen with premium appliances`,
                              `• ${formData.bedrooms} spacious bedroom${formData.bedrooms > 1 ? 's' : ''} with quality bedding`,
                              `• ${formData.bathrooms} modern bathroom${formData.bathrooms > 1 ? 's' : ''} with premium amenities`,
                              formData.size_sqm ? `• ${formData.size_sqm}m² of thoughtfully designed living space` : null,
                              `• High-speed Wi-Fi throughout the property`,
                              `• Climate control for year-round comfort`
                            ].filter(Boolean).join('\n');
                            setFormData(prev => ({ ...prev, the_space: spaceItems }));
                          }}
                          className="text-green-600 border-green-600 hover:bg-green-50"
                        >
                          <Home className="h-4 w-4 mr-2" />
                          Auto-Build
                        </Button>
                      </div>

                      {formData.the_space ? (
                        <div className="space-y-3">
                          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <pre className="text-sm whitespace-pre-wrap font-sans">{formData.the_space}</pre>
                          </div>
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const additions = [
                                  "• Private balcony with stunning views",
                                  "• Dedicated workspace area",
                                  "• Premium sound system",
                                  "• Walk-in closet with ample storage",
                                  "• Floor-to-ceiling windows",
                                  "• Hardwood floors throughout"
                                ];
                                const randomAddition = additions[Math.floor(Math.random() * additions.length)];
                                setFormData(prev => ({
                                  ...prev,
                                  the_space: prev.the_space + '\n' + randomAddition
                                }));
                              }}
                              className="text-green-600"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Feature
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const editArea = document.getElementById('the_space_edit');
                                if (editArea) {
                                  editArea.style.display = editArea.style.display === 'none' ? 'block' : 'none';
                                }
                              }}
                              className="text-green-600"
                            >
                              <Edit3 className="h-4 w-4 mr-2" />
                              Customize
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setFormData(prev => ({ ...prev, the_space: '' }))}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Clear All
                            </Button>
                          </div>
                          <div id="the_space_edit" style={{ display: 'none' }}>
                            <Textarea
                              value={formData.the_space}
                              onChange={(e) => setFormData(prev => ({ ...prev, the_space: e.target.value }))}
                              placeholder="Customize your space description here...&#10;Use bullet points (•) for better formatting"
                              rows={6}
                              className="resize-none font-mono text-sm"
                            />
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-muted-foreground">
                                <FileText className="h-3 w-3 inline mr-1" />
                                Tip: Each line starting with • becomes a bullet point
                              </span>
                              <Button
                                size="sm"
                                onClick={() => {
                                  document.getElementById('the_space_edit').style.display = 'none';
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
                        <div className="text-center py-8 border-2 border-dashed border-green-200 rounded-lg">
                          <Maximize className="h-12 w-12 text-green-300 mx-auto mb-3" />
                          <p className="text-sm text-muted-foreground mb-3">Auto-generate space description based on your property details</p>
                          <Button
                            variant="outline"
                            onClick={() => {
                              const spaceItems = [
                                `• Open-plan living area with comfortable seating for ${formData.max_guests} guests`,
                                `• Fully equipped modern kitchen with premium appliances`,
                                `• ${formData.bedrooms} spacious bedroom${formData.bedrooms > 1 ? 's' : ''} with quality bedding`,
                                `• ${formData.bathrooms} modern bathroom${formData.bathrooms > 1 ? 's' : ''} with premium amenities`
                              ].join('\n');
                              setFormData(prev => ({ ...prev, the_space: spaceItems }));
                            }}
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            <Zap className="h-4 w-4 mr-2" />
                            Auto-Generate
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

                  {/* House Rules */}
                  <Card className="border-2 border-dashed border-orange-200 hover:border-orange-300 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Shield className="h-4 w-4 text-orange-600" />
                          </div>
                          <div>
                            <Label className="text-base font-medium">House Rules</Label>
                            <p className="text-sm text-muted-foreground">Build professional rules with smart templates</p>
                          </div>
                        </div>
                      </div>

                      {formData.house_rules ? (
                        <div className="space-y-3">
                          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                            <pre className="text-sm whitespace-pre-wrap font-sans">{formData.house_rules}</pre>
                          </div>
                          <div className="grid grid-cols-5 gap-2 mb-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const safetyRules = [
                                  "• No smoking anywhere on the property",
                                  "• No candles or open flames",
                                  "• Please lock doors when leaving",
                                  "• Emergency contact provided upon arrival"
                                ];
                                const randomRule = safetyRules[Math.floor(Math.random() * safetyRules.length)];
                                setFormData(prev => ({
                                  ...prev,
                                  house_rules: prev.house_rules + '\n' + randomRule
                                }));
                              }}
                              className="text-orange-600"
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              Safety
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const noiseRules = [
                                  "• Quiet hours: 22:00 - 08:00",
                                  "• No parties or large gatherings",
                                  "• Please be considerate of neighbors",
                                  "• Keep music at reasonable volume"
                                ];
                                const randomRule = noiseRules[Math.floor(Math.random() * noiseRules.length)];
                                setFormData(prev => ({
                                  ...prev,
                                  house_rules: prev.house_rules + '\n' + randomRule
                                }));
                              }}
                              className="text-orange-600"
                            >
                              <Volume2 className="h-4 w-4 mr-2" />
                              Noise
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const cleanRules = [
                                  "• Please keep the space tidy",
                                  "• Wash dishes after use",
                                  "• Take out trash before departure",
                                  "• Report any damages immediately"
                                ];
                                const randomRule = cleanRules[Math.floor(Math.random() * cleanRules.length)];
                                setFormData(prev => ({
                                  ...prev,
                                  house_rules: prev.house_rules + '\n' + randomRule
                                }));
                              }}
                              className="text-orange-600"
                            >
                              <CleanIcon className="h-4 w-4 mr-2" />
                              Clean
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const editArea = document.getElementById('rules_edit');
                                if (editArea) {
                                  editArea.style.display = editArea.style.display === 'none' ? 'block' : 'none';
                                }
                              }}
                              className="text-orange-600"
                            >
                              <Edit3 className="h-4 w-4 mr-2" />
                              Custom Rules
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setFormData(prev => ({ ...prev, house_rules: '' }))}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Clear
                            </Button>
                          </div>
                          <div id="rules_edit" style={{ display: 'none' }}>
                            <Textarea
                              value={formData.house_rules}
                              onChange={(e) => setFormData(prev => ({ ...prev, house_rules: e.target.value }))}
                              placeholder="Write your custom house rules...&#10;&#10;Example:&#10;Essential House Rules:&#10;&#10;• No smoking inside the property&#10;• Maximum 4 guests&#10;• Quiet hours: 22:00 - 08:00&#10;• Check-in after 15:00&#10;• Please treat the space with respect"
                              rows={8}
                              className="resize-none font-mono text-sm"
                            />
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-muted-foreground">
                                <AlertTriangle className="h-3 w-3 inline mr-1" />
                                Be clear and specific about your expectations
                              </span>
                              <Button
                                size="sm"
                                onClick={() => {
                                  document.getElementById('rules_edit').style.display = 'none';
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
                        <div className="text-center py-8 border-2 border-dashed border-orange-200 rounded-lg">
                          <Shield className="h-12 w-12 text-orange-300 mx-auto mb-3" />
                          <p className="text-sm text-muted-foreground mb-4">Choose your house rules style</p>
                          <div className="grid grid-cols-2 gap-3">
                            <Button
                              variant="outline"
                              onClick={() => {
                                const basicRules = `Essential House Rules:\n\n• No smoking inside the property\n• Maximum ${formData.max_guests} guests\n• Check-in after ${formData.check_in_time}\n• Check-out before ${formData.check_out_time}\n• Quiet hours: 22:00 - 08:00\n• Please treat the space with respect`;
                                setFormData(prev => ({ ...prev, house_rules: basicRules }));
                              }}
                              className="text-orange-600 border-orange-600 hover:bg-orange-50"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Basic Rules
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                const strictRules = `Comprehensive House Rules:\n\n• Strictly no smoking or vaping\n• No parties, events, or loud gatherings\n• Maximum ${formData.max_guests} guests (no exceptions)\n• Quiet hours: 22:00 - 08:00 daily\n• Check-in: ${formData.check_in_time} | Check-out: ${formData.check_out_time}\n• No pets without prior approval\n• Please remove shoes inside\n• Report any issues immediately`;
                                setFormData(prev => ({ ...prev, house_rules: strictRules }));
                              }}
                              className="text-orange-600 border-orange-600 hover:bg-orange-50"
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              Detailed Rules
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
