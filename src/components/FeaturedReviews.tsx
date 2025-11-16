import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Star, 
  Quote,
  ChevronLeft,
  ChevronRight,
  Verified,
  Calendar,
  Users,
  MapPin
} from 'lucide-react';

interface FeaturedReview {
  id: string;
  guest_name: string;
  guest_avatar_url?: string;
  overall_rating: number;
  title?: string;
  review_text: string;
  stay_date: string;
  nights_stayed: number;
  guest_count: number;
  trip_type?: string;
  is_verified: boolean;
  property_name: string;
  created_at: string;
}

interface FeaturedReviewsProps {
  className?: string;
  maxReviews?: number;
  showCarousel?: boolean;
}

const StarRating: React.FC<{ rating: number; size?: 'sm' | 'md' | 'lg' }> = ({ 
  rating, 
  size = 'sm' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

const ReviewCard: React.FC<{ review: FeaturedReview }> = ({ review }) => {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6 h-full flex flex-col">
        {/* Quote Icon */}
        <div className="mb-4">
          <Quote className="h-8 w-8 text-blue-600 opacity-20" />
        </div>

        {/* Rating */}
        <div className="mb-4">
          <StarRating rating={review.overall_rating} size="md" />
        </div>

        {/* Review Content */}
        <div className="flex-1 mb-6">
          {review.title && (
            <h4 className="font-semibold text-lg mb-2 line-clamp-2">
              {review.title}
            </h4>
          )}
          <p className="text-gray-700 leading-relaxed line-clamp-4">
            {review.review_text}
          </p>
        </div>

        {/* Guest Info */}
        <div className="border-t pt-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={review.guest_avatar_url} alt={review.guest_name} />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {review.guest_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h5 className="font-medium">{review.guest_name}</h5>
                {review.is_verified && (
                  <Badge variant="secondary" className="text-xs">
                    <Verified className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{review.property_name}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(review.stay_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{review.guest_count} guests</span>
                  </div>
                </div>
                
                {review.trip_type && (
                  <div className="mt-1">
                    <Badge variant="outline" className="text-xs capitalize">
                      {review.trip_type} trip
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const FeaturedReviews: React.FC<FeaturedReviewsProps> = ({ 
  className = '',
  maxReviews = 6,
  showCarousel = false
}) => {
  const [reviews, setReviews] = useState<FeaturedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchFeaturedReviews = async () => {
      setLoading(true);
      
      try {
        // TODO: Replace with actual API call to fetch featured reviews
        // const response = await supabaseHelpers.getFeaturedReviews(maxReviews);
        
        // For now, start with empty state
        const fetchedReviews: FeaturedReview[] = [];
        
        setReviews(fetchedReviews);
      } catch (error) {
        console.error('Error fetching featured reviews:', error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedReviews();
  }, [maxReviews]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(reviews.length / 3));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(reviews.length / 3)) % Math.ceil(reviews.length / 3));
  };

  if (loading) {
    return (
      <section className={`py-16 ${className}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null; // Don't show the section if there are no featured reviews
  }

  const displayedReviews = showCarousel 
    ? reviews.slice(currentIndex * 3, (currentIndex * 3) + 3)
    : reviews.slice(0, maxReviews);

  return (
    <section className={`py-16 bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Guests Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real experiences from guests who have stayed with us
          </p>
        </div>

        {/* Reviews Grid/Carousel */}
        <div className="relative">
          {showCarousel && reviews.length > 3 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg"
                onClick={nextSlide}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>

        {/* Carousel Indicators */}
        {showCarousel && reviews.length > 3 && (
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: Math.ceil(reviews.length / 3) }).map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        )}

        {/* Overall Stats */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {reviews.length > 0 
                  ? (reviews.reduce((sum, r) => sum + r.overall_rating, 0) / reviews.length).toFixed(1)
                  : '0.0'
                }
              </div>
              <div className="flex justify-center mb-2">
                <StarRating 
                  rating={reviews.length > 0 
                    ? reviews.reduce((sum, r) => sum + r.overall_rating, 0) / reviews.length
                    : 0
                  } 
                  size="md" 
                />
              </div>
              <p className="text-gray-600">Average Rating</p>
            </div>
            
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {reviews.length}
              </div>
              <p className="text-gray-600">Happy Guests</p>
            </div>
            
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {reviews.filter(r => r.is_verified).length}
              </div>
              <p className="text-gray-600">Verified Reviews</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
