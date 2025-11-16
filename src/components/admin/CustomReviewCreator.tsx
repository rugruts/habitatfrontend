import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Star, 
  Plus, 
  Save, 
  X,
  Upload,
  Camera,
  User,
  Calendar,
  MapPin,
  Eye,
  Settings
} from 'lucide-react';

interface CustomReview {
  guest_name: string;
  guest_email: string;
  guest_avatar_url?: string;
  overall_rating: number;
  cleanliness_rating?: number;
  communication_rating?: number;
  location_rating?: number;
  value_rating?: number;
  accuracy_rating?: number;
  title: string;
  review_text: string;
  pros?: string;
  cons?: string;
  stay_date: string;
  nights_stayed: number;
  guest_count: number;
  trip_type?: string;
  property_id: string;
  is_verified: boolean;
  is_featured: boolean;
  show_on_homepage: boolean;
  status: 'approved' | 'pending' | 'hidden';
  photos: File[];
}

interface CustomReviewCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (review: CustomReview) => void;
  properties: Array<{ id: string; name: string }>;
}

const StarRating: React.FC<{
  rating: number;
  onRatingChange: (rating: number) => void;
  label: string;
  required?: boolean;
}> = ({ rating, onRatingChange, label, required = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="space-y-2">
      <Label className="font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="transition-colors duration-150"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => onRatingChange(star)}
            >
              <Star
                className={`h-6 w-6 ${
                  star <= (hoverRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
        <span className="text-sm text-gray-600">{rating}/5</span>
      </div>
    </div>
  );
};

export const CustomReviewCreator: React.FC<CustomReviewCreatorProps> = ({
  isOpen,
  onClose,
  onSave,
  properties
}) => {
  const [review, setReview] = useState<CustomReview>({
    guest_name: '',
    guest_email: '',
    guest_avatar_url: '',
    overall_rating: 0,
    cleanliness_rating: 0,
    communication_rating: 0,
    location_rating: 0,
    value_rating: 0,
    accuracy_rating: 0,
    title: '',
    review_text: '',
    pros: '',
    cons: '',
    stay_date: '',
    nights_stayed: 1,
    guest_count: 1,
    trip_type: '',
    property_id: '',
    is_verified: true,
    is_featured: false,
    show_on_homepage: false,
    status: 'approved',
    photos: []
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const validateReview = (): boolean => {
    const newErrors: string[] = [];

    if (!review.guest_name.trim()) newErrors.push('Guest name is required');
    if (!review.guest_email.trim()) newErrors.push('Guest email is required');
    if (!review.property_id) newErrors.push('Property selection is required');
    if (review.overall_rating === 0) newErrors.push('Overall rating is required');
    if (!review.review_text.trim()) newErrors.push('Review text is required');
    if (!review.stay_date) newErrors.push('Stay date is required');

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSave = async () => {
    if (!validateReview()) return;

    setSaving(true);
    try {
      await onSave(review);
      
      // Reset form
      setReview({
        guest_name: '',
        guest_email: '',
        guest_avatar_url: '',
        overall_rating: 0,
        cleanliness_rating: 0,
        communication_rating: 0,
        location_rating: 0,
        value_rating: 0,
        accuracy_rating: 0,
        title: '',
        review_text: '',
        pros: '',
        cons: '',
        stay_date: '',
        nights_stayed: 1,
        guest_count: 1,
        trip_type: '',
        property_id: '',
        is_verified: true,
        is_featured: false,
        show_on_homepage: false,
        status: 'approved',
        photos: []
      });
      
      onClose();
    } catch (error) {
      console.error('Error saving review:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB limit
    );
    setReview(prev => ({ 
      ...prev, 
      photos: [...prev.photos, ...validFiles].slice(0, 5) // Max 5 photos
    }));
  };

  const removePhoto = (index: number) => {
    setReview(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4 w-[calc(100vw-2rem)] sm:w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create Custom Review
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {errors.length > 0 && (
            <Alert>
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Guest & Property Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Guest Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="guest-name">Guest Name *</Label>
                    <Input
                      id="guest-name"
                      value={review.guest_name}
                      onChange={(e) => setReview(prev => ({ ...prev, guest_name: e.target.value }))}
                      placeholder="e.g., Maria Gonzalez"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="guest-email">Guest Email *</Label>
                    <Input
                      id="guest-email"
                      type="email"
                      value={review.guest_email}
                      onChange={(e) => setReview(prev => ({ ...prev, guest_email: e.target.value }))}
                      placeholder="e.g., maria@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="guest-avatar">Guest Avatar URL (Optional)</Label>
                    <Input
                      id="guest-avatar"
                      value={review.guest_avatar_url}
                      onChange={(e) => setReview(prev => ({ ...prev, guest_avatar_url: e.target.value }))}
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Stay Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="property">Property *</Label>
                    <Select 
                      value={review.property_id} 
                      onValueChange={(value) => setReview(prev => ({ ...prev, property_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select property" />
                      </SelectTrigger>
                      <SelectContent>
                        {properties.map((property) => (
                          <SelectItem key={property.id} value={property.id}>
                            {property.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="stay-date">Stay Date *</Label>
                      <Input
                        id="stay-date"
                        type="date"
                        value={review.stay_date}
                        onChange={(e) => setReview(prev => ({ ...prev, stay_date: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="nights">Nights Stayed</Label>
                      <Input
                        id="nights"
                        type="number"
                        min="1"
                        value={review.nights_stayed}
                        onChange={(e) => setReview(prev => ({ ...prev, nights_stayed: parseInt(e.target.value) || 1 }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="guests">Guest Count</Label>
                      <Input
                        id="guests"
                        type="number"
                        min="1"
                        value={review.guest_count}
                        onChange={(e) => setReview(prev => ({ ...prev, guest_count: parseInt(e.target.value) || 1 }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="trip-type">Trip Type</Label>
                      <Select 
                        value={review.trip_type} 
                        onValueChange={(value) => setReview(prev => ({ ...prev, trip_type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="leisure">Leisure</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="family">Family</SelectItem>
                          <SelectItem value="couple">Couple</SelectItem>
                          <SelectItem value="solo">Solo</SelectItem>
                          <SelectItem value="friends">Friends</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Review Content */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Ratings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <StarRating
                    rating={review.overall_rating}
                    onRatingChange={(rating) => setReview(prev => ({ ...prev, overall_rating: rating }))}
                    label="Overall Rating"
                    required
                  />
                  
                  <div className="grid grid-cols-1 gap-4">
                    <StarRating
                      rating={review.cleanliness_rating || 0}
                      onRatingChange={(rating) => setReview(prev => ({ ...prev, cleanliness_rating: rating }))}
                      label="Cleanliness"
                    />
                    <StarRating
                      rating={review.communication_rating || 0}
                      onRatingChange={(rating) => setReview(prev => ({ ...prev, communication_rating: rating }))}
                      label="Communication"
                    />
                    <StarRating
                      rating={review.location_rating || 0}
                      onRatingChange={(rating) => setReview(prev => ({ ...prev, location_rating: rating }))}
                      label="Location"
                    />
                    <StarRating
                      rating={review.value_rating || 0}
                      onRatingChange={(rating) => setReview(prev => ({ ...prev, value_rating: rating }))}
                      label="Value"
                    />
                    <StarRating
                      rating={review.accuracy_rating || 0}
                      onRatingChange={(rating) => setReview(prev => ({ ...prev, accuracy_rating: rating }))}
                      label="Accuracy"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Review Content */}
          <Card>
            <CardHeader>
              <CardTitle>Review Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Review Title</Label>
                <Input
                  id="title"
                  value={review.title}
                  onChange={(e) => setReview(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Amazing stay in the heart of Trikala"
                  maxLength={100}
                />
              </div>

              <div>
                <Label htmlFor="review-text">Review Text *</Label>
                <Textarea
                  id="review-text"
                  value={review.review_text}
                  onChange={(e) => setReview(prev => ({ ...prev, review_text: e.target.value }))}
                  placeholder="Write the guest's experience..."
                  className="min-h-[120px]"
                  maxLength={2000}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {review.review_text.length}/2000 characters
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pros">What they loved</Label>
                  <Textarea
                    id="pros"
                    value={review.pros}
                    onChange={(e) => setReview(prev => ({ ...prev, pros: e.target.value }))}
                    placeholder="Positive aspects..."
                    className="min-h-[80px]"
                    maxLength={500}
                  />
                </div>
                
                <div>
                  <Label htmlFor="cons">Areas for improvement</Label>
                  <Textarea
                    id="cons"
                    value={review.cons}
                    onChange={(e) => setReview(prev => ({ ...prev, cons: e.target.value }))}
                    placeholder="Areas that could be better..."
                    className="min-h-[80px]"
                    maxLength={500}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Photos (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {review.photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {review.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {review.photos.length < 5 && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload photos ({review.photos.length}/5)
                    </p>
                  </label>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Review Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="verified">Verified Guest</Label>
                  <p className="text-sm text-gray-600">Mark this guest as verified</p>
                </div>
                <Switch
                  id="verified"
                  checked={review.is_verified}
                  onCheckedChange={(checked) => setReview(prev => ({ ...prev, is_verified: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="featured">Featured Review</Label>
                  <p className="text-sm text-gray-600">Highlight this review</p>
                </div>
                <Switch
                  id="featured"
                  checked={review.is_featured}
                  onCheckedChange={(checked) => setReview(prev => ({ ...prev, is_featured: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="homepage">Show on Homepage</Label>
                  <p className="text-sm text-gray-600">Display this review on the main page</p>
                </div>
                <Switch
                  id="homepage"
                  checked={review.show_on_homepage}
                  onCheckedChange={(checked) => setReview(prev => ({ ...prev, show_on_homepage: checked }))}
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={review.status} 
                  onValueChange={(value) => setReview(prev => ({ ...prev, status: value as 'approved' | 'pending' | 'hidden' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="hidden">Hidden</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Review
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
