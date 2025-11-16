import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { 
  Home, MapPin, Upload, X, Plus, Trash2, Edit3, Eye, EyeOff, Save, 
  Sparkles, Settings, FileText, Map, Image as ImageIcon, Globe, Star, 
  Clock, Users, Bed, Bath, Maximize, Euro, Wifi, Wind, ChefHat, Tv, 
  Car, Coffee, Building, Trees, Activity, UserCheck, Unlock, 
  Utensils, Landmark, ShoppingBag, Bus, Bike, Camera, Phone, Mail, 
  Castle, Mountain, TrendingUp, Navigation, AlertCircle, Info, 
  HelpCircle, Lock, Key, Gift, Package, Wrench, Receipt, Tag, Hash, 
  Link, ExternalLink, Search, Filter, Grid, List, Download, RotateCcw, 
  ZoomIn, ZoomOut, Layers, Compass, Check
} from 'lucide-react';
import { IconSelector } from './IconSelector';
import * as LucideIcons from 'lucide-react';

interface Property {
  id: string;
  name: string;
  description: string;
  detailed_description: string;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  base_price: number; // in cents
  amenities: string[];
  images: string[];
  is_active: boolean;
  created_at: string;
  active?: boolean;
  address?: string;
  city?: string;
  country?: string;
  currency?: string;
  property_type?: string;
  latitude?: number;
  longitude?: number;
  nearby_facilities?: NearbyFacility[];
  size_sqm?: number;
  cleaning_fee?: number; // in cents
}

interface NearbyFacility {
  id: string;
  name: string;
  type: string;
  distance: number;
  latitude: number;
  longitude: number;
  icon: string;
}

interface PropertyEditorProps {
  isOpen: boolean;
  onClose: () => void;
  property?: Property | null;
  onSave: (property: Property) => Promise<void>;
}

const AMENITIES_GROUPS = {
  essentials: [
    { id: 'wifi', label: 'WiFi', icon: Wifi, essential: true },
    { id: 'kitchen', label: 'Kitchen', icon: ChefHat, essential: true },
    { id: 'tv', label: 'TV', icon: Tv, essential: true },
    { id: 'ac', label: 'Air Conditioning', icon: Wind, essential: true },
    { id: 'heating', label: 'Heating', icon: Activity, essential: true },
  ],
  comfort: [
    { id: 'parking', label: 'Free Parking', icon: Car },
    { id: 'balcony', label: 'Balcony', icon: Building },
    { id: 'garden', label: 'Garden', icon: Trees },
    { id: 'terrace', label: 'Terrace', icon: Building },
    { id: 'pool', label: 'Pool', icon: Activity },
    { id: 'gym', label: 'Gym', icon: Activity },
  ],
  services: [
    { id: 'cleaning', label: 'Cleaning Service', icon: Sparkles },
    { id: 'laundry', label: 'Washing Machine', icon: Wrench },
    { id: 'dishwasher', label: 'Dishwasher', icon: Wrench },
    { id: 'breakfast', label: 'Breakfast', icon: Coffee },
    { id: 'concierge', label: 'Concierge', icon: UserCheck },
  ],
  accessibility: [
    { id: 'wheelchair', label: 'Wheelchair Accessible', icon: Unlock },
    { id: 'elevator', label: 'Elevator', icon: Building },
    { id: 'ground_floor', label: 'Ground Floor', icon: Building },
    { id: 'wide_doorways', label: 'Wide Doorways', icon: Unlock },
  ]
};

const PROPERTY_TYPES = [
  'Apartment', 'House', 'Villa', 'Condo', 'Studio', 'Loft', 'Cottage', 'Cabin', 'Chalet', 'Penthouse'
];

const FACILITY_TYPES = [
  { id: 'restaurant', label: 'Restaurant', icon: Utensils, color: 'text-orange-500' },
  { id: 'museum', label: 'Museum', icon: Landmark, color: 'text-purple-500' },
  { id: 'park', label: 'Park', icon: Trees, color: 'text-green-500' },
  { id: 'shopping', label: 'Shopping Center', icon: ShoppingBag, color: 'text-blue-500' },
  { id: 'transport', label: 'Public Transport', icon: Bus, color: 'text-red-500' },
  { id: 'pharmacy', label: 'Pharmacy', icon: Package, color: 'text-pink-500' },
  { id: 'hospital', label: 'Hospital', icon: Activity, color: 'text-red-600' },
  { id: 'school', label: 'School', icon: Building, color: 'text-indigo-500' },
  { id: 'bank', label: 'Bank', icon: Building, color: 'text-green-600' },
  { id: 'gym', label: 'Gym', icon: Activity, color: 'text-yellow-500' },
];

// Function to get icon component by name
const getIconComponent = (iconName: string) => {
  const IconComponent = (LucideIcons as any)[iconName];
  return IconComponent || LucideIcons.MapPin;
};

// Function to get SVG path for icons (simplified version)
const getIconSvgPath = (iconName: string) => {
  const iconPaths: Record<string, string> = {
    'Utensils': '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
    'Landmark': '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12h12"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
    'Trees': '<path d="M10 10v.2A3 3 0 0 1 8.9 16c0 .74-.4 1.38-1 1.72V22h8v-4.28c-.6-.35-1-.98-1-1.72a3 3 0 0 1-1.1-5.8V10a3 3 0 0 0-3-3H13a3 3 0 0 0-3 3Z"/><path d="M7 16v6"/><path d="M17 16v6"/><path d="M15 22v-4"/><path d="M9 22v-4"/>',
    'ShoppingBag': '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    'Bus': '<path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.6-1.4 1.6-2.4c1-.6 1.4-1.6 1.4-2.4V6c0-1.4-.6-2.4-1.4-2.4C21.6 2.6 21 2 21 2H3c-.6 0-1.4.6-1.4 1.6C1.6 3.6 1 4.6 1 6v7.2c0 .8.4 1.8 1.4 2.4C3.4 16.6 4 18 4 18h3"/><path d="M7 18v2a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2"/><path d="M16 20h2"/><path d="M6 20h2"/>',
    'Package': '<path d="m12 3-8 4.5v9L12 21l8-4.5v-9L12 3"/><path d="m12 12 8-4.5"/><path d="M12 12v9"/><path d="m12 12-8-4.5"/>',
    'Activity': '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    'Building': '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12h12"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
    'MapPin': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>'
  };
  return iconPaths[iconName] || iconPaths['MapPin'];
};

// WordPress-Style Rich Text Editor Component  
const AdvancedRichTextEditor: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder }) => {
  const [mode, setMode] = useState<'visual' | 'text'>('visual');
  const [textValue, setTextValue] = useState(value);
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && !isInitialized) {
      editorRef.current.innerHTML = value || '';
      setIsInitialized(true);
    }
  }, [editorRef.current, value, isInitialized]);

  // Sync content between modes
  useEffect(() => {
    if (mode === 'visual' && editorRef.current && isInitialized) {
      if (value !== editorRef.current.innerHTML) {
        editorRef.current.innerHTML = value || '';
      }
    } else if (mode === 'text') {
      setTextValue(value);
    }
  }, [mode, value, isInitialized]);

  const execCommand = (command: string, value?: string) => {
    if (mode === 'visual') {
      document.execCommand(command, false, value);
      handleVisualChange();
    }
  };

  const handleVisualChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  };

  const handleTextChange = (newText: string) => {
    setTextValue(newText);
    onChange(newText);
  };

  const formatBlock = (tag: string) => {
    execCommand('formatBlock', `<${tag}>`);
  };

  const insertBlock = (html: string) => {
    execCommand('insertHTML', html);
  };

  const addLink = () => {
    if (mode === 'visual') {
      const selection = window.getSelection();
      if (selection && selection.toString()) {
        setLinkText(selection.toString());
      }
      setShowLinkDialog(true);
    }
  };

  const insertLink = () => {
    if (linkUrl) {
      if (mode === 'visual') {
        const linkHtml = `<a href="${linkUrl}" target="_blank">${linkText || linkUrl}</a>`;
        insertBlock(linkHtml);
      } else {
        const linkMarkdown = `<a href="${linkUrl}" target="_blank">${linkText || linkUrl}</a>`;
        const textarea = textareaRef.current;
        if (textarea) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const newText = textValue.substring(0, start) + linkMarkdown + textValue.substring(end);
          handleTextChange(newText);
        }
      }
      setLinkUrl('');
      setLinkText('');
      setShowLinkDialog(false);
    }
  };

  const insertPrebuiltBlock = (type: string) => {
    let html = '';
    switch (type) {
      case 'property-info':
        html = `
          <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; margin: 16px 0;">
            <h3 style="margin-top: 0; color: #495057;">🏠 Property Highlights</h3>
            <ul style="margin-bottom: 0;">
              <li>Spacious and modern accommodation</li>
              <li>Prime location in the heart of the city</li>
              <li>Fully equipped kitchen and amenities</li>
              <li>Perfect for business or leisure travel</li>
            </ul>
          </div>
        `;
        break;
      case 'amenities':
        html = `
          <div style="background: #e3f2fd; border: 1px solid #2196f3; border-radius: 8px; padding: 20px; margin: 16px 0;">
            <h3 style="margin-top: 0; color: #1976d2;">✨ Featured Amenities</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <div>📶 High-Speed WiFi</div>
              <div>🅿️ Free Parking</div>
              <div>🍳 Full Kitchen</div>
              <div>📺 Smart TV</div>
              <div>❄️ Air Conditioning</div>
              <div>🧺 Washer & Dryer</div>
            </div>
          </div>
        `;
        break;
      case 'location':
        html = `
          <div style="background: #e8f5e8; border: 1px solid #4caf50; border-radius: 8px; padding: 20px; margin: 16px 0;">
            <h3 style="margin-top: 0; color: #388e3c;">📍 Prime Location</h3>
            <p>Located in the vibrant heart of Trikala, you'll be within walking distance of:</p>
            <ul>
              <li>🏛️ Historic city center - 5 minutes</li>
              <li>🛍️ Shopping district - 10 minutes</li>
              <li>🍽️ Restaurants & cafes - 2 minutes</li>
              <li>🚌 Public transportation - 3 minutes</li>
            </ul>
          </div>
        `;
        break;
      case 'house-rules':
        html = `
          <div style="background: #fff3e0; border: 1px solid #ff9800; border-radius: 8px; padding: 20px; margin: 16px 0;">
            <h3 style="margin-top: 0; color: #f57c00;">📋 House Rules</h3>
            <ul>
              <li>Check-in: 3:00 PM - 9:00 PM</li>
              <li>Check-out: 11:00 AM</li>
              <li>No smoking inside the property</li>
              <li>No parties or loud music after 10 PM</li>
              <li>Maximum occupancy as listed</li>
              <li>Please treat the space with respect</li>
            </ul>
          </div>
        `;
        break;
    }
    insertBlock(html);
  };

  return (
    <div className="space-y-3">
      {/* WordPress-Style Header */}
      <div className="flex items-center justify-between bg-white border border-gray-300 rounded-t-lg">
        <div className="flex">
          <Button
            type="button"
            variant={mode === 'visual' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setMode('visual')}
            className="rounded-none border-0"
          >
            Visual
          </Button>
          <Button
            type="button"
            variant={mode === 'text' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setMode('text')}
            className="rounded-none border-0"
          >
            Text
          </Button>
        </div>
        <div className="text-sm text-gray-500 px-3">
          {mode === 'visual' ? 'WYSIWYG Editor' : 'HTML Editor'}
        </div>
      </div>

      {/* Visual Mode Toolbar */}
      {mode === 'visual' && (
        <div className="border-x border-gray-300 bg-gray-50">
          {/* Main Toolbar */}
          <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200">
            {/* Text Formatting */}
            <Button type="button" variant="ghost" size="sm" onClick={() => execCommand('bold')} className="h-8 w-8 p-0 hover:bg-gray-200" title="Bold">
              <strong>B</strong>
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => execCommand('italic')} className="h-8 w-8 p-0 hover:bg-gray-200" title="Italic">
              <em>I</em>
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => execCommand('underline')} className="h-8 w-8 p-0 hover:bg-gray-200" title="Underline">
              <u>U</u>
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => execCommand('strikeThrough')} className="h-8 w-8 p-0 hover:bg-gray-200" title="Strikethrough">
              <s>S</s>
            </Button>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* Headings */}
            <select 
              onChange={(e) => formatBlock(e.target.value)}
              className="h-8 px-2 border border-gray-300 rounded text-sm bg-white"
              defaultValue=""
            >
              <option value="">Format</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
              <option value="h4">Heading 4</option>
              <option value="p">Paragraph</option>
            </select>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* Lists */}
            <Button type="button" variant="ghost" size="sm" onClick={() => execCommand('insertUnorderedList')} className="h-8 w-8 p-0 hover:bg-gray-200" title="Bullet List">
              ≡
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => execCommand('insertOrderedList')} className="h-8 w-8 p-0 hover:bg-gray-200" title="Numbered List">
              ≡#
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => execCommand('outdent')} className="h-8 w-8 p-0 hover:bg-gray-200" title="Decrease Indent">
              ⇤
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => execCommand('indent')} className="h-8 w-8 p-0 hover:bg-gray-200" title="Increase Indent">
              ⇥
            </Button>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* Alignment */}
            <Button type="button" variant="ghost" size="sm" onClick={() => execCommand('justifyLeft')} className="h-8 w-8 p-0 hover:bg-gray-200" title="Align Left">
              ⬅
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => execCommand('justifyCenter')} className="h-8 w-8 p-0 hover:bg-gray-200" title="Center">
              ↔
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => execCommand('justifyRight')} className="h-8 w-8 p-0 hover:bg-gray-200" title="Align Right">
              ➡
            </Button>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* Links & Media */}
            <Button type="button" variant="ghost" size="sm" onClick={addLink} className="h-8 w-8 p-0 hover:bg-gray-200" title="Insert Link">
              🔗
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => execCommand('insertHorizontalRule')} className="h-8 w-8 p-0 hover:bg-gray-200" title="Horizontal Line">
              ➖
            </Button>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* Quick Blocks */}
            <select 
              onChange={(e) => {
                if (e.target.value) {
                  insertPrebuiltBlock(e.target.value);
                  e.target.value = '';
                }
              }}
              className="h-8 px-2 border border-gray-300 rounded text-sm bg-white"
              defaultValue=""
            >
              <option value="">Add Block</option>
              <option value="property-info">🏠 Property Info</option>
              <option value="amenities">✨ Amenities</option>
              <option value="location">📍 Location</option>
              <option value="house-rules">📋 House Rules</option>
            </select>
          </div>
        </div>
      )}

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="bg-white border border-gray-300 p-4 space-y-3">
          <h4 className="font-medium">Insert Link</h4>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Link Text</label>
              <Input
                placeholder="Link text (optional)"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">URL</label>
              <Input
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && insertLink()}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" onClick={insertLink} size="sm">
              Insert Link
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowLinkDialog(false)} size="sm">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Editor Content */}
      <div className="border-x border-b border-gray-300 rounded-b-lg">
        {mode === 'visual' ? (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleVisualChange}
            onBlur={handleVisualChange}
            className="min-h-[400px] p-4 bg-white focus:outline-none prose prose-lg max-w-none visual-editor"
            style={{
              fontSize: '16px',
              lineHeight: '1.6',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              wordWrap: 'break-word',
              overflowWrap: 'break-word'
            }}
            data-placeholder={!value ? placeholder : ''}
            suppressContentEditableWarning={true}
          />
        ) : (
          <Textarea
            ref={textareaRef}
            value={textValue}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={placeholder || "Enter HTML content..."}
            className="min-h-[400px] p-4 border-0 rounded-none font-mono text-sm resize-none focus:ring-0"
            style={{ fontFamily: 'Monaco, "Cascadia Code", "SF Mono", monospace' }}
          />
        )}
      </div>

      {/* WordPress-style footer info */}
      <div className="text-xs text-gray-500 px-1">
        {mode === 'visual' 
          ? "You are using the visual editor. Switch to Text mode to edit HTML directly."
          : "You are editing HTML. Switch to Visual mode for WYSIWYG editing."
        }
      </div>
    </div>
  );
};

// Interactive Map Component with Leaflet
const InteractiveMapEditor: React.FC<{
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
  nearbyFacilities: NearbyFacility[];
  onFacilityAdd: (facility: NearbyFacility) => void;
  onFacilityRemove: (id: string) => void;
}> = ({ latitude, longitude, onLocationChange, nearbyFacilities, onFacilityAdd, onFacilityRemove }) => {
  const [selectedFacilityType, setSelectedFacilityType] = useState('restaurant');
  const [isAddingFacility, setIsAddingFacility] = useState(false);
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [customFacilityName, setCustomFacilityName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('MapPin');
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Record<string, unknown>>({});

  // Leaflet types
  interface LeafletMap {
    remove: () => void;
    setView: (coords: [number, number], zoom: number) => LeafletMap;
    on: (event: string, handler: (e: any) => void) => void;
    off: (event: string, handler: (e: any) => void) => void;
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
    marker: (coords: [number, number], options: { icon: unknown }) => {
      addTo: (map: LeafletMap) => {
        bindPopup: (content: string) => void;
        on: (event: string, handler: (e: any) => void) => void;
        remove: () => void;
      };
    };
  }

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

      // Create map
      const map = L.map(mapRef.current).setView([latitude, longitude], 16);
      mapInstanceRef.current = map;

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Create custom HL icon for property
      const hlIcon = L.divIcon({
        className: 'custom-hl-marker',
        html: `
          <div style="
            width: 32px; 
            height: 32px; 
            background: hsl(var(--primary)); 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.3); 
            border: 2px solid white;
            position: relative;
          ">
            <span style="color: white; font-weight: bold; font-size: 12px;">HL</span>
            <div style="
              position: absolute;
              bottom: -6px;
              left: 50%;
              transform: translateX(-50%);
              width: 0;
              height: 0;
              border-left: 6px solid transparent;
              border-right: 6px solid transparent;
              border-top: 6px solid hsl(var(--primary));
            "></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });

      // Add property marker
      const propertyMarker = L.marker([latitude, longitude], { icon: hlIcon }).addTo(map);
      propertyMarker.bindPopup(`
        <div style="text-align: center; padding: 8px;">
          <strong>Property Location</strong><br>
          <small>Click to add nearby facilities</small>
        </div>
      `);

             // Handle map clicks for adding facilities
             const handleMapClick = (e: any) => {
               if (!isAddingFacility && !showIconSelector) return;
               
               if (showIconSelector) {
                 // Add custom facility - use default name if none provided
                 const facilityName = customFacilityName.trim() || 'Custom Facility';
                 const newFacility: NearbyFacility = {
                   id: Date.now().toString(),
                   name: facilityName,
                   type: 'custom',
                   distance: 0,
                   latitude: e.latlng.lat,
                   longitude: e.latlng.lng,
                   icon: selectedIcon
                 };
                 onFacilityAdd(newFacility);
                 setShowIconSelector(false);
                 setCustomFacilityName('');
                 setSelectedIcon('MapPin');
                 toast.success(`Added "${facilityName}" to map!`);
               } else if (isAddingFacility) {
                 // Add preset facility
                 const facilityType = FACILITY_TYPES.find(type => type.id === selectedFacilityType);
                 const newFacility: NearbyFacility = {
                   id: Date.now().toString(),
                   name: `${facilityType?.label || 'Facility'}`,
                   type: selectedFacilityType,
                   distance: 0,
                   latitude: e.latlng.lat,
                   longitude: e.latlng.lng,
                   icon: facilityType?.id || 'default'
                 };
                 onFacilityAdd(newFacility);
                 setIsAddingFacility(false);
                 toast.success(`Added ${facilityType?.label || 'Facility'} to map!`);
               }
             };

      map.on('click', handleMapClick);

      // Cleanup function
      return () => {
        map.off('click', handleMapClick);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }
      };
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, [latitude, longitude, isAddingFacility, selectedFacilityType, onFacilityAdd]);

  // Update facility markers when facilities change
  useEffect(() => {
    const L = (window as Window & { L?: LeafletStatic }).L;
    if (!L || !mapInstanceRef.current) return;

    // Clear existing facility markers
    Object.values(markersRef.current).forEach(marker => {
      if (marker && typeof marker === 'object' && 'remove' in marker) {
        (marker as { remove: () => void }).remove();
      }
    });
    markersRef.current = {};

    // Add new facility markers
    nearbyFacilities.forEach(facility => {
      const facilityType = FACILITY_TYPES.find(type => type.id === facility.type);
      
      // Create facility icon with proper color
      const color = facilityType?.color?.replace('text-', '') || '#6b7280';
      const bgColor = color === 'orange-500' ? '#f97316' : 
                     color === 'purple-500' ? '#a855f7' : 
                     color === 'green-500' ? '#22c55e' : 
                     color === 'blue-500' ? '#3b82f6' : 
                     color === 'red-500' ? '#ef4444' : 
                     color === 'pink-500' ? '#ec4899' : 
                     color === 'red-600' ? '#dc2626' : 
                     color === 'indigo-500' ? '#6366f1' : 
                     color === 'green-600' ? '#16a34a' : 
                     color === 'yellow-500' ? '#eab308' : '#6b7280';
      
             // Create facility icon with proper SVG icon
       const IconComponent = getIconComponent(facility.icon);
       const facilityIcon = L.divIcon({
         className: 'facility-marker',
         html: `
           <div style="
             width: 32px; 
             height: 32px; 
             background: ${bgColor}; 
             border-radius: 50%; 
             display: flex; 
             align-items: center; 
             justify-content: center; 
             box-shadow: 0 2px 6px rgba(0,0,0,0.3); 
             border: 2px solid white;
             position: relative;
           ">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               ${getIconSvgPath(facility.icon)}
             </svg>
           </div>
         `,
         iconSize: [32, 32],
         iconAnchor: [16, 16],
         popupAnchor: [0, -16]
       });

      const marker = L.marker([facility.latitude, facility.longitude], { icon: facilityIcon }).addTo(mapInstanceRef.current);
      
      // Create a unique function name for each facility
      const removeFunctionName = `removeFacility_${facility.id.replace(/[^a-zA-Z0-9]/g, '_')}`;
      
      marker.bindPopup(`
        <div style="text-align: center; padding: 8px;">
          <strong>${facility.name}</strong><br>
          <small>${facility.type}</small><br>
          <button onclick="${removeFunctionName}()" style="
            background: #ef4444; 
            color: white; 
            border: none; 
            padding: 4px 8px; 
            border-radius: 4px; 
            margin-top: 4px;
            cursor: pointer;
          ">Remove</button>
        </div>
      `);

      // Store the marker reference
      markersRef.current[facility.id] = marker;
      
      // Create a unique global function for this facility
      (window as any)[removeFunctionName] = () => {
        onFacilityRemove(facility.id);
      };
    });
  }, [nearbyFacilities, onFacilityRemove]);

  const handleAddFacilityClick = () => {
    setIsAddingFacility(true);
  };

  const handleCancelAdd = () => {
    setIsAddingFacility(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Location & Nearby Facilities</h3>
        <div className="flex items-center gap-2">
          {!isAddingFacility ? (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddingFacility(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Preset Facility
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowIconSelector(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Facility
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleCancelAdd}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Custom Facility Form */}
      {showIconSelector && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Facility name..."
              value={customFacilityName}
              onChange={(e) => setCustomFacilityName(e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowIconSelector(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-blue-800">
            Click on the map to add a custom facility with the selected icon
          </p>
        </div>
      )}

      {/* Preset Facility Selection */}
      {isAddingFacility && !showIconSelector && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Select value={selectedFacilityType} onValueChange={setSelectedFacilityType}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FACILITY_TYPES.map(type => (
                  <SelectItem key={type.id} value={type.id}>
                    <div className="flex items-center gap-2">
                      {React.createElement(type.icon, { className: "h-4 w-4" })}
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-blue-800">
            Click on the map to add a {FACILITY_TYPES.find(t => t.id === selectedFacilityType)?.label?.toLowerCase()} facility
          </p>
        </div>
      )}

      {isAddingFacility && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            Click on the map to add a {FACILITY_TYPES.find(t => t.id === selectedFacilityType)?.label?.toLowerCase()} facility
          </p>
        </div>
      )}

      <div className="relative">
        <div 
          ref={mapRef} 
          className="w-full h-96 rounded-lg border"
          style={{ minHeight: '384px' }}
        />
      </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
         {nearbyFacilities.map(facility => {
           const facilityType = FACILITY_TYPES.find(type => type.id === facility.type);
           const IconComponent = getIconComponent(facility.icon);
           return (
             <Card key={facility.id} className="relative">
               <CardContent className="p-4">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="p-2 rounded-full bg-muted">
                       <IconComponent className="h-4 w-4" />
                     </div>
                     <div>
                       <h4 className="font-medium">{facility.name}</h4>
                       <p className="text-sm text-muted-foreground">{facility.type}</p>
                     </div>
                   </div>
                   <Button
                     type="button"
                     variant="ghost"
                     size="sm"
                     onClick={() => onFacilityRemove(facility.id)}
                   >
                     <Trash2 className="h-4 w-4" />
                   </Button>
                 </div>
               </CardContent>
             </Card>
           );
         })}
       </div>

       {/* Icon Selector */}
       <IconSelector
         isOpen={showIconSelector}
         onClose={() => setShowIconSelector(false)}
         onSelect={(iconName) => {
           setSelectedIcon(iconName);
           setShowIconSelector(false);
         }}
         selectedIcon={selectedIcon}
       />
     </div>
   );
 };

// Image Upload Component with Drag & Drop Reordering
const ImageUploader: React.FC<{
  images: string[];
  onImagesChange: (images: string[]) => void;
}> = ({ images, onImagesChange }) => {
  const [uploading, setUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const uploadImageToSupabase = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `property-images/${fileName}`;

    const { data, error } = await supabase.storage
      .from('property-images')
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('property-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleFileUpload = async (files: FileList) => {
    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(file => uploadImageToSupabase(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      onImagesChange([...images, ...uploadedUrls]);
      toast.success(`${files.length} image(s) uploaded successfully!`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (index: number) => {
    const imageUrl = images[index];
    
    try {
      // Extract file path from URL for deletion
      if (imageUrl.includes('supabase.co')) {
        const urlParts = imageUrl.split('/');
        const filePath = urlParts.slice(-2).join('/'); // Get the last two parts: folder/filename
        
        const { error } = await supabase.storage
          .from('property-images')
          .remove([filePath]);
        
        if (error) {
          console.error('Error deleting image from storage:', error);
        }
      }
      
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
      toast.success('Image removed successfully');
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Failed to remove image');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  // Image reordering functions
  const handleImageDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', '');
    setDraggedIndex(index);
  };

  const handleImageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleImageDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // Only clear drag over if we're leaving the container entirely
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      setDragOverIndex(null);
    }
  };

  const handleImageDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    
    // Remove dragged image from its current position
    newImages.splice(draggedIndex, 1);
    
    // Insert it at the new position
    const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
    newImages.splice(insertIndex, 0, draggedImage);
    
    onImagesChange(newImages);
    setDraggedIndex(null);
    setDragOverIndex(null);
    
    toast.success('Image order updated');
  };

  const handleImageDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Property Images</h3>
        <div className="flex items-center gap-2">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload">
            <Button type="button" variant="outline" size="sm" asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Upload Images
              </span>
            </Button>
          </label>
        </div>
      </div>

      <div
        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-2">
          Drag and drop images here, or click to select
        </p>
        <p className="text-sm text-muted-foreground">
          Supports JPG, PNG, GIF up to 10MB each
        </p>
      </div>

      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              Property Images ({images.length})
            </h4>
            <div className="text-xs text-gray-500">
              Drag images to reorder • First image is the main photo
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {images.map((image, index) => (
              <div
                key={`${image}-${index}`}
                draggable
                onDragStart={(e) => handleImageDragStart(e, index)}
                onDragOver={(e) => handleImageDragOver(e, index)}
                onDragLeave={handleImageDragLeave}
                onDrop={(e) => handleImageDrop(e, index)}
                onDragEnd={handleImageDragEnd}
                className={`
                  relative group cursor-move transition-all duration-200
                  ${draggedIndex === index ? 'opacity-50 scale-95 rotate-3' : ''}
                  ${dragOverIndex === index && draggedIndex !== index ? 'scale-105 ring-2 ring-blue-400 ring-opacity-50' : ''}
                  ${index === 0 ? 'ring-2 ring-yellow-400 ring-opacity-30' : ''}
                  hover:shadow-lg
                `}
              >
                {/* Main Photo Badge */}
                {index === 0 && (
                  <div className="absolute -top-2 -left-2 z-20">
                    <Badge className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                      <Star className="h-3 w-3 mr-1" />
                      Main
                    </Badge>
                  </div>
                )}
                
                {/* Drag Handle */}
                <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-black/70 text-white p-1.5 rounded-md text-xs font-mono cursor-move">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex gap-0.5">
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                      </div>
                      <div className="flex gap-0.5">
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image Order Number */}
                <div className="absolute top-2 right-2 z-10 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-semibold">
                  #{index + 1}
                </div>
                
                <img
                  src={image}
                  alt={`Property image ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg transition-transform duration-200"
                  draggable={false}
                />
                
                {/* Hover Overlay with Actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="bg-white/90 text-gray-900 hover:bg-white"
                      onClick={() => {
                        // Move to first position (make main image)
                        if (index === 0) return;
                        const newImages = [...images];
                        const imageToMove = newImages.splice(index, 1)[0];
                        newImages.unshift(imageToMove);
                        onImagesChange(newImages);
                        toast.success('Set as main image');
                      }}
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Drop Zone Indicator */}
                {dragOverIndex === index && draggedIndex !== index && (
                  <div className="absolute inset-0 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50/30 flex items-center justify-center">
                    <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Drop here
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Reordering Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-1">Image Management</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• <strong>Drag and drop</strong> to reorder images</li>
                  <li>• <strong>First image</strong> becomes the main property photo</li>
                  <li>• <strong>Star icon</strong> to quickly set as main image</li>
                  <li>• <strong>Delete icon</strong> to remove unwanted images</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {uploading && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2" />
          Uploading images...
        </div>
      )}
    </div>
  );
};

export const PropertyEditor: React.FC<PropertyEditorProps> = ({
  isOpen,
  onClose,
  property,
  onSave
}) => {
  const [formData, setFormData] = useState<Property>({
    id: '',
    name: '',
    description: '',
    detailed_description: '',
    max_guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    base_price: 9500,
    amenities: [],
    images: [],
    is_active: true,
    created_at: new Date().toISOString(),
    city: 'Trikala',
    country: 'Greece',
    currency: 'EUR',
    property_type: 'apartment',
    latitude: 39.54835087201064,
    longitude: 21.762722799554123,
    nearby_facilities: [],
    size_sqm: undefined,
    cleaning_fee: 0
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (property) {
      setFormData(prev => ({
        ...prev,
        id: property.id || prev.id,
        name: property.name || '',
        description: property.description || '',
        detailed_description: property.detailed_description || '',
        city: property.city || 'Trikala',
        country: property.country || 'Greece',
        address: property.address || '',
        max_guests: property.max_guests || 2,
        bedrooms: property.bedrooms || 1,
        bathrooms: property.bathrooms || 1,
        base_price: property.base_price || 9500,
        currency: property.currency || 'EUR',
        property_type: property.property_type || 'apartment',
        amenities: property.amenities || [],
        images: property.images || [],
        is_active: property.active ?? property.is_active ?? true,
        latitude: property.latitude || 39.54835087201064,
        longitude: property.longitude || 21.762722799554123,
        nearby_facilities: property.nearby_facilities || [],
        size_sqm: property.size_sqm,
        cleaning_fee: property.cleaning_fee || 0,
        created_at: property.created_at || prev.created_at
      }));
    }
  }, [property]);

  const handleSave = async () => {
    try {
      setLoading(true);
      await onSave(formData);
      toast.success('Property saved successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to save property');
      console.error('Error saving property:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAmenity = (amenityId: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
  };

  const handleFacilityAdd = (facility: NearbyFacility) => {
    setFormData(prev => ({
      ...prev,
      nearby_facilities: [...(prev.nearby_facilities || []), facility]
    }));
  };

  const handleFacilityRemove = (id: string) => {
    setFormData(prev => ({
      ...prev,
      nearby_facilities: (prev.nearby_facilities || []).filter(f => f.id !== id)
    }));
  };

  const formatPrice = (cents: number) => (cents / 100).toFixed(2);
  const parsePrice = (euros: string) => Math.round(parseFloat(euros) * 100);

  if (!isOpen) return null;

  return (
         <Dialog open={isOpen} onOpenChange={onClose}>
       <DialogContent className="max-w-7xl w-[95vw] h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-display flex items-center gap-2">
                <Home className="h-6 w-6" />
                {property ? 'Edit Property' : 'Create New Property'}
              </DialogTitle>
              <DialogDescription>
                {property ? 'Update property details and settings' : 'Add a new property to your portfolio'}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

                 <div className="flex-1 min-h-0">
           <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 flex-shrink-0 overflow-x-auto">
               <TabsTrigger value="basic" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                 <Home className="h-3 w-3 md:h-4 md:w-4" />
                 <span className="hidden sm:inline">Basic</span>
               </TabsTrigger>
               <TabsTrigger value="details" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                 <FileText className="h-3 w-3 md:h-4 md:w-4" />
                 <span className="hidden sm:inline">Details</span>
               </TabsTrigger>
               <TabsTrigger value="images" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                 <ImageIcon className="h-3 w-3 md:h-4 md:w-4" />
                 <span className="hidden sm:inline">Images</span>
               </TabsTrigger>
               <TabsTrigger value="amenities" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                 <Sparkles className="h-3 w-3 md:h-4 md:w-4" />
                 <span className="hidden sm:inline">Amenities</span>
               </TabsTrigger>
               <TabsTrigger value="location" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                 <Map className="h-3 w-3 md:h-4 md:w-4" />
                 <span className="hidden sm:inline">Location</span>
               </TabsTrigger>
               <TabsTrigger value="settings" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                 <Settings className="h-3 w-3 md:h-4 md:w-4" />
                 <span className="hidden sm:inline">Settings</span>
               </TabsTrigger>
             </TabsList>

                         <ScrollArea className="flex-1 p-3 md:p-6 overflow-auto">
               <TabsContent value="basic" className="space-y-6 mt-0">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="h-5 w-5" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Property Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Cozy Downtown Apartment"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Short Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description for listings..."
                        rows={2}
                      />
                    </div>

                                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
                      <div>
                        <Label htmlFor="max_guests">Max Guests</Label>
                        <Input
                          id="max_guests"
                          type="number"
                          value={formData.max_guests}
                          onChange={(e) => setFormData(prev => ({ ...prev, max_guests: parseInt(e.target.value) || 1 }))}
                          min="1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bedrooms">Bedrooms</Label>
                        <Input
                          id="bedrooms"
                          type="number"
                          value={formData.bedrooms}
                          onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: parseInt(e.target.value) || 1 }))}
                          min="1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bathrooms">Bathrooms</Label>
                        <Input
                          id="bathrooms"
                          type="number"
                          value={formData.bathrooms}
                          onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: parseInt(e.target.value) || 1 }))}
                          min="1"
                          step="0.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="size_sqm">Size (m²)</Label>
                        <Input
                          id="size_sqm"
                          type="number"
                          value={formData.size_sqm || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, size_sqm: e.target.value ? parseInt(e.target.value) : undefined }))}
                          min="1"
                          placeholder="e.g. 75"
                        />
                      </div>
                      <div>
                        <Label htmlFor="base_price">Base Price (€/night)</Label>
                        <Input
                          id="base_price"
                          type="number"
                          value={formatPrice(formData.base_price)}
                          onChange={(e) => setFormData(prev => ({ ...prev, base_price: parsePrice(e.target.value) }))}
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                          placeholder="Trikala"
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={formData.country}
                          onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                          placeholder="Greece"
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                          placeholder="Street address"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="property_type">Property Type</Label>
                      <Select value={formData.property_type} onValueChange={(value) => setFormData(prev => ({ ...prev, property_type: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PROPERTY_TYPES.map(type => (
                            <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

                             <TabsContent value="details" className="space-y-6 mt-0">
                {/* Detailed Description */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Detailed Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AdvancedRichTextEditor
                      value={formData.detailed_description}
                      onChange={(value) => setFormData(prev => ({ ...prev, detailed_description: value }))}
                      placeholder="Write a detailed description of your property. Include information about the space, amenities, neighborhood, house rules, and anything else guests should know..."
                    />
                  </CardContent>
                </Card>
              </TabsContent>

                             <TabsContent value="images" className="space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Property Images
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ImageUploader
                      images={formData.images}
                      onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

                             <TabsContent value="amenities" className="space-y-6 mt-0">
                {/* Amenities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Amenities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {Object.entries(AMENITIES_GROUPS).map(([groupKey, amenities]) => (
                      <div key={groupKey} className="mb-6">
                        <h4 className="font-semibold mb-3 capitalize">{groupKey}</h4>
                                                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
                          {amenities.map((amenity) => {
                            const Icon = amenity.icon;
                            const isSelected = formData.amenities.includes(amenity.id);
                            return (
                              <div
                                key={amenity.id}
                                className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                                  isSelected
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-background hover:bg-accent border-border'
                                }`}
                                onClick={() => toggleAmenity(amenity.id)}
                              >
                                <Icon className="h-4 w-4" />
                                <span className="text-sm">{amenity.label}</span>
                                {isSelected && <Check className="h-4 w-4 ml-auto" />}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

                             <TabsContent value="location" className="space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Map className="h-5 w-5" />
                      Location & Nearby Facilities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                                         <InteractiveMapEditor
                                             latitude={formData.latitude || 39.54835087201064}
                       longitude={formData.longitude || 21.762722799554123}
                      onLocationChange={handleLocationChange}
                      nearbyFacilities={formData.nearby_facilities || []}
                      onFacilityAdd={handleFacilityAdd}
                      onFacilityRemove={handleFacilityRemove}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

                             <TabsContent value="settings" className="space-y-6 mt-0">
                {/* Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Property Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                      />
                      <Label htmlFor="is_active">Active Property</Label>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <Label htmlFor="cleaning_fee">Cleaning Fee (€)</Label>
                      <Input
                        id="cleaning_fee"
                        type="number"
                        value={formData.cleaning_fee ? formatPrice(formData.cleaning_fee) : ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          cleaning_fee: e.target.value ? parsePrice(e.target.value) : 0
                        }))}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Optional one-time cleaning fee charged to guests
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>

                 <div className="flex-shrink-0 p-3 md:p-6 border-t">
           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2">
              <Badge variant={formData.is_active ? "default" : "secondary"}>
                {formData.is_active ? "Active" : "Inactive"}
              </Badge>
              {formData.images.length > 0 && (
                <Badge variant="outline">
                  <ImageIcon className="h-3 w-3 mr-1" />
                  {formData.images.length} images
                </Badge>
              )}
              {formData.nearby_facilities && formData.nearby_facilities.length > 0 && (
                <Badge variant="outline">
                  <Map className="h-3 w-3 mr-1" />
                  {formData.nearby_facilities.length} facilities
                </Badge>
              )}
            </div>
                         <div className="flex items-center gap-2 w-full sm:w-auto">
               <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none">
                 Cancel
               </Button>
               <Button onClick={handleSave} disabled={loading} className="flex-1 sm:flex-none">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Property
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
