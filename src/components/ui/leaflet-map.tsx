import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Attraction } from '@/data/apartments';
import { CustomMapPinsService, CustomMapPin } from '@/services/CustomMapPinsService';

// Fix for default markers in Leaflet with Webpack/Vite
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LeafletMapProps {
  address: string;
  attractions?: Attraction[];
  showAttractions?: boolean;
  height?: string;
  showCustomPins?: boolean; // Option to show/hide custom pins
  context?: 'guide' | 'overview' | 'property'; // Context for custom pins
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

// Property coordinates (Αλεξάνδρας 59, Τρίκαλα, Greece)
const PROPERTY_COORDS = { lat: 39.5551, lng: 21.7674 };

const LeafletMap: React.FC<LeafletMapProps> = ({
  address,
  attractions = [],
  showAttractions = false,
  height = '400px',
  showCustomPins = true,
  context = 'property'
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

    // Wait for the container to be visible
    const initializeMap = () => {
      if (!mapRef.current) return;

      try {
        // Initialize map
        const map = L.map(mapRef.current, {
          center: [PROPERTY_COORDS.lat, PROPERTY_COORDS.lng],
          zoom: 15,
          zoomControl: true,
          scrollWheelZoom: true
        });

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      // Create property marker with default icon but blue color
      const propertyIcon = L.divIcon({
        className: 'property-marker',
        html: `<div style="
          background-color: #3b82f6;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          position: relative;
        "></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      // Add property marker
      L.marker([PROPERTY_COORDS.lat, PROPERTY_COORDS.lng], { icon: propertyIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: system-ui; padding: 8px; min-width: 200px;">
            <strong style="color: #1f2937; font-size: 16px;">🏠 Property Location</strong><br/>
            <span style="color: #6b7280; font-size: 14px;">Αλεξάνδρας 59, Τρίκαλα</span><br/>
            <span style="color: #9ca3af; font-size: 12px;">📍 ${PROPERTY_COORDS.lat.toFixed(4)}, ${PROPERTY_COORDS.lng.toFixed(4)}</span>
          </div>
        `);

      // Add attraction markers if enabled
      if (showAttractions && attractions.length > 0) {
        const allCoords = [PROPERTY_COORDS];

        attractions.forEach((attraction, index) => {
          if (attraction.coordinates) {
            // Create attraction marker
            const attractionIcon = L.divIcon({
              className: 'attraction-marker',
              html: `<div style="
                background-color: #ef4444;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 2px solid white;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                position: relative;
              "></div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            });

            L.marker([attraction.coordinates.lat, attraction.coordinates.lng], { icon: attractionIcon })
              .addTo(map)
              .bindPopup(`
                <div style="font-family: system-ui; padding: 8px; min-width: 200px;">
                  <strong style="color: #1f2937; font-size: 16px;">${attraction.name}</strong><br/>
                  <span style="color: #6b7280; font-size: 14px; text-transform: capitalize;">📍 ${attraction.type}</span><br/>
                  <span style="color: #059669; font-size: 13px;">🚶 ${attraction.distance} • ${attraction.time}</span><br/>
                  <span style="color: #9ca3af; font-size: 12px;">📍 ${attraction.coordinates.lat.toFixed(4)}, ${attraction.coordinates.lng.toFixed(4)}</span>
                </div>
              `);

            allCoords.push(attraction.coordinates);
          }
        });

        // Fit map to show all markers with padding
        if (allCoords.length > 1) {
          const bounds = L.latLngBounds(allCoords);
          map.fitBounds(bounds, { padding: [30, 30] });
        }
      }

      // Add custom pins if enabled
      if (showCustomPins && customPins.length > 0) {
        customPins.forEach((pin) => {
          // Create custom pin icon with SVG
          const customPinIcon = L.divIcon({
            className: 'custom-map-pin',
            html: `
              <div style="
                width: 26px;
                height: 26px;
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
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  ${getIconSvgPath(pin.icon_name)}
                </svg>
                ${pin.is_featured ? `
                  <div style="
                    position: absolute;
                    top: -2px;
                    right: -2px;
                    width: 8px;
                    height: 8px;
                    background: #fbbf24;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid white;
                  ">
                    <svg width="4" height="4" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                ` : ''}
              </div>
            `,
            iconSize: [26, 26],
            iconAnchor: [13, 13],
            popupAnchor: [0, -13]
          });

          const marker = L.marker([pin.latitude, pin.longitude], { icon: customPinIcon }).addTo(map);
          
          // Create popup content for custom pin
          const popupContent = `
            <div style="font-family: system-ui; padding: 8px; min-width: 160px;">
              <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
                <strong style="flex: 1; font-size: 14px; color: #1f2937;">${pin.name}</strong>
                ${pin.is_featured ? '<span style="color: #fbbf24; font-size: 12px;">⭐</span>' : ''}
              </div>
              ${pin.description ? `<p style="margin: 4px 0; color: #6b7280; font-size: 12px;">${pin.description}</p>` : ''}
              <div style="margin: 6px 0;">
                <span style="background: ${pin.color}; color: white; padding: 2px 6px; border-radius: 6px; font-size: 10px; text-transform: capitalize;">
                  ${pin.category}
                </span>
              </div>
              ${pin.address ? `<p style="margin: 4px 0; color: #9ca3af; font-size: 10px;">📍 ${pin.address}</p>` : ''}
              ${pin.website_url ? `<p style="margin: 4px 0;"><a href="${pin.website_url}" target="_blank" style="color: #3b82f6; font-size: 10px; text-decoration: none;">🌐 Website</a></p>` : ''}
              ${pin.phone_number ? `<p style="margin: 4px 0; color: #9ca3af; font-size: 10px;">📞 ${pin.phone_number}</p>` : ''}
            </div>
          `;

          marker.bindPopup(popupContent);
        });
      }

      mapInstanceRef.current = map;

        // Force a resize after a short delay to ensure proper rendering
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 100);

      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    // Initialize immediately if container is visible, otherwise wait
    if (mapRef.current.offsetWidth > 0) {
      initializeMap();
    } else {
      // Wait for container to become visible
      const observer = new MutationObserver(() => {
        if (mapRef.current && mapRef.current.offsetWidth > 0) {
          observer.disconnect();
          initializeMap();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });

      // Fallback timeout
      setTimeout(initializeMap, 500);
    }

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [attractions, showAttractions, customPins, showCustomPins]);

  return (
    <div
      ref={mapRef}
      style={{ height, width: '100%' }}
      className="rounded-lg overflow-hidden border border-accent/20"
    />
  );
};

export default LeafletMap;
