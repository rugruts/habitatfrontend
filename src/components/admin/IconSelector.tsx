import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

// Curated icon list with valid lucide-react icons only
const ICON_LIST = [
  // Food & Dining
  { name: 'Utensils', icon: LucideIcons.Utensils, category: 'Food & Dining' },
  { name: 'ChefHat', icon: LucideIcons.ChefHat, category: 'Food & Dining' },
  { name: 'Coffee', icon: LucideIcons.Coffee, category: 'Food & Dining' },
  { name: 'Wine', icon: LucideIcons.Wine, category: 'Food & Dining' },
  { name: 'Beer', icon: LucideIcons.Beer, category: 'Food & Dining' },
  
  // Transportation
  { name: 'Bus', icon: LucideIcons.Bus, category: 'Transportation' },
  { name: 'Car', icon: LucideIcons.Car, category: 'Transportation' },
  { name: 'Train', icon: LucideIcons.Train, category: 'Transportation' },
  { name: 'Plane', icon: LucideIcons.Plane, category: 'Transportation' },
  { name: 'Ship', icon: LucideIcons.Ship, category: 'Transportation' },
  { name: 'Bike', icon: LucideIcons.Bike, category: 'Transportation' },
  { name: 'Truck', icon: LucideIcons.Truck, category: 'Transportation' },
  
  // Shopping & Retail
  { name: 'ShoppingBag', icon: LucideIcons.ShoppingBag, category: 'Shopping & Retail' },
  { name: 'ShoppingCart', icon: LucideIcons.ShoppingCart, category: 'Shopping & Retail' },
  { name: 'Store', icon: LucideIcons.Store, category: 'Shopping & Retail' },
  { name: 'CreditCard', icon: LucideIcons.CreditCard, category: 'Shopping & Retail' },
  { name: 'Receipt', icon: LucideIcons.Receipt, category: 'Shopping & Retail' },
  { name: 'Tag', icon: LucideIcons.Tag, category: 'Shopping & Retail' },
  { name: 'Percent', icon: LucideIcons.Percent, category: 'Shopping & Retail' },
  { name: 'Gift', icon: LucideIcons.Gift, category: 'Shopping & Retail' },
  { name: 'Package', icon: LucideIcons.Package, category: 'Shopping & Retail' },
  { name: 'Box', icon: LucideIcons.Box, category: 'Shopping & Retail' },
  
  // Health & Medical
  { name: 'Activity', icon: LucideIcons.Activity, category: 'Health & Medical' },
  { name: 'Heart', icon: LucideIcons.Heart, category: 'Health & Medical' },
  { name: 'Stethoscope', icon: LucideIcons.Stethoscope, category: 'Health & Medical' },
  { name: 'Pill', icon: LucideIcons.Pill, category: 'Health & Medical' },
  { name: 'Syringe', icon: LucideIcons.Syringe, category: 'Health & Medical' },
  { name: 'Thermometer', icon: LucideIcons.Thermometer, category: 'Health & Medical' },
  { name: 'Brain', icon: LucideIcons.Brain, category: 'Health & Medical' },
  { name: 'Eye', icon: LucideIcons.Eye, category: 'Health & Medical' },
  
  // Education
  { name: 'GraduationCap', icon: LucideIcons.GraduationCap, category: 'Education' },
  { name: 'BookOpen', icon: LucideIcons.BookOpen, category: 'Education' },
  { name: 'Book', icon: LucideIcons.Book, category: 'Education' },
  { name: 'PenTool', icon: LucideIcons.PenTool, category: 'Education' },
  { name: 'Pencil', icon: LucideIcons.Pencil, category: 'Education' },
  { name: 'Calculator', icon: LucideIcons.Calculator, category: 'Education' },
  { name: 'Microscope', icon: LucideIcons.Microscope, category: 'Education' },
  { name: 'TestTube', icon: LucideIcons.TestTube, category: 'Education' },
  { name: 'Atom', icon: LucideIcons.Atom, category: 'Education' },
  { name: 'FlaskConical', icon: LucideIcons.FlaskConical, category: 'Education' },
  
  // Entertainment & Culture
  { name: 'Landmark', icon: LucideIcons.Landmark, category: 'Entertainment & Culture' },
  { name: 'Castle', icon: LucideIcons.Castle, category: 'Entertainment & Culture' },
  { name: 'Theater', icon: LucideIcons.Theater, category: 'Entertainment & Culture' },
  { name: 'Music', icon: LucideIcons.Music, category: 'Entertainment & Culture' },
  { name: 'Video', icon: LucideIcons.Video, category: 'Entertainment & Culture' },
  { name: 'Tv', icon: LucideIcons.Tv, category: 'Entertainment & Culture' },
  { name: 'Gamepad2', icon: LucideIcons.Gamepad2, category: 'Entertainment & Culture' },
  { name: 'Dice1', icon: LucideIcons.Dice1, category: 'Entertainment & Culture' },
  { name: 'Palette', icon: LucideIcons.Palette, category: 'Entertainment & Culture' },
  { name: 'Camera', icon: LucideIcons.Camera, category: 'Entertainment & Culture' },
  
  // Sports & Recreation
  { name: 'Trophy', icon: LucideIcons.Trophy, category: 'Sports & Recreation' },
  { name: 'Medal', icon: LucideIcons.Medal, category: 'Sports & Recreation' },
  { name: 'Target', icon: LucideIcons.Target, category: 'Sports & Recreation' },
  { name: 'Dumbbell', icon: LucideIcons.Dumbbell, category: 'Sports & Recreation' },
  
  // Nature & Outdoors
  { name: 'Trees', icon: LucideIcons.Trees, category: 'Nature & Outdoors' },
  { name: 'Mountain', icon: LucideIcons.Mountain, category: 'Nature & Outdoors' },
  { name: 'Sun', icon: LucideIcons.Sun, category: 'Nature & Outdoors' },
  { name: 'Moon', icon: LucideIcons.Moon, category: 'Nature & Outdoors' },
  { name: 'Cloud', icon: LucideIcons.Cloud, category: 'Nature & Outdoors' },
  { name: 'CloudRain', icon: LucideIcons.CloudRain, category: 'Nature & Outdoors' },
  { name: 'CloudSnow', icon: LucideIcons.CloudSnow, category: 'Nature & Outdoors' },
  { name: 'Wind', icon: LucideIcons.Wind, category: 'Nature & Outdoors' },
  { name: 'Umbrella', icon: LucideIcons.Umbrella, category: 'Nature & Outdoors' },
  { name: 'Flower', icon: LucideIcons.Flower, category: 'Nature & Outdoors' },
  
  // Business & Finance
  { name: 'Building', icon: LucideIcons.Building, category: 'Business & Finance' },
  { name: 'Banknote', icon: LucideIcons.Banknote, category: 'Business & Finance' },
  { name: 'DollarSign', icon: LucideIcons.DollarSign, category: 'Business & Finance' },
  { name: 'Euro', icon: LucideIcons.Euro, category: 'Business & Finance' },
  { name: 'PoundSterling', icon: LucideIcons.PoundSterling, category: 'Business & Finance' },
  { name: 'TrendingUp', icon: LucideIcons.TrendingUp, category: 'Business & Finance' },
  { name: 'TrendingDown', icon: LucideIcons.TrendingDown, category: 'Business & Finance' },
  { name: 'BarChart', icon: LucideIcons.BarChart, category: 'Business & Finance' },
  { name: 'PieChart', icon: LucideIcons.PieChart, category: 'Business & Finance' },
  
  // Technology
  { name: 'Smartphone', icon: LucideIcons.Smartphone, category: 'Technology' },
  { name: 'Laptop', icon: LucideIcons.Laptop, category: 'Technology' },
  { name: 'Monitor', icon: LucideIcons.Monitor, category: 'Technology' },
  { name: 'Tablet', icon: LucideIcons.Tablet, category: 'Technology' },
  { name: 'Wifi', icon: LucideIcons.Wifi, category: 'Technology' },
  { name: 'Bluetooth', icon: LucideIcons.Bluetooth, category: 'Technology' },
  { name: 'Radio', icon: LucideIcons.Radio, category: 'Technology' },
  { name: 'Headphones', icon: LucideIcons.Headphones, category: 'Technology' },
  { name: 'Speaker', icon: LucideIcons.Speaker, category: 'Technology' },
  { name: 'Printer', icon: LucideIcons.Printer, category: 'Technology' },
  
  // Services
  { name: 'Wrench', icon: LucideIcons.Wrench, category: 'Services' },
  { name: 'Hammer', icon: LucideIcons.Hammer, category: 'Services' },
  { name: 'Settings', icon: LucideIcons.Settings, category: 'Services' },
  { name: 'Paintbrush', icon: LucideIcons.Paintbrush, category: 'Services' },
  { name: 'Scissors', icon: LucideIcons.Scissors, category: 'Services' },
  { name: 'Ruler', icon: LucideIcons.Ruler, category: 'Services' },
  
  // Communication
  { name: 'Phone', icon: LucideIcons.Phone, category: 'Communication' },
  { name: 'Mail', icon: LucideIcons.Mail, category: 'Communication' },
  { name: 'MessageCircle', icon: LucideIcons.MessageCircle, category: 'Communication' },
  { name: 'MessageSquare', icon: LucideIcons.MessageSquare, category: 'Communication' },
  { name: 'Send', icon: LucideIcons.Send, category: 'Communication' },
  { name: 'Reply', icon: LucideIcons.Reply, category: 'Communication' },
  { name: 'Forward', icon: LucideIcons.Forward, category: 'Communication' },
  { name: 'Share', icon: LucideIcons.Share, category: 'Communication' },
  
  // Security & Safety
  { name: 'Shield', icon: LucideIcons.Shield, category: 'Security & Safety' },
  { name: 'Lock', icon: LucideIcons.Lock, category: 'Security & Safety' },
  { name: 'Unlock', icon: LucideIcons.Unlock, category: 'Security & Safety' },
  { name: 'Key', icon: LucideIcons.Key, category: 'Security & Safety' },
  { name: 'Fingerprint', icon: LucideIcons.Fingerprint, category: 'Security & Safety' },
  { name: 'EyeIcon', icon: LucideIcons.Eye, category: 'Security & Safety' },
  { name: 'EyeOff', icon: LucideIcons.EyeOff, category: 'Security & Safety' },
  { name: 'Bell', icon: LucideIcons.Bell, category: 'Security & Safety' },
  { name: 'AlarmClock', icon: LucideIcons.AlarmClock, category: 'Security & Safety' },
  { name: 'Timer', icon: LucideIcons.Timer, category: 'Security & Safety' },
  
  // Utilities
  { name: 'Zap', icon: LucideIcons.Zap, category: 'Utilities' },
  { name: 'Battery', icon: LucideIcons.Battery, category: 'Utilities' },
  { name: 'BatteryCharging', icon: LucideIcons.BatteryCharging, category: 'Utilities' },
  { name: 'Power', icon: LucideIcons.Power, category: 'Utilities' },
  { name: 'PowerOff', icon: LucideIcons.PowerOff, category: 'Utilities' },
  { name: 'Lightbulb', icon: LucideIcons.Lightbulb, category: 'Utilities' },
  { name: 'Flashlight', icon: LucideIcons.Flashlight, category: 'Utilities' },
  { name: 'Droplets', icon: LucideIcons.Droplets, category: 'Utilities' },
  { name: 'Flame', icon: LucideIcons.Flame, category: 'Utilities' },
  
  // Navigation & Location
  { name: 'MapPin', icon: LucideIcons.MapPin, category: 'Navigation & Location' },
  { name: 'Navigation', icon: LucideIcons.Navigation, category: 'Navigation & Location' },
  { name: 'Compass', icon: LucideIcons.Compass, category: 'Navigation & Location' },
  { name: 'Globe', icon: LucideIcons.Globe, category: 'Navigation & Location' },
  { name: 'Map', icon: LucideIcons.Map, category: 'Navigation & Location' },
  { name: 'Route', icon: LucideIcons.Route, category: 'Navigation & Location' },
  { name: 'Flag', icon: LucideIcons.Flag, category: 'Navigation & Location' },
  { name: 'Anchor', icon: LucideIcons.Anchor, category: 'Navigation & Location' },
  { name: 'Crosshair', icon: LucideIcons.Crosshair, category: 'Navigation & Location' },
  { name: 'TargetIcon', icon: LucideIcons.Target, category: 'Navigation & Location' },
  
  // Time & Calendar
  { name: 'Clock', icon: LucideIcons.Clock, category: 'Time & Calendar' },
  { name: 'Calendar', icon: LucideIcons.Calendar, category: 'Time & Calendar' },
  { name: 'CalendarDays', icon: LucideIcons.CalendarDays, category: 'Time & Calendar' },
  { name: 'CalendarCheck', icon: LucideIcons.CalendarCheck, category: 'Time & Calendar' },
  { name: 'CalendarX', icon: LucideIcons.CalendarX, category: 'Time & Calendar' },
  { name: 'CalendarPlus', icon: LucideIcons.CalendarPlus, category: 'Time & Calendar' },
  { name: 'CalendarMinus', icon: LucideIcons.CalendarMinus, category: 'Time & Calendar' },
  { name: 'Watch', icon: LucideIcons.Watch, category: 'Time & Calendar' },
  { name: 'TimerIcon', icon: LucideIcons.Timer, category: 'Time & Calendar' },
  { name: 'Hourglass', icon: LucideIcons.Hourglass, category: 'Time & Calendar' },
  
  // People & Social
  { name: 'User', icon: LucideIcons.User, category: 'People & Social' },
  { name: 'Users', icon: LucideIcons.Users, category: 'People & Social' },
  { name: 'UserPlus', icon: LucideIcons.UserPlus, category: 'People & Social' },
  { name: 'UserMinus', icon: LucideIcons.UserMinus, category: 'People & Social' },
  { name: 'UserCheck', icon: LucideIcons.UserCheck, category: 'People & Social' },
  { name: 'UserX', icon: LucideIcons.UserX, category: 'People & Social' },
  { name: 'Baby', icon: LucideIcons.Baby, category: 'People & Social' },
  { name: 'PersonStanding', icon: LucideIcons.PersonStanding, category: 'People & Social' },
  
  // Home & Living
  { name: 'Home', icon: LucideIcons.Home, category: 'Home & Living' },
  { name: 'Bed', icon: LucideIcons.Bed, category: 'Home & Living' },
  { name: 'Bath', icon: LucideIcons.Bath, category: 'Home & Living' },
  { name: 'Lamp', icon: LucideIcons.Lamp, category: 'Home & Living' },
  { name: 'DoorOpen', icon: LucideIcons.DoorOpen, category: 'Home & Living' },
  { name: 'DoorClosed', icon: LucideIcons.DoorClosed, category: 'Home & Living' },
  { name: 'Armchair', icon: LucideIcons.Armchair, category: 'Home & Living' },
  
  // General Icons
  { name: 'Star', icon: LucideIcons.Star, category: 'General' },
  { name: 'HeartIcon', icon: LucideIcons.Heart, category: 'General' },
  { name: 'ThumbsUp', icon: LucideIcons.ThumbsUp, category: 'General' },
  { name: 'ThumbsDown', icon: LucideIcons.ThumbsDown, category: 'General' },
  { name: 'Smile', icon: LucideIcons.Smile, category: 'General' },
  { name: 'Frown', icon: LucideIcons.Frown, category: 'General' },
  { name: 'Meh', icon: LucideIcons.Meh, category: 'General' },
  { name: 'Check', icon: LucideIcons.Check, category: 'General' },
  { name: 'X', icon: LucideIcons.X, category: 'General' },
  { name: 'Plus', icon: LucideIcons.Plus, category: 'General' },
  { name: 'Minus', icon: LucideIcons.Minus, category: 'General' },
  { name: 'Edit', icon: LucideIcons.Edit, category: 'General' },
  { name: 'Trash', icon: LucideIcons.Trash, category: 'General' },
  { name: 'Info', icon: LucideIcons.Info, category: 'General' },
  { name: 'AlertTriangle', icon: LucideIcons.AlertTriangle, category: 'General' },
  { name: 'CheckCircle', icon: LucideIcons.CheckCircle, category: 'General' },
  { name: 'XCircle', icon: LucideIcons.XCircle, category: 'General' },
  
  // Hotel & Hospitality
  { name: 'Building2', icon: LucideIcons.Building2, category: 'Hotel & Hospitality' },
  { name: 'BedDouble', icon: LucideIcons.BedDouble, category: 'Hotel & Hospitality' },
  { name: 'Waves', icon: LucideIcons.Waves, category: 'Hotel & Hospitality' },
  { name: 'Palmtree', icon: LucideIcons.Palmtree, category: 'Hotel & Hospitality' },
  { name: 'UtensilsCrossed', icon: LucideIcons.UtensilsCrossed, category: 'Hotel & Hospitality' },
  { name: 'Concierge', icon: LucideIcons.ConciergeBell, category: 'Hotel & Hospitality' },
  { name: 'Luggage', icon: LucideIcons.Luggage, category: 'Hotel & Hospitality' },
  { name: 'Mountain', icon: LucideIcons.Mountain, category: 'Hotel & Hospitality' },
];

interface IconSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (iconName: string) => void;
  selectedIcon?: string;
}

export const IconSelector: React.FC<IconSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedIcon
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(ICON_LIST.map(icon => icon.category)))];

  const filteredIcons = ICON_LIST.filter(icon => {
    const matchesSearch = icon.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || icon.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleIconSelect = (iconName: string) => {
    onSelect(iconName);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select Icon</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search icons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Icons Grid */}
          <ScrollArea className="h-[400px]">
            <div className="grid grid-cols-8 gap-2 p-2">
              {filteredIcons.map((iconItem) => {
                const IconComponent = iconItem.icon;
                const isSelected = selectedIcon === iconItem.name;
                
                // Add error boundary check for undefined components
                if (!IconComponent) {
                  console.warn(`Icon component ${iconItem.name} is undefined`);
                  return null;
                }
                
                return (
                  <Button
                    key={iconItem.name}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className="h-12 w-12 p-0 flex items-center justify-center"
                    onClick={() => handleIconSelect(iconItem.name)}
                    title={iconItem.name}
                  >
                    <IconComponent className="h-5 w-5" />
                  </Button>
                );
              })}
            </div>
          </ScrollArea>

          {/* Results Count */}
          <div className="text-sm text-muted-foreground text-center">
            {filteredIcons.length} icons found
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
