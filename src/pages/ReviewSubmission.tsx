import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Star, 
  Upload, 
  X, 
  CheckCircle, 
  ArrowLeft,
  Camera,
  Heart,
  MapPin,
  Calendar,
  Users,
  Sparkles,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Send
} from 'lucide-react';
import { supabaseHelpers } from '@/lib/supabase';

interface BookingDetails {
  id: string;
  property_name: string;
  property_address: string;
  check_in: string;
  check_out: string;
  guests: number;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  currency: string;
  status: string;
}

interface ReviewData {
  overall_rating: number;
  cleanliness_rating: number;
  communication_rating: number;
  location_rating: number;
  value_rating: number;
  accuracy_rating: number;
  title: string;
  review_text: string;
  pros: string;
  cons: string;
  trip_type: string;
  photos: File[];
}

const StarRating: React.FC<{
  rating: number;
  onRatingChange: (rating: number) => void;
  label: string;
  description?: string;
}> = ({ rating, onRatingChange, label, description }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="font-medium">{label}</Label>
        <span className="text-sm text-gray-500">{rating}/5</span>
      </div>
      {description && (
        <p className="text-xs text-gray-600">{description}</p>
      )}
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
              className={`h-8 w-8 ${
                star <= (hoverRating || rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

const PhotoUpload: React.FC<{
  photos: File[];
  onPhotosChange: (photos: File[]) => void;
}> = ({ photos, onPhotosChange }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB limit
    );
    onPhotosChange([...photos, ...validFiles].slice(0, 5)); // Max 5 photos
  };

  const removePhoto = (index: number) => {
    onPhotosChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="font-medium">Photos (Optional)</Label>
        <span className="text-sm text-gray-500">{photos.length}/5</span>
      </div>
      <p className="text-xs text-gray-600">
        Share photos from your stay to help future guests
      </p>
      
      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
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
      
      {photos.length < 5 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="photo-upload"
          />
          <label htmlFor="photo-upload" className="cursor-pointer">
            <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              Click to upload photos
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG up to 5MB each
            </p>
          </label>
        </div>
      )}
    </div>
  );
};

const ReviewSubmission: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [reviewData, setReviewData] = useState<ReviewData>({
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
    trip_type: '',
    photos: []
  });

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        setError('No booking ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Verify token if provided
        if (token) {
          // TODO: Verify review invitation token
        }
        
        // Get booking details
        const bookingsResult = await supabaseHelpers.getAllBookings(1, 0, { booking_id: bookingId });
        
        if (!bookingsResult.bookings || bookingsResult.bookings.length === 0) {
          setError('Booking not found');
          setLoading(false);
          return;
        }

        const bookingData = bookingsResult.bookings[0];
        
        // Check if booking is eligible for review (checked out)
        if (!['checked_out', 'completed'].includes(bookingData.status)) {
          setError('This booking is not eligible for review yet');
          setLoading(false);
          return;
        }

        setBooking({
          id: bookingData.id,
          property_name: bookingData.properties?.name || 'Property',
          property_address: 'Trikala, Greece', // TODO: Get from property data
          check_in: bookingData.check_in,
          check_out: bookingData.check_out,
          guests: bookingData.guests,
          customer_name: bookingData.customer_name,
          customer_email: bookingData.customer_email,
          total_amount: bookingData.total_amount,
          currency: bookingData.currency || 'EUR',
          status: bookingData.status
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Failed to load booking details');
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, token]);

  const handleSubmitReview = async () => {
    if (!booking) return;

    // Validate required fields
    if (reviewData.overall_rating === 0) {
      setError('Please provide an overall rating');
      return;
    }

    if (!reviewData.review_text.trim()) {
      setError('Please write a review');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // TODO: Upload photos to storage and get URLs
      const photoUrls: string[] = [];

      // Calculate stay details
      const checkInDate = new Date(booking.check_in);
      const checkOutDate = new Date(booking.check_out);
      const nightsStayed = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

      // Submit review
      const reviewPayload = {
        booking_id: booking.id,
        property_id: 'property-id', // TODO: Get from booking
        guest_name: booking.customer_name,
        guest_email: booking.customer_email,
        overall_rating: reviewData.overall_rating,
        cleanliness_rating: reviewData.cleanliness_rating || null,
        communication_rating: reviewData.communication_rating || null,
        location_rating: reviewData.location_rating || null,
        value_rating: reviewData.value_rating || null,
        accuracy_rating: reviewData.accuracy_rating || null,
        title: reviewData.title || null,
        review_text: reviewData.review_text,
        pros: reviewData.pros || null,
        cons: reviewData.cons || null,
        stay_date: booking.check_in,
        nights_stayed: nightsStayed,
        guest_count: booking.guests,
        trip_type: reviewData.trip_type || null,
        photos: photoUrls,
        status: 'pending' as const,
        is_verified: false,
        is_featured: false,
        source: token ? 'email_link' : 'direct'
      };

      // Call API to create review
      const result = await supabaseHelpers.createReview(reviewPayload);
      console.log('Review submitted successfully:', result);
      
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">{error || 'Booking not found'}</p>
            <Button onClick={() => navigate('/')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Thank You!</h1>
            <p className="text-gray-600 mb-6">
              Your review has been submitted and will be published after moderation.
            </p>
            <div className="space-y-3">
              <Button onClick={() => navigate('/')} className="w-full">
                Back to Home
              </Button>
              <Button
                onClick={() => navigate(`/view-booking/${booking.id}`)}
                variant="outline"
                className="w-full"
              >
                View Booking
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const checkInDate = new Date(booking.check_in);
  const checkOutDate = new Date(booking.check_out);
  const nightsStayed = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <main className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Write a Review - {booking.property_name} | Habitat Lobby</title>
        <meta name="description" content={`Share your experience at ${booking.property_name}`} />
      </Helmet>

      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate(`/view-booking/${booking.id}`)}
            className="text-white hover:bg-white/10 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Booking
          </Button>

          <div className="text-center">
            <h1 className="font-serif text-4xl md:text-5xl mb-4">
              Share Your Experience
            </h1>
            <p className="text-xl opacity-90 mb-6">
              Help future guests by writing a review
            </p>

            {/* Booking Summary */}
            <Card className="bg-white/10 border-white/20 text-white max-w-2xl mx-auto">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <div>
                      <p className="font-medium">{booking.property_name}</p>
                      <p className="text-sm opacity-75">{booking.property_address}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <div>
                      <p className="font-medium">{nightsStayed} nights</p>
                      <p className="text-sm opacity-75">
                        {checkInDate.toLocaleDateString()} - {checkOutDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Users className="h-5 w-5" />
                    <div>
                      <p className="font-medium">{booking.guests} guests</p>
                      <p className="text-sm opacity-75">Total stay</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Review Form */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Review Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overall Rating */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Overall Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <StarRating
                    rating={reviewData.overall_rating}
                    onRatingChange={(rating) => setReviewData(prev => ({ ...prev, overall_rating: rating }))}
                    label="How was your overall experience?"
                    description="Rate your stay from 1 (poor) to 5 (excellent)"
                  />
                </CardContent>
              </Card>

              {/* Detailed Ratings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    Detailed Ratings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <StarRating
                    rating={reviewData.cleanliness_rating}
                    onRatingChange={(rating) => setReviewData(prev => ({ ...prev, cleanliness_rating: rating }))}
                    label="Cleanliness"
                    description="How clean was the property?"
                  />
                  <StarRating
                    rating={reviewData.communication_rating}
                    onRatingChange={(rating) => setReviewData(prev => ({ ...prev, communication_rating: rating }))}
                    label="Communication"
                    description="How was the host communication?"
                  />
                  <StarRating
                    rating={reviewData.location_rating}
                    onRatingChange={(rating) => setReviewData(prev => ({ ...prev, location_rating: rating }))}
                    label="Location"
                    description="How convenient was the location?"
                  />
                  <StarRating
                    rating={reviewData.value_rating}
                    onRatingChange={(rating) => setReviewData(prev => ({ ...prev, value_rating: rating }))}
                    label="Value for Money"
                    description="Was it worth the price?"
                  />
                  <StarRating
                    rating={reviewData.accuracy_rating}
                    onRatingChange={(rating) => setReviewData(prev => ({ ...prev, accuracy_rating: rating }))}
                    label="Accuracy"
                    description="Did it match the description?"
                  />
                </CardContent>
              </Card>

              {/* Written Review */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-blue-500" />
                    Your Review
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Review Title (Optional)</Label>
                    <Input
                      id="title"
                      value={reviewData.title}
                      onChange={(e) => setReviewData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Amazing stay in the heart of Trikala"
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <Label htmlFor="review">Your Experience *</Label>
                    <Textarea
                      id="review"
                      value={reviewData.review_text}
                      onChange={(e) => setReviewData(prev => ({ ...prev, review_text: e.target.value }))}
                      placeholder="Tell future guests about your stay. What did you love? What could be improved?"
                      className="min-h-[120px]"
                      maxLength={2000}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {reviewData.review_text.length}/2000 characters
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pros" className="flex items-center gap-2">
                        <ThumbsUp className="h-4 w-4 text-green-500" />
                        What you loved
                      </Label>
                      <Textarea
                        id="pros"
                        value={reviewData.pros}
                        onChange={(e) => setReviewData(prev => ({ ...prev, pros: e.target.value }))}
                        placeholder="What were the highlights?"
                        className="min-h-[80px]"
                        maxLength={500}
                      />
                    </div>

                    <div>
                      <Label htmlFor="cons" className="flex items-center gap-2">
                        <ThumbsDown className="h-4 w-4 text-orange-500" />
                        Areas for improvement
                      </Label>
                      <Textarea
                        id="cons"
                        value={reviewData.cons}
                        onChange={(e) => setReviewData(prev => ({ ...prev, cons: e.target.value }))}
                        placeholder="What could be better?"
                        className="min-h-[80px]"
                        maxLength={500}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trip Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Trip Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="trip-type">Type of Trip</Label>
                    <Select
                      value={reviewData.trip_type}
                      onValueChange={(value) => setReviewData(prev => ({ ...prev, trip_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select trip type" />
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
                </CardContent>
              </Card>

              {/* Photo Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5 text-indigo-500" />
                    Photos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PhotoUpload
                    photos={reviewData.photos}
                    onPhotosChange={(photos) => setReviewData(prev => ({ ...prev, photos }))}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Review Guidelines */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Review Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Heart className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <p>Be honest and helpful to future guests</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <MessageCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p>Focus on your personal experience</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Camera className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <p>Photos help showcase the property</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p>Reviews are moderated before publishing</p>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Card>
                <CardContent className="p-6">
                  {error && (
                    <Alert className="mb-4">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    onClick={handleSubmitReview}
                    disabled={submitting || reviewData.overall_rating === 0 || !reviewData.review_text.trim()}
                    className="w-full"
                    size="lg"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Review
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Your review will be published after moderation
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
};

export default ReviewSubmission;
