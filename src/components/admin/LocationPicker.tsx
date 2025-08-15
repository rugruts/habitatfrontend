import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Search, 
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface PropertyLocation {
  address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

interface LocationPickerProps {
  location: PropertyLocation;
  onLocationChange: (location: PropertyLocation) => void;
}

interface GeocodeResult {
  formatted_address: string;
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  location,
  onLocationChange
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<GeocodeResult[]>([]);
  const [isValidated, setIsValidated] = useState(false);

  // Mock geocoding function (replace with actual Google Maps API)
  const geocodeAddress = async (address: string): Promise<GeocodeResult[]> => {
    // This is a mock implementation
    // In production, you would use Google Maps Geocoding API
    return new Promise((resolve) => {
      setTimeout(() => {
        if (address.toLowerCase().includes('thessaloniki') || address.toLowerCase().includes('trikala')) {
          resolve([
            {
              formatted_address: `${address}, Greece`,
              address_components: [
                { long_name: address.split(',')[0] || address, short_name: address.split(',')[0] || address, types: ['street_address'] },
                { long_name: address.toLowerCase().includes('thessaloniki') ? 'Thessaloniki' : 'Trikala', short_name: address.toLowerCase().includes('thessaloniki') ? 'Thessaloniki' : 'Trikala', types: ['locality'] },
                { long_name: 'Greece', short_name: 'GR', types: ['country'] }
              ],
              geometry: {
                location: {
                  lat: address.toLowerCase().includes('thessaloniki') ? 40.6401 : 39.5551,
                  lng: address.toLowerCase().includes('thessaloniki') ? 22.9444 : 21.7669
                }
              }
            }
          ]);
        } else {
          resolve([
            {
              formatted_address: `${address}, Trikala, Greece`,
              address_components: [
                { long_name: address, short_name: address, types: ['street_address'] },
                { long_name: 'Trikala', short_name: 'Trikala', types: ['locality'] },
                { long_name: 'Greece', short_name: 'GR', types: ['country'] }
              ],
              geometry: {
                location: {
                  lat: 39.5551,
                  lng: 21.7669
                }
              }
            }
          ]);
        }
      }, 1000);
    });
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResults([]);
    setIsValidated(false);

    try {
      const results = await geocodeAddress(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Geocoding error:', error);
      alert('Failed to search for location. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const selectLocation = (result: GeocodeResult) => {
    const addressComponent = result.address_components.find(comp => 
      comp.types.includes('street_address') || comp.types.includes('route')
    );
    const cityComponent = result.address_components.find(comp => 
      comp.types.includes('locality') || comp.types.includes('administrative_area_level_1')
    );
    const countryComponent = result.address_components.find(comp => 
      comp.types.includes('country')
    );

    const newLocation: PropertyLocation = {
      address: addressComponent?.long_name || result.formatted_address.split(',')[0],
      city: cityComponent?.long_name || 'Trikala',
      country: countryComponent?.long_name || 'Greece',
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng
    };

    onLocationChange(newLocation);
    setSearchResults([]);
    setSearchQuery('');
    setIsValidated(true);
  };

  const handleManualInput = (field: keyof PropertyLocation, value: string) => {
    const newLocation = { ...location, [field]: value };
    onLocationChange(newLocation);
    setIsValidated(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-base font-semibold">Property Location</Label>
        <p className="text-sm text-gray-600">
          Search for the exact address or enter manually
        </p>
      </div>

      {/* Search Section */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Search address (e.g., Alexandrias 69, Trikala, Greece)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button 
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Search Results:</Label>
                {searchResults.map((result, index) => (
                  <Card 
                    key={index}
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => selectLocation(result)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{result.formatted_address}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Manual Input Section */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Manual Entry</Label>
              {isValidated && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Validated
                </Badge>
              )}
              {location.address && !isValidated && (
                <Badge variant="outline" className="text-orange-600">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Not validated
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  placeholder="e.g., Alexandrias 69"
                  value={location.address}
                  onChange={(e) => handleManualInput('address', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="e.g., Trikala"
                    value={location.city}
                    onChange={(e) => handleManualInput('city', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    placeholder="e.g., Greece"
                    value={location.country}
                    onChange={(e) => handleManualInput('country', e.target.value)}
                  />
                </div>
              </div>

              {location.latitude && location.longitude && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Latitude</Label>
                    <Input
                      value={location.latitude.toFixed(6)}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label>Longitude</Label>
                    <Input
                      value={location.longitude.toFixed(6)}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Current Location Display */}
            {(location.address || location.city || location.country) && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Current Location:</p>
                    <p className="text-sm text-blue-700">
                      {[location.address, location.city, location.country]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
