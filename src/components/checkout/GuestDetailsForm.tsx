import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail, Phone, MapPin, MessageSquare, CreditCard } from 'lucide-react';

interface GuestDetailsFormProps {
  form: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    specialRequests: string;
  };
  errors: { [key: string]: string };
  onChange: (field: string, value: string) => void;
}

const countries = [
  { code: 'GR', name: 'Greece' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'AT', name: 'Austria' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'JP', name: 'Japan' },
  { code: 'OTHER', name: 'Other' }
];



export const GuestDetailsForm: React.FC<GuestDetailsFormProps> = ({
  form,
  errors,
  onChange
}) => {
  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-accent" />
            Contact Information
          </CardTitle>
          <p className="text-sm text-gray-600">
            Your contact details for booking confirmation and communication.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              First Name *
            </Label>
            <Input
              id="firstName"
              value={form.firstName}
              onChange={(e) => onChange('firstName', e.target.value)}
              className={errors.firstName ? 'border-red-500 focus:border-red-500' : ''}
              placeholder="Enter your first name"
              required
            />
            {errors.firstName && (
              <p className="text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Last Name *
            </Label>
            <Input
              id="lastName"
              value={form.lastName}
              onChange={(e) => onChange('lastName', e.target.value)}
              className={errors.lastName ? 'border-red-500 focus:border-red-500' : ''}
              placeholder="Enter your last name"
              required
            />
            {errors.lastName && (
              <p className="text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => onChange('email', e.target.value)}
              className={errors.email ? 'border-red-500 focus:border-red-500' : ''}
              placeholder="your.email@example.com"
              required
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
            <p className="text-xs text-gray-500">
              We'll send your booking confirmation and check-in instructions to this email.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              className={errors.phone ? 'border-red-500 focus:border-red-500' : ''}
              placeholder="+30 123 456 7890"
            />
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone}</p>
            )}
            <p className="text-xs text-gray-500">
              Optional. We may contact you if needed regarding your stay.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Country of Residence
            </Label>
            <Select value={form.country} onValueChange={(value) => onChange('country', value)}>
              <SelectTrigger className={errors.country ? 'border-red-500 focus:border-red-500' : ''}>
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country && (
              <p className="text-sm text-red-600">{errors.country}</p>
            )}
          </div>
        </div>

        {/* Special Requests */}
        <div className="space-y-2">
          <Label htmlFor="specialRequests" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Special Requests
          </Label>
          <Textarea
            id="specialRequests"
            value={form.specialRequests}
            onChange={(e) => onChange('specialRequests', e.target.value)}
            placeholder="Any special requests or requirements for your stay? (e.g., early check-in, late check-out, accessibility needs)"
            rows={3}
            className="resize-none"
          />
          <p className="text-xs text-gray-500">
            Optional. We'll do our best to accommodate your requests.
          </p>
        </div>

        </CardContent>
      </Card>

      {/* Check-in Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <CreditCard className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Check-in Information</h4>
              <p className="text-sm text-blue-700">
                Please bring a valid ID (passport or national ID card) for verification during check-in.
                The primary guest must be at least 18 years old.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
