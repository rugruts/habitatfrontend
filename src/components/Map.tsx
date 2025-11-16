import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { CustomMapPinsService, CustomMapPin } from '@/services/CustomMapPinsService';

export interface MapLocation {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  type: 'castle' | 'museum' | 'bridge' | 'market' | 'tower' | 'district';
  openingHours?: string;
  entryFee?: string;
}

interface MapProps {
  locations: MapLocation[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  context?: 'guide' | 'overview' | 'property'; // Added context for custom pins
  showCustomPins?: boolean; // Option to show/hide custom pins
}

// Helper function to get SVG path for custom pin icons
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

const Map: React.FC<MapProps> = ({
  locations,
  center = [39.5551, 21.7669], // Trikala coordinates
  zoom = 14,
  height = "500px",
  context = 'guide', // Default context
  showCustomPins = true // Default to showing custom pins
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [customPins, setCustomPins] = useState<CustomMapPin[]>([]);

  // Load custom pins based on context
  useEffect(() => {
    if (!showCustomPins) return;
    
    const loadCustomPins = async () => {
      try {
        let pins: CustomMapPin[] = [];
        
        switch (context) {
          case 'guide':
            pins = await CustomMapPinsService.getMapPinsByContext('guide');
            break;
          case 'overview':
            pins = await CustomMapPinsService.getMapPinsByContext('overview');
            break;
          case 'property':
            pins = await CustomMapPinsService.getMapPinsByContext('property');
            break;
          default:
            pins = await CustomMapPinsService.getAllMapPins();
        }
        
        // Filter only active pins
        setCustomPins(pins.filter(pin => pin.is_active));
      } catch (error) {
        console.error('Error loading custom pins:', error);
        setCustomPins([]);
      }
    };

    loadCustomPins();
  }, [context, showCustomPins]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize the map
    const map = L.map(mapRef.current).setView(center, zoom);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Custom icon for cultural sites
    const culturalIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Add markers for each original location
    locations.forEach((location) => {
      const marker = L.marker([location.lat, location.lng], { icon: culturalIcon }).addTo(map);

      const popupContent = `
        <div style="padding: 8px;">
          <h3 style="font-weight: 600; font-size: 16px; margin-bottom: 8px;">${location.name}</h3>
          <p style="font-size: 14px; color: #666; margin-bottom: 8px;">${location.description}</p>
          ${location.openingHours ? `<p style="font-size: 12px; color: #888; margin-bottom: 4px;"><strong>Hours:</strong> ${location.openingHours}</p>` : ''}
          ${location.entryFee ? `<p style="font-size: 12px; color: #888;"><strong>Entry:</strong> ${location.entryFee}</p>` : ''}
        </div>
      `;

      marker.bindPopup(popupContent);
    });

    // Add custom pins if enabled
    if (showCustomPins && customPins.length > 0) {
      customPins.forEach((pin) => {
        // Create custom pin icon with SVG
        const customPinIcon = L.divIcon({
          className: 'custom-map-pin',
          html: `
            <div style="
              width: 32px;
              height: 32px;
              background: ${pin.color};
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              border: 3px solid white;
              position: relative;
              transform: ${pin.is_featured ? 'scale(1.1)' : 'scale(1)'};
            ">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                ${getIconSvgPath(pin.icon_name)}
              </svg>
              ${pin.is_featured ? `
                <div style="
                  position: absolute;
                  top: -3px;
                  right: -3px;
                  width: 12px;
                  height: 12px;
                  background: #fbbf24;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border: 2px solid white;
                ">
                  <svg width="6" height="6" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              ` : ''}
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -16]
        });

        const marker = L.marker([pin.latitude, pin.longitude], { icon: customPinIcon }).addTo(map);
        
        // Create popup content for custom pin
        const popupContent = `
          <div style="padding: 12px; min-width: 200px;">
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
            ${pin.website_url ? `<p style="margin: 6px 0;"><a href="${pin.website_url}" target="_blank" style="color: #3b82f6; font-size: 12px; text-decoration: none;">🌐 Visit Website</a></p>` : ''}
            ${pin.phone_number ? `<p style="margin: 6px 0; color: #888; font-size: 12px;">📞 ${pin.phone_number}</p>` : ''}
          </div>
        `;

        marker.bindPopup(popupContent);
      });
    }

    mapInstanceRef.current = map;

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locations, center, zoom, customPins, showCustomPins]);

  return (
    <div
      ref={mapRef}
      style={{ height, width: '100%' }}
      className="rounded-lg overflow-hidden"
    />
  );
};

export default Map;
