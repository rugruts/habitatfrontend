import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { 
  MapPin, Plus, Edit3, Trash2, Eye, EyeOff, Search, Filter, 
  Map, Settings, Globe, Target, Navigation, Save, X, AlertCircle,
  Star, Info, ExternalLink, Phone, Clock, Tag, Layers, Grid,
  MoreHorizontal, Copy, Check, ArrowUpDown, ChevronDown
} from 'lucide-react';
import { CustomMapPinsService, CustomMapPin, PinCategory } from '@/services/CustomMapPinsService';
import { IconSelector } from './IconSelector';
import * as LucideIcons from 'lucide-react';

// Helper function to get SVG path for icons
const getIconSvgPath = (iconName: string) => {
  const iconPaths: Record<string, string> = {
    'Utensils': '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
    'Landmark': '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12h12"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
    'ShoppingBag': '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    'Bus': '<path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/>',
    'Building': '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12h12"/>',
    'Music': '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    'Trees': '<path d="M10 10v.2A3 3 0 0 1 8.9 16c0 .74-.4 1.38-1 1.72V22h8v-4.28c-.6-.35-1-.98-1-1.72a3 3 0 0 1-1.1-5.8V10a3 3 0 0 0-3-3H13a3 3 0 0 0-3 3Z"/>',
    'Home': '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>',
    'Castle': '<path d="M2 3h20v18H2z"/><path d="M6 3v18"/><path d="M10 3v18"/>',
    'MapPin': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>'
  };
  return iconPaths[iconName] || iconPaths['MapPin'];
};

// Leaflet type definitions
interface LeafletMap {
  remove: () => void;
  setView: (coords: [number, number], zoom: number) => LeafletMap;
  on: (event: string, handler: (e: LeafletEvent) => void) => void;
  off: (event: string, handler: (e: LeafletEvent) => void) => void;
}

interface LeafletEvent {
  latlng: {
    lat: number;
    lng: number;
  };
}

interface LeafletMarker {
  remove: () => void;
  bindPopup: (content: string) => void;
  on: (event: string, handler: () => void) => void;
}

interface LeafletStatic {
  map: (element: HTMLElement) => LeafletMap;
  tileLayer: (url: string, options: Record<string, unknown>) => {
    addTo: (map: LeafletMap) => void;
  };
  divIcon: (options: {
    className: string;
    html: string;
    iconSize: [number, number];
    iconAnchor: [number, number];
    popupAnchor: [number, number];
  }) => unknown;
  marker: (coords: [number, number], options: { icon: unknown }) => LeafletMarker & {
    addTo: (map: LeafletMap) => LeafletMarker;
  };
}

// Enhanced Interactive Map Component for Admin
const AdminMapEditor: React.FC<{
  onAddPin: (lat: number, lng: number) => void;
  pins: CustomMapPin[];
  selectedPin?: CustomMapPin | null;
  onPinSelect: (pin: CustomMapPin | null) => void;
}> = ({ onAddPin, pins, selectedPin, onPinSelect }) => {
  const [isAddingMode, setIsAddingMode] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Record<string, LeafletMarker>>({});

  useEffect(() => {
    if (!mapRef.current) return;

    const loadLeaflet = async () => {
      // Load CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        document.head.appendChild(link);
      }

      // Load JS
      if (!(window as Window & { L?: LeafletStatic }).L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        script.crossOrigin = '';
        script.onload = () => {
          initializeMap();
        };
        document.head.appendChild(script);
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      const L = (window as Window & { L?: LeafletStatic }).L;
      if (!L || !mapRef.current) return;

      // Create map centered on Trikala
      const map = L.map(mapRef.current).setView([39.5551, 21.7669], 14);
      mapInstanceRef.current = map;

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Handle map clicks
      const handleMapClick = (e: LeafletEvent) => {
        if (isAddingMode) {
          onAddPin(e.latlng.lat, e.latlng.lng);
          setIsAddingMode(false);
        } else {
          onPinSelect(null);
        }
      };

      map.on('click', handleMapClick);
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, [isAddingMode, onAddPin, onPinSelect]);

  // Update markers when pins change
  useEffect(() => {
    const L = (window as Window & { L?: LeafletStatic }).L;
    if (!L || !mapInstanceRef.current) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => {
      if (marker && typeof marker === 'object' && 'remove' in marker) {
        marker.remove();
      }
    });
    markersRef.current = {};

    // Add new markers
    pins.forEach(pin => {
      const isSelected = selectedPin?.id === pin.id;
      
      const pinIcon = L.divIcon({
        className: 'custom-admin-pin',
        html: `
          <div style="
            width: 36px; 
            height: 36px; 
            background: ${isSelected ? '#fbbf24' : pin.color}; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.3); 
            border: 3px solid ${isSelected ? '#f59e0b' : 'white'};
            position: relative;
            transform: ${isSelected ? 'scale(1.1)' : 'scale(1)'};
            transition: all 0.2s ease;
          ">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              ${getIconSvgPath(pin.icon_name)}
            </svg>
            ${pin.is_featured ? `
              <div style="
                position: absolute;
                top: -4px;
                right: -4px;
                width: 16px;
                height: 16px;
                background: #fbbf24;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 2px solid white;
              ">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
            ` : ''}
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18]
      });

      const marker = L.marker([pin.latitude, pin.longitude], { icon: pinIcon }).addTo(mapInstanceRef.current);
      
      marker.bindPopup(`
        <div style="padding: 12px; min-width: 220px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <strong style="flex: 1; font-size: 16px;">${pin.name}</strong>
            ${pin.is_featured ? '<span style="color: #fbbf24;">⭐</span>' : ''}
          </div>
          ${pin.description ? `<p style="margin: 6px 0; color: #666; font-size: 14px;">${pin.description}</p>` : ''}
          <div style="margin: 8px 0;">
            <span style="background: ${pin.color}; color: white; padding: 4px 10px; border-radius: 12px; font-size: 12px; text-transform: capitalize;">
              ${pin.category}
            </span>
          </div>
          ${pin.address ? `<p style="margin: 6px 0; color: #888; font-size: 12px;">📍 ${pin.address}</p>` : ''}
          <div style="margin-top: 12px; display: flex; gap: 8px;">
            <button onclick="window.selectPin('${pin.id}')" style="
              background: #3b82f6; 
              color: white; 
              border: none; 
              padding: 6px 12px; 
              border-radius: 4px;
              cursor: pointer;
              font-size: 12px;
              flex: 1;
            ">Edit Pin</button>
          </div>
        </div>
      `);

      marker.on('click', () => {
        onPinSelect(pin);
      });

      markersRef.current[pin.id] = marker;
    });

    // Global function for popup buttons
    (window as Window & { selectPin?: (pinId: string) => void }).selectPin = (pinId: string) => {
      const pin = pins.find(p => p.id === pinId);
      if (pin) onPinSelect(pin);
    };

  }, [pins, selectedPin, onPinSelect]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Interactive Map Editor</h3>
        <div className="flex items-center gap-2">
          <Button
            variant={isAddingMode ? "destructive" : "outline"}
            size="sm"
            onClick={() => setIsAddingMode(!isAddingMode)}
          >
            {isAddingMode ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Cancel Adding
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Pin
              </>
            )}
          </Button>
        </div>
      </div>

      {isAddingMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-900">Add New Pin Mode</span>
          </div>
          <p className="text-sm text-blue-800">
            Click anywhere on the map to add a new custom pin at that location.
          </p>
        </div>
      )}

      <div className="relative">
        <div 
          ref={mapRef} 
          className="w-full h-96 rounded-lg border"
          style={{ minHeight: '400px' }}
        />
        {selectedPin && (
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 border max-w-xs">
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: selectedPin.color }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  {getIconSvgPath(selectedPin.icon_name)}
                </svg>
              </div>
              <span className="font-medium text-sm">{selectedPin.name}</span>
            </div>
            {selectedPin.description && (
              <p className="text-xs text-gray-600 mb-2">{selectedPin.description}</p>
            )}
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs">
                {selectedPin.category}
              </Badge>
              {selectedPin.is_featured && (
                <Badge variant="secondary" className="text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="text-sm text-gray-600 text-center">
        {pins.length} pins displayed • Click a pin to select and edit
      </div>
    </div>
  );
};

// Pin Form Component
const PinForm: React.FC<{
  pin?: CustomMapPin | null;
  categories: PinCategory[];
  onSave: (pin: Partial<CustomMapPin>) => Promise<void>;
  onCancel: () => void;
  initialCoordinates?: { lat: number; lng: number };
}> = ({ pin, categories, onSave, onCancel, initialCoordinates }) => {
  const [formData, setFormData] = useState<Partial<CustomMapPin>>({
    name: '',
    description: '',
    category: 'general',
    icon_name: 'MapPin',
    latitude: initialCoordinates?.lat || 39.5551,
    longitude: initialCoordinates?.lng || 21.7669,
    is_active: true,
    is_featured: false,
    color: '#3b82f6',
    address: '',
    website_url: '',
    phone_number: '',
    tags: [],
    priority: 1,
    show_on_property_maps: true,
    show_on_guide_maps: true,
    show_on_overview_maps: true,
    ...pin
  });

  const [showIconSelector, setShowIconSelector] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!formData.name?.trim()) {
      toast.error('Pin name is required');
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
      toast.success(pin ? 'Pin updated successfully' : 'Pin created successfully');
      onCancel();
    } catch (error) {
      console.error('Error saving pin:', error);
      toast.error('Failed to save pin');
    } finally {
      setSaving(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[iconName];
    return IconComponent || LucideIcons.MapPin;
  };

  const SelectedIcon = getIconComponent(formData.icon_name || 'MapPin');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {pin ? 'Edit Custom Pin' : 'Create New Custom Pin'}
        </h3>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="pin-name">Pin Name *</Label>
            <Input
              id="pin-name"
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Central Square, Local Restaurant"
            />
          </div>

          <div>
            <Label htmlFor="pin-description">Description</Label>
            <Textarea
              id="pin-description"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of this location..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pin-category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.name}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Icon</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowIconSelector(true)}
                  className="flex items-center gap-2"
                >
                  <SelectedIcon className="h-4 w-4" />
                  {formData.icon_name}
                </Button>
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center border-2"
                  style={{ backgroundColor: formData.color, borderColor: formData.color }}
                >
                  <SelectedIcon className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Location Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pin-latitude">Latitude</Label>
              <Input
                id="pin-latitude"
                type="number"
                step="any"
                value={formData.latitude || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, latitude: parseFloat(e.target.value) || 0 }))}
                placeholder="39.5551"
              />
            </div>
            <div>
              <Label htmlFor="pin-longitude">Longitude</Label>
              <Input
                id="pin-longitude"
                type="number"
                step="any"
                value={formData.longitude || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, longitude: parseFloat(e.target.value) || 0 }))}
                placeholder="21.7669"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="pin-address">Address</Label>
            <Input
              id="pin-address"
              value={formData.address || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Street address or location description"
            />
          </div>
        </CardContent>
      </Card>

      {/* Appearance & Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Appearance & Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pin-color">Pin Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="pin-color"
                  type="color"
                  value={formData.color || '#3b82f6'}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="w-20 h-10"
                />
                <span className="text-sm text-gray-600">{formData.color}</span>
              </div>
            </div>

            <div>
              <Label htmlFor="pin-priority">Priority</Label>
              <Select 
                value={formData.priority?.toString() || '1'} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, priority: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 - Highest</SelectItem>
                  <SelectItem value="4">4 - High</SelectItem>
                  <SelectItem value="3">3 - Medium</SelectItem>
                  <SelectItem value="2">2 - Low</SelectItem>
                  <SelectItem value="1">1 - Lowest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="is-active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is-active">Active</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is-featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
              />
              <Label htmlFor="is-featured">Featured</Label>
            </div>
          </div>

          <Separator />

          <div>
            <Label className="text-sm font-medium mb-3 block">Show on Maps</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-property"
                  checked={formData.show_on_property_maps}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, show_on_property_maps: checked }))}
                />
                <Label htmlFor="show-property" className="text-sm">Property Maps</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="show-guide"
                  checked={formData.show_on_guide_maps}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, show_on_guide_maps: checked }))}
                />
                <Label htmlFor="show-guide" className="text-sm">Guide Maps</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="show-overview"
                  checked={formData.show_on_overview_maps}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, show_on_overview_maps: checked }))}
                />
                <Label htmlFor="show-overview" className="text-sm">Overview Maps</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {pin ? 'Update Pin' : 'Create Pin'}
            </>
          )}
        </Button>
      </div>

      {/* Icon Selector */}
      <IconSelector
        isOpen={showIconSelector}
        onClose={() => setShowIconSelector(false)}
        onSelect={(iconName) => {
          setFormData(prev => ({ ...prev, icon_name: iconName }));
          setShowIconSelector(false);
        }}
        selectedIcon={formData.icon_name}
      />
    </div>
  );
};

// Main CustomMapPinsManagement Component
export const CustomMapPinsManagement: React.FC = () => {
  const [pins, setPins] = useState<CustomMapPin[]>([]);
  const [categories, setCategories] = useState<PinCategory[]>([]);
  const [selectedPin, setSelectedPin] = useState<CustomMapPin | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newPinCoordinates, setNewPinCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pinsData, categoriesData] = await Promise.all([
        CustomMapPinsService.getAllMapPins(),
        CustomMapPinsService.getPinCategories()
      ]);
      setPins(pinsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load map pins data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPin = (lat: number, lng: number) => {
    setNewPinCoordinates({ lat, lng });
    setSelectedPin(null);
    setShowForm(true);
  };

  const handleEditPin = (pin: CustomMapPin) => {
    setSelectedPin(pin);
    setNewPinCoordinates(null);
    setShowForm(true);
  };

  const handleSavePin = async (pinData: Partial<CustomMapPin>) => {
    if (selectedPin) {
      // Update existing pin
      await CustomMapPinsService.updateMapPin(selectedPin.id, pinData);
    } else {
      // Create new pin
      await CustomMapPinsService.createMapPin(pinData as Omit<CustomMapPin, 'id' | 'created_at' | 'updated_at'>);
    }
    await loadData();
    setShowForm(false);
    setSelectedPin(null);
    setNewPinCoordinates(null);
  };

  const handleDeletePin = async (pinId: string) => {
    if (confirm('Are you sure you want to delete this pin?')) {
      try {
        await CustomMapPinsService.deleteMapPin(pinId);
        await loadData();
        toast.success('Pin deleted successfully');
        if (selectedPin?.id === pinId) {
          setSelectedPin(null);
        }
      } catch (error) {
        console.error('Error deleting pin:', error);
        toast.error('Failed to delete pin');
      }
    }
  };

  const handleToggleStatus = async (pinId: string) => {
    try {
      await CustomMapPinsService.toggleMapPinStatus(pinId);
      await loadData();
      toast.success('Pin status updated');
    } catch (error) {
      console.error('Error updating pin status:', error);
      toast.error('Failed to update pin status');
    }
  };

  const filteredPins = pins.filter(pin => {
    const matchesSearch = pin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pin.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pin.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || pin.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Set up global functions for map popup buttons
  useEffect(() => {
    const windowWithGlobals = window as Window & {
      selectPin?: (pinId: string) => void;
      deletePin?: (pinId: string) => void;
    };
    
    windowWithGlobals.selectPin = (pinId: string) => {
      const pin = pins.find(p => p.id === pinId);
      if (pin) handleEditPin(pin);
    };

    windowWithGlobals.deletePin = (pinId: string) => {
      handleDeletePin(pinId);
    };
  }, [pins, handleDeletePin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3" />
        Loading map pins...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display">Custom Map Pins</h2>
          <p className="text-muted-foreground">Manage global pins that appear on all maps</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Pin
        </Button>
      </div>

      {!showForm ? (
        <Tabs defaultValue="map" className="space-y-6">
          <TabsList>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              Map View
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <Grid className="h-4 w-4" />
              List View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="space-y-4">
            <AdminMapEditor
              onAddPin={handleAddPin}
              pins={pins}
              selectedPin={selectedPin}
              onPinSelect={setSelectedPin}
            />
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search pins..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.name}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Pins Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Custom Pins ({filteredPins.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pin</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPins.map((pin) => {
                      const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[pin.icon_name] || LucideIcons.MapPin;
                      return (
                        <TableRow key={pin.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: pin.color }}
                              >
                                <IconComponent className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <div className="font-medium flex items-center gap-2">
                                  {pin.name}
                                  {pin.is_featured && <Star className="h-3 w-3 text-yellow-500" />}
                                </div>
                                {pin.description && (
                                  <div className="text-sm text-muted-foreground">{pin.description}</div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{pin.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{pin.latitude.toFixed(6)}, {pin.longitude.toFixed(6)}</div>
                              {pin.address && <div className="text-muted-foreground">{pin.address}</div>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={pin.is_active}
                                onCheckedChange={() => handleToggleStatus(pin.id)}
                              />
                              <span className="text-sm">
                                {pin.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditPin(pin)}
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeletePin(pin.id)}
                                className="text-destructive hover:text-destructive"
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <PinForm
          pin={selectedPin}
          categories={categories}
          onSave={handleSavePin}
          onCancel={() => {
            setShowForm(false);
            setSelectedPin(null);
            setNewPinCoordinates(null);
          }}
          initialCoordinates={newPinCoordinates}
        />
      )}
    </div>
  );
};