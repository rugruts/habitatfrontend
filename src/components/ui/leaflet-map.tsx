import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Attraction } from '@/data/apartments';

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
}

// Property coordinates (Αλεξάνδρας 59, Τρίκαλα, Greece)
const PROPERTY_COORDS = { lat: 39.5551, lng: 21.7674 };

const LeafletMap: React.FC<LeafletMapProps> = ({
  address,
  attractions = [],
  showAttractions = false,
  height = '400px'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

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
  }, [attractions, showAttractions]);

  return (
    <div 
      ref={mapRef} 
      style={{ height, width: '100%' }}
      className="rounded-lg overflow-hidden border border-accent/20"
    />
  );
};

export default LeafletMap;
