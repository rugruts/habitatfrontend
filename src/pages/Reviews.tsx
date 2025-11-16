import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Star, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Calendar, 
  Users, 
  MapPin, 
  ThumbsUp,
  MessageCircle,
  Building2,
  CheckCircle,
  Award
} from 'lucide-react';
import { supabaseHelpers } from '@/lib/supabase';

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
  status: 'pending' | 'approved' | 'rejected' | 'hidden';
  is_verified: boolean;
  is_featured: boolean;
  helpful_count: number;
  has_response: boolean;
  created_at: string;
  properties?: {
    name: string;
    slug: string;
  };
}

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'helpful'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [propertyFilter, setPropertyFilter] = useState<string>('all');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const reviewsData = await supabaseHelpers.getAllReviews();
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortReviews = useCallback(() => {
    let filtered = [...reviews];

    // Filter by rating
    if (ratingFilter !== null) {
      filtered = filtered.filter(review => review.overall_rating >= ratingFilter);
    }

    // Filter by property
    if (propertyFilter !== 'all') {
      filtered = filtered.filter(review => review.properties?.slug === propertyFilter);
    }

    // Sort reviews
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'rating':
          comparison = a.overall_rating - b.overall_rating;
          break;
        case 'helpful':
          comparison = a.helpful_count - b.helpful_count;
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredReviews(filtered);
  }, [reviews, sortBy, sortOrder, ratingFilter, propertyFilter]);

  useEffect(() => {
    filterAndSortReviews();
  }, [filterAndSortReviews]);

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPropertyNames = () => {
    const properties = reviews
      .map(review => review.properties?.name)
      .filter((name, index, arr) => name && arr.indexOf(name) === index);
    return properties;
  };

  if (loading) {
    return (
      <div className="mobile-main-content bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="mobile-container">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Loading reviews...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-main-content bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="mobile-container">
        {/* Hero Section */}
                 <div className="text-center mb-12">
           <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 shadow-lg overflow-hidden">
             <img 
               src="/favicon.svg" 
               alt="Habitat Lobby Logo" 
               className="w-full h-full object-cover"
             />
           </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Guest Reviews
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover what our guests say about their stay at Habitat Lobby. 
            Real experiences from real travelers.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{reviews.length}</div>
              <div className="text-sm text-muted-foreground">Total Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">
                {(reviews.reduce((acc, review) => acc + review.overall_rating, 0) / reviews.length).toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {reviews.filter(r => r.is_verified).length}
              </div>
              <div className="text-sm text-muted-foreground">Verified Stays</div>
            </div>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="bg-card rounded-3xl p-6 mb-8 shadow-lg border border-border/50">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Rating Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={ratingFilter || ''}
                  onChange={(e) => setRatingFilter(e.target.value ? Number(e.target.value) : null)}
                  className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
                >
                  <option value="">All Ratings</option>
                  <option value="5">5+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                </select>
              </div>

              {/* Property Filter */}
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <select
                  value={propertyFilter}
                  onChange={(e) => setPropertyFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
                >
                  <option value="all">All Properties</option>
                  {getPropertyNames().map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'rating' | 'helpful')}
                className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
              >
                <option value="date">Date</option>
                <option value="rating">Rating</option>
                <option value="helpful">Most Helpful</option>
              </select>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2"
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredReviews.map((review) => (
            <Card key={review.id} className="mobile-card-elevated mobile-card-interactive">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={review.guest_avatar_url} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {review.guest_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">{review.guest_name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {review.is_verified && (
                          <Badge variant="secondary" className="text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified Stay
                          </Badge>
                        )}
                                                 {review.is_featured && (
                           <Badge variant="secondary" className="text-xs bg-accent text-accent-foreground">
                             <Award className="w-3 h-3 mr-1" />
                             Featured
                           </Badge>
                         )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center gap-1 ${getRatingColor(review.overall_rating)}`}>
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-semibold">{review.overall_rating}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(review.created_at)}
                    </p>
                  </div>
                </div>

                {review.title && (
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {review.title}
                  </CardTitle>
                )}

                {review.properties?.name && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {review.properties.name}
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-foreground leading-relaxed">
                  {review.review_text}
                </p>

                {/* Rating Breakdown */}
                <div className="space-y-2">
                  {review.cleanliness_rating && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Cleanliness</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400" />
                        <span>{review.cleanliness_rating}</span>
                      </div>
                    </div>
                  )}
                  {review.communication_rating && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Communication</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400" />
                        <span>{review.communication_rating}</span>
                      </div>
                    </div>
                  )}
                  {review.location_rating && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Location</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400" />
                        <span>{review.location_rating}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stay Details */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-border/50">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{review.nights_stayed} nights</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{review.guest_count} guests</span>
                  </div>
                </div>

                {/* Pros and Cons */}
                {review.pros && (
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-green-800 mb-1">What they loved:</p>
                    <p className="text-sm text-green-700">{review.pros}</p>
                  </div>
                )}

                {review.cons && (
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-red-800 mb-1">What could be improved:</p>
                    <p className="text-sm text-red-700">{review.cons}</p>
                  </div>
                )}

                {/* Helpful Count */}
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{review.helpful_count} found this helpful</span>
                  </div>
                  {review.has_response && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MessageCircle className="w-4 h-4" />
                      <span>Host responded</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Reviews State */}
        {filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No reviews found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters to see more reviews.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
