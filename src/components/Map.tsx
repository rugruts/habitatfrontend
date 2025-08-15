import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

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
}

const Map: React.FC<MapProps> = ({
  locations,
  center = [39.5551, 21.7669], // Trikala coordinates
  zoom = 14,
  height = "500px"
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

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

    // Add markers for each location
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

    mapInstanceRef.current = map;

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locations, center, zoom]);

  return (
    <div
      ref={mapRef}
      style={{ height, width: '100%' }}
      className="rounded-lg overflow-hidden"
    />
  );
};

export default Map;
