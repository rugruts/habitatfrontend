import React, { useState } from 'react';
import { PropertyContentBuilder } from '@/components/admin/PropertyContentBuilder';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Eye, Edit } from 'lucide-react';

interface LocationHighlight {
  id: string;
  name: string;
  description: string;
  type: string;
  distance: string;
  coordinates: { lat: number; lng: number };
}

interface HouseRule {
  id: string;
  title: string;
  description: string;
  type: string;
  severity: string;
  required: boolean;
  timeRestriction?: string;
}

interface PropertyContent {
  aboutSpace: string;
  spaceFeatures: string[];
  locationHighlights: LocationHighlight[];
  houseRules: HouseRule[];
}

const PropertyContentDemo: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState<PropertyContent>({
    aboutSpace: "This thoughtfully designed space captures the essence of modern living. Floor-to-ceiling windows frame beautiful views, while carefully curated furnishings create a sense of calm sophistication. The open-plan layout seamlessly connects the living, dining, and kitchen areas, perfect for both relaxation and entertaining.",
    spaceFeatures: [
      'Free WiFi',
      'Air Conditioning', 
      'Kitchen',
      'Balcony',
      'City View',
      'Washing Machine',
      'TV',
      'Coffee Machine'
    ],
    locationHighlights: [
      {
        id: '1',
        name: 'Central Square',
        description: 'Historic town center with shops, cafes, and local markets',
        type: 'attraction',
        distance: '3 min walk',
        coordinates: { lat: 39.559102, lng: 21.762777 }
      },
      {
        id: '2', 
        name: 'Metro Station',
        description: 'Direct connection to city center and airport',
        type: 'transport',
        distance: '5 min walk',
        coordinates: { lat: 39.559102, lng: 21.762777 }
      },
      {
        id: '3',
        name: 'Seaside Taverna',
        description: 'Authentic Greek cuisine with waterfront dining',
        type: 'restaurant',
        distance: '2 min walk',
        coordinates: { lat: 39.559102, lng: 21.762777 }
      }
    ],
    houseRules: [
      {
        id: '1',
        title: 'No smoking',
        description: 'Smoking is not allowed anywhere in the property',
        type: 'smoking',
        severity: 'strict',
        required: true
      },
      {
        id: '2',
        title: 'Quiet hours',
        description: 'Please keep noise to a minimum between 22:00 and 08:00',
        type: 'noise',
        severity: 'warning',
        required: true,
        timeRestriction: '22:00 - 08:00'
      },
      {
        id: '3',
        title: 'Check-in after 15:00',
        description: 'Check-in is available from 15:00 onwards',
        type: 'checkin',
        severity: 'info',
        required: true
      }
    ]
  });

  const handleSave = (newContent: PropertyContent) => {
    setContent(newContent);
    setIsEditing(false);
    // Here you would typically save to your backend
    console.log('Saving content:', newContent);
  };

  if (isEditing) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(false)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Preview
            </Button>
          </div>
          
          <PropertyContentBuilder
            propertyId="demo-property"
            initialContent={content}
            onSave={handleSave}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Apartment 1 - Habitat Lobby</h1>
            <p className="text-gray-600 mt-1">Modern waterfront apartment with stunning views</p>
          </div>
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Content
          </Button>
        </div>

        {/* Property Content Preview */}
        <div className="space-y-8">
          {/* About Section */}
          <Card>
            <CardHeader>
              <CardTitle>About This Space</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {content.aboutSpace}
              </p>
            </CardContent>
          </Card>

          {/* Features Section */}
          {content.spaceFeatures.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>What this place offers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {content.spaceFeatures.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Location Section */}
          {content.locationHighlights.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Location & Neighborhood</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {content.locationHighlights.map((location) => (
                    <div key={location.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {location.type === 'restaurant' ? '🍽️' : 
                           location.type === 'transport' ? '🚇' : 
                           location.type === 'attraction' ? '📸' : '📍'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{location.name}</h4>
                        <p className="text-gray-600 text-sm mb-2">{location.description}</p>
                        <Badge variant="secondary" className="text-xs">
                          {location.distance}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* House Rules Section */}
          {content.houseRules.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>House Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {content.houseRules.map((rule) => (
                    <div
                      key={rule.id}
                      className={`p-4 border-l-4 rounded-r-lg ${
                        rule.severity === 'strict' 
                          ? 'border-red-500 bg-red-50' 
                          : rule.severity === 'warning'
                          ? 'border-yellow-500 bg-yellow-50'
                          : 'border-blue-500 bg-blue-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${
                          rule.severity === 'strict' 
                            ? 'bg-red-100' 
                            : rule.severity === 'warning'
                            ? 'bg-yellow-100'
                            : 'bg-blue-100'
                        }`}>
                          <span className="text-lg">
                            {rule.type === 'smoking' ? '🚭' :
                             rule.type === 'noise' ? '🔇' :
                             rule.type === 'checkin' ? '🕒' : '🏠'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{rule.title}</h4>
                            {rule.required && (
                              <Badge variant="destructive" className="text-xs">
                                Required
                              </Badge>
                            )}
                          </div>
                          {rule.description && (
                            <p className="text-gray-700 mt-1">{rule.description}</p>
                          )}
                          {rule.timeRestriction && (
                            <div className="mt-2">
                              <Badge variant="outline" className="text-xs">
                                {rule.timeRestriction}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500">
          <p className="text-sm">
            This is how your property content will appear to guests
          </p>
        </div>
      </div>
    </div>
  );
};

export default PropertyContentDemo;
