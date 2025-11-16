import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  Users,
  Volume2,
  Clock,
  Home,
  Wifi,
  Car,
  ChefHat,
  Tv,
  Wind,
  MapPin,
  Trees,
  Coffee,
  Bike,
  Camera,
  Phone,
  Mail,
  Utensils,
  Waves,
  AirVent,
  Building,
  Castle,
  Mountain,
  Bus,
  Landmark,
  AlertTriangle,
  Sparkles,
  Zap,
  Euro,
  Maximize,
  Star,
  Bed,
  Bath,
  Trash2,
  Edit3,
  Check,
  FileText,
  Plus,
  X,
  Save,
  Eye,
  EyeOff,
  ExternalLink,
  TrendingUp,
  UtensilsCrossed,
  Navigation
} from 'lucide-react';

interface HouseRule {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface HouseRulesProps {
  rules: HouseRule[];
  className?: string;
}

// Rule icons mapping
const ruleIcons = {
  no_smoking: Shield,
  no_pets: Users,
  no_parties: Volume2,
  quiet_hours: Clock,
  no_shoes: Home,
  max_guests: Users,
  check_in_time: Clock,
  check_out_time: Clock,
  cleaning: Sparkles,
  security: Shield,
  wifi: Wifi,
  parking: Car,
  elevator: Home,
  kitchen: ChefHat,
  tv: Tv,
  ac: Wind,
  balcony: MapPin,
  garden: Trees,
  coffee: Coffee,
  bike: Bike,
  camera: Camera,
  phone: Phone,
  mail: Mail,
  utensils: Utensils,
  waves: Waves,
  airvent: AirVent,
  building: Building,
  castle: Castle,
  mountain: Mountain,
  bus: Bus,
  landmark: Landmark,
  alert: AlertTriangle,
  sparkles: Sparkles,
  zap: Zap,
  euro: Euro,
  maximize: Maximize,
  map_pin: MapPin,
  star: Star,
  bed: Bed,
  bath: Bath,
  users: Users,
  trash: Trash2,
  edit: Edit3,
  check: Check,
  file_text: FileText,
  plus: Plus,
  x: X,
  save: Save,
  eye: Eye,
  eye_off: EyeOff,
  external_link: ExternalLink,
  trending_up: TrendingUp,
  utensils_crossed: UtensilsCrossed,
  navigation: Navigation
};

const HouseRules: React.FC<HouseRulesProps> = ({ rules, className = '' }) => {
  if (!rules || rules.length === 0) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Shield className="h-6 w-6 text-orange-600" />
          House Rules
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map((rule) => {
            const IconComponent = ruleIcons[rule.icon as keyof typeof ruleIcons];
            return (
              <div key={rule.id} className="flex items-start gap-3 p-4 rounded-lg border bg-card/50 hover:bg-card/70 transition-colors">
                <div className="flex-shrink-0">
                  {IconComponent && (
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="h-4 w-4 text-orange-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm mb-1">{rule.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{rule.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default HouseRules;
