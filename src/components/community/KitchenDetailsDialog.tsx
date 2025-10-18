import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, Clock, Phone, Star, DollarSign, Utensils, 
  Users, Heart, Loader2, ExternalLink 
} from "lucide-react";

interface Kitchen {
  id: string;
  name: string;
  location: string;
  address: string;
  timings: string;
  meal_types: string[];
  food_type: string;
  contact_phone: string;
  is_free: boolean;
  price_range: string;
  rating: number;
  total_reviews: number;
  latitude?: number;
  longitude?: number;
}

interface Review {
  id: string;
  rating: number;
  food_quality: number | null;
  hygiene_rating: number | null;
  comment: string | null;
  created_at: string;
  user_id: string;
}

interface KitchenDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kitchen: Kitchen | null;
}

export const KitchenDetailsDialog = ({ open, onOpenChange, kitchen }: KitchenDetailsDialogProps) => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    food_quality: 5,
    hygiene_rating: 5,
    comment: ""
  });

  useEffect(() => {
    if (kitchen && open) {
      fetchReviews();
    }
  }, [kitchen, open]);

  const fetchReviews = async () => {
    if (!kitchen) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('kitchen_reviews')
      .select('*')
      .eq('kitchen_id', kitchen.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching reviews:', error);
    } else if (data) {
      setReviews(data);
    }
    setLoading(false);
  };

  const handleSubmitReview = async () => {
    if (!kitchen) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to submit a review",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase
      .from('kitchen_reviews')
      .insert({
        kitchen_id: kitchen.id,
        user_id: user.id,
        rating: newReview.rating,
        food_quality: newReview.food_quality,
        hygiene_rating: newReview.hygiene_rating,
        comment: newReview.comment || null
      });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Your review has been submitted!"
      });
      setNewReview({ rating: 5, food_quality: 5, hygiene_rating: 5, comment: "" });
      fetchReviews();
    }
    setSubmitting(false);
  };

  const handleVolunteer = async () => {
    if (!kitchen) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to volunteer",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('kitchen_volunteers')
      .insert({
        kitchen_id: kitchen.id,
        user_id: user.id,
        role: 'volunteer'
      });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success!",
        description: "Thank you for volunteering! The kitchen will contact you soon."
      });
    }
  };

  const getDirectionsUrl = () => {
    if (!kitchen || !kitchen.latitude || !kitchen.longitude) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(kitchen?.address || kitchen?.location || '')}`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${kitchen.latitude},${kitchen.longitude}`;
  };

  if (!kitchen) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-2xl mb-2">{kitchen.name}</DialogTitle>
              <DialogDescription className="text-base">
                {kitchen.food_type}
              </DialogDescription>
            </div>
            <div className="flex flex-col gap-2 items-end">
              {kitchen.is_free ? (
                <Badge variant="default" className="text-sm">Free Meals</Badge>
              ) : (
                <Badge variant="secondary" className="text-sm">{kitchen.price_range}</Badge>
              )}
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold">{kitchen.rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">({kitchen.total_reviews} reviews)</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Key Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Timings</p>
                <p className="text-sm font-medium">{kitchen.timings}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-sm font-medium">{kitchen.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Contact</p>
                <p className="text-sm font-medium">{kitchen.contact_phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Price</p>
                <p className="text-sm font-medium">{kitchen.is_free ? 'Free' : kitchen.price_range}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Meal Types */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Utensils className="w-5 h-5" />
              Meals Served
            </h3>
            <div className="flex flex-wrap gap-2">
              {kitchen.meal_types?.map((meal) => (
                <Badge key={meal} variant="outline">{meal}</Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Address */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Address</h3>
            <p className="text-muted-foreground">{kitchen.address}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button className="flex-1" onClick={() => window.open(getDirectionsUrl(), '_blank')}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Get Directions
            </Button>
            <Button className="flex-1" variant="outline" onClick={handleVolunteer}>
              <Heart className="w-4 h-4 mr-2" />
              Volunteer
            </Button>
          </div>

          <Separator />

          {/* Reviews Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5" />
              Reviews & Ratings
            </h3>

            {/* Add Review Form */}
            <div className="bg-muted/30 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-3">Write a Review</h4>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs">Overall Rating</Label>
                    <select
                      value={newReview.rating}
                      onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                      className="w-full mt-1 p-2 border rounded"
                    >
                      {[5, 4, 3, 2, 1].map(n => (
                        <option key={n} value={n}>{n} ⭐</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs">Food Quality</Label>
                    <select
                      value={newReview.food_quality}
                      onChange={(e) => setNewReview({ ...newReview, food_quality: parseInt(e.target.value) })}
                      className="w-full mt-1 p-2 border rounded"
                    >
                      {[5, 4, 3, 2, 1].map(n => (
                        <option key={n} value={n}>{n} ⭐</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs">Hygiene</Label>
                    <select
                      value={newReview.hygiene_rating}
                      onChange={(e) => setNewReview({ ...newReview, hygiene_rating: parseInt(e.target.value) })}
                      className="w-full mt-1 p-2 border rounded"
                    >
                      {[5, 4, 3, 2, 1].map(n => (
                        <option key={n} value={n}>{n} ⭐</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Comment (Optional)</Label>
                  <Textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="Share your experience..."
                    rows={3}
                    maxLength={500}
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleSubmitReview} disabled={submitting} className="w-full">
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Review'
                  )}
                </Button>
              </div>
            </div>

            {/* Reviews List */}
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-semibold">{review.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {(review.food_quality || review.hygiene_rating) && (
                      <div className="flex gap-4 text-xs text-muted-foreground mb-2">
                        {review.food_quality && (
                          <span>Food: {review.food_quality}⭐</span>
                        )}
                        {review.hygiene_rating && (
                          <span>Hygiene: {review.hygiene_rating}⭐</span>
                        )}
                      </div>
                    )}
                    {review.comment && (
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No reviews yet. Be the first to review!
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};