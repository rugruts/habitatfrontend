import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Search, 
  Plus,
  Trash2,
  Utensils,
  Train,
  Camera,
  ShoppingBag,
  Hospital,
  GraduationCap,
  Trees,
  Coffee,
  Building
} from 'lucide-react';

interface LocationPoint {
  id: string;
  name: string;
  description: string;
  type: 'restaurant' | 'transport' | 'attraction' | 'shopping' | 'hospital' | 'education' | 'park' | 'cafe' | 'other';
  coordinates: { lat: number; lng: number };
  distance: string;
}

interface LocationMapSelectorProps {
  propertyCoordinates: { lat: number; lng: number };
  locations: LocationPoint[];
  onLocationsChange: (locations: LocationPoint[]) => void;
}

const LOCATION_TYPES = {
  restaurant: { icon: Utensils, color: '#f97316', label: 'Restaurant' },
  transport: { icon: Train, color: '#3b82f6', label: 'Transport' },
  attraction: { icon: Camera, color: '#8b5cf6', label: 'Attraction' },
  shopping: { icon: ShoppingBag, color: '#ec4899', label: 'Shopping' },
  hospital: { icon: Hospital, color: '#ef4444', label: 'Hospital' },
  education: { icon: GraduationCap, color: '#22c55e', label: 'Education' },
  park: { icon: Trees, color: '#10b981', label: 'Park' },
  cafe: { icon: Coffee, color: '#a855f7', label: 'Cafe' },
  other: { icon: Building, color: '#6b7280', label: 'Other' }
};

export const LocationMapSelector: React.FC<LocationMapSelectorProps> = ({
  propertyCoordinates,
  locations,
  onLocationsChange
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationPoint | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [newLocation, setNewLocation] = useState<Partial<LocationPoint>>({
    name: '',
    description: '',
    type: 'restaurant',
    coordinates: propertyCoordinates
  });

  // Calculate distance between two coordinates
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): string => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    } else {
      return `${distance.toFixed(1)}km`;
    }
  };

  const addLocation = () => {
    if (newLocation.name && newLocation.description && newLocation.coordinates) {
      const distance = calculateDistance(
        propertyCoordinates.lat,
        propertyCoordinates.lng,
        newLocation.coordinates.lat,
        newLocation.coordinates.lng
      );

      const location: LocationPoint = {
        id: Date.now().toString(),
        name: newLocation.name!,
        description: newLocation.description!,
        type: newLocation.type as 'restaurant' | 'cafe' | 'bar' | 'shop' | 'attraction' | 'transport' | 'park' | 'museum' | 'pharmacy' | 'bank' | 'post_office' | 'hospital' | 'police' | 'custom',
        coordinates: newLocation.coordinates,
        distance
      };

      onLocationsChange([...locations, location]);
      setNewLocation({
        name: '',
        description: '',
        type: 'restaurant',
        coordinates: propertyCoordinates
      });
      setIsAddingLocation(false);
    }
  };

  const removeLocation = (id: string) => {
    onLocationsChange(locations.filter(loc => loc.id !== id));
    setSelectedLocation(null);
  };

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Map Area */}
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Map
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full p-0">
            <div 
              ref={mapRef}
              className="w-full h-full bg-gray-100 rounded-lg relative overflow-hidden"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            >
              {/* Property Location (Center) */}
              <div 
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                style={{ 
                  left: '50%', 
                  top: '50%'
                }}
              >
                <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg">
                  <Building className="h-6 w-6" />
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
                  <Badge variant="default" className="text-xs whitespace-nowrap">
                    Your Property
                  </Badge>
                </div>
              </div>

              {/* Location Points */}
              {locations.map((location, index) => {
                const IconComponent = LOCATION_TYPES[location.type].icon;
                const angle = (index * 45) * (Math.PI / 180); // Distribute around property
                const radius = 80 + (index % 3) * 40; // Vary distance
                const x = 50 + (radius * Math.cos(angle)) / 3; // Convert to percentage
                const y = 50 + (radius * Math.sin(angle)) / 3;
                
                return (
                  <div
                    key={location.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 z-10 ${
                      selectedLocation?.id === location.id ? 'scale-110' : 'hover:scale-105'
                    }`}
                    style={{ 
                      left: `${Math.max(10, Math.min(90, x))}%`, 
                      top: `${Math.max(10, Math.min(90, y))}%`
                    }}
                    onClick={() => setSelectedLocation(location)}
                  >
                    <div 
                      className="text-white p-2 rounded-full shadow-lg"
                      style={{ backgroundColor: LOCATION_TYPES[location.type].color }}
                    >
                      <IconComponent className="h-4 w-4" />
                    </div>
                    {selectedLocation?.id === location.id && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
                        <Badge variant="secondary" className="text-xs whitespace-nowrap">
                          {location.name}
                        </Badge>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Add Location Button */}
              <div className="absolute bottom-4 right-4">
                <Button
                  onClick={() => setIsAddingLocation(true)}
                  size="sm"
                  className="shadow-lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Locations List */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Nearby Locations</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {filteredLocations.map((location) => {
              const IconComponent = LOCATION_TYPES[location.type].icon;
              return (
                <div
                  key={location.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedLocation?.id === location.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedLocation(location)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <IconComponent 
                        className="h-5 w-5 mt-0.5" 
                        style={{ color: LOCATION_TYPES[location.type].color }}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{location.name}</p>
                        <p className="text-xs text-gray-600 mb-1">{location.description}</p>
                        <Badge variant="outline" className="text-xs">
                          {location.distance}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeLocation(location.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
            
            {filteredLocations.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No locations found</p>
                <p className="text-xs">Add some nearby attractions</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Selected Location Details */}
        {selectedLocation && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {React.createElement(LOCATION_TYPES[selectedLocation.type].icon, {
                  className: "h-5 w-5",
                  style: { color: LOCATION_TYPES[selectedLocation.type].color }
                })}
                {selectedLocation.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">{selectedLocation.description}</p>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="secondary">{selectedLocation.distance}</Badge>
                <Badge variant="outline">{LOCATION_TYPES[selectedLocation.type].label}</Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
