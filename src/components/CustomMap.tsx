import React, { useEffect, useRef, useState } from 'react';
import { CustomMapPinsService, CustomMapPin } from '@/services/CustomMapPinsService';

// Leaflet types
interface LeafletMap {
  remove: () => void;
  setView: (coords: [number, number], zoom: number) => LeafletMap;
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
    };
  };
}

interface CustomMapProps {
  latitude: number;
  longitude: number;
  address: string;
  propertyName: string;
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

const CustomMap: React.FC<CustomMapProps> = ({
  latitude,
  longitude,
  address,
  propertyName,
  showCustomPins = true
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const [customPins, setCustomPins] = useState<CustomMapPin[]>([]);

  // Load custom pins for property context
  useEffect(() => {
    if (!showCustomPins) return;
    
    const loadCustomPins = async () => {
      try {
        // Get pins that should be shown on property maps
        const pins = await CustomMapPinsService.getMapPinsByContext('property');
        // Filter only active pins
        setCustomPins(pins.filter(pin => pin.is_active));
      } catch (error) {
        console.error('Error loading custom pins:', error);
        setCustomPins([]);
      }
    };

    loadCustomPins();
  }, [showCustomPins]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Dynamically load Leaflet CSS and JS
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
      const map = L.map(mapRef.current).setView([latitude, longitude], 17);
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
      
      // Add property popup
      propertyMarker.bindPopup(`
        <div style="text-align: center; padding: 8px;">
          <strong>${propertyName}</strong><br>
          <small>${address}</small>
        </div>
      `);

      // Add custom pins if enabled
      if (showCustomPins && customPins.length > 0) {
        customPins.forEach((pin) => {
          // Create custom pin icon with SVG
          const customPinIcon = L.divIcon({
            className: 'custom-map-pin',
            html: `
              <div style="
                width: 28px;
                height: 28px;
                background: ${pin.color};
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                border: 2px solid white;
                position: relative;
                transform: ${pin.is_featured ? 'scale(1.1)' : 'scale(1)'};
              ">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  ${getIconSvgPath(pin.icon_name)}
                </svg>
                ${pin.is_featured ? `
                  <div style="
                    position: absolute;
                    top: -2px;
                    right: -2px;
                    width: 10px;
                    height: 10px;
                    background: #fbbf24;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid white;
                  ">
                    <svg width="5" height="5" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                ` : ''}
              </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
            popupAnchor: [0, -14]
          });

          const marker = L.marker([pin.latitude, pin.longitude], { icon: customPinIcon }).addTo(map);
          
          // Create popup content for custom pin
          const popupContent = `
            <div style="padding: 10px; min-width: 180px;">
              <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
                <strong style="flex: 1; font-size: 14px;">${pin.name}</strong>
                ${pin.is_featured ? '<span style="color: #fbbf24; font-size: 12px;">⭐</span>' : ''}
              </div>
              ${pin.description ? `<p style="margin: 4px 0; color: #666; font-size: 12px;">${pin.description}</p>` : ''}
              <div style="margin: 6px 0;">
                <span style="background: ${pin.color}; color: white; padding: 2px 8px; border-radius: 8px; font-size: 10px; text-transform: capitalize;">
                  ${pin.category}
                </span>
              </div>
              ${pin.address ? `<p style="margin: 4px 0; color: #888; font-size: 10px;">📍 ${pin.address}</p>` : ''}
              ${pin.website_url ? `<p style="margin: 4px 0;"><a href="${pin.website_url}" target="_blank" style="color: #3b82f6; font-size: 10px; text-decoration: none;">🌐 Website</a></p>` : ''}
              ${pin.phone_number ? `<p style="margin: 4px 0; color: #888; font-size: 10px;">📞 ${pin.phone_number}</p>` : ''}
            </div>
          `;

          marker.bindPopup(popupContent);
        });
      }
    };

    loadLeaflet();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, [latitude, longitude, address, propertyName, customPins, showCustomPins]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-lg"
      style={{ minHeight: '256px' }}
    />
  );
};

export default CustomMap;
