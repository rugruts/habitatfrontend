import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CustomReviewCreator } from './CustomReviewCreator';
import { supabaseHelpers } from '@/lib/supabase';

// Import the CustomReview interface
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
import { 
  Star,
  MessageCircle,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  Flag,
  Reply,
  Calendar,
  Users,
  TrendingUp,
  Filter,
  Search,
  Download,
  BarChart3,
  Heart,
  Camera,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus
} from 'lucide-react';

interface Review {
  id: string;
  booking_id: string;
  property_id: string;
  guest_name: string;
  guest_email: string;
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
  source: 'direct' | 'email_link' | 'admin_created';
  language: string;
  is_verified: boolean;
  is_featured: boolean;
  admin_notes?: string;
  helpful_count: number;
  reported_count: number;
  photos: string[];
  has_response: boolean;
  created_at: string;
  updated_at: string;
  property?: {
    name: string;
    slug: string;
  };
  responses?: ReviewResponse[];
}

interface ReviewResponse {
  id: string;
  review_id: string;
  response_text: string;
  responder_name: string;
  responder_email?: string;
  responder_role: 'host' | 'admin' | 'manager';
  is_public: boolean;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

interface ReviewFilters {
  status: string;
  property: string;
  rating: string;
  dateRange: string;
  search: string;
  hasResponse: string;
  isFeatured: string;
}

interface ReviewStats {
  total_reviews: number;
  pending_reviews: number;
  approved_reviews: number;
  rejected_reviews: number;
  avg_rating: number;
  response_rate: number;
  featured_reviews: number;
}

const StarDisplay: React.FC<{ rating: number; size?: 'sm' | 'md' | 'lg' }> = ({ 
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
      <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  );
};

const ReviewCard: React.FC<{
  review: Review;
  onStatusChange: (reviewId: string, status: string) => void;
  onToggleFeatured: (reviewId: string) => void;
  onAddResponse: (reviewId: string) => void;
  onViewDetails: (review: Review) => void;
}> = ({ review, onStatusChange, onToggleFeatured, onAddResponse, onViewDetails }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'hidden': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'hidden': return <Eye className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              {review.guest_avatar_url ? (
                <img 
                  src={review.guest_avatar_url} 
                  alt={review.guest_name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium">
                  {review.guest_name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium">{review.guest_name}</h3>
                {review.is_verified && (
                  <Badge variant="secondary" className="text-xs">
                    <Check className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {review.is_featured && (
                  <Badge variant="default" className="text-xs bg-purple-100 text-purple-800">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{review.property?.name}</span>
                <span>•</span>
                <span>{new Date(review.stay_date).toLocaleDateString()}</span>
                <span>•</span>
                <span>{review.nights_stayed} nights</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${getStatusColor(review.status)} flex items-center gap-1`}>
              {getStatusIcon(review.status)}
              {review.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Rating */}
        <div className="flex items-center justify-between">
          <StarDisplay rating={review.overall_rating} size="md" />
          <div className="text-sm text-gray-500">
            {new Date(review.created_at).toLocaleDateString()}
          </div>
        </div>

        {/* Review Content */}
        <div>
          {review.title && (
            <h4 className="font-medium mb-2">{review.title}</h4>
          )}
          <p className="text-gray-700 line-clamp-3">{review.review_text}</p>
        </div>

        {/* Photos */}
        {review.photos.length > 0 && (
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {review.photos.length} photo{review.photos.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Engagement */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <span>{review.helpful_count} helpful</span>
          </div>
          {review.reported_count > 0 && (
            <div className="flex items-center gap-1 text-red-600">
              <Flag className="h-4 w-4" />
              <span>{review.reported_count} reports</span>
            </div>
          )}
          {review.has_response && (
            <div className="flex items-center gap-1 text-blue-600">
              <Reply className="h-4 w-4" />
              <span>Responded</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(review)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          
          {review.status === 'pending' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusChange(review.id, 'approved')}
                className="text-green-600 hover:text-green-700"
              >
                <Check className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusChange(review.id, 'rejected')}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleFeatured(review.id)}
            className={review.is_featured ? 'text-purple-600' : ''}
          >
            <Star className="h-4 w-4 mr-1" />
            {review.is_featured ? 'Unfeature' : 'Feature'}
          </Button>
          
          {!review.has_response && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddResponse(review.id)}
            >
              <Reply className="h-4 w-4 mr-1" />
              Respond
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const ReviewManagement: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    total_reviews: 0,
    pending_reviews: 0,
    approved_reviews: 0,
    rejected_reviews: 0,
    avg_rating: 0,
    response_rate: 0,
    featured_reviews: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [showCustomReviewDialog, setShowCustomReviewDialog] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [filters, setFilters] = useState<ReviewFilters>({
    status: 'all',
    property: 'all',
    rating: 'all',
    dateRange: 'all',
    search: '',
    hasResponse: 'all',
    isFeatured: 'all'
  });

  // Fetch reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);

      try {
        // TODO: Replace with actual API call
        // const response = await supabaseHelpers.getAllReviews(filters);

        // For now, start with empty state
        const fetchedReviews: Review[] = [];

        setReviews(fetchedReviews);
        setStats({
          total_reviews: fetchedReviews.length,
          pending_reviews: fetchedReviews.filter(r => r.status === 'pending').length,
          approved_reviews: fetchedReviews.filter(r => r.status === 'approved').length,
          rejected_reviews: fetchedReviews.filter(r => r.status === 'rejected').length,
          avg_rating: fetchedReviews.length > 0 ? fetchedReviews.reduce((sum, r) => sum + r.overall_rating, 0) / fetchedReviews.length : 0,
          response_rate: fetchedReviews.length > 0 ? (fetchedReviews.filter(r => r.has_response).length / fetchedReviews.length) * 100 : 0,
          featured_reviews: fetchedReviews.filter(r => r.is_featured).length
        });
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [filters]);

  const handleStatusChange = async (reviewId: string, status: string) => {
    // TODO: Implement API call
    setReviews(prev => prev.map(review =>
      review.id === reviewId ? { ...review, status: status as Review['status'] } : review
    ));
  };

  const handleToggleFeatured = async (reviewId: string) => {
    // TODO: Implement API call
    setReviews(prev => prev.map(review => 
      review.id === reviewId ? { ...review, is_featured: !review.is_featured } : review
    ));
  };

  const handleAddResponse = (reviewId: string) => {
    const review = reviews.find(r => r.id === reviewId);
    if (review) {
      setSelectedReview(review);
      setShowResponseDialog(true);
    }
  };

  const handleSubmitResponse = async () => {
    if (!selectedReview || !responseText.trim()) return;

    // TODO: Implement API call to add response
    setReviews(prev => prev.map(review =>
      review.id === selectedReview.id ? { ...review, has_response: true } : review
    ));

    setShowResponseDialog(false);
    setResponseText('');
    setSelectedReview(null);
  };

  const handleCreateCustomReview = async (customReview: CustomReview) => {
    try {
      // Create review using the API
      const createdReview = await supabaseHelpers.createReview({
        booking_id: 'custom-' + Date.now(),
        property_id: customReview.property_id,
        guest_name: customReview.guest_name,
        guest_email: customReview.guest_email,
        guest_avatar_url: customReview.guest_avatar_url,
        overall_rating: customReview.overall_rating,
        cleanliness_rating: customReview.cleanliness_rating,
        communication_rating: customReview.communication_rating,
        location_rating: customReview.location_rating,
        value_rating: customReview.value_rating,
        accuracy_rating: customReview.accuracy_rating,
        title: customReview.title,
        review_text: customReview.review_text,
        pros: customReview.pros,
        cons: customReview.cons,
        stay_date: customReview.stay_date,
        nights_stayed: customReview.nights_stayed,
        guest_count: customReview.guest_count,
        trip_type: customReview.trip_type,
        status: customReview.status,
        is_verified: customReview.is_verified,
        is_featured: customReview.is_featured,
        photos: [], // TODO: Handle photo upload
        source: 'admin_created'
      });

      // Add to local state
      const newReview: Review = {
        ...createdReview,
        booking_id: createdReview.booking_id || 'custom-' + Date.now(),
        property: {
          name: 'Property Name', // TODO: Get from properties list
          slug: 'property-slug'
        },
        responses: [],
        source: 'admin_created',
        language: 'en',
        reported_count: 0,
        updated_at: new Date().toISOString()
      };

      setReviews(prev => [newReview, ...prev]);

      // Update stats
      setStats(prev => ({
        ...prev,
        total_reviews: prev.total_reviews + 1,
        approved_reviews: customReview.status === 'approved' ? prev.approved_reviews + 1 : prev.approved_reviews,
        pending_reviews: customReview.status === 'pending' ? prev.pending_reviews + 1 : prev.pending_reviews,
        featured_reviews: customReview.is_featured ? prev.featured_reviews + 1 : prev.featured_reviews
      }));
    } catch (error) {
      console.error('Error creating custom review:', error);
      // TODO: Show error toast
    }
  };

  const filteredReviews = reviews.filter(review => {
    if (filters.status !== 'all' && review.status !== filters.status) return false;
    if (filters.hasResponse !== 'all') {
      const hasResponse = filters.hasResponse === 'true';
      if (review.has_response !== hasResponse) return false;
    }
    if (filters.isFeatured !== 'all') {
      const isFeatured = filters.isFeatured === 'true';
      if (review.is_featured !== isFeatured) return false;
    }
    if (filters.search && !review.guest_name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !review.review_text.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Review Management</h1>
          <p className="text-gray-600">Manage guest reviews and responses</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowCustomReviewDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Custom Review
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold">{stats.total_reviews}</p>
              </div>
              <MessageCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{stats.avg_rating.toFixed(1)}</p>
                  <StarDisplay rating={stats.avg_rating} size="sm" />
                </div>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending_reviews}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold text-green-600">{stats.response_rate.toFixed(0)}%</p>
              </div>
              <Reply className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="hidden">Hidden</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="response-filter">Response Status</Label>
              <Select
                value={filters.hasResponse}
                onValueChange={(value) => setFilters(prev => ({ ...prev, hasResponse: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="true">Has Response</SelectItem>
                  <SelectItem value="false">No Response</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="featured-filter">Featured</Label>
              <Select
                value={filters.isFeatured}
                onValueChange={(value) => setFilters(prev => ({ ...prev, isFeatured: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="true">Featured</SelectItem>
                  <SelectItem value="false">Not Featured</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search reviews..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Reviews ({filteredReviews.length})
          </h2>
        </div>

        {filteredReviews.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
              <p className="text-gray-600">
                {filters.search || filters.status !== 'all'
                  ? 'Try adjusting your filters to see more reviews.'
                  : 'Reviews will appear here once guests start submitting them.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onStatusChange={handleStatusChange}
                onToggleFeatured={handleToggleFeatured}
                onAddResponse={handleAddResponse}
                onViewDetails={setSelectedReview}
              />
            ))}
          </div>
        )}
      </div>

      {/* Response Dialog */}
      <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Respond to Review</DialogTitle>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-4">
              {/* Review Summary */}
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {selectedReview.guest_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{selectedReview.guest_name}</h4>
                        <StarDisplay rating={selectedReview.overall_rating} size="sm" />
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {selectedReview.review_text}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Response Form */}
              <div>
                <Label htmlFor="response">Your Response</Label>
                <Textarea
                  id="response"
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Thank the guest and address any concerns..."
                  className="min-h-[120px]"
                  maxLength={1000}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {responseText.length}/1000 characters
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowResponseDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitResponse}
                  disabled={!responseText.trim()}
                >
                  <Reply className="h-4 w-4 mr-2" />
                  Send Response
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Custom Review Creator Dialog */}
      <CustomReviewCreator
        isOpen={showCustomReviewDialog}
        onClose={() => setShowCustomReviewDialog(false)}
        onSave={handleCreateCustomReview}
        properties={[
          { id: 'property-1', name: 'Apartment 1 - Habitat Lobby' },
          { id: 'property-2', name: 'Apartment 2 - Habitat Lobby' },
          // TODO: Fetch actual properties from API
        ]}
      />
    </div>
  );
};
