import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LocationMapSelector } from './LocationMapSelector';
import { HouseRulesBuilder } from './HouseRulesBuilder';
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  Wand2,
  Home,
  Utensils,
  Car,
  ShoppingBag,
  Coffee,
  Train,
  Bus,
  Plane,
  Hospital,
  GraduationCap,
  Building,
  Trees,
  Camera,
  Star,
  Clock,
  Volume2,
  Cigarette,
  Users,
  Shield,
  Sparkles,
  X,
  Zap,
  CheckCircle
} from 'lucide-react';

interface LocationHighlight {
  id: string;
  name: string;
  description: string;
  type: 'restaurant' | 'transport' | 'attraction' | 'shopping' | 'hospital' | 'education' | 'park' | 'other';
  distance: string;
  coordinates: { lat: number; lng: number };
  icon: string;
}

interface HouseRule {
  id: string;
  title: string;
  description: string;
  type: 'safety' | 'noise' | 'smoking' | 'parties' | 'checkin' | 'checkout' | 'cleaning' | 'custom';
  icon: string;
  required: boolean;
}

interface PropertyContent {
  aboutSpace: string;
  spaceFeatures: string[];
  locationHighlights: LocationHighlight[];
  houseRules: HouseRule[];
}

interface PropertyContentBuilderProps {
  propertyId: string;
  initialContent?: PropertyContent;
  onSave: (content: PropertyContent) => void;
}



export const PropertyContentBuilder: React.FC<PropertyContentBuilderProps> = ({
  propertyId,
  initialContent,
  onSave
}) => {
  const [content, setContent] = useState<PropertyContent>({
    aboutSpace: '',
    spaceFeatures: [],
    locationHighlights: [],
    houseRules: [],
    ...initialContent
  });

  const [activeTab, setActiveTab] = useState('about');



  const addFeature = (feature: string) => {
    if (feature && !content.spaceFeatures.includes(feature)) {
      setContent(prev => ({
        ...prev,
        spaceFeatures: [...prev.spaceFeatures, feature]
      }));
    }
  };

  const removeFeature = (feature: string) => {
    setContent(prev => ({
      ...prev,
      spaceFeatures: prev.spaceFeatures.filter(f => f !== feature)
    }));
  };

  const suggestedFeatures = [
    'Free WiFi', 'Air Conditioning', 'Heating', 'Kitchen', 'Washing Machine',
    'Balcony', 'Parking', 'TV', 'Coffee Machine', 'Dishwasher', 'Iron',
    'Hair Dryer', 'Towels', 'Bed Linen', 'Workspace', 'City View'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wand2 className="h-6 w-6" />
            Property Content Builder
          </h1>
          <p className="text-gray-600 mt-1">Create compelling property descriptions with live preview</p>
        </div>
        <Button onClick={() => onSave(content)} size="lg">
          <Save className="h-4 w-4 mr-2" />
          Save Content
        </Button>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="about" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            About Space
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Features
          </TabsTrigger>
          <TabsTrigger value="location" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location
          </TabsTrigger>
          <TabsTrigger value="rules" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            House Rules
          </TabsTrigger>
        </TabsList>

        <TabsContent value="about">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>About This Space</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="about-space">Main Description</Label>
                    <Textarea
                      id="about-space"
                      value={content.aboutSpace}
                      onChange={(e) => setContent(prev => ({ ...prev, aboutSpace: e.target.value }))}
                      placeholder="Describe what makes this space special. Focus on the unique features, atmosphere, and guest experience..."
                      className="min-h-[200px]"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Tip: Mention the style, views, special features, and what guests will love most
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">About This Space</h3>
                    <div className="prose prose-sm max-w-none">
                      {content.aboutSpace ? (
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {content.aboutSpace}
                        </p>
                      ) : (
                        <p className="text-gray-400 italic">
                          Start typing to see your description appear here...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Features & Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Select Available Features</Label>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      {suggestedFeatures.map((feature) => (
                        <Button
                          key={feature}
                          variant={content.spaceFeatures.includes(feature) ? "default" : "outline"}
                          size="sm"
                          onClick={() => content.spaceFeatures.includes(feature)
                            ? removeFeature(feature)
                            : addFeature(feature)
                          }
                          className="justify-start text-xs h-auto py-2"
                        >
                          {content.spaceFeatures.includes(feature) ? (
                            <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                          ) : (
                            <Plus className="h-3 w-3 mr-2" />
                          )}
                          {feature}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      Selected: {content.spaceFeatures.length} features
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Features Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {content.spaceFeatures.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">What this place offers</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {content.spaceFeatures.map((feature) => (
                        <div key={feature} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Zap className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p>Select features to see preview</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="location">
          <LocationMapSelector
            propertyCoordinates={{ lat: 39.559102, lng: 21.762777 }}
            locations={content.locationHighlights}
            onLocationsChange={(locations) => setContent(prev => ({ ...prev, locationHighlights: locations }))}
          />
        </TabsContent>

        <TabsContent value="rules">
          <HouseRulesBuilder
            rules={content.houseRules}
            onRulesChange={(rules) => setContent(prev => ({ ...prev, houseRules: rules }))}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
