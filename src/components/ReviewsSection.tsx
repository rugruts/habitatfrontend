import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Star, 
  ThumbsUp, 
  Calendar, 
  Users, 
  Filter,
  ChevronDown,
  ChevronUp,
  Camera,
  Verified,
  MessageCircle,
  Heart
} from 'lucide-react';

interface Review {
  id: string;
  guest_name: string;
  guest_avatar_url?: string;
  overall_rating: number;
  cleanliness_rating?: number;
  communication_rating?: number;
  location_rating?: number;
  value_rating?: number;
  accuracy_rating?: number;
  title?: string;
  review_text: string;
  pros?: string;
  cons?: string;
  stay_date: string;
  nights_stayed: number;
  guest_count: number;
  trip_type?: string;
  is_verified: boolean;
  is_featured: boolean;
  helpful_count: number;
  photos: string[];
  has_response: boolean;
  created_at: string;
  responses?: ReviewResponse[];
}

interface ReviewResponse {
  id: string;
  response_text: string;
  responder_name: string;
  responder_role: 'host' | 'admin' | 'manager';
  created_at: string;
}

interface ReviewsSectionProps {
  propertyId: string;
  propertyName: string;
  className?: string;
}

interface ReviewStats {
  total_reviews: number;
  avg_rating: number;
  rating_breakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  category_averages: {
    cleanliness: number;
    communication: number;
    location: number;
    value: number;
    accuracy: number;
  };
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

const RatingBreakdown: React.FC<{ stats: ReviewStats }> = ({ stats }) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-4xl font-bold mb-2">{stats.avg_rating.toFixed(1)}</div>
        <StarRating rating={stats.avg_rating} size="lg" />
        <p className="text-gray-600 mt-2">{stats.total_reviews} reviews</p>
      </div>

      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = stats.rating_breakdown[rating as keyof typeof stats.rating_breakdown];
          const percentage = stats.total_reviews > 0 ? (count / stats.total_reviews) * 100 : 0;
          
          return (
            <div key={rating} className="flex items-center gap-2 text-sm">
              <span className="w-8">{rating}</span>
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-8 text-gray-600">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Category Ratings */}
      <div className="pt-4 border-t space-y-3">
        <h4 className="font-medium text-sm">Category Ratings</h4>
        {Object.entries(stats.category_averages).map(([category, rating]) => (
          <div key={category} className="flex items-center justify-between text-sm">
            <span className="capitalize">{category}</span>
            <div className="flex items-center gap-2">
              <StarRating rating={rating} size="sm" />
              <span className="text-gray-600">{rating.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ReviewCard: React.FC<{ 
  review: Review; 
  onHelpful?: (reviewId: string) => void;
  showFullReview?: boolean;
  onToggleFullReview?: () => void;
}> = ({ review, onHelpful, showFullReview = false, onToggleFullReview }) => {
  const [showPhotos, setShowPhotos] = useState(false);
  const isLongReview = review.review_text.length > 300;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={review.guest_avatar_url} alt={review.guest_name} />
                <AvatarFallback>
                  {review.guest_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{review.guest_name}</h4>
                  {review.is_verified && (
                    <Badge variant="secondary" className="text-xs">
                      <Verified className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {review.is_featured && (
                    <Badge className="text-xs bg-purple-100 text-purple-800">
                      Featured
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{new Date(review.stay_date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{review.nights_stayed} nights</span>
                  <span>•</span>
                  <span>{review.guest_count} guests</span>
                  {review.trip_type && (
                    <>
                      <span>•</span>
                      <span className="capitalize">{review.trip_type}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <StarRating rating={review.overall_rating} size="md" />
              <p className="text-xs text-gray-500 mt-1">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Review Content */}
          <div className="space-y-3">
            {review.title && (
              <h5 className="font-medium text-lg">{review.title}</h5>
            )}
            
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {isLongReview && !showFullReview 
                  ? `${review.review_text.substring(0, 300)}...`
                  : review.review_text
                }
              </p>
              
              {isLongReview && onToggleFullReview && (
                <button
                  onClick={onToggleFullReview}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 mt-2"
                >
                  {showFullReview ? (
                    <>
                      Show less <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Read more <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Pros and Cons */}
            {(review.pros || review.cons) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {review.pros && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <h6 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                      <ThumbsUp className="h-4 w-4" />
                      What they loved
                    </h6>
                    <p className="text-sm text-green-700">{review.pros}</p>
                  </div>
                )}
                {review.cons && (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <h6 className="font-medium text-orange-800 mb-2">
                      Areas for improvement
                    </h6>
                    <p className="text-sm text-orange-700">{review.cons}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Photos */}
          {review.photos.length > 0 && (
            <div>
              <button
                onClick={() => setShowPhotos(!showPhotos)}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                <Camera className="h-4 w-4" />
                {review.photos.length} photo{review.photos.length !== 1 ? 's' : ''}
                {showPhotos ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              
              {showPhotos && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                  {review.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Review photo ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => {
                        // TODO: Open photo in lightbox
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Host Response */}
          {review.has_response && review.responses && review.responses.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h6 className="font-medium text-gray-900">
                      Response from {review.responses[0].responder_name}
                    </h6>
                    <Badge variant="outline" className="text-xs">
                      {review.responses[0].responder_role}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {review.responses[0].response_text}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(review.responses[0].created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-4">
              {onHelpful && (
                <button
                  onClick={() => onHelpful(review.id)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <Heart className="h-4 w-4" />
                  Helpful ({review.helpful_count})
                </button>
              )}
            </div>
            
            {/* Category Ratings */}
            {(review.cleanliness_rating || review.communication_rating || review.location_rating) && (
              <div className="flex items-center gap-4 text-xs text-gray-600">
                {review.cleanliness_rating && (
                  <div className="flex items-center gap-1">
                    <span>Clean:</span>
                    <StarRating rating={review.cleanliness_rating} size="sm" />
                  </div>
                )}
                {review.location_rating && (
                  <div className="flex items-center gap-1">
                    <span>Location:</span>
                    <StarRating rating={review.location_rating} size="sm" />
                  </div>
                )}
                {review.value_rating && (
                  <div className="flex items-center gap-1">
                    <span>Value:</span>
                    <StarRating rating={review.value_rating} size="sm" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  propertyId,
  propertyName,
  className
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    total_reviews: 0,
    avg_rating: 0,
    rating_breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    category_averages: {
      cleanliness: 0,
      communication: 0,
      location: 0,
      value: 0,
      accuracy: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  // Fetch reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);

      try {
        // TODO: Replace with actual API call to fetch reviews
        // const response = await supabaseHelpers.getReviewsByProperty(propertyId);

        // For now, start with empty state
        const fetchedReviews: Review[] = [];

        setReviews(fetchedReviews);

        // Calculate stats
        if (fetchedReviews.length > 0) {
          const totalReviews = fetchedReviews.length;
          const avgRating = fetchedReviews.reduce((sum, r) => sum + r.overall_rating, 0) / totalReviews;

          const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
          fetchedReviews.forEach(review => {
            ratingBreakdown[review.overall_rating as keyof typeof ratingBreakdown]++;
          });

          const categoryAverages = {
            cleanliness: fetchedReviews.filter(r => r.cleanliness_rating).reduce((sum, r) => sum + (r.cleanliness_rating || 0), 0) / fetchedReviews.filter(r => r.cleanliness_rating).length || 0,
            communication: fetchedReviews.filter(r => r.communication_rating).reduce((sum, r) => sum + (r.communication_rating || 0), 0) / fetchedReviews.filter(r => r.communication_rating).length || 0,
            location: fetchedReviews.filter(r => r.location_rating).reduce((sum, r) => sum + (r.location_rating || 0), 0) / fetchedReviews.filter(r => r.location_rating).length || 0,
            value: fetchedReviews.filter(r => r.value_rating).reduce((sum, r) => sum + (r.value_rating || 0), 0) / fetchedReviews.filter(r => r.value_rating).length || 0,
            accuracy: fetchedReviews.filter(r => r.accuracy_rating).reduce((sum, r) => sum + (r.accuracy_rating || 0), 0) / fetchedReviews.filter(r => r.accuracy_rating).length || 0
          };

          setStats({
            total_reviews: totalReviews,
            avg_rating: avgRating,
            rating_breakdown: ratingBreakdown,
            category_averages: categoryAverages
          });
        } else {
          setStats({
            total_reviews: 0,
            avg_rating: 0,
            rating_breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
            category_averages: {
              cleanliness: 0,
              communication: 0,
              location: 0,
              value: 0,
              accuracy: 0
            }
          });
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [propertyId]);

  const handleHelpful = async (reviewId: string) => {
    setReviews(prev => prev.map(review =>
      review.id === reviewId
        ? { ...review, helpful_count: review.helpful_count + 1 }
        : review
    ));
  };

  const toggleExpandReview = (reviewId: string) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const sortedAndFilteredReviews = React.useMemo(() => {
    let filtered = reviews;

    if (filterBy !== 'all') {
      switch (filterBy) {
        case 'featured':
          filtered = filtered.filter(r => r.is_featured);
          break;
        case 'verified':
          filtered = filtered.filter(r => r.is_verified);
          break;
        case 'with-photos':
          filtered = filtered.filter(r => r.photos.length > 0);
          break;
        case 'high-rating':
          filtered = filtered.filter(r => r.overall_rating >= 4);
          break;
      }
    }

    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'highest-rating':
        filtered.sort((a, b) => b.overall_rating - a.overall_rating);
        break;
      case 'most-helpful':
        filtered.sort((a, b) => b.helpful_count - a.helpful_count);
        break;
    }

    return filtered;
  }, [reviews, sortBy, filterBy]);

  const displayedReviews = showAllReviews ? sortedAndFilteredReviews : sortedAndFilteredReviews.slice(0, 3);

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
        <p className="text-gray-600">Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <section className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Guest Reviews</h2>
        <div className="flex items-center gap-2">
          <StarRating rating={stats.avg_rating} size="md" />
          <span className="text-lg font-semibold">{stats.avg_rating.toFixed(1)}</span>
          <span className="text-gray-600">({stats.total_reviews} reviews)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Rating Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <RatingBreakdown stats={stats} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="highest-rating">Highest rating</SelectItem>
                  <SelectItem value="most-helpful">Most helpful</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All reviews</SelectItem>
                  <SelectItem value="featured">Featured reviews</SelectItem>
                  <SelectItem value="verified">Verified guests</SelectItem>
                  <SelectItem value="with-photos">With photos</SelectItem>
                  <SelectItem value="high-rating">4+ stars</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-6">
            {displayedReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onHelpful={handleHelpful}
                showFullReview={expandedReviews.has(review.id)}
                onToggleFullReview={() => toggleExpandReview(review.id)}
              />
            ))}
          </div>

          {sortedAndFilteredReviews.length > 3 && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="min-w-[200px]"
              >
                {showAllReviews
                  ? 'Show fewer reviews'
                  : `Show all ${sortedAndFilteredReviews.length} reviews`
                }
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
